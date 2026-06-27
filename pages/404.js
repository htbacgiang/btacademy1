// pages/404.js
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { FaArrowLeft, FaHome, FaGraduationCap, FaPhone, FaSearch } from "react-icons/fa";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Trang Không Tìm Thấy | BT Academy</title>
        <meta name="description" content="Trang bạn tìm kiếm không tồn tại. Quay về trang chủ BT Academy để khám phá các khóa học MC chuyên nghiệp." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="relative min-h-screen hero-bg-gradient overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-ping delay-75"></div>
        <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-pink-400 rounded-full opacity-60 animate-ping delay-150"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-16">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <div className="text-9xl md:text-[12rem] font-bold text-gradient-blue-purple mb-4 animate-pulse">
              404
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-75"></div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Oops! Trang Không Tìm Thấy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Rất tiếc, trang bạn đang tìm kiếm không tồn tại. Có thể trang đã được di chuyển hoặc URL không chính xác.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/">
              <button className="group relative btn-gradient-blue-purple text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center">
                <FaHome className="mr-3" />
                <span className="relative z-10">Về Trang Chủ</span>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            
            <Link href="/khoa-hoc">
              <button className="group border-2 border-gray-300 hover:border-blue-500 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
                <FaGraduationCap className="mr-3" />
                <span>Khóa Học MC</span>
              </button>
            </Link>
          </div>


          {/* Back Button */}
          <div className="mt-8">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
            >
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Quay Lại Trang Trước</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
