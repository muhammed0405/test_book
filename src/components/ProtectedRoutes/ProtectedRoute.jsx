/** @format */

import { Navigate, Outlet } from "react-router-dom"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"

const ProtectedAuthRoute = () => {
	const isAuthenticated = useIsAuthenticated()

	console.log("isAuthenticated", isAuthenticated)

	return isAuthenticated ? <Navigate to={"/"} /> : <Outlet />
}

export default ProtectedAuthRoute
