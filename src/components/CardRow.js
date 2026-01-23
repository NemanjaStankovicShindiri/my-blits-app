import Blits from '@lightningjs/blits'
import Card from './Card'
import { getBackdropUrl } from '../api'

export default Blits.Component('CardRow', {
  props: ['movies'],
  components: {
    Card,
  },
  template: `
    <Element :x.transition="$x" h="600" ref="row"
      ><Card
        :for="(item, index) in $movies"
        :x="$index * 360"
        :src="$item.backdrop_path"
        :text="$item.original_title"
        ref="card"
    /></Element>`,
  state() {
    return {
      focused: 0,
      x: 0,
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
      this.focused = Math.max(this.focused - 1, 0)
      this.scroll()
    },
    right() {
      this.focused = Math.min(this.focused + 1, this.movies.length - 1)
      this.scroll()
    },
  },
  methods: {
    scroll() {
      this.x = -this.focused * 360
    },
    getBackdropUrl(backdropPath) {
      getBackdropUrl(backdropPath)
    },
  },
})
