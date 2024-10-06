/** @format */

import { useState, useEffect } from "react"
import PocketBase from "pocketbase"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const pb = new PocketBase("https://tasbih.pockethost.io")

export default function AdminPanel() {
	const [questions, setQuestions] = useState([])
	const [newQuestion, setNewQuestion] = useState({
		question: "",
		a: "",
		b: "",
		c: "",
		d: "",
		answer: "",
	})
	const [editingId, setEditingId] = useState(null)

	useEffect(() => {
		fetchQuestions()
	}, [])

	const fetchQuestions = async () => {
		try {
			const records = await pb.collection("questions").getList(1, 50, {
				sort: "-created",
			})
			setQuestions(records.items)
		} catch (error) {
			console.error("Error fetching questions:", error)
			toast.error("Суроолорду жүктөөдө ката кетти")
		}
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setNewQuestion(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			if (editingId) {
				await pb.collection("questions").update(editingId, newQuestion)
				toast.success("Суроо ийгиликтүү жаңыртылды")
			} else {
				await pb.collection("questions").create(newQuestion)
				toast.success("Жаңы суроо ийгиликтүү кошулду")
			}
			setNewQuestion({ question: "", a: "", b: "", c: "", d: "", answer: "" })
			setEditingId(null)
			fetchQuestions()
		} catch (error) {
			console.error("Error submitting question:", error)
			toast.error("Суроону сактоодо ката кетти")
		}
	}

	const handleEdit = question => {
		setNewQuestion(question)
		setEditingId(question.id)
		toast.info("Суроону өзгөртүү режими")
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const handleDelete = async id => {
		if (window.confirm("Бул суроону өчүрүүнү каалайсызбы?")) {
			try {
				await pb.collection("questions").delete(id)
				fetchQuestions()
				toast.success("Суроо ийгиликтүү өчүрүлдү")
			} catch (error) {
				console.error("Error deleting question:", error)
				toast.error("Суроону өчүрүүдө ката кетти")
			}
		}
	}

	return (
		<div className="container mx-auto p-4 max-w-4xl">
			<ToastContainer position="top-right" autoClose={3000} />
			<h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
				Суроолорду башкаруу
			</h1>

			<form
				onSubmit={handleSubmit}
				className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6"
			>
				<div className="mb-4">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="question"
					>
						Суроо
					</label>
					<textarea
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="question"
						name="question"
						value={newQuestion.question}
						onChange={handleInputChange}
						required
						rows="3"
						style={{ resize: "vertical", minHeight: "60px" }}
					/>
				</div>
				<div className="flex flex-col  gap-4 mb-4">
					{["a", "b", "c", "d"].map(option => (
						<div key={option}>
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor={option}
							>
								Вариант {option.toUpperCase()}
							</label>
							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
								id={option}
								name={option}
								value={newQuestion[option]}
								onChange={handleInputChange}
								required
							/>
						</div>
					))}
				</div>
				<div className="mb-6">
					<label
						className="block text-gray-700 text-sm font-bold mb-2"
						htmlFor="answer"
					>
						Туура жооп
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="answer"
						name="answer"
						value={newQuestion.answer}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="flex items-center justify-center">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
						type="submit"
					>
						{editingId ? "Жаңыртуу" : "Кошуу"}
					</button>
				</div>
			</form>

			<div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
				<h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
					Суроолор тизмеси
				</h2>
				{questions.map(q => (
					<div
						key={q.id}
						className="mb-6 p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
					>
						<p className="font-bold mb-2 text-lg">{q.question}</p>
						<div className="flex flex-wrap gap-2 mb-2">
							{["a", "b", "c", "d"].map(option => (
								<p
									key={option}
									className={`px-3 py-1 rounded ${
										q.answer === q[option]
											? "bg-green-100 text-green-800 font-semibold"
											: "bg-gray-100"
									}`}
								>
									{option.toUpperCase()}: {q[option]}
								</p>
							))}
						</div>
						<p className="mt-2 font-bold text-green-600">
							<span className="text-blue-600">Туура жооп:</span> {q.answer}
						</p>
						<div className="mt-3 flex justify-end space-x-2">
							<button
								onClick={() => handleEdit(q)}
								className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded transition-colors duration-200"
							>
								Өзгөртүү
							</button>
							<button
								onClick={() => handleDelete(q.id)}
								className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded transition-colors duration-200"
							>
								Өчүрүү
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
