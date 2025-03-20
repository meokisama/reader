import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';
import { Ebook } from '@/lib/types';

interface EbookCardProps {
  ebook: Ebook;
}

export function EbookCard({ ebook }: EbookCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/3] relative">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/covers/${ebook.coverImage}`}
          alt={ebook.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold line-clamp-1">{ebook.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {ebook.author}
        </p>
        {ebook.illustrator && ebook.illustrator !== 'Unknown' && (
          <p className="text-xs text-muted-foreground mt-1">
            Illustrator: {ebook.illustrator}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/reader?book=${ebook.filePath}`}>
            <Book className="mr-2 h-4 w-4" /> Đọc sách
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}