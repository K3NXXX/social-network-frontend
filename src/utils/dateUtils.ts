import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/uk';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

export const formatCreatedAt = (createdAt: string, locale: 'uk' | 'en' = 'en') => {
  dayjs.locale(locale);

  const date = dayjs(createdAt);
  const now = dayjs();

  if (now.diff(date, 'day') >= 7) {
    return date.format('DD MMMM YYYY, HH:mm');
  }

  return date.fromNow();
};
