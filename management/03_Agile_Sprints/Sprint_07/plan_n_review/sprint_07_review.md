# BIÊN BẢN HỌP: SPRINT REVIEW (ĐÁNH GIÁ SPRINT)

**Dự án:** Legacy Tree | **Sprint:** 07
**Mục tiêu Sprint (Sprint Goal):** Dự án an toàn để chia sẻ — Bảo mật route + database, giao diện mobile, dọn nav.
**Ngày Demo:** 26/02/2026 | **Thời gian:** 10:00 - 10:30
**Stakeholders tham dự:** Khách hàng, Giám đốc, Ban quản trị
**Team trình bày:** @Senior_Dev, @Tech_Lead, @Managing_Director_PM, @QA

---

## 1. TỔNG KẾT NHANH SPRINT VỪA QUA
- Tổng số User Stories dự định làm: 7 tickets (28 SP)
- Số lượng hoàn thành (Done): 7 tickets (28 SP)
- Số lượng chưa hoàn thành (Rollover): 0

## 2. PHẦN TRÌNH DIỄN (DEMO SẢN PHẨM KHẢ DỤNG)
*(Demo trực tiếp trên môi trường Staging/UAT)*

**Tính năng 1: Bảo mật Hệ thống (LT-601, LT-506)**
-   **Người trình bày:** `@Tech_Lead`
-   **Kịch bản Demo:** Cố gắng truy cập các trang `/settings`, `/members` khi chưa login -> Bị redirect. Demo tạo/xóa dữ liệu bằng test account -> Bị chặn bởi RLS.
-   **Ghi nhận phản hồi (Feedback):** Tính năng hoạt động ổn định, bảo mật tốt. Sẵn sàng đưa ra mạng public để share.

**Tính năng 2: Giao diện Mobile (LT-602)**
-   **Người trình bày:** `@Senior_Dev`
-   **Kịch bản Demo:** Resize màn hình xuống 375px. Kiểm tra hiển thị Cây Gia Phả, Phả Ký, và Danh sách thành viên (bảng dữ liệu tự động rút gọn cột).
-   **Ghi nhận phản hồi (Feedback):** Giao diện rất mượt, các component như Header, Footer, Modal bung full-screen rất thân thiện với trải nghiệm mobile.

**Tính năng 3: Fix Bug & Code Quality (LT-901, LT-1002, LT-1003, LT-1004)**
-   **Người trình bày:** `@Senior_Dev`
-   **Kịch bản Demo:** Trình diễn source code đã tách 4 fieldsets (ProfileForm), check lại logic cột Đời và sắp xếp hiển thị Partner cạnh nhau trong danh sách.
-   **Ghi nhận phản hồi (Feedback):** Code chuẩn Clean Architecture, các bug cũ được giải quyết triệt để.

## 3. THẢO LUẬN & PHÊ DUYỆT (ACCEPTANCE)
-   **Đạt yêu cầu (Approved):** Toàn bộ 7 tickets (28 SP) được phê duyệt!
-   **Chưa đạt (Rejected):** Không.

## 4. KẾT LUẬN & BƯỚC TIẾP THEO
- Dự án đạt chuẩn "An toàn để chia sẻ" (Safe to share) và có trải nghiệm di động tốt.
- Codebase sạch, giảm tech debt đáng kể.
- Team sẵn sàng bước sang Sprint 8 tập trung vào hệ thống Gửi yêu cầu (Contribution flow).
