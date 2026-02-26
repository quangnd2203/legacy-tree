# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** LegacyTree | **Sprint:** 07
**Mục tiêu của Sprint (Sprint Goal):** Dự án an toàn để chia sẻ — Bảo mật route + database, giao diện xem được trên điện thoại, dọn nav theo Discovery.
**Bắt đầu:** 26/02/2026 | **Kết thúc:** 12/03/2026 (2 tuần)
**Tham gia:** @USER (Client/PM/Trưởng Tộc), @Antigravity (Technical Lead/Senior Dev)

---

## 1. REVIEW SỨC CHỨA CỦA TEAM (CAPACITY)

| Thành viên | Capacity | Ghi chú |
|---|---|---|
| @Antigravity (Tech Lead + Senior Dev) | 100% | Kiêm cả BA/QA cho dự án nội bộ |

- **Velocity Sprint 6:** 22 SP (100% delivery)
- **Velocity Sprint 5:** 18 SP (100% delivery)
- **Velocity Sprint 4:** 34 SP (100% delivery)
- **Velocity trung bình:** ~25 SP
- **Target Sprint 7: 23 SP** *(LT-602 Responsive là task khó, cần nhiều thời gian test — đệm nhẹ)*

---

## 2. CHỐT SPRINT BACKLOG

### 🔒 Nhóm A — Bảo Mật (Pre-req cho Sprint 8 Contribution Flow)

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-601 | **[Security] Protected Routes** | 3 | ✅ Done | @Senior_Dev |
| LT-506 | **[Security] RLS Admin Supabase** | 5 | ✅ Done | @Senior_Dev |

**Tổng Nhóm A: 8 SP**

---

### 📱 Nhóm B — Mobile Responsive

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-602 | **[UX] Responsive Mobile** — Đảm bảo TreePage, AncestryPage, MembersPage, Sidebar hoạt động tốt trên viewport 375px (iPhone SE) và 412px (Android phổ thông). Sidebar collapse trên mobile. Tree cho phép scroll/pinch zoom. AncestryPage font size phù hợp. | 8 | 🔲 Todo | @Senior_Dev |

**Tổng Nhóm B: 8 SP**

---

### 🛠️ Nhóm C — Tech Debt & Cleanup

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-901 | **[Refactor] ProfileForm Part 2** | 5 | ✅ Done | @Senior_Dev |
| LT-1002 | **[Cleanup] Dọn Nav theo Discovery** | 2 | ✅ Done | @Senior_Dev |

**Tổng Nhóm C: 7 SP**

---

### 🐛 Nhóm D — Bug Fixes (Phát sinh)

| ID | Tên công việc | SP | Status | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-1003 | Fix Partner Sorting | 3 | ✅ Done | @Senior_Dev |
| LT-1004 | Fix Generation Offset | 2 | ✅ Done | @Senior_Dev |

**Tổng Nhóm D: 5 SP**

---

**🎯 Tổng Sprint 7: 28 SP** (7 tickets)

---

## 3. THỨ TỰ THỰC HIỆN (DEPENDENCIES)

```
Bước 1 → LT-1002           (Dọn nav — nhỏ, dọn dẹp scope trước)
Bước 2 → LT-601            (Protected Routes — cần xong trước RLS)
Bước 3 → LT-506            (RLS Supabase — phụ thuộc LT-601 để test kết hợp)
Bước 4 → LT-901            (Refactor ProfileForm — độc lập, làm song song được)
Bước 5 → LT-602            (Responsive — làm cuối vì cần tất cả page đã ổn định)
                             ↳ Test trên ít nhất 2 viewport: 375px + 412px
```

---

## 4. RỦI RO / TRỞ NGẠI

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| RLS policy sai có thể block toàn bộ CRUD trên production | **High** | Test kỹ trên Supabase dashboard trước khi deploy. Luôn giữ backup policy cũ. |
| Responsive TreePage (xyflow) — lib chưa rõ hỗ trợ mobile thế nào | **Medium** | Kiểm tra docs xyflow trước, nếu cần thì wrap trong container có touch events. |
| Tách ProfileForm có thể gây lỗi form validation | **Medium** | Build + test form sau mỗi fieldset được tách ra. |
| `useAuth()` context chưa check token expiry — PrivateRoute có thể flash | **Low** | Thêm loading state trong AuthContext nếu cần. |

---

## 5. DEFINITION OF DONE — SPRINT 7

- [ ] Route `/settings` và `/members` redirect về `/login` nếu chưa đăng nhập.
- [ ] RLS policies tồn tại trên Supabase cho `profiles` và `clan_settings`.
- [ ] Public viewer (không login) chỉ SELECT được — không INSERT/UPDATE/DELETE.
- [ ] TreePage + AncestryPage + MembersPage hiển thị đúng trên viewport 375px.
- [ ] Sidebar tự collapse trên mobile (viewport < 768px).
- [ ] `ProfileForm.tsx` đã được tách thành ≥ 3 Fieldset components.
- [ ] Nav chỉ còn: Bản tin, Cây gia phả, Phả ký phả chí, Thành viên (4 items).
- [ ] Build pass `npx vite build` — 0 errors.
- [ ] Tests pass — ≥ 15/15.

---

*Biên bản Sprint Planning được lập bởi @Antigravity (Tech Lead) ngày 25/02/2026.*
*Tickets được chọn từ Product Backlog sau buổi Discovery Session cùng ngày.*
