import useOnScreen from '@/hooks/useOnScreen';
import { useRef } from 'react';

export const Screen: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);
  return <div className="is_on_screen">{isOnScreen ? 'true' : 'false'}</div>;
};
