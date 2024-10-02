/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../auth/axiosAuthUtils"

export const getQuestions = createAsyncThunk(
	"questions/getQuestions",
	async () => {
		try {
			const response = await axiosInstance.get(
				"/api/collections/questions/records"
			)
			console.log(response.data) // Check the structure of the response
			return response.data.items // Ensure this is the correct path to the items
		} catch (error) {
			console.log(error)
			throw error // Throw the error to be caught in the rejected case
		}
	}
)

export const getAllResults = createAsyncThunk(
	"questions/getAllResults",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				"/api/collections/results/records",
				{
					params: {
						page: 1,
						perPage: 10000, // Adjust this number based on your maximum expected records
						sort: "-created", // Optional: sort by creation date, newest first
					},
				}
			)

			console.log("Total items:", response.data.totalItems)
			console.log("Items:", response.data.items)

			return response.data // Return just the items array
		} catch (error) {
			console.error("Error fetching results:", error)
			return rejectWithValue(error.response?.data || "An error occurred")
		}
	}
)
export const submitAnswer = createAsyncThunk(
	"questions/submitAnswer",
	async ({
		student_id,
		questionId,
		answer,
		timeSpent,
		isCorrect,
		question,
		student_name,
	}) => {
		try {
			const response = await axiosInstance.post(
				"/api/collections/results/records",
				{
					student_id: student_id,
					question_id: questionId,
					answer,
					isCorrect: isCorrect,
					time: timeSpent,
					question: question,
					student_name: student_name,
				}
			)
			console.log(response.data) // Check the structure of the response
			return response.data // Ensure this is the correct path to the items
		} catch (error) {
			console.log(error)
			throw error // Throw the error to be caught in the rejected case
		}
	}
)

export const getResults = createAsyncThunk(
	"questions/getResults",
	async ({ student_id }) => {
		try {
			const response = await axiosInstance.get(
				"/api/collections/results/records",
				{
					params: {
						filter: `student_id = "${student_id}"`,
					},
				}
			)
			console.log(response.data) // Check the structure of the response
			return response.data // Ensure this is the correct path to the items
		} catch (error) {
			console.log(error)
			throw error // Throw the error to be caught in the rejected case
		}
	}
)

export const addQuestion = createAsyncThunk(
	"questions/addQuestion",
	async question => {
		try {
			const response = await axiosInstance.post(
				"/api/collections/questions/records",
				question
			)
			return response.data
		} catch (error) {
			console.error(error)
			throw error
		}
	}
)

export const getAccess = createAsyncThunk("questions/getAccess", async () => {
	try {
		const response = await axiosInstance.get(
			"/api/collections/isAdminGaveAcces/records/vwyp7szt8vbrw90"
		)
		console.log(response)
		return response.data
	} catch (error) {
		console.error(error)
		throw error
	}
})

export const toggleAccess = createAsyncThunk(
	"questions/toggleAccess",
	async isAccess => {
		try {
			const response = await axiosInstance.patch(
				"/api/collections/isAdminGaveAcces/records/vwyp7szt8vbrw90",
				{
					isIt: !isAccess,
				}
			)

			return !isAccess
		} catch (error) {
			console.error("Error toggling access:", error)
		}
	}
)

export const initialState = {
	questions: [],
	loading: false,
	error: "",
	results: [],
	allResults: [],
	isAccess: false,
	resultShowingTime: "",
}
const questionSlice = createSlice({
	name: "questions", // Change this to 'questions' for clarity
	initialState: {
		questions: [],
		loading: false,
		error: null,
		results: [],
		allResults: [],
		isAccess: false,
		resultShowingTime: "",
	},
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getQuestions.pending, state => {
				state.loading = true
				state.error = null // Reset error on new request
			})
			.addCase(getQuestions.fulfilled, (state, action) => {
				state.loading = false
				state.questions = action.payload // Store the fetched questions
			})
			.addCase(getQuestions.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message
			})
			.addCase(getResults.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getResults.fulfilled, (state, action) => {
				state.loading = false
				state.results = action.payload // Store the fetched questions
			})
			.addCase(getResults.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
			.addCase(getAllResults.pending, state => {
				state.loading = true
				state.error = null // Reset error on new request
			})
			.addCase(getAllResults.fulfilled, (state, action) => {
				state.loading = false
				state.allResults = action.payload // Store the fetched questions
			})
			.addCase(getAllResults.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
			.addCase(getAccess.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(getAccess.fulfilled, (state, action) => {
				state.loading = false
				state.isAccess = action.payload.isIt
				state.resultShowingTime = action.payload.time
			})
			.addCase(toggleAccess.fulfilled, (state, action) => {
				state.loading = false
				state.isAccess = action.payload
			})
	},
})

export default questionSlice.reducer
