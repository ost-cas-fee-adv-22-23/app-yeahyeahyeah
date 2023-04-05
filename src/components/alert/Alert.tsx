import { useState, useEffect, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { useRouter } from 'next/router';
import { alertService } from '../../services/alert.service';
import { Cancel } from '@smartive-education/design-system-component-library-yeahyeahyeah';

export type AlertProps = {
  id?: string;
  fade?: boolean;
};

export type Alerts = {
  autoClose: boolean;
  id?: string;
  itemId?: string;
  keepAfterRouteChange: boolean;
  message: string;
  type: string;
  fade?: boolean;
};

export const Alert: React.FC<AlertProps> = ({ id = 'default-alert', fade = true }) => {
  const mounted = useRef(false);
  const router = useRouter();
  const [alerts, setAlerts] = useState<any>([]);

  useEffect(() => {
    mounted.current = true;
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      if (!alert.message) {
        setAlerts((alerts: Alerts[]) => {
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);
          return omit(filteredAlerts, 'keepAfterRouteChange');
        });
      } else {
        alert.itemId = Math.random();
        setAlerts((alerts: Alerts[]) => [...alerts, alert]);

        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    const clearAlerts = () => alertService.clear(id);
    router.events.on('routeChangeStart', clearAlerts);

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
      router.events.off('routeChangeStart', clearAlerts);
    };
  });

  const omit = (arr: any, key: string) => {
    return arr.map((obj: any) => {
      const { [key]: omitted, ...rest } = obj;
      return rest;
    });
  };

  const removeAlert = (alert: Alerts) => {
    if (!mounted.current) return;
    setAlerts((alerts: Alerts[]) => alerts.filter((x) => x.itemId !== alert.itemId));
  };

  if (!alerts.length) return null;

  setTimeout(() => {
    setAlerts([]);
  }, 5000);

  return (
    <>
      {alerts.map((alert: Alerts, index: number) => (
        <AlertWrapper key={index} id={id}>
          <span tw="grow" dangerouslySetInnerHTML={{ __html: alert.message }}></span>
          <Cancel
            tw="text-slate-white !opacity-75 fill-pink-50 cursor-pointer transition scale-100 ease-in-out delay-100 hover:(fill-slate-white rotate-180 transform-gpu duration-500 scale-150 !opacity-100)"
            onClick={() => removeAlert(alert)}
          />
        </AlertWrapper>
      ))}
    </>
  );
};

interface AlertWrapperProps {
  id: string;
}

const AlertDefaults = tw`rounded-md p-16 mb-32 flex justify-start items-center w-full`;

const AlertWrapper = styled.div(({ id }: AlertWrapperProps) => [
  id === 'default-alert' && tw`bg-pink-600 text-slate-white`,
  id === 'alert-success' && tw`bg-slate-white text-violet-900`,
  id === 'alert-error' && tw`bg-pink-900 text-violet-900`,
  id === 'alert-warning' && tw`bg-slate-white text-violet-900`,
  AlertDefaults,
]);
