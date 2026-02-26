# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** LegacyTree | **Sprint:** 03
**Mục tiêu của Sprint (Sprint Goal):** Nâng cấp UX với Modal/Routing, xây dựng Module Phả ký và tái cấu trúc Architecture cho tính năng Phả ký đạt chuẩn Clean Architecture.
**Bắt đầu:** 25/02/2026 | **Kết thúc:** 04/03/2026
**Tham gia:** @USER (Client/PM), @Antigravity (Technical Lead/Senior Dev)

---

## 1. CHỐT SPRINT BACKLOG (DANH SÁCH TASK SẼ LÀM)

| ID | Tên chức năng (User Story) | Story Points | Trạng thái (Status) | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-301 | **Hệ thống Routing**: Cài đặt React Router để có URL riêng cho từng tab (e.g. /tree, /members) | 5 | ✅ Done | @Antigravity |
| LT-302 | **Modal Popup Form**: Chuyển ProfileForm từ hiển thị state sang Modal nổi (shadcn/ui hoặc Tailwind Modal) | 5 | ✅ Done | @Senior_Dev |
| LT-303 | **Sửa lỗi & Tối ưu nút Edit**: Đảm bảo nút Edit trên phả đồ mở đúng Modal mà không nhảy Tab | 3 | ✅ Done | @Senior_Dev |
| LT-304 | **Module Phả ký (Ancestry Book)**: Xây dựng giao diện sách gia phả, hiển thị đúng tông ty, đời thứ, danh xưng | 8 | ✅ Done | @Antigravity |
| LT-305 | **[Refactor] Tạo Shared Config Layer**: Tách `viNumbers`, `rankSuffix`, `priorityWeights`, `clanName`... ra file `src/shared/genealogy/GenealogyConfig.ts` | 3 | ✅ Done | @Senior_Dev |
| LT-306 | **[Refactor] Tách Business Logic ra Application Layer**: Di chuyển `processBook()` và `getRankLabel()` vào `src/application/genealogy-use-cases/ProcessAncestryBook.ts` | 5 | ✅ Done | @Senior_Dev |
| LT-307 | **[Refactor] Tạo Custom Hook `useAncestryBook`**: Bọc toàn bộ data fetching + error/loading state, giữ component `AncestryBook.tsx` chỉ có JSX thuần | 3 | ✅ Done | @Senior_Dev |
| LT-308 | **[Fix] Thêm Error State UI**: Hiển thị error message thân thiện khi API lỗi thay vì `console.error` thầm lặng | 2 | ✅ Done | @Senior_Dev |
| LT-309 | **Trọng thứ truyền thống (Seniority Index)**: Bổ sung trường `seniority_index`, nâng cấp thuật toán sắp xếp (Nam > Thứ bậc > Tuổi) | 5 | ✅ Done | @Antigravity |
| **LT-310** | **[Feature] Hệ thống Ngày sinh kép (Dual-date System)**: Bổ sung `birth_date_lunar`, helper `getDisplayBirthDate`, cập nhật Form và hiển thị | 5 | ✅ Done | @Senior_Dev |

---

## 2. CHIẾN LƯỢC THỰC HIỆN

### Nhóm UX (LT-302, LT-303)
- Song song vì tác động trực tiếp đến `App.tsx` và cấu trúc layout.
- Đưa Form vào Modal để sửa thông tin ngay khi đang xem phả đồ mà không bị mất context.

### Nhóm Refactoring Architecture (LT-305 → LT-308) — Do @Senior_Dev thực hiện theo đúng thứ tự
> ⚠️ **Làm tuần tự, không làm song song.** Vì mỗi task phụ thuộc task trước.

1. **LT-305 trước tiên** — Config Layer là nền tảng, các task còn lại đều dùng.
2. **LT-306 tiếp theo** — Dùng Config Layer đã tạo, tách logic ra Application Layer.
3. **LT-307 sau** — Wrap bằng Custom Hook, component trở nên sạch.
4. **LT-308 cuối** — Thêm error UI vào hook vừa tạo.

---

## 3. DEFINITION OF DONE (DoD) SPRINT 3
- [x] Truy cập trực tiếp link `/tree` hoặc `/members` trên trình duyệt vẫn hoạt động.
- [x] Nhấn "Thêm/Sửa" hiện Popup ở giữa màn hình, giữ nguyên nền trang cũ.
- [x] Nút Edit trên phả đồ mở Modal ngay tại chỗ.
- [x] Có giao diện xem Phả ký hiển thị đúng tông ty, đời thứ, danh xưng Nhất/Nhị Lang - Nương.
- [x] Không còn magic number/string trong code — mọi config phải nằm ở `src/shared/`.
- [x] `AncestryBook.tsx` chỉ còn JSX thuần, không chứa business logic.
- [x] Hiển thị UI error message khi không tải được dữ liệu.
- [x] Thứ tự hiển thị trong Sách gia phả và Cây gia phả tuân thủ đúng: Nam > Thứ bậc (Index) > Tuổi.
- [x] Quy tắc "Phu phụ tương tùy": Vợ luôn đứng cạnh chồng trong danh sách thành viên.
- [x] Trường `birth_date_lunar` hoạt động: nhập được trong Form, hiển thị ưu tiên trong Phả ký.

---

## 4. GHI CHÚ TECH LEAD
> **Cập nhật ngày 24/02/2026 (Nightly):** Task LT-309 đã hoàn thành xuất sắc. Hệ thống sắp xếp hiện tại không chỉ dựa trên thông tin kỹ thuật (ID, Date) mà còn phản ánh chính xác cấu trúc gia đình truyền thống (Unit-based sorting). Việc hiển thị Vợ cạnh Chồng giúp giao diện Danh sách thành viên (Contact Directory) có tính nhân văn và dễ tra cứu hơn nhiều. Ready for Demo!

---

> **Code Review ngày 24/02/2026:** Senior Dev đã vi phạm Clean Architecture nguyên tắc khi nhét toàn bộ business logic (`processBook`, `rankLabel`, `priorityScore`) vào Presentation Layer. Các magic strings và numbers phải được externalize ra config. Các task LT-305~LT-308 là **Tech Debt phải trả ngay trong Sprint này**.

---

> ### 📋 REVIEW & TASK SPEC — LT-310: Dual-date System (Ngày 25/02/2026)
> **Tech Lead Note dành cho @Senior_Dev:**
>
> BA đã chốt yêu cầu: Hệ thống cần hỗ trợ 2 loại ngày sinh song song. Dưới đây là kết quả review code và chi tiết từng file cần sửa:
>
> **Hiện trạng sau review:**
> - ✅ `src/domain/profiles/Profile.ts` — Đã có `birth_date_lunar?: string | null`. **Không cần sửa.**
> - ⚠️ `src/shared/genealogy/GenealogyConfig.ts` — Cần thêm helper function `getDisplayBirthDate()` ở đây.
> - ⚠️ `src/presentation/components/ProfileForm.tsx` — Form chưa có field nhập `birth_date_lunar`.
> - ⚠️ `src/presentation/components/AncestryBook.tsx` — Đang hardcode `child.birth_date`, `unit.head.birth_date`, `partner.birth_date`. Cần dùng helper.
> - ⚠️ `src/presentation/components/ProfileList.tsx` — Đang hardcode `profile.birth_date`. Cần dùng helper.
> - ℹ️ `src/application/genealogy-use-cases/ProcessAncestryBook.ts` — Hàm `sortProfilesByTraditionalSeniority` và `getYearFromDate` chỉ dùng `birth_date` để tính toán. **ĐÚNG, không sửa.** (Âm lịch text không parse được năm — đây là chủ ý)
>
> **Chi tiết task cho @Senior_Dev:**
>
> **[B1] `GenealogyConfig.ts` — Thêm helper function:**
> ```typescript
> // Thêm import ở đầu file:
> import type { Profile } from '../../domain/profiles/Profile';
>
> // Thêm vào cuối file:
> export type BirthDateDisplay = {
>     value: string;
>     type: 'lunar' | 'solar';
>     label: string; // "Âm lịch" or "Dương lịch"
> };
>
> export function getDisplayBirthDate(
>     profile: Pick<Profile, 'birth_date' | 'birth_date_lunar'>
> ): BirthDateDisplay | null {
>     if (profile.birth_date_lunar) {
>         return { value: profile.birth_date_lunar, type: 'lunar', label: 'Âm lịch' };
>     }
>     if (profile.birth_date) {
>         return { value: profile.birth_date, type: 'solar', label: 'Dương lịch' };
>     }
>     return null;
> }
> ```
>
> **[B2] `ProfileForm.tsx` — Thêm field nhập Âm lịch:**
> - Thêm `birth_date_lunar: null` vào `initialFormState`.
> - Populate `birth_date_lunar: initialData.birth_date_lunar || null` trong `useEffect` edit mode.
> - Thêm `<input type="text">` cho `birth_date_lunar` đặt **ngay bên dưới** field `birth_date` (Dương lịch) với placeholder ví dụ: `"VD: 15/4 Giáp Ngọ"`. Label: **"Ngày sinh Âm lịch (Nếu có)"**.
> - Trong `handleSubmit`, truyền `birth_date_lunar` vào payload.
>
> **[B3] `AncestryBook.tsx` — Dùng helper thay vì hardcode:**
> - Import `getDisplayBirthDate` từ `GenealogyConfig`.
> - Tại các chỗ hiển thị `{unit.head.birth_date}`, `{partner.birth_date}`, `{child.birth_date}`: thay bằng logic gọi `getDisplayBirthDate(person)` và render `display.value` kèm badge nhỏ `display.label` nếu cần phân biệt.
> - Cụ thể: nếu `type === 'lunar'` thì có thể thêm chú thích nhỏ `(Âm)` bên cạnh, còn `type === 'solar'` thì không cần chú thích.
>
> **[B4] `ProfileList.tsx` — Dùng helper thay vì hardcode:**
> - Import `getDisplayBirthDate`.
> - Tại dòng `{profile.birth_date || ''}`: thay bằng render dùng `getDisplayBirthDate(profile)?.value || ''`.
>
> **[B5] DB Migration — Chạy trên Supabase SQL Editor:**
> ```sql
> ALTER TABLE public.profiles
> ADD COLUMN birth_date_lunar TEXT;
>
> COMMENT ON COLUMN public.profiles.birth_date_lunar
> IS 'Ngày sinh Âm lịch (nhập tay tự do, VD: 15/4 Giáp Ngọ). Ưu tiên hiển thị trong Phả ký.';
> ```
>
> **Không được làm:** Tuyệt đối KHÔNG sửa hàm `getYearFromDate` hay `sortProfilesByTraditionalSeniority`. Hai hàm này chỉ cần `birth_date` (Dương lịch ISO) để so sánh năm — đây là đúng thiết kế.

---
*Biên bản này được cập nhật bởi Tech Lead vào ngày 25/02/2026.*
