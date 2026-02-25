import Blits from '@lightningjs/blits'

export default Blits.Component('EPGCard', {
  props: ['key', 'items', 'gap'],
  template: `
    <Element
      :width="$items.width"
      height="96"
      :color="$hasFocus?'#7D34C6':'#221435'"
      :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]"
    >
      <Element
        ><Text
          x="24"
          y="19.5"
          :content="$items.width-24>30?$formattedTime:''"
          font="PoppinsMedium"
          size="16"
          textoverflow="true"
          :maxwidth="$items.width - 48"
          maxlines="1" /><Text
          y="42.5"
          x="24"
          :content="$items.width-24>30?$items.data.title:''"
          size="14"
          font="PoppinsMedium"
          textoverflow="true"
          :maxwidth="$items.width - 48"
          maxlines="1"
      /></Element>
    </Element>`,
  state() {
    return {
      formattedTime: '',
    }
  },
  hooks: {
    ready() {
      const start = new Date(this.items.data.start)
      const stop = new Date(this.items.data.stop)

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
