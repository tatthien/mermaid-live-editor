import GlobalUIProvider from '@/components/GlobalUIProvider'
import { Analytics } from '@vercel/analytics/react'
import 'allotment/dist/style.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <GlobalUIProvider>
        <Component {...pageProps} />
      </GlobalUIProvider>
      <Analytics />
    </>
  )
}
