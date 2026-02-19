/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getEpg, getSingleEpg } from '../api/epgMock'
import EPGCard from '../components/EPGCard'
import EPGHC from '../components/EPGHC'
import EPGVC from '../components/EPGVC'
import EPGTimeSlot from '../components/EPGTimeSlot'

export default Blits.Component('EPGPage', {
  components: {
    EPGVC,
    EPGHC,
  },
  template: `
    <Element w="1920" h="1080" :src="$src">
      <EPGVC :items="$data" ref="EPGVC" />
    </Element>
  `,
  state() {
    return { data: [], x: 0 }
  },
  hooks: {
    init() {
      const res = getEpg()

      const timeArray = []
      for (let hour = 0; hour < 24; hour++) {
        // :00
        timeArray.push(`${hour.toString().padStart(2, '0')}:00`)
        // :30
        timeArray.push(`${hour.toString().padStart(2, '0')}:30`)
      }

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

      const data = [
        {
          rowH: 48,
          type: EPGHC,
          title: '',
          gap: 4,
          items: timeArray.map((time) => ({
            type: EPGTimeSlot,
            width: 30 * 8.8 - 4,
            data: { title: time },
          })),
        },
        ...rowData,
      ]
      this.data = data
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
