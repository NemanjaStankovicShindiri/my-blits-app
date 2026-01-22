import Blits from '@lightningjs/blits'
import App from './App.js'

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  debugLevel: 0,
  defaultFont: 'InterRegular',
  inspector: true,
  fonts: [
    {
      family: 'lato',
      type: 'msdf',
      file: 'fonts/Lato-Regular.ttf',
    },
    {
      family: 'raleway',
      type: 'msdf',
      file: 'fonts/Raleway-ExtraBold.ttf',
    },
    {
      family: 'InterBold',
      type: 'msdf',
      file: 'fonts/Inter_24pt-Bold.ttf',
    },
    {
      family: 'InterRegular',
      type: 'msdf',
      file: 'fonts/Inter_24pt-Regular.ttf',
    },
    {
      family: 'InterSemiBold',
      type: 'msdf',
      file: 'fonts/Inter_24pt-SemiBold.ttf',
    },
  ],
})
