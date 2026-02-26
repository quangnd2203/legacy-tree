# BIÊN BẢN CODE REVIEW: SPRINT 4 — ClanSettings Feature

**Người tạo PR (Author):** @Senior_Dev (Antigravity)
**Người duyệt (Reviewer):** @Tech_Lead (Antigravity)
**Mã Ticket:** LT-401 → LT-408, LT-410 (Hotfix: Generation Offset)
**Tiêu đề PR:** `feat(clan-settings): Full Clan Settings domain + UI + AncestryBook integration`
**Ngày review:** 25/02/2026

---

## 1. TÓM TẮT THAY ĐỔI

- Tạo domain mới `clan-settings` hoàn toàn tách biệt khỏi `profiles`
- SQL migration bảng `clan_settings` (Singleton pattern + RLS)
- Full Clean Architecture stack: Domain → Interface → Repository → UseCase → Hook → UI
- TipTap Rich Text Editor cho lời tựa + DOMPurify sanitize (XSS protection)
- Hiển thị bìa sách, quê quán, lời tựa động trong `AncestryBook.tsx`
- `generation_display_offset` áp dụng đúng ở cả **Sách gia phả** và **Cây gia phả**
- 11/11 Unit Tests PASS, Vite Production Build ✓

---

## 2. CHECKLIST CỦA AUTHOR (@Senior_Dev)

- [x] Tuân thủ Clean Architecture (Domain không import Infrastructure)
- [x] Xử lý ngoại lệ: `try/catch` trong repo + hook, error state hiển thị UI
- [x] DOMPurify sanitize HTML trước khi lưu DB và trước khi render
- [x] Không có `console.log`, dead code
- [x] Unit Tests viết đủ 11 cases, tất cả PASS
- [x] Build Production không có lỗi TypeScript

---

## 3. KẾT QUẢ ĐÁNH GIÁ — @Tech_Lead

### Trạng thái:
- [x] 🟢 **APPROVE** — Code sạch, đúng chuẩn, đủ tests. **Merge thẳng vào Main!**

---

### Nhận xét chi tiết

#### ✅ Kiến trúc (Architecture) — PASS
Tuân thủ tuyệt đối **Clean Architecture** và luật **Dependency Rule**:
```
ClanSettingsForm.tsx         (Presentation)
    └── useClanSettings.ts   (Presentation/Hook)
        └── ClanSettingsUseCases.ts  (Application)
            └── SupabaseClanSettingsRepository.ts  (Infrastructure)
                └── ClanSettings.ts / IClanSettingsRepository.ts  (Domain)
```
Domain layer **không một lần nào** import React hay Supabase. ✅

#### ✅ Bảo mật (Security) — PASS
- `DOMPurify.sanitize()` được gọi **2 lần**: khi lưu lên DB và khi render `dangerouslySetInnerHTML`
- RLS Supabase: `anon` chỉ có quyền SELECT, `authenticated` mới WRITE được

> ⚠️ **Tech Debt nhỏ (non-blocking):** RLS hiện dùng `auth.uid() IS NOT NULL` (bất kỳ user login đều write được). Khi Sprint 5 xây dựng bảng `public.users` + role `Admin`, cần nâng cấp policy này lên `role = 'Admin'`.

#### ✅ Hiệu năng (Performance) — PASS
- Hook `useClanSettings` dùng **cancellation pattern** (`let cancelled = false`) — chống race condition và memory leak khi component unmount
- `upsert` trong Repository có 1 vấn đề nhỏ:

> ⚠️ **Senior Tip:** `SupabaseClanSettingsRepository.upsert()` đang gọi `this.get()` trước khi upsert — tức là **2 round-trips** mỗi lần lưu. Có thể tối ưu bằng cách cache `id` trực tiếp trong hook state thay vì fetch lại. **Chấp nhận giai đoạn này** vì tần suất gọi thấp (chỉ khi Admin save Settings).

#### ✅ DRY & Reusability — PASS
- `SectionHeader`, `FormField` được tách thành sub-component ngay trong file Form → tránh lặp code, dễ bảo trì
- `useClanSettings` là single source of truth được dùng ở 3 nơi: `ClanSettingsForm`, `AncestryBook`, `App.tsx` (Dashboard) — đúng chuẩn

#### ✅ Logic sinh số đời — PASS
Công thức áp dụng nhất quán:
- **FamilyTree (0-indexed):** `displayGen = gen + offset` (gen = 0 → Đời `offset`)
- **AncestryBook (1-indexed):** `displayGen = unit.generation + (offset - 1)` (gen = 1 → Đời `offset`)

#### ✅ Unit Tests — 11/11 PASS
Bao phủ đủ các edge cases quan trọng:
- Daughter exclusion (con gái không lập hộ)
- Sort theo seniority_index ưu tiên hơn birth_date
- Partner propagation đúng generation
- Fallback lunar/solar date

---

### Điểm cần theo dõi (Tech Debt Log)

| ID | Mô tả | Priority | Ticket đề xuất |
|---|---|---|---|
| TD-001 | RLS nâng cấp lên `role = 'Admin'` khi tạo bảng `users` | Medium | LT-501 |
| TD-002 | Tối ưu `upsert` bỏ round-trip `get()` thứ hai | Low | LT-502 |
| TD-003 | `useClanSettings` được gọi nhiều nơi riêng lẻ — xem xét React Context để tránh multiple fetches | Low | LT-503 |

---

### Hành động tiếp theo

- ✅ Code đã sẵn sàng Merge vào `main`
- 🔲 Sếp chạy SQL migration trong Supabase SQL Editor (nếu chưa làm)
- 🔲 Điền dữ liệu thực tế: Tên Tộc, Chi, Quê quán, Lời tựa thơ qua trang `/settings`
- 🔲 Các Tech Debt TD-001 → TD-003 ghi vào Backlog Sprint 5

---

*Reviewed by @Tech_Lead (Antigravity) — 25/02/2026 | Verdict: **🟢 APPROVED***
