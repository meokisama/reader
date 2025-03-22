import { InfiniteScroll } from "@/components/ui/infinite-scroll";

export const CoverCarousel = () => {
  return (
    <div className="relative bg-background">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center max-w-screen-xl mx-auto">
        {/* <h1 className="text-4xl font-bold text-center text-white [filter:drop-shadow(0px_3px_8px_rgba(255,139,39,0.3))]">
          TRÌNH ĐỌC RAW MIỄN PHÍ
        </h1> */}
        <p className="text-center bg-gray-800 text-white px-2 py-1">
          Tôi nghĩ chia sẻ truyện raw là tốt xét theo mặt nào đó, cho những
          người muốn dịch hoặc cho nhưng người muốn đọc nhưng không có điều kiện
          mua, cho đi là nhận lại, nhưng cho để người ta đem bán thì lại là
          chuyện khác. Tôi vẫn sẽ chia sẻ, nhưng giờ sẽ chia sẻ theo trình đọc
          có sẵn thay vì file sách EPUB. Đây là giao diện tạm thời cho những bộ
          đã được các bạn yêu cầu (từ 20/03/2025).
        </p>
      </div>
      <div className="opacity-40">
        <InfiniteScroll
          items="/anniv_cover01.jpg"
          direction="left"
          speed="slow"
          pauseOnHover={false}
        />
        <InfiniteScroll
          items="/anniv_cover02.jpg"
          direction="right"
          speed="slow"
          pauseOnHover={false}
        />
      </div>
    </div>
  );
};
