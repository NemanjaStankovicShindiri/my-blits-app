/**
 * @typedef {{ title: string, data: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getMovieDetails, getSimilarMovies5Pages } from '../api/services/DetailsPageServices'
import { getBackdropUrl } from '../api'
import Column from '../components/Column'
import VerticalContainer from '../components/VerticalContainer'
import GenreLabel from '../components/GenreLabel'

export default Blits.Component('Detail', {
  props: ['id'],
  components: { Column, VerticalContainer, GenreLabel },
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
            height="100"
            font="AntonRegular"
            size="115"
            contain="width"
            maxlines="1"
            maxheight="100%"
            :content="$title"
          /><Layout gap="22.5" y="155" x="-228"
            ><Text :content="$date" y="155" x="-228" font="PoppinsMedium" letterspacing="0.01" size="20" /><Text
              :content="$runtime"
              letterspacing="0.01"
              font="PoppinsMedium"
              size="20" /><Element
              :for="(item, index) in $productionCompanies"
              width="62"
              height="37"
              :src="$item"
              fit="{
      type: 'contain', position: { x: 0.5, y: 0.5 } }" /></Layout
          ><Text
            y="316"
            x="-228"
            width="832"
            maxlines="4"
            contain="width"
            font="PoppinsMedium"
            size="26"
            :content="$data.overview"
          /><Layout direction="horizontal" gap="22.5" y="512" x="-228"
            ><GenreLabel
              :for="(item, index) in $genres"
              :content="$item"
              height="44"
              size="26"
              :label="$item"
              key="$index"
            /> </Layout
          ><Element x="-318" width="1920" height="495" y="584" overflow="false">
            <VerticalContainer
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
    return {
      data: {},
      backdrop: '',
      genres: [],
      similar,
      focused: 0,
      productionCompanies: [],
    }
  },
  hooks: {
    async init() {
      this.data = await getMovieDetails(this.id)
      this.productionCompanies = this.data.production_companies
        .filter((item) => item.logo_path)
        .map((item) => getBackdropUrl(item.logo_path, 'w300'))
      this.genres = this.data.genres.map((item) => item.name).sort()
      this.backdrop = getBackdropUrl(this.data?.backdrop_path)
      this.similar = await getSimilarMovies5Pages(this.id)
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
    date() {
      return this.data?.release_date?.split('-')[0] || 'N/A'
    },
    runtime() {
      const hours = Math.floor(this.data?.runtime / 60)
      return hours < 0 ? '' : hours + ':' + (this.data?.runtime % 60).toString().padStart(2, '0')
    },
  },
})

//<Column :items="$items" rowSpacing="30" ref="content" autoScroll="true" looping="true"/>
