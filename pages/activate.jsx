// pages/activate.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function ActivateAccount() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage(data.message);
          setIsSuccess(data.success || data.message.includes('thành công'));
          setIsLoading(false);
        })
        .catch(() => {
          setMessage('Có lỗi xảy ra, vui lòng thử lại.');
          setIsSuccess(false);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Kích hoạt tài khoản | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Tài khoản Eco Bắc Giang của bạn đã được kích hoạt thành công. Khám phá thực phẩm hữu cơ tươi sạch, bảo vệ sức khỏe gia đình bạn."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, hữu cơ, tài khoản kích hoạt, thực phẩm sạch, rau hữu cơ"
        />
        <link rel="canonical" href="https://ecobacgiang.vn/activate" />
        {/* Open Graph */}
        <meta
          property="og:title"
          content="Kích hoạt tài khoản | Eco Bắc Giang"
        />
        <meta
          property="og:description"
          content="Tài khoản Eco Bắc Giang của bạn đã được kích hoạt thành công. Khám phá thực phẩm hữu cơ tươi sạch, bảo vệ sức khỏe gia đình bạn."
        />
        <meta property="og:url" content="https://ecobacgiang.vn/activate" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://ecobacgiang.vn/dang-ky.jpg"
        />
        <meta
          property="og:image:alt"
          content="Kích hoạt tài khoản Eco Bắc Giang"
        />
      </Head>
      
      {/* Modern Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-12 backdrop-blur-sm bg-opacity-95">
                  <div className="animate-spin text-6xl text-green-500 mb-6 flex justify-center">
                    <FaSpinner />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    Đang kích hoạt tài khoản...
                  </h2>
                  <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            )}

            {/* Success/Error State */}
            {!isLoading && (
              <div className="text-center">
                <div className="bg-white rounded-3xl shadow-2xl p-12 backdrop-blur-sm bg-opacity-95 transform hover:scale-105 transition-all duration-300">
                  
                  {/* Status Icon */}
                  <div className="mb-8">
                    {isSuccess ? (
                      <div className="text-6xl text-green-500 mb-4 animate-bounce flex justify-center">
                        <FaCheckCircle />
                      </div>
                    ) : (
                      <div className="text-6xl text-red-500 mb-4 flex justify-center">
                        ❌
                      </div>
                    )}
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                    {isSuccess ? 
                      'Chào mừng bạn đến với Eco Bắc Giang!' : 
                      'Kích hoạt không thành công'
                    }
                  </h1>

                  {/* Message */}
                  {message && (
                    <div className={`p-4 rounded-2xl mb-8 ${
                      isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`text-lg ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                        {message}
                      </p>
                    </div>
                  )}

                  {/* Success Description */}
                  {isSuccess && (
                    <div className="mb-8">
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        Tài khoản của bạn đã được kích hoạt thành công! Chúng tôi rất vui khi bạn đã chọn 
                        gia nhập cộng đồng Eco Bắc Giang - nơi cung cấp những sản phẩm hữu cơ tươi sạch, 
                        an toàn cho sức khỏe của bạn và gia đình.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl">
                          <div className="text-3xl mb-3">🌱</div>
                          <h3 className="font-semibold text-gray-800 mb-2">Hữu cơ 100%</h3>
                          <p className="text-gray-600 text-sm">Sản phẩm được chứng nhận hữu cơ</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl">
                          <div className="text-3xl mb-3">🚚</div>
                          <h3 className="font-semibold text-gray-800 mb-2">Giao hàng tận nơi</h3>
                          <p className="text-gray-600 text-sm">Miễn phí ship toàn quốc</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                          <div className="text-3xl mb-3">💎</div>
                          <h3 className="font-semibold text-gray-800 mb-2">Chất lượng cao</h3>
                          <p className="text-gray-600 text-sm">Cam kết chất lượng tốt nhất</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/"
                      className="group inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaArrowLeft className="mr-3 group-hover:-translate-x-1 transition-transform" />
                      Về Trang Chủ
                    </Link>
                    
                    {isSuccess && (
                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold border-2 border-green-600 hover:bg-green-600 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Khám Phá Sản Phẩm
                        <span className="ml-3">🛒</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/20 to-transparent"></div>
      </div>
    </>
  );
}
