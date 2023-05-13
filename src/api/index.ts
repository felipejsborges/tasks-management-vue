import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

api.interceptors.request.use(
  function (config) {
    // Set token before request is sent
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // If token is not valid, redirect to login
    const tokenIsMissingOrExpired =
      error?.response?.data?.code === 'token_not_valid' ||
      error?.response?.data?.detail === 'Authentication credentials were not provided.'
    if (tokenIsMissingOrExpired) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
