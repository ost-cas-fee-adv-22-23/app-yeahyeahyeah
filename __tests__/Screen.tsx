import useOnScreen from '../src/hooks/useOnScreen';
import { useRef } from 'react';

export const Screen: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOnScreen, setIsOnScreen] = useOnScreen(ref);
  return <div className="test">{isOnScreen}</div>;
};