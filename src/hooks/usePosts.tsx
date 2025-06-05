import { useState, useEffect, useRef } from 'react';
import type { PostType } from '../types/post';

interface FetchPostsResponse {
  data: PostType[];
  page: number;
  lastPage: number;
}

export function usePosts(
  fetchFunction: (page: number, take: number) => Promise<FetchPostsResponse>,
  take = 5
) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data, page: currentPage, lastPage } = await fetchFunction(pageNumber, take);
      setPosts((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
      setPage(currentPage);
      setLastPage(lastPage);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return { posts, setPosts, page, lastPage, loading, fetchPosts, loaderRef };
}
