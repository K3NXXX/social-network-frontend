import { useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const ReplyLoader: React.FC<{
  commentId: string;
  fetchReplies: (id: string, page: number) => void;
  currentPage: number;
}> = ({ commentId, fetchReplies, currentPage }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver(ref, () => {
    fetchReplies(commentId, currentPage + 1);
  });

  return <div ref={ref} style={{ height: '1px' }} />;
};

export default ReplyLoader;
