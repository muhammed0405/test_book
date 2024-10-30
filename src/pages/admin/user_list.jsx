import  { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import { useAuthUser, useIsAuthenticated } from "react-auth-kit"; // Туура импорттоо

const pb = new PocketBase('https://tasbih.pockethost.io');

const UserList = () => {
  const isAuthenticated = useIsAuthenticated(); // Функцияны туура колдонуу
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuthUser();

  useEffect(() => {
    const fetchUsers = async () => {
      if (isAuthenticated && auth.role === "admin") {
        try {
          const resultList = await pb.collection('users').getList(1, 50, {
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

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Сиз бул колдонуучуну чындап өчүргүңүз келеби?")) {
      try {
        await pb.collection('users').delete(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Колдонуучулардын тизмеси:</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-300 px-4 py-2">ID</th>
            <th className="border-b-2 border-gray-300 px-4 py-2">Username</th>
            <th className="border-b-2 border-gray-300 px-4 py-2">Email</th>
            <th className="border-b-2 border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border-b border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border-b border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border-b border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border-b border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Өчүрүү
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;