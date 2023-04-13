import AuthProvider from '@/components/AuthProvider'
import GlobalUIProvider from '@/components/GlobalUIProvider'
import store from '@/stores/store'
import { Analytics } from '@vercel/analytics/react'
import 'allotment/dist/style.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Provider store={store}>
        <GlobalUIProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </GlobalUIProvider>
      </Provider>
      <Analytics />
    </>
  )
}
