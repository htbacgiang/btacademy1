import React from "react";
import ContactFormPopup from "../campaigns/ContactFormPopup";

/**
 * RegistrationPopup đồng bộ 100% với ContactFormPopup (Single Source of Truth)
 * - Khi người dùng tự ấn mở nút: KHÔNG giới hạn thời gian mở (autoCloseSeconds = 0), chỉ tắt khi người dùng ấn đóng.
 */
const RegistrationPopup = ({
  isOpen,
  onClose,
  courseSlug,
  title,
  subtitle,
  autoCloseSeconds = 0,
  ...props
}) => {
  return (
    <ContactFormPopup
      isModal={true}
      isOpen={isOpen}
      onClose={onClose}
      courseSlug={courseSlug}
      title={title}
      subtitle={subtitle}
      autoCloseSeconds={autoCloseSeconds}
      {...props}
    />
  );
};

export default RegistrationPopup;
