import tmdbApi from '../tmdbInstance'
export async function getMovies(slice = false) {
  try {
    const endpoints = [
      {
        name: 'Popular Movies',
        path: '/movie/popular',
        type: { type: 'Card', width: 200, height: 300 },
      },
      {
        name: 'Trending Movies',
        path: '/trending/movie/week',
        type: { type: 'Card', width: 200, height: 600 },
      },
      {
        name: 'Top Rated Movies',
        path: '/movie/top_rated',
        type: { type: 'Card', width: 640, height: 360, itemOffset: 50 },
      },
      {
        name: 'Upcoming Movies',
        path: '/movie/upcoming',
        type: { type: 'Card', width: 200, height: 100 },
      },
    ]

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        const response = await tmdbApi.get(endpoint.path)

        const movies = (slice ? response.data.results.slice(0, 5) : response.data.results).map(
          (item) => ({
            title: item.title,
            poster_path: item.poster_path,
            overview: item.overview,
            backdrop_path: item.backdrop_path,
            id: item.id,
          })
        )

        return {
          name: endpoint.name,
          movies,
          type: endpoint.type,
        }
      })
    )

    return results
  } catch (error) {
    console.error('Error fetching movie sections:', error)
    return []
  }
}

export async function getTV(slice) {
  try {
    const result = await tmdbApi.get('/discover/tv')
    const returnValue = slice ? result.data.results.slice(0, 5) : result.data.results
    return returnValue.map((item) => ({
      title: item.name,
      poster_path: item.poster_path,
      overview: item.overview,
      backdrop_path: item.backdrop_path,
      id: item.id,
    }))
  } catch (error) {
    console.error(error)
    throw error
  }
}
