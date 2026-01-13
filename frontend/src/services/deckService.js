import api from './api'

const deckService = {
  getDecks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return await api.get(`/decks?${queryString}`)
  },

  getDeck: async (id) => {
    return await api.get(`/decks/${id}`)
  },

  createDeck: async (deckData) => {
    return await api.post('/decks', deckData)
  },

  updateDeck: async (id, deckData) => {
    return await api.put(`/decks/${id}`, deckData)
  },

  deleteDeck: async (id) => {
    return await api.delete(`/decks/${id}`)
  }
}

export default deckService