/**
 * @typedef {{ name: string, movies: any[] }} MovieRow
 */

import Blits from '@lightningjs/blits'
import { getEpg } from '../api/epgMock'
import EPGCard from '../components/EPGCard'
import EPGHC from '../components/EPGHC'
import EPGVC from '../components/EPGVC'
import { EPG_LAYOUT } from '../utils/EPG_LAYOUT'
import GenreLabel from '../components/GenreLabel'

export default Blits.Component('EPGPage', {
  components: {
    EPGVC,
    GenreLabel,
  },
  template: `
    <Element w="1920" h="1080">
      <Element
        w="1920"
        h="1080"
        src="assets/epgBackground.jpg"
        fit="{
      type: 'cover', position: { x: 0.5, y: 0.5 } }"
      /><Element w="1920" h="1080" color="{left: '#0D0E12', bottom: '#0D0E12'}">
        <Element w="947" x="96" h="289" y="88"
          ><Text :content="$currentlyFocused.title" font="PoppinsSemiBold" size="48" letterspacing="-1" />
          <Layout w="1920" h="44" y="104" gap="22.5"
            ><GenreLabel :for="(tag, index) in $currentlyFocused.tags" :content="$tag" :label="$tag" :key="$index"
          /></Layout>
          <Element y="180.25" width="947" height="108" :content="$currentlyFocused.description"
            ><Text :content="$currentlyFocused.description" font="PoppinsMedium" size="24" letterspacing="1"
          /></Element>
        </Element>
      </Element>
      <Element w="300" h="100"><Text size="100" color="red" :content="$fps" /></Element>
      <EPGVC :items="$data" ref="EPGVC" width="1824" height="605" x="96" y="475" currentTime="$currentTime" />
    </Element>
  `,
  state() {
    return {
      data: [],
      currentDate: '2026-03-02',
      loadedDates: [],
      fps: 0,
      currentlyFocused: { title: 'N/A', tags: [], description: '' },
      currentTime: '2026-03-02T11:00:00Z',
    }
  },
  hooks: {
    fpsUpdate(fps) {
      this.fps = fps
    },
    init() {
      const res = getEpg(this.currentDate)
      this.loadedDates.push(this.currentDate)
      this.data = res.map((item) => ({
        channel_id: item.channel_id,
        rowH: 96,
        type: EPGHC,
        rowGap: 4,
        itemsGap: 4,
        items: item.epgs.map((epg) => ({
          key: `${epg.id}_${epg.start}`,
          width: this.getEpgWidth(epg),
          type: EPGCard,
          data: epg,
        })),
      }))
      this.$listen('focusChange', (focusedItem) => {
        const tags = []

        const startObj = new Date(focusedItem.start)
        const stopObj = new Date(focusedItem.stop)

        const hours = startObj.getUTCHours() // 12
        const minutes = startObj.getUTCMinutes() // 0
        const durationMs = stopObj - startObj
        const duration = durationMs / (1000 * 60)
        // Format as time string
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` // "12:00"

        const day = startObj.getUTCDate().toString().padStart(2, '0')
        const month = (startObj.getUTCMonth() + 1).toString().padStart(2, '0') // months are 0-indexed
        const year = startObj.getUTCFullYear()

        tags.push(`${day}.${month}.${year}`)
        tags.push(`${duration} min`)
        tags.push(timeStr)

        const objectToShow = {
          title: focusedItem.title,
          tags: tags,
          description: focusedItem.description,
        }

        this.currentlyFocused = objectToShow
      })
      this.$listen('loadMoreChannels', (direction) => {
        this.getChannels(direction)
      })
    },
    ready() {
      this.$select('EPGVC').$focus()
    },
  },
  watch: {
    items(newItem) {
      if (!newItem) return

      const timeFormatter = new Intl.DateTimeFormat('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })

      const formatTime = (iso) => timeFormatter.format(new Date(iso))

      this.formattedTime = `${formatTime(newItem.data.start)} - ${formatTime(newItem.data.stop)}`
    },
  },
  methods: {
    getDate(addDay) {
      const date = new Date(this.currentDate + 'T00:00:00Z')
      date.setUTCDate(date.getUTCDate() + addDay)
      this.currentDate = date.toISOString().slice(0, 10)
      while (this.loadedDates.includes(this.currentDate)) {
        date.setUTCDate(date.getUTCDate() + addDay)
        this.currentDate = date.toISOString().slice(0, 10)
      }
      this.loadedDates.push(this.currentDate)
      return date.toISOString().slice(0, 10)
    },
    getChannels(direction) {
      console.log('get channels', direction)
    },
    loadMoreData(addDay) {
      const newDate = this.getDate(addDay)
      const res = getEpg(newDate)

      if (res.length === 0) return false

      const channelMap = new Map(res.map((r) => [r.channel_id, r]))

      const pom = this.data.map((item) => {
        const channelData = channelMap.get(item.channel_id)

        const newItems =
          channelData?.epgs.map((epg) => ({
            key: `${epg.id}_${epg.start}`,

            width: this.getEpgWidth(epg),
            type: EPGCard,
            data: { ...epg },
          })) || []
        return {
          ...item,
          items: addDay === 1 ? [...item.items, ...newItems] : [...newItems, ...item.items],
        }
      })
      this.data = [...pom]
      return true
    },
    getEpgWidth(item) {
      const start = new Date(item.start)
      const stop = new Date(item.stop)
      const duration = (stop - start) / 60000
      const width = Math.max(0, duration * EPG_LAYOUT.MINUTE_WIDTH - 4)
      return width
    },
  },
})
