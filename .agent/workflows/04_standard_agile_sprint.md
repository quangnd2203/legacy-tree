---
description: Quy trình lặp Sprint chuẩn (Agile/Scrum) — lập kế hoạch và theo dõi tiến độ
---
# 04. Standard Agile Sprint Workflow

Quy trình vận hành hàng tuần/hàng tháng để duy trì tốc độ phát triển và sự linh hoạt trước thay đổi.

---

## ⚠️ QUY TẮC BẮT BUỘC

> **OUTPUT DUY NHẤT của workflow này là cập nhật tài liệu Sprint trong thư mục `management/03_Agile_Sprints/`.**
> - ✅ Được phép: Đặt câu hỏi, phân tích tiến độ, đánh giá tình trạng ticket, tư vấn ưu tiên.
> - ✅ Được phép: Tạo/chỉnh sửa file `.md` trong `management/03_Agile_Sprints/` và `management/04_Product_Backlog/`.
> - ❌ **CẤM TUYỆT ĐỐI:** Viết code, chỉnh sửa file `.ts`, `.tsx`, `.css`, hoặc bất kỳ file source nào.
> - ❌ **CẤM TUYỆT ĐỐI:** Chạy lệnh terminal (trừ `git` để commit docs).
>
> Mọi quyết định về ticket và tiến độ phải được ghi vào đúng biên bản Sprint trước khi kết thúc buổi làm việc.

---

### Bước 1: Sprint Planning (Đầu Sprint) ← *Output bắt buộc*

- [ ] **Chọn tickets từ Product Backlog**
  - Rà soát `management/04_Product_Backlog/product_backlog.md`, chọn ticket ưu tiên cao, phù hợp Velocity.
  - Xác nhận Story Points và thứ tự thực hiện (Dependencies).
- [ ] **Tạo biên bản Sprint Planning** ← *File output*
  - Tạo file mới: `management/03_Agile_Sprints/Sprint_XX/plan_n_review/sprint_XX_planning.md`
  - Dùng template: `.agent/templates/02_sprint_planning_meeting.md`
  - Nội dung bắt buộc phải có: Sprint Goal, Sprint Backlog (bảng ticket + SP + Status), Dependencies, Risks, Definition of Done.

---

### Bước 2: Backlog Refinement (Giữa Sprint)

- [ ] **Làm rõ yêu cầu các ticket chưa rõ**
  - Rà soát từng ticket trong Sprint Backlog hiện tại.
  - Bổ sung Acceptance Criteria còn thiếu vào biên bản Planning hoặc Requirements nếu cần.
  - **Không thêm ticket mới giữa Sprint** nếu không có lý do khẩn cấp (scope creep).

---

### Bước 3: Kiểm tra Sprint (Định kỳ / Khi được gọi)

- [ ] **Đánh giá tiến độ**
  - So sánh trạng thái thực tế của source code với Sprint Backlog đã cam kết.
  - Cập nhật cột `Status` trong bảng Sprint Backlog (Todo / In Progress / Done / Blocked).
  - Ghi nhận Blocker nếu có vào: `.agent/templates/03_daily_standup_note.md`

---

### Bước 4: Sprint Review (Cuối Sprint) ← *Output bắt buộc*

- [ ] **Tổng kết Sprint**
  - Scan source code, chạy tests, chạy build để lấy số liệu thực tế.
  - Đối chiếu với Definition of Done đã cam kết đầu Sprint.
- [ ] **Tạo biên bản Sprint Review** ← *File output*
  - Tạo file mới: `management/03_Agile_Sprints/Sprint_XX/plan_n_review/sprint_XX_review.md`
  - Dùng template: `.agent/templates/04_sprint_review_meeting.md`
  - Nội dung bắt buộc: Tổng kết SP (kế hoạch vs thực tế), trạng thái từng ticket có bằng chứng, kiểm tra DoD, nhận xét kỹ thuật.
- [ ] **Cập nhật Product Backlog**
  - Đánh dấu Done / Rollover các ticket tương ứng trong `product_backlog.md`.

---

### Bước 5: Sprint Retrospective (Cuối Sprint)

- [ ] **Rút kinh nghiệm quy trình**
  - Ghi nhận những gì làm tốt, những gì cần cải thiện, action items cho Sprint sau.
  - Tạo file: `management/03_Agile_Sprints/Sprint_XX/plan_n_review/sprint_XX_retrospective.md`
  - Dùng template: `.agent/templates/05_sprint_retrospective_meeting.md`
