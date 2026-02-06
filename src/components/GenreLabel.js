import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  props: ['label', 'icon'],

  state() {
    return {
      textWidth: 0,
      height: 44,
    }
  },

  computed: {
    width() {
      const paddingX = 22.5 * 2
      const iconWidth = 0
      const gap = 0
      return this.textWidth + iconWidth + gap + paddingX
    },
  },

  template: `
    <Element
      :w="$width"
      :h="$height"
      :effects="[ { type: 'radius', props: { radius: 25 } } ]"
      :color="$hasFocus ? { left:'#ED51F0', right:'#9A33FF' } : '#3D3D3D'"
    >
      <Layout placement="{ x: 'middle', y: 'middle' }" padding="{ left: 22.5, right: 22.5 }">
        <Text :content="$label" color="#fff" font="PoppinsMedium" size="20" @loaded="$onTextLoaded" />
      </Layout>
    </Element>
  `,

  methods: {
    onTextLoaded({ w }) {
      this.textWidth = w
      this.$size({ w: this.width, h: this.height })
    },
  },
})
