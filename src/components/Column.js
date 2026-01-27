import Blits from '@lightningjs/blits'
import CardRow from './CardRow'

export default Blits.Component('Column', {
  props: ['items', 'rowSpacing'],
  components: { CardRow },
  template: `
    <Element w="1920" :y.transition="$y"
      ><Element :for="(item, index) in $items" x="64" :y="$rowY($index)">
        <Text w="103" h="29" :content="$item.name" font="InterBold" size="24" letterspacing="6" />
        <Element w="100%" :h="$item.type.height" y="39" overflow="true" ref="backgroundEl"
          ><CardRow :movies="$item.movies" :type="$item.type" :ref="'cardRow'+$index" w="100%" itemSpacing="30"
        /></Element> </Element
    ></Element>`,
  state() {
    return {
      y: 0,
      focused: 0,
    }
  },
  hooks: {
    focus() {
      this.$trigger('focused')
    },
  },
  watch: {
    focused(value) {
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
    rowY(index) {
      return index === 0
        ? 0
        : this.items
            .slice(0, index)
            .reduce((sum, i) => sum + 29 + 24 + i.type.height + this.rowSpacing, 0)
    },
    scroll() {
      this.y =
        this.focused === 0
          ? 0
          : -this.items
              .slice(0, this.focused)
              .reduce((sum, i) => sum + 29 + 24 + i.type.height + this.rowSpacing, 0)
    },
  },
})
