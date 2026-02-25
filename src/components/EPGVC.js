// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGTimeSlot from './EPGTimeSlot'
import EPGHC from './EPGHC'
import apsoluteTimelineStart from '../utils/timlineStart'

export default Blits.Component('VerticalContainer', {
  components: { EPGHC },
  template: `
    <Element :width="$width" :height="$height" clipping="true">
      <EPGHC
        gap="4"
        title=""
        rowH="48"
        :items="$timeSlotItems"
        :rowsX="$rowsX"
        key="-1"
        width="$width"
        containerBorder="true"
        height="56"
      />
      <Element y="56" clipping="true" :width="$width" :height="$height - 56">
        <Element :y="$y">
          <Component
            height="$height - 56"
            :for="(item, index) in $items"
            rowH="$item.rowH"
            is="$item.type"
            :y="$rowY($index)"
            :ref="'list-item-'+$index"
            :key="$index"
            :items="$item.items ? $item.items : $item"
            title="$item.title"
            width="$width || 1770"
            containerBorder="$item.containerBorder"
            :gap="$item.gap || 50"
            autoScroll="true"
            :rowsX="$rowsX"
            :visibleStartTime="$visibleStartTime"
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
    const now = new Date()
    const minutes = now.getMinutes()

    if (minutes >= 30) {
      now.setMinutes(30, 0, 0) // round down to :30
    } else {
      now.setMinutes(0, 0, 0) // round down to :00
    }
    const unixTimestampMS = Math.floor(now.getTime())
    const windowDuration = 3 * 60 * 60 * 1000
    return {
      focused: 0,
      y: 0,
      rowsX: 0,
      timeSlotItems: [],
      visibleStartTime: unixTimestampMS,
      visibleEndTime: unixTimestampMS + windowDuration,
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
        if (scrollAmount < 0) {
          this.visibleStartTime += 30 * 60 * 1000
          this.visibleEndTime += 30 * 60 * 1000
        } else {
          this.visibleStartTime -= 30 * 60 * 1000
          this.visibleEndTime -= 30 * 60 * 1000
        }
      })

      const timelineStartMs = Date.parse(apsoluteTimelineStart) // UTC
      const deltaMin = (this.visibleStartTime - timelineStartMs) / 60000
      this.rowsX = -deltaMin * 8.8

      const timeArray = []

      // ⏱️ timeline start – pass this in or import it (e.g. timelineStart)
      const timelineStartData = new Date(apsoluteTimelineStart)
      const SLOT_MIN = 30
      const SLOTS_24H = (24 * 60) / SLOT_MIN // 48

      for (let i = 0; i < SLOTS_24H; i++) {
        const startTime = new Date(timelineStartData.getTime() + i * SLOT_MIN * 60 * 1000)
        const stopTime = new Date(startTime.getTime() + SLOT_MIN * 60 * 1000)

        const sh = startTime.getUTCHours().toString().padStart(2, '0')
        const sm = startTime.getUTCMinutes().toString().padStart(2, '0')
        const eh = stopTime.getUTCHours().toString().padStart(2, '0')
        const em = stopTime.getUTCMinutes().toString().padStart(2, '0')

        timeArray.push({
          type: EPGTimeSlot,
          width: SLOT_MIN * 8.8 - 4, // stays aligned with your EPG scale
          data: {
            title: `${sh}:${sm}`,
            start: startTime,
            stop: stopTime,
          },
        })
      }

      this.timeSlotItems = timeArray
    },
  },
})
