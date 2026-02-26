# GHI CHÚ DAILY STANDUP

**Dự án:** [Tên dự án] | **Ngày:** [DD/MM/YYYY] | **Sprint:** [Tên Sprint]
*Note: Daily Standup không phải là họp báo cáo tiến độ, mà là để đồng bộ thông tin và gỡ rối (unblock) cho nhau. Tối đa 15 phút.*

---

## 1. CẬP NHẬT TỪNG THÀNH VIÊN
*(Mỗi người trả lời nhanh 3 câu hỏi: Hôm qua làm gì? Hôm nay làm gì? Có khó khăn gì không?)*

**@Senior_Dev:**
- **Hôm qua:** Đã code xong API tính lương cho nhân viên (ERP-205).
- **Hôm nay:** Sẽ fix nốt bug giao diện Dashboard (ERP-209).
- **Trở ngại (Blocker):** Đang kẹt ở thiết kế Mockup đoạn biểu đồ, cần @Designer chốt màu sắc ngay trong sáng nay.

**@Designer:**
- **Hôm qua:** Hoàn thành UI cho màn hình Quản lý Kho.
- **Hôm nay:** Chốt Design System và gửi Mockup Biểu đồ cho Dev.
- **Trở ngại (Blocker):** [Không]

**@QA:**
- **Hôm qua:** Viết xong Test case cho API tính lương.
- **Hôm nay:** Chờ bản build mới để test luồng Lương (ERP-205). Cần @Tech_Lead cung cấp data mẫu cho dễ test.
- **Trở ngại (Blocker):** Thiếu Data mẫu trên Staging.

**@BA:**
- **Hôm qua:** Gặp khách lấy requirements module Sản xuất.
- **Hôm nay:** Vẽ BPMN cho luồng Sản xuất và viết User Stories.
- **Trở ngại (Blocker):** Khách hàng chưa phản hồi email xác nhận, nhờ @Managing_Director_PM "hối" giùm.

## 2. GIẢI QUYẾT BLOCKERS (ACTION ITEMS NÓNG)
- [ ] `@Designer`: Push gấp thiết kế biểu đồ lên Figma cho Dev trước 10h sáng.
- [ ] `@Tech_Lead`: Import Data mẫu lên DB Staging cho QA trước 11h sáng.
- [ ] `@Managing_Director_PM`: Gọi điện cho khách giục Verify Requirements.
