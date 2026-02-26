---
description: Thiết kế kiến trúc hệ thống và chốt Tech Stack
---
# 02. Architecture & Tech Stack Workflow

Quy trình thiết kế "xương sống" cho hệ thống ERP để đảm bảo tính ổn định và khả năng mở rộng.

### Bước 1: Quyết định Tech Stack
- [ ] **Xác định công nghệ cốt lõi**
  - Gọi `@Tech_Lead` để chốt Framework (Flutter, Odoo version, Database type).
  - *Lệnh mẫu:* `@Tech_Lead /brainstorm Phân tích ưu nhược điểm của việc dùng Odoo 17 so với 16 cho dự án ERP quy mô 500 nhân sự.`

### Bước 2: Thiết kế High-level Architecture
- [ ] **Vẽ sơ đồ luồng dữ liệu**
  - `@Tech_Lead` thiết kế cách các module (Kho, Kế toán, Nhân sự) tương tác với nhau.
- [ ] **Thiết kế Database Schema**
  - `@Tech_Lead` phối hợp với `@BA` để chốt các bảng dữ liệu quan trọng.

### Bước 3: Định hình UI/UX Concept
- [ ] **Xác định Design System**
  - Gọi `@Designer` để chốt phong cách giao diện (Colors, Typography).
  - *Lệnh mẫu:* `@Designer /brainstorm Đề xuất phong cách UI Enterprise hiện đại, chuyên nghiệp cho Super App quản trị doanh nghiệp.`

### Bước 4: Chốt Technical Guideline
- [ ] **Thiết lập quy chuẩn Coding**
- [ ] **Kiểm soát cấu trúc dự án**
  - `@Tech_Lead` đảm bảo không có dự án lồng nhau (Nested projects) và toàn bộ dependencies nằm ở root.
  - *Hành động (Action):* Tham khảo và áp dụng cấu trúc mẫu tại: `../templates/09_standard_clean_architecture.md`.
