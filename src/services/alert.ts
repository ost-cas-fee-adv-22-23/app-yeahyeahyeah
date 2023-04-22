import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import type { Alerts } from '../components/alert/Alert';

export const alertService = {
  onAlert,
  success,
  error,
  info,
  warn,
  alert,
  clear,
};

export const AlertType = {
  Success: 'Success',
  Error: 'Error',
  Info: 'Info',
  Warning: 'Warning',
};

const alertSubject = new Subject();
const defaultId = 'default-alert';

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
  return alertSubject.asObservable().pipe(filter((x: any) => x && x.id === id));
}

// convenience methods
function success(
  message: string,
  options: {
    autoClose: boolean;
    keepAfterRouteChange: boolean;
  }
) {
  alert({ ...options, type: AlertType.Success, message });
}

function error(
  message: string,
  options: {
    autoClose: boolean;
    keepAfterRouteChange: boolean;
  }
) {
  alert({ ...options, type: AlertType.Error, message });
}

function info(
  message: string,
  options: {
    autoClose: boolean;
    keepAfterRouteChange: boolean;
  }
) {
  alert({ ...options, type: AlertType.Info, message });
}

function warn(
  message: string,
  options: {
    autoClose: boolean;
    keepAfterRouteChange: boolean;
  }
) {
  alert({ ...options, type: AlertType.Warning, message });
}

// core alert method
function alert(alert: Alerts) {
  alert.id = alert.id || defaultId;
  alert.autoClose = alert.autoClose === undefined ? true : alert.autoClose;
  alertSubject.next(alert);
}

// clear alerts
function clear(id = defaultId) {
  alertSubject.next({ id });
}
