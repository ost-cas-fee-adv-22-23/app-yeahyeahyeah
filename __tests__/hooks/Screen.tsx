import useOnScreen from '@/hooks/useOnScreen';
import { useEffect, useRef } from 'react';

type ScreenProps = {
  setTo?: boolean;
};

export const Screen: React.FC<ScreenProps> = ({ setTo }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);

  useEffect(() => {
    setTo && setIsOnScreen(setTo);
  }, [setIsOnScreen, setTo]);

  return (
    <div ref={ref} className="is_on_screen">
      {isOnScreen ? 'true' : 'false'}
    </div>
  );
};
