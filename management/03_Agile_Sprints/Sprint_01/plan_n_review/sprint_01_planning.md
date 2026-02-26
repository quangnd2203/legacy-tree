# BIÊN BẢN HỌP: SPRINT PLANNING (LẬP KẾ HOẠCH SPRINT)

**Dự án:** Legacy Tree | **Sprint:** Sprint 01
**Mục tiêu của Sprint (Sprint Goal):** Thiết lập hệ thống Authentication (Supabase Auth) và các tính năng quản lý hồ sơ cơ bản (Profile CRUD) cùng Danh bạ dòng họ.
**Bắt đầu:** [Ngày bắt đầu] | **Kết thúc:** [+2 tuần kể từ ngày bắt đầu]
**Tham gia:** @Managing_Director_PM, @Tech_Lead, @Senior_Dev, @QA, @BA, @Designer

---

## 1. REVIEW SỨC CHỨA CỦA TEAM (CAPACITY)
- @Senior_Dev: 100% capacity (40h/tuần)
- @Tech_Lead: 50% capacity (Review & Arch guidance)
- @QA: 100% capacity
- @BA: 100% capacity (Làm rõ logic duyệt của Admin)

## 2. CHỐT SPRINT BACKLOG (DANH SÁCH TASK SẼ LÀM)

| ID | Tên chức năng (User Story) | Story Points | Trạng thái (Status) | Assignee |
|:---:|:---|:---:|:---:|:---:|
| LT-101 | Tích hợp Supabase Auth (Login/Logout cho Admin & Contributor) | 5 | To Do | @Senior_Dev |
| LT-102 | Xây dựng giao diện & Logic nhập liệu Profile (CRUD) | 8 | To Do | @Senior_Dev |
| LT-103 | Tính năng Danh bạ dòng họ (Hiển thị list & Search theo SĐT) | 3 | To Do | @Senior_Dev |
| LT-104 | Thiết lập phân quyền RLS trên Supabase cho bảng Profiles/Users | 5 | To Do | @Tech_Lead |
| LT-105 | Viết Test Case & thực hiện manual test cho luồng Auth/CRUD | 5 | To Do | @QA |

## 3. CÁC RỦI RO / TRỞ NGẠI HIỆN TẠI (RISKS & BOTTLENECKS)
- Rủi ro: Việc kết nối Supabase Auth với bảng `public.users` cần xử lý trigger để đồng bộ dữ liệu.
- Giải pháp: @Tech_Lead sẽ hỗ trợ viết SQL Trigger trên Supabase Dashboard.

## 4. XÁC NHẬN DEFINITION OF DONE (DoD)
*Tính năng chỉ được coi là "XONG" trong Sprint này khi:*
- [x] Code xong và Pass 100% Unit Test (nếu có logic phức tạp).
- [x] Code đã được Approve bởi @Tech_Lead (PR merged).
- [x] Tuân thủ quy chuẩn đặt tên thư mục (lowercase) và kiến trúc Clean Architecture.
- [x] Được @QA test qua môi trường Local/Development.
