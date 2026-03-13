// @ts-nocheck
import Blits from '@lightningjs/blits'
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
            :for="(item) in $cardPool"
            is="$item.type"
            :x="$item.x"
            :ref="'list-item-'+$item.globalIndex"
            :items="$item.items"
            key="$item.globalIndex"
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
    'timelineStart',
  ],
  state() {
    return {
      focused: 0,
      viewportEndOffset: Math.floor(((this.width - 264) / 8.8) * EPG_LAYOUT.MIN_TO_MS),
      lastKeyTime: 0,
      throttleMs: 150,
      epgContentWidth: this.width - 264,
      cardPool: [],
    }
  },
  watch: {
    visibleStartTime() {
      this.updateVisibleItems()
    },
    hasFocus(isFocused) {
      if (isFocused) this.$trigger('focused')
    },
    focused(value) {
      const focusItem = this.$select(`list-item-${value}`)
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
        this.$emit('focusChange', this.items[value].data)
      }
    },
    items(newValue, oldValue) {
      this.updateVisibleItems()
      if (this.hasFocus) {
        const indexInNewArray = newValue.findIndex(
          (item) => item.key === oldValue[this.focused].key
        )
        if (this.focused === 0) {
          this.focused = indexInNewArray
        }
        if (this.focused === oldValue.length - 1) {
          this.focused = indexInNewArray
        }
      }
    },
  },
  hooks: {
    init() {
      const nowUtc = new Date('2026-03-02T12:00:00Z').getTime()
      for (let i = 0; i < this.items.length; i++) {
        const currentItem = this.items[i]
        currentItem.globalIndex = i
        const start = Date.parse(currentItem.data.start)
        const stop = Date.parse(currentItem.data.stop)

        if (start <= nowUtc && stop > nowUtc) {
          this.focused = i
        }
      }
      this.updateVisibleItems()
    },
  },
  methods: {
    updateVisibleItems() {
      const start = this.visibleStartTime
      const end = start + this.viewportEndOffset

      let poolIndex = 0
      let visible = []
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]

        const programStart = Date.parse(item.data.start)
        const programEnd = Date.parse(item.data.stop)

        if (programEnd > start && programStart < end) {
          visible.push({
            ...this.cardPool[poolIndex],
            x: this.timeToX(item),
            items: {
              width: this.getItemWidth(item),
              data: item.data,
            },
            key: item.key,
            globalIndex: i,
            type: item.type,
          })
          poolIndex++
        }
        if (programStart > end) break
      }
      this.cardPool = visible
    },
    timeToX(item) {
      const { MINUTE_WIDTH, MIN_TO_MS } = EPG_LAYOUT
      const programStart = new Date(item.data.start)
      const programStop = new Date(item.data.stop)
      let minutesFromStart = 0
      if (programStart < this.visibleStartTime && programStop > this.visibleStartTime) {
        minutesFromStart = (this.visibleStartTime - this.timelineStart) / MIN_TO_MS
      } else {
        minutesFromStart = (programStart - this.timelineStart) / MIN_TO_MS
      }
      return minutesFromStart * MINUTE_WIDTH
    },
    getItemWidth(item) {
      const { MINUTE_WIDTH, MIN_TO_MS } = EPG_LAYOUT
      const programStart = Date.parse(item.data.start)
      const programStop = Date.parse(item.data.stop)
      return programStart < this.visibleStartTime && programStop > this.visibleStartTime
        ? ((programStop - this.visibleStartTime) / MIN_TO_MS) * MINUTE_WIDTH - this.gap
        : ((programStop - programStart) / MIN_TO_MS) * MINUTE_WIDTH - this.gap
    },

    getMidPoint(index) {
      const elStart = this.rowX(index) + this.rowsX
      const epgCardW = this.getItemWidth(this.items[index])
      const elEnd = elStart + epgCardW
      if (elEnd < 0 || elStart > this.epgContentWidth) {
        return null
      }
      if (elStart < 0 && elEnd > this.epgContentWidth) {
        return this.epgContentWidth / 2
      }
      if (elEnd > this.epgContentWidth) {
        return (this.epgContentWidth - elStart) / 2 + elStart
      }
      if (elStart < 0) {
        return elEnd / 2
      }
      return elStart + epgCardW / 2
    },
    _changeFocus(direction) {
      const { MINUTE_WIDTH, SLOT_MIN } = EPG_LAYOUT
      const timeSlotWidth = MINUTE_WIDTH * SLOT_MIN
      const nextPotentionalIndex = Math.max(
        0,
        Math.min(this.focused + direction, this.items.length - 1)
      )
      const relX = this.rowX(nextPotentionalIndex) + this.rowsX
      const epgCardW = this.getItemWidth(this.items[nextPotentionalIndex])
      if (direction === 1) {
        if (relX > this.epgContentWidth || this.focused === nextPotentionalIndex) {
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
