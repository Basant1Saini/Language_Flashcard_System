import api from './api'

const flashcardService = {
  getFlashcards: async (deckId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return await api.get(`/flashcards/${deckId}?${queryString}`)
  },

  createFlashcard: async (flashcardData) => {
    return await api.post('/flashcards', flashcardData)
  },

  updateFlashcard: async (id, flashcardData) => {
    return await api.put(`/flashcards/${id}`, flashcardData)
  },

  deleteFlashcard: async (id) => {
    return await api.delete(`/flashcards/${id}`)
  },

  reviewFlashcard: async (id, reviewData) => {
    return await api.post(`/flashcards/${id}/review`, reviewData)
  }
}

export default flashcardService