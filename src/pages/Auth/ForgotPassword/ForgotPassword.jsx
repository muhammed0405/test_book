/** @format */

import { useDispatch, useSelector } from "react-redux"
import { forgotPassword } from "../../../redux/features/auth/authSlice"
import { useState } from "react"
import { RiLockPasswordFill } from "react-icons/ri"

export default function ForgotPassword() {
	const dispatch = useDispatch()
	const [email, setEmail] = useState("")
	const [isSubmitted, setIsSubmitted] = useState(false)
	const error = useSelector(state => state.auth.error)

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await dispatch(forgotPassword({ email })).unwrap()
			setIsSubmitted(true)
		} catch (err) {
			console.error("Сыр сөздү жөнөтүү катасы:", err)
		}
	}

	return (
		<div className="py-10 max-w-[1000px] mx-auto">
			<RiLockPasswordFill style={{
				margin: "0 auto",
				fontSize: "100px",

			}}/>
			<h1 className="text-3xl font-bold text-center my-4 text-blue-600">
				Сыр сөздү калыбына келтирүү
			</h1>
			<p className="text-lg mb-6 text-gray-600 text-center">
				Сыр сөзүңүздү унуттуңузбу? Тынчсызданбаңыз! Биз сизге жардам беребиз. <br />
				Төмөндөгү кадамдарды аткарыңыз:
			</p>
			<ol className="list-decimal list-inside mb-6 text-gray-700 pl-10">
				<li className="mb-2">Google почтаңызды жазыңыз</li>
				<li className="mb-2">Биз сизге атайын шилтеме жөнөтөбүз</li>
				<li className="mb-2">Почтаңызга кирип, шилтемени басыңыз</li>
				<li>Жаңы сыр сөз коюңуз</li>
			</ol>
			{!isSubmitted ? (
				<form
					onSubmit={handleSubmit}
					className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
				>
					{error && <div className="text-red-500 mb-4">{error}</div>}
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-gray-700 text-sm font-bold mb-2"
						>
							Google почтаңыз:
						</label>
						<input
							id="email"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							type="email"
							placeholder="Мисалы: menin.pochtam@gmail.com"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
						/>
					</div>
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
						type="submit"
					>
						Шилтеме жөнөтүү
					</button>
				</form>
			) : (
				<div
					className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
					role="alert"
				>
					<p className="font-bold">Ийгиликтүү жөнөтүлдү!</p>
					<p>
						Сиздин почтаңызга шилтеме жөнөтүлдү. Эгер көрүнбөсө, спам папкасын
						текшериңиз.
					</p>
				</div>
			)}
			<p className="text-center text-gray-500 text-md">
				Эгер жардам керек болсо, ата-энеңизден же мугалимиңизден сураңыз.
			</p>
		</div>
	)
}
