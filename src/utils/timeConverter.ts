import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localeDe from 'dayjs/locale/de-ch';

export const elapsedTime = (postDate: number) => {
  dayjs.extend(relativeTime).locale(localeDe);
  const fromNowOn = dayjs.default(postDate).fromNow();
  return fromNowOn;
};
