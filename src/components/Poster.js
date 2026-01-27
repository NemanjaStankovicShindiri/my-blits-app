import Blits from '@lightningjs/blits'
import { getBackdropUrl } from '../api'

export default Blits.Component('Poster', {
  props: ['src', 'text'],
  template: `
    <Element
      w="1280"
      h="720"
      :scale="$hasFocus?1.02:1"
      :effects="$hasFocus?[{type: 'radius', props: {radius: 20}}, {type: 'border', props: {width: 6, color: '#EFEFEF'}}]:[]"
      ><Element
        w="100%"
        h="100%"
        src="$backdrop"
        @loaded="$revealPage"
        @error="$showFallback"
        padding="{x: 200, top: 30, bottom: 10}"
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

//<Text
//       :alpha="$hasFocus?1: 0.6"
//     w="100%"
//   h="43"
// y="210"
//size="24"
//content="$text"
//color="rgba(241, 241, 241, 1)"
//maxlines="1"
//contain="width"
//font="InterRegular"
///>
