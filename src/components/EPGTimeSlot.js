import Blits from '@lightningjs/blits'

export default Blits.Component('EPGTimeSlot', {
  props: ['key', 'items', 'gap'],
  template: `
    <Element
      :width="$width"
      height="48"
      color="#221435"
      :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]"
    >
      <Layout direction="vertical" padding="24"
        ><Text :content="$formattedTime" font="PoppinsMedium" size="16" /><Text
          :content="$items.data.title"
          size="14"
          font="PoppinsMedium"
      /></Layout>
    </Element>`,
  computed: {
    width() {
      const width = 30 * 8.8 - this.gap
      this.$size({ w: width })
      return width
    },
  },
})
