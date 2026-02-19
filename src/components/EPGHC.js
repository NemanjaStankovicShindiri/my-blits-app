// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGCard from './EPGCard'

export default Blits.Component('HorizontalContainer', {
  components: { EPGCard },
  template: `
    <Element x="96" width="1824" height="0">
      <Layout :x.transition="$x" direction="horizontal" ref="container" :gap="$gap">
        <Component
          :for="(item, index) in $items"
          is="$item.type"
          :ref="'list-item-'+$index"
          :key="$index"
          :items="$item.items ? $item.items : $item"
          :gap="$gap"
        /> </Layout
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
    { key: 'padding', default: 8 },
  ],
  state() {
    return {
      focused: 0,
      x: this.padding,
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
    itemPositions() {
      const focusItem = this.$select('list-item-1').width
      const pos = []
      let acc = 0
      console.log(focusItem)
      for (let i = 0; i < this.items.length; i++) {
        pos.push(acc)
        acc += this.items[i].width + this.gap
      }
      console.log('itemPostions', pos)
      return pos
    },
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
      this.focused = Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      console.log('change focus ', this.itemPositions[this.focused])
    },
    isIndexInViewport(index) {
      const item = this.$select(`list-item-${index}`)
      console.log('Next item to focus', item)
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
