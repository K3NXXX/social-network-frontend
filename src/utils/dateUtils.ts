import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/uk';

dayjs.extend(relativeTime);
dayjs.locale('uk');

export const formatCreatedAt = (createdAt: string) => {
  const date = dayjs(createdAt);
  const now = dayjs();

  if (now.diff(date, 'day') >= 7) {
    return date.format('DD MMMM YYYY, HH:mm');
  }

  return date.fromNow();
};
