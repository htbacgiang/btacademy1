"use client";

import { useState, useEffect } from "react";

export default function CrowdfundingSection() {
  const [crowdfundingData, setCrowdfundingData] = useState({
    totalAmount: 0,
    supporterCount: 0,
    supporters: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrowdfundingData = async () => {
      try {
        const response = await fetch('/api/crowdfunding-stats');
        const data = await response.json();
        if (data.success) {
          setCrowdfundingData(data);
        }
      } catch (error) {
        console.error('Error fetching crowdfunding data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrowdfundingData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full py-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-100 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>

          <div className="grid grid-cols-1 gap-6 relative z-10">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-green-700 uppercase tracking-wide mb-2">
                Eco Bắc Giang kêu gọi chung tay vì nông sản Việt!
              </h2>

              <div className="w-16 h-0.5 bg-green-500 mx-auto rounded-full"></div>

              <h4 className="text-base md:text-lg font-semibold text-gray-800 ">
                Góp một chút vốn nhỏ, ươm mầm cho những dự án nông sản xanh
              </h4>

            </div>

            {/* Thống kê crowdfunding */}
            <div className="mb-2">
              <div
                className="text-white p-4 rounded-xl text-center shadow-md hover:shadow-lg transform hover:scale-102 transition-all duration-300 max-w-sm mx-auto"
                style={{
                  background: 'linear-gradient(to right, #10b981, #059669)'
                }}
              >
                <div className="text-2xl font-bold mb-1">
                  {loading ? '...' : formatCurrency(crowdfundingData.totalAmount)}
                </div>
                <div className="text-xs opacity-90 mb-2">Tổng tiền đã nhận từ {loading ? '...' : `${crowdfundingData.supporterCount || 0} người đã ủng hộ`}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white bg-opacity-25 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((crowdfundingData.totalAmount / 100000000) * 100, 100)}%`
                    }}
                  ></div>
                </div>

                {/* Mục tiêu và % đạt được */}
                <div className="flex justify-between items-center text-base opacity-80">
                  <span>Mục tiêu: 100.000.000 VNĐ</span>
                  <span>
                    {loading ? '...' : `${Math.min((crowdfundingData.totalAmount / 100000000) * 100, 100).toFixed(1)}%`}
                  </span>
                </div>

              </div>
            </div>



            {/* 2 cột: Thông tin trái - QR phải */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Cột trái - 2 card thông tin */}
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="text-base font-bold text-green-800 mb-2 uppercase">
                    Chúng mình cần vốn để:
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Xây dựng trang trại hữu cơ tốt hơn, nghiên cứu và phát triển các hệ thống <strong className="text-green-700">AI, IoT, Robots</strong> và nhân rộng mô hình sản xuất.
                  </p>
                </div>

                <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-r-lg">
                  <h3 className="text-base font-bold text-pink-800 mb-2">
                    🎁 Quà tặng đặc biệt
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-pink-700">Tham gia ngay để nhận phiếu mua thực phẩm hữu cơ hoặc các thiết bị công nghệ do Eco Bắc Giang nghiên cứu và chế tạo tương ứng 150% giá trị số tiền ủng hộ</strong>
                  </p>
                </div>
              </div>

              {/* Cột phải - QR Code */}
              <div className="flex justify-center">
                <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-md max-w-lg">
                  <img
                    src="/images/qr-code.png"
                    alt="Mã QR để chung tay cùng Eco Bắc Giang xây dựng nông sản hữu cơ"
                    className="w-48 h-48 object-contain mb-4 rounded-lg mx-auto"
                  />

                  <div className="text-center">
                    <div className="mb-3">
                      <div className="text-sm font-medium text-green-700 mb-2">💳 Thông tin tài khoản nhận tiền ủng hộ</div>
                      <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700">
                        <div className="font-semibold">Ngân hàng: TPBank</div>
                        <div>Số tài khoản: 03924302701</div>
                        <div>Chủ tài khoản: NGO QUANG TRUONG</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}