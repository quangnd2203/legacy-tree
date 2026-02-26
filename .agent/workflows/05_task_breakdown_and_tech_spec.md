---
description: Phân tích kỹ thuật backlog/task, tách sub-tasks, viết Tech Spec, và quản lý Sprint Task Board
---
# 05. Task Breakdown & Tech Spec Workflow

Quy trình để `@Tech_Lead` nhận các ticket từ Backlog hoặc Sprint Planning, phân tích kỹ thuật chi tiết, tách thành sub-tasks có hướng dẫn cụ thể, và cập nhật vào Sprint Task Board.

---

## ⚠️ QUY TẮC BẮT BUỘC

> **INPUT:** Một hoặc nhiều ticket ID từ `product_backlog.md` hoặc `sprint_XX_planning.md`.
> **OUTPUT DUY NHẤT:** Cập nhật file `sprint_XX_tasks.md` trong thư mục Sprint hiện tại.
>
> - ✅ Được phép: Đọc code (view_file, grep_search) để phân tích kiến trúc hiện tại.
> - ✅ Được phép: Tạo/chỉnh sửa file `.md` trong `management/03_Agile_Sprints/` và `management/04_Product_Backlog/`.
> - ❌ **CẤM TUYỆT ĐỐI:** Viết code, chỉnh sửa file source (`.ts`, `.tsx`, `.css`).
> - ❌ **CẤM TUYỆT ĐỐI:** Chạy lệnh terminal.
>
> Mục tiêu: Dev nhận task xong là **biết ngay phải sửa file nào, pattern nào, viết gì** — không cần tự mò.

---

### Bước 1: Thu thập Context — Đọc trước khi phân tích

- [ ] **Đọc Requirements**
  - Mở `management/01_Requirements_n_Contracts/01_LegacyTree_Requirements.md`
  - Tìm section liên quan đến ticket, đọc Acceptance Criteria.

- [ ] **Đọc Sprint Planning**
  - Mở `management/03_Agile_Sprints/Sprint_XX/plan_n_review/sprint_XX_planning.md`
  - Xác nhận Sprint Goal, DoD, Dependencies.

- [ ] **Scan source code liên quan**
  - Dùng `view_file`, `view_file_outline`, `grep_search` để hiểu cấu trúc hiện tại.
  - Xác định file nào cần sửa, logic nào cần thay đổi.
  - Ghi nhận: tên file, số dòng hiện tại, hàm/component liên quan.

---

### Bước 2: Phân tích Kỹ thuật (Tech Analysis)

Với **mỗi ticket**, thực hiện 3 bước:

- [ ] **2a. Xác định Scope**
  - Ticket này ảnh hưởng bao nhiêu files?
  - Có cần thêm file mới không?
  - Có dependency nào với ticket khác không?

- [ ] **2b. Phân tích Giải pháp**
  - Pattern nào phù hợp? (Component composition, Route guard, RLS policy...)
  - Có thư viện/API nào cần dùng?
  - Edge cases cần xử lý?

- [ ] **2c. Estimate lại SP (nếu cần)**
  - Sau khi phân tích, nếu SP ban đầu không hợp lý → đề xuất điều chỉnh.
  - Ghi lý do điều chỉnh.

---

### Bước 3: Tách Sub-tasks ← *Output chính*

Với **mỗi ticket**, tạo danh sách sub-tasks theo format chuẩn:

```markdown
## [Icon] LT-XXX: [Tên ticket] ([SP] SP)

> **Mục tiêu:** [Mô tả ngắn gọn]

### Các sub-tasks

| # | Task | File | Status |
|---|---|---|---|
| X.1 | [Mô tả cụ thể — Dev đọc là biết phải làm gì] | `[đường dẫn file]` | 🔲 |
| X.2 | ... | ... | 🔲 |
| X.N | Build verify → 0 errors | Terminal | 🔲 |
| X.N+1 | Manual test: [kịch bản test cụ thể] | Browser | 🔲 |

### Hướng dẫn kỹ thuật

**[Giải thích root cause / approach]**

\```[language]
// Code mẫu / pseudo-code
// KHÔNG phải code hoàn chỉnh — chỉ là hướng dẫn pattern
\```

**Lưu ý:**
- [Edge case 1]
- [Edge case 2]
```

**Quy tắc tách sub-task:**
1. Mỗi sub-task phải **độc lập build-able** nếu có thể.
2. Sub-task cuối cùng luôn là **Build verify** + **Manual test**.
3. Ghi rõ **file cần sửa** — Dev không phải tự tìm.
4. Ghi rõ **pattern/approach** — Dev không phải tự quyết định kiến trúc.
5. Nếu ticket > 8 SP → BẮT BUỘC tách thành ≥ 5 sub-tasks.

---

### Bước 4: Cập nhật Sprint Task Board ← *File output*

- [ ] **Cập nhật `sprint_XX_tasks.md`**
  - Thêm section mới cho ticket vừa phân tích vào đúng vị trí (theo nhóm).
  - Cập nhật bảng TIẾN ĐỘ TỔNG QUAN nếu có thêm ticket mới.
  - Cập nhật bảng BẢNG THEO DÕI TỔNG HỢP ở cuối file.
  - Cập nhật tổng: sub-tasks, tickets, SP.

- [ ] **Cập nhật `product_backlog.md` (nếu cần)**
  - Nếu ticket mới được thêm giữa Sprint (bug, hotfix) → thêm vào Backlog + ghi lý do.
  - Nếu SP thay đổi → cập nhật trong Backlog.

---

### Bước 5: Báo cáo

- [ ] **Tổng kết phân tích**
  - Bao nhiêu tickets đã breakdown.
  - Tổng sub-tasks mới.
  - Risk hoặc blocker phát hiện (nếu có).
  - SP thay đổi (nếu có).
