import Blits from '@lightningjs/blits'

export default Blits.Component('Button', {
  template: `
    <Layout
      ref="button"
      :color="$hasFocus ? {left: '#ed51f0', right: '#9A33FF'} : 'transparent'"
      padding="16"
      :effects="[{type: 'radius', props: {radius: 25}}]"
    >
      <Text content="Season 213123132213" />
    </Layout>`,
  hooks: {
    focus() {
      this.$trigger('focused')
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
