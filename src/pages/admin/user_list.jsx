/** @format */

import { useState, useEffect } from "react"
import PocketBase from "pocketbase"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { IoMdSearch } from "react-icons/io"
import { LuTrash } from "react-icons/lu"
import { IoCloseSharp } from "react-icons/io5"

const UserList = () => {
	const pb = new PocketBase("https://tasbih.pockethost.io")
	const isAuthenticated = useIsAuthenticated()
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const auth = useAuthUser()

	useEffect(() => {
		const fetchUsers = async () => {
			if (isAuthenticated && auth.role === "admin") {
				try {
					const resultList = await pb.collection("users").getList(1, 50, {
						filter: 'created >= "2022-01-01 00:00:00"',
					})
					setUsers(resultList.items)
				} catch (error) {
					console.error("Error fetching users:", error)
				} finally {
					setLoading(false)
				}
			}
		}

		fetchUsers()
	}, [isAuthenticated, auth.role])

	const handleDeleteUser = async () => {
		if (!selectedUser) return

		try {
			await pb.collection("users").delete(selectedUser.id)
			setUsers(users.filter(user => user.id !== selectedUser.id))
			setShowDeleteModal(false)
			setSelectedUser(null)
		} catch (error) {
			console.error("Error deleting user:", error)
		}
	}

	const filteredUsers = users.filter(
		user =>
			user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
			user.role?.toLowerCase().includes(searchTerm?.toLowerCase())
	)

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	return (
		<div className="p-6 max-w-6xl mx-auto">
			{/* Header */}
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-800">
					Колдонуучулардын тизмеси
				</h2>
				<p className="text-gray-600 mt-2">Системадагы бардык колдонуучулар</p>
			</div>

			{/* Search and Stats */}
			<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
				<div className="relative w-full md:w-96">
					<input
						type="text"
						placeholder="Издөө..."
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<IoMdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
				</div>
				<div className="bg-blue-50 px-4 py-2 rounded-lg">
					<span className="text-blue-600 font-medium">
						Жалпы: {users.length} колдонуучу
					</span>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Колдонуучу
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ролу
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Аракеттер
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredUsers.map(user => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div className="flex items-center">
											<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
												<span className="text-blue-600 font-medium">
													{user.username.charAt(0).toUpperCase()}
												</span>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{user.username}
												</div>
												<div className="text-sm text-gray-500">
													ID: {user.id}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{user.role}
									</td>
									<td className="px-6 py-4 text-right">
										<button
											onClick={() => {
												setSelectedUser(user)
												setShowDeleteModal(true)
											}}
											className="text-red-600 hover:text-red-900 transition-colors duration-200"
										>
											<LuTrash className="h-5 w-5" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-medium text-gray-900">
								Колдонуучуну өчүрүү
							</h3>
							<button
								onClick={() => setShowDeleteModal(false)}
								className="text-gray-400 hover:text-gray-500"
							>
								<IoCloseSharp className="h-5 w-5" />
							</button>
						</div>
						<p className="text-gray-600 mb-4">
							Сиз чындап эле {selectedUser?.username} колдонуучусун өчүргүңүз
							келеби?
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => setShowDeleteModal(false)}
								className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
							>
								Жок
							</button>
							<button
								onClick={handleDeleteUser}
								className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
							>
								Өчүрүү
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default UserList
