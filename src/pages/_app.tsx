import { Provider as NextAuthProvider } from 'next-auth/client'

import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { Header } from '../components/Header';

import '../styles/global.scss';

function MyApp({ Component, pageProps } : AppProps) {
  return(
        <NextAuthProvider session={pageProps.session}>
          <Header />
          <Component {...pageProps} />
          <ToastContainer />
        </NextAuthProvider>
  )
}

export default MyApp
