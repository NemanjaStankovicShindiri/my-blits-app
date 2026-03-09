/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getEpg } from '../api/epgMock'
import EPGCard from '../components/EPGCard'
import EPGHC from '../components/EPGHC'
import EPGVC from '../components/EPGVC'
import { EPG_LAYOUT } from '../utils/EPG_LAYOUT'

export default Blits.Component('EPGPage', {
  components: {
    EPGVC,
  },
  template: `
    <Element w="1920" h="1080">
      <Element w="300" h="100"><Text size="100" color="red" :content="$fps" /></Element>
      <EPGVC :items="$data" ref="EPGVC" width="1824" height="605" x="96" y="475" />
    </Element>
  `,
  state() {
    return { data: [], currentDate: '2026-03-02', loadedDates: [], fps: 0 }
  },
  hooks: {
    fpsUpdate(fps) {
      this.fps = fps
    },
    init() {
      const res = getEpg(this.currentDate)
      this.loadedDates.push(this.currentDate)
      this.data = res.map((item) => ({
        channel_id: item.channel_id,
        rowH: 96,
        type: EPGHC,
        rowGap: 4,
        itemsGap: 4,
        items: item.epgs.map((epg) => ({
          key: `${epg.id}_${epg.start}`,
          width: this.getEpgWidth(epg),
          type: EPGCard,
          data: epg,
        })),
      }))
    },
    ready() {
      this.$select('EPGVC').$focus()
    },
  },
  methods: {
    getDate(addDay) {
      const date = new Date(this.currentDate + 'T00:00:00Z')
      date.setUTCDate(date.getUTCDate() + addDay)
      this.currentDate = date.toISOString().slice(0, 10)
      while (this.loadedDates.includes(this.currentDate)) {
        date.setUTCDate(date.getUTCDate() + addDay)
        this.currentDate = date.toISOString().slice(0, 10)
      }
      this.loadedDates.push(this.currentDate)
      return date.toISOString().slice(0, 10)
    },
    loadMoreData(addDay) {
      const newDate = this.getDate(addDay)
      const res = getEpg(newDate)

      if (res.length === 0) return false

      const channelMap = new Map(res.map((r) => [r.channel_id, r]))

      const pom = this.data.map((item) => {
        const channelData = channelMap.get(item.channel_id)

        const newItems =
          channelData?.epgs.map((epg) => ({
            key: `${epg.id}_${epg.start}`,

            width: this.getEpgWidth(epg),
            type: EPGCard,
            data: { ...epg },
          })) || []
        const combined =
          addDay === 1
            ? [...item.items.map((i) => ({ ...i })), ...newItems]
            : [...newItems, ...item.items.map((i) => ({ ...i }))]
        return {
          ...item,
          items: addDay === 1 ? [...item.items, ...newItems] : [...newItems, ...item.items],
        }
      })
      this.data = pom
      return true
    },
    getEpgWidth(item) {
      const start = new Date(item.start)
      const stop = new Date(item.stop)
      const duration = (stop - start) / 60000
      const width = Math.max(0, duration * EPG_LAYOUT.MINUTE_WIDTH - 4)
      return width
    },
  },
})
