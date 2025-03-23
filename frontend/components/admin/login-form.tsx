"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api, getCsrfToken } from "@/lib/api";
import { toast } from "sonner";

const formSchema = z.object({
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  // Lấy CSRF token khi component mount
  useEffect(() => {
    getCsrfToken();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      // Đảm bảo có CSRF token trước khi đăng nhập
      await getCsrfToken();

      const res = await api.post("/admin/login", { password: values.password });

      // Lưu token và thời gian hết hạn
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem(
        "adminTokenExpires",
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      );

      toast.success("Đăng nhập thành công", {
        description: "Đang chuyển hướng đến trang quản trị...",
      });
      router.push("/admin");
    } catch (error: any) {
      toast.error("Đăng nhập thất bại", {
        description: error.response?.data?.msg || "Có lỗi xảy ra",
      });
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Kiểm tra token hết hạn
  useEffect(() => {
    const tokenExpires = localStorage.getItem("adminTokenExpires");
    if (tokenExpires) {
      const expiresDate = new Date(tokenExpires);
      if (expiresDate < new Date()) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenExpires");
        router.push("/admin/login");
      }
    }
  }, [router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu admin"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  );
}
