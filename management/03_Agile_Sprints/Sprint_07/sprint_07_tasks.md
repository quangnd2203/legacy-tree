# 📝 SPRINT 7 — TASK BOARD & TECH SPEC

**Sprint:** 07 | **26/02 – 12/03/2026**
**Sprint Goal:** Dự án an toàn để chia sẻ — Bảo mật route + database, giao diện mobile, dọn nav.

---

## 📊 TIẾN ĐỘ TỔNG QUAN

| Nhóm | Tickets | SP | Status |
|---|---|---|---|
| 🔒 Bảo mật | ~~LT-601~~, ~~LT-506~~ | 8 | ✅ All Approved |
| 📱 Mobile | ~~LT-602~~ | 8 | ✅ Approved |
| 🛠️ Tech Debt | ~~LT-901~~, ~~LT-1002~~ | 7 | ✅ All Approved |
| 🐛 Bug Fix | ~~LT-1003~~, ~~LT-1004~~ | 5 | ✅ All Approved |
| **TỔNG** | **7 tickets** | **28 SP** | |

---

## 🧹 LT-1002: Dọn Nav Theo Discovery (2 SP)

> **Mục tiêu:** Xoá các route/nav đã bị descoped (Sự kiện, Tạo viên, Danh bạ) khỏi sidebar.

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| 1.1 | Xoá `DIRECTORY`, `EVENTS`, `NETWORK` khỏi `ROUTES` object | `routes/routeConfig.ts` | ✅ Approved |
| 1.2 | Xoá 3 nav items tương ứng khỏi `NAV_ITEMS[]` | `routes/routeConfig.ts` | ✅ Approved |
| 1.3 | Xoá `Home` khỏi `NAV_ITEMS` (hiện chỉ redirect → `/tree`) | `routes/routeConfig.ts` | ✅ Approved |
| 1.4 | Xoá icon imports không dùng: `Home`, `PhoneCall`, `Bell`, `TreePine` | `routes/routeConfig.ts` | ✅ Approved |
| 1.5 | Cập nhật `AppRoutes.tsx`: xoá import `TreePine`, dùng `GitBranch` cho NotFoundPage | `routes/AppRoutes.tsx` | ✅ Approved |
| 1.6 | Build verify: `npx vite build` → 0 errors (2.22s) | Terminal | ✅ Approved |

### Hướng dẫn kỹ thuật

```
File: src/presentation/routes/routeConfig.ts

TRƯỚC: ROUTES có 10 entries, NAV_ITEMS có 8 items
SAU:   ROUTES có 6 entries (HOME, TREE, ANCESTRY, MEMBERS, SETTINGS, LOGIN, NEWS)
       NAV_ITEMS có 4 items (Bản tin, Cây gia phả, Phả ký phả chí, Thành viên)
       HOME vẫn giữ trong ROUTES (để redirect) nhưng KHÔNG có trong NAV_ITEMS

Import TRƯỚC: Home, Users, GitBranch, BookOpen, PhoneCall, Bell, TreePine, Newspaper
Import SAU:   Users, GitBranch, BookOpen, Newspaper
```

---

## 🔒 LT-601: Protected Routes (3 SP)

> **Mục tiêu:** Chặn user chưa đăng nhập truy cập trực tiếp vào `/settings` và `/members`. Redirect về `/login`.

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| 2.1 | Tạo component `PrivateRoute` wrapper | `routes/PrivateRoute.tsx` *(MỚI)* | ✅ Approved |
| 2.2 | Bọc `<SettingsPage>` route bằng `PrivateRoute` | `routes/AppRoutes.tsx` | ✅ Approved |
| 2.3 | Bọc `<MembersPageWrapper>` route bằng `PrivateRoute` (phần Edit — hiện tại ai cũng xem được list, nhưng edit thì cần login) | `routes/AppRoutes.tsx` | ✅ Approved (edit buttons đã check `user &&`) |
| 2.4 | Ẩn nút "Thêm thành viên" + "Cài đặt" trong header khi chưa login (đã có `user &&` check — xác nhận lại) | `App.tsx` | ✅ Approved |
| 2.5 | Test: mở `/settings` khi chưa login → phải redirect về `/login` | Manual test | ✅ Approved |

### Hướng dẫn kỹ thuật

**Pattern: Route Guard Component**

```typescript
// src/presentation/routes/PrivateRoute.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './routeConfig';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { user, loading } = useAuth();

    // Quan trọng: chờ session resolve trước — tránh flash redirect
    if (loading) return <PageLoader />;

    if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

    return <>{children}</>;
}
```

**Cách dùng trong AppRoutes.tsx:**
```tsx
<Route path={ROUTES.SETTINGS} element={
    <PrivateRoute>
        <SettingsPage />
    </PrivateRoute>
} />
```

**Lưu ý:**
- `AuthContext` đã expose `loading` state — dùng nó để tránh flash redirect khi page load lần đầu.
- KHÔNG protect `/tree`, `/ancestry`, `/members` (xem list) — theo Req: Public Viewer xem được gia phả.
- CHỈ protect `/settings` (admin only) + các action CRUD (nút Edit/Delete/Add đã check `user &&` trong App.tsx).

---

## 🔒 LT-506: RLS Admin Supabase (5 SP)

> **Mục tiêu:** Đảm bảo tầng Database chỉ cho phép đúng role thao tác đúng quyền. Đây là bảo mật thực sự — PrivateRoute chỉ chặn UI.

### Các sub-tasks

| # | Task | Nơi thực hiện | Status |
|---|---|---|---|
| 3.1 | Kiểm tra RLS hiện tại trên bảng `profiles` | Supabase Dashboard → Auth → Policies | ✅ Approved |
| 3.2 | Tạo policy `profiles` — **SELECT**: cho tất cả (Public) | Supabase SQL Editor | ✅ Approved |
| 3.3 | Tạo policy `profiles` — **INSERT/UPDATE/DELETE**: chỉ `auth.uid()` đã login | Supabase SQL Editor | ✅ Approved |
| 3.4 | Kiểm tra RLS trên bảng `clan_settings` | Supabase Dashboard | ✅ Approved |
| 3.5 | Tạo policy `clan_settings` — **SELECT**: cho tất cả | Supabase SQL Editor | ✅ Approved |
| 3.6 | Tạo policy `clan_settings` — **UPDATE**: chỉ Admin (auth.uid() matched) | Supabase SQL Editor | ✅ Approved |
| 3.7 | Enable RLS trên cả 2 bảng nếu chưa enable | Supabase SQL Editor | ✅ Approved |
| 3.8 | Test: mở app khi KHÔNG login → vẫn xem được cây + phả ký | Manual test | 🔲 |
| 3.9 | Test: thử INSERT/UPDATE profile khi KHÔNG login → phải bị reject | Supabase SQL Editor hoặc Postman | 🔲 |
| 3.10 | Lưu migration SQL vào `supabase/migrations/` | File `.sql` | ✅ Approved |

### Hướng dẫn kỹ thuật

**SQL Template cho RLS:**

```sql
-- ═══ BẢNG profiles ═══

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public: ai cũng đọc được
CREATE POLICY "profiles_select_public"
ON profiles FOR SELECT
USING (true);

-- Chỉ user đã login mới được thêm/sửa/xoá
CREATE POLICY "profiles_insert_authenticated"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "profiles_update_authenticated"
ON profiles FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "profiles_delete_authenticated"
ON profiles FOR DELETE
TO authenticated
USING (true);

-- ═══ BẢNG clan_settings ═══

ALTER TABLE clan_settings ENABLE ROW LEVEL SECURITY;

-- Public: ai cũng đọc cài đặt
CREATE POLICY "clan_settings_select_public"
ON clan_settings FOR SELECT
USING (true);

-- Chỉ user đã login mới được update
CREATE POLICY "clan_settings_update_authenticated"
ON clan_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Chỉ user đã login mới được insert (lần đầu setup)
CREATE POLICY "clan_settings_insert_authenticated"
ON clan_settings FOR INSERT
TO authenticated
WITH CHECK (true);
```

**Con đường Supabase Auth:**
- `supabase-js` gửi `Authorization: Bearer <jwt>` tự động.
- Supabase RLS dùng `auth.uid()` từ JWT.
- `TO authenticated` = chỉ request có JWT hợp lệ.
- Anon key (public) → `anon` role → chỉ pass policy `USING (true)` cho SELECT.

**Lưu ý quan trọng:**
- Supabase client hiện tại dùng `anon key` → khi chưa login, request đi bằng `anon` role.
- Khi đã login, Supabase client tự đính JWT → request đi bằng `authenticated` role.
- **KHÔNG CẦN thay đổi code frontend** — RLS hoạt động ở tầng server.
- Nếu cần Admin-only strict hơn (vd: chỉ 1 user cụ thể), dùng: `USING (auth.uid() = '<admin-user-id>')`.

---

## 🛠️ LT-901: Refactor ProfileForm (5 SP)

> **Mục tiêu:** Tách `ProfileForm.tsx` (469 dòng) thành các Fieldset components theo nhóm dữ liệu.

### Phân tích cấu trúc hiện tại

```
ProfileForm.tsx (469 dòng):
├── Lines 1-11:    Imports + Props interface
├── Lines 14-142:  State, hooks, handlers (handleSubmit, handleDateChange, handleFatherChange)
├── Lines 144-165: Header + Error block
├── Lines 167-251: ── FIELDSET 1: Visual Identity (Ảnh + Tên + Ngày sinh + Âm lịch)
├── Lines 253-301: ── FIELDSET 2: Status & Contact (Trạng thái + SĐT + Giới tính)
├── Lines 304-377: ── FIELDSET 3: Lineage & Relationship (Cha + Vai vế + Phối ngẫu)
├── Lines 379-439: ── FIELDSET 4: Deceased Info (Ngày giỗ + Mộ phần) — conditional
├── Lines 441-465: Submit + Cancel buttons
```

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| 4.1 | Tạo thư mục `components/profile-form/` + shared types | Filesystem | ✅ Approved |
| 4.2 | Tách `PersonalInfoFieldset.tsx` (Lines 167-251): Ảnh chân dung, Họ tên, Ngày sinh, Âm lịch | `components/profile-form/PersonalInfoFieldset.tsx` | ✅ Approved |
| 4.3 | Tách `StatusContactFieldset.tsx` (Lines 253-301): Trạng thái, SĐT, Giới tính | `components/profile-form/StatusContactFieldset.tsx` | ✅ Approved |
| 4.4 | Tách `LineageFieldset.tsx` (Lines 304-377): Cha, Vai vế, Phối ngẫu | `components/profile-form/LineageFieldset.tsx` | ✅ Approved |
| 4.5 | Tách `DeceasedInfoFieldset.tsx` (Lines 379-439): Ngày giỗ, Mộ phần | `components/profile-form/DeceasedInfoFieldset.tsx` | ✅ Approved |
| 4.6 | Cập nhật `ProfileForm.tsx` — import và compose 4 Fieldsets | `components/ProfileForm.tsx` | ✅ Approved |
| 4.7 | Build verify → 0 errors | Terminal | ✅ Approved |
| 4.8 | Manual test: tạo profile mới + edit profile cũ → xác nhận không lỗi | Browser | ✅ Approved |

### Hướng dẫn kỹ thuật

**Pattern: Controlled Fieldset với props drilling**

```typescript
// Kiểu dữ liệu dùng chung
export interface ProfileFormData {
    full_name: string;
    birth_date: string | null;
    birth_time: string | null;
    birth_date_lunar: string | null;
    status: ProfileStatus;
    phone_number: string;
    gender: ProfileGender;
    // ... tất cả fields
}

export interface FieldsetProps {
    formData: ProfileFormData;
    onChange: (updates: Partial<ProfileFormData>) => void;
}
```

```typescript
// Ví dụ: PersonalInfoFieldset.tsx
export function PersonalInfoFieldset({ formData, onChange, ...imageProps }: PersonalInfoFieldsetProps) {
    return (
        <div className="flex flex-col md:flex-row gap-10 items-start pb-10 border-b border-slate-50">
            {/* Ảnh chân dung */}
            {/* Họ tên input */}
            {/* Ngày sinh dương/âm */}
            {/* birthTime */}
        </div>
    );
}
```

```typescript
// ProfileForm.tsx sau refactor — ~100 dòng thay vì 469
export function ProfileForm({ initialData, onSuccess, onCancel }: ProfileFormProps) {
    const [formData, setFormData] = useState(/* ... */);

    const handleChange = (updates: Partial<ProfileFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <PersonalInfoFieldset formData={formData} onChange={handleChange} {...imageProps} />
            <StatusContactFieldset formData={formData} onChange={handleChange} />
            <LineageFieldset formData={formData} onChange={handleChange} profiles={allProfiles} />
            {formData.status === 'Deceased' && (
                <DeceasedInfoFieldset formData={formData} onChange={handleChange} {...graveImageProps} />
            )}
            {/* Submit buttons */}
        </form>
    );
}
```

**Quyết định thiết kế quan trọng:**
- **KHÔNG dùng Context/Store** cho form state — quá nặng cho 1 form, props drilling đủ.
- **`handleFatherChange`** (Lines 125-142) giữ nguyên ở `ProfileForm.tsx` cha — vì nó thay đổi 2 fields (`father_id` + `seniority_index`), cần logic xuyên suốt.
- **`handleSubmit`** giữ ở cha — không nên delegate xuống Fieldset.
- **Image upload hooks** (`useProfileImageUpload`) giữ ở cha, truyền refs + preview xuống Fieldsets.

---

---

## 🐛 LT-1004: Cột "Đời" trong Members không theo Config (2 SP)

> **Mục tiêu:** Hiển thị số đời trong danh sách thành viên khớp với cấu hình `generation_display_offset` trong Clan Settings.

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| 7.1 | Import `useClanSettingsContext` vào MembersPage | `pages/members/MembersPage.tsx` | ✅ Approved |
| 7.2 | Cập nhật logic hiển thị số đời: cộng thêm offset từ config | `pages/members/MembersPage.tsx` | ✅ Approved |
| 7.3 | Build verify → 0 errors | Terminal | ✅ Approved |
| 7.4 | Manual test: đổi offset trong Settings → cột Đời trong Members phải nhảy theo | Browser | ✅ Approved |

> **[REJECTED by @Tech_Lead — 25/02/2026]** → **FIXED by @Senior_Dev**
> Task 7.1: ✅ Đã đổi import thành `@presentation/context/ClanSettingsContext`.
> Task 7.2: ✅ Đã đổi `catch (err: any)` thành `catch (err: unknown)` + `instanceof Error`.

### Hướng dẫn kỹ thuật

**Logic cần sửa:**
Trong `MembersPage.tsx`, tìm đoạn render cột Đời:
```typescript
// Hiện tại
<td className="p-3 text-center">
    <span>{genMap[profile.id] || '?'}</span>
</td>

// Sửa thành
const { settings } = useClanSettingsContext();
const genOffset = (settings?.generation_display_offset ?? 1) - 1;

// Khi render
<td className="p-3 text-center">
    <span>{(genMap[profile.id] || 0) + genOffset || '?'}</span>
</td>
```

**Lưu ý:** Đảm bảo case `genMap[profile.id]` không tồn tại (fallback là 0 hoặc '?') để không bị hiển thị sai.

---

## 📱 LT-602: Mobile Responsive (8 SP)

---

## 🐛 LT-1003: Phối ngẫu bị rớt xuống cuối danh sách (3 SP)

> **Bug phát hiện:** 25/02/2026 — Trong MembersPage, những người là phối ngẫu (vợ/chồng từ dòng họ khác) bị đẩy xuống cuối danh sách.
>
> **Kỳ vọng:** Phối ngẫu phải đứng **cạnh** vợ/chồng của mình trong danh sách.

### Phân tích Root Cause (Đã scan code)

**File ảnh hưởng chính:** `src/presentation/pages/members/hooks/useMembersPage.ts` (71 dòng)

**Logic hiện tại (line 36-67):**
```
1. processAncestryBook(profiles) → trả về FamilyUnit[] (head + partners + children)
2. addProfileWithFamily(p):
   - Push head vào orderedProfiles ✅
   - Tìm unit = unitsByHeadId.get(p.id)  ← CHỈ tìm khi p LÀ HEAD
   - Nếu tìm được → push partners cạnh head ✅
3. Fallback (line 62-67): profiles vẫn chưa seen → push cuối ❌
```

**Root cause:**
- `processAncestryBook` tạo FamilyUnit đúng (head + partners).
- `addProfileWithFamily` tìm partner đúng **NẾU** head được duyệt.
- NHƯNG: Nếu head là con gái (Female + father_id) → bị filter khỏi candidates (ProcessAncestryBook line 214: `if (p.gender === 'Female' && p.father_id) return false`)
- → Con gái KHÔNG tạo FamilyUnit → chồng con gái KHÔNG nằm trong bất kỳ unit.partners nào
- → Chồng con gái rơi vào fallback (line 62-67) → bị đẩy xuống cuối.

**Kết luận:** Bug nằm ở `useMembersPage.ts`, KHÔNG phải ở `processAncestryBook.ts` (use case này đúng cho Phả ký). MembersPage cần logic sorting riêng, khác với AncestryPage.

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| 6.1 | Sửa `useMembersPage.ts`: thêm **reverse partner lookup** — khi push profile `p`, tìm partner CŨNG bằng cách scan `allProfiles` (không chỉ dựa vào `unitsByHeadId`) | `pages/members/hooks/useMembersPage.ts` | ✅ Approved |
| 6.2 | Fix `any` type ở line 24 (`catch (err: any)`) → đổi thành `unknown` + `instanceof Error` | `pages/members/hooks/useMembersPage.ts` | ✅ Approved |
| 6.3 | Xác nhận AncestryPage **KHÔNG bị bug này** — vì AncestryPage render theo FamilyUnit (head + partners card), không render flat list | Verify `pages/ancestry/AncestryPage.tsx` | ✅ Approved |
| 6.4 | Build verify → 0 errors | Terminal | ✅ Approved |
| 6.5 | Manual test: mở Members → Lê Văn Tuyến, Võ Văn Phò, Hoà Sum, Nguyễn Văn Điệt, Lý Văn Thuận phải đứng cạnh vợ/chồng | Browser | ✅ Approved |

### Hướng dẫn kỹ thuật

**Approach: Sửa `addProfileWithFamily` trong `useMembersPage.ts`**

```typescript
// useMembersPage.ts — FIX
// Thay logic hiện tại (line 41-55):

const addProfileWithFamily = (p: Profile) => {
    if (seenIds.has(p.id)) return;
    orderedProfiles.push(p);
    seenIds.add(p.id);

    // 1. Tìm partner qua unitsByHeadId (logic hiện tại — giữ nguyên)
    const unit = unitsByHeadId.get(p.id) as FamilyUnit | undefined;
    if (unit) {
        unit.partners.forEach((partner: Profile) => {
            if (!seenIds.has(partner.id)) {
                orderedProfiles.push(partner);
                seenIds.add(partner.id);
            }
        });
    }

    // 2. ← THÊM: Reverse partner lookup
    //    Nếu p không phải head (vd: con gái), tìm partner bằng cách scan profiles
    //    Case 1: p.partner_id → tìm partner có id = p.partner_id
    //    Case 2: ai đó có partner_id = p.id (bidirectional)
    if (p.partner_id && !seenIds.has(p.partner_id)) {
        const partner = profiles.find(x => x.id === p.partner_id);
        if (partner) {
            orderedProfiles.push(partner);
            seenIds.add(partner.id);
        }
    }
    const reversePartner = profiles.find(
        x => x.partner_id === p.id && !seenIds.has(x.id)
    );
    if (reversePartner) {
        orderedProfiles.push(reversePartner);
        seenIds.add(reversePartner.id);
    }
};
```

**Tại sao KHÔNG sửa `processAncestryBook.ts`:**
- `processAncestryBook` là use case cho **Phả ký** (Ancestry Book) — quy tắc "con gái không tạo hộ gia đình" là đúng theo truyền thống (line 214).
- AncestryPage render theo FamilyUnit → partner hiển thị đúng cạnh head trong card.
- MembersPage render flat list → cần logic riêng để nhóm partner. Fix đặt trong hook, KHÔNG sửa use case.

**Edge cases cần test:**
- Chồng con gái (B không có father_id, A là Female + father_id, A.partner_id = B)
- Vợ con trai đã chết (A.status = 'Deceased', B.status = 'Alive', A.partner_id = B)
- Cặp đôi cùng có partner_id trỏ lẫn nhau (A.partner_id = B AND B.partner_id = A)

---

> **Mục tiêu:** TreePage, AncestryPage, MembersPage, Sidebar hiển thị đúng trên viewport 375px và 412px.

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| 5.1 | **Sidebar auto-collapse** trên mobile (< 1024px) | `App.tsx` | ✅ Approved |
| 5.2 | **Sidebar mobile overlay** — trên mobile, sidebar mở ra dạng overlay + backdrop, không đẩy content | `App.tsx` + CSS | ✅ Approved |
| 5.3 | **Hamburger menu button** hiển thị trên mobile header | `App.tsx` | ✅ Approved |
| 5.4 | **TreePage mobile** — ensure pinch-zoom + scroll hoạt động, node không bị cắt | `pages/tree/TreePage.tsx` + CSS | ✅ Approved |
| 5.5 | **AncestryPage mobile** — text, headings, FamilyUnit cards fit trên 375px, font nhỏ hơn | `pages/ancestry/AncestryPage.tsx` + CSS | ✅ Approved |
| 5.6 | **MembersPage mobile** — bảng danh sách responsive (stack columns hoặc card layout) | `pages/members/MembersPage.tsx` + CSS | ✅ Approved |
| 5.7 | **ProfileForm modal mobile** — modal full-screen trên mobile, scroll mượt | `components/Modal.tsx` + CSS | ✅ Approved |
| 5.8 | **Header responsive** — thu gọn text, tuỳ chỉnh spacing | `App.tsx` + CSS | ✅ Approved |
| 5.9 | Test trên viewport 375px (iPhone SE) | DevTools | ✅ Approved |
| 5.10 | Test trên viewport 412px (Android) | DevTools | ✅ Approved |
| 5.11 | **Fix Left Gap** — Loại bỏ khoảng hở bên trái do Layout/Sidebar ghost width trên mobile | `App.tsx` | ✅ Approved |
| 5.12 | **Responsive AppBar** — Tối ưu khoảng cách và kích thước title/buttons trên mobile | `App.tsx` | ✅ Approved |
| 5.13 | **Responsive BottomBar** — Chuyển footer sang dạng stack/center trên màn hình nhỏ | `App.tsx` | ✅ Approved |
| 5.14 | **Bug: Sidebar không mở lại khi resize về desktop** — Khi kéo từ mobile → desktop, `sidebarCollapsed` vẫn `true` → Sidebar chỉ hiện 64px. Cần auto-expand khi quay về desktop. | `App.tsx` | ✅ Approved |

### Hướng dẫn kỹ thuật

**Tech stack hiện tại: TailwindCSS v4** → dùng responsive prefixes.

**Sidebar Pattern:**
```tsx
// App.tsx — detect mobile
const isMobile = window.innerWidth < 768; // hoặc dùng useMediaQuery hook

// Sidebar trên mobile: position fixed + overlay
<aside className={`
    ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
    ${sidebarCollapsed ? (isMobile ? '-translate-x-full' : 'w-[64px]') : 'w-[220px]'}
    transition-all duration-300
`}>
```

**xyflow (TreePage) trên mobile:**
- `@xyflow/react` hỗ trợ touch events (pinch zoom, pan) built-in.
- Cần thêm: `fitView` on load, `minZoom={0.3}` cho mobile.
- Kiểm tra: node text có đọc được ở mức zoom nhỏ không → có thể cần cỡ chữ lớn hơn khi `isMobile`.

**AncestryPage trên mobile:**
- Breakpoint `md:` (768px) đã có sẵn cho grid columns.
- Cần kiểm tra: `text-2xl` heading + `text-sm` body có fit trên 375px không.
- Nút "In Phả Ký" nên stack xuống dòng trên mobile.

**MembersPage trên mobile:**
- Bảng HTML → chuyển sang card layout trên mobile.
- Pattern: `hidden md:table-cell` cho columns phụ, chỉ giữ Tên + Sinh + Actions trên mobile.

---

## 📋 BẢNG THEO DÕI TỔNG HỢP

| # | Task ID | Mô tả ngắn | SP | Dep | Status |
|---|---|---|---|---|---|
| 1 | LT-1002.1 | Xoá routes descoped | — | — | ✅ Approved |
| 2 | LT-1002.2 | Xoá nav items | — | — | ✅ Approved |
| 3 | LT-1002.3 | Xoá Home nav | — | — | ✅ Approved |
| 4 | LT-1002.4 | Xoá unused icon imports | — | — | ✅ Approved |
| 5 | LT-1002.5 | Update AppRoutes NotFoundPage | — | 1-4 | ✅ Approved |
| 6 | LT-1002.6 | Build verify | — | 1-5 | ✅ Approved |
| 7 | LT-601.1 | Tạo PrivateRoute component | — | — | ✅ Approved |
| 8 | LT-601.2 | Bọc SettingsPage | — | 7 | ✅ Approved |
| 9 | LT-601.3 | Bọc MembersPage edit | — | 7 | ✅ Approved |
| 10 | LT-601.4 | Verify header buttons hidden | — | 7 | ✅ Approved |
| 11 | LT-601.5 | Manual test redirect | — | 8-10 | ✅ Approved |
| 12 | LT-506.1 | Check RLS hiện tại | — | — | ✅ Approved |
| 13 | LT-506.2 | Policy profiles SELECT | — | 12 | ✅ Approved |
| 14 | LT-506.3 | Policy profiles INSERT/UPDATE/DELETE | — | 12 | ✅ Approved |
| 15 | LT-506.4 | Check RLS clan_settings | — | — | ✅ Approved |
| 16 | LT-506.5 | Policy clan_settings SELECT | — | 15 | ✅ Approved |
| 17 | LT-506.6 | Policy clan_settings UPDATE/INSERT | — | 15 | ✅ Approved |
| 18 | LT-506.7 | Enable RLS | — | 13-17 | ✅ Approved |
| 19 | LT-506.8 | Test public read | — | 18 | 🔲 |
| 20 | LT-506.9 | Test anon write reject | — | 18 | 🔲 |
| 21 | LT-506.10 | Save migration SQL | — | 18 | ✅ Approved |
| 22 | LT-901.1 | Tạo folder profile-form/ + types | — | — | ✅ Approved |
| 23 | LT-901.2 | PersonalInfoFieldset | — | 22 | ✅ Approved |
| 24 | LT-901.3 | StatusContactFieldset | — | 22 | ✅ Approved |
| 25 | LT-901.4 | LineageFieldset | — | 22 | ✅ Approved |
| 26 | LT-901.5 | DeceasedInfoFieldset | — | 22 | ✅ Approved |
| 27 | LT-901.6 | Update ProfileForm.tsx | — | 23-26 | ✅ Approved |
| 28 | LT-901.7 | Build verify | — | 27 | ✅ Approved |
| 29 | LT-901.8 | Manual test CRUD | — | 28 | ✅ Approved |
| 30 | LT-602.1 | Sidebar auto-collapse | — | — | ✅ Approved |
| 31 | LT-602.2 | Sidebar overlay mobile | — | 30 | ✅ Approved |
| 32 | LT-602.3 | Hamburger button | — | 31 | ✅ Approved |
| 33 | LT-602.4 | TreePage mobile | — | — | ✅ Approved |
| 34 | LT-602.5 | AncestryPage mobile | — | — | ✅ Approved |
| 35 | LT-602.6 | MembersPage mobile | — | — | ✅ Approved |
| 36 | LT-602.7 | Modal full-screen mobile | — | — | ✅ Approved |
| 37 | LT-602.8 | Header responsive | — | — | ✅ Approved |
| 38 | LT-602.9 | Test 375px viewport | — | 30-37 | ✅ Approved |
| 39 | LT-602.10 | Test 412px viewport | — | 30-37 | ✅ Approved |
| 40 | LT-602.11 | Fix Left Gap mobile | — | — | ✅ Approved |
| 41 | LT-602.12 | Responsive AppBar | — | — | ✅ Approved |
| 42 | LT-602.13 | Responsive BottomBar | — | — | ✅ Approved |
| 43 | LT-602.14 | Sidebar restore on desktop | — | 30 | ✅ Approved |
| 44 | LT-1003.5 | Manual test partner cạnh nhau | — | 43 | ✅ Approved |
| 45 | LT-1004.1 | Link ClanSettingsContext | — | — | ✅ Approved |
| 46 | LT-1004.2 | Fix logic cộng offset đời | — | 45 | ✅ Approved |
| 47 | LT-1004.3 | Build verify | — | 46 | ✅ Approved |
| 48 | LT-1004.4 | Manual test config | — | 47 | ✅ Approved |

**Tổng: 52 sub-tasks → 7 tickets → 28 SP**

---

*Tạo bởi @Antigravity (Tech Lead) ngày 25/02/2026.*
*Tech spec dựa trên source code scan thực tế, không phải giả định.*
