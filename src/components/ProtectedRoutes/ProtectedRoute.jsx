/** @format */

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { Navigate, Outlet } from "react-router-dom"
const ProtectedAuthRoute = () => {
	const isAuthenticated = useIsAuthenticated()

	console.log("isAuthenticated", isAuthenticated)

	return isAuthenticated ? <Navigate to={"/"} /> : <Outlet />
}

export default ProtectedAuthRoute
