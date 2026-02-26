---
description: Tự động hóa Deploy, quản lý Docker/Kubernetes
---
# 13. DevOps & CI/CD Workflow

Quy trình tự động hóa việc đưa mã nguồn từ máy của lập trình viên lên các môi trường vận hành thực tế.

### Bước 1: Build & Package
- [ ] **Dockerization**
  - `@Tech_Lead` đảm bảo ứng dụng được đóng gói vào các Docker Container để chạy đồng nhất trên mọi môi trường.

### Bước 2: Liên tục Tích hợp (CI)
- [ ] **Chạy Automated Pipeline**
  - Hệ thống tự động chạy lint, build và tests mỗi khi có PR mới.
  - *Lệnh mẫu:* `@Tech_Lead /write Hãy soạn thảo file cấu hình Docker Compose để triển khai bộ Odoo kèm Database PostgreSQL.`

### Bước 3: Liên tục Triển khai (CD)
- [ ] **Deploy to Staging**
  - Tự động đẩy code lên môi trường test nội bộ sau khi merge vào branch Develop.
- [ ] **Deploy to Production**
  - Thực hiện lệnh deploy (có thể thủ công hoặc tự động) lên môi trường thực tế sau khi đã qua bước UAT.

### Bước 4: Infrastructure as Code (IaC)
- [ ] **Quản lý hạ tầng**
  - `@Tech_Lead` sử dụng script để quản lý server (như Terraform/Ansible) để dễ dàng nâng cấp hoặc scale hệ thống.
