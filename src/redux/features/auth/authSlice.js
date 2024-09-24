/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import pb from "../../../services/pocketbase"
import axiosInstance, { handleApiError, setAuthToken } from "./axiosAuthUtils"

export const login = createAsyncThunk(
	"auth/login",
	async ({ identity, password, signIn }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post(
				"/api/collections/users/auth-with-password",
				{ identity, password }
			)
			signIn({
				auth: {
					token: response.data.token,
					type: "Bearer",
				},
				userState: {
					email: identity,
					userId: response.data.record.id,
					student_name: response.data.record.name,
					role: response.data.record.role,
				},
			})

			return response.data.record
		} catch (error) {
			return rejectWithValue(handleApiError(error))
		}
	}
)

export const signUp = createAsyncThunk(
	"auth/signUp",
	async (
		{ email, password, username, role, name, surname },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.post(
				"/api/collections/users/records",
				{
					email,
					password,
					passwordConfirm: password,
					username,
					role,
					name,
					surname,
				}
			)

			// Request verification email
			await pb.collection("users").requestVerification(email)

			return response.data
		} catch (error) {
			return rejectWithValue(handleApiError(error))
		}
	}
)

export const verifyEmail = createAsyncThunk(
	"auth/verifyEmail",
	async ({ token }, { rejectWithValue }) => {
		try {
			await axiosInstance.post("/api/collections/users/confirm-verification", {
				token,
			})
			return true
		} catch (error) {
			return rejectWithValue(handleApiError(error))
		}
	}
)

export const resendVerificationEmail = createAsyncThunk(
	"auth/resendVerificationEmail",
	async ({ email }, { rejectWithValue }) => {
		try {
			await axiosInstance.post("/api/collections/users/request-verification", {
				email,
			})
			return true
		} catch (error) {
			return rejectWithValue(handleApiError(error))
		}
	}
)

export const forgotPassword = createAsyncThunk(
	"auth/forgotPassword",
	async ({ email }, { rejectWithValue }) => {
		try {
			await axiosInstance.post(
				"/api/collections/users/request-password-reset",
				{ email }
			)
			return true
		} catch (error) {
			return rejectWithValue(handleApiError(error))
		}
	}
)

export const resetPassword = createAsyncThunk(
	"auth/resetPassword",
	async ({ token, password, passwordConfirm }, { rejectWithValue }) => {
		try {
			await axiosInstance.post(
				"/api/collections/users/confirm-password-reset",
				{
					token,
					password,
					passwordConfirm,
				}
			)
			return true
		} catch (error) {
			return rejectWithValue(handleApiError(error))
		}
	}
)

const initialState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout: state => {
			setAuthToken("")
			state.user = null
			state.isAuthenticated = false
			state.error = null
		},
		clearError: state => {
			state.error = null
		},
	},
	extraReducers: builder => {
		builder
			.addCase(login.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(login.fulfilled, (state, action) => {
				state.user = action.payload
				state.isAuthenticated = true
				state.loading = false
				state.error = null
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
			.addCase(signUp.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.user = action.payload
				state.isAuthenticated = false // User needs to verify email
				state.loading = false
				state.error = null
			})
			.addCase(signUp.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
			.addCase(verifyEmail.fulfilled, state => {
				if (state.user) {
					state.user.emailVerified = true
					state.isAuthenticated = true
				}
			})
			.addCase(verifyEmail.rejected, (state, action) => {
				state.error = action.payload
			})
			.addCase(resendVerificationEmail.fulfilled, state => {
				state.error = null
			})
			.addCase(resendVerificationEmail.rejected, (state, action) => {
				state.error = action.payload
			})
	},
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
