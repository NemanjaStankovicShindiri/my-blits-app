// @ts-nocheck
import Blits from '@lightningjs/blits'
import Card from './Card'
import Button from './Button'

export default Blits.Component('HorizontalContainer', {
  components: { Card, Button },
  template: `
    <Element :x.transition="$x" ref="container">
      <Text content="$title" color="#FFF" h="50" />
      <Component
        :for="(item, index) in $items"
        :range="{from: $rangeFrom, to: $rangeTo}"
        is="$item.type"
        :x="$rowX($index)"
        :y="$title ? 50 : 0"
        :ref="'list-item-'+$index"
        :key="$index"
        :items="$item.items ? $item.items : $item"
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
    'title',
    {
      key: 'gap',
      default: 50,
    },
  ],
  state() {
    return {
      focused: 0,
      x: 0,
      rangeFrom: 0,
      rangeTo: 5,
    }
  },
  hooks: {
    init() {
      console.log(this.items)
    },
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
      console.log('Scroll from index ', Math.min(-1, this.lastIndexToScroll - 1 - this.focused))
      this.rangeTo = Math.min(this.items.length, value + 6)
    },
  },
  computed: {
    rangeStart() {
      console.log('Previous ', this.focused - 1)
      return this.focused - 1
    },
    rangeEnd() {
      console.log('Next', this.focused + 1)
      return this.focused + 5
    },
    itemTotalWidth() {
      return this.items[0].width + this.gap
    },
    visibleCount() {
      return 1770 / this.itemTotalWidth
    },
    lastIndexToScroll() {
      return this.items.length - this.visibleCount
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
        : this.items.slice(0, index).reduce((acc, curr) => {
            //check if this item has more childs inside - first value would be used horizontal - vertical, other in vertical - horiz
            const w = curr?.items ? curr?.items[0].width : curr.width
            return acc + w + this.gap
          }, 0)
    },
    rowX(index) {
      return this.rowOffset(index)
    },
    scroll() {
      if (this.autoScroll) {
        // this.x = -this.rowOffset(this.focused)  //stara logika
        this.x =
          0 -
          (this.lastIndexToScroll < 0
            ? 0
            : Math.min(this.focused, this.lastIndexToScroll) * this.itemTotalWidth)
      }
      console.log(this.x)
    },
  },
  input: {
    left() {
      this.changeFocus(-1)
    },
    right() {
      this.changeFocus(1)
    },
    enter() {
      console.log('Selected item:', this.items[this.focused])
    },
  },
})
