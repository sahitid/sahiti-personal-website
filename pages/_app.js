import '../styles/globals.css'
import SiteLayout from '../components/SiteLayout'
import BoatIntro from '../components/BoatIntro'
import { MotionConfig } from 'framer-motion'
import { Provider } from 'react-wrap-balancer'
import HeadObject from '../components/head'

function MyApp({ Component, pageProps }) {
  return (
    <MotionConfig reducedMotion="user">
      <Provider>
        <HeadObject />
        <BoatIntro />
        <SiteLayout><Component {...pageProps} /></SiteLayout>
      </Provider>
    </MotionConfig>
  )
}


export default MyApp
