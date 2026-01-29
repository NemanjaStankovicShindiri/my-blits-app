import axios from 'axios'
const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'c1e672f11dd715c09878f04137c94ba1',
  },
})

export default tmdbApi
