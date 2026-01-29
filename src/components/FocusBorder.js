import Blits from '@lightningjs/blits'

export const FocusBorder = Blits.Component('FocusBorder', {
  template: `
    <Element
      :y="$calc"
      :x="$calc"
      w="$width"
      h="$height"
      :effects="[{type: 'radius', props: {radius: 6}}, {type: 'border', props:{width:
    $bWidth, color: '#ED51F0'}}]"
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
  ],
  computed: {
    calc() {
      return -this.bWidth / 2
    },
  },
})
