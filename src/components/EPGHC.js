// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGCard from './EPGCard'

export default Blits.Component('HorizontalContainer', {
  components: { EPGCard },
  template: `
    <Element x="96" width="1824" height="0">
      <Element :x.transition="$rowsX" direction="horizontal" ref="container" :gap="$gap">
        <Component
          :for="(item, index) in $items"
          is="$item.type"
          :x="$rowX($index)"
          :ref="'list-item-'+$index"
          :key="$index"
          :items="$item.items ? $item.items : $item"
          :gap="$gap"
        /> </Element
    ></Element>
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
    { key: 'padding', default: 0 },
    'rowsX',
  ],
  state() {
    return {
      focused: 0,
      x: this.rowsX,
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
      const nextPotentionalIndex = Math.max(
        0,
        Math.min(this.focused + direction, this.items.length - 1)
      )

      const relX = this.rowOffset(nextPotentionalIndex) + this.rowsX
      const epgCardW = this.items[nextPotentionalIndex].width
      if (direction === 1) {
        if (relX > 1824 || this.focused === nextPotentionalIndex) {
          //drugo
          this.$emit('scrollRows', -264)
        } else {
          this.focused = nextPotentionalIndex
        }
      } else {
        if (relX + epgCardW + this.gap >= 0 && this.focused !== 0) {
          this.focused = nextPotentionalIndex
        } else {
          this.$emit('scrollRows', 264)
        }
      }
    },
    isIndexInViewport(index) {
      const item = this.$select(`list-item-${index}`)
      console.log('Next item to focus', item)
    },
    rowOffset(index) {
      return index === 0
        ? 0
        : this.items.slice(0, index).reduce((acc, curr) => {
            const w = curr?.items ? curr?.items?.[0]?.width : curr?.width

            return acc + (w || 0) + this.gap
          }, 0)
    },
    rowX(index) {
      return index === 0
        ? 0
        : this.items.slice(0, index).reduce((acc, curr) => {
            const w = curr?.items ? curr?.items?.width : curr?.width
            return acc + (w || 0) + this.gap
          }, 0)
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
