# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** LegacyTree | **Sprint:** 02
**Mục tiêu của Sprint (Sprint Goal):** Hiện thực hóa Sơ đồ cây gia phả và tích hợp lưu trữ hình ảnh.
**Bắt đầu:** 24/02/2026 | **Kết thúc:** 03/03/2026
**Tham gia:** @USER (Client/PM), @Antigravity (Technical Lead/Senior Dev)

---

## 1. REVIEW SỨC CHỨA CỦA TEAM (CAPACITY)
- @Antigravity: [100% capacity - Sẵn sàng cho các tính năng phức tạp về thuật toán cây].
- Sức khỏe dự án: Tốt, nợ kỹ thuật thấp nhờ Clean Architecture.

## 2. CHỐT SPRINT BACKLOG (DANH SÁCH TASK SẼ LÀM)

| ID | Tên chức năng (User Story) | Story Points | Trạng thái (Status) | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-201 | Hiển thị Sơ đồ cây gia phả (Visual Tree) cơ bản | 8 | To Do | @Antigravity |
| LT-202 | Tích hợp Supabase Storage: Upload ảnh Bia ký/Mộ phần | 5 | To Do | @Antigravity |
| LT-203 | Tích hợp Supabase Storage: Upload ảnh chân dung thành viên | 3 | To Do | @Antigravity |
| LT-204 | Chức năng Tìm kiếm thành viên (Search & Filter) | 3 | To Do | @Antigravity |

## 3. CÁC RỦI RO / TRỞ NGẠI HIỆN TẠI (RISKS & BOTTLENECKS)
- **Độ phức tạp của thuật toán cây**: Cây gia phả (đặc biệt là mối quan hệ đa thê hoặc nhánh lớn) có thể làm vỡ layout. Giải pháp: Sử dụng thư viện chuyên dụng như `react-flow` hoặc `d3-flextree`.

## 4. XÁC NHẬN DEFINITION OF DONE (DoD)
*Tính năng chỉ được coi là "XONG" trong Sprint này khi:*
- [ ] Visual Tree hiển thị đúng ít nhất 3 thế hệ (Cha - Con).
- [ ] Ảnh được lưu trữ và hiển thị đúng từ Supabase Storage thay vì link ngoài.
- [ ] Code tuân thủ Clean Architecture.
- [ ] Đã được @USER nghiệm thu trên giao diện.
