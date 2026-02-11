// @ts-nocheck
import Blits from '@lightningjs/blits'
import Card from './Card'
import Button from './Button'
import DetailsButton from './DetailsButton'

export default Blits.Component('HorizontalContainer', {
  components: { Card, Button, DetailsButton },
  template: `
    <Element>
      <Text content="$title" color="#FFF" h="50" />
      <Element
        :width="$containerWidth+2*$padding"
        :height="$items[0].height+2*$padding"
        :y="$title ? 50 : 0"
        :clipping="$containerBorder"
        :effects="$containerBorder
      ? [
      { type: 'radius', props: { radius: 50 } },
      { type: 'border', props: { width: 2, color: '#FFFFFF' } }
    ]
      : []"
      >
        <Element :x.transition="$x" ref="container" y="8">
          <Component
            :for="(item, index) in $items"
            :range="{from: $rangeFrom, to: $rangeTo}"
            is="$item.type"
            :x="$rowX($index)"
            :ref="'list-item-'+$index"
            :key="$index"
            :items="$item.items ? $item.items : $item"
            autoScroll="true"
        /></Element>
      </Element>
    </Element>
  `,
  props: [
    'autoScroll',
    'autoscrollOffset',
    'itemOffset',
    'items',
    'looping',
    { key: 'containerWidth', default: 1770 },
    'title',
    {
      key: 'gap',
      default: 50,
    },
    { key: 'containerBorder', default: false },
    { key: 'padding', default: 8 },
  ],
  state() {
    return {
      focused: 0,
      x: 0,
      rangeFrom: 0,
      rangeTo: this.visibleCount,
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
      this.rangeFrom = this.focused + Math.min(-1, this.lastIndexToScroll - 1 - this.focused)
      this.rangeTo = this.focused + this.visibleCount
    },
  },

  computed: {
    itemTotalWidth() {
      return this.items[0].width + this.gap
    },
    visibleCount() {
      return (this.containerWidth || 1770) / this.itemTotalWidth
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
          this.padding -
          (this.lastIndexToScroll < 0
            ? this.padding
            : Math.min(this.focused, this.lastIndexToScroll) * this.itemTotalWidth)
      }
    },
  },
  input: {
    left() {
      this.changeFocus(-1)
    },
    right() {
      this.changeFocus(1)
    },
  },
})
