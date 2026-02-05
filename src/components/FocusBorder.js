import Blits from '@lightningjs/blits'

export const FocusBorder = Blits.Component('FocusBorder', {
  template: `
    <Element
      :y="$calc"
      :x="$calc"
      w="$width"
      h="$height"
      :effects="[
    { type: 'radius', props: { radius: $radius } },
    { type: 'border', props: { width: $bWidth, color: '#FFFFFF' } }
      ]"
    />
  `,
  props: [
    'width',
    'height',
    'x',
    'y',
    {
      key: 'bWidth',
      default: 8,
    },
    {
      key: 'radius',
      default: 6,
    },
  ],
  computed: {
    calc() {
      return -this.bWidth / 2
    },
  },
})
