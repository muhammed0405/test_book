/** @format */
import React from "react"
import { Route, Routes } from "react-router-dom"
import AuthOutlet from "@auth-kit/react-router/AuthOutlet"
import "./App.css"
import Header from "./components/Header"
import ProtectedAuthRoute from "./components/ProtectedRoutes/ProtectedRoute"
import ProtectedAdminRoute from "./components/ProtectedRoutes/ProtectedAdminRoute"
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import ResetPassword from "./pages/Auth/ResetPassword"
import VerifyEmail from "./pages/Auth/VerifyEmail"
import Home from "./pages/Home"
import Results from "./pages/Results"
import StudentsResults from "./pages/admin/studentsResults"
import AllStudentsResultsShow from "./pages/AllStudentsResultShow/AllStudentsResultShow"
import ResendVerificationEmail from "./pages/Auth/RequestVerificationEmail"
import AdminAddQuestions from "./pages/admin/adminAddQuestions"
import AdminPanel from "./pages/admin/adminAddQuestions"
import Questions from "./pages/Questions"

const App = () => {
	return (
		<div className="app">
			<Header />
			<div className="container">
				<Routes>
					{/* Public routes */}
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/verify-email/:token" element={<VerifyEmail />} />
					<Route
						path="/request/verification"
						element={<ResendVerificationEmail />}
					/>
					<Route
						path="/auth/reset_password/:token"
						element={<ResetPassword />}
					/>
					<Route
						path="/auth/request/reset_password"
						element={<ForgotPassword />}
					/>

					{/* Protected routes for authenticated users */}
					<Route element={<AuthOutlet fallbackPath="/login" />}>
						<Route path="/" element={<Home />} />
						<Route path="/dashboard" element={<Questions />} />
						<Route path="/results" element={<Results />} />
						<Route path="/all_results" element={<AllStudentsResultsShow />} />
					</Route>

					{/* Protected routes for admin users */}
					<Route element={<ProtectedAdminRoute />}>
						<Route path="/admin" element={<StudentsResults />} />
						<Route path="/adminPanel" element={<AdminPanel />} />
						<Route path="/add_questions" element={<AdminAddQuestions />} />
					</Route>
				</Routes>
			</div>
		</div>
	)
}

export default App
