
import Head from 'next/head'

import 'src/styles/globals.scss'


export default function MyApp ({Component, pageProps}: ANY) {
    return (
        <>
            <Head>
                <title>大聪明</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#da532c" />

                <meta name="description" content="大聪明是最聪明的，比聪明还聪明！" />
                <meta name="robots" content="all" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <meta name="referrer" content="no-referrer" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
