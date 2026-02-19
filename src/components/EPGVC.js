// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGTimeSlot from './EPGTimeSlot'
import EPGHC from './EPGHC'

export default Blits.Component('VerticalContainer', {
  components: { EPGHC },
  template: `
    <Element :y.transition="$y">
      <EPGHC
        gap="4"
        title=""
        :items="$timeSlotItems"
        :rowsX="$rowsX"
        key="-1"
        containerWidth="1824"
        containerBorder="true"
      />
      <Component
        :for="(item, index) in $items"
        is="$item.type"
        :y="$rowY($index)"
        :ref="'list-item-'+$index"
        :key="$index"
        :items="$item.items ? $item.items : $item"
        title="$item.title"
        :containerWidth="$item.containerWidth || 1770"
        containerBorder="$item.containerBorder"
        :gap="$item.gap || 50"
        autoScroll="true"
        :rowsX="$rowsX"
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
      default: 16,
    },
  ],
  state() {
    return {
      focused: 0,
      y: 0,
      rowsX: 0,
      timeSlotItems: [],
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
      this.y -= 112 * direction
      const nextFocus = this.looping
        ? (this.focused + direction + this.items.length) % this.items.length
        : Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      this.focused = nextFocus
    },
    rowOffset(index) {
      return index === 0
        ? 64
        : this.items
            .slice(0, index)
            .reduce((acc, curr) => acc + this.gap + (curr?.rowH ? curr?.rowH : curr.height), 64)
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
  },
  hooks: {
    init() {
      this.$listen('scrollRows', (scrollAmount) => {
        this.rowsX += scrollAmount
      })

      const timeArray = []
      for (let hour = 0; hour < 24; hour++) {
        // :00
        timeArray.push(`${hour.toString().padStart(2, '0')}:00`)
        // :30
        timeArray.push(`${hour.toString().padStart(2, '0')}:30`)
      }

      this.timeSlotItems = timeArray.map((time) => ({
        type: EPGTimeSlot,
        width: 30 * 8.8 - 4,
        data: { title: time },
      }))
    },
  },
})
