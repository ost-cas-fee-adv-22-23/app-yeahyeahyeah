import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { alertService, AlertType } from '../../services/alert.service';

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

    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts: Alerts[]) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          return omit(filteredAlerts, 'keepAfterRouteChange');
        });
      } else {
        // add alert to array with unique id
        alert.itemId = Math.random();
        setAlerts((alerts: Alerts[]) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000);
        }
      }
    });

    // clear alerts on location change
    const clearAlerts = () => alertService.clear(id);
    router.events.on('routeChangeStart', clearAlerts);

    // clean up function that runs when the component unmounts
    return () => {
      mounted.current = false;

      // unsubscribe to avoid memory leaks
      subscription.unsubscribe();
      router.events.off('routeChangeStart', clearAlerts);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function omit(arr: any, key: string) {
    return arr.map((obj: any) => {
      const { [key]: omitted, ...rest } = obj;
      return rest;
    });
  }

  function removeAlert(alert: Alerts) {
    if (!mounted.current) return;

    if (fade) {
      // fade out alert
      setAlerts((alerts: Alerts[]) => alerts.map((x) => (x.itemId === alert.itemId ? { ...x, fade: true } : x)));

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts: Alerts[]) => alerts.filter((x) => x.itemId !== alert.itemId));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts: Alerts[]) => alerts.filter((x) => x.itemId !== alert.itemId));
    }
  }

  function cssClasses(alert: Alerts) {
    if (!alert) return;

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }

  if (!alerts.length) return null;

  return (
    <div>
      {alerts.map((alert: Alerts, index: number) => (
        <div key={index} className={cssClasses(alert)}>
          <a className="close" onClick={() => removeAlert(alert)}>
            &times;
          </a>
          <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
        </div>
      ))}
    </div>
  );
};
