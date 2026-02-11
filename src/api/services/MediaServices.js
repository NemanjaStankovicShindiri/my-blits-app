import tmdbApi from '../tmdbInstance'
export async function getMovies(slice = false) {
  try {
    const endpoints = [
      {
        title: 'Popular Movies',
        path: '/movie/popular',
        type: 'HorizontalContainer',
        width: 200,
        height: 200,
        rowH: 200,
        onEnter: (id) => {
          return `/details/${id}`
        },

        wBorder: true,
      },
      {
        title: 'Trending Movies',
        path: '/trending/movie/week',
        type: 'HorizontalContainer',
        width: 200,
        height: 600,
        onEnter: (id) => {
          return `/details/${id}`
        },
        rowH: 600,
        wBorder: false,
      },
      {
        title: 'Top Rated Movies',
        path: '/movie/top_rated',
        type: 'HorizontalContainer',
        width: 640,
        height: 360,
        itemOffset: 50,
        onEnter: (id) => {
          return `/details/${id}`
        },
        rowH: 360,
        wBorder: false,
      },
      {
        title: 'Upcoming Movies',
        path: '/movie/upcoming',
        type: 'HorizontalContainer',
        width: 200,
        height: 100,
        onEnter: (id) => {
          return `/details/${id}`
        },
        wBorder: false,
        rowH: 100,
      },
    ]

    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        const response = await tmdbApi.get(endpoint.path)

        const movies = (slice ? response.data.results.slice(0, 5) : response.data.results).map(
          (item) => ({
            onEnter: (id) => {
              return `/details/${id}`
            },
            type: 'Card',
            width: endpoint.width,
            height: endpoint.height,
            data: {
              title: item.title,
              poster_path: item.poster_path,
              overview: item.overview,
              backdrop_path: item.backdrop_path,
              id: item.id,
            },
          })
        )

        return {
          title: endpoint.title,
          items: movies,
          type: endpoint.type,
          rowH: endpoint.rowH,
          wBorder: endpoint.wBorder,
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
