---
description: Quy trình lập trình tính năng và đẩy Pull Request
---
# 06. Feature Development & PR Workflow

Quy trình chi tiết cho `@Senior_Dev` nhận task, code, và đánh dấu hoàn thành.

---

## ⚠️ QUY TẮC BẮT BUỘC

> **INPUT:** Các task được define trong file `sprint_XX_tasks.md` của Sprint hiện tại.
> **OUTPUT:** Code hoàn chỉnh + đánh dấu ✅ vào task board.
>
> `@Senior_Dev` **BẮT BUỘC** phải đọc 3 tài liệu trước khi viết bất kỳ dòng code nào:
> 1. `management/01_Requirements_n_Contracts/01_LegacyTree_Requirements.md` — Yêu cầu gốc
> 2. `management/03_Agile_Sprints/Sprint_XX/sprint_XX_tasks.md` — Tech spec + sub-tasks chi tiết
> 3. `management/03_Agile_Sprints/Sprint_XX/plan_n_review/sprint_XX_planning.md` — Sprint Goal + DoD
>
> Không được code "mò" — phải có task ID rõ ràng trước khi bắt đầu.

---

### Bước 1: Tiếp nhận Task

- [ ] **Đọc task từ Sprint Task Board**
  - Mở `management/03_Agile_Sprints/Sprint_XX/sprint_XX_tasks.md`
  - Xác định task ID cần làm (ví dụ: `LT-1002.1`, `LT-601.3`...)
  - Đọc mô tả, file cần chỉnh, và hướng dẫn kỹ thuật (Tech Spec) của task đó.

- [ ] **Đọc Requirements liên quan**
  - Mở `management/01_Requirements_n_Contracts/01_LegacyTree_Requirements.md`
  - Tìm đúng section liên quan đến ticket cha (ví dụ: section 3.7 cho Bản tin)
  - Đọc Acceptance Criteria — đây là tiêu chuẩn "xong" của task.

- [ ] **Đọc Sprint Planning**
  - Mở `management/03_Agile_Sprints/Sprint_XX/plan_n_review/sprint_XX_planning.md`
  - Xác nhận Dependencies — task này có phụ thuộc task nào khác chưa xong không?
  - Xác nhận Definition of Done (DoD) tổng thể của Sprint.

---

### Bước 2: Viết mã nguồn (Coding)

- [ ] **Thực hiện code theo đúng Tech Spec**
  - Code theo hướng dẫn kỹ thuật trong `sprint_XX_tasks.md`.
  - Tuân thủ cấu trúc Clean Architecture: `.agent/templates/09_standard_clean_architecture.md`
  - Nếu gặp blocker hoặc phát sinh scope: DỪNG và báo cáo, không tự thêm scope.

- [ ] **Viết Test (nếu task yêu cầu)**
  - Theo DoD trong Sprint Planning — kiểm tra có yêu cầu test không.
  - Chạy `npx vitest` hoặc lệnh test tương ứng.

- [ ] **Build verify**
  - Chạy `npx vite build` — phải pass 0 errors.
  - Nếu build fail, FIX trước khi đánh dấu hoàn thành.

---

### Bước 3: Đánh dấu hoàn thành ← *Output bắt buộc*

- [ ] **Tick ✅ sub-task trong Sprint Task Board**
  - Mở `management/03_Agile_Sprints/Sprint_XX/sprint_XX_tasks.md`
  - Tìm đúng sub-task vừa hoàn thành.
  - Đổi `🔲` thành `✅` trong cột Status.
  - **CHỈ tick sub-task mình vừa làm** — không tick sub-task chưa làm.

- [ ] **Nếu tất cả sub-tasks của 1 ticket đã ✅ → Tick ticket cha**
  - Cập nhật Status của ticket cha trong bảng TIẾN ĐỘ TỔNG QUAN.

> **LƯU Ý:** `✅` ở đây chỉ là "Dev claim đã xong" — chưa phải "Approved".
> `@Tech_Lead` sẽ review và xác nhận hoặc revert trong workflow `/06`.

---

### Bước 4: Tự kiểm tra (Self-review)

- [ ] **Đọc lại code vừa viết**
  - Soát lỗi typo, `any` type, import thừa.
  - Đối chiếu với Acceptance Criteria trong Requirements.
  - Nếu phát hiện lỗi → fix ngay TRƯỚC khi chuyển sang `/07`.
