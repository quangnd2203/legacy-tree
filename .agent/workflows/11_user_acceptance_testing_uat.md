---
description: Hướng dẫn khách hàng nghiệm thu trên môi trường UAT
---
# 11. User Acceptance Testing (UAT) Workflow

Quy trình dẫn dắt người dùng cuối kiểm tra và xác nhận hệ thống đáp ứng đúng nhu cầu kinh doanh.

### Bước 1: Chuẩn bị môi trường UAT
- [ ] **Làm sạch dữ liệu UAT**
  - `@Tech_Lead` chuẩn bị môi trường giống hệt Production với dữ liệu mẫu chất lượng.

### Bước 2: Hướng dẫn Test (Guided Testing)
- [ ] **Chuẩn bị UAT Scripts**
  - `@BA` soạn thảo các hướng dẫn từng bước để khách hàng thực hiện test.
- [ ] **Tổ chức buổi Test tập trung**
  - `@BA` và `@QA` hỗ trợ khách hàng thao tác và ghi nhận phản hồi.
  - *Lệnh mẫu:* `@BA /write Hãy soạn thảo biên bản nghiệm thu (UAT Sign-off) mẫu cho tính năng Quản lý Nhân sự.`

### Bước 3: Tiếp nhận & Phân loại Phản hồi
- [ ] **Phân biệt Lỗi (Bug) vs Tính năng mới (CR)**
  - `@Managing_Director_PM` phối hợp với `@BA` để xác định yêu cầu nào là lỗi phải fix ngay, yêu cầu nào là tính năng mới cần đưa vào backlog sau.

### Bước 4: Ký duyệt UAT Sign-off
- [ ] **Chốt kết quả nghiệm thu**
  - Khách hàng ký xác nhận hệ thống đã sẵn sàng để Go-live.
