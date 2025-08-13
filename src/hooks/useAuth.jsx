import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
};