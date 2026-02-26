# 🛡️ BÁO CÁO CODE REVIEW & REFACTORING - SPRINT 5

**Người duyệt (Reviewer):** `@Tech_Lead` (Antigravity)
**Người tạo (Author):** `@Senior_Dev` (Antigravity)
**Mã Ticket:** [LT-501 -> LT-508]
**Trạng thái:** 🟢 **APPROVE (with Refactoring Notes)**

---

## 1. TÓM TẮT THAY ĐỔI (WHAT CHANGED)
Sprint 5 hoàn thành mục tiêu xây dựng tính năng **In ấn Phả ký (PDF Export)** và tối ưu **Trải nghiệm Công khai (Public View)**.
- **Refactoring:** Tách logic upload ảnh chân dung/bia mộ từ `ProfileForm` sang `ProfileImageUpload` hook & component.
- **Architecture:** Loại bỏ logic sắp xếp `.order()` ở Repo layer, đưa lên Application layer để đảm bảo tính linh hoạt.
- **Feature:** Implement giải pháp In bằng cửa sổ mới (`printWindow`) để vượt qua các giới hạn CSS Print của trình duyệt.
- **Security/UX:** Thực hiện ẩn các nút quản trị (CRUD) đối với người dùng chưa đăng nhập.

---

## 2. KẾT QUẢ ĐÁNH GIÁ (REVIEWER'S VERDICT)

### ✅ Kiến trúc (Architecture)
- Việc tách `useProfileImageUpload` rất tốt, giúp giảm tải state cho `ProfileForm`.
- Di chuyển logic sort lên Application layer là quyết định đúng đắn cho sự mở rộng sau này.

### ✅ Hiệu năng & In ấn (Performance & Print)
- Giải pháp "Clean Print Window" giải quyết triệt để lỗi in 1 trang và lẫn lộn sidebar.
- Việc override CSS Tailwind bằng đơn vị `cm` và `pt` trong bản in giúp layout ổn định trên khổ A4.

### ⚠️ Bảo mật & Quyền riêng tư (Security)
- **Lưu ý:** Hiện tại mới chỉ ẩn nút UI. Cần bọc Route `/settings` bằng component `ProtectedRoute` trong Sprint tới để ngăn chặn truy cập URL trực tiếp.

---

## 3. CHECKLIST ĐÃ KIỂM TRA
- [x] Code tuân thủ chuẩn Clean Code và S.O.L.I.D.
- [x] Đã xử lý các trường hợp ngoại lệ (Try/Catch khi in và upload).
- [x] Đã chạy `npx vitest` và đạt 11/11 tests.
- [x] Không để lại `console.log` hay code nháp.
- [x] Test in PDF thực tế: Layout gọn gàng, đúng lề, đủ trang.

---

## 4. ĐỀ XUẤT TÁI CẤU TRÚC (REFACTORING ACTIONS)
- **Action 1:** Chuyển đổi hoàn toàn `ProfileForm` sang việc gọi Component `<ProfileImageUpload />` để loại bỏ JSX thừa.
- **Action 2:** Xây dựng hệ thống **ProtectedRoute** cho toàn app trong Sprint 6.
- **Action 3:** Tối ưu hóa dung lượng build (Vite cảnh báo chunk > 500kB) bằng phương pháp Code Splitting.

---

**Kết luận:** Code chất lượng tốt. Chấp nhận Merge vào hệ thống.
