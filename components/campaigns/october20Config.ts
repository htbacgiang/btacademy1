/**
 * Cấu hình chiến dịch Popup Chúc mừng ngày Phụ nữ Việt Nam 20/10 - BT Academy
 * 
 * Quản trị viên có thể dễ dàng điều chỉnh:
 * - Bật / tắt popup: `enabled`
 * - Khoảng thời gian hiển thị: `startDate` và `endDate`
 * - Bỏ qua điều kiện ngày để kiểm thử nhanh: `ignoreDateRange: true`
 * - Thời gian trễ trước khi hiện popup: `delayMs` (mặc định 2000ms = 2 giây)
 * - Đường dẫn ảnh, logo và nội dung lời chúc
 */

export interface CampaignConfig {
  /** Bật hoặc tắt toàn bộ chiến dịch */
  enabled: boolean;
  /**
   * Bỏ qua kiểm tra ngày bắt đầu/kết thúc (rất hữu ích khi dev hoặc kiểm thử giao diện)
   * Khi đặt true: Popup sẽ luôn hiển thị (nếu enabled = true và chưa bị chặn bởi sessionStorage)
   */
  ignoreDateRange: boolean;
  /** Thời gian bắt đầu chiến dịch theo chuẩn ISO 8601 (múi giờ Việt Nam +07:00) */
  startDate: string;
  /** Thời gian kết thúc chiến dịch theo chuẩn ISO 8601 (múi giờ Việt Nam +07:00) */
  endDate: string;
  /** Thời gian trễ trước khi popup xuất hiện (milliseconds) - 3000ms = 3 giây */
  delayMs: number;
  /** Thời gian tự động đóng popup (milliseconds) - 90000ms = 90 giây */
  autoCloseMs: number;
  /** 
   * Chỉ hiển thị 1 lần duy nhất khi vào web (lưu vào localStorage & sessionStorage).
   * Khi đặt true: sau lần đầu tiên xem, popup sẽ không hiển thị lại trên trình duyệt đó.
   */
  onlyFirstVisit: boolean;
  /** Tương thích: có giới hạn 1 lần mỗi phiên */
  oncePerSession?: boolean;
  /** Khóa lưu trong storage để đánh dấu đã xem */
  sessionStorageKey: string;
  /** Múi giờ áp dụng để so sánh ngày giờ */
  timeZone: string;
  /** Các đường dẫn không hiển thị popup (ví dụ trang quản trị) */
  excludeRoutes?: string[];
}

export interface ImagesConfig {
  /** Ảnh nhân vật trung tâm: Cô Bích Thủy */
  founderImage: string;
  founderAlt: string;
  /** Ảnh bối cảnh 1: Cô Bích Thủy cùng các học viên nữ */
  studentsImage1: string;
  studentsAlt1: string;
  /** Ảnh bối cảnh 2: Lễ tốt nghiệp / hoạt động ấm áp của học viên */
  studentsImage2: string;
  studentsAlt2: string;
  /** Banner hoa hồng pastel & dải lụa đỏ */
  floralBanner: string;
  /** Bó hoa hồng pastel trang trí góc */
  roseBouquet: string;
  /** Logo chính thức của BT Academy */
  logo: string;
  logoAlt: string;
}

export interface ContentConfig {
  scriptTagline: string;
  mainTitle: string;
  dateSubtitle: string;
  recipientGreeting: string;
  wishes: string[];
  signature: string;
  brandName: string;
}

export const CAMPAIGN_2010_CONFIG: CampaignConfig = {
  enabled: true,
  ignoreDateRange: false, // Đặt true nếu muốn popup luôn hiện bất kể ngày tháng khi kiểm thử
  // Chiến dịch hiển thị trong đúng 3 ngày (19/10, 20/10, 21/10)
  startDate: '2026-10-19T00:00:00+07:00',
  endDate: '2026-10-21T23:59:59+07:00',
  delayMs: 2000,          // Tự động mở sau 2 giây
  autoCloseMs: 90000,     // Tự động đóng sau 90 giây (90s)
  onlyFirstVisit: true,   // Chỉ hiển thị lần đầu tiên vào web
  oncePerSession: true,
  sessionStorageKey: 'bt_academy_popup_2010_shown_v1',
  timeZone: 'Asia/Ho_Chi_Minh',
  excludeRoutes: ['/admin', '/dashboard'],
};

export const IMAGES_2010_CONFIG: ImagesConfig = {
  // Ảnh chính cô Bích Thủy (đã tách nền thanh lịch)
  founderImage: '/images/mc-bich-thuy.webp',
  founderAlt: 'Cô Bích Thủy - Nhà sáng lập BT Academy',
  // Ảnh học viên nữ và hoạt động giảng dạy thực tế tại BT Academy
  studentsImage1: '/images/gallery/hoc-vien-bt-23.jpg',
  studentsAlt1: 'Cô Bích Thủy cùng các học viên nữ BT Academy',
  studentsImage2: '/images/gallery/hoc-vien-bt-19.jpg',
  studentsAlt2: 'Lễ tốt nghiệp rạng rỡ của học viên nữ BT Academy',
  // Tài nguyên hoa hồng pastel và dải lụa đỏ thiệp chúc mừng
  floralBanner: '/images/20-10/hoc-vien-bt-23.jpg',
  roseBouquet: '/images/20-10/rose-bouquet.jpg',
  // Logo chính thức của BT Academy trong thư mục public
  logo: '/logobtacademy.png',
  logoAlt: 'BT Academy',
};

export const CONTENT_2010_CONFIG: ContentConfig = {
  scriptTagline: 'Chúc mừng',
  mainTitle: 'PHỤ NỮ VIỆT NAM',
  dateSubtitle: '20 THÁNG 10',
  recipientGreeting: 'Gửi cô Bích Thủy và những người phụ nữ tuyệt vời của BT Academy!',
  wishes: [
    'Nhân ngày 20/10, BT Academy xin gửi những lời chúc yêu thương và trân trọng nhất đến cô Bích Thủy cùng toàn thể các học viên nữ thân yêu.',
    'Chúc cô luôn rạng rỡ, hạnh phúc và giữ mãi ngọn lửa đam mê trên hành trình truyền cảm hứng. Chúc các chị em luôn tự tin với giọng nói của mình, tỏa sáng bằng bản sắc riêng và can đảm chinh phục những ước mơ.',
    'Mong rằng mỗi người phụ nữ đều được lắng nghe, trân trọng và tự tin tỏa sáng theo cách riêng của mình.',
  ],
  signature: 'Thân thương, BT Academy 💚',
  brandName: 'BT Academy',
};

/**
 * Kiểm tra xem chiến dịch có đang trong khung thời gian hợp lệ không
 * Hỗ trợ chuyển đổi múi giờ Asia/Ho_Chi_Minh
 */
export function isCampaignActive(config: CampaignConfig = CAMPAIGN_2010_CONFIG): boolean {
  if (!config.enabled) return false;
  if (config.ignoreDateRange) return true;

  try {
    const now = new Date();
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);

    const nowTime = now.getTime();
    return nowTime >= start.getTime() && nowTime <= end.getTime();
  } catch (err) {
    console.error('[October20Popup] Lỗi kiểm tra ngày chiến dịch:', err);
    return false;
  }
}
