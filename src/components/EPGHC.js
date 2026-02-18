// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGCard from './EPGCard'

export default Blits.Component('HorizontalContainer', {
  components: { EPGCard },
  template: `
    <Element x="96" width="1824" height="0">
      <Layout :x.transition="$x" direction="horizontal" ref="container" gap="8">
        <EPGCard
          :for="(item, index) in $items"
          :ref="'list-item-'+$index"
          :key="$index"
          :items="$item.items ? $item.items : $item"
          padding="{left: 8, right: 8}"
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
      // const cards = this.items.map((_, index) => this.$select(`list-item-${index}`)).filter(Boolean)
      // console.log('CARDS', cards)
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
    getItemWidth(item) {
      const start = new Date(item.data.start)
      const stop = new Date(item.data.stop)

      const startTime = start.toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

      const endTime = stop.toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      this.formattedTime = startTime + ' - ' + endTime
      const durationMS = stop - start
      this.w = durationMS / 60000
      this.$size({ w: this.w })
      return this.w
    },
    changeFocus(direction) {
      const nextFocus = this.looping
        ? (this.focused + direction + this.items.length) % this.items.length
        : Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      this.focused = nextFocus
    },
    rowOffset(index) {
      const cards = this.$selectAll(/^list-item-/)
      console.log('All card refs', cards)
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
    getItemX(index) {
      let x = 0
      for (let i = 0; i < index; i++) {
        console.log(this.items[i])
        x += this.items[i].width + this.gap
      }
      return x
    },
    scroll() {
      console.log(this.getItemWidth(this.items[this.focused]))
      // if (this.autoScroll) {
      //   // this.x = -this.rowOffset(this.focused)  //stara logika
      //   this.x =
      //     this.padding -
      //     (this.lastIndexToScroll < 0
      //       ? !this.containerBorder
      //         ? 0
      //         : this.padding
      //       : Math.min(this.focused, this.lastIndexToScroll) * this.itemTotalWidth)
      //   console.log('asdf focusedX of hor: ', this.x)
      // }
    },
  },
  hooks: {
    ready() {
      const focusItem = this.$select('list-item-2')
      console.log(focusItem)
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
