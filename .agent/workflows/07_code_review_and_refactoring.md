---
description: Quy trình Tech Lead review code và dọn dẹp Tech Debt
---
# 07. Code Review & Refactoring Workflow

Quy trình kiểm soát chất lượng: `@Tech_Lead` review code mà `@Senior_Dev` đã hoàn thành, đối chiếu với Requirements và Task Spec.

---

## ⚠️ QUY TẮC BẮT BUỘC

> **INPUT:** Các task có Status `✅` (Dev claim đã xong) trong `sprint_XX_tasks.md`.
> **OUTPUT:**
> - Nếu **PASS** → Giữ `✅` + thêm note `(Approved by @Tech_Lead)` bên cạnh.
> - Nếu **FAIL** → Đổi `✅` ngược lại thành `🔲` + ghi rõ lý do reject.
>
> `@Tech_Lead` **BẮT BUỘC** phải đối chiếu code với 3 nguồn trước khi approve:
> 1. `management/01_Requirements_n_Contracts/01_LegacyTree_Requirements.md` — Acceptance Criteria gốc
> 2. `management/03_Agile_Sprints/Sprint_XX/sprint_XX_tasks.md` — Tech spec chi tiết
> 3. `.agent/templates/09_standard_clean_architecture.md` — Kiến trúc chuẩn

---

### Bước 1: Xác định task cần review

- [ ] **Mở Sprint Task Board**
  - Mở `management/03_Agile_Sprints/Sprint_XX/sprint_XX_tasks.md`
  - Tìm tất cả sub-tasks có Status `✅` mà **CHƯA có note `(Approved)`**.
  - Đây là danh sách task cần review.

---

### Bước 2: Review Code — Đối chiếu 3 nguồn

Với **mỗi task** cần review, thực hiện 3 bước kiểm tra sau:

- [ ] **2a. Kiểm tra Acceptance Criteria (Requirements)**
  - Mở `01_LegacyTree_Requirements.md`, tìm section liên quan.
  - Đối chiếu từng Acceptance Criteria:
    - [ ] Tính năng hoạt động đúng theo mô tả?
    - [ ] Không thiếu edge case nào ghi trong Requirements?
    - [ ] Phân quyền đúng? (Admin only / Public / Contributor)

- [ ] **2b. Kiểm tra Tech Spec (Task Board)**
  - Mở `sprint_XX_tasks.md`, tìm hướng dẫn kỹ thuật của task.
  - Đối chiếu:
    - [ ] Code đúng file được chỉ định?
    - [ ] Pattern code đúng như Tech Spec khuyến nghị?
    - [ ] Không có scope creep (làm thêm thứ không có trong task)?

- [ ] **2c. Kiểm tra Clean Architecture**
  - Đối chiếu với `.agent/templates/09_standard_clean_architecture.md`:
    - [ ] File đặt đúng layer? (Domain / Application / Infrastructure / Presentation)
    - [ ] Import dùng path alias? (không có `../../../../`)
    - [ ] Presentation layer tách đúng? (Page / Component / Hook)
    - [ ] Không vi phạm Dependency Rule? (layer thấp không import layer cao)

- [ ] **2d. Kiểm tra kỹ thuật chung**
  - [ ] Không dùng `any` type.
  - [ ] Không có code smell (file >300 dòng, function >50 dòng, nested callbacks >3 levels).
  - [ ] Build pass: `npx vite build` → 0 errors.
  - [ ] Tests pass (nếu có).

---

### Bước 3: Phán quyết ← *Output bắt buộc*

#### ✅ Nếu PASS tất cả checklist ở Bước 2:

- [ ] **Approve task**
  - Trong `sprint_XX_tasks.md`, giữ `✅` và thêm note:
    ```
    | ... | ✅ Approved |
    ```
  - Nếu toàn bộ sub-tasks của ticket cha đã `✅ Approved` → cập nhật ticket cha thành Done trong bảng TIẾN ĐỘ TỔNG QUAN.

#### ❌ Nếu FAIL bất kỳ checklist nào ở Bước 2:

- [ ] **Reject task**
  - Trong `sprint_XX_tasks.md`, đổi `✅` ngược lại thành `🔲`:
    ```
    | ... | 🔲 Rejected |
    ```
  - Thêm comment ngay dưới bảng sub-tasks giải thích lý do reject:
    ```
    > **[REJECTED by @Tech_Lead — DD/MM/YYYY]**
    > Task X.Y: [Lý do cụ thể, ví dụ: "Vi phạm Clean Architecture — Page gọi thẳng Supabase"]
    > → @Senior_Dev cần fix theo hướng: [gợi ý sửa cụ thể]
    ```
  - `@Senior_Dev` phải quay lại workflow `/06` để fix task bị reject.

---

### Bước 4: Tái cấu trúc (Refactoring) — Nếu cần

- [ ] **Dọn dẹp Tech Debt phát sinh trong Sprint**
  - Nếu review phát hiện code smell hoặc pattern sai nhưng không critical:
    - Ghi thành ticket Tech Debt mới trong `product_backlog.md`.
    - KHÔNG block approve task hiện tại nếu tính năng hoạt động đúng.
  - Nếu phát hiện bug hoặc vi phạm bảo mật:
    - PHẢI reject và yêu cầu fix ngay.

---

### Bước 5: Báo cáo Review

- [ ] **Tổng kết kết quả review**
  - Sau khi review xong tất cả tasks `✅`, báo cáo ngắn gọn:
    - Bao nhiêu tasks Approved / Rejected.
    - Lý do reject (nếu có).
    - Tech Debt mới phát sinh (nếu có).
