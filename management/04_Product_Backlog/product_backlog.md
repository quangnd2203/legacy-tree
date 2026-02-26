# 📋 PRODUCT BACKLOG: LEGACY TREE PROJECT

Tài liệu này tổng hợp toàn bộ các tính năng, yêu cầu kỹ thuật và nợ kỹ thuật (Tech Debt) chưa thực hiện của dự án, được sắp xếp theo mức độ ưu tiên.

---

## 🔝 1. Ưu Tiên Cao — Sprint 7 (26/02 – 05/03/2026)

> **Sprint Goal:** *"Dự án an toàn để chia sẻ — Bảo mật route + database, giao diện xem được trên điện thoại."*

| ID | Hạng mục | SP | Trạng thái | Ghi chú |
|:---:|:---|:---:|:---:|:---|
| ~~**LT-601**~~ | ~~**Bảo mật: Protected Routes**~~ | ~~3~~ | ✅ **Done S7** | Tạo `PrivateRoute` component, chặn URL trực tiếp vào `/settings`, `/members` khi chưa đăng nhập. |
| ~~**LT-506**~~ | ~~**Nâng cấp RLS Admin Supabase**~~ | ~~5~~ | ✅ **Done S7** | Phân quyền RLS tầng DB cho Admin/Contributor — bắt buộc trước khi mở Contribution Flow. |
| ~~**LT-602**~~ | ~~**Tối ưu UI Mobile (Responsive)**~~ | ~~8~~ | ✅ **Done S7** | TreePage + AncestryPage xem mượt trên điện thoại. Ưu tiên iPhone SE & Android phổ thông. |
| ~~**LT-901**~~ | ~~**Refactor ProfileForm (Part 2)**~~ | ~~5~~ | ✅ **Done S7** | Tách `ProfileForm.tsx` (>400 dòng) thành các Fieldset components nhỏ hơn. |
| ~~**LT-603**~~ | ~~**Performance: Code Splitting**~~ | ~~3~~ | ✅ **Done S6** | Đã hoàn thành trong Sprint 6 — lazy loading + Suspense, bundle giảm 60%. |

---

## 🚀 2. Nhóm Tính Năng Mới (Roadmap)

| ID | Hạng mục | SP | Milestone | Ghi chú |
|:---:|:---|:---:|:---:|:---|
| **LT-701** | **Hệ thống Gửi yêu cầu (Contribution)** | 13 | Sprint 8 | Thành viên gửi thông tin chỉnh sửa để Admin duyệt. **Cần LT-506 (RLS) hoàn thành trước.** |
| **LT-702** | **Portal Duyệt tin (Admin Dashboard)** | 8 | Sprint 8 | Giao diện cho Trưởng tộc Approve/Reject các yêu cầu. Đi cùng LT-701. |
| **LT-1001** | **Bản tin Dòng Họ (Announcement Board)** | 8 | Sprint 8 | Admin đăng thông báo: cáo phó, chạp giỗ kỵ, tin vui. Reuse Tiptap + DOMPurify. Xem Req section 3.7. |
| ~~**LT-801**~~ | ~~**Tự động chuyển đổi Âm lịch**~~ | ~~5~~ | ~~Sprint 9~~ | ❌ **CANCELLED [25/02/2026]** — `birth_date_lunar` free text, không parse được đáng tin cậy. Chi phí > giá trị. |
| ~~**LT-802**~~ | ~~**Thông báo ngày Giỗ (Notifications)**~~ | ~~8~~ | ~~Sprint 9~~ | ❌ **CANCELLED [25/02/2026]** — Thay thế bằng Bản tin (LT-1001). Admin tự đăng đơn giản hơn, không cần email infra. |

---

## 🛠️ 3. Nhóm Tối Ưu Kỹ Thuật (Tech Debt)

| ID | Hạng mục | SP | Trạng thái | Ghi chú |
|:---:|:---|:---:|:---:|:---|
| **LT-1101** | **[Refactor] Tách Print Logic khỏi AncestryPage** | 3 | 🔲 Todo | `AncestryPage.tsx` phình to >440 dòng do gánh logic in ấn và dàn trang. Cần tách CSS và Hook xử lý in ấn riêng biệt. |
| **LT-1102** | **[Optimize] Cải thiện thuật toán tính "Đời" cho Phối ngẫu** | 3 | 🔲 Todo | Trong `TreePage.tsx`, thuật toán tính generation cho spouse đang chạy loop 3 pass. Cần dùng BFS/DFS để tối ưu. |
| **LT-1103** | **[Refactor] Loại bỏ type casting `Record<string, unknown>`** | 2 | 🔲 Todo | Gắn interface cụ thể cho `node.data` trong `TreePage.tsx` thay vì dùng ép kiểu trung gian. |
| ~~**LT-1004**~~ | ~~**[Bug] Cột "Đời" trong Members không theo Config**~~ | ~~2~~ | ✅ **Done S7** | Đời đang bị fix cứng từ 1, cần cộng thêm `generation_display_offset` từ ClanSettings. |
| ~~**LT-1003**~~ | ~~**[Bug] Phối ngẫu bị rớt xuống cuối danh sách Members**~~ | ~~3~~ | ✅ **Done S7** | Partner không có `father_id` trong dòng họ → bị đẩy xuống cuối thay vì đứng cạnh vợ/chồng. Cần sửa sorting logic để nhóm partner cạnh nhau. |
| ~~**LT-901**~~ | ~~**Refactor ProfileForm (Part 2)**~~ | ~~5~~ | ✅ **Done S7** | Tách `ProfileForm.tsx` thành 4 Fieldset components. Approved by @Tech_Lead. |
| ~~**LT-509**~~ | ~~**Regression Tests cho Seniority**~~ | ~~5~~ | ✅ **Done S6** | Hoàn thành — 15/15 tests pass, thêm 3 edge cases (null seniority, null birth_date, gender boundary). |
| ~~**LT-902**~~ | ~~**Standardize Clean Architecture**~~ | ~~3~~ | ✅ **Done S6** | Header comment + export structure đã đồng nhất giữa 2 repositories. |
| ~~**LT-903**~~ | ~~**Xóa IClanSettingsRepository (Interface)**~~ | ~~1~~ | ✅ **Done S6** | `IClanSettingsRepository.ts` đã xóa — grep 0 kết quả. |
| ~~**LT-904**~~ | ~~**Đồng bộ Domain Events cho ClanSettings**~~ | ~~3~~ | ✅ **Done S6** | `ClanSettingsEvents.ts` tạo xong, dispatch trong `updateClanSettings()`, subscriber trong `AuditLogListener`. |
| ~~**LT-905**~~ | ~~**Fix bug `this` trong clanSettingsRepository.upsert()**~~ | ~~1~~ | ✅ **Done S6** | Đã vá — fetch Supabase trực tiếp thay vì `this.get()`. |
| ~~**LT-906**~~ | ~~**Fix `.single()` → `.maybeSingle()` trong getById**~~ | ~~1~~ | ✅ **Done S6** | Đã vá — `profileRepository.getById()` dùng `.maybeSingle()`. |
| ~~**LT-907**~~ | ~~**[Refactor] Tái cơ cấu Presentation Layer**~~ | ~~8~~ | ✅ **Done S6** | Hoàn thành 6/6 sub-tasks — `pages/<name>/` chuẩn, `components/` chỉ còn 3 shared files. |

---

## � 4. Chi Tiết Ticket LT-907: Tái Cơ Cấu Presentation Layer

### Vấn đề
Hiện tại toàn bộ Pages (màn hình gắn với Route) đang bị để chung trong `components/`. `components/` chỉ nên chứa UI dùng chung (shared components).

### Nguyên tắc thiết kế mới
- **`pages/<page-name>/`** — Mỗi route có một thư mục riêng.
  - `<PageName>Page.tsx` — Component chính, lazy-loadable, gắn với Route.
  - `components/` — Sub-components chỉ dùng trong page này.
  - `hooks/` — Custom hooks chỉ dùng trong page này.
- **`components/`** — Chỉ chứa shared components dùng ở **nhiều** page.

### Cấu trúc đích
```
src/presentation/
├── pages/
│   ├── tree/
│   │   ├── TreePage.tsx               ← đổi tên từ FamilyTree.tsx
│   │   └── components/
│   │       ├── TreeNode.tsx           ← di chuyển từ components/
│   │       └── OrthogonalEdge.tsx     ← di chuyển từ components/
│   ├── ancestry/
│   │   ├── AncestryPage.tsx           ← đổi tên từ AncestryBook.tsx
│   │   └── hooks/
│   │       └── useAncestryBook.ts     ← di chuyển từ hooks/
│   ├── members/
│   │   └── MembersPage.tsx            ← đổi tên từ ProfileList.tsx
│   ├── settings/
│   │   ├── SettingsPage.tsx           ← đổi tên từ ClanSettingsPage.tsx
│   │   ├── hooks/
│   │   │   └── useClanSettings.ts     ← di chuyển từ hooks/
│   │   └── components/
│   │       ├── ClanSettingsForm.tsx   ← di chuyển từ components/ClanSettings/
│   │       └── PrefaceEditor.tsx      ← di chuyển từ components/ClanSettings/
│   └── login/
│       └── LoginPage.tsx              ← đổi tên từ pages/Login.tsx
│
├── components/                        ← CHỈ còn shared components
│   ├── Modal.tsx                      ← giữ nguyên
│   ├── ProfileForm.tsx                ← giữ nguyên (dùng ở modal + members)
│   └── ProfileImageUpload.tsx         ← giữ nguyên
├── context/
├── hooks/                             ← xóa sau khi di chuyển hết
├── App.tsx
└── main.tsx
```

### Danh sách thay đổi chi tiết

| Bước | File hiện tại | Hành động | File đích |
|:---:|:---|:---:|:---|
| 1 | `components/FamilyTree.tsx` | Đổi tên + di chuyển | `pages/tree/TreePage.tsx` |
| 2 | `components/TreeNode.tsx` | Di chuyển | `pages/tree/components/TreeNode.tsx` |
| 3 | `components/OrthogonalEdge.tsx` | Di chuyển | `pages/tree/components/OrthogonalEdge.tsx` |
| 4 | `components/AncestryBook.tsx` | Đổi tên + di chuyển | `pages/ancestry/AncestryPage.tsx` |
| 5 | `hooks/useAncestryBook.ts` | Di chuyển | `pages/ancestry/hooks/useAncestryBook.ts` |
| 6 | `components/ProfileList.tsx` | Đổi tên + di chuyển | `pages/members/MembersPage.tsx` |
| 7 | `components/ClanSettings/ClanSettingsPage.tsx` | Đổi tên + di chuyển | `pages/settings/SettingsPage.tsx` |
| 8 | `components/ClanSettings/ClanSettingsForm.tsx` | Di chuyển | `pages/settings/components/ClanSettingsForm.tsx` |
| 9 | `components/ClanSettings/PrefaceEditor.tsx` | Di chuyển | `pages/settings/components/PrefaceEditor.tsx` |
| 10 | `hooks/useClanSettings.ts` | Di chuyển | `pages/settings/hooks/useClanSettings.ts` |
| 11 | `pages/Login.tsx` | Đổi tên + di chuyển | `pages/login/LoginPage.tsx` |
| 12 | `App.tsx` | Cập nhật toàn bộ import paths | — |
| 13 | `context/ClanSettingsContext.tsx` | Kiểm tra lại import `useClanSettings` | — |
| 14 | `hooks/` (folder) | Xóa sau khi di chuyển hết | — |
| 15 | `components/ClanSettings/` (folder) | Xóa sau khi di chuyển hết | — |

### Acceptance Criteria
- [ ] Toàn bộ Route trong `App.tsx` trỏ đến đúng `pages/<page>/` không còn trỏ vào `components/`.
- [ ] `components/` chỉ còn: `Modal.tsx`, `ProfileForm.tsx`, `ProfileImageUpload.tsx`.
- [ ] Build pass 0 lỗi sau khi refactor.
- [ ] Tests vẫn pass (11/11).

### Rủi ro
- `useClanSettings.ts` đang được import bởi `context/ClanSettingsContext.tsx` → cần cập nhật import path.
- `App.tsx` cần update nhiều import cùng lúc — dễ typo → refactor từng file một, build sau mỗi bước.

---

## 📌 Ghi chú từ Managing Director:
- Mọi thay đổi trong bảng này phải được cập nhật sau mỗi buổi Sprint Review.
- Các ticket trong nhóm "Ưu tiên cao" sẽ được lấy vào Sprint Planning tiếp theo.
- **Dependency quan trọng:** LT-701 và LT-702 (Contribution Flow) **BẮT BUỘC** phải chờ LT-506 (RLS) hoàn thành trước. Không được đảo thứ tự.
- **Descoped nav items [25/02/2026]:** Các route `/events` (Sự kiện), `/network` (Tạo viên), `/directory` (Danh bạ) đã bị xóa khỏi nav. Chi tiết lý do xem `01_LegacyTree_Requirements.md` section 3.8.
- **Lộ trình tổng quan:**
  - **Sprint 7:** Bảo mật + Mobile (LT-601, LT-506, LT-602, LT-901) — *Mục tiêu: an toàn để chia sẻ rộng*
  - **Sprint 8:** Contribution Flow (LT-701, LT-702) + Bản tin (LT-1001) — *Mục tiêu: từ tool cá nhân → platform dòng họ*
  - **Sprint 9:** TBD sau Sprint 8

---
*Cập nhật lần cuối: 25/02/2026 bởi @Managing_Director_PM (Discovery Session sau Sprint 6 Review)*
