---
description: Quy trình chuyển đổi dữ liệu từ hệ thống cũ sang Odoo/ERP mới
---
# 09. Data Migration & ETL Workflow

Quy trình cực kỳ quan trọng để đảm bảo tính toàn vẹn của dữ liệu khi chuyển sang hệ thống ERP mới.

### Bước 1: Trích xuất (Extract)
- [ ] **Khảo sát cấu trúc dữ liệu cũ**
  - `@BA` và `@Tech_Lead` thực hiện map dữ liệu từ hệ thống cũ (Excel, phần mềm cũ) sang hệ thống mới.
- [ ] **Lấy dữ liệu thô**
  - `@Senior_Dev` viết script trích xuất dữ liệu.

### Bước 2: Chuyển đổi (Transform)
- [ ] **Làm sạch dữ liệu (Data Cleaning)**
  - Loại bỏ các bản ghi trùng lặp, chuẩn hóa định dạng (Số điện thoại, địa chỉ).
  - *Lệnh mẫu:* `@Senior_Dev /write Hãy viết một script Python để chuẩn hóa danh sách 10.000 khách hàng từ file CSV cũ.`

### Bước 3: Nạp dữ liệu (Load)
- [ ] **Import thử nghiệm**
  - Thực hiện nạp dữ liệu vào môi trường Staging/UAT để kiểm tra lỗi.
- [ ] **Import chính thức**
  - Thực hiện nạp vào môi trường Production sau khi đã được phê duyệt.

### Bước 4: Kiểm tra sau Migration
- [ ] **Đối soát số liệu**
  - `@QA` và `@BA` kiểm tra xem tổng số tiền, số lượng tồn kho có khớp giữa hệ thống cũ và mới không.
