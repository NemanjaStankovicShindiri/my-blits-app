import Blits from '@lightningjs/blits'
import { getBackdropUrl } from '../api'

export default Blits.Component('Card', {
  props: ['src', 'text'],
  template: `
    <Element :scale="$scale" w="360" h="210"
      ><Element
        w="100%"
        h="100%"
        src="$backdrop"
        @loaded="$revealPage"
        @error="$showFallback"
        :scale="$hasFocus?1.1:1"
      /><Text
        w="100%"
        h="43"
        y="210"
        size="24"
        content="$text"
        color="rgba(241, 241, 241, 0.6)"
        maxlines="1"
        contain="width"
        font="InterRegular"
      />
    </Element>`,
  state() {
    return { backdrop: '' }
  },
  hooks: {
    //Lifecycle events
    init() {
      this.backdrop = getBackdropUrl(this.src)
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
