/** @format */

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAccess } from "../../redux/features/question/questionSlice"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import PocketBase from "pocketbase"

export default function Results() {
	const dispatch = useDispatch()
	const { loading, isAccess, resultShowingTime } = useSelector(
		state => state.questions
	)
	const auth = useAuthUser()
	const [results, setResults] = useState(null)

	useEffect(() => {
		dispatch(getAccess())

		const fetchResults = async () => {
			try {
				const pb = new PocketBase("https://tasbih.pockethost.io")
				const records = await pb.collection("results3").getList(1, 50, {
					filter: `student_id="${auth.userId}"`,
				})

				if (records.items.length > 0) {
					setResults(records.items[0].oneStudentJsonResult)
				}
			} catch (error) {
				console.error("Error fetching results:", error)
			}
		}

		fetchResults()
	}, [dispatch, auth.userId])

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl text-center p-4 bg-white shadow rounded">
					Жүктөлүүдө...
				</p>
			</div>
		)
	}

	if (!isAccess) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl text-center p-4 bg-white shadow rounded">
					Жыйынтыктар саат {resultShowingTime?.slice(10, 16)} көрсөтүлөт. Кайра
					кайрылыңыз.
				</p>
			</div>
		)
	}

	if (!results) {
		return (
			<div className="flex items-center justify-center h-screen bg-gray-100">
				<p className="text-xl text-center p-4 bg-white shadow rounded">
					Жыйынтыктар табылган жок, же тест тапшыра элексиз
				</p>
			</div>
		)
	}

	const { result, resultOfOneStudent } = results
	const { correctAnswers, wrong_answers, total_time_spent } = result
	const totalQuestions = resultOfOneStudent.length
	const correctPercentage = (correctAnswers / totalQuestions) * 100

	return (
		<div className="container mx-auto  min-h-screen">
			<h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
				Сиздин тесттин жыйынтыгы
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-1">
					<div className="bg-white p-6 rounded-xl shadow-2xl">
						<h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
							Жыйынтык
						</h2>
						<div className="flex justify-center mb-6">
							<div className="relative w-48 h-48">
								<svg
									className="w-full h-full transform -rotate-90"
									viewBox="0 0 100 100"
								>
									<circle
										cx="50"
										cy="50"
										r="45"
										fill="none"
										stroke="red"
										strokeWidth="10"
									/>
									<circle
										cx="50"
										cy="50"
										r="45"
										fill="none"
										stroke="#4CAF50"
										strokeWidth="10"
										strokeDasharray={`${correctPercentage * 2.83}, 283`}
									/>
								</svg>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
									<div className="text-4xl font-bold text-gray-800">
										{correctPercentage.toFixed(0)}%
									</div>
									<div className="text-sm text-gray-600">Туура</div>
								</div>
							</div>
						</div>
						<div className="flex justify-between text-center">
							<div className="bg-green-100 p-4 rounded-lg flex-1 mr-2">
								<div className="text-3xl font-bold text-green-600">
									{correctAnswers}
								</div>
								<div className="text-sm text-green-800">Туура</div>
							</div>
							<div className="bg-red-100 p-4 rounded-lg flex-1 ml-2">
								<div className="text-3xl font-bold text-red-600">
									{wrong_answers}
								</div>
								<div className="text-sm text-red-800">Ката</div>
							</div>
						</div>
						<div className="mt-4 text-center">
							<div className="text-lg font-semibold text-gray-700">
								Жалпы убакыт: {total_time_spent} секунд
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-2">
					<div className="bg-white p-2 rounded-xl shadow-lg">
						<h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
							Толук маалымат
						</h2>
						<div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
							{resultOfOneStudent.map((result, idx) => (
								<div
									key={idx}
									className={`p-2 rounded-xl ${
										result.is_answer_correct ? "bg-green-50" : "bg-red-50"
									} border-2 ${
										result.is_answer_correct
											? "border-green-200"
											: "border-red-200"
									}`}
								>
									<p className="font-semibold text-lg mb-4 text-gray-800">
										{idx + 1}. {result.question.question}
									</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{["a", "b", "c", "d"].map(option => (
											<div
												key={option}
												className={`p-2 rounded-lg transition-all duration-200 ${
													result.choosen_answer === result.question[option]
														? "bg-blue-200 border-blue-500"
														: result.question.answer === result.question[option]
														? "bg-green-100 border-green-500"
														: "bg-white border-gray-300"
												} border-2`}
											>
												<span className="font-bold mr-2">
													{option.toUpperCase()})
												</span>
												{result.question[option]}
												{result.choosen_answer === result.question[option] && (
													<span className="ml-2 font-semibold text-blue-700">
														← Сиздин жооп
													</span>
												)}
												{result.question.answer === result.question[option] && (
													<span className="ml-2 font-semibold text-green-700">
														✓ Туура
													</span>
												)}
											</div>
										))}
									</div>
									<div className="mt-4 text-right text-gray-600">
										Убакыт: {result.time_spent} секунд
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
