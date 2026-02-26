# BIÊN BẢN HỌP: PROJECT KICKOFF (KHỞI ĐỘNG DỰ ÁN)

**Dự án:** Legacy Tree (Gia Phả Dòng Họ)
**Ngày họp:** [Điền ngày thực tế] | **Thời gian:** [Giờ bắt đầu] - [Giờ kết thúc]
**Thành phần tham dự:** @Managing_Director_PM, @Tech_Lead, @BA, Khách hàng đại diện dòng họ
**Người ghi biên bản:** @Managing_Director_PM

---

## 1. MỤC TIÊU DỰ ÁN (PROJECT GOALS)
- Xây dựng một ứng dụng lưu trữ và hiển thị cây gia phả dòng họ, dễ dàng truy cập và chia sẻ Public.
- Cung cấp giao diện Web thân thiện, hướng tới đa nền tảng (Web + Mobile) và dễ sử dụng cho người lớn tuổi.
- Đảm bảo tính chính xác của dữ liệu lịch sử thông qua cơ chế xét duyệt nội dung của Trưởng Tộc (Admin).

## 2. PHẠM VI CÔNG VIỆC (SCOPE OF WORK - HIGH LEVEL)
- **In-scope:** 
  - Phân quyền người dùng (Public Viewer, Contributor, Admin).
  - Cây Gia Phả (Top-down Tree Visualization, kéo thả/zoom).
  - Hồ sơ cá nhân (thông tin, trạng thái sống/mất, phần mộ, v.v.).
  - Danh bạ dòng họ (Contact Directory).
  - Luồng duyệt yêu cầu đóng góp từ Contributor.
- **Out-of-scope:** 
  - Tính năng quản lý quỹ dòng họ.
  - Xử lý dữ liệu quy mô khổng lồ (vài chục ngàn người - dự án chỉ ở mức nhỏ/vừa).

## 3. THỐNG NHẤT CÔNG NGHỆ CHÍNH (TECH STACK / ARCHITECTURE)
- **Giao diện/Front-end:** React for Web, phong cách Minimalist, Light theme (Đen/Trắng).
- **Kiến trúc:** Clean Architecture (theo Template số 09).
- **Database:** PostgreSQL (Core tables: Users, Profiles, ContributionRequests - thiết kế Adjacency List cho Tree).
- **Deployment:** Public Domain.

## 4. QUY TRÌNH PHỐI HỢP (WORKING AGREEMENT)
- **Mô hình:** Agile / Standard Sprint (Workflow 04).

## 5. CÁC MỐC THỜI GIAN CHÍNH (KEY MILESTONES)
- **Sprint Zero (Tuần 1):** Setup dự án, Clean Architecture, Init Database.
- **Sprint 1 (Tuần 2-3):** Authentication, Profile CRUD, Danh bạ.
- **Sprint 2 (Tuần 4-5):** Tree Rendering, Thuật toán đệ quy, Luồng Approve/Reject của Admin.
- **Sprint 3 (Tuần 6):** UAT, Fix bug, Deploy Public Domain (Go-live).

## 6. ACTION ITEMS (CÔNG VIỆC TIẾP THEO)
| STT | Công việc / Nhiệm vụ | Người phụ trách | Deadline |
|:---:|:---|:---:|:---:|
| 1 | Xác nhận các thỏa thuận hợp đồng và Biên bản Kick-off | @Managing_Director_PM & Khách hàng | Sprint Zero |
| 2 | Khởi tạo thư mục dự án và thiết kế chi tiết Database Schema | @Tech_Lead | Sprint Zero |
| 3 | Chuyển giao dự án sang giai đoạn thực thi (Workflow 03 - Sprint Zero) | Cả Team | Sprint Zero |
