import epgData from '../api/services/epg.json'
import epgSingleData from '../api/services/epgSingleChannelResponse.json'

export function getEpg(date, start = 0, limit = 6) {
  const filtered = epgData.filter((item) => item.date === date)
  return filtered.slice(start, start + limit)
}

export function getSingleEpg() {
  return epgSingleData
}
