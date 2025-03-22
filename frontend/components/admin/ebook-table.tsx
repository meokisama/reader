"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Ebook } from "@/lib/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { EbookFilters } from "./ebook-filters";

interface EbookTableProps {
  ebooks: Ebook[];
  onEdit: (ebook: Ebook) => void;
  onDeleteSuccess: () => void;
}

export function EbookTable({
  ebooks: initialEbooks,
  onEdit,
  onDeleteSuccess,
}: EbookTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ebookToDelete, setEbookToDelete] = useState<Ebook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>(initialEbooks);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPublisher, setSelectedPublisher] = useState("");

  useEffect(() => {
    let filtered = [...initialEbooks];

    // Áp dụng tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (ebook) =>
          ebook.name.toLowerCase().includes(query) ||
          ebook.author.toLowerCase().includes(query) ||
          ebook.illustrator.toLowerCase().includes(query)
      );
    }

    // Áp dụng lọc theo nhà xuất bản
    if (selectedPublisher) {
      filtered = filtered.filter(
        (ebook) => ebook.publisher === selectedPublisher
      );
    }

    // Áp dụng sắp xếp theo ngày phát hành
    filtered.sort((a, b) => {
      const dateA = new Date(a.releaseDate).getTime();
      const dateB = new Date(b.releaseDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredEbooks(filtered);
  }, [initialEbooks, searchQuery, sortOrder, selectedPublisher]);

  const handleDelete = async () => {
    if (!ebookToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/ebooks/${ebookToDelete._id}`);
      toast.success("Xóa thành công", {
        description: `Đã xóa "${ebookToDelete.name}" khỏi thư viện`,
      });
      onDeleteSuccess();
    } catch (error) {
      console.error("Lỗi khi xóa ebook:", error);
      toast.error("Lỗi", {
        description: "Không thể xóa ebook. Vui lòng thử lại sau.",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setEbookToDelete(null);
    }
  };

  const openDeleteDialog = (ebook: Ebook) => {
    setEbookToDelete(ebook);
    setIsDeleteDialogOpen(true);
  };

  if (initialEbooks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Chưa có ebook nào trong thư viện
      </div>
    );
  }

  return (
    <>
      <EbookFilters
        onSearch={setSearchQuery}
        onSort={setSortOrder}
        onPublisherFilter={setSelectedPublisher}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Bìa</TableHead>
              <TableHead>Tên sách</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead>Họa sĩ</TableHead>
              <TableHead>Ngày phát hành</TableHead>
              <TableHead>Nhà xuất bản</TableHead>
              <TableHead className="text-end">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEbooks.map((ebook) => (
              <TableRow key={ebook._id}>
                <TableCell>
                  <div className="relative h-12 w-9 overflow-hidden rounded">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/covers/${ebook.coverImage}`}
                      alt={ebook.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-['Yu_Mincho']">
                  {ebook.name}
                </TableCell>
                <TableCell className="font-['Yu_Mincho']">
                  {ebook.author}
                </TableCell>
                <TableCell className="font-['Yu_Mincho']">
                  {ebook.illustrator}
                </TableCell>
                <TableCell className="font-['Yu_Mincho']">
                  {new Date(ebook.releaseDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell className="font-['Yu_Mincho']">
                  {ebook.publisher}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="outline" asChild>
                      <Link
                        href={`${process.env.NEXT_PUBLIC_API_URL}/reader?book=${ebook.filePath}`}
                        target="_blank"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => onEdit(ebook)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="text-red-500"
                      onClick={() => openDeleteDialog(ebook)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ebook &quot;{ebookToDelete?.name}&quot;?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
