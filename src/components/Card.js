import Blits from '@lightningjs/blits'
import { getBackdropUrl } from '../api'
import { FocusBorder } from './FocusBorder'
import fallback from '../../public/assets/red.png'

export default Blits.Component('Card', {
  props: ['key', 'items'],
  components: { FocusBorder },
  template: `
    <Layout w="$items.width" h="$items.height" direction="vertical" :scale="$hasFocus?1.1:1">
      <FocusBorder
        width="$items.width + 6"
        height="$items.height + 6"
        bWidth="6"
        :alpha="$hasFocus ? 1 : 0"
        :radius="$items.radius" />
      <Element
        w="$items.width"
        h="$items.height"
        :effects="[{type: 'radius', props: { radius: $items.radius }
    }]"
        src="$backdrop"
        fit="{
      type: 'cover', position: { x: 0.5 } }"
        @loaded="$revealPage"
        @error="$showFallback" /><Text
        content="$items.text"
        y="$items.height"
        width="$items.width"
        align="center"
        textoverflow="true"
        maxlines="1"
        contain="width"
        size="16"
        color="#ffffff"
        font="PoppinsSemiBold" /><Text
        content="$items.subText"
        y="$items.height"
        width="$items.width"
        align="center"
        textoverflow="true"
        maxlines="1"
        contain="width"
        size="16"
        color="#909090"
        font="PoppinsSemiBold"
    /></Layout>`,
  state() {
    return { backdrop: fallback }
  },
  hooks: {
    //Lifecycle events
    init() {
      this.backdrop = this.items.data.backdrop_path
        ? getBackdropUrl(this.items.data.backdrop_path, 'w300') ||
          getBackdropUrl(this.items.data.poster_path, 'w300')
        : fallback
      // before it sends its render instructions to the Lightning renderer
    },
    //Renderer events
    idle() {
      // Triggers when components is finally rendered and doesnt change. If it never triggers it means component rerenders constantly
    },
    focus() {
      this.$emit('changeBackground', { img: this.backdrop })
    },
  },
  input: {
    enter() {
      console.log('onEnter', this.items.onEnter)
      this.$router.to(this.items.onEnter(this.items.data.id), {
        inHistory: false,
      })
    },
  },
  methods: {
    revealPage(dimensions) {
      // this.$log.info('Image dimensions', dimensions.w, dimensions.h)
      this.show = true
    },
    showFallback(error) {
      // this.$log.error('Image failed to load', error)
      this.showBackupImage()
    },
  },
})
