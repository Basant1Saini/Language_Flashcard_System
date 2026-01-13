import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import flashcardService from '../../services/flashcardService'
import toast from 'react-hot-toast'

export const fetchFlashcards = createAsyncThunk(
  'flashcards/fetchFlashcards',
  async ({ deckId, params }, { rejectWithValue }) => {
    try {
      return await flashcardService.getFlashcards(deckId, params)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const createFlashcard = createAsyncThunk(
  'flashcards/createFlashcard',
  async (flashcardData, { rejectWithValue }) => {
    try {
      const response = await flashcardService.createFlashcard(flashcardData)
      toast.success('Flashcard created successfully!')
      return response
    } catch (error) {
      const message = error.response?.data?.message || error.message
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const reviewFlashcard = createAsyncThunk(
  'flashcards/reviewFlashcard',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      return await flashcardService.reviewFlashcard(id, reviewData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const initialState = {
  flashcards: [],
  currentCard: null,
  studySession: {
    cards: [],
    currentIndex: 0,
    isActive: false
  },
  loading: false,
  error: null
}

const flashcardSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    startStudySession: (state, action) => {
      state.studySession = {
        cards: action.payload,
        currentIndex: 0,
        isActive: true
      }
    },
    nextCard: (state) => {
      if (state.studySession.currentIndex < state.studySession.cards.length - 1) {
        state.studySession.currentIndex++
      }
    },
    endStudySession: (state) => {
      state.studySession = {
        cards: [],
        currentIndex: 0,
        isActive: false
      }
    },
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlashcards.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFlashcards.fulfilled, (state, action) => {
        state.loading = false
        state.flashcards = action.payload.data
      })
      .addCase(fetchFlashcards.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createFlashcard.fulfilled, (state, action) => {
        state.flashcards.unshift(action.payload.data)
      })
      .addCase(reviewFlashcard.fulfilled, (state, action) => {
        const index = state.flashcards.findIndex(card => card._id === action.payload.data.flashcard._id)
        if (index !== -1) {
          state.flashcards[index] = action.payload.data.flashcard
        }
      })
  }
})

export const { startStudySession, nextCard, endStudySession, setCurrentCard } = flashcardSlice.actions
export default flashcardSlice.reducer