import Blits from '@lightningjs/blits'
import App from './App.js'

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  debugLevel: 1,
  defaultFont: 'InterRegular',
  inspector: true,
  inputThrottle: 300,
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
    {
      family: 'PoppinsSemiBold',
      type: 'msdf',
      file: 'fonts/Poppins-SemiBold.ttf',
    },
    {
      family: 'PoppinsMedium',
      type: 'msdf',
      file: 'fonts/Poppins-Medium.ttf',
    },

    { family: 'AntonRegular', type: 'msdf', file: 'fonts/Anton-Regular.ttf' },
  ],
})
