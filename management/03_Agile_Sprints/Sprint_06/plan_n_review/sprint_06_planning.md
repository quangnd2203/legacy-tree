# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** LegacyTree | **Sprint:** 06
**Mục tiêu của Sprint (Sprint Goal):** Thanh toán toàn bộ Tech Debt tồn đọng — Tái cơ cấu Presentation Layer, đồng bộ Domain Events, và vá các bug tiềm ẩn trong Repository layer.
**Bắt đầu:** 26/02/2026 | **Kết thúc:** 05/03/2026
**Tham gia:** @USER (Client/PM/Trưởng Tộc), @Antigravity (Technical Lead/Senior Dev)

---

## 1. REVIEW SỨC CHỨA CỦA TEAM (CAPACITY)

| Thành viên | Capacity | Ghi chú |
|---|---|---|
| @Antigravity (Tech Lead + Senior Dev) | 100% | Kiêm cả BA/QA cho dự án nội bộ |

- **Velocity Sprint 5:** 18 SP (100% delivery)
- **Velocity Sprint 4:** 34 SP
- **Velocity trung bình:** ~26 SP
- **Target Sprint 6: ~28 SP** *(Sprint này toàn refactoring, ít rủi ro hơn feature mới)*

---

## 2. CHỐT SPRINT BACKLOG

### 🛠️ Nhóm A — Tái Cơ Cấu Presentation Layer (LT-907)

> **Mục tiêu:** Di chuyển toàn bộ Page components ra khỏi `components/`, tổ chức lại theo cấu trúc `pages/<page-name>/` chuẩn.

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-907-1 | **[Tree Page]** Tạo `pages/tree/`, di chuyển `FamilyTree.tsx` → `TreePage.tsx`, di chuyển `TreeNode.tsx` + `OrthogonalEdge.tsx` vào `pages/tree/components/` | 3 | 🔲 Todo | @Senior_Dev |
| LT-907-2 | **[Ancestry Page]** Tạo `pages/ancestry/`, di chuyển `AncestryBook.tsx` → `AncestryPage.tsx`, di chuyển `useAncestryBook.ts` vào `pages/ancestry/hooks/` | 2 | 🔲 Todo | @Senior_Dev |
| LT-907-3 | **[Members Page]** Tạo `pages/members/`, di chuyển `ProfileList.tsx` → `MembersPage.tsx` | 1 | 🔲 Todo | @Senior_Dev |
| LT-907-4 | **[Settings Page]** Tạo `pages/settings/`, di chuyển `ClanSettingsPage.tsx` → `SettingsPage.tsx`, di chuyển `ClanSettingsForm.tsx` + `PrefaceEditor.tsx` vào `pages/settings/components/`, di chuyển `useClanSettings.ts` vào `pages/settings/hooks/` | 3 | 🔲 Todo | @Senior_Dev |
| LT-907-5 | **[Login Page]** Đổi tên `pages/Login.tsx` → `pages/login/LoginPage.tsx` | 1 | 🔲 Todo | @Senior_Dev |
| LT-907-6 | **[App.tsx]** Cập nhật toàn bộ import paths, dọn sạch `hooks/` folder và `components/ClanSettings/` folder cũ | 2 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm A: 12 SP**

---

### 🔧 Nhóm B — Domain Events & Architecture Cleanup

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-904 | **[Domain Events]** Tạo `ClanSettingsEvents.ts`, thêm `CLAN_SETTINGS_UPDATED` vào `DomainEvents`, dispatch trong `updateClanSettings()`, thêm subscriber vào `AuditLogListener` | 3 | 🔲 Todo | @Senior_Dev |
| LT-903 | **[Interface Cleanup]** Xóa `IClanSettingsRepository.ts`, bỏ type annotation `IClanSettingsRepository` trong `SupabaseClanSettingsRepository.ts` | 1 | 🔲 Todo | @Senior_Dev |
| LT-902 | **[Architecture]** Đồng nhất header comment và cấu trúc export giữa `profileRepository` và `clanSettingsRepository` | 1 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm B: 5 SP**

---

### 🐛 Nhóm C — Bug Fixes

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-905 | **[Bug 🔴] Fix `this` trong `upsert()`**: `clanSettingsRepository.upsert()` gọi `this.get()` trong plain object context → undefined. Thay bằng gọi trực tiếp Supabase hoặc tách helper function. | 1 | 🔲 Todo | @Senior_Dev |
| LT-906 | **[Bug] Fix `.single()` → `.maybeSingle()`**: `profileRepository.getById()` ném lỗi khi không tìm thấy record. | 1 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm C: 2 SP**

---

### 🧪 Nhóm D — Tests

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-509 | **[Regression Tests]** Viết thêm test cases cho `sortProfilesByTraditionalSeniority` — cover edge cases: cùng seniority_index, cùng ngày sinh, không có birth_date | 3 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm D: 3 SP**

---

**🎯 Tổng Sprint 6: 22 SP**

---

## 3. THỨ TỰ THỰC HIỆN (DEPENDENCIES)

```
Bước 1 → LT-905, LT-906 (Bug fixes — nhỏ, làm trước để dự án ổn định)
Bước 2 → LT-903           (Xóa interface — dọn đường cho step tiếp)
Bước 3 → LT-904, LT-902   (Domain Events + Architecture sync)
Bước 4 → LT-509           (Tests — sau khi code đã ổn định)
Bước 5 → LT-907-1 đến 907-6 (Presentation refactor — làm tuần tự từng page)
                              ↳ PHẢI build pass sau mỗi sub-step
```

---

## 4. RỦI RO / TRỞ NGẠI

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| Refactor import paths trong `App.tsx` gây lỗi build chain | Medium | Build và test sau mỗi sub-step LT-907-x |
| `context/ClanSettingsContext.tsx` import `useClanSettings` — dễ quên cập nhật | Medium | Kiểm tra kỹ khi làm LT-907-4 |
| Đổi tên component làm mất History trong git | Low | Dùng `git mv` thay vì xóa + tạo mới |

---

## 5. DEFINITION OF DONE — SPRINT 6

- [ ] `components/` chỉ còn `Modal.tsx`, `ProfileForm.tsx`, `ProfileImageUpload.tsx`.
- [ ] Tất cả Route trong `App.tsx` trỏ đúng về `pages/<page>/`.
- [ ] `ClanSettingsEvents.ts` tồn tại, event được dispatch khi update Clan Settings.
- [ ] `IClanSettingsRepository.ts` đã bị xóa.
- [ ] Bug LT-905 và LT-906 đã được vá.
- [ ] Build pass `npx vite build` — 0 errors.
- [ ] Tests pass — tối thiểu 14/14 (thêm 3 test case mới từ LT-509).
- [ ] Code Review APPROVED bởi @Tech_Lead.

---
*Biên bản Sprint Planning được lập bởi @Antigravity (Tech Lead) ngày 25/02/2026.*
