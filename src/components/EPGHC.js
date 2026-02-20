// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGCard from './EPGCard'

export default Blits.Component('HorizontalContainer', {
  components: { EPGCard },
  template: `
    <Element width="$containerWidth">
      <Element
        width="260"
        height="$rowH"
        color="#221435"
        :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]" />
      <Element x="276" clipping="true" width="$containerWidth - 276" height="$height">
        <Element :x.transition="$rowsX" ref="container" :gap="$gap">
          <Component
            :for="(item, index) in $items"
            is="$item.type"
            :x="$rowX($index)"
            :ref="'list-item-'+$index"
            :key="$index"
            :items="$item.items ? $item.items : $item"
            :gap="$gap"
          /> </Element></Element
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
    'height',
    'rowH',
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

  hooks: {
    ready() {
      console.log('EPGHC ', this.rowH)
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
        if (relX > this.containerWidth - 276 || this.focused === nextPotentionalIndex) {
          //drugo
          this.$emit('scrollRows', -264)
        } else {
          this.focused = nextPotentionalIndex
        }
      } else {
        if (relX + epgCardW + this.gap >= 0.00001 && this.focused !== 0) {
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
