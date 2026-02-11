import tmdbApi from '../tmdbInstance'

export async function getMovieDetails(id) {
  const response = await tmdbApi.get('/movie/' + id)
  return response.data
}

export async function getSimilarMovies5Pages(id) {
  try {
    const requests = []

    const railNames = ['Trailers', 'Bonus', 'Related']

    const singleMovieRequest = tmdbApi.get('/movie/684218')

    for (let page = 1; page <= 3; page++) {
      requests.push(
        tmdbApi.get(`/movie/${id}/similar`, {
          params: { page },
        })
      )
    }

    requests.push(tmdbApi.get(`/movie/${id}/credits`))
    let res = []
    const responses = await Promise.all([...requests, singleMovieRequest])

    const singleMovie = responses[responses.length - 1].data

    const topRail = {
      title: 'Featured Movie',
      type: 'HorizontalContainer',
      containerBorder: false,
      containerWidth: 1770,
      rowH: 216,
      items: [
        {
          data: singleMovie,
          type: 'Card',
          width: 330,
          height: 198,
          onEnter: (id) => `/details/${id}`,
        },
      ],
    }

    const actionButtons = {
      rowH: 63,
      type: 'HorizontalContainer',
      title: '',
      gap: 24,
      items: [
        {
          data: { src: 'assets/detailsButtons/play.png', text: 'Play' },
          type: 'DetailsButton',
          width: 63,
          height: 63,
        },
        {
          data: {
            src: 'assets/detailsButtons/add.png',
            text: 'Add to watchlist',
          },
          type: 'DetailsButton',
          width: 63,
          height: 63,
        },
        {
          data: {
            src: 'assets/detailsButtons/flag.png',
            text: 'Report',
          },
          type: 'DetailsButton',
          width: 63,
          height: 63,
        },
      ],
    }
    res.push(actionButtons)

    const seasonsButtons = {
      rowH: 45,
      type: 'HorizontalContainer',
      title: '',
      containerBorder: true,
      gap: 8,
      items: [
        {
          data: { text: 'Season 5' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 6' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 7' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 8' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 9' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 10' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 11' },
          type: 'Button',
          width: 102,
          height: 45,
        },
        {
          data: { text: 'Season 12' },
          type: 'Button',
          width: 102,
          height: 45,
        },
      ],
      containerWidth: 322,
    }
    res.push(seasonsButtons)
    res.push(topRail)

    const similarMovies = responses.slice(0, 3).map((item, index) => {
      return {
        title: railNames[index],
        type: 'HorizontalContainer',
        containerBorder: false,
        containerWidth: 1770,
        rowH: 216,
        items: item.data.results.map((singleMovie) => {
          return {
            data: singleMovie,
            type: 'Card',
            width: 330,
            height: 198,
            onEnter: (id) => {
              return `/details/${id}`
            },
          }
        }),
      }
    })

    res.push(...similarMovies)

    const resCast = {
      title: 'Tuljani',
      rowH: 216,
      type: 'HorizontalContainer',
      containerWidth: 1770,
      items: responses[3].data.cast.slice(0, 7).map((item) => {
        return {
          data: { backdrop_path: item.profile_path },
          id: item.id,
          text: item.name,
          subText: item.character,
          type: 'Card',
          onEnter: (id) => {
            return `/person/${id}`
          },
          width: 170,
          height: 170,
          radius: 100,
        }
      }),
    }
    res.push(resCast)
    res = res.filter((item) => item.items.length != 0)
    return res
  } catch (error) {
    console.error('Error fetching similar movies (5 pages):', error)
    return []
  }
}
export async function getSeriesDetails(seriesId) {
  const response = await tmdbApi.get('/tv/' + seriesId)
  const {
    name: title,
    genres,
    episode_run_time: runtime,
    origin_country,
    first_air_date: release_date,
    poster_path,
    overview,
    backdrop_path,
    id,
    vote_average,
  } = response.data
  return {
    title,
    genres,
    runtime,
    origin_country,
    release_date,
    poster_path,
    overview,
    backdrop_path,
    id,
    vote_average,
  }
}

export async function getAgeRestriction(id, isMovie) {
  const response = await tmdbApi.get(
    (isMovie ? '/movie/' : '/tv/') + id + (isMovie ? '/release_dates' : '/content_ratings')
  )
  return response.data
}

export async function getCredits(id) {
  const response = await tmdbApi.get('/movie/' + id + '/credits')
  return {
    director: response.data.crew
      .filter((item) => item.job === 'Director')
      .map((item) => item.name)
      .join(', '),
    cast: response.data.cast.map((item) => item.name).join(', '),
  }
}

export async function getTVCredits(id) {
  const response = await tmdbApi.get('/tv/' + id + '/aggregate_credits')
  const directors = response.data.crew.filter((item) =>
    item.jobs.some((job) => job.job === 'Director')
  )
  const cast = response.data.cast
  return {
    director: directors.map((item) => item.name).join(', '),
    cast: cast.map((item) => item.name).join(', '),
  }
}
