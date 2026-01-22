/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'

import Column from '../components/Column.js'
import { fetchTMDBData } from '../api.js'

export default Blits.Component('Home', {
  components: {
    Column,
  },
  template: `
    <Element w="1920" h="1080" :src="$src"><Column :items="$items" ref="content" /> </Element>
  `,
  state() {
    /** @type {MovieRow[]} */
    const items = []
    return {
      src: '',
      backgroundDebounce: null,
      items,
    }
  },
  hooks: {
    ready() {
      this.fetchData()
      const content = this.$select('content')
      content.$focus()
    },
    init() {
      this.$listen('changeBackground', ({ img }) => {
        console.log(img)
        if (this.backgroundDebounce) {
          this.$clearTimeout(this.backgroundDebounce)
        }

        this.backgroundDebounce = this.$setTimeout(() => {
          this.src = img
          console.log(this.src)
        }, 1000)
      })
    },
  },
  methods: {
    leftKeyUp() {
      console.log('left released')
    },
    async fetchData() {
      const data = await fetchTMDBData()
      this.items = data
    },
  },
  input: {
    // left() {
    //   console.log('left pressed')
    //   return this.leftKeyUp
    // },
    // up() {
    //   const cardRow = this.$select('cardRow')
    //   if (cardRow) {
    //     cardRow.$focus()
    //   }
    // },
    // down() {
    //   const progressBar = this.$select('progressBar')
    //   if (progressBar) {
    //     progressBar.$focus()
    //   }
    // },
    // any(e) {
    //   console.log(e)
    // },
  },
})
