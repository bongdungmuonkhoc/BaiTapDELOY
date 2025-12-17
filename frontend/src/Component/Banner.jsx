import React from 'react';

function Banner() {
  return (
    <div className="w-full bg-gradient-to-r from-green-500 to-[#0eb334]   py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight pr-[50px] pb-16 text-black animate-pulse ">
            QG Auto - Cùng bạn trong suốt chặng hành trình
          </h1>
        </div>

      
        <div className="text-lg md:text-xl leading-relaxed text-white font-semibold">
          <p>
                Mỗi chuyến đi là một hành trình khám phá cuộc sống và thế giới xung quanh, là cơ hội học hỏi và chinh phục những điều mới lạ của mỗi cá nhân để trở nên tốt hơn. Do đó, chất lượng trải nghiệm của khách hàng là ưu tiên hàng đầu và là nguồn cảm hứng của đội ngũ QG Auto.          </p>
          <p className="mt-4">
                QG Auto là nền tảng chia sẻ ô tô, sứ mệnh của chúng tôi không chỉ dừng lại ở việc kết nối chủ xe và khách hàng một cách Nhanh chóng - An toàn - Tiện lợi, mà còn hướng đến việc truyền cảm hứng KHÁM PHÁ những điều mới lạ đến cộng đồng qua những chuyến đi trên nền tảng của chúng tôi.          </p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
