import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import useOnScreen from '@/hooks/useOnScreen';
import './intersectionObserverMock';

describe('useOnScreen', () => {
  it('should return initial value', () => {
    const { result: ref }: any = renderHook(() => useRef<HTMLDivElement>(null));
    const { result } = renderHook(() => useOnScreen(ref));
    const [isOnScreen] = result.current;
    expect(isOnScreen).toBe(false);
  });

  it('should update isOnScreen state when element is intersecting', () => {
    const { result: ref }: any = renderHook(() => useRef<HTMLDivElement>(null));
    ref.current = document.createElement('div');
    const { result } = renderHook(() => useOnScreen(ref));
    const [, setIsOnScreen] = result.current;

    act(() => {
      setIsOnScreen(true);
    });

    const [isOnScreen] = result.current;
    expect(isOnScreen).toBe(true);
  });
});
