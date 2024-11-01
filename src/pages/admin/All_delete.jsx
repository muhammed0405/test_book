import { useEffect, useRef, useState } from "react"
import { IoPerson } from "react-icons/io5"
import { RxLapTimer } from "react-icons/rx"
import { FaTrash } from "react-icons/fa" // Өчүрүү иконкасы үчүн
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../redux/features/auth/axiosAuthUtils"
import { getAllResults } from "../../redux/features/question/questionSlice"
import FormattedTime from "../../components/FomattedTime"

const AllStudentsResultsDelete = () => {
    const dispatch = useDispatch()
    const { allResults, loading, error } = useSelector(state => state.questions)
    const [sortedResults, setSortedResults] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const searchInputRef = useRef(null)
    const [isAdminGaveAccess, setIsAdminGaveAccess] = useState(false)
    const [timeOfResults, setTimeOfResults] = useState("")

    useEffect(() => {
        dispatch(getAllResults())
    }, [dispatch])

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/collections/isAdminGaveAcces/records"
                )
                setIsAdminGaveAccess(response.data.items[0].isIt)
                setTimeOfResults(response.data.items[0].time)
            } catch (error) {
                console.log(error)
            }
        }
        checkAccess()
    }, [])

    useEffect(() => {
        if (allResults.items?.length > 0) {
            const sorted = allResults.items
                .map(item => ({
                    ...item.oneStudentJsonResult.result,
                    student_id: item.student_id,
                    record_id: item.id, // Өчүрүү үчүн record ID кошобуз
                    student_name:
                        item.oneStudentJsonResult.resultOfOneStudent[0].student_name ||
                        "Unknown",
                }))
                .sort((a, b) => {
                    if (b.correctAnswers !== a.correctAnswers) {
                        return b.correctAnswers - a.correctAnswers
                    }
                    return a.total_time_spent - b.total_time_spent
                })
            setSortedResults(sorted)
        }
    }, [allResults.items])

    // Бир жыйынтыкты өчүрүү функциясы
    const handleDeleteOne = async (recordId) => {
        if (window.confirm("Бул жыйынтыкты өчүрүүнү каалайсызбы?")) {
            try {
                await axiosInstance.delete(`/api/collections/results3/records/${recordId}`)
                setSortedResults(prevResults => 
                    prevResults.filter(result => result.record_id !== recordId)
                )
            } catch (error) {
                console.error("Өчүрүү катасы:", error)
                alert("Өчүрүүдө ката кетти")
            }
        }
    }

    // Бардык жыйынтыктарды өчүрүү функциясы
    const handleDeleteAll = async () => {
        if (window.confirm("Бардык жыйынтыктарды өчүрүүнү каалайсызбы?")) {
            try {
                // Бардык жыйынтыктарды өчүрүү
                const deletePromises = sortedResults.map(result => 
                    axiosInstance.delete(`/api/collections/results3/records/${result.record_id}`)
                )
                await Promise.all(deletePromises)
                setSortedResults([])
                alert("Бардык жыйынтыктар ийгиликтүү өчүрүлдү")
            } catch (error) {
                console.error("Жалпы өчүрүүдө ката:", error)
                alert("Өчүрүүдө ката кетти")
            }
        }
    }

    const handleSearch = e => {
        setSearchTerm(e.target.value)
    }

    const handleKeyDown = e => {
        if (e.key === "Enter") {
            const matchedStudent = sortedResults.find(student =>
                student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            if (matchedStudent) {
                const studentElement = document.getElementById(
                    `student-${matchedStudent.student_id}`
                )
                if (studentElement) {
                    studentElement.scrollIntoView({ behavior: "smooth", block: "center" })
                    studentElement.classList.add("bg-yellow-100")
                    setTimeout(() => {
                        studentElement.classList.remove("bg-yellow-100")
                    }, 2000)
                }
            } else {
                alert("Окуучу табылган жок")
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-center p-4 bg-white shadow rounded">
                    Жүктөлүүдө...
                </p>
            </div>
        )
    }

    if (!isAdminGaveAccess) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-xl text-center p-4 bg-white shadow rounded">
                    Жыйынтыктар саат {timeOfResults?.slice(10, 16)} көрсөтүлөт. Кайра
                    кайрылыңыз.
                </p>
            </div>
        )
    }

    if (error) {
        return <div className="text-center py-4 text-red-600">Ката: {error}</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Окуучулардын жыйынтыктары
            </h2>

            <div className="mb-6">
                <input
                    type="search"
                    placeholder="Окуучунун атын издөө..."
                    value={searchTerm}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    ref={searchInputRef}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {sortedResults.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={handleDeleteAll}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
                    >
                        <FaTrash /> Баарын өчүрүү
                    </button>
                </div>
            )}

            {sortedResults.length > 0 ? (
                <ul className="space-y-4">
                    {sortedResults.map((studentResult, index) => (
                        <li
                            key={studentResult.student_id}
                            id={`student-${studentResult.student_id}`}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <strong className="text-lg text-gray-800 flex items-center gap-2">
                                        {index + 1}. <IoPerson className="text-blue-500" />{" "}
                                        {studentResult.student_name}
                                    </strong>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500 flex items-center gap-2">
                                        <RxLapTimer className="text-blue-500" />{" "}
                                        <FormattedTime studentResult={studentResult} />
                                    </span>
                                    <button
                                        onClick={() => handleDeleteOne(studentResult.record_id)}
                                        className="text-red-500 hover:text-red-600 transition-colors duration-300"
                                        title="Өчүрүү"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className="text-green-500 font-bold mr-2">
                                        {studentResult.correctAnswers}
                                    </span>
                                    <span className="text-sm text-gray-600">Туура жооптор</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-red-500 font-bold mr-2">
                                        {studentResult.wrong_answers}
                                    </span>
                                    <span className="text-sm text-gray-600">Ката жооптор</span>
                                </div>
                            </div>
                            <div className="mt-4 bg-red-400 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                        width: `${
                                            (studentResult.correctAnswers /
                                                (studentResult.correctAnswers +
                                                    studentResult.wrong_answers)) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-600">Жыйынтык табылган жок.</p>
            )}
        </div>
    )
}

export default AllStudentsResultsDelete