// pages/_app.tsx
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultLayout } from '../layouts';
import '../styles/alert.css';
import '../styles/keyword.css';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      <GlobalStyles />
      {router.pathname !== '/landingpage' ? (
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
};

export default App;
