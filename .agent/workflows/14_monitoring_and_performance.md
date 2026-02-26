---
description: Theo dõi sức khỏe Server, tối ưu Query chậm
---
# 14. Monitoring & Performance Workflow

Quy trình duy trì sự ổn định bền bỉ của hệ thống ERP khi số lượng dữ liệu và người dùng tăng cao.

### Bước 1: Giám sát Hệ thống (Monitoring)
- [ ] **Setup Dashboard theo dõi**
  - `@Tech_Lead` cấu hình các công cụ (như Grafana/Prometheus) để theo dõi CPU, RAM, Disk.
  - *Lệnh mẫu:* `@Tech_Lead /brainstorm Thiết lập danh sách các chỉ số cần theo dõi (Latency, Throughput, Error Rate) cho hệ thống ERP Odoo.`

### Bước 2: Phát hiện Cảnh báo (Alerting)
- [ ] **Cấu hình Notification**
  - Thiết lập cảnh báo gửi về Telegram/Slack của team kỹ thuật khi server có dấu hiệu quá tải hoặc sập.

### Bước 3: Tối ưu hiệu năng (Tuning)
- [ ] **Phân tích Query chậm (Slow Queries)**
  - Định kỳ `@Senior_Dev` rà soát log database để tối ưu các đoạn SQL gây lag hệ thống.
- [ ] **Cải thiện Cache**
  - `@Tech_Lead` cấu hình Redis hoặc các tầng cache để tăng tốc độ phản hồi cho người dùng.

### Bước 4: Review sức khỏe định kỳ
- [ ] **Báo cáo Performance**
  - `@QA` và `@Tech_Lead` xuất báo cáo hàng tháng về độ ổn định và tốc độ của hệ thống.
