---
description: Quy trình kiểm thử hệ thống nội bộ (System Integration Test)
---
# 10. Quality Assurance SIT Workflow

Quy trình để team QA đảm bảo các module hoạt động trơn tru với nhau trước khi bàn giao cho khách hàng.

### Bước 1: Xây dựng Test Plan
- [ ] **Xác định phạm vi kiểm thử**
  - `@QA` sử dụng kỹ năng `plan` để lên danh sách các kịch bản test tích hợp giữa các phòng ban.
  - *Lệnh mẫu:* `@QA /plan Hãy soạn thảo test plan cho luồng nghiệp vụ từ đơn hàng (Sales) đến xuất kho (Inventory) và hạch toán (Accounting).`

### Bước 2: Thực thi kiểm thử (Testing)
- [ ] **Manual Testing**
  - `@QA` thực hiện test các luồng nghiệp vụ trên trình duyệt.
- [ ] **Automation Testing**
  - Nếu có, chạy các bộ script tự động để kiểm tra hồi quy (Regression test).

### Bước 3: Quản lý lỗi (Bug Management)
- [ ] **Log lỗi & Phân loại**
  - `@QA` tạo các ticket lỗi chi tiết với đầy đủ các bước tái hiện (Steps to reproduce).
- [ ] **Xác nhận sửa lỗi**
  - Sau khi `@Senior_Dev` fix xong, `@QA` thực hiện kiểm tra lại (Re-test).

### Bước 4: Chốt báo cáo SIT
- [ ] **Ký duyệt kết quả test nội bộ**
  - `@Tech_Lead` và `@QA` xác nhận hệ thống đã đủ ổn định để đưa vào UAT.
