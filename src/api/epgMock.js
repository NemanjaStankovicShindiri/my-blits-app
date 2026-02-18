import epgData from '../api/services/epgResponse.json'
import epgSingleData from '../api/services/epgSingleChannelResponse.json'

export function getEpg() {
  return epgData
}

export function getSingleEpg() {
  return epgSingleData
}
