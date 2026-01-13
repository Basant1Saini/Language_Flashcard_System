import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import deckService from '../../services/deckService'
import toast from 'react-hot-toast'

export const fetchDecks = createAsyncThunk(
  'decks/fetchDecks',
  async (params, { rejectWithValue }) => {
    try {
      return await deckService.getDecks(params)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const createDeck = createAsyncThunk(
  'decks/createDeck',
  async (deckData, { rejectWithValue }) => {
    try {
      const response = await deckService.createDeck(deckData)
      toast.success('Deck created successfully!')
      return response
    } catch (error) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updateDeck = createAsyncThunk(
  'decks/updateDeck',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await deckService.updateDeck(id, data)
      toast.success('Deck updated successfully!')
      return response
    } catch (error) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const deleteDeck = createAsyncThunk(
  'decks/deleteDeck',
  async (id, { rejectWithValue }) => {
    try {
      await deckService.deleteDeck(id)
      toast.success('Deck deleted successfully!')
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

const initialState = {
  decks: [],
  currentDeck: null,
  loading: false,
  error: null,
  pagination: null
}

const deckSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setCurrentDeck: (state, action) => {
      state.currentDeck = action.payload
    },
    clearCurrentDeck: (state) => {
      state.currentDeck = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDecks.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDecks.fulfilled, (state, action) => {
        state.loading = false
        state.decks = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchDecks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createDeck.fulfilled, (state, action) => {
        state.decks.unshift(action.payload.data)
      })
      .addCase(updateDeck.fulfilled, (state, action) => {
        const index = state.decks.findIndex(deck => deck._id === action.payload.data._id)
        if (index !== -1) {
          state.decks[index] = action.payload.data
        }
      })
      .addCase(deleteDeck.fulfilled, (state, action) => {
        state.decks = state.decks.filter(deck => deck._id !== action.payload)
      })
  }
})

export const { setCurrentDeck, clearCurrentDeck } = deckSlice.actions
export default deckSlice.reducer