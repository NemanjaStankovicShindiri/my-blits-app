import Blits from '@lightningjs/blits'

import Home from './pages/Home.js'
import Details from './pages/Details.js'
import EPGPage from './pages/EPGPage.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    {
      path: '/details/:id',
      component: Details,
      options: { keepAlive: true },
    },
    { path: '/epg', component: EPGPage },
  ],
})
