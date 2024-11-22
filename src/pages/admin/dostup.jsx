import React, { useState, useEffect } from 'react'
import PocketBase from 'pocketbase'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const UserVerification = () => {
  const pb = new PocketBase("https://tasbih.pockethost.io")
  const [unverifiedUsers, setUnverifiedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    fetchUnverifiedUsers()
  }, [])

  const fetchUnverifiedUsers = async () => {
    try {
      const resultList = await pb.collection('users').getList(1, 50, {
        filter: 'verified = false',
        sort: '-created'
      })
      setUnverifiedUsers(resultList.items)
      setLoading(false)
    } catch (error) {
      console.error("Колдонуучуларды алуудагы ката:", error)
      setError("Колдонуучулар тизмесин алууда ката кетти")
      setLoading(false)
    }
  }

  const handleVerifyUser = async (userId, email) => {
    try {
      // Колдонуучуну жаңыртуу
      const data = {
        "verified": true,
        "emailVisibility": true,
        "role": "verified",  // же башка ролду берсеңиз болот
        "IsVerified": true
      }

      await pb.collection('users').update(userId, data)
      
      // Ийгиликтүү жаңыртуу
      setSuccess(`${email} колдонуучусу ийгиликтүү верификацияланды`)
      setUnverifiedUsers(prev => prev.filter(user => user.id !== userId))
      
      // Билдирүүнү жок кылуу
      setTimeout(() => setSuccess(null), 3000)
      
      // Тизмени жаңыртуу
      fetchUnverifiedUsers()
    } catch (error) {
      console.error("Верификация катасы:", error)
      setError(`Верификация учурунда ката кетти: ${error.message}`)
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleRejectUser = async (userId, email) => {
    try {
      await pb.collection('users').delete(userId)
      setSuccess(`${email} колдонуучусу ийгиликтүү өчүрүлдү`)
      setUnverifiedUsers(prev => prev.filter(user => user.id !== userId))
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error("Колдонуучуну өчүрүүдөгү ката:", error)
      setError(`Колдонуучуну өчүрүүдө ката кетти: ${error.message}`)
      setTimeout(() => setError(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Верификацияга муктаж колдонуучулар</h2>
        
        {/* Ката билдирүүсү */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {/* Ийгилик билдирүүсү */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {unverifiedUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Верификацияга муктаж колдонуучулар жок</p>
          </div>
        ) : (
          <div className="space-y-4">
            {unverifiedUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{user.username}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Катталган күнү: {new Date(user.created).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleVerifyUser(user.id, user.email)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <FaCheckCircle />
                      <span>Тастыктоо</span>
                    </button>
                    <button 
                      onClick={() => handleRejectUser(user.id, user.email)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FaTimesCircle />
                      <span>Өчүрүү</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserVerification