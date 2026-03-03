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
      <EPGVC :items="$data" ref="EPGVC" width="1824" height="605" x="96" y="475" />
    </Element>
  `,
  state() {
    return { data: [], currentDate: '2026-03-02' }
  },
  hooks: {
    init() {
      const res = getEpg(this.currentDate)

      this.data = res.map((item) => ({
        channel_id: item.channel_id,
        rowH: 96,
        type: EPGHC,
        rowGap: 4,
        itemsGap: 4,
        items: item.epgs.map((epg) => ({
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
      return date.toISOString().slice(0, 10)
    },
    loadMoreData(addDay) {
      const res = getEpg(this.getDate(addDay))

      this.data = this.data.map((item) => {
        const channelData = res.find((r) => r.channel_id === item.channel_id)

        return {
          ...item,
          items: [
            ...item.items,
            ...(channelData?.epgs.map((epg) => ({
              width: this.getEpgWidth(epg),
              type: EPGCard,
              data: epg,
            })) || []),
          ],
        }
      })
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
