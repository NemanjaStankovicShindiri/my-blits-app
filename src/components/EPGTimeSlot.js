import Blits from '@lightningjs/blits'
import { EPG_LAYOUT } from '../utils/EPG_LAYOUT'

export default Blits.Component('EPGTimeSlot', {
  props: ['items', 'gap'],
  template: `
    <Element
      :width="$items.width"
      height="48"
      color="#221435"
      :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]"
    >
      <Text :content="$items.data.title" size="14" y="24" x="12" mount="{y: 0.5}" font="PoppinsMedium" />
    </Element>`,
  computed: {
    width() {
      const width = 30 * EPG_LAYOUT.MINUTE_WIDTH - this.gap
      this.$size({ w: width })
      return width
    },
  },
})
