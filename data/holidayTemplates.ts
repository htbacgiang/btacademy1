/**
 * Từ điển nội dung mẫu chuẩn cho từng ngày lễ Việt Nam - BT Academy
 * Mặc định tự động điền đầy đủ hình ảnh banner và nội dung lời chúc cao cấp chuẩn BT Academy
 */

export interface HolidayTemplateData {
  bannerImage: string;
  bannerAlt: string;
  bannerPosition: string;
  scriptTagline: string;
  mainTitle: string;
  dateSubtitle: string;
  recipientGreeting: string;
  wishes: string[];
  signature: string;
  actionText: string;
}

export const HOLIDAY_DEFAULT_TEMPLATES: Record<string, HolidayTemplateData> = {
  october20: {
    bannerImage: "/images/campaigns/anh-pik-20-10.jpg",
    bannerAlt: "BT Academy Chúc Mừng Ngày Phụ Nữ Việt Nam 20/10",
    bannerPosition: "object-[center_30%]",
    scriptTagline: "Chúc mừng",
    mainTitle: "NGÀY PHỤ NỮ VIỆT NAM",
    dateSubtitle: "20 THÁNG 10",
    recipientGreeting: "Gửi cô Bích Thủy và những người phụ nữ tuyệt vời của BT Academy!",
    wishes: [
      "Nhân ngày Phụ nữ Việt Nam 20/10, Học viện BT Academy xin gửi những lời chúc tốt đẹp và trân trọng nhất đến cô Bích Thủy, Quý đối tác cùng toàn thể các học viên nữ thân yêu. Chúc một nửa thế giới luôn mạnh khỏe, rạng rỡ, tự tin với giọng nói truyền cảm hứng và không ngừng tỏa sáng với bản sắc riêng của mình. Cảm ơn các bạn đã luôn tin tưởng và đồng hành cùng BT Academy trên hành trình khai mở tiềm năng giọng nói và phong thái chuyên nghiệp. Chúc các chị em có một ngày 20/10 ngập tràn niềm vui, yêu thương và những khoảnh khắc đáng nhớ!",
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Gửi ngàn lời chúc yêu thương 🌸",
  },

  tet_holiday: {
    bannerImage: "/images/banner-bta.jpg",
    bannerAlt: "BT Academy Chúc Mừng Năm Mới Tết Nguyên Đán",
    bannerPosition: "object-[center_35%]",
    scriptTagline: "Khai xuân đắc lộc",
    mainTitle: "CHÚC MỪNG NĂM MỚI - TẾT NGUYÊN ĐÁN",
    dateSubtitle: "XUÂN BÍNH NGỌ - TẾT CỔ TRUYỀN",
    recipientGreeting: "Học Viện BT Academy Kính Chúc Quý Học Viên & Đối Tác Năm Mới An Khang Thịnh Vượng!",
    wishes: [
      "Nhân dịp Tết cổ truyền dân tộc, Học viện BT Academy xin gửi tới Quý học viên, Quý phụ huynh cùng toàn thể gia đình lời chúc mừng năm mới dồi dào sức khỏe, vạn sự hanh thông và tài lộc thịnh vượng. Chúc các học viên luôn tràn đầy tự tin, làm chủ sân khấu và lan tỏa những thông điệp tích cực bằng giọng nói truyền cảm hứng. Cảm ơn bạn đã lựa chọn BT Academy là người bạn đồng hành tin cậy trên con đường hoàn thiện kỹ năng giao tiếp và thuyết trình. Chúc Quý vị một mùa xuân ấm áp, an vui và ngập tràn hạnh phúc!",
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Khai Xuân & Gửi Lời Chúc Tết 🧧",
  },

  women_day_83: {
    bannerImage: "/images/campaigns/anh-pik-20-10.jpg",
    bannerAlt: "BT Academy Chúc Mừng Ngày Quốc Tế Phụ Nữ 8/3",
    bannerPosition: "object-[center_30%]",
    scriptTagline: "Thân gửi phái đẹp",
    mainTitle: "NGÀY QUỐC TẾ PHỤ NỮ",
    dateSubtitle: "08 THÁNG 03",
    recipientGreeting: "Gửi những người phụ nữ tuyệt vời đang tỏa sáng và truyền cảm hứng cùng BT Academy!",
    wishes: [
      "Nhân ngày Quốc tế Phụ nữ 8/3, BT Academy xin trân trọng gửi những lời chúc dịu dàng, ngọt ngào và chân thành nhất đến toàn thể phái đẹp. Chúc một nửa thế giới luôn rạng ngời, tự tin, hạnh phúc và không ngừng bứt phá với niềm đam mê dẫn chương trình, làm chủ giọng nói và phát triển sự nghiệp. Cảm ơn các bạn đã mang đến cho BT Academy nguồn năng lượng tích cực và sự duyên dáng tuyệt vời. Chúc Quý khách có một ngày 8/3 tràn ngập hoa, quà và những giây phút yêu thương trọn vẹn!",
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Gửi Ngàn Lời Chúc Yêu Thương 🌸",
  },

  holiday_304: {
    bannerImage: "/images/banner-bta.jpg",
    bannerAlt: "BT Academy Chúc Mừng Đại Lễ 30/4 & 1/5",
    bannerPosition: "object-[center_30%]",
    scriptTagline: "Tự hào non sông",
    mainTitle: "GIẢI PHÓNG MIỀN NAM & QUỐC TẾ LAO ĐỘNG",
    dateSubtitle: "30 THÁNG 04 - 01 THÁNG 05",
    recipientGreeting: "Chào Mừng Đại Lễ Non Sông Thống Nhất & Tôn Vinh Người Lao Động Việt Nam!",
    wishes: [
      "Học viện BT Academy xin kính chúc Quý học viên, Quý đối tác cùng toàn thể gia đình một kỳ nghỉ lễ 30/4 - 1/5 thật ý nghĩa, vui vẻ và an toàn. Hòa cùng niềm tự hào dân tộc, chúng tôi xin gửi lời tri ân sâu sắc đến sự nỗ lực, cống hiến bền bỉ của tất cả các học viên trên con đường học tập và rèn luyện kỹ năng mỗi ngày. Chúc bạn có những ngày nghỉ ngơi thư giãn trọn vẹn bên người thân để nạp đầy năng lượng cho những bước tiến mới!",
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Bắn Pháo Hoa Mừng Đại Lễ 🎆",
  },

  national_day_29: {
    bannerImage: "/images/banner-bta.jpg",
    bannerAlt: "BT Academy Chúc Mừng Ngày Quốc Khánh 2/9",
    bannerPosition: "object-[center_35%]",
    scriptTagline: "Tự hào Việt Nam",
    mainTitle: "QUỐC KHÁNH NƯỚC CHXHCN VIỆT NAM",
    dateSubtitle: "02 THÁNG 09",
    recipientGreeting: "Kính Chúc Quý Học Viên & Gia Đình Kỳ Nghỉ Tết Độc Lập Tràn Ngập Niềm Vui & Hạnh Phúc!",
    wishes: [
      "Nhân dịp kỷ niệm Quốc khánh 2/9, Học viện BT Academy xin gửi tới Quý học viên và gia đình những lời chúc bình an, hạnh phúc và thành công. Tự hào là đơn vị đào tạo MC, kỹ năng thuyết trình và luyện giọng nói uy tín, BT Academy luôn nỗ lực đồng hành cùng thế hệ trẻ Việt Nam tự tin cất cao tiếng nói, làm chủ mọi diễn đàn. Chúc bạn có những ngày nghỉ lễ Quốc khánh thật trọn vẹn, ấm cúng và đầy tự hào!",
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Chào Mừng Quốc Khánh 2/9 🇻🇳",
  },

  teachers_day_2011: {
    bannerImage: "/images/gallery/hoc-vien-bt-23.jpg",
    bannerAlt: "BT Academy Tri Ân Ngày Nhà Giáo Việt Nam 20/11",
    bannerPosition: "object-[center_30%]",
    scriptTagline: "Tri ân người truyền lửa",
    mainTitle: "NGÀY NHÀ GIÁO VIỆT NAM",
    dateSubtitle: "20 THÁNG 11",
    recipientGreeting: "Tri Ân Cô Bích Thủy Cùng Đội Ngũ Giảng Viên & MC Chuyên Gia Tại BT Academy!",
    wishes: [
      "Nhân ngày Nhà giáo Việt Nam 20/11, toàn thể học viên và cán bộ BT Academy xin gửi lời tri ân chân thành, sâu sắc nhất đến Cô Bích Thủy cùng các thầy cô, MC chuyên gia giảng dạy. Cảm ơn những người thầy, người cô đã luôn tận tâm chỉ dẫn từng hơi thở, chỉnh sửa từng âm sắc, truyền cảm hứng và tiếp thêm sự tự tin để mỗi học viên tự hào tỏa sáng trên sân khấu cuộc đời. Kính chúc Thầy Cô luôn dồi dào sức khỏe, tràn đầy nhiệt huyết và tiếp tục chắp cánh cho nhiều thế hệ học viên bay cao, bay xa!",
    ],
    signature: "Học viện Đào tạo MC BT Academy 💚",
    actionText: "Gửi Ngàn Lời Tri Ân Thầy Cô 💐",
  },

  xmas_newyear: {
    bannerImage: "/images/banner-bta.jpg",
    bannerAlt: "BT Academy Chúc Mừng Giáng Sinh & Năm Mới",
    bannerPosition: "object-[center_35%]",
    scriptTagline: "Mùa lễ hội an lành",
    mainTitle: "GIÁNG SINH & CHÀO NĂM MỚI",
    dateSubtitle: "MERRY CHRISTMAS & HAPPY NEW YEAR",
    recipientGreeting: "Kính Chúc Quý Học Viên Mùa Giáng Sinh Ấm Áp & Năm Mới Bứt Phá Thành Công!",
    wishes: [
      "Học viện BT Academy xin kính chúc Quý học viên, Quý đối tác cùng gia đình một mùa Giáng sinh an lành, hạnh phúc và ngập tràn tiếng cười. Cảm ơn bạn đã luôn tin tưởng và đồng hành cùng BT Academy trong suốt năm qua. Bước sang thềm năm mới, chúc bạn luôn giữ vững ngọn lửa đam mê, tự tin làm chủ giọng nói và bứt phá ngoạn mục trên con đường dẫn chương trình và phát triển bản thân!",
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Gửi Lời Chúc Giáng Sinh & Năm Mới 🎄",
  },
};

/**
 * Lấy nội dung mẫu mặc định cho một componentKey hoặc tên ngày lễ
 */
export function getHolidayDefaultTemplate(
  componentKey?: string,
  holidayName?: string
): HolidayTemplateData {
  if (componentKey && HOLIDAY_DEFAULT_TEMPLATES[componentKey]) {
    return HOLIDAY_DEFAULT_TEMPLATES[componentKey];
  }

  const name = holidayName || "NGÀY LỄ ĐẶC BIỆT";
  return {
    bannerImage: "/images/banner-bta.jpg",
    bannerAlt: `BT Academy Chúc Mừng ${name}`,
    bannerPosition: "object-[center_30%]",
    scriptTagline: "Chúc mừng ngày lễ",
    mainTitle: name.toUpperCase(),
    dateSubtitle: "CHIẾN DỊCH ĐẶC BIỆT BT ACADEMY",
    recipientGreeting: `Học Viện BT Academy Kính Chúc Quý Học Viên & Gia Đình Kỳ Nghỉ Lễ Nhiều Niềm Vui!`,
    wishes: [
      `Nhân dịp ${name}, BT Academy xin trân trọng gửi tới Quý học viên cùng gia đình những lời chúc tốt đẹp, bình an và hạnh phúc nhất. Cảm ơn bạn đã luôn tin tưởng, đồng hành cùng BT Academy trên hành trình hoàn thiện bản thân và lan tỏa giọng nói truyền cảm hứng. Kính chúc bạn có những khoảnh khắc tuyệt vời và đáng nhớ bên người thân và bạn bè!`,
    ],
    signature: "Thân thương, BT Academy 💚",
    actionText: "Gửi Lời Chúc Mừng Yêu Thương 🌸",
  };
}

