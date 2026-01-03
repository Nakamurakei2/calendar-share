import {useCallback, useState} from 'react';

export const useLoading = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      setLoading(true);

      try {
        return await fn();
      } finally {
        setLoading(false);
      }
    },
    [], // 初回レンダリング時にのみ生成。その後、同じ関数が再利用
  );

  return {
    loading,
    withLoading,
  };
};
