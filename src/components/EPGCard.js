import Blits from '@lightningjs/blits'

export default Blits.Component('EPGCard', {
  props: ['items'],
  template: `
    <Element
      :width="$items.width"
      height="96"
      :color="$hasFocus?'#7D34C6':'#221435'"
      :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]"
    >
      <Element :show="($items.width - $paddingX)> 30"
        ><Text
          x="24"
          y="19.5"
          :content="$formattedTime"
          font="PoppinsMedium"
          size="16"
          textoverflow="true"
          :maxwidth="$items.width - 2 * $paddingX"
          maxlines="1" /><Text
          y="42.5"
          x="24"
          :content="$items.data.title"
          size="14"
          font="PoppinsMedium"
          textoverflow="true"
          :maxwidth="$items.width - 2 * $paddingX"
          maxlines="1"
      /></Element>
    </Element>`,
  state() {
    return {
      formattedTime: '',
      paddingX: 24,
    }
  },
  watch: {
    items() {
      console.group('label')
      console.log(this.formattedTime)
      console.log(this.items)
      console.groupEnd()
    },
  },
  hooks: {
    ready() {
      console.log('new Card')
      const timeFormatter = new Intl.DateTimeFormat('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })

      const formatTime = (iso) => timeFormatter.format(new Date(iso))
      this.formattedTime = `${formatTime(this.items.data.start)} - ${formatTime(this.items.data.stop)}`
    },
  },
})
