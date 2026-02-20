// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGTimeSlot from './EPGTimeSlot'
import EPGHC from './EPGHC'

export default Blits.Component('VerticalContainer', {
  components: { EPGHC },
  template: `
    <Element :width="$width" :height="$height" clipping="true">
      <EPGHC
        gap="4"
        title=""
        :items="$timeSlotItems"
        :rowsX="$rowsX"
        key="-1"
        containerWidth="$width"
        containerBorder="true"
        zIndex="1"
      />
      <Element y="56" clipping="true" :width="$width" :height="$height - 56">
        <Element :y.transition="$y">
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
      </Element>
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
    'width',
    'height',
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
      const nextFocus = Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
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
