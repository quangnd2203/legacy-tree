---
description: Quy trình khảo sát, Discovery và cập nhật Requirements cho dự án
---
# 01. Pre-sales & Discovery Workflow

Quy trình này giúp team xác định nhu cầu thực tế của khách hàng và ghi lại chúng thành tài liệu Requirements chính thức.

---

## ⚠️ QUY TẮC BẮT BUỘC

> **OUTPUT DUY NHẤT của workflow này là cập nhật tài liệu Requirements.**
> - ✅ Được phép: Đặt câu hỏi, phân tích, tư vấn, thảo luận scope.
> - ✅ Được phép: Chỉnh sửa file `.md` trong thư mục `management/`.
> - ❌ **CẤM TUYỆT ĐỐI:** Viết code, chỉnh sửa file `.ts`, `.tsx`, `.css`, hoặc bất kỳ file source nào.
> - ❌ **CẤM TUYỆT ĐỐI:** Chạy lệnh terminal (trừ `git` để commit docs).
>
> Mọi quyết định sau buổi Discovery phải được ghi vào **`01_LegacyTree_Requirements.md`** và **`product_backlog.md`** trước khi chuyển sang workflow khác.

---

### Giai đoạn 1: Khảo sát & Phân tích (Discovery)

- [ ] **Bước 1: Đặt câu hỏi khảo sát**
  - Tư vấn và đặt câu hỏi để hiểu rõ nhu cầu thực tế, không giả định.
  - *Ví dụ:* "Tính năng X — ai sẽ dùng? Dùng để làm gì? Dùng bao nhiêu lần/tuần?"

- [ ] **Bước 2: Phân tích Pain Points & Quyết định Scope**
  - Tổng hợp những gì đã nghe, đề xuất nên làm / không nên làm và lý do.
  - Đưa ra khuyến nghị rõ ràng: In / Out / Defer.

### Giai đoạn 2: Ghi lại Quyết định (Documentation)

- [ ] **Bước 3: Cập nhật Requirements** ← *Output bắt buộc*
  - Cập nhật `management/01_Requirements_n_Contracts/01_LegacyTree_Requirements.md`:
    - Thêm section mới cho tính năng được chốt (với Acceptance Criteria đầy đủ).
    - Đánh dấu **REMOVED/DESCOPED** cho tính năng bị loại bỏ (không xóa — để lại lịch sử).
  - Ghi rõ ngày quyết định và lý do.

- [ ] **Bước 4: Cập nhật Product Backlog** ← *Output bắt buộc*
  - Cập nhật `management/04_Product_Backlog/product_backlog.md`:
    - Thêm ticket mới với Story Points ước tính.
    - Đánh dấu ticket bị hủy là `~~Cancelled~~` với lý do.
  - Gán Milestone (Sprint dự kiến) cho từng ticket mới.

### Giai đoạn 3: Bàn giao sang Sprint Planning

- [ ] **Bước 5: Chuyển giao**
  - Xác nhận Requirements và Backlog đã cập nhật đầy đủ.
  - Thông báo cho team chuyển sang workflow `/04_standard_agile_sprint` để lập Sprint Planning.
