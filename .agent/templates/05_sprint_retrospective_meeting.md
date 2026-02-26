# BIÊN BẢN HỌP: SPRINT RETROSPECTIVE (CẢI TIẾN LIÊN TỤC)

**Dự án:** [Tên dự án] | **Sprint:** [Số thứ tự Sprint]
**Ngày họp:** [Thường ngay sau buổi Review]
**Quy tắc ngầm (Prime Directive):** "Bất kể điều gì đã xảy ra trong Sprint trước, chúng ta tin rằng mỗi cá nhân đã cố gắng hết sức theo khả năng của họ lúc đó. Cuộc họp này là để TÌM LỖI HỆ THỐNG, KHÔNG PHẢI TÌM LỖI CON NGƯỜI."
**Thành phần tham dự:** [Chỉ nội bộ Team: Dev, QA, Design, PM, BA - KHÔNG CÓ KHÁCH HÀNG HAY SẾP LỚN]

---

## 1. THU THẬP DỮ LIỆU SPRINT VỪA RỒI
*Sử dụng biểu đồ Burndown Chart, Thống kê Bug, hoặc Velocity để làm gốc phân tích.*
- **Velocity đạt được:** [Vd: 38/45 điểm cam kết]
- **Số Bug trả lại từ QA (Re-open rate):** [Vd: Rất cao, 5 bug mở lại 3 lần]

## 2. PHÂN TÍCH THEO MÔ HÌNH (MAD - SAD - GLAD)
*(Mỗi thành viên cầm note dán lên bảng hoặc điền vào Miro/Trello)*

### 🟢 GLAD (Cái Gì TỐT - Nên phát huy)
- @Senior_Dev: "BA vẽ luồng rõ ràng, code rất mượt không bị vướng logic."
- @QA: "Hệ thống tự động deploy CI/CD chạy mượt, tôi không phải chờ Dev manual deploy nữa."

### 🔴 SAD (Cái Gì CHƯA TỐT - Cần né tránh)
- @Designer: "Mockup hoàn thiện muộn làm Dev phải OT thứ Bảy. Cần có Design trước 1 Sprint."
- @Tech_Lead: "API xuất báo cáo chạy mất 5 giây, performance quá kém."

### 🟣 MAD (Cái Gì GÂY ỨC CHẾ - Phải diệt tận gốc)
- @Managing_Director_PM: "Khách hàng gọi điện thẳng cho Dev bắt thêm tính năng giữa Sprint làm vỡ kế hoạch!"
- @QA: "Dev đẩy code mà không test trên local trước, toàn bug vỡ UI căn bản."

## 3. HÀNH ĐỘNG CẢI TIẾN (ACTION ITEMS)
*Biến nhược điểm thành hành động cụ thể cho Sprint tiếp theo.*
| STT | Vấn đề | Giải pháp đề xuất | Người xử lý (Owner) | Deadline |
|:---:|:---|:---|:---:|:---:|
| 1 | Khách tự ý thêm yêu cầu | Chặn toàn bộ liên lạc trực tiếp Khách - Dev. Khách phải thông qua @BA hoặc PM. | @Managing_Director_PM | Ngay lập tức |
| 2 | Code lỗi vặt khi đẩy QA | Dev phải chạy lệnh unit-test và tự check UI trước khi báo QA vào test. | Toàn bộ Team Dev | Sprint tới |
| 3 | Tối ưu màn report chậm | Refactor Query lấy dữ liệu (Tạo Index trên DB). | @Tech_Lead | Sprint tới |
