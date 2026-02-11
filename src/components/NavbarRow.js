import Blits from '@lightningjs/blits'
import Button from './Button'
import HorizontalContainer from './HorizontalContainer'

export default Blits.Component('NavbarRow', {
  components: {
    Button,
    HorizontalContainer,
  },
  template: `
    <Layout :width="$width" :height="$height" direction="vertical">
      <Text content="Seasons & Episodes" color="#FFF" h="50" font="PoppinsSemiBold" size="24" />
      <Element :width="$width" :height="$height">
        <HorizontalContainer
          :items="$items"
          direction="horizontal"
          gap="8"
          :width="$width"
          :height="$height"
          :effects="[ { type: 'radius', props: { radius: 50 } }, { type: 'border', props: { width: '2', color: '#FFFFFF' } }]"
        >
          <Button :for="(item, index) in $items" :ref="'btn-' + $index" :item="$item" :key="'btn-' + $index" />
        </HorizontalContainer>
      </Element>
    </Layout>
  `,
  props: ['items'],
  state() {
    return {
      focused: 0,
      width: 0,
      height: 200,
    }
  },

  hooks: {
    focus() {
      this.$select('btn-0')?.$focus()
    },
  },
  watch: {
    hasFocus(isFocused) {
      if (isFocused) this.$trigger('focused')
    },
    focused(value) {
      const focusItem = this.$select(`btn-${value}`)
      console.log('Focused navbar button', this.$select('btn-0'))
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
      }
    },
  },
  input: {
    right() {
      this.focused = Math.min(this.focused + 1, this.items.length - 1)
    },
    left() {
      this.focused = Math.max(this.focused - 1, 0)
    },
  },
})
