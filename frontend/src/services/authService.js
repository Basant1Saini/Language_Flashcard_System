import api from './api'

const authService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData)
  },

  login: async (userData) => {
    return await api.post('/auth/login', userData)
  },

  loadUser: async () => {
    return await api.get('/auth/profile')
  },

  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData)
  }
}

export default authService