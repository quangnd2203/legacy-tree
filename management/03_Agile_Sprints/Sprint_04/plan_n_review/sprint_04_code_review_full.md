# BIÊN BẢN CODE REVIEW: TOÀN BỘ CODEBASE (Sprint 1–4)

**Người duyệt (Reviewer):** @Tech_Lead (Antigravity)
**Phạm vi:** Toàn bộ `src/` — Domain, Application, Infrastructure, Presentation, Shared
**Ngày review:** 25/02/2026

---

## CHECKLIST QUÉT TOÀN CODEBASE

| Hạng mục | Kết quả |
|---|---|
| `console.log / console.error` còn sót | ✅ **0 tìm thấy** — Sạch hoàn toàn |
| TypeScript `any` không cần thiết | ✅ Đã fix `icon: any` → `LucideIcon` trong `SectionHeader` |
| Hardcode business data trong code | ✅ Đã mark `@deprecated` trên CLAN_NAME, BOOK_TITLE trong `GenealogyConfig.ts` |
| Dead Code / Unused Imports | ✅ Không phát hiện |
| Vite Production Build lỗi | ✅ `built in 2.19s` — 0 errors |
| Unit Tests Pass | ✅ 11/11 PASS |

---

## KẾT QUẢ ĐÁNH GIÁ THEO TỪNG LỚP

### ✅ Domain Layer — CLEAN

```
src/domain/
├── profiles/Profile.ts          ← Đúng chuẩn, type ProfileStatus/Gender đã export
├── clan-settings/ClanSettings.ts ← Domain mới Sprint 4, interface sạch
│   └── IClanSettingsRepository.ts ← Interface đúng Dependency Inversion
└── core/EventDispatcher.ts       ← Domain Events có sẵn, dùng cho audit trail
```

**Nhận xét:** Domain layer tuyệt đối không import React/Supabase. ✅

---

### ✅ Application Layer — CLEAN

```
src/application/
├── profile-use-cases/ProfileUseCases.ts
│   └── ✅ Domain Events được dispatch đúng sau mỗi mutation (CREATED/UPDATED/DELETED)
└── clan-settings-use-cases/ClanSettingsUseCases.ts
    └── ✅ Facade mỏng, đúng vai trò Use Case
```

---

### ✅ Infrastructure Layer — CLEAN (sau fix TD-002)

```
src/infrastructure/repository/
├── SupabaseProfileRepository.ts  ← Sạch, CRUD đầy đủ, không N+1
└── SupabaseClanSettingsRepository.ts ← Đã fix: upsert 1 round-trip (TD-002 ✅)
```

> ⚠️ **Nhỏ còn lại (non-blocking):** `SupabaseProfileRepository.getAll()` dùng `.order('full_name')` nhưng việc sắp xếp thực tế cho Phả ký gia phả được xử lý lại ở Use Case layer. Không phải bug nhưng gọi là "defensive sort" — có thể bỏ order ở DB để thống nhất logic tại một chỗ duy nhất (ProcessAncestryBook). **Ghi vào Sprint 5 backlog.**

---

### ✅ Shared Layer — SẠCH (sau refactor)

```
src/shared/genealogy/GenealogyConfig.ts
```

- Hàm `getDisplayBirthDate()` thuần túy, có test bao phủ ✅
- Hằng `CLAN_NAME`, `BOOK_TITLE` đã được mark `@deprecated` → IDE sẽ gạch dưới cảnh báo cho Dev ✅
- `FALLBACK_YEAR = 9999` — Hơi "magic number" nhưng đã comment rõ ràng ✅

---

### 🟡 Presentation Layer — APPROVE (có 2 ghi chú nhỏ)

#### ClanSettingsForm.tsx (29KB total)

> **Ghi chú 1 — File Form lớn nhất:** `ProfileForm.tsx` đang có **499 dòng (29KB)**. Đây là ngưỡng cần theo dõi. Chưa vượt giới hạn (thường là 500 dòng), nhưng nên **không thêm bất kỳ logic nào mới** vào đây nữa. Sprint 5 nên tách phần Upload Image thành `ProfileImageUpload.tsx` riêng.

> **Ghi chú 2 — State quản lý `prefaceHtml` đôi:**
> Trong `ClanSettingsForm.tsx`, `prefaceHtml` là state riêng song song với `form`. Đây là design hợp lý vì TipTap editor cần quản lý HTML riêng, nhưng cần chú ý `useEffect` sync từ `settings` chỉ chạy một lần khi `settings` load — nếu user mở form mà settings load chậm hơn, sẽ thấy editor trống rồi có nội dung sau. Chấp nhận được ở giai đoạn này.

#### Context Pattern (TD-003 ✅)

```
ClanSettingsProvider (App.tsx)
  └── Dashboard
        ├── App (sidebar, header)    → useClanSettingsContext()
        ├── AncestryBook.tsx         → useClanSettingsContext()
        └── FamilyTree.tsx           → useClanSettingsContext()
```

**1 fetch duy nhất khi load — đúng pattern.** ✅

---

## TECH DEBT LOG CẬP NHẬT

| ID | Mô tả | Sprint | Priority |
|---|---|---|---|
| TD-001 | RLS nâng cấp `role = Admin` | Sprint 5 | Medium |
| TD-002 | ✅ **DONE** — upsert 1 round-trip | Sprint 4 | - |
| TD-003 | ✅ **DONE** — React Context cho ClanSettings | Sprint 4 | - |
| TD-004 | Tách `ProfileImageUpload.tsx` khỏi `ProfileForm.tsx` (499 dòng) | Sprint 5 | Low |
| TD-005 | Bỏ `.order('full_name')` ở `SupabaseProfileRepository.getAll()` — sort logic nên tập trung tại UseCase | Sprint 5 | Low |

---

## KẾT LUẬN

- [x] 🟢 **APPROVE — Merge vào Main**

Codebase sạch, đúng kiến trúc, không có lỗ hổng nghiêm trọng. Tất cả tech debt được ghi nhận rõ ràng và có kế hoạch xử lý.

---

*Reviewed by @Tech_Lead (Antigravity) — 25/02/2026*
