import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Layout from '@/components/layout/Layout';
import AuthProvider from '@/components/AuthProvider';
import LoadingScreen from '@/components/LoadingScreen';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Provider store={store}>
      <AuthProvider>
        
        {loading ? (
          <LoadingScreen />
        ) : router.pathname === '/login' ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthProvider>
    </Provider>
  );
}

export default MyApp;
