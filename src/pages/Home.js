/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'

import Column from '../components/Column.js'
import { getMovies } from '../api/services/MediaServices.js'

export default Blits.Component('Home', {
  components: {
    Column,
  },
  template: `
    <Element w="1920" h="1080" :src="$src"
      ><Element w="1920" h="1080" color="{top: '#000000ff', left: '#000000ff'}" alpha="0.6" /><Column
        :items="$items"
        rowSpacing="30"
        ref="content"
        autoScroll="true"
        looping="true"
      />
    </Element>
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
      const content = this.$select('content')?.$focus()
    },
    init() {
      this.fetchData()
      this.$listen('changeBackground', ({ img }) => {
        if (this.backgroundDebounce) {
          this.$clearTimeout(this.backgroundDebounce)
        }

        this.backgroundDebounce = this.$setTimeout(() => {
          this.src = img
        }, 1000)
      })
    },
  },
  methods: {
    leftKeyUp() {
      console.log('left released')
    },
    async fetchData() {
      const data = await getMovies(false)
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
