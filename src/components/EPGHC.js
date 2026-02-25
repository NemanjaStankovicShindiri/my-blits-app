// @ts-nocheck
import Blits from '@lightningjs/blits'
import EPGCard from './EPGCard'
import timelineStart from '../utils/timlineStart'

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
      <Element x="276" clipping="true" width="$width - 276" height="$height">
        <Element :x="$rowsX" ref="container" :gap="$gap">
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
    { key: 'width', default: 1770 },
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
    'visibleStartTime',
  ],
  state() {
    return {
      focused: 0,
      viewportStartTime: this.visibleStartTime,
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
      const nowUtc = Date.now()

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
      const timelineStartData = new Date(timelineStart)
      const programStart = new Date(item.data.start)
      const programStop = new Date(item.data.stop)
      const pixelsPerMinute = 8.8
      item.width =
        programStart < this.viewportStartTime && programStop > this.viewportStartTime
          ? ((programStop - this.viewportStartTime) / 60000) * pixelsPerMinute - 8
          : ((programStop - programStart) / 60000) * 8.8 - 8

      const minutesFromStart =
        programStart < this.viewportStartTime && programStop > this.viewportStartTime
          ? (this.viewportStartTime - timelineStartData) / 60000
          : (programStart - timelineStartData) / 60000
      return minutesFromStart * pixelsPerMinute
    },
    changeFocus(direction) {
      this.viewportStartTime = this.visibleStartTime
      const nextPotentionalIndex = Math.max(
        0,
        Math.min(this.focused + direction, this.items.length - 1)
      )
      const relX = this.rowX(nextPotentionalIndex) + this.rowsX
      const epgCardW = this.items[nextPotentionalIndex].width
      if (direction === 1) {
        if (relX > this.width - 276 || this.focused === nextPotentionalIndex) {
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
