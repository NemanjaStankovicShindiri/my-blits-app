import tmdbApi from '../tmdbInstance'

export async function getMovieDetails(id) {
  const response = await tmdbApi.get('/movie/' + id)
  return response.data
}

export async function getSimilarMovies5Pages(id) {
  try {
    const requests = []

    const railNames = ['Trailers', 'Bonus', 'Related']

    for (let page = 1; page <= 3; page++) {
      requests.push(
        tmdbApi.get(`/movie/${id}/similar`, {
          params: { page },
        })
      )
    }

    const responses = await Promise.all(requests)
    const res = responses.map((item, index) => ({
      name: railNames[index],
      movies: item.data.results,
      type: { type: 'Card', width: 360, height: 216 },
    }))
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
