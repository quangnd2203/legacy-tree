# TÀI LIỆU POST-MORTEM (MỔ XẺ SỰ CỐ)
*(Blameless Post-Mortem - Mổ xẻ không đổ lỗi)*

**Dự án:** [Tên hệ thống ERP đang chạy Live]
**Mã sự cố:** [INC-202X-001]
**Thời gian bắt đầu lỗi:** [DD/MM/YYYY hh:mm] | **Thời gian khắc phục xong:** [DD/MM/YYYY hh:mm]
**Tổng thời gian sập (Downtime):** [Vd: 2 tiếng 15 phút]
**Tác giả Report:** [@Tech_Lead hoặc @Managing_Director_PM]

---

## 1. TÓM TẮT SỰ CỐ (EXECUTIVE SUMMARY)
*Mô tả ngắn gọn bằng ngôn ngữ phi kỹ thuật để Sếp đọc hiểu liền.*
Vào sáng Thứ Hai lúc 8h00, hệ thống Kế toán ERP bị treo diện rộng, không thể đăng nhập hoặc tạo phiếu thu chi. Lỗi do dịch vụ Redis Cache bị hết RAM làm quá tải Database. Đội ngũ đã thực hiện khởi động lại Cluster và nâng cấp RAM, hệ thống hoạt động ổn định trở lại lúc 10h15.

## 2. DÒNG THỜI GIAN (TIMELINE SỰ VIỆC)
- **08:00 AM:** KH bắt đầu báo không log-in được.
- **08:05 AM:** `@Tech_Lead` kiểm tra log và nhận cảnh báo 502 Bad Gateway.
- **08:15 AM:** `#Incident-Room` trên Slack được lập. `@QA` xác nhận lỗi xảy ra trên mọi nền tảng (Web/App).
- **08:30 AM:** Xác định nguyên nhân: Dịch vụ Cache chết cứng, nhồi toàn bộ traffic vào Database.
- **09:00 AM:** Cố gắng restart server nhưng thất bại do kẹt file lock.
- **09:45 AM:** Quyết định nâng RAM khẩn cấp (Scale-up) và restart nóng toàn cụm máy chủ.
- **10:15 AM:** `@QA` xác nhận ứng dụng lên lại bình thường. `@BA` báo cáo KH chốt xong sự cố.

## 3. TẠI SAO LẠI XẢY RA? (5 KHÁM PHÁ / 5 WHYS)
1.  **Tại sao web sập?** -> Vì API trả về 502 Timeout.
2.  **Tại sao API trả Timeout?** -> Vì chuỗi kết nối Database đã đạt giới hạn (Max Connections).
3.  **Tại sao nối Database đạt đỉnh?** -> Vì hệ thống Cache (Redis) ngưng hoạt động trên mọi Node.
4.  **Tại sao Redis đi bán muối?** -> Vì bị tràn RAM (OOM) do lưu trữ lượng lớn phiên đăng nhập (Sessions) nhưng quên thiết lập thời hạn xóa (TTL).
5.  **Tại sao lại quên cài TTL?** -> Trong bản Release Sprint trước, code lưu Session mới bỏ sót dòng `expire_time`.

## 4. TỔN THẤT (IMPACT)
- **Dữ liệu:** Không mất dữ liệu kế toán, chỉ mất các phiên thao tác đang gõ dở trước 8h00.
- **Business:** Khoảng 300 giao dịch xuất kho bị trễ 2 giờ, phải bù đắp bằng nhập tay.

## 5. HÀNH ĐỘNG NGĂN CHẶN (PREVENTION)
| STT | Action | Trách nhiệm | Deadline |
|:---:|:---|:---:|:---:|
| 1 | Triển khai công cụ Monitor dung lượng Redis cảnh báo trước OOM 80%. | @Tech_Lead | Tuần này |
| 2 | Bổ sung Code Review Rule: Các key Cache phải bắt buộc có khai báo TTL. | @Senior_Dev | Tuần này |
| 3 | Viết Unit Test giả lập Redis Error xem app có nhả kết nối tử tế hay treo luôn. | @QA / @Dev | Sprint tới |
