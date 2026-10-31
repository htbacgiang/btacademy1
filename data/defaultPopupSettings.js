import { HOLIDAY_DEFAULT_TEMPLATES } from "./holidayTemplates";

/**
 * Danh sách cấu hình mặc định cho Popup & Các ngày lễ đặc biệt của Việt Nam - BT Academy
 */

export const DEFAULT_HOLIDAYS = [
  {
    id: "ngay_20_10",
    name: "Ngày Phụ nữ Việt Nam (20/10)",
    description: "Chiến dịch tri ân & chúc mừng ngày Phụ nữ Việt Nam 20/10 với pháo hoa và thiệp mừng nghệ thuật",
    enabled: true,
    startDate: "2026-10-19T00:00:00+07:00",
    endDate: "2026-10-21T23:59:59+07:00",
    autoCloseSeconds: 90,
    delaySeconds: 3,
    componentKey: "october20",
    activeDays: 3,
    priority: 10,
    ...HOLIDAY_DEFAULT_TEMPLATES.october20,
  },
  {
    id: "ngay_20_11",
    name: "Ngày Nhà giáo Việt Nam (20/11)",
    description: "Tri ân Cô Bích Thủy, các Thầy Cô giáo và Chuyên gia MC truyền cảm hứng",
    enabled: false,
    startDate: "2026-11-19T00:00:00+07:00",
    endDate: "2026-11-21T23:59:59+07:00",
    autoCloseSeconds: 30,
    delaySeconds: 3,
    componentKey: "teachers_day_2011",
    activeDays: 3,
    priority: 10,
    ...HOLIDAY_DEFAULT_TEMPLATES.teachers_day_2011,
  },
  {
    id: "tet_nguyen_dan",
    name: "Tết Nguyên Đán (Tết Âm Lịch)",
    description: "Chiến dịch Tết Cổ Truyền - Khai xuân đắc lộc & Ưu đãi khóa học đầu năm",
    enabled: false,
    startDate: "2027-02-05T00:00:00+07:00",
    endDate: "2027-02-15T23:59:59+07:00",
    autoCloseSeconds: 30,
    delaySeconds: 3,
    componentKey: "tet_holiday",
    activeDays: 10,
    priority: 9,
    ...HOLIDAY_DEFAULT_TEMPLATES.tet_holiday,
  },
  {
    id: "ngay_8_3",
    name: "Ngày Quốc tế Phụ nữ (08/03)",
    description: "Chúc mừng ngày Quốc tế Phụ nữ 8/3 - Tôn vinh phái đẹp tự tin tỏa sáng",
    enabled: false,
    startDate: "2027-03-07T00:00:00+07:00",
    endDate: "2027-03-09T23:59:59+07:00",
    autoCloseSeconds: 30,
    delaySeconds: 3,
    componentKey: "women_day_83",
    activeDays: 3,
    priority: 8,
    ...HOLIDAY_DEFAULT_TEMPLATES.women_day_83,
  },
  {
    id: "ngay_30_4_1_5",
    name: "Giải phóng miền Nam (30/04) & Quốc tế Lao động (01/05)",
    description: "Kỷ niệm đại lễ 30/4 - 1/5, bứt phá kỹ năng giao tiếp & thuyết trình",
    enabled: false,
    startDate: "2027-04-29T00:00:00+07:00",
    endDate: "2027-05-03T23:59:59+07:00",
    autoCloseSeconds: 25,
    delaySeconds: 3,
    componentKey: "holiday_304",
    activeDays: 5,
    priority: 8,
    ...HOLIDAY_DEFAULT_TEMPLATES.holiday_304,
  },
  {
    id: "ngay_2_9",
    name: "Ngày Quốc khánh Việt Nam (02/09)",
    description: "Mừng ngày Quốc khánh 2/9 - Tự hào tiếng nói Việt Nam",
    enabled: false,
    startDate: "2026-09-01T00:00:00+07:00",
    endDate: "2026-09-03T23:59:59+07:00",
    autoCloseSeconds: 25,
    delaySeconds: 3,
    componentKey: "national_day_29",
    activeDays: 3,
    priority: 8,
    ...HOLIDAY_DEFAULT_TEMPLATES.national_day_29,
  },
  {
    id: "giang_sinh_nam_moi",
    name: "Giáng sinh & Chào năm mới (Noel - New Year)",
    description: "Mừng mùa lễ hội Giáng sinh và chào đón năm mới rực rỡ thành công",
    enabled: false,
    startDate: "2026-12-23T00:00:00+07:00",
    endDate: "2027-01-02T23:59:59+07:00",
    autoCloseSeconds: 25,
    delaySeconds: 3,
    componentKey: "xmas_newyear",
    activeDays: 10,
    priority: 7,
    ...HOLIDAY_DEFAULT_TEMPLATES.xmas_newyear,
  },
];

export const DEFAULT_POPUP_SETTINGS = {
  key: "global",
  enabled: true,
  defaultPopup: {
    type: "contact_form",
    title: "Đăng ký tư vấn khóa học MC & Luyện giọng cùng BT Academy",
    subtitle: "Nhận lộ trình luyện giọng chuẩn & tư vấn 1-1 miễn phí từ chuyên gia hàng đầu trong 15 phút",
    autoCloseSeconds: 20, // Tự động đóng sau 20s
    delaySeconds: 2,      // Trễ 2s sau khi vào trang
    pauseOnInteraction: true, // Nếu người dùng tương tác thì dừng đếm ngược
    displayFrequency: "always", // "always" hoặc "once_per_session"
  },
  holidays: DEFAULT_HOLIDAYS,
  testMode: {
    enabled: false,
    overrideType: "auto",
    forcedHolidayId: "ngay_20_10",
    ignoreSchedule: true,
    forceShowImmediately: false,
  },
};

