// @ts-nocheck
import Blits from '@lightningjs/blits'
import HorizontalContainer from './HorizontalContainer'

export default Blits.Component('VerticalContainer', {
  components: { HorizontalContainer },
  template: `
    <Element :y.transition="$y">
      <Component
        :for="(item, index) in $items"
        is="$item.type"
        :y="$rowY($index)"
        :ref="'list-item-'+$index"
        :key="$index"
        :items="$item.items ? $item.items : $item"
        title="$item.title"
        autoScroll="true"
      />
    </Element>
  `,
  props: [
    'autoScroll',
    'autoscrollOffset',
    'itemOffset',
    'items',
    'looping',
    {
      key: 'gap',
      default: 100,
    },
  ],
  state() {
    return {
      focused: 0,
      y: 0,
    }
  },
  watch: {
    hasFocus(isFocused) {
      if (isFocused) this.$trigger('focused')
    },
    focused(value) {
      const focusItem = this.$select(`list-item-${value}`)
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
        this.scroll()
      }
    },
  },
  methods: {
    changeFocus(direction) {
      const nextFocus = this.looping
        ? (this.focused + direction + this.items.length) % this.items.length
        : Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      this.focused = nextFocus
    },
    rowOffset(index) {
      return index === 0
        ? 0
        : this.items
            .slice(0, index)
            .reduce((acc, curr) => acc + this.gap + (curr?.rowH ? curr?.rowH : curr.height), 0)
    },
    rowY(index) {
      return this.rowOffset(index)
    },
    scroll() {
      if (this.autoScroll) {
        this.y = -this.rowOffset(this.focused)
      }
    },
  },
  input: {
    up() {
      this.changeFocus(-1)
    },
    down() {
      this.changeFocus(1)
    },
    enter() {
      console.log('Selected item:', this.items[this.focused])
    },
  },
})
