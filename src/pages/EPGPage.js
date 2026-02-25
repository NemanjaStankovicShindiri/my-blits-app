/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getEpg } from '../api/epgMock'
import EPGCard from '../components/EPGCard'
import EPGHC from '../components/EPGHC'
import EPGVC from '../components/EPGVC'

export default Blits.Component('EPGPage', {
  components: {
    EPGVC,
    EPGHC,
  },
  template: `
    <Element w="1920" h="1080" :src="$src">
      <EPGVC :items="$data" ref="EPGVC" width="1824" height="605" x="96" y="475" />
    </Element>
  `,
  state() {
    return { data: [] }
  },
  hooks: {
    init() {
      const res = getEpg()

      const rowData = res.map((item) => ({
        rowH: 96,
        type: EPGHC,
        title: '',
        gap: 8,
        items: item.epgs.map((item) => ({
          width: this.getEpgWidth(item),
          type: EPGCard,
          data: item,
        })),
      }))
      this.data = rowData
    },
    ready() {
      this.$select('EPGVC').$focus()
    },
  },
  methods: {
    getEpgWidth(item) {
      const start = new Date(item.start)
      const stop = new Date(item.stop)
      const startTime = start.toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })
      const endTime = stop.toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })
      this.formattedTime = startTime + ' - ' + endTime
      const duration = (stop - start) / 60000
      const width = duration * 8.8 - 8
      return width
    },
  },
})
