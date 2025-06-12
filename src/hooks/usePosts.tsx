import { useState, useEffect, useRef } from 'react';
import type { PostType } from '../types/post';

interface FetchPostsResponse {
  data: PostType[];
  page: number;
  totalPages: number;
}

export function usePosts(
  fetchFunction: (page: number, take: number) => Promise<FetchPostsResponse>,
  take = 5
) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data, page: currentPage, totalPages } = await fetchFunction(pageNumber, take);
      setPosts((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
      setPage(currentPage);
      setLastPage(totalPages);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return { posts, setPosts, page, totalPages, loading, fetchPosts, loaderRef };
}
