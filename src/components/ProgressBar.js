import Blits from '@lightningjs/blits'

export default Blits.Component('ProgressBar', {
  props: ['progress'],
  template: `
    <Element w="1404" h="9" color="rgba(217, 217, 217, 0.1)"
      ><Element :w="$progress*1404" h="9" color="rgba(237, 28, 36, 1)" :scale="$hasFocus?1.1:1"></Element
    ></Element>`,
  // state() {
  //   return { scale: 1 }
  // },
  hooks: {
    // focus() {
    //   console.log('ProgressBar focused')
    //   this.scale = 1.1
    // },
    // unfocus() {
    //   console.log('ProgressBar unfocused')
    //   this.scale = 1
    // },
  },
})
