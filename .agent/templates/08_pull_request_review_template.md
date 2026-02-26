# MẪU DUYỆT MÃ NGUỒN (PULL REQUEST / CODE REVIEW TEMPLATE)

**Người tạo PR (Author):** [@Senior_Dev]
**Người duyệt (Reviewer):** [@Tech_Lead]
**Mã Ticket (Jira/Trello ID):** [Vd: ERP-205]
**Tiêu đề PR:** [Mô tả ngắn gọn, vd: Feature: Tích hợp Cổng thanh toán VNPay]

---

## 1. TÓM TẮT THAY ĐỔI (WHAT CHANGED)
*Người tạo PR giải thích nhanh đoạn code của mình làm gì.*
- Thêm thư viện gọi API VNPay.
- Sửa lại bảng `Payment_Transactions` trong Database để lưu mã giao dịch (TxnRef).
- Xây dựng webhook nhận tín hiệu trả về từ ngân hàng.

## 2. CHECKLIST DÀNH CHO NGƯỜI TẠO PR (AUTHOR'S CHECK)
*`@Senior_Dev` tự tick trước khi ném cho Tech Lead review.*
- [x] Code đã tuân thủ chuẩn Clean Code và S.O.L.I.D.
- [x] Đã xử lý các trường hợp ngoại lệ (Try/Catch bắt Exception).
- [ ] Đã viết/cập nhật Unit Test cho đoạn logic mới (Chưa làm, vì đang cần deploy gấp).
- [x] Không để lại lệnh `print()`, `console.log()` hoặc các đoạn code nháp chết (Dead code).
- [x] Đã test chạy thử ở môi trường Local 100% mượt mà.

## 3. KẾT QUẢ ĐÁNH GIÁ TỪ TECH LEAD (REVIEWER'S VERDICT)

### Trạng thái (Trọng tài phán quyết):
- [ ] 🟢 **APPROVE:** Tuyệt vời, code siêu sạch. Merge thẳng vào nhánh Main!
- [ ] 🟡 **REQUEST CHANGES (Sửa nhẹ):** Code cơ bản OK, nhưng cần chỉnh lại formatting hoặc tối ưu một hàm vòng lặp. Cứ sửa xong thì tự Merge không cần bắt tôi xem lại.
- [ ] 🔴 **REJECT CODE / BLOCK:** Tư duy sai bét / Code này làm cháy DB. Hủy toàn bộ và làm lại!

### Nhận xét chi tiết (Feedback Details):
- **Kiến trúc (Architecture):** Tốt, phân tách tầng Controller và Service rõ ràng.
- **Hiệu năng (Performance):** ⚠️ Vòng lặp lấy danh sách ngân hàng đang gọi DB N+1 lần (Performance bottleneck). Vui lòng dùng lệnh Join.
- **Bảo mật (Security):** 🚨 Cảnh báo! API Key VNPay đang bị Hard-code trực tiếp trong file. Vui lòng chuyển ra file `.env` ngay lập tức!

### Hành động tiếp theo (Next Steps):
- *@Senior_Dev phản hồi lại phần "Bảo mật" và sửa vòng lặp N+1, sau đó Ping lại Tech Lead để duyệt.*
