/**
 * Global Popup Manager
 * Quản lý trạng thái popup toàn trang:
 * 1. Chỉ cho phép DUY NHẤT 1 popup mở cùng một lúc (Single Active Popup Rule).
 * 2. Nếu người dùng chủ động click mở popup (từ nút nhấn, menu, thẻ khóa học, v.v.),
 *    hệ thống sẽ tự động HỦY BỎ hoàn toàn popup tự động sau 2s, tránh tình trạng popup tự động đè lên.
 */

let activePopupId: string | null = null;
let hasAnyPopupOpenedThisPage = false;

if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      activePopupId = null;
      hasAnyPopupOpenedThisPage = false;
    }
  });
}

/**
 * Kiểm tra xem hiện tại có bất kỳ popup nào đang mở trên màn hình không
 */
export function isAnyPopupOpen(): boolean {
  return activePopupId !== null;
}

/**
 * Lấy ID của popup đang mở
 */
export function getActivePopupId(): string | null {
  return activePopupId;
}

/**
 * Kiểm tra xem trong lượt truy cập trang này đã có popup nào từng được mở hay chưa
 */
export function hasAnyPopupOpenedThisPageLoad(): boolean {
  return hasAnyPopupOpenedThisPage;
}

/**
 * Đăng ký mở popup.
 * Trả về `true` nếu mở thành công; `false` nếu đã có popup khác đang mở.
 */
export function openGlobalPopup(id: string, options?: { force?: boolean }): boolean {
  if (typeof window === "undefined") return false;

  // Nếu đang có 1 popup khác mở và không ép ghi đè -> Chặn, không cho mở đè
  if (activePopupId !== null && activePopupId !== id && !options?.force) {
    return false;
  }

  activePopupId = id;
  hasAnyPopupOpenedThisPage = true;

  // Bắn event toàn cục để thông báo cho tất cả các timer tự động hủy ngay lập tức
  window.dispatchEvent(
    new CustomEvent("bta:popup:opened", { detail: { id, force: options?.force } })
  );

  return true;
}

/**
 * Đăng ký đóng popup
 */
export function closeGlobalPopup(id?: string): void {
  if (typeof window === "undefined") return;

  if (!id || activePopupId === id) {
    const closedId = activePopupId;
    activePopupId = null;
    window.dispatchEvent(
      new CustomEvent("bta:popup:closed", { detail: { id: closedId } })
    );
  }
}

/**
 * Hủy bỏ mọi popup tự động đang chờ mở (gọi khi người dùng bấm vào nút mở popup)
 */
export function cancelPendingAutoPopups(): void {
  hasAnyPopupOpenedThisPage = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("bta:popup:cancel_auto"));
  }
}

