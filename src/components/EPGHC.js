// @ts-nocheck
import Blits from '@lightningjs/blits'
import timelineStart from '../utils/timlineStart'
import { EPG_LAYOUT } from '../utils/EPG_LAYOUT'

export default Blits.Component('HorizontalContainer', {
  template: `
    <Element width="$width">
      <Element
        width="260"
        height="$rowH"
        color="#221435"
        :effects="[
    { type: 'radius', props: { radius: 8 } },
      ]" />
      <Element x="264" clipping="true" width="$width - 264" height="$height">
        <Element :x="$rowsX" ref="container">
          <Component
            :for="(item, index) in $items"
            is="$item.type"
            :x="$rowX($index)"
            :ref="'list-item-'+$index"
            :key="$index"
            :items="$item.items ? $item.items : $item"
          /> </Element></Element
    ></Element>
  `,
  props: [
    'items',
    { key: 'width', default: 1770 },
    {
      key: 'gap',
      default: 4,
    },
    { key: 'padding', default: 0 },
    'rowsX',
    'height',
    'rowH',
    'visibleStartTime',
  ],
  state() {
    return {
      focused: 0,
      viewportStartTime: this.visibleStartTime,
      lastKeyTime: 0,
      throttleMs: 150,
    }
  },
  watch: {
    visibleStartTime() {
      this.viewportStartTime = this.visibleStartTime
    },
    hasFocus(isFocused) {
      if (isFocused) this.$trigger('focused')
    },
    focused(value) {
      const focusItem = this.$select(`list-item-${value}`)
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
      }
    },
  },
  hooks: {
    init() {
      const nowUtc = new Date('2026-03-02T12:00:00Z').getTime()
      const indexToFocus = this.items.findIndex((item) => {
        const start = Date.parse(item.data.start)
        const stop = Date.parse(item.data.stop)
        return start <= nowUtc && stop >= nowUtc
      })
      this.focused = indexToFocus
    },
  },
  methods: {
    timeToX(item) {
      const { MINUTE_WIDTH, MIN_TO_MS } = EPG_LAYOUT
      const timelineStartData = new Date(timelineStart)
      const programStart = new Date(item.data.start)
      const programStop = new Date(item.data.stop)
      const pixelsPerMinute = MINUTE_WIDTH
      item.width =
        programStart < this.viewportStartTime && programStop > this.viewportStartTime
          ? ((programStop - this.viewportStartTime) / MIN_TO_MS) * pixelsPerMinute - this.gap
          : ((programStop - programStart) / MIN_TO_MS) * MINUTE_WIDTH - this.gap

      const minutesFromStart =
        programStart < this.viewportStartTime && programStop > this.viewportStartTime
          ? (this.viewportStartTime - timelineStartData) / MIN_TO_MS
          : (programStart - timelineStartData) / MIN_TO_MS
      return minutesFromStart * pixelsPerMinute
    },
    _changeFocus(direction) {
      const { MINUTE_WIDTH, SLOT_MIN } = EPG_LAYOUT
      const timeSlotWidth = MINUTE_WIDTH * SLOT_MIN
      this.viewportStartTime = this.visibleStartTime
      const nextPotentionalIndex = Math.max(
        0,
        Math.min(this.focused + direction, this.items.length - 1)
      )
      const relX = this.rowX(nextPotentionalIndex) + this.rowsX
      const epgCardW = this.items[nextPotentionalIndex].width
      if (direction === 1) {
        if (relX > this.width - 276 || this.focused === nextPotentionalIndex) {
          this.$emit('scrollRows', -timeSlotWidth)
        } else {
          this.focused = nextPotentionalIndex
        }
      } else {
        if (relX + epgCardW + this.gap >= 0.00001 && this.focused !== 0) {
          this.focused = nextPotentionalIndex
        } else {
          this.$emit('scrollRows', timeSlotWidth)
        }
      }
    },

    getMidPoint(index) {
      const elStart = this.rowX(index) + this.rowsX
      const epgCardW = this.items[index].width
      const elEnd = elStart + epgCardW
      if (elEnd < 0 || elStart > this.width - 276) {
        //van viewport-a
        return null
      }
      if (elStart < 0 && elEnd > this.width - 276) {
        //prostire se preko celog ekrana
        return (this.width - 276) / 2
      }
      if (elEnd > this.width - 276) {
        //sece desnu ivicu
        return (this.width - 276 - elStart) / 2 + elStart
      }
      if (elStart < 0) {
        //sece levu ivicu
        return elEnd / 2
      }
      return elStart + epgCardW / 2
    },
    rowX(index) {
      const item = this.items[index]
      return this.timeToX(item)
    },
    throttledMove(direction) {
      const now = Date.now()
      if (now - this.lastKeyTime < this.throttleMs) return

      this.lastKeyTime = now
      this._changeFocus(direction)
    },
  },
  input: {
    left() {
      this.throttledMove(-1)
    },
    right() {
      this.throttledMove(1)
    },
  },
})
