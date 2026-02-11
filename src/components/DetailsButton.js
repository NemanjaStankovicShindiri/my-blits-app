import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  props: ['items'],
  template: `
    <Element
      :width="$width"
      :height="$height"
      :color="$hasFocus ? {left: '#ed51f0', right: '#9A33FF'} : '#2B2B2B'"
      :effects="[{type: 'radius', props: {radius: 40}}]"
      ><Element :src="$src" mount="{x: 0.5, y: 0.5}" :x="$width/2" :y="$height/2" /><Text
        :x="$width/2"
        mount="{x: 0.5}"
        :content="$hasFocus?$content:''"
        align="center"
        font="PoppinsMedium"
        size="18"
        y="70"
    /></Element>`,
  state() {
    return { src: '', content: '', x: 0 }
  },
  hooks: {
    focus() {
      this.$trigger('focused')
    },
    init() {
      this.src = this.items.data.src
      this.content = this.items.data.text
      this.width = this.items.width
      this.height = this.items.height
    },
  },
  methods: {
    focused() {
      const focusItem = this.$select('button')
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
      }
    },
  },
})
