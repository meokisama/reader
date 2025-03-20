import { EbookGrid } from '@/components/ebooks/ebook-grid';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Thư viện Ebook</h1>
      <p className="text-muted-foreground">
        Khám phá bộ sưu tập sách điện tử của chúng tôi
      </p>
      <EbookGrid />
    </div>
  );
}