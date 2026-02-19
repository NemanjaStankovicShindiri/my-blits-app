import Blits from '@lightningjs/blits'

export default Blits.Component('EPGCard', {
  props: ['key', 'items', 'gap'],
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
      const width = duration * 8.8 - this.gap
      return width
    },
  },
  hooks: {
    ready() {
      const start = new Date(this.items.data.start)
      const stop = new Date(this.items.data.stop)

      const duration = (stop - start) / 60000
      const w = duration * 8.8 - this.gap

      this.$size({ w })

      this.formattedTime =
        start.toLocaleTimeString('sr-RS', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        }) +
        ' - ' +
        stop.toLocaleTimeString('sr-RS', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        })
    },
  },
})
