import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { LogoMumble } from '@smartive-education/design-system-component-library-yeahyeahyeah';

interface PageWithTransitionProps {
  children: ReactNode;
}

export const PageTransition: React.FC<PageWithTransitionProps> = ({ children }) => {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const handler = () => {
      setTransitioning(true);
      setTimeout(() => {
        setTransitioning(false);
      }, 1000);
    };
    router.events.on('routeChangeComplete', handler);
    return () => {
      router.events.off('routeChangeComplete', handler);
    };
  }, [router.events]);

  const Loading = () => {
    return (
      <>
        <div tw="flex justify-center items-center container h-screen animate-fade">
          <LogoMumble fill="#ffffff" width={200} height={200} />
        </div>
      </>
    );
  };

  if (transitioning) {
    return <Loading />;
  }

  return <>{children}</>;
};
