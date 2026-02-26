# TECH LEAD SPEC — SPRINT 4: ClanSettings Feature

## 📋 Phạm vi & Đánh giá kỹ thuật

**Date:** 25/02/2026 | **Author:** @Tech_Lead (Antigravity)
**Sprint:** 04 | **Module:** Clan Settings + Tech Debt

---

## 1. ĐÁNH GIÁ PHẠM VI KỸ THUẬT

### 1.1 Tác động đến kiến trúc
Tính năng Clan Settings là một **Domain mới hoàn toàn** (`clan-settings`), không chạm vào domain `profiles` hiện tại. Tuân thủ đúng Clean Architecture.

```
src/
├── domain/
│   ├── profiles/          ← KHÔNG CHẠM
│   └── clan-settings/     ← [NEW] LT-401 + LT-402
├── application/
│   ├── profile-use-cases/ ← KHÔNG CHẠM
│   └── clan-settings-use-cases/ ← [NEW] LT-402
├── infrastructure/
│   ├── repository/
│   │   ├── SupabaseProfileRepository.ts  ← KHÔNG CHẠM
│   │   └── SupabaseClanSettingsRepository.ts ← [NEW] LT-402
├── presentation/
│   ├── components/
│   │   ├── AncestryBook.tsx   ← [MODIFY] LT-405 (đọc clan settings)
│   │   └── ClanSettings/      ← [NEW] LT-403 + LT-404
│   ├── hooks/
│   │   └── useClanSettings.ts ← [NEW] LT-402
│   └── pages/ (hoặc App.tsx)  ← [MODIFY] LT-403 (thêm route /settings)
└── shared/
    └── genealogy/
        └── GenealogyConfig.ts ← [MODIFY nhỏ] LT-405 (fallback values)
```

### 1.2 Database Impact
- **Bảng mới:** `clan_settings` — **1 row duy nhất** cho toàn project (thiết kế Singleton).
- **Supabase RLS:** Public READ (chuẩn bị cho Public View Sprint 5), Admin-only WRITE.

### 1.3 Dependencies mới
| Thư viện | Mục đích | Lệnh cài |
|---|---|---|
| `@tiptap/react` | Rich Text Editor cho lời tựa | `npm i @tiptap/react @tiptap/pm @tiptap/starter-kit` |
| `@tiptap/extension-text-align` | Hỗ trợ căn giữa thơ | `npm i @tiptap/extension-text-align` |
| `dompurify` + `@types/dompurify` | Sanitize HTML trước khi render | `npm i dompurify && npm i -D @types/dompurify` |

> ⚠️ **Tech Lead mandate:** Phải cài đủ 3 package trên **trước khi** bắt tay code LT-404.

---

## 2. DATABASE SCHEMA CHI TIẾT — Bảng `clan_settings`

```sql
-- LT-401: Tạo bảng clan_settings
-- File: supabase/migrations/20260226_create_clan_settings.sql

CREATE TABLE public.clan_settings (
    -- Primary key (singleton: chỉ có 1 row)
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Định danh dòng họ
    clan_name               TEXT NOT NULL DEFAULT 'Chưa cấu hình',
    branch_name             TEXT,           -- Phái (VD: Đệ Nhất Phái)
    sub_branch_name         TEXT,           -- Chi (VD: Đệ Tứ Chi)

    -- Quê quán gốc (đến cấp Làng/Xã)
    hometown_village        TEXT,           -- Làng / Thôn / Ấp
    hometown_commune        TEXT,           -- Xã / Phường / Thị trấn
    hometown_district       TEXT,           -- Huyện / Quận / Thị xã
    hometown_province       TEXT,           -- Tỉnh / Thành phố

    -- Thông tin cuốn phả
    book_title              TEXT,           -- VD: Đệ Tứ Chi Gia Phổ
    book_compiled_year      TEXT,           -- Năm lập phả (text để linh hoạt: "Năm Giáp Ngọ 1954")
    book_compiler_name      TEXT,           -- Người lập phả
    generation_display_offset INTEGER DEFAULT 1, -- Đời 1 trong sách = Đời mấy của Tộc

    -- Bài thơ thay lời tựa (HTML)
    preface_poem            TEXT,           -- HTML từ TipTap, đã sanitize

    -- Audit
    updated_at              TIMESTAMPTZ DEFAULT now(),
    updated_by              UUID REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE public.clan_settings ENABLE ROW LEVEL SECURITY;

-- Public READ (cho Public View tương lai)
CREATE POLICY "clan_settings_public_read"
ON public.clan_settings FOR SELECT TO anon, authenticated USING (true);

-- Admin-only WRITE
CREATE POLICY "clan_settings_admin_write"
ON public.clan_settings FOR ALL TO authenticated
USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'Admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role = 'Admin'));
```

---

## 3. DOMAIN MODEL — `ClanSettings.ts`

```typescript
// [NEW] src/domain/clan-settings/ClanSettings.ts
export interface ClanSettings {
    id: string;
    // Định danh dòng họ
    clan_name: string;
    branch_name?: string | null;
    sub_branch_name?: string | null;
    // Quê quán
    hometown_village?: string | null;
    hometown_commune?: string | null;
    hometown_district?: string | null;
    hometown_province?: string | null;
    // Thông tin cuốn phả
    book_title?: string | null;
    book_compiled_year?: string | null;
    book_compiler_name?: string | null;
    generation_display_offset?: number | null;
    // Lời tựa (HTML đã sanitize)
    preface_poem?: string | null;
    updated_at?: string;
}

export type UpdateClanSettingsDto = Partial<Omit<ClanSettings, 'id' | 'updated_at'>>;
```

---

## 4. BẢNG TASK CHI TIẾT CHO DEV

### ─── LT-401 | [DB] Tạo bảng clan_settings ─── 3 SP

| # | Bước | File | Chi tiết |
|---|---|---|---|
| 1 | Tạo thư mục migration | `supabase/migrations/` | Tạo thư mục nếu chưa có |
| 2 | Viết SQL migration | `supabase/migrations/20260226_create_clan_settings.sql` | Copy schema ở Mục 2 bên trên |
| 3 | Chạy SQL trên Supabase | Supabase SQL Editor | Paste và execute toàn bộ script |
| 4 | Verify | Supabase Dashboard → Table Editor | Kiểm tra bảng có đủ 13 cột |
| 5 | **Insert row mặc định** | Supabase SQL Editor | `INSERT INTO clan_settings (clan_name) VALUES ('Chưa cấu hình');` — Đảm bảo luôn có 1 row |

**AC:** ✅ Bảng tồn tại, RLS đúng, có 1 row mặc định.

---

### ─── LT-402 | [Backend] Domain + Use-Case + Repository ─── 5 SP

| # | Bước | File | Chi tiết |
|---|---|---|---|
| 1 | Tạo Domain model | `src/domain/clan-settings/ClanSettings.ts` | Copy interface ở Mục 3 |
| 2 | Tạo Repository interface | `src/domain/clan-settings/IClanSettingsRepository.ts` | `get(): Promise<ClanSettings \| null>`, `upsert(data): Promise<ClanSettings>` |
| 3 | Implement Repository | `src/infrastructure/repository/SupabaseClanSettingsRepository.ts` | Dùng `supabase.from('clan_settings').upsert(...)` |
| 4 | Tạo Use Cases | `src/application/clan-settings-use-cases/ClanSettingsUseCases.ts` | Export: `getClanSettings()`, `updateClanSettings(dto)` |
| 5 | Tạo Custom Hook | `src/presentation/hooks/useClanSettings.ts` | State: `{ settings, loading, error }`, actions: `updateSettings(dto)` |

**AC:** ✅ Gọi `getClanSettings()` trả về đúng object. `updateClanSettings()` lưu DB và trả về object mới.

---

### ─── LT-403 | [UI] Trang `/settings` ─── 5 SP

| # | Bước | File | Chi tiết |
|---|---|---|---|
| 1 | Tạo component form | `src/presentation/components/ClanSettings/ClanSettingsForm.tsx` | Form với các section rõ ràng: Định danh / Quê quán / Cuốn Phả / Lời tựa |
| 2 | Tạo page wrapper | `src/presentation/components/ClanSettings/ClanSettingsPage.tsx` | Wrap form + `useClanSettings` hook, handle loading/error |
| 3 | Thêm route | `src/presentation/App.tsx` (hoặc Router file) | `<Route path="/settings" element={<ClanSettingsPage />} />` |
| 4 | Thêm nav link | Component Nav/Sidebar hiện tại | Link "⚙️ Cài đặt" — **chỉ render nếu user là Admin** |
| 5 | Toast feedback | Dùng toast hiện có trong dự án | "Đã lưu cài đặt dòng họ thành công!" sau khi upsert thành công |

**Lưu ý UI:**
- Section "Quê quán": 4 input trong 1 grid (2 cột × 2 hàng)
- Field `generation_display_offset`: input type `number`, min=1, hint text: *"Đời 1 trong sách = Đời mấy tính từ Thủy Tổ của Tộc? Mặc định: 1"*
- Field `book_compiled_year`: input type `text` (không phải `date`) vì có thể nhập "Năm Giáp Ngọ 1954"

**AC:** ✅ Form lưu được, F5 dữ liệu vẫn ở đó. Link Settings ẩn với non-Admin.

---

### ─── LT-404 | [UI] Rich Text Editor lời tựa (TipTap) ─── 5 SP

| # | Bước | File | Chi tiết |
|---|---|---|---|
| 1 | Install packages | Terminal | `npm i @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-text-align dompurify && npm i -D @types/dompurify` |
| 2 | Tạo Editor component | `src/presentation/components/ClanSettings/PrefaceEditor.tsx` | TipTap Editor với extensions: `StarterKit`, `TextAlign.configure({ types: ['heading', 'paragraph'] })` |
| 3 | Toolbar tối giản | Trong `PrefaceEditor.tsx` | Nút: **B** (Bold) · *I* (Italic) · ≡ (Căn trái) · ≡ (Căn giữa) |
| 4 | Sanitize khi lưu | Trong `ClanSettingsForm.tsx` — trước khi gọi `updateSettings` | `import DOMPurify from 'dompurify'` → `const clean = DOMPurify.sanitize(editor.getHTML())` |
| 5 | Hiển thị preview | Trong form | `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings.preface_poem) }} className="font-serif italic text-center ..." />` |

**AC:** ✅ Editor hoạt động. Thử nhập `<script>alert('xss')</script>` → bị strip hoàn toàn. Hiển thị đúng formatting.

---

### ─── LT-405 | [UI] Hiển thị trong Sách Gia Phả ─── 5 SP

| # | Bước | File | Chi tiết |
|---|---|---|---|
| 1 | Thêm hook | `src/presentation/components/AncestryBook.tsx` | Gọi `useClanSettings()` ở đầu component |
| 2 | Hiển thị header bìa sách | `AncestryBook.tsx` — trước render danh sách units | Block: Tên tộc lớn (font-serif, uppercase, tracking-wider) · Chi/Phái nhỏ hơn · Quê quán · Năm lập phả |
| 3 | Render bài thơ lời tựa | Sau header, trước danh sách hộ | `<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings?.preface_poem \|\| '') }} />` — chỉ render nếu `preface_poem` không rỗng |
| 4 | Cập nhật `GenealogyConfig.ts` | `src/shared/genealogy/GenealogyConfig.ts` | Thêm fallback: `export const DEFAULT_CLAN_NAME = 'Gia Phả Dòng Họ'` — dùng khi settings chưa có |
| 5 | Helper format quê quán | `GenealogyConfig.ts` hoặc inline | `formatHometown(settings)` → `"Làng X, Xã Y, Huyện Z, Tỉnh T"` (bỏ qua phần null) |

**AC:** ✅ Sách Gia Phả hiển thị đúng tên tộc/chi + quê quán + thơ tựa. Nếu chưa cấu hình Settings → hiện fallback "Gia Phả Dòng Họ" không bị crash.

---

### ─── LT-407 | [Test] Unit Tests ─── 5 SP

| # | Function cần test | Test cases bắt buộc |
|---|---|---|
| 1 | `processAncestryBook()` | (a) Con gái có father_id → không tạo Hộ · (b) Sort đúng thứ bậc Lang · (c) Root detection · (d) Nhiều đời nested · (e) Profile đơn độc không bị drop |
| 2 | `sortProfilesByTraditionalSeniority()` | (a) Nam trước Nữ · (b) Seniority Index ưu tiên hơn ngày sinh · (c) Fallback ngày sinh khi không có index |
| 3 | `getDisplayBirthDate()` | (a) Ưu tiên lunar khi có · (b) Fallback solar · (c) Null khi cả hai đều null |
| 4 | `getYearFromDate()` | (a) Parse đúng ISO string · (b) Invalid string → FALLBACK_YEAR |

**Framework test:** Dùng `vitest` (đã có sẵn trong Vite ecosystem), file đặt tại `src/__tests__/`.

**AC:** ✅ `npm test` → Tất cả test PASS. Ít nhất 13 test cases tổng.

---

### ─── LT-408 | [Docs] JSDoc FamilyTree ─── 2 SP

| # | Hàm | Nội dung JSDoc |
|---|---|---|
| 1 | `buildGenMap()` | Giải thích recursive calcGen + spouse propagation |
| 2 | `layoutNode()` | Giải thích subtreeWidth, coupleWidth, childrenTotalWidth |
| 3 | `processAncestryBook()` | Giải thích candidate filter, familyKey dedup, getPriority scoring |

---

### ─── LT-409 | [Process] Cập nhật Sprint Planning Template ─── 1 SP

Thêm Section **"Acceptance Criteria"** vào `02_sprint_planning_meeting.md`:
```markdown
### Acceptance Criteria (phải điền trước khi Dev bắt đầu code)
- [ ] AC1: ...
- [ ] AC2: ...
```

---

### ─── LT-410 | [FamilyTree] Stress-test layout ─── 3 SP

| Kịch bản test | Cách test |
|---|---|
| 5+ thế hệ liên tiếp | Nhập data đủ 5 đời → Verify Đời 1 ở trên, Đời 5 ở dưới |
| Nhiều nhánh song song | 1 cha có 4 con, mỗi con có 3 cháu → Verify không overlap nodes |
| Profile không có cha | Root node mồ côi → Verify vẫn render, không crash |
| Vợ/Chồng ngoại tộc (không có father_id) | Verify genMap propagation đúng đời |

---

## 5. THỨ TỰ THỰC HIỆN KHUYẾN NGHỊ

```
Tuần 1:
  Ngày 1: LT-401 (DB) → LT-407 (Tests — có thể làm song song sau khi setup)
  Ngày 2: LT-402 (Backend Domain + Repo + UseCase)
  Ngày 3: LT-403 (Settings Page UI)
  Ngày 4: LT-404 (TipTap Rich Text Editor)
  Ngày 5: LT-405 (AncestryBook update) + LT-409 (Template)

Tuần 2:
  Ngày 1-2: LT-408 (JSDoc) + LT-410 (Stress test layout)
  Ngày 3: Buffer / Fix bugs phát sinh
  Ngày 4-5: Sprint Review + Retrospective
```

---

## 6. VÙNG BẤT KHẢ XÂM PHẠM

> **Tech Lead quy định:** Các file sau tuyệt đối KHÔNG sửa trong Sprint 4 (trừ khi có bug critical):
> - `src/application/genealogy-use-cases/ProcessAncestryBook.ts` — core logic ổn định
> - `src/infrastructure/repository/SupabaseProfileRepository.ts` — không liên quan
> - `src/domain/profiles/Profile.ts` — domain profiles đã frozen Sprint 3

---

*Được lập bởi @Tech_Lead (Antigravity) — 25/02/2026*
