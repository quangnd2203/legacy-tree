# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** LegacyTree | **Sprint:** 05
**Mục tiêu của Sprint (Sprint Goal):** Xuất PDF Sách Gia Phả (mỗi Hộ một trang), Public View không cần đăng nhập, và dọn sạch Tech Debt tồn từ Sprint 4.
**Bắt đầu:** 26/02/2026 | **Kết thúc:** 05/03/2026
**Tham gia:** @USER (Client/PM/Trưởng Tộc), @Antigravity (Technical Lead/Senior Dev)

---

## 1. REVIEW SỨC CHỨA CỦA TEAM (CAPACITY)

| Thành viên | Capacity | Ghi chú |
|---|---|---|
| @Antigravity (Tech Lead + Senior Dev) | 100% | Kiêm cả BA/QA cho dự án nội bộ |

- **Velocity Sprint 4:** 34 SP (100% delivery)
- **Velocity Sprint 3:** 44 SP
- **Velocity trung bình:** ~39 SP → **Target Sprint 5: ~35 SP** *(thận trọng vì PDF là tính năng mới chưa làm)*

---

## 2. CHỐT SPRINT BACKLOG

### 🖨️ Nhóm A — Tính năng mới: Xuất PDF Sách Gia Phả

| ID | Tên chức năng (User Story) | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-501 | **[CSS Print] Dàn trang PDF chuẩn**: Thêm `@media print` CSS vào `AncestryBook.tsx`. Mỗi FamilyUnit có `page-break-after: always`. Ẩn sidebar, header, buttons khi in. | 3 | 🔲 Todo | @Senior_Dev |
| LT-502 | **[UI] Nút "In Phả Ký"**: Nút xuất hiện trên trang Phả Ký, chỉ Admin thấy. Gọi `window.print()`. Có nút "Xem trước bản in" (toggle print-preview class). | 3 | 🔲 Todo | @Senior_Dev |
| LT-503 | **[Layout] Bìa sách dạng trang in**: Bìa sách (tên Tộc, Chi, Quê quán, Lời tựa thơ) phải là trang riêng biệt, đứng trước tất cả các Hộ trong bản PDF. | 2 | 🔲 Todo | @Senior_Dev |
| LT-504 | **[Print] Footer số trang**: Mỗi trang PDF có footer hiển thị số trang và `BOOK_FOOTER`. Dùng CSS `@page` + `counter(page)`. | 2 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm A: 10 SP**

---

### 🌐 Nhóm B — Public View

| ID | Tên chức năng (User Story) | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-505 | **[Auth] Public View — Sách Gia Phả không cần đăng nhập**: Route `/book` và `/tree` cho phép Public truy cập mà không cần login. Ẩn nút Thêm/Sửa/Xóa khi là Public. | 5 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm B: 5 SP**

---

### 🛠️ Nhóm C — Tech Debt (từ Code Review Sprint 4)

| ID | Tên chức năng (User Story) | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-507 | **[Refactor] Tách `ProfileImageUpload.tsx`**: `ProfileForm.tsx` đang 499 dòng, tách phần Upload ảnh (portrait + grave) thành component riêng để dễ test và bảo trì. | 3 | 🔲 Todo | @Senior_Dev |
| LT-508 | **[Refactor] Bỏ `.order()` ở SupabaseProfileRepository**: Sort logic nên tập trung tại UseCase (`processAncestryBook`), không nên sort ở tầng Repository. | 1 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm C: 4 SP**

---

**🎯 Tổng Sprint 5: 18 SP**

---

## 3. ACCEPTANCE CRITERIA CHI TIẾT

### LT-501 — CSS Print / Dàn trang
- [ ] Khi in/export PDF, mỗi FamilyUnit nằm gọn trong 1 trang, không bị cắt giữa chừng.
- [ ] Sidebar, header, nút Edit/Refresh... không xuất hiện trong bản in.
- [ ] Typography khi in: font serif, màu đen/trắng, không có background màu xanh/gradient.

### LT-502 — Nút In Phả Ký
- [ ] Nút "In Phả Ký" hiển thị trên trang `/book`, chỉ user đã login (Admin) thấy.
- [ ] Nhấn nút → mở hộp thoại in của trình duyệt (hoặc download PDF nếu dùng html2pdf).
- [ ] Có nút toggle "Xem trước bản in" để preview layout trước khi in.

### LT-503 — Bìa sách
- [ ] Bìa sách là trang đầu tiên trong PDF.
- [ ] Hiển thị: Tên Tộc, Phái, Chi, Quê quán, Lời tựa thơ (lấy từ ClanSettings).
- [ ] Bìa sách chiếm đúng 1 trang, có `page-break-after: always`.

### LT-504 — Footer số trang
- [ ] Mỗi trang PDF hiển thị số trang ở footer (VD: "Trang 3 / 25").
- [ ] Footer hiển thị `BOOK_FOOTER` từ GenealogyConfig.

### LT-505 — Public View
- [ ] Truy cập `/book` và `/tree` khi chưa đăng nhập → vẫn thấy được nội dung.
- [ ] Nút "Thêm thành viên", icon Edit không hiển thị với Public.
- [ ] Nút "Đăng nhập" hiển thị thay vì "Đăng xuất" với Public.

### LT-507 — ProfileImageUpload
- [ ] Tách thành `ProfileImageUpload.tsx` độc lập.
- [ ] `ProfileForm.tsx` giảm xuống < 350 dòng sau khi tách.
- [ ] Chức năng upload ảnh vẫn hoạt động như cũ.

### LT-508 — Bỏ Repository sort
- [ ] `SupabaseProfileRepository.getAll()` không còn `.order('full_name')`.
- [ ] Mọi nơi dùng `getAll()` vẫn hiển thị đúng thứ tự (vì sort đã được xử lý ở UseCase).

---

## 4. THỨ TỰ THỰC HIỆN (DEPENDENCIES)

```
LT-505 (Public View) → có thể bắt đầu ngay
LT-501 → LT-503 → LT-504 → LT-502  (PDF Pipeline)
LT-507 → LT-508  (Cleanup — song song)
```

---

## 5. RỦI RO / TRỞ NGẠI

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| CSS `@media print` không đủ mạnh để control page-break trên Chrome | Medium | Fallback sang `html2pdf.js` nếu CSS print không đủ |
| Public View cần redesign Auth flow (hiện tại luôn redirect về Login) | Medium | Tạo `PublicRoute` wrapper song song `ProtectedRoute` |

---

## 6. DEFINITION OF DONE — SPRINT 5

- [ ] Nhấn "In Phả Ký" → PDF xuất ra đúng, mỗi Hộ 1 trang, có bìa sách.
- [ ] Route `/book` và `/tree` truy cập được khi chưa đăng nhập.
- [ ] `ProfileForm.tsx` < 350 dòng sau khi tách `ProfileImageUpload`.
- [ ] Code Review APPROVED bởi @Tech_Lead.
- [ ] Không có Rollover ticket.

---

## 7. GHI CHÚ TECH LEAD

> **Ngày 25/02/2026:**
> - **CSS Print** là hướng ưu tiên vì không cần thư viện mới, không tăng bundle size. Chỉ switch sang `html2pdf.js` nếu Chrome/Safari print bị lỗi page break với `break-inside: avoid`.
> - **Public View:** Cần tách bạch rõ 2 luồng — `<ProtectedRoute>` (chỉ Admin) và `<PublicRoute>` (ai cũng vào được). Trang Settings và nút CRUD vẫn phải ProtectedRoute.

---
*Biên bản Sprint Planning được lập bởi @Antigravity (Tech Lead) ngày 25/02/2026.*
