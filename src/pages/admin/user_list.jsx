import { useState, useEffect } from "react";
import PocketBase from "pocketbase";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { IoMdSearch } from "react-icons/io";
import { LuTrash } from "react-icons/lu";
import { IoCloseSharp } from "react-icons/io5";

const UserList = () => {
  const pb = new PocketBase("https://tasbih.pockethost.io");
  const isAuthenticated = useIsAuthenticated();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const auth = useAuthUser();

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAuthenticated && auth.role === "admin") {
        try {
          const resultList = await pb.collection("users").getList(1, 50, {
            filter: 'created >= "2022-01-01 00:00:00"',
          });
          setUsers(resultList.items);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [isAuthenticated, auth.role]);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await pb.collection("users").delete(selectedUser.id);
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "student" : "admin";

    try {
      await pb.collection("users").update(userId, {
        role: newRole
      });

      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, role: newRole }
          : user
      ));
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Колдонуучулардын тизмеси</h2>
        <p className="text-sm text-gray-600 mt-1">Системадагы бардык колдонуучулар</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Издөө..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <IoMdSearch className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg text-center">
          <span className="text-blue-600 font-medium text-sm">Жалпы: {users.length} колдонуучу</span>
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium text-lg">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <div className="text-base font-medium text-gray-900">{user.username}</div>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {user.role === "admin" ? "Админ" : "Студент"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={user.role === "admin"}
                  onChange={() => handleToggleRole(user.id, user.role)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                >
                  <LuTrash className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Колдонуучуну өчүрүү</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <IoCloseSharp className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600">Сиз чындап эле {selectedUser?.username} колдонуучусун өчүргүңүз келеби?</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-base font-medium"
              >
                Жок
              </button>
              <button
                onClick={handleDeleteUser}
                className="w-full px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 text-base font-medium"
              >
                Өчүрүү
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;