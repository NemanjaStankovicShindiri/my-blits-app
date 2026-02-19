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
    return { data: [] }
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
})
