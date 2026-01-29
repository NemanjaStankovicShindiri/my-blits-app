/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getMovieDetails, getSimilarMovies5Pages } from '../api/services/DetailsPageServices'
import { getBackdropUrl } from '../api'
import Column from '../components/Column'

export default Blits.Component('Home', {
  props: ['id'],
  components: { Column },
  template: `
    <Element w="1920" h="1080" color="#0D0E12"
      ><Element x="318" w="1600" h="900" :src="$backdrop" /><Element
        x="318"
        w="1600"
        h="900"
        color="{left: '#0D0E12', bottom: '#0D0E12'}"
        ><Element width="1920" height="1006" y="48"
          ><Element x="-318" width="1920" height="257" y="700" overflow="false"
            ><Column
              :items="$similar"
              rowSpacing="30"
              ref="content"
              autoScroll="true"
              looping="true"
              clipping="false" /></Element
        ></Element>
      </Element>
    </Element>
  `,
  state() {
    /** @type {MovieRow[]} */
    const similar = []
    return { data: {}, backdrop: '', similar, focused: 0 }
  },
  hooks: {
    ready() {
      const content = this.$select('content')?.$focus()
    },
    async init() {
      this.data = await getMovieDetails(this.id)
      this.backdrop = getBackdropUrl(this.data.backdrop_path)

      this.similar = await getSimilarMovies5Pages(this.id)
      console.log(this.similar, this.data)
    },
  },
})

//<Column :items="$items" rowSpacing="30" ref="content" autoScroll="true" looping="true"/>
