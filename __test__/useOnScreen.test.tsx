import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { act } from 'react-dom/test-utils';
import useOnScreen from '../src/hooks/useOnScreen';
import './intersectionObserverMock';

describe('useOnScreen', () => {
  test('should update isOnScreen state correctly', () => {
    const { result: ref }: any = renderHook(() => useRef<HTMLDivElement>(null));
    const { result: isOnScreen } = renderHook(() => useOnScreen(ref));

    expect(isOnScreen.current[0]).toBe(false); // Initial value

    // Simulate intersection
    act(() => {
      /* fire events that update state */
      isOnScreen.current[1](true);
    });
    expect(isOnScreen.current[0]).toBe(true);

    act(() => {
      // Simulate leaving intersection
      isOnScreen.current[1](false);
    });

    expect(isOnScreen.current[0]).toBe(false);
  });

  it('should return initial values', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOnScreen(ref));
    const [isOnScreen] = result.current;

    expect(isOnScreen).toBe(false); // Initial value
    expect(typeof isOnScreen).toBe('boolean');
  });

  it('should update isOnScreen state when element is intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOnScreen(ref));
    const [isOnScreen] = result.current;

    expect(isOnScreen).toBe(false);
  });

  it('should update isOnScreen state when element is intersecting', () => {
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useOnScreen(ref));
    const [, setIsOnScreen] = result.current;

    act(() => {
      setIsOnScreen(true);
    });

    const [isOnScreen] = result.current;
    expect(isOnScreen).toBe(true);
  });
});
