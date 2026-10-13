import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

export const useScrollReset = (): void => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollReset;
