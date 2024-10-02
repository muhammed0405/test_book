/** @format */

import React from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedAdminRoute = () => {
	const auth = useAuthUser()

	if (!auth) {
		return <Navigate to="/login" replace />
	}

	return auth.role === "admin" ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedAdminRoute
