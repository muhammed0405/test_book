/** @format */

import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

// Warm color palette
const colors = {
	primary: "#6CB4EE", // Blue
	secondary: "#f39c12", // Amber
	accent: "#d35400", // Dark Orange
	text: "#34495e", // Dark Blue-Gray
	background: "#fff", // White
	danger: "#c0392b", // Dark Red
	success: "#ADFF2F", // Green
	warning: "#FFAC1C", // Orange
}

export default function AskToLogOut({ setLogOut, signOut }) {
	const navigate = useNavigate()
	return (
		<div
			className="absolute max-w-96 h-72 w-full ml-auto mr-auto  rounded-2xl flex flex-col items-center justify-center gap-10 left-0 right-0 z-100 "
			style={{ backgroundColor: colors.primary }}
		>
			<h2 className="text-xl" style={{ color: colors.background }}>
				Аккаунттан чыкканга макулсузбу ?
			</h2>
			<div className="flex justify-around w-full ">
				<button
					className="p-3 rounded-lg"
					style={{
						color: colors.danger,
						borderColor: colors.danger,
						borderWidth: 4,
						fontWeight: "bold",
					}}
					onClick={() => {
						try {
							signOut()
							setLogOut(false)
							navigate("/login")
						} catch (err) {
							console.log(err)
						}
					}}
				>
					Ооба
				</button>
				<button
					className="p-3 rounded-lg"
					style={{
						color: colors.warning,
						borderColor: colors.warning,
						borderWidth: 4,
						fontWeight: "bold",
					}}
					onClick={() => setLogOut(false)}
				>
					Жок
				</button>
			</div>
		</div>
	)
}

AskToLogOut.propTypes = {
	setLogOut: PropTypes.func.isRequired,
	signOut: PropTypes.func.isRequired,
}
