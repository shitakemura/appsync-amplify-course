import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../configureAmplify'
import { Navbar } from '../components/navbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navbar />
      <div className="py-8 px-16 bg-slate-100">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp
