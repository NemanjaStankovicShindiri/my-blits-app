/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getSingleEpg } from '../api/epgMock'
import EPGCard from '../components/EPGCard'
import EPGHC from '../components/EPGHC'
import EPGVC from '../components/EPGVC'

export default Blits.Component('EPGPage', {
  components: {
    EPGVC,
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
      const res = getSingleEpg()
      //   this.data = res.data.map((item) => {
      //     return {}
      //   })
      const data = [
        {
          rowH: 96,
          type: EPGHC,
          title: '',
          gap: 24,
          items: res.map((item) => ({ data: item, type: EPGCard })),
        },
      ]
      this.data = data
    },
    ready() {
      console.log(this.$select('EPGVC'))
      this.$select('EPGVC').$focus()
    },
  },
})
