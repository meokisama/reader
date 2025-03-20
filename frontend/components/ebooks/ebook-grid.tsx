'use client';

import { useEffect, useState } from 'react';
import { EbookCard } from './ebook-card';
import { api } from '@/lib/api';
import { Ebook } from '@/lib/types';

export function EbookGrid() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/ebooks');
        setEbooks(res.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách ebook:', err);
        setError('Không thể tải danh sách ebook');
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Chưa có ebook nào trong thư viện
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook._id} ebook={ebook} />
      ))}
    </div>
  );
}
