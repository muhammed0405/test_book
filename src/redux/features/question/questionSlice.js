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
	"questions/getALLResults",
	async () => {
		try {
			const response = await axiosInstance.get(
				"/api/collections/results/records"
			)
			console.log(response.data) // Check the structure of the response
			return response.data // Ensure this is the correct path to the items
		} catch (error) {
			console.log(error)
			throw error // Throw the error to be caught in the rejected case
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

export const initialState = {
	questions: [],
	loading: false,
	error: "",
	results: [],
	allResults: [],
}
const questionSlice = createSlice({
	name: "questions", // Change this to 'questions' for clarity
	initialState: {
		questions: [],
		loading: false,
		error: null,
		results: [],
		allResults: [],
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
	},
})

export default questionSlice.reducer
