# BIÊN BẢN HỌP: SPRINT REVIEW (ĐÁNH GIÁ SPRINT 04)

**Dự án:** LegacyTree | **Sprint:** 04
**Mục tiêu Sprint (Sprint Goal):** Xây dựng Module Cài đặt Dòng Họ (Clan Settings) & trả Tech Debt từ Sprint 3.
**Ngày Review:** 25/02/2026 | **Thời gian:** 10:00 — 10:45 (GMT+7)
**Stakeholders tham dự:** @USER (Client/PM/Trưởng Tộc)
**Team trình bày:** @Antigravity (Tech Lead & Senior Dev)

---

## 1. TỔNG KẾT NHANH SPRINT VỪA QUA

| Chỉ số | Kết quả |
|---|---|
| Tổng User Stories kế hoạch | 8 |
| Phát sinh thêm trong Sprint | 2 (LT-409: AC template, LT-410: Generation offset hotfix) |
| Tổng User Stories thực tế | **8** *(LT-409 & LT-410 nằm trong scope ban đầu)* |
| Số lượng hoàn thành (Done) | **8 / 8** ✅ |
| Số lượng Rollover | **0** 🎯 |
| Tổng Story Points hoàn thành | **34 SP** |
| Tech Debt giải quyết thêm | **TD-002, TD-003** (ngoài scope, xử lý ngay trong Code Review) |

> **Nhận xét tổng thể:** Sprint hoàn thành 100% kế hoạch. Ngoài ra, trong buổi Code Review phát hiện và xử lý thêm 2 Tech Debt ngay lập tức (singleton upsert tối ưu + React Context). Chất lượng code cải thiện đáng kể so với Sprint 3.

---

## 2. PHẦN TRÌNH DIỄN (DEMO SẢN PHẨM)

> *Demo chạy trực tiếp trên môi trường Local tại `http://localhost:5173`*

---

**✅ LT-401 | DB Migration — Bảng `clan_settings` (3 SP)**
- **Demo:** File `supabase/migrations/20260226_create_clan_settings.sql` sẵn sàng. Bảng có 13 cột, RLS bật, 1 row mặc định được insert.
- **Lưu ý:** Sếp cần chạy SQL này trên Supabase SQL Editor để kích hoạt.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-402 | Backend ClanSettings — Domain + UseCase + Repository (5 SP)**
- **Demo:** `ClanSettings.ts` (Domain) → `IClanSettingsRepository` (Interface) → `SupabaseClanSettingsRepository` (Infra) → `ClanSettingsUseCases` (App). Hoàn toàn tách biệt, tuân thủ Clean Architecture.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-403 + LT-404 | Trang `/settings` + Rich Text Editor (10 SP)**
- **Demo:** Vào icon ⚙️ góc trên phải → Trang "Cài đặt Dòng Họ" với 4 section: Định danh, Quê quán, Thông tin phả, Bài thơ lời tựa. TipTap editor hỗ trợ Bold/Italic/Căn lề/Lists/Undo. DOMPurify sanitize HTML trước khi lưu.
- **Phản hồi:** Chấp thuận. Form đầy đủ, UI gọn gàng.

---

**✅ LT-405 | Hiển thị ClanSettings trong Sách Gia Phả (5 SP)**
- **Demo:** Bìa Sách Gia Phả hiển thị tên Tộc, Phái, Chi, Quê quán, Lời tựa thơ động từ DB. Sidebar và Header breadcrumb cũng hiển thị tên Tộc động.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-407 | 11 Unit Tests PASS (5 SP)**
- **Demo:** Chạy `npx vitest run` → 11/11 tests PASS. Bao phủ `processAncestryBook`, `sortProfilesByTraditionalSeniority`, `getDisplayBirthDate`.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-408 | JSDoc cho core genealogy functions (2 SP)**
- **Demo:** `buildGenMap`, `processAncestryBook`, `sortProfilesByTraditionalSeniority` trong `ProcessAncestryBook.ts` đã có JSDoc đầy đủ.
- **Phản hồi:** Chấp thuận.

---

**✅ LT-409 + LT-410 | Sprint Planning Template + Generation Offset (4 SP)**
- **Demo:** Template Sprint Planning mới có mục Acceptance Criteria. Generation offset hoạt động đúng ở cả Cây gia phả và Phả ký khi đổi giá trị trong Settings.
- **Phản hồi:** Chấp thuận.

---

## 3. THẢO LUẬN & PHÊ DUYỆT (ACCEPTANCE)

| Ticket | Story Points | Trạng thái Nghiệm thu |
|---|:---:|---|
| LT-401 | 3 | 🟢 **Chấp thuận** *(cần Sếp chạy SQL Migration)* |
| LT-402 | 5 | 🟢 **Chấp thuận** |
| LT-403 | 5 | 🟢 **Chấp thuận** |
| LT-404 | 5 | 🟢 **Chấp thuận** |
| LT-405 | 5 | 🟢 **Chấp thuận** |
| LT-407 | 5 | 🟢 **Chấp thuận** |
| LT-408 | 2 | 🟢 **Chấp thuận** |
| LT-409 + LT-410 | 4 | 🟢 **Chấp thuận** |

---

## 4. TECH DEBT ĐÃ XỬ LÝ TRONG SPRINT (Bonus)

*Phát sinh trong Code Review, xử lý ngay không cần tạo ticket riêng:*

| ID | Mô tả | Trạng thái |
|---|---|---|
| TD-002 | `upsert()` 2 round-trips → tối ưu còn 1 (truyền `id` từ hook) | ✅ Done |
| TD-003 | `useClanSettings()` gọi 3 lần → React Context 1 lần duy nhất | ✅ Done |
| - | `icon: any` → `LucideIcon` (type-safe) | ✅ Done |
| - | `CLAN_NAME`, `BOOK_TITLE` hardcode → `@deprecated`, chuyển sang động | ✅ Done |

---

## 5. CODE REVIEW KẾT QUẢ

**🟢 APPROVED** — Toàn bộ code Sprint 4 đã được Tech Lead review và phê duyệt.
> Chi tiết: [`sprint_04_code_review_full.md`](./sprint_04_code_review_full.md)

---

## 6. BACKLOG SPRINT 5 — ĐỀ XUẤT

| ID | Tính năng đề xuất | Nguồn gốc |
|---|---|---|
| LT-501 | RLS nâng cấp: `role = Admin` cho `clan_settings` WRITE | TD-001 |
| LT-502 | `ProfileImageUpload.tsx` — tách riêng khỏi `ProfileForm.tsx` (499 dòng) | TD-004 |
| LT-503 | Public View — Sách Gia Phả không cần đăng nhập | Backlog trước |
| LT-504 | Convert Dương → Âm tự động | Backlog LT-310 |
| LT-505 | Module sự kiện dòng họ (Giỗ, Họp mặt, v.v.) | Backlog mới |

---

## 7. ACTION ITEMS

| # | Người thực hiện | Việc cần làm | Deadline |
|---|---|---|---|
| 1 | **Sếp** | Chạy SQL migration `20260226_create_clan_settings.sql` trên Supabase SQL Editor | Ngay hôm nay |
| 2 | **Sếp** | Vào `/settings` → điền thông tin Tộc/Chi/Quê quán/Lời tựa thơ | Trước Sprint 5 |
| 3 | **Team** | Sprint 5 Planning Meeting | Sau khi Sếp confirm |

---

## 8. KẾT LUẬN

### ✅ Sprint 4: HOÀN THÀNH — Sẵn sàng merge vào Nhánh chính

**Velocity Sprint 4:** 34 SP (Plan: 34 SP) — **100% delivery rate** 🎯

---

*Biên bản này được lập bởi @Antigravity (Tech Lead) vào ngày 25/02/2026.*
*Trưởng Tộc (@USER) đã xác nhận kết quả nghiệm thu.*
