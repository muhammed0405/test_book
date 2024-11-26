/** @format */

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import PocketBase from "pocketbase"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { Link } from "react-router-dom"
import { getQuestions } from "../redux/features/question/questionSlice"

const Questions = () => {
	const questions = useSelector(state => state.questions.questions)
	const dispatch = useDispatch()
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [answers, setAnswers] = useState({})
	const [timeLeft, setTimeLeft] = useState(60)
	const [quizFinished, setQuizFinished] = useState(false)
	const [quizResults, setQuizResults] = useState(null)
	const [questionStartTime, setQuestionStartTime] = useState(Date.now())
	const [totalTimeSpent, setTotalTimeSpent] = useState(0)
	const auth = useAuthUser()
	const pb = new PocketBase("https://tasbih.pockethost.io")

	useEffect(() => {
		const savedState = JSON.parse(localStorage.getItem("quizState"))
		if (savedState) {
			setCurrentQuestionIndex(savedState.currentQuestionIndex)
			setAnswers(savedState.answers)
			setTimeLeft(savedState.timeLeft)
			setTotalTimeSpent(savedState.totalTimeSpent)
			setQuestionStartTime(Date.now())
		}
	}, [])

	useEffect(() => {
		// Only start timer if questions are loaded and quiz is not finished
		if (questions.length > 0 && !quizFinished) {
			const timer = setInterval(() => {
				setTimeLeft(prevTime => {
					if (prevTime === 0) {
						// Automatically move to next question when time runs out
						handleAutoNextQuestion()
						return 60
					}
					return prevTime - 1
				})
			}, 1000)

			return () => clearInterval(timer)
		}
	}, [currentQuestionIndex, questions, quizFinished])

	useEffect(() => {
		if (questions.length > 0) {
			const stateToSave = {
				currentQuestionIndex,
				answers,
				timeLeft,
				totalTimeSpent,
			}
			localStorage.setItem("quizState", JSON.stringify(stateToSave))
		}
	}, [currentQuestionIndex, answers, timeLeft, totalTimeSpent, questions])

	useEffect(() => {
		// Dispatch questions fetch
		const questionsPromise = dispatch(getQuestions())

		// Fetch user record
		const fetchUserById = async () => {
			try {
				// Directly use getFirstListItem without assuming .items array
				const user = await pb
					.collection("results3")
					.getFirstListItem(`student_id = "${auth.userId}"`)

				// Check if user record exists
				const isFinished = !!user
				setQuizFinished(isFinished)
				localStorage.setItem("quizFinished", JSON.stringify(isFinished))
			} catch (error) {
				// Handle 404 specifically
				if (error.status === 404) {
					setQuizFinished(false)
					localStorage.setItem("quizFinished", JSON.stringify(false))
				} else {
					console.error("Error fetching user:", error)
				}
			}
		}

		// Use Promise.all to handle both operations
		Promise.all([questionsPromise, fetchUserById()])
	}, [auth.userId])

	const handleAnswer = answer => {
		const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
		const updatedAnswers = {
			...answers,
			[currentQuestionIndex]: {
				choosen_answer: answer,
				time_spent: timeSpent,
				is_answer_correct: answer === questions[currentQuestionIndex].answer,
				id: Math.random().toString(36).substr(2, 9),
			},
		}
		setAnswers(updatedAnswers)
		setTotalTimeSpent(prevTotal => prevTotal + timeSpent)
	}

	const handleAutoNextQuestion = () => {
		// Automatically move to next question when time runs out
		// If no answer was given, treat it as a null/incorrect answer
		if (!answers[currentQuestionIndex]) {
			handleAnswer(null)
		}
		goToNextQuestion()
	}

	const goToNextQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(prevIndex => prevIndex + 1)
			setTimeLeft(60)
			setQuestionStartTime(Date.now())
		} else {
			finishQuiz()
		}
	}

	const handleNextQuestion = () => {
		if (!answers[currentQuestionIndex]) {
			alert("Сураныч суроого жооп бериңиз.")
			return
		}
		goToNextQuestion()
	}

	const finishQuiz = async () => {
		if (!answers[currentQuestionIndex]) {
			alert("Сураныч тестти бүтүрүү үчүн суроого жооп бериңиз.")
			return
		}

		setQuizFinished(true)
		const results = calculateResults()
		setQuizResults(results)

		localStorage.removeItem("quizState") // Clear the saved state

		try {
			await pb.collection("results3").create({
				oneStudentJsonResult: results,
				student_id: auth.userId,
			})
			console.log("Quiz results saved successfully")
			localStorage.setItem(
				"testId",
				JSON.stringify({
					questionId: questions[0].id,
					isFinished: true,
				})
			)

			const records = await pb.collection("results3").getFullList({
				sort: "-created",
			})

			console.log("resFromBack", records)
		} catch (error) {
			console.error("Error saving quiz results:", error)
		}
	}

	const calculateResults = () => {
		let correctAnswers = 0
		let wrongAnswers = 0

		const resultOfOneStudent = questions.map((question, index) => {
			const answer = answers[index] || {
				choosen_answer: null,
				time_spent: 60, // Assuming max time if unanswered
				is_answer_correct: false,
				id: Math.random().toString(36).substr(2, 9),
			}

			if (answer.is_answer_correct) {
				correctAnswers++
			} else {
				wrongAnswers++
			}

			return {
				student_id: auth.userId,
				student_name: auth.student_name,
				question: question,
				choosen_answer: answer.choosen_answer,
				time_spent: answer.time_spent,
				is_answer_correct: answer.is_answer_correct,
				id: answer.id,
			}
		})

		return {
			resultOfOneStudent,
			result: {
				correctAnswers,
				wrong_answers: wrongAnswers,
				total_time_spent: totalTimeSpent,
			},
		}
	}

	// If no questions are loaded
	if (questions.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-2xl font-bold text-blue-600">
					Суроолор жүктөлүүдө...
				</div>
			</div>
		)
	}

	// If quiz is finished
	if (quizFinished) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-blue-100">
				<div className="bg-white p-8 rounded-lg shadow-lg text-center">
					<h2 className="text-3xl font-bold text-blue-600 mb-4">Тест бүттү!</h2>
					<p className="text-xl text-gray-700">
						Сиздин жыйынтык жөнөтүлдү. Сиз жыйынтыкты кийинчерээк көрө аласыз.{" "}
					</p>
					<br />
					<p className="text-xl text-gray-700">
						Жыйынтыкты көрүү үчүн жогоруудагы баскычты басыныз{" "}
						<span className="text-blue-500 ">☰</span>
					</p>

					<div className="mt-8 flex flex-col md:flex-row justify-center gap-5 ">
						<Link to="/">
							<button className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-600 transition duration-300">
								Башкы бетке баруу
							</button>
						</Link>
						<Link to="/results">
							<button className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-600 transition duration-300">
								Жоопторду көрүү
							</button>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// Current question handling
	const currentQuestion = questions[currentQuestionIndex]
	if (!currentQuestion) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="text-2xl font-bold text-blue-600">Жүктөлүүдө...</div>
			</div>
		)
	}

	const options = [
		{ value: currentQuestion.a, label: currentQuestion.a },
		{ value: currentQuestion.b, label: currentQuestion.b },
		{ value: currentQuestion.c, label: currentQuestion.c },
		{ value: currentQuestion.d, label: currentQuestion.d },
	]

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
			<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-blue-600">
						Суроо {currentQuestionIndex + 1} / {questions.length}
					</h2>
					<div className="w-20 h-20 relative">
						<svg className="w-full h-full" viewBox="0 0 100 100">
							<circle
								className="text-gray-200 stroke-current"
								strokeWidth="10"
								cx="50"
								cy="50"
								r="40"
								fill="transparent"
							></circle>
							<circle
								className="text-blue-600 progress-ring stroke-current"
								strokeWidth="10"
								strokeLinecap="round"
								cx="50"
								cy="50"
								r="40"
								fill="transparent"
								strokeDasharray="251.2"
								strokeDashoffset={251.2 * (1 - timeLeft / 60)}
								transform="rotate(-90 50 50)"
							></circle>
						</svg>
						<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
							<span className="text-xl font-bold text-blue-600">
								{timeLeft}s
							</span>
						</div>
					</div>
				</div>
				<p className="text-xl mb-6 text-gray-700">{currentQuestion.question}</p>
				<div className="space-y-4">
					{options.map((option, index) => (
						<label
							key={index}
							className="flex items-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-300"
						>
							<input
								required
								type="radio"
								name="answer"
								value={option.value}
								checked={
									answers[currentQuestionIndex]?.choosen_answer === option.value
								}
								onChange={() => handleAnswer(option.value)}
								className="form-radio h-5 w-5 text-blue-600"
							/>
							<span className="ml-4 text-lg text-gray-700">{option.label}</span>
						</label>
					))}
				</div>
				<div className="mt-8 flex justify-end">
					<button
						onClick={handleNextQuestion}
						className="bg-blue-500 text-white px-6 py-2 rounded-full text-lg hover:bg-blue-600 transition duration-300"
						disabled={!answers[currentQuestionIndex]}
					>
						{currentQuestionIndex === questions.length - 1
							? "Тессти бүтүрүү"
							: "Кийинки суроо"}
					</button>
				</div>
			</div>
		</div>
	)
}

export default Questions
