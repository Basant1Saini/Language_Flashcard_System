import api from './api'

const progressService = {
  getProgress: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return await api.get(`/users/progress?${queryString}`)
  },

  getStats: async () => {
    return await api.get('/users/progress/stats')
  }
}

export default progressService