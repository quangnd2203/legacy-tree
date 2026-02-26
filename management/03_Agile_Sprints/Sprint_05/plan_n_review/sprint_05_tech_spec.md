# SPRINT 5 — TECH SPEC & TASK BREAKDOWN
*@Tech_Lead → @Senior_Dev | Ngày: 25/02/2026*

---

## TỔNG QUAN KIẾN TRÚC HIỆN TẠI (AS-IS)

```
App.tsx
├── AuthProvider (AuthContext)
│   └── ClanSettingsProvider
│       └── Dashboard
│           ├── Routes (KHÔNG có ProtectedRoute wrapper — tất cả public!)
│           │   ├── /tree     → FamilyTree
│           │   ├── /members  → ProfileList
│           │   ├── /ancestry → AncestryBook
│           │   ├── /settings → ClanSettingsPage
│           │   └── /login    → Login
│           └── Sidebar/Header (hide CRUD buttons chỉ bằng `user ?` check thủ công)
```

**Điểm quan trọng:**
- `AuthContext` chỉ có `user`, `session`, `loading`, `signOut` — **chưa có `isAdmin`**
- Mọi route hiện tại đều accessible, không redirect nếu chưa login
- `ProfileForm.tsx` = 499 dòng, state upload (4 states + 2 refs) nằm chung với form logic

---

## TICKET BREAKDOWN CHI TIẾT

---

### 🖨️ LT-501 — CSS Print: Dàn trang PDF

**File cần sửa:** `src/presentation/components/AncestryBook.tsx` + tạo mới `src/presentation/styles/print.css`

**Task list cho Senior Dev:**

**Task 1.1 — Tạo file `print.css`** *(~30 dòng CSS)*
```
File: src/presentation/styles/print.css
Import vào: src/main.tsx (sau index.css)
```
CSS cần viết:
```css
@media print {
  /* Ẩn toàn bộ UI chrome */
  aside, header, footer, button, .no-print { display: none !important; }

  /* Đặt lại layout cho print */
  body, html { background: white; font-family: serif; }
  main { overflow: visible !important; height: auto !important; }

  /* Mỗi FamilyUnit = 1 trang */
  .ancestry-unit { break-inside: avoid; page-break-after: always; }

  /* Bìa sách riêng trang */
  .ancestry-cover { break-after: page; page-break-after: always; }

  /* Typography */
  * { color: black !important; background: transparent !important; }
}
```

**Task 1.2 — Thêm class vào `AncestryBook.tsx`**

Xác định các element cần gắn class:
- **Bìa sách container** (div chứa tên tộc, quê quán, lời thơ) → thêm class `ancestry-cover`
- **Mỗi FamilyUnit container** (div bao mỗi Hộ) → thêm class `ancestry-unit`
- **Nút Refresh / icon UI** → thêm class `no-print`

> ⚠️ Lưu ý Chrome: `break-inside: avoid` + `page-break-after: always` cần test thực. Nếu Chrome vẫn cắt trang, cần wrap thêm `display: block; overflow: hidden`.

---

### 🖨️ LT-502 — Nút "In Phả Ký"

**File cần sửa:** `src/presentation/components/AncestryBook.tsx`

**Task 2.1 — Thêm nút In vào header của AncestryBook**

Vị trí: Cùng row với nút Refresh hiện tại (góc trên phải của trang Ancestry).

Logic:
```tsx
// Chỉ hiện khi user đã login
{user && (
  <button
    onClick={() => window.print()}
    className="..."  // style nhất quán với nút Refresh hiện tại
  >
    <Printer size={14} /> In Phả Ký
  </button>
)}
```

**Task 2.2 — `useAuth()` trong `AncestryBook.tsx`**

Import `useAuth` và lấy `user` để conditionally render nút In.

> 💡 Không cần kiểm tra `isAdmin` riêng ở bước này — user đã login là đủ điều kiện in.

---

### 🖨️ LT-503 — Bìa sách dạng trang in

**File cần sửa:** `src/presentation/components/AncestryBook.tsx`

Hiện tại bìa sách (phần hiển thị tên Tộc, Quê quán, Lời tựa) nằm inline trong trang AncestryBook.

**Task 3.1 — Verify và điều chỉnh cấu trúc bìa sách**

Tìm trong `AncestryBook.tsx` section hiển thị bìa (dùng `clanSettings.clan_name`, `clanSettings.preface_poem`). Đảm bảo:
- Bìa được wrap trong `<div className="ancestry-cover">` (kết hợp với LT-501)
- Bìa có `min-height: 100vh` trong print mode để chiếm đúng 1 trang
- Thứ tự: Bìa → Đời 1 → Đời 2 → ... (đúng thứ tự DOM hiện tại)

**Task 3.2 — Thêm CSS vào `print.css`**
```css
@media print {
  .ancestry-cover {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
```

---

### 🖨️ LT-504 — Footer số trang trong PDF

**File cần sửa:** `src/presentation/styles/print.css`

**Task 4.1 — Thêm CSS counter**
```css
@page {
  margin: 2cm;
  @bottom-center {
    content: "Trang " counter(page) " / " counter(pages);
    font-size: 9pt;
    font-family: serif;
  }
  @bottom-right {
    content: "Gia phả bất tận • Phúc lộc trường tồn";
    font-size: 8pt;
    color: #666;
  }
}
```

> ⚠️ **`@page` với `counter` chỉ hỗ trợ trên Chrome (Paged Media).** Nếu không chạy, fallback: thêm số trang bằng JS vào `beforeprint` event.

**Task 4.2 — Fallback JS (nếu CSS `@page` không hiệu quả)**
```tsx
// Trong AncestryBook.tsx, thêm:
useEffect(() => {
  const handleBeforePrint = () => {
    // Đếm số unit và thêm "Trang X / Y" vào footer của mỗi unit
    const units = document.querySelectorAll('.ancestry-unit');
    units.forEach((el, i) => {
      el.setAttribute('data-page', `${i + 1} / ${units.length}`);
    });
  };
  window.addEventListener('beforeprint', handleBeforePrint);
  return () => window.removeEventListener('beforeprint', handleBeforePrint);
}, []);
```
Kết hợp CSS:
```css
.ancestry-unit::after {
  content: "Trang " attr(data-page);
  display: block;
  text-align: center;
  font-size: 9pt;
  margin-top: auto;
}
```

---

### 🌐 LT-505 — Public View

**Files cần sửa:** `src/presentation/App.tsx`

**Task 5.1 — Xóa redirect về /login (nếu có)**

Kiểm tra xem hiện tại App.tsx có redirect người chưa login về `/login` không. Dựa vào code đã đọc: **KHÔNG có redirect** — tất cả route đã accessible. Chỉ cần đảm bảo giữ nguyên behavior này.

**Task 5.2 — Ẩn CRUD buttons conditionally (kiểm tra lại)**

Rà soát các chỗ hiển thị CRUD:
- `App.tsx` line 157: `{user ? ... (nút Đăng xuất) : (nút Đăng nhập)}` ✅ Đã đúng
- Nút "Thêm thành viên" trong App.tsx → kiểm tra có `user &&` guard chưa
- Icon Edit trên FamilyTree node → kiểm tra
- Nút Refetch trong AncestryBook → giữ nguyên (public xem được)
- Nút "In Phả Ký" (LT-502) → chỉ Admin

**Task 5.3 — Ẩn Sidebar Settings khi chưa login**

Trong `App.tsx`, mục Settings trong sidebar hiện tại có điều kiện `{user && ...}` chưa? Kiểm tra và thêm nếu thiếu.

**Task 5.4 — Test Public Access**

Mở Incognito → truy cập `/ancestry`, `/tree` → xác nhận thấy nội dung, không bị redirect. Mở DevTools → xác nhận không có 401 error từ Supabase (vì RLS đã cho phép public read).

---

### 🛠️ LT-507 — Tách `ProfileImageUpload.tsx`

**File hiện tại:** `src/presentation/components/ProfileForm.tsx` (499 dòng)
**File mới cần tạo:** `src/presentation/components/ProfileImageUpload.tsx`

**Task 7.1 — Xác định state cần move**

Các state sau sẽ chuyển sang `ProfileImageUpload.tsx`:
```tsx
// Từ ProfileForm.tsx → ProfileImageUpload.tsx
const [portraitFile, setPortraitFile] = useState<File | null>(null);
const [graveFile, setGraveFile] = useState<File | null>(null);
const [previewPortrait, setPreviewPortrait] = useState<string | null>(null);
const [previewGrave, setPreviewGrave] = useState<string | null>(null);
const portraitInputRef = useRef<HTMLInputElement>(null);
const graveInputRef = useRef<HTMLInputElement>(null);
```

Hàm cần move:
- `handleFileChange()`
- `uploadProjectFile()`

**Task 7.2 — Interface của `ProfileImageUpload`**

```tsx
interface ProfileImageUploadProps {
  initialPortraitUrl?: string | null;
  initialGraveUrl?: string | null;
  onUploadComplete: (portraitUrl: string | null, graveUrl: string | null) => void;
  // Hoặc expose uploadFiles() method qua forwardRef nếu muốn trigger từ parent
}
```

> 💡 **Khuyến nghị:** Dùng `onUploadComplete` callback. `ProfileForm.handleSubmit` sẽ call `uploadImages()` trả về `{portraitUrl, graveUrl}` trước khi submit.

**Task 7.3 — Refactor `ProfileForm.tsx`**

Sau khi tách:
- Xóa 4 states + 2 refs + 2 functions khỏi `ProfileForm`
- Thay bằng `<ProfileImageUpload ...>` component
- Truyền `initialPortraitUrl={formData.image_url}` và `initialGraveUrl={formData.grave_image_url}`
- Nhận callback để update `formData.image_url` và `formData.grave_image_url`

**Task 7.4 — Verify kết quả**

`ProfileForm.tsx` phải < 350 dòng sau khi tách. Kiểm tra tính năng upload ảnh vẫn hoạt động.

---

### 🛠️ LT-508 — Bỏ `.order()` ở `SupabaseProfileRepository`

**File cần sửa:** `src/infrastructure/repository/SupabaseProfileRepository.ts` (line 9)

**Task 8.1 — Xóa `.order()` call**

```diff
- .order('full_name', { ascending: true });
+ // Sort removed: logic tập trung tại Application layer (ProcessAncestryBook.ts)
```

**Task 8.2 — Verify không có regression**

Sau khi xóa, kiểm tra:
- Trang `/members` (ProfileList) — danh sách vẫn hiển thị đúng thứ tự? *(ProfileList có sort riêng không?)*
- Trang `/ancestry` — thứ tự Hộ vẫn đúng (đã được sort bởi `processAncestryBook`)?
- Dropdown chọn cha/phối ngẫu trong Form — không cần thứ tự alphabetical?

> 📌 Nếu `ProfileList.tsx` cần sort theo tên, thêm sort ở Use Case `getProfiles()` hoặc component level, **không phải ở Repository**.

---

## THỨ TỰ THỰC HIỆN ĐỀ XUẤT

```
Ngày 1:   LT-508 (5 phút) → LT-507 (2h)
Ngày 2:   LT-501 + LT-503 (CSS Print structure, 3h)
Ngày 3:   LT-504 (Footer/CSS @page test, 2h) → LT-502 (Nút In, 1h)
Ngày 4:   LT-505 (Public View audit + fix, 2h)
Ngày 5:   Buffer (test cross-browser PDF + fix issues)
```

---

## CHECKLIST TRƯỚC KHI MERGE

- [ ] `npx vite build` — 0 TypeScript errors
- [ ] PDF in thử trên Chrome → mỗi Hộ 1 trang rõ ràng
- [ ] PDF in thử trên Safari → không bị lỗi layout
- [ ] Mở Incognito → `/ancestry` và `/tree` accessible
- [ ] Upload ảnh thành viên vẫn hoạt động sau khi tách ProfileImageUpload
- [ ] `ProfileForm.tsx` < 350 dòng

---
*Tech Spec được chuẩn bị bởi @Tech_Lead (Antigravity) — 25/02/2026*
*Assign to: @Senior_Dev để thực thi trong Sprint 5*
