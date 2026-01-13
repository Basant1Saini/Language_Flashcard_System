import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import deckReducer from './slices/deckSlice'
import flashcardReducer from './slices/flashcardSlice'
import progressReducer from './slices/progressSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    decks: deckReducer,
    flashcards: flashcardReducer,
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})