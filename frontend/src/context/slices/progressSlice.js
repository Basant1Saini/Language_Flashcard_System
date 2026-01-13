import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import progressService from '../../services/progressService'

export const fetchProgress = createAsyncThunk(
  'progress/fetchProgress',
  async (params, { rejectWithValue }) => {
    try {
      return await progressService.getProgress(params)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchStats = createAsyncThunk(
  'progress/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await progressService.getStats()
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const initialState = {
  progress: [],
  stats: null,
  loading: false,
  error: null
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearProgress: (state) => {
      state.progress = []
      state.stats = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false
        state.progress = action.payload.data
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload.data
      })
  }
})

export const { clearProgress } = progressSlice.actions
export default progressSlice.reducer