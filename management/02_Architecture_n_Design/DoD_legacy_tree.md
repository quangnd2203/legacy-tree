# DEFINITION OF DONE (DoD) - LEGACY TREE

Tài liệu này xác định các tiêu chuẩn cần thiết để một hạng mục công việc (User Story/Task) được coi là hoàn thành trong dự án Legacy Tree.

## 1. Tiêu chuẩn Mã nguồn (Code Quality)
- [ ] Code tuân thủ cấu trúc **Clean Architecture**.
- [ ] Không có lỗi Linting hoặc Formatting (Sử dụng Prettier/ESLint).
- [ ] Đã xóa bỏ các đoạn code dư thừa, console.log và comment không cần thiết.
- [ ] Tên biến, hàm, lớp rõ ràng bằng tiếng Anh.

## 2. Kiểm thử (Testing)
- [ ] Đã chạy Unit Test cho các logic quan trọng (Domain/Application logic).
- [ ] Tính năng hoạt động đúng trên môi trường Local Development.
- [ ] Đã tự kiểm tra (Self-review) trên giao diện Web (Responsive check).

## 3. Review & Phê duyệt (Review & Approval)
- [ ] Đã tạo Pull Request (PR) và được Tech Lead review.
- [ ] Mọi feedback trong PR đã được giải quyết (Workflow 06).

## 4. Tài liệu hướng dẫn (Documentation)
- [ ] Cập nhật tài liệu API (nếu có thay đổi logic Supabase).
- [ ] Cập nhật file README nếu có thay đổi về cách chạy dự án hoặc biến môi trường.

## 5. Metadata & Evidence (Quản trị dự án)
- [ ] Trạng thái task trên công cụ quản lý được cập nhật.
- [ ] Biên bản review/test (nếu có) được lưu vào thư mục `/management/04_Quality_n_Review/`.
