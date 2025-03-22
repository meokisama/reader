"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { api } from "@/lib/api";

interface Publisher {
  _id: string;
  name: string;
}

interface EbookFiltersProps {
  onSearch: (search: string) => void;
  onSort: (sort: "asc" | "desc") => void;
  onPublisherFilter: (publisher: string) => void;
}

export function EbookFilters({
  onSearch,
  onSort,
  onPublisherFilter,
}: EbookFiltersProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("all");
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  const fetchPublishers = async () => {
    try {
      const response = await api.get("/publishers");
      setPublishers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  const handleSort = (value: "asc" | "desc") => {
    setSort(value);
    onSort(value);
  };

  const handlePublisherFilter = (value: string) => {
    setSelectedPublisher(value);
    onPublisherFilter(value === "all" ? "" : value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          placeholder="Tìm kiếm theo tên sách, tác giả, họa sĩ..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 h-12 backdrop-blur"
        />
      </div>

      <Select value={selectedPublisher} onValueChange={handlePublisherFilter}>
        <SelectTrigger className="w-full md:w-[200px] data-[size=default]:h-12 backdrop-blur">
          <SelectValue placeholder="Lọc theo nhà xuất bản" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          {publishers.map((publisher) => (
            <SelectItem
              key={publisher._id}
              value={publisher.name}
              
            >
              {publisher.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={handleSort}>
        <SelectTrigger className="w-full md:w-[200px] data-[size=default]:h-12 backdrop-blur">
          <SelectValue placeholder="Sắp xếp theo ngày" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Mới nhất</SelectItem>
          <SelectItem value="asc">Cũ nhất</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 