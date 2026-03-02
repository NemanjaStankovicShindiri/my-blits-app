import epgData from '../api/services/epg.json'
import epgSingleData from '../api/services/epgSingleChannelResponse.json'

export function getEpg(date) {
  return epgData.filter((item) => item.date === date)
}

export function getSingleEpg() {
  return epgSingleData
}
