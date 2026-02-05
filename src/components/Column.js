import Blits from '@lightningjs/blits'
import List from './List'
import HorizontalContainer from './HorizontalContainer'

export default Blits.Component('Column', {
  props: ['items', 'itemOffset', 'autoScroll', 'looping'],
  components: { List, HorizontalContainer },
  template: `
    <Element w="1920" :y.transition="$y" ref="columnCont"
      ><Element :for="(item, index) in $items" x="64" :y="$rowY($index)">
        <Text w="103" h="29" :content="$item.name" font="InterBold" size="24" letterspacing="6" />
        <Element w="100%" :h="$item.height" y="39" overflow="true" ref="backgroundEl"
          ><HorizontalContainer
            :items="$item.movies"
            :type="$item.type"
            :itemWidth="$item.width"
            :itemHeight="$item.height"
            :ref="'cardRow'+$index"
            autoScroll="true"
            looping="true"
            :itemOffset="$item.itemOffset || 30"
            :wBorder="$item.wBorder"
        /></Element> </Element
    ></Element>`,
  state() {
    return {
      y: 0,
      focused: 0,
    }
  },
  hooks: {
    async init() {
      this.$trigger('focused')
    },
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
      this.focused =
        this.focused === 0 && this.looping
          ? (this.focused = this.items.length - 1)
          : Math.max(this.focused - 1, 0)
      this.scroll()
    },
    down() {
      this.focused =
        this.focused === this.items.length - 1 && this.looping
          ? (this.focused = 0)
          : Math.min(this.focused + 1, this.items.length - 1)
      this.scroll()
    },
  },
  methods: {
    rowY(index) {
      return index === 0
        ? 0
        : this.items
            .slice(0, index)
            .reduce((sum, i) => sum + 29 + 24 + i.height + this.itemOffset, 0)
    },
    scroll() {
      if (this.autoScroll) {
        this.y =
          this.focused === 0
            ? 0
            : -this.items
                .slice(0, this.focused)
                .reduce((sum, i) => sum + 29 + 24 + i.type.height + this.itemOffset, 0)
      }
    },
  },
})
