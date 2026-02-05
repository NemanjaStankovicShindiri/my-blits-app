/**
 * @typedef {{ title: string, data: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getMovieDetails, getSimilarMovies5Pages } from '../api/services/DetailsPageServices'
import { getBackdropUrl } from '../api'
import Column from '../components/Column'
import VerticalContainer from '../components/VerticalContainer'

export default Blits.Component('Detail', {
  props: ['id'],
  components: { Column, VerticalContainer },
  template: `
    <Element w="1920" h="1080" color="#0D0E12"
      ><Element x="318" w="1600" h="900" :src="$backdrop" /><Element
        x="318"
        w="1600"
        h="900"
        color="{left: '#0D0E12', bottom: '#0D0E12'}"
        ><Element width="1920" height="1006" y="48"
          ><Element width="832" height="556" x="-228" /><Text
            x="-228"
            width="832"
            height="115"
            font="AntonRegular"
            size="115"
            contain="width"
            maxlines="1"
            maxheight="100%"
            :content="$title"
          /><Element x="-318" width="1920" height="495" y="584" overflow="false"
            ><VerticalContainer
              x="96"
              :items="$similar"
              rowSpacing="30"
              ref="content"
              autoScroll="true"
              looping="true"
              clipping="false"
          /></Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    /** @type {MovieRow[]} */
    const similar = []
    return { data: null, backdrop: '', similar, focused: 0 }
  },
  hooks: {
    async init() {
      this.data = await getMovieDetails(this.id)
      this.backdrop = getBackdropUrl(this.data?.backdrop_path)
      this.similar = await getSimilarMovies5Pages(this.id)
      console.log('asdf', this.similar)
      this.$select('content').$focus()
    },
    focus() {
      // this.$select('content')?.$focus()
    },
  },
  computed: {
    title() {
      return this.data?.title || this.data?.original_title || ''
    },
  },
})

//<Column :items="$items" rowSpacing="30" ref="content" autoScroll="true" looping="true"/>
