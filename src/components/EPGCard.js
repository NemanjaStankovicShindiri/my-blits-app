import Blits from '@lightningjs/blits'

export default Blits.Component('EPGCard', {
  props: ['key', 'items'],
  template: `
    <Element
      :width="$width"
      height="96"
      :color="$hasFocus?'#7D34C6':'#221435'"
      :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]"
    >
      <Layout direction="vertical" padding="24"
        ><Text :content="$formattedTime" font="PoppinsMedium" size="16" /><Text
          content="$items.data.title"
          size="14"
          font="PoppinsMedium"
      /></Layout>
    </Element>`,
  state() {
    return {
      w: 0,
      formattedTime: '',
    }
  },
  computed: {
    width() {
      // const paddingX = 20 * 2
      // const gap = 20
      const start = new Date(this.items.data.start)
      const stop = new Date(this.items.data.stop)
      const startTime = start.toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      const endTime = stop.toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      this.formattedTime = startTime + ' - ' + endTime
      const durationMS = stop - start
      this.w = durationMS / 60000
      this.$size({ w: this.w })
      return this.w
    },
  },
  hooks: {
    init() {
      // const start = new Date(this.items.data.start)
      // const stop = new Date(this.items.data.stop)
      // const durationMS = stop - start
      // this.w = durationMS / 60000
      // console.log('asdf w: ', this.w)
    },
  },
})
