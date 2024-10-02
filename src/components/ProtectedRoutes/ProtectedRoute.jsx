/** @format */

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { Navigate, Outlet } from "react-router-dom"
const ProtectedAuthRoute = () => {
	const isAuthenticated = useIsAuthenticated()
	const auth = useAuthUser()

	console.log("isAuthenticated", isAuthenticated)

	if (auth.role === "admin") return <Navigate to={"/admin"} />
	return isAuthenticated ? <Navigate to={"/"} /> : <Outlet />
}

export default ProtectedAuthRoute
