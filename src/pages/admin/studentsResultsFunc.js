/** @format */

export const groupResultsByStudent = items => {
	return items.reduce((acc, item) => {
		const result = item.oneStudentJsonResult.result
		const studentId = item.student_id

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
			}
		}

		return acc
	}, {})
}

export const formatTime = seconds => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60
	return `${minutes}м ${remainingSeconds}с`
}

export const sortStudentResults = (studentResults, sortBy) => {
	return Object.values(studentResults).sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.student_name.localeCompare(b.student_name)
			case "time":
				return a.totalTime - b.totalTime
			case "correct":
				return b.correctAnswers - a.correctAnswers
			case "wrong":
				return b.wrongAnswers - a.wrongAnswers
			default:
				return 0
		}
	})
}

export const sortResultsByCorrectAnswersAndTime = items => {
	const groupedResults = groupResultsByStudent(items)
	return Object.values(groupedResults).sort((a, b) => {
		if (b.correctAnswers !== a.correctAnswers) {
			return b.correctAnswers - a.correctAnswers
		}
		return a.totalTime - b.totalTime
	})
}

export const toggleAccess = currentAccessState => {
	// This function would typically interact with your backend to toggle access
	// For now, we'll just return the opposite of the current state
	return !currentAccessState
}
