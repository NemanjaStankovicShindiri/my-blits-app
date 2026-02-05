import HorizontalContainer from '../../components/HorizontalContainer'
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

    requests.push(tmdbApi.get(`/movie/${id}/credits`))

    const responses = await Promise.all(requests)
    const res = responses.slice(0, 3).map((item, index) => {
      return {
        title: railNames[index],
        type: 'HorizontalContainer',
        rowH: 216,
        items: item.data.results.map((singleMovie) => {
          return {
            data: singleMovie,
            type: 'Card',
            width: 330,
            height: 198,
          }
        }),
      }
    })
    const resCast = {
      title: 'Tuljani',
      rowH: 216,
      type: 'HorizontalContainer',
      items: responses[3].data.cast.slice(0, 5).map((item) => {
        return {
          data: { backdrop_path: item.profile_path },
          id: item.id,
          text: item.name,
          subText: item.character,
          type: 'Card',
          width: 170,
          height: 170,
          radius: 100,
        }
      }),
    }
    res.push(resCast)
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
