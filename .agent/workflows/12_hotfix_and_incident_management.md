---
description: Xử lý bug Production khẩn cấp (Hotfix)
---
# 12. Hotfix & Incident Management Workflow

Quy trình phản ứng nhanh khi có lỗi nghiêm trọng xảy ra trên hệ thống thực tế (Production) của khách hàng.

### Bước 1: Tiếp nhận Sự cố (Incident Detection)
- [ ] **Xác định mức độ nghiêm trọng (Priority)**
  - `@Managing_Director_PM` đánh giá xem đây là lỗi P0 (Server sập, mất data) hay P1 (Tính năng core lỗi).
  - *Lệnh mẫu:* `@Managing_Director_PM /brainstorm Đề xuất kế hoạch ứng phó khẩn cấp khi hệ thống thanh toán của khách hàng ERP bị treo.`

### Bước 2: Phân tích & Khắc phục (Troubleshooting)
- [ ] **Tìm nguyên nhân gốc (Root Cause)**
  - `@Tech_Lead` rà soát log và mã nguồn để tìm bug.
- [ ] **Triển khai Hotfix**
  - `@Senior_Dev` viết code fix lỗi ngay trên branch Hotfix (không chờ Sprint kết thúc).

### Bước 3: Kiểm tra nhanh (Sanity Check)
- [ ] **Kiểm thử khẩn cấp**
  - `@QA` ưu tiên kiểm tra bản fix này ngay lập tức để đảm bảo không gãy các luồng khác.

### Bước 4: Deploy & Post-mortem
- [ ] **Đẩy bản fix lên Production**
  - `@Tech_Lead` thực hiện deploy chớp nhoáng (Fast-track release).
- [ ] **Họp rút kinh nghiệm**
  - Team họp để tìm cách ngăn chặn lỗi này tái diễn trong tương lai.
  - *Hành động (Action):* "Mổ xẻ" hoàn toàn không đổ lỗi dựa trên mẫu: `../templates/06_incident_post_mortem_report.md`.
