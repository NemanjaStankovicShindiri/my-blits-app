// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGTimeSlot from './EPGTimeSlot'
import EPGHC from './EPGHC'
import apsoluteTimelineStart from '../utils/timlineStart'
import { EPG_LAYOUT } from '../utils/EPG_LAYOUT'
import { getEpg } from '../api/epgMock'

export default Blits.Component('VerticalContainer', {
  components: { EPGHC },
  template: `
    <Element :width="$width" :height="$height" clipping="true">
      <EPGHC gap="4" rowH="48" :items="$timeSlotItems" :rowsX="$rowsX" key="-1" width="$width" height="52" />
      <Element y="52" clipping="true" :width="$width" :height="$height - 56">
        <Element :y="$y">
          <Component
            height="$height - 56"
            :for="(item, index) in $items"
            rowH="$item.rowH"
            is="$item.type"
            :y="$rowOffset($index)"
            :ref="'list-item-'+$index"
            :key="$index"
            :items="$item.items ? $item.items : $item"
            title="$item.title"
            width="$width || 1770"
            :gap="$item.itemsGap || 4"
            :rowsX="$rowsX"
            :visibleStartTime="$visibleStartTime"
          />
        </Element>
      </Element>
    </Element>
  `,
  props: ['items', 'width', 'height'],
  state() {
    const now = new Date('2026-03-02T11:00:00Z')
    const minutes = now.getMinutes()

    if (minutes >= 30) {
      now.setMinutes(30, 0, 0) // round down to :30
    } else {
      now.setMinutes(0, 0, 0) // round down to :00
    }
    const unixTimestampMS = now.getTime()
    return {
      focused: 0,
      y: 0,
      rowsX: 0,
      timeSlotItems: [],
      visibleStartTime: unixTimestampMS,
      lastKeyTime: 0,
      throttleMs: 150,
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
    },
    items(newValue, oldValue) {
      console.log(newValue)
    },
  },
  methods: {
    _changeFocus(direction) {
      if (
        (direction === 1 && this.focused === this.items.length - 1) ||
        (direction === -1 && this.focused === 0)
      ) {
        return
      }
      const nextFocus = Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      const rowOffset = this.items[nextFocus].rowH + this.items[nextFocus].rowGap
      const nextRowTop = this.rowOffset(nextFocus) + this.y
      const nextRowBottom = nextRowTop + this.items[nextFocus].rowH

      const viewportTop = 0
      const viewportBottom = this.height

      if (direction === 1 && nextRowBottom > viewportBottom) {
        this.y -= rowOffset
      }

      if (direction === -1 && nextRowTop < viewportTop) {
        this.y += rowOffset
      }

      const focusedRow = this.$select(`list-item-${this.focused}`)
      const nextFocusedRow = this.$select(`list-item-${nextFocus}`)

      const currentElementMidPoint = focusedRow.getMidPoint(focusedRow.focused)
      let nextIndexToFocus = -1
      let distance = Infinity
      for (let i = 0; i < nextFocusedRow.items.length; i++) {
        const nextRowElement = nextFocusedRow.getMidPoint(i)
        let xDist = 0
        if (nextRowElement == null) {
          xDist = Infinity
        } else {
          xDist = Math.abs(currentElementMidPoint - nextRowElement)
        }
        if (xDist <= distance) {
          distance = xDist
          nextIndexToFocus = i
        } else {
          nextIndexToFocus = i - 1
          break
        }
      }
      this.focused = nextFocus
      nextFocusedRow.focused = nextIndexToFocus
    },
    rowOffset(index) {
      return index === 0
        ? 0
        : this.items
            .slice(0, index)
            .reduce((acc, curr) => acc + curr?.rowGap + (curr?.rowH ? curr?.rowH : curr.height), 0)
    },
    createTimeSlots(timelineStartMs) {
      const { MIN_TO_MS, MINUTE_WIDTH, SLOT_MIN } = EPG_LAYOUT
      const slots = []
      const SLOT_COUNT = (144 * 60) / SLOT_MIN
      const slotMs = SLOT_MIN * MIN_TO_MS
      for (let i = 0; i < SLOT_COUNT; i++) {
        const startTime = new Date(timelineStartMs + i * slotMs)
        const stopTime = new Date(startTime.getTime() + slotMs)

        const sh = startTime.getUTCHours().toString().padStart(2, '0')
        const sm = startTime.getUTCMinutes().toString().padStart(2, '0')

        slots.push({
          type: EPGTimeSlot,
          width: slotMs * MINUTE_WIDTH - 4,
          data: {
            title: `${sh}:${sm}`,
            start: startTime,
            stop: stopTime,
          },
        })
      }

      return slots
    },
    throttledMove(direction) {
      const now = Date.now()
      if (now - this.lastKeyTime < this.throttleMs) return

      this.lastKeyTime = now
      this._changeFocus(direction)
    },
  },
  input: {
    up() {
      this.throttledMove(-1)
    },
    down() {
      this.throttledMove(1)
    },
  },
  hooks: {
    init() {
      const { MIN_TO_MS, MINUTE_WIDTH } = EPG_LAYOUT
      const timelineStartMs = Date.parse(apsoluteTimelineStart)
      let timelineEndMs = timelineStartMs + 21 * 60 * MIN_TO_MS
      this.$listen('scrollRows', (scrollAmount) => {
        if (scrollAmount < 0) {
          if (this.visibleStartTime >= timelineEndMs) {
            this.parent.loadMoreData(1)
            timelineEndMs = timelineEndMs + 24 * 60 * MIN_TO_MS //za sad
          }
          this.visibleStartTime += 30 * MIN_TO_MS
          this.rowsX += scrollAmount
        }
        if (scrollAmount > 0 && this.visibleStartTime !== timelineStartMs) {
          this.visibleStartTime -= 30 * MIN_TO_MS
          this.rowsX += scrollAmount
        }
      })
      const deltaMin = (this.visibleStartTime - timelineStartMs) / MIN_TO_MS
      this.rowsX = -deltaMin * MINUTE_WIDTH

      const slots = this.createTimeSlots(timelineStartMs)
      this.timeSlotItems = slots
    },
  },
})
