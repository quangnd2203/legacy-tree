# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** [Tên dự án] | **Sprint:** [Số thứ tự Sprint, vd: Sprint 03]
**Mục tiêu của Sprint (Sprint Goal):** [Câu khẩu hiệu của Sprint này, vd: Hoàn thiện tính năng xuất kho và tích hợp máy quét mã vạch]
**Bắt đầu:** [Ngày bắt đầu] | **Kết thúc:** [Ngày kết thúc]
**Tham gia:** [@Managing_Director_PM, @Tech_Lead, @Senior_Dev, @QA, @BA, @Designer]

---

## 1. REVIEW SỨC CHỨA CỦA TEAM (CAPACITY)
*Đánh giá xem tuần này có ai nghỉ phép hay team có phải gánh nợ kỹ thuật không?*
- @Senior_Dev: [100% capacity = 40h]
- @QA: [Nghỉ phép 1 ngày = 32h]
- Velocity trung bình các Sprint trước: [vd: 45 Story Points]

## 2. CHỐT SPRINT BACKLOG (DANH SÁCH TASK SẼ LÀM)
*Sử dụng @BA để giải thích requirements và @Tech_Lead để estimate (ước lượng) độ khó.*

| ID | Tên chức năng (User Story) | Story Points | Trạng thái (Status) | Assignee |
|:---:|:---|:---:|:---:|:---:|
| ERP-101 | Chức năng tạo Phiếu xuất kho | 5 | To Do | @Senior_Dev |
| ERP-102 | Viết Unit Test cho Phiếu xuất kho | 2 | To Do | @Senior_Dev |
| ERP-105 | Viết Test Plan cho Module Kho | 3 | To Do | @QA |

## 3. CÁC RỦI RO / TRỞ NGẠI HIỆN TẠI (RISKS & BOTTLENECKS)
- [Vd: Đang thiếu API từ bên giao hàng thứ 3. Giải pháp: Lên lịch họp với đối tác vào thứ Tư]

## 4. XÁC NHẬN DEFINITION OF DONE (DoD)
*Tính năng chỉ được coi là "XONG" trong Sprint này khi:*
- [x] Code xong và Pass 100% Unit Test.
- [x] Code đã được Approve bởi @Tech_Lead (PR merged).
- [x] Được @QA test qua môi trường Staging (Không còn Bug P0/P1).
