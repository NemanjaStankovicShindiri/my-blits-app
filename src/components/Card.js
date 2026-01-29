import Blits from '@lightningjs/blits'
import { getBackdropUrl } from '../api'
import { FocusBorder } from './FocusBorder'
import fallback from '../../public/assets/red.png'

export default Blits.Component('Card', {
  props: ['src', 'text', 'width', 'height', 'key'],
  components: { FocusBorder },
  template: `
    <Element w="$width" h="$height" :scale="$hasFocus?1.1:1">
      <FocusBorder width="$width + 6" height="$height + 6" bWidth="6" :alpha="$hasFocus ? 1 : 0" />
      <Element
        w="$width"
        h="$height"
        :effects="[{type: 'radius', props: {radius: 5}}]"
        src="$backdrop"
        fit="{ type:
      'cover', position: { x: 0.5 } }"
        @loaded="$revealPage"
        @error="$showFallback"
    /></Element>`,
  state() {
    return { backdrop: '' }
  },
  hooks: {
    //Lifecycle events
    init() {
      this.backdrop = this.src ? getBackdropUrl(this.src) : fallback
      // before it sends its render instructions to the Lightning renderer
    },
    destroy() {},
    ready() {
      //component instance is fully initialized and rendered
    },
    //Renderer events
    idle() {
      // Triggers when components is finally rendered and doesnt change. If it never triggers it means component rerenders constantly
    },
    frameTick(data) {
      //   console.log(data.time, data.delta)
    },
    fpsUpdate(fps) {
      //console.log('Current FPS', fps)     //shows fps every second by default
    },
    focus() {
      this.$emit('changeBackground', { img: this.backdrop })
    },
  },
  input: {
    enter() {
      this.$router.to(`/details/${this.key}`, { inHistory: false })
    },
  },
  methods: {
    revealPage(dimensions) {
      this.$log.info('Image dimensions', dimensions.w, dimensions.h)
      this.show = true
    },
    showFallback(error) {
      this.$log.error('Image failed to load', error)
      this.showBackupImage()
    },
  },
})
