import Blits from '@lightningjs/blits'

import Home from './pages/Home.js'
import Details from './pages/Details.js'

import { fetchTMDBData } from './api.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home, options: { keepAlive: true } },
    {
      path: '/details/:id',
      component: Details,
    },
  ],
})
