---
description: Kiểm tra bảo mật và quyền truy cập dữ liệu ERP
---
# 08. Security & Compliance Audit Workflow

Quy trình bảo vệ dữ liệu nhạy cảm của doanh nghiệp trước các rủi ro bảo mật.

### Bước 1: Kiểm tra Phân quyền (RBAC)
- [ ] **Review quyền truy cập**
  - `@BA` và `@Tech_Lead` cùng kiểm tra xem các Role (Kế toán, Nhân viên, Quản lý) đã được phân quyền đúng module chưa.
  - *Lệnh mẫu:* `@BA /brainstorm Phân tích danh sách các chức năng nhạy cảm mà nhân viên Kho không được phép truy cập trong hệ thống ERP.`

### Bước 2: Quét lỗ hổng (Vulnerability Scan)
- [ ] **Kiểm tra bảo mật code**
  - Gọi `@Tech_Lead` sử dụng công cụ hoặc script để quét lỗi SQL Injection, XSS...

### Bước 3: Bảo mật dữ liệu nhạy cảm
- [ ] **Encryption & Masking**
  - Kiểm tra xem thông tin lương, dữ liệu khách hàng đã được mã hóa trong DB chưa.

### Bước 4: Báo cáo Compliance (Tuân thủ)
- [ ] **Xuất báo cáo bảo mật**
  - `@QA` soạn thảo báo cáo về các rủi ro bảo mật đã tìm thấy và trạng thái khắc phục.
