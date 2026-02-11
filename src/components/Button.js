import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  props: ['items'],

  state() {
    return {
      width: 63,
      height: 45,
    }
  },

  template: `
    <Element
      :w="$width"
      :h="$height"
      :color="$hasFocus ? { left:'#ED51F0', right:'#9A33FF' } : 'transparent'"
      :effects="[ { type: 'radius', props: { radius: 50 } } ]"
    >
      <Text
        :content="$items?.data?.text"
        font="PoppinsSemiBold"
        size="16"
        align="center"
        mount="0.5"
        :x="$width/2"
        :y="$height/2"
      />
    </Element>
  `,
  hooks: {
    init() {
      this.width = this.items.width
      this.height = this.items.height
    },
  },
})
