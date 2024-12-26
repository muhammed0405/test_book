/** @format */

import { useEffect, useRef, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { RxLapTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
    getAccess,
    getAllResults,
    toggleAccess,
} from "../../redux/features/question/questionSlice";

// Utility Functions

export const groupResultsByStudent = items => {
    return items.reduce((acc, item) => {
        const result = item.oneStudentJsonResult.result;
        const studentId = item.student_id;

        if (!acc[studentId]) {
            acc[studentId] = {
                student_id: studentId,
                correctAnswers: result.correctAnswers,
                wrongAnswers: result.wrong_answers,
                totalTime: result.total_time_spent,
                results: item.oneStudentJsonResult.resultOfOneStudent,
                student_name:
                    item.oneStudentJsonResult.resultOfOneStudent[0].student_name ||
                    "Unknown",
            };
        }

        return acc;
    }, {});
};

export const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
};

export const sortStudentResults = (studentResults, sortBy) => {
    return Object.values(studentResults).sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.student_name.localeCompare(b.student_name);
            case "time":
                return a.totalTime - b.totalTime;
            case "correct":
                return b.correctAnswers - a.correctAnswers;
            case "wrong":
                return b.wrongAnswers - a.wrongAnswers;
            default:
                return 0;
        }
    });
};

export const sortResultsByCorrectAnswersAndTime = items => {
    const groupedResults = groupResultsByStudent(items);
    return Object.values(groupedResults).sort((a, b) => {
        if (b.correctAnswers !== a.correctAnswers) {
            return b.correctAnswers - a.correctAnswers;
        }
        return a.totalTime - b.totalTime;
    });
};

// React Component

const StudentsResults = () => {
	const dispatch = useDispatch()
	const { allResults, loading, error, isAccess, isQuizStarted } = useSelector(
		state => state.questions
	)
	const [sortedResults, setSortedResults] = useState([])
	const [sortBy, setSortBy] = useState("name")

    useEffect(() => {
        if (allResults.items?.length > 0) {
            const groupedResults = groupResultsByStudent(allResults.items);
            const sorted = sortStudentResults(groupedResults, sortBy);
            setSortedResults(sorted);
        }
    }, [allResults.items, sortBy]);

    const handleSort = criteria => {
        setSortBy(criteria);
    };

    const runOnce = useRef(false);

    useEffect(() => {
        if (!runOnce.current) {
            dispatch(getAllResults());
            dispatch(getAccess());
            runOnce.current = true;
        }
    }, [dispatch]);

	const handleToggleAccess = () => {
		if (
			window.confirm(
				isAccess
					? "Жыйынтыкты жашырууга макулсузбу?"
					: "Жыйынтыкты көрсөтүүгө макулсузбу?"
			)
		) {
			try {
				dispatch(
					toggleAccess({
						type: "results",
						currentState: isAccess,
						otherState: isQuizStarted,
					})
				)
			} catch (error) {
				alert("Ката чыкты, кайра аракет кылыңыз: " + error)
			}
		}
	}

	const handleToggleUserQuestions = () => {
		if (
			window.confirm(
				isQuizStarted
					? "Суроолорду жашырууга макулсузбу?"
					: "Суроолорду көрсөтүүгө макулсузбу?"
			)
		) {
			try {
				dispatch(
					toggleAccess({
						type: "questions",
						currentState: isQuizStarted,
						otherState: isAccess,
					})
				)
			} catch (error) {
				alert("Ката чыкты, кайра аракет кылыңыз: " + error)
			}
		}
	}

	if (loading) return <div className="text-center py-4">Жүктөлүүдө...</div>
	if (error)
		return <div className="text-center py-4 text-red-600">Ката: {error}</div>

	return (
		<div className="container mx-auto px-4 py-8">
			<h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
				Окуучулардын жыйынтыктары
			</h2>
			<div className="flex flex-wrap justify-center gap-2 mb-6">
				<button
					onClick={() => handleSort("name")}
					className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					title="Аты боюнча иреттөө"
				>
					👤⬇️
				</button>
				<button
					onClick={() => handleSort("time")}
					className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
					title="Убакыт боюнча иреттөө"
				>
					⏱️⬇️
				</button>
				<button
					onClick={() => handleSort("correct")}
					className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
					title="Туура жооптор боюнча иреттөө"
				>
					✅⬇️
				</button>
				<button
					onClick={() => handleSort("wrong")}
					className="bg-red-800 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
					title="Ката жооптор боюнча иреттөө"
				>
					❌⬇️
				</button>
				<button
					onClick={handleToggleAccess}
					className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
					title={isAccess ? "Жыйынтыкты жашыруу" : "Жыйынтыкты көрсөтүү"}
				>
					{isAccess ? "👀 жыйынтыкты жашыруу" : " 🙈жыйынтыкты көрсөтү"}
				</button>
				<button
					onClick={handleToggleUserQuestions} // Колдонуучуларга суроолорду жашыруу/көрсөтүү
					className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
					title="Суроолорду жашыруу/көрсөтүү"
				>
					{isQuizStarted ? "👀 суроолорду жашыруу" : "🙈 суроолорду көрсөтүү"}
				</button>
			</div>
			{sortedResults.length > 0 ? (
				<ul className="space-y-4">
					{sortedResults.map((studentResult, index) => (
						<li
							key={studentResult.student_id}
							className={`bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 							}`}
						>
							<div className="flex items-center justify-between mb-4">
								<strong className="text-[14px] sm:text-lg md:text-xl text-gray-800 flex items-center gap-2">
									{index + 1}. <IoPerson />: {studentResult.student_name}
								</strong>
								<span className="text-sm text-gray-500 flex items-center gap-2">
									<RxLapTimer />: {formatTime(studentResult.totalTime)}
								</span>
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
										{studentResult.wrongAnswers}
									</span>
									<span className="text-sm text-gray-600">Ката жооптор</span>
								</div>
							</div>
							<div className="mt-4 bg-red-500 rounded-full h-2">
								<div
									className="bg-green-500 h-2 rounded-full"
									style={{
										width: `${
											(studentResult.correctAnswers /
												(studentResult.correctAnswers +
													studentResult.wrongAnswers)) *
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

export default StudentsResults;