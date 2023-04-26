// pages/_app.tsx
import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import GlobalStyles from '@/styles/GlobalStyles';
import { DefaultLayout } from '../layouts';
import { useRouter } from 'next/router';

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

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
