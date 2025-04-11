"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      if (!email) {
        setStatus("error");
        setMessage("Email không hợp lệ");
        return;
      }

      try {
        setStatus("loading");
        const response = await fetch(
          `/api/subscribers/unsubscribe?email=${email}`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Có lỗi xảy ra");
        }

        setStatus("success");
        setMessage("Hủy đăng ký thành công!");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Hủy đăng ký nhận tin
        </h1>

        {status === "loading" && (
          <p className="text-center text-gray-600">Đang xử lý...</p>
        )}

        {status === "success" && (
          <div className="text-center">
            <p className="text-green-500 mb-4">{message}</p>
            <p className="text-gray-600">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <p className="text-red-500 mb-4">{message}</p>
            <p className="text-gray-600">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
