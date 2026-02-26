# BIÊN BẢN HỌP: SPRINT REVIEW (ĐÁNH GIÁ SPRINT 03)

**Dự án:** LegacyTree | **Sprint:** 03
**Mục tiêu Sprint (Sprint Goal):** Nâng cấp UX với Modal/Routing, xây dựng Module Phả ký và tái cấu trúc Architecture cho tính năng Phả ký đạt chuẩn Clean Architecture.
**Ngày Review:** 25/02/2026 | **Thời gian:** 07:30 — 08:45 (GMT+7)
**Stakeholders tham dự:** @USER (Client/PM/Trưởng Tộc)
**Team trình bày:** @Antigravity (Tech Lead & Senior Dev)

---

## 1. TỔNG KẾT NHANH SPRINT VỪA QUA

| Chỉ số | Kết quả |
|---|---|
| Tổng User Stories ban đầu | 9 |
| Phát sinh thêm trong Sprint | 1 (LT-310: Dual-date System — Pháp sinh từ yêu cầu thực tế của Trưởng Tộc) |
| Tổng User Stories thực tế | **10** |
| Số lượng hoàn thành (Done) | **10 / 10** ✅ |
| Số lượng Rollover | **0** 🎯 |
| Tổng Story Points hoàn thành | **44 SP** |

> **Nhận xét tổng thể:** Một Sprint đặc biệt hiệu quả. Vừa hoàn thành đủ kế hoạch ban đầu, vừa tiếp nhận và xử lý gọn 1 yêu cầu phát sinh thực tế (LT-310) ngay trong Sprint mà không bị ảnh hưởng đến các task còn lại.

---

## 2. PHẦN TRÌNH DIỄN (DEMO SẢN PHẨM KHẢ DỤNG)

> *Demo đã chạy trực tiếp trên môi trường Local tại địa chỉ `http://localhost:5173`.*

---

**✅ LT-301 | Hệ thống Routing (5 SP)**
- **Demo:** Truy cập trực tiếp `/tree`, `/members`, `/book` qua URL đều hoạt động đúng, không bị quay về trang chủ.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-302 + LT-303 | Modal Popup Form & Nút Edit (8 SP)**
- **Demo:** Nhấn "Thêm thành viên" → Modal mở ra ở giữa màn hình. Nhấn nút ✏️ trên node Cây gia phả → Modal Edit mở đúng người, không nhảy Tab.
- **Phản hồi:** Chấp thuận. UX mượt mà hơn hẳn.

---

**✅ LT-304 | Module Phả ký - Ancestry Book (8 SP)**
- **Demo:** Trang `/book` hiển thị Sách gia phả tự động từ dữ liệu thực. Mỗi "Hộ" có đủ: Đời thứ, Danh hiệu (Nhất Lang / Nhị Nương...), Trực hệ, Phối ngẫu, Hậu duệ.
- **Phản hồi:**
  - ✅ Giao diện trang sách trang trọng và dễ đọc.
  - ✅ Danh xưng Nhất/Nhị/Tam Lang — Nương hiển thị chính xác.
  - 🔴 **Phát hiện bug:** Con gái (Gender=Female, có Father_ID) được tạo Hộ riêng một cách không cần thiết. → Đã Fix ngay trong Sprint (LT-311).
  - 🔴 **Phát hiện bug:** Thứ tự sắp xếp Hộ trong cùng Đời sử dụng Năm sinh thay vì Seniority Index → Dẫn đến Tứ Lang đứng trên Nhị Lang. → Đã Fix ngay trong Sprint (LT-311).

---

**✅ LT-305 → LT-308 | Refactoring Architecture (13 SP)**
- **Demo:** Kiểm tra source code. `AncestryBook.tsx` không còn chứa bất kỳ business logic nào. Toàn bộ config, sort, rank nằm đúng tầng (`shared`, `application`).
- **Phản hồi:** Chấp thuận. Code clean và dễ maintain.

---

**✅ LT-309 | Seniority Index & Sắp xếp truyền thống (5 SP)**
- **Demo:** Form nhập liệu có trường "Thứ bậc". Danh sách thành viên và Phả ký đều xếp đúng Nam > Thứ bậc > Tuổi. Vợ luôn hiện ngay sau Chồng.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-310 | Hệ thống Ngày sinh kép — Dual-date System (5 SP)**
*Ticket phát sinh trong Sprint, hoàn thành 100%.*
- **Demo:** Form nhập liệu có ô "Ngày sinh Âm lịch" mới. Nhập "2/2 Nhâm Dần 1962 Giờ Tý" → hiển thị đúng trong Phả ký kèm nhãn **[Âm]**. Dương lịch vẫn là fallback nếu không có Âm.
- **Phản hồi:** Chấp thuận. Đây chính xác là thứ cần thiết cho dữ liệu gia tộc truyền thống.

---

## 3. THẢO LUẬN & PHÊ DUYỆT (ACCEPTANCE)

| Ticket | Trạng thái Nghiệm thu | Ghi chú |
|---|---|---|
| LT-301 | 🟢 **Chấp thuận** | |
| LT-302 + LT-303| 🟢 **Chấp thuận** | |
| LT-304 | 🟢 **Chấp thuận** | Kèm 2 Bug đã Fix ngay |
| LT-305 → LT-308 | 🟢 **Chấp thuận** | |
| LT-309 | 🟢 **Chấp thuận** | |
| LT-310 | 🟢 **Chấp thuận** | **Cần Sếp chạy SQL Migration trên Supabase** |

---

## 4. BUG PHÁT SINH & ĐÃ XỬ LÝ TRONG SPRINT (LT-311)

*Hai bug sau được phát hiện trong buổi Demo thực tế và đã được Fix trực tiếp trong Sprint 3 (không rollover):*

| # | Bug | Nguyên nhân gốc | Giải pháp |
|---|---|---|---|
| 1 | Con gái có cha được lập Hộ riêng trong Phả ký | `candidates` filter chưa loại trừ `Female + father_id` | Thêm điều kiện `if Female && father_id → return false` |
| 2 | Tứ Lang đứng trên Nhị Lang | `units.sort()` chỉ dùng `birth_year`, bỏ qua `seniority_index` | Áp dụng đúng thứ tự Sort `Gender > Seniority Index > Birth Year` cho `units.sort()` |

---

## 5. KẾT LUẬN & BƯỚC TIẾP THEO

### ✅ Sprint 3: HOÀN THÀNH — Sẵn sàng merge vào Nhánh chính

### 🔖 Action Items trước Sprint 4:
1.  **[Sếp]** Chạy SQL migration trên **Supabase SQL Editor** để kích hoạt tính năng LT-310:
    ```sql
    ALTER TABLE public.profiles ADD COLUMN birth_date_lunar TEXT;
    COMMENT ON COLUMN public.profiles.birth_date_lunar IS 'Ngày sinh Âm lịch (nhập tay tự do).';
    ```
2.  **[Team]** Backlog Sprint 4 tiềm năng:
    - Tính năng Convert Dương → Âm tự động (Optional Feature từ LT-310).
    - Tính năng Public View (Khách vãng lai xem Phả ký không cần đăng nhập).
    - Module Upload ảnh phần mộ.
    - Tính năng Approve/Reject đóng góp của Contributor.

---

*Biên bản này được lập bởi @Antigravity (Tech Lead) vào ngày 25/02/2026.*
*Trưởng Tộc (@USER) đã xác nhận kết quả nghiệm thu.*
