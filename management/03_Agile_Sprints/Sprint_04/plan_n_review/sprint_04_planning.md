# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** LegacyTree | **Sprint:** 04
**Mục tiêu của Sprint (Sprint Goal):** Xây dựng Module Cài đặt Dòng Họ (Clan Settings) & trả Tech Debt còn tồn từ Sprint 3 để nâng chất lượng hệ thống.
**Bắt đầu:** 26/02/2026 | **Kết thúc:** 05/03/2026
**Tham gia:** @USER (Client/PM/Trưởng Tộc), @Antigravity (Technical Lead/Senior Dev)

---

## 1. CHỐT SPRINT BACKLOG (DANH SÁCH TASK SẼ LÀM)

### 🏯 Nhóm A — Tính năng mới: Cài đặt Dòng Họ (Clan Settings)

| ID | Tên chức năng (User Story) | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-401 | **[DB] Tạo bảng `clan_settings`**: Schema đầy đủ — tên tộc/phái/chi, 4 cấp quê quán (làng/xã/huyện/tỉnh), thông tin phả (tiêu đề, năm lập, người lập, generation_offset), preface_poem (HTML) | 3 | ✅ Done | @Senior_Dev |
| LT-402 | **[Backend] ClanSettings Domain + Use-Case + Repository**: Domain interface, createClanSettings, updateClanSettings, getClanSettings theo chuẩn Clean Architecture | 5 | ✅ Done | @Senior_Dev |
| LT-403 | **[UI] Trang `/settings` — Cài đặt Dòng Họ**: Form đầy đủ tất cả các trường, thêm route `/settings` vào Router, chỉ Admin thấy link trong Nav | 5 | ✅ Done | @Senior_Dev |
| LT-404 | **[UI] Rich Text Editor cho Lời Tựa**: Tích hợp `TipTap` cho field `preface_poem`. Sanitize bằng `DOMPurify` trước khi lưu xuống DB. | 5 | ✅ Done | @Senior_Dev |
| LT-405 | **[UI] Hiển thị Clan Settings trong Sách Gia Phả**: Bìa sách tự động lấy tên Tộc/Phái/Chi + Quê quán từ DB. Bài thơ lời tựa hiển thị trang trọng TRƯỚC khi vào nội dung. Fallback về `GenealogyConfig.ts` nếu chưa cấu hình. | 5 | ✅ Done | @Senior_Dev |

**Tổng Nhóm A: 23 SP**

---

### 🛠️ Nhóm B — Tech Debt (Từ Retrospective Sprint 3)

| ID | Tên chức năng (User Story) | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-407 | **[Test] Unit Tests cho core logic**: Viết test cho hàm `processAncestryBook()`, `sortProfilesByTraditionalSeniority()`, `getDisplayBirthDate()`. Mục tiêu: catch được 2 bug từ Sprint 3 nếu chạy lại. | 5 | ✅ Done | @Senior_Dev |
| LT-408 | **[Docs] JSDoc cho `FamilyTree.tsx`**: Bổ sung comment/JSDoc giải thích thuật toán `layoutNode`, `buildGenMap`, cách tính `genMap` cho spouses. | 2 | ✅ Done | @Senior_Dev |
| LT-409 | **[Process] Bổ sung Acceptance Criteria vào mẫu Sprint Planning**: Cập nhật template `02_sprint_planning_meeting.md` để mỗi ticket phải có mục AC cụ thể. | 1 | ✅ Done | @Tech_Lead |
| LT-410 | **[FamilyTree] Review & stress-test thuật toán layout**: Kiểm tra với data phức tạp (nhiều chi nhánh, nhiều nhánh song song) để đảm bảo không tái lỗi Đời 4 lên Đời 1. | 3 | ✅ Done | @Tech_Lead |

**Tổng Nhóm B: 11 SP**

---

**Tổng Sprint 4: 34 SP** *(Velocity Sprint 3 là 44 SP — buffer an toàn vì Sprint 4 có test writing)*

---

## 2. ACCEPTANCE CRITERIA CHI TIẾT

> *Áp dụng cải tiến từ Sprint 3 Retrospective: Mỗi ticket phải có AC cụ thể được định nghĩa TRƯỚC khi dev bắt tay.*

### LT-401 — DB Schema
- [x] Tồn tại bảng `clan_settings` trong Supabase với đủ 12 cột đã spec.
- [x] Migration SQL được lưu trong `supabase/migrations/20260226_create_clan_settings.sql`.
- [x] Bảng có RLS: authenticated user WRITE, Public có thể Read. *(TD-001: nâng cấp Admin-only ở Sprint 5)*

### LT-402 — Backend
- [x] Có `ClanSettings` interface trong `src/domain/clan-settings/ClanSettings.ts`.
- [x] Có `ClanSettingsUseCases.ts` trong `src/application/`.
- [x] Có `SupabaseClanSettingsRepository.ts` trong `src/infrastructure/`.
- [x] Các function `get`, `upsert` hoạt động đúng. *(Tối ưu TD-002: 1 round-trip)*

### LT-403 — Settings Page UI
- [x] Route `/settings` hoạt động, không reload trang.
- [x] Link "Cài đặt" trong Nav chỉ hiện khi đăng nhập.
- [x] Form lưu được dữ liệu và hiển thị lại đúng khi F5.
- [x] Validation: `clan_name` là trường bắt buộc.

### LT-404 — Rich Text Editor
- [x] Editor `TipTap` hiển thị đúng trong trang Settings.
- [x] Hỗ trợ tối thiểu: in đậm, in nghiêng, xuống dòng, căn giữa.
- [x] HTML được sanitize bằng `DOMPurify` trước khi INSERT vào DB.
- [x] Không có lỗi XSS khi thử nhập `<script>alert('xss')</script>`.

### LT-405 — Hiển thị trong Sách Gia Phả
- [x] Đầu trang Sách Gia Phả hiển thị: `[clan_name] — [branch_name] — [sub_branch_name]`.
- [x] Quê quán gốc hiển thị đúng format: `[village], [commune], [district], [province]`.
- [x] Bài thơ lời tựa hiện TRỰC TIẾP bằng HTML (render `dangerouslySetInnerHTML`), có styling trang trọng.
- [x] Nếu chưa có dữ liệu trong DB, fallback về giá trị mặc định.

### LT-407 — Unit Tests
- [x] 5 test cases cho `processAncestryBook()`: con gái không lập hộ, sort thứ bậc, root detection, generation, partner.
- [x] 3 test cases cho `sortProfilesByTraditionalSeniority()`.
- [x] 3 test cases cho `getDisplayBirthDate()`: lunar priority, solar fallback, null.
- [x] 11/11 tests PASS khi chạy `npx vitest run`.

---

## 3. CHIẾN LƯỢC THỰC HIỆN

### Thứ tự làm (Dependencies):
```
LT-401 (DB) → LT-402 (Backend) → LT-403 (UI Form) → LT-404 (Rich Text) → LT-405 (Ancestry Book)
```
> ⚠️ Nhóm A phải làm **tuần tự**. LT-407~410 (Nhóm B) có thể làm **xen kẽ** giữa các bước.

---

## 4. DEFINITION OF DONE — SPRINT 4

- [x] Trang `/settings` hoạt động, lưu và đọc dữ liệu Clan Settings thành công.
- [x] Trang Sách Gia Phả hiển thị đúng tên Tộc/Chi/Phái + Quê quán + Bài thơ lời tựa.
- [x] `DOMPurify` bảo vệ field `preface_poem` khỏi XSS.
- [x] Có **11 unit test cases** cho core business logic (PASS 100%).
- [x] `ProcessAncestryBook.ts` có JSDoc đầy đủ cho `buildGenMap`, `processAncestryBook`, `sortProfilesByTraditionalSeniority`.
- [x] Không có Rollover ticket nào.
- [x] Code Review ✅ APPROVED — xem `sprint_04_code_review_full.md`.

---

## 5. GHI CHÚ TECH LEAD

> **Ngày 25/02/2026:** LT-402 phải nghiêm túc tuân thủ Clean Architecture:
> - Domain model `ClanSettings` **không** import bất kỳ thứ gì từ Supabase/React.
> - Dùng kiểu `upsert` (không cần phân biệt Insert/Update vì bảng chỉ có 1 row per project).
> - **Bất khả xâm phạm:** `processAncestryBook.ts` và `GenealogyConfig.ts` không cần sửa để hỗ trợ Clan Settings — chỉ cần đọc từ DB hook riêng.

---
*Biên bản Sprint Planning được lập bởi @Antigravity (Tech Lead) ngày 25/02/2026.*
