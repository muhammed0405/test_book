/** @format */

import React, { useEffect, useRef, useState, useCallback } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { useDispatch, useSelector } from "react-redux"
import {
	getQuestions,
	submitAnswer,
} from "../../redux/features/question/questionSlice"
import { useTimer } from "./useTimer"

export default function Dashboard() {
	const variants = ["А", "Б", "В", "Г"]
	const auth = useAuthUser()
	const dispatch = useDispatch()
	const { questions, loading, error } = useSelector(state => state.questions)
	const [questionNumber, setQuestionNumber] = useState(1)
	const [selectedAnswer, setSelectedAnswer] = useState("")
	const { timeLeft, startTimer, stopTimer, resetTimer } = useTimer(60)
	const [isFinished, setIsFinished] = useState(false)
	const fetchOnce = useRef(false)

	useEffect(() => {
		const savedQuestionNumber = localStorage.getItem("questionNumber")
		const savedIsFinished = localStorage.getItem("isFinished")

		if (savedQuestionNumber) {
			setQuestionNumber(parseInt(savedQuestionNumber, 10))
		}

		if (savedIsFinished === "true") {
			setIsFinished(true)
		}

		if (!fetchOnce.current && !isFinished) {
			dispatch(getQuestions())
			fetchOnce.current = true
		}
	}, [dispatch, isFinished])

	useEffect(() => {
		if (questions.length > 0 && !isFinished) {
			startTimer()
		}
	}, [questions, questionNumber, startTimer, isFinished])

	useEffect(() => {
		if (timeLeft === 0 && questions.length > 0 && !isFinished) {
			handleNextQuestion()
		}
	}, [timeLeft, questions, isFinished])

	const handleAnswerSelect = useCallback(answer => {
		setSelectedAnswer(answer)
	}, [])

	const checkAnswer = useCallback(
		answer => {
			const currentQuestion = questions[questionNumber - 1]
			if (currentQuestion) {
				const isCorrect = currentQuestion.answer === currentQuestion[answer]
				dispatch(
					submitAnswer({
						student_id: auth?.userId,
						questionId: currentQuestion.id,
						answer: answer,
						isCorrect: isCorrect,
						timeSpent: 60 - timeLeft,
						question: currentQuestion,
						student_name: auth?.student_name,
					})
				)
			}
		},
		[auth, dispatch, questionNumber, questions, timeLeft]
	)

	const handleNextQuestion = useCallback(() => {
		if (selectedAnswer) {
			checkAnswer(selectedAnswer)
		}

		if (questionNumber < questions.length) {
			const nextQuestionNumber = questionNumber + 1
			setQuestionNumber(nextQuestionNumber)
			localStorage.setItem("questionNumber", nextQuestionNumber.toString())
			setSelectedAnswer("")
			resetTimer()
		} else {
			stopTimer()
			localStorage.setItem("isFinished", "true")
			localStorage.setItem("questionNumber", "1")
			setIsFinished(true)
		}
	}, [
		selectedAnswer,
		checkAnswer,
		questionNumber,
		questions.length,
		resetTimer,
		stopTimer,
	])

	if (isFinished) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl text-center p-4 bg-white shadow rounded">
					Тестти ийгилүктүү тапшырдыңыз. Жыйынтыкты күтүңүз.
				</p>
			</div>
		)
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl">Жүктөлүүдө...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl text-red-500">Ката: {error}</p>
			</div>
		)
	}

	if (questions.length === 0) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl">Суроолор жок.</p>
			</div>
		)
	}

	const currentQuestion = questions[questionNumber - 1]
	if (!currentQuestion) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl">Суроо жүктөлүүдө...</p>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto p-4 bg-gray-100 min-h-screen">
			<h1 className="text-2xl md:text-3xl mb-4 text-center">
				Кош келдиңиз{" "}
				<span className="font-bold text-orange-500">{auth?.student_name}</span>!
			</h1>

			<div className="mb-6 bg-white shadow rounded p-4">
				<h2 className="text-xl font-bold mb-2">
					{currentQuestion.question_title}
				</h2>
				<p
					className={`text-lg ${
						timeLeft <= 10 ? "text-red-500" : ""
					} font-semibold`}
				>
					Калган убакыт: {timeLeft} секунд
				</p>
			</div>

			<div className="space-y-4 bg-white shadow rounded p-4 mb-6">
				<p className="text-lg mb-4">{currentQuestion.question}</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{["a", "b", "c", "d"].map((option, idx) => (
						<label
							key={option}
							className={`flex items-center space-x-2 border-2 p-3 rounded cursor-pointer transition-colors duration-200
                ${
									selectedAnswer === option
										? "border-blue-500 bg-blue-100"
										: "border-gray-300 hover:border-blue-300"
								}`}
						>
							<input
								type="radio"
								name="answer"
								value={option}
								checked={selectedAnswer === option}
								onChange={() => handleAnswerSelect(option)}
								className="form-radio text-blue-600"
							/>
							<span className="text-lg">
								{variants[idx]}) {currentQuestion[option]}
							</span>
						</label>
					))}
				</div>
			</div>

			<button
				onClick={handleNextQuestion}
				className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg font-semibold"
			>
				Кийинки суроо
			</button>
		</div>
	)
}
