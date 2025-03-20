'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EbookTable } from '@/components/admin/ebook-table';
import { EbookForm } from '@/components/admin/ebook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Ebook } from '@/lib/types';
import axios from 'axios';
export default function AdminPage() {
  const router = useRouter();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchEbooks();
  }, [router]);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ebooks');
      setEbooks(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách ebook:', err);
      // Kiểm tra nếu lỗi 401 - Unauthorized
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedEbook(null);
    setShowForm(true);
    setActiveTab('form');
  };

  const handleEditEbook = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setShowForm(true);
    setActiveTab('form');
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedEbook(null);
    setActiveTab('list');
  };

  const handleFormSuccess = () => {
    fetchEbooks();
    setShowForm(false);
    setSelectedEbook(null);
    setActiveTab('list');
  };

  const handleDeleteSuccess = () => {
    fetchEbooks();
  };

  if (loading && ebooks.length === 0) {
    return <div className="flex justify-center py-12">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Ebook</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm Ebook mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Danh sách Ebook</TabsTrigger>
          {showForm && (
            <TabsTrigger value="form">
              {selectedEbook ? 'Chỉnh sửa Ebook' : 'Thêm Ebook mới'}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <EbookTable 
            ebooks={ebooks} 
            onEdit={handleEditEbook} 
            onDeleteSuccess={handleDeleteSuccess} 
          />
        </TabsContent>
        {showForm && (
          <TabsContent value="form" className="mt-6">
            <EbookForm
              ebook={selectedEbook}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}