/** @format */

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { resendVerificationEmail } from "../../../redux/features/auth/authSlice"
import { ToastContainer, Bounce, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const InputField = ({ label, id, type, placeholder, value, onChange }) => (
	<div className="flex flex-col gap-2 text-white font-semibold">
		<label htmlFor={id}>{label}</label>
		<input
			required
			className="authInputs text-blue-500 p-2 rounded-sm"
			type={type}
			id={id}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	</div>
)

const ResendVerificationEmail = () => {
	const dispatch = useDispatch()
	const [email, setEmail] = useState("")
	const loading = useSelector(state => state.auth.loading)
	const error = useSelector(state => state.auth.error)

	const handleResendVerification = async e => {
		e.preventDefault()
		if (email) {
			try {
				await dispatch(resendVerificationEmail({ email })).unwrap()
				toast.success("Текшерүү шилтемеси ийгиликтүү жөнөтүлдү!")
			} catch (error) {
				toast.error(error.message || "Текшерүү шилтемесин жөнөтүүдө ката кетти")
			}
		}
	}

	return (
		<div className="flex flex-col justify-center items-center min-h-screen gap-6 p-4">
			<h1 className="text-center text-blue-500 text-3xl font-bold">
				Катталууну аяктоо
			</h1>

			<div className="max-w-[500px] w-full bg-blue-100 p-6 rounded-lg shadow-md">
				<p className="text-blue-800 mb-4 text-lg">
					Урматтуу колдонуучу, сиз ийгиликтүү катталдыңыз! Эми аккаунтуңузду
					активдештирүү үчүн төмөнкү кадамдарды аткарыңыз:
				</p>
				<ol className="text-blue-800 list-decimal list-inside mb-4 space-y-2">
					<li>Электрондук почтаңызды текшериңиз.</li>
					<li>
						Биз жөнөткөн каттан "Аккаунтту активдештирүү" деген шилтемени
						табыңыз.
					</li>
					<li>Ал шилтемени басып, аккаунтуңузду активдештириңиз.</li>
					<li>Эгерде кат көрүнбөсө, "Спам" папкасын да текшерип көрүңүз.</li>
				</ol>
				<p className="text-blue-800 mb-4">
					Эгерде сиз текшерүү катын албаган болсоңуз, төмөндөгү форманы колдонуп
					кайра жөнөтө аласыз.
				</p>
			</div>

			<form
				onSubmit={handleResendVerification}
				className="max-w-[500px] w-full flex flex-col gap-4 p-6 rounded-lg shadow-md bg-white"
			>
				<InputField
					label="Электрондук почта"
					id="email"
					type="email"
					placeholder="Электрондук почтаңызды жазыңыз"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<button
					type="submit"
					disabled={loading}
					className="py-3 px-6 text-white font-semibold text-xl border-none bg-blue-500 mt-4 rounded-md text-center disabled:opacity-50 hover:bg-blue-600 transition-colors"
				>
					{loading ? "Жөнөтүлүүдө..." : "Текшерүү шилтемесин кайра жөнөтүү"}
				</button>
			</form>
			{error && (
				<div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg max-w-[500px] w-full">
					{error}
				</div>
			)}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
		</div>
	)
}

export default ResendVerificationEmail
