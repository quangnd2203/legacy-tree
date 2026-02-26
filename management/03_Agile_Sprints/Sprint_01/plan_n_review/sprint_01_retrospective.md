# BIÊN BẢN HỌP: SPRINT RETROSPECTIVE (CẢI TIẾN LIÊN TỤC)

**Dự án:** LegacyTree | **Sprint:** 01
**Ngày họp:** 24/02/2026
**Quy tắc ngầm (Prime Directive):** "Bất kể điều gì đã xảy ra trong Sprint trước, chúng ta tin rằng mỗi cá nhân đã cố gắng hết sức theo khả năng của họ lúc đó. Cuộc họp này là để TÌM LỖI HỆ THỐNG, KHÔNG PHẢI TÌM LỖI CON NGƯỜI."
**Thành phần tham dự:** @USER (Client/PM), @Antigravity (Technical Lead/Senior Dev)

---

## 1. THU THẬP DỮ LIỆU SPRINT VỪA RỒI
- **Velocity đạt được:** 100% (Hoàn thành LT-101, LT-102, LT-103, LT-104, LT-105).
- **Tình trạng mã nguồn:** Đã chuyển đổi sang Strict Clean Architecture (Template 09).
- **Phản hồi từ User:** Rất tích cực về tính pro-active trong việc tinh chỉnh yêu cầu (Âm lịch, Phụ hệ).

## 2. PHÂN TÍCH THEO MÔ HÌNH (MAD - SAD - GLAD)

### 🟢 GLAD (Cái Gì TỐT - Nên phát huy)
- **Kiến trúc bền vững**: Chuyển sang Clean Architecture sớm giúp code rất sạch, dễ bảo trì và mở rộng tính năng mới.
- **Tương tác trực tiếp và nhanh**: Việc chốt yêu cầu về "Phụ hệ" và "Ngày giỗ Âm lịch" ngay trong quá trình phát triển giúp tránh lãng phí thời gian làm sai.
- **Domain Events**: Triển khai Event Dispatcher giúp hệ thống có khả năng mở rộng chức năng (như thông báo, log) mà không làm rối logic chính.

### 🔴 SAD (Cái Gì CHƯA TỐT - Cần né tránh)
- **Quy trình Database Migrations**: Hiện tại việc cập nhật SQL vẫn là manual (Copy-paste). Khi dự án lớn lên, việc này dễ gây lỗi thiếu đồng bộ giữa local và server.
- **Sự thay đổi layout liên tục**: Các trường Ngày/Năm sinh/Giờ sinh thay đổi 2-3 lần làm tốn công refactor UI. Cần chốt kỹ Mockup/Requirement trước khi code UI phức tạp.

### 🟣 MAD (Cái Gì GÂY ỨC CHẾ - Phải diệt tận gốc)
- **Validation lặt vặt**: Một số lỗi "vẫn bị required" sau khi đã yêu cầu bỏ làm mất thời gian kiểm tra của User. Cần double-check kỹ code trước khi báo hoàn thành.

## 3. HÀNH ĐỘNG CẢI TIẾN (ACTION ITEMS)

| STT | Vấn đề | Giải pháp đề xuất | Người xử lý (Owner) | Deadline |
|:---:|:---|:---|:---:|:---:|
| 1 | Database Migrations thủ công | Tìm hiểu và áp dụng file migration/versioning cho SQL thay vì chỉ gửi script lẻ. | @Antigravity | Sprint 02 |
| 2 | Chốt yêu cầu UI/Data | Dành thêm 5-10 phút để confirm kỹ layout các trường dữ liệu trước khi thực hiện code hàng loạt. | @USER & @Antigravity | Ngay lập tức |
| 3 | Testing trước khi bàn giao | Tăng cường tự kiểm tra form submission và validation trên trình duyệt trước khi thông báo cho User. | @Antigravity | Ngay lập tức |
| 4 | Kế hoạch tính năng mới | Chuẩn bị backlog cho Sprint 02: Hiển thị sơ đồ cây (Visual Tree). | @USER | Đầu Sprint 02 |
