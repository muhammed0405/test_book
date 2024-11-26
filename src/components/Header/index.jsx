/** @format */

import { useState, useEffect } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { NavLink } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import AskToLogOut from "./AskToLogOut"
import PropTypes from "prop-types"

const colors = {
	primary: "#e67e22",
	secondary: "#f39c12",
	accent: "#d35400",
	text: "#34495e",
	background: "#ffffff",
}

export default function Header() {
	const isAuthenticated = useIsAuthenticated()
	const [logOut, setLogOut] = useState(false)
	const signOut = useSignOut()
	const auth = useAuthUser()
	const [menuOpen, setMenuOpen] = useState(false)

	const buttonStyle = {
		borderColor: colors.primary,
		color: colors.primary,
		backgroundColor: "transparent",
	}

	useEffect(() => {
		const handleResize = () => {
			if (window.innerwidth >= 1028) {
				setMenuOpen(false)
			}
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "unset"
		return () => {
			document.body.style.overflow = "unset"
		}
	}, [menuOpen])

	const NavButton = ({ to, onClick, children, title }) => (
		<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
			<NavLink to={to} onClick={onClick}>
				<button
					className="w-full md:w-auto py-2 px-4 border-2 h-10 rounded-md text-start transition-colors hover:bg-opacity-10 hover:bg-primary"
					style={buttonStyle}
					title={title}
				>
					{children}
				</button>
			</NavLink>
		</motion.div>
	)

	NavButton.propTypes = {
		to: PropTypes.func.isRequired,
		onClick: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
		title: PropTypes.string.isRequired,
	}

	const renderNavButtons = (isMobile = false) => {
		const closeMenu = isMobile ? () => setMenuOpen(false) : () => {}
		const buttons = isAuthenticated
			? auth.role === "admin"
				? [
						{ to: "/admin", icon: "🛠️ админ", title: "Жыйынтыктар" },
						{ to: "/adminPanel", icon: "📘суроо кошуу", title: "Суроо кошуу" },
						{
							to: "/UserVerification",
							icon: " каттоону тастыктоо",
							title: "тастыктоо",
						},
						{
							to: "/user_list",
							icon: "👤 колдонуучулар",
							title: "колдонуучулар",
						},
						{
							to: "/all_results_delete",
							icon: "📊 жыйынтыктар ",
							title: "жалпы жыйынтык очуруу",
						},
				  ]
				: [
						{ to: "/dashboard", icon: "📝 суроолор", title: "Суроолор" },
						{ to: "/results", icon: "✅ жооптор", title: "жооптор" },
						{
							to: "/all_results",
							icon: "📊 жалпы жыйынтык",
							title: "жалпы жыйынтык",
						},
				  ]
			: [
					{ to: "/login", icon: "🔑 кирүү", title: "Кирүү" },
					{ to: "/register", icon: "📝 каттоо ", title: "Каттоо" },
			  ]

		return (
			<>
				{buttons.map((button, index) => (
					<motion.div
						key={button.to}
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<NavButton to={button.to} onClick={closeMenu} title={button.title}>
							{button.icon}
						</NavButton>
					</motion.div>
				))}
				{isAuthenticated && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: buttons.length * 0.1 }}
						style={{
							display: "flex",
							flexDirection: isMobile ? "column" : "row ",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						<button
							className="w-full md:w-auto py-2 px-4 border-2 h-10 rounded-md text-center transition-colors hover:bg-opacity-10 hover:bg-primary flex justify-start items-center gap-2"
							style={buttonStyle}
							onClick={() => {
								setLogOut(!logOut)
								closeMenu()
							}}
							title="Чыгуу"
						>
							🚪аккаунтан чыгуу
						</button>
						<a
							href="/auth/request/reset_password"
							className="w-full md:w-auto py-2 px-4 border-2 h-10 rounded-md text-center transition-colors hover:bg-opacity-10 hover:bg-primary flex justify-start items-center gap-2"
							style={buttonStyle}
							title="Сыр сөздү өзгөртүү"
						>
							🔒cыр сөздү өзгөртүү
						</a>
					</motion.div>
				)}
			</>
		)
	}

	return (
		<motion.header
			className="w-full relative bg-white shadow-md"
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center py-4">
					{auth.role !== "admin" && (
						<NavLink to="/dashboard">
							<motion.button
								className="py-2 px-4 border-2 h-10 rounded-md text-center transition-colors hover:bg-opacity-10 hover:bg-primary"
								style={buttonStyle}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								title="суроолор"
							>
								Баштоо 📝
							</motion.button>
						</NavLink>
					)}
					<NavLink to="/">
						<motion.button
							className="py-2 px-4 border-2 h-10 rounded-md text-center transition-colors hover:bg-opacity-10 hover:bg-primary"
							style={buttonStyle}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							title="Башкы бет"
						>
							🏠
						</motion.button>
					</NavLink>
					<motion.button
						className="md:hidden z-50 focus:outline-none"
						onClick={() => setMenuOpen(!menuOpen)}
						aria-label="Toggle menu"
						whileTap={{ scale: 0.9 }}
					>
						<motion.span
							className="text-2xl"
							initial={false}
							animate={{ rotate: menuOpen ? 90 : 0 }}
							transition={{ duration: 0.3 }}
						>
							{menuOpen ? "✕" : "☰"}
						</motion.span>
					</motion.button>
					<nav className="hidden md:flex md:items-center md:space-x-2">
						{renderNavButtons()}
					</nav>
				</div>
			</div>

			<AnimatePresence>
				{menuOpen && (
					<motion.div
						className="fixed inset-0 bg-white z-40 md:hidden overflow-y-auto"
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 500 }}
					>
						<div className="flex flex-col space-y-4 p-4 pt-16">
							{renderNavButtons(true)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{logOut && <AskToLogOut setLogOut={setLogOut} signOut={signOut} />}
			</AnimatePresence>
		</motion.header>
	)
}
