import Blits from '@lightningjs/blits'
import { getBackdropUrl } from '../api'

export default Blits.Component('CardRow', {
  props: ['movies', 'type', 'itemSpacing'],
  template: `
    <Element :x.transition="$x" h="600" ref="row"
      ><Component
        is="$type.type"
        :for="(item, index) in $movies"
        :range="{from: $range, to: $range + 6}"
        :x="$index * $type.width+($index+1)*$itemSpacing"
        :w="$type.width"
        :h="$type.height"
        :src="$item.backdrop_path"
        :text="$item.original_title"
        ref="card"
    /></Element>`,
  state() {
    return {
      focused: 0,
      x: 0,
      range: 0,
    }
  },

  watch: {
    focused(value) {
      const focusedItem = this.$select('card' + value)
      if (focusedItem && focusedItem.$focus) {
        focusedItem.$focus()
      }
    },
  },
  hooks: {
    focus() {
      this.$trigger('focused')
    },
  },
  input: {
    left() {
      this.range = Math.max(this.focused - 1, 0)
      this.focused = this.range
      this.scroll()
    },
    right() {
      this.range = Math.min(this.focused + 1, this.movies.length - 1)
      this.focused = this.range
      this.scroll()
    },
  },
  methods: {
    scroll() {
      this.x = -this.focused * (this.itemSpacing + this.type.width)
      console.log(this.x)
    },
    getBackdropUrl(backdropPath) {
      getBackdropUrl(backdropPath)
    },
  },
})
