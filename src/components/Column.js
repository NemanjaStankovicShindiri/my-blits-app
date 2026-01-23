import Blits from '@lightningjs/blits'
import CardRow from './CardRow'

export default Blits.Component('Column', {
  props: ['items'],
  components: { CardRow },
  template: `
    <Element w="1920" h="1920"
      ><Element :for="(item, index) in $items" w="1792" h="404" x="64" :y="$index*340">
        <Text w="103" h="29" :content="$item.name" font="InterBold" size="24" letterspacing="6" />
        <Element w="100%" h="359" placement="bottom" overflow="true" ref="backgroundEl"
          ><CardRow :movies="$item.movies" :ref="'cardRow'+$index" w="100%" h="359" placement="bottom"
        /></Element> </Element
    ></Element>`,
  state() {
    return {
      focused: 0,
    }
  },
  hooks: {
    ready() {
      console.log('Ready triggers')
    },
    focus() {
      this.$trigger('focused')
    },
  },
  watch: {
    focused(value) {
      console.log('Column triggers')
      const focusedItem = this.$select('cardRow' + value)
      if (focusedItem && focusedItem.$focus) {
        focusedItem.$focus()
      }
    },
  },
  input: {
    up() {
      this.focused = Math.max(this.focused - 1, 0)
      this.scroll()
    },
    down() {
      this.focused = Math.min(this.focused + 1, this.items.length - 1)
      this.scroll()
    },
  },
  methods: {
    scroll() {
      console.log('TO DO')
    },
  },
})
