/** @format */

import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"

const ProtectedAuthRoute = ({ redirectPath = "/" }) => {
	const isAuthenticated = useIsAuthenticated()

	return isAuthenticated ? <Navigate to={redirectPath} /> : <Outlet />
}

export default ProtectedAuthRoute
