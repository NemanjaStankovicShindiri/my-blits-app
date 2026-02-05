import { CARD_TYPE } from './utils/cardWidth'

const API_KEY = 'c1e672f11dd715c09878f04137c94ba1'
const BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

// export async function fetchTMDBData() {
//   try {
//     // Define the endpoints you want to fetch
//     const endpoints = [
//       {
//         name: 'Popular Movies',
//         url: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
//         type: CARD_TYPE.CARD,
//         wBorder: true,
//       },
//       {
//         name: 'Trending Movies',
//         url: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
//         type: { type: 'Card', width: 200, height: 600 },
//         wBorder: true,
//       },
//       {
//         name: 'Top Rated Movies',
//         url: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
//         type: { type: 'Card', width: 640, height: 360, itemOffset: 50 },
//         wBorder: true,
//       },
//       {
//         name: 'Upcoming Movies',
//         url: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
//         type: { type: 'Card', width: 200, height: 100 },
//         wBorder: true,
//       },
//     ]

//     // Fetch all endpoints in parallel
//     const results = await Promise.all(
//       endpoints.map(async (endpoint) => {
//         const response = await fetch(endpoint.url)
//         const data = await response.json()
//         return {
//           name: endpoint.name,
//           movies: data.results || [],
//           type: endpoint.type,
//           wBorder: endpoint.wBorder,
//         }
//       })
//     )

//     return results // Array of { name, movies[] }
//   } catch (error) {
//     console.error('Error fetching TMDB data:', error)
//     return []
//   }
// }
export function getBackdropUrl(backdropPath, size = 'w1280') {
  return `${TMDB_IMAGE_BASE}/${size}${backdropPath}?api_key=${API_KEY}`
}
