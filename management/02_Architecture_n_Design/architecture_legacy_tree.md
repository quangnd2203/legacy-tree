# TÀI LIỆU KIẾN TRÚC & THIẾT KẾ (ARCHITECTURE & DESIGN): LEGACY TREE

*Tài liệu thuộc Bước 4 - Quy trình 02: Architecture & Tech Stack*

## 1. Quyết Định Tech Stack (Tech Stack Decision)
Dựa trên yêu cầu của dự án LegacyTree, Tech Stack được đề xuất như sau:
- **Ngôn ngữ / Nền tảng:** TypeScript / Node.js (v24 LTS - Krypton)
- **Front-end:** React.js (phục vụ giao diện Web đa nền tảng, có thiết kế responsive tốt trên Mobile). Sử dụng **Tailwind CSS** để quản lý styling nhanh chóng và nhất quán.
- **BaaS (Backend, Database & Auth):** Supabase. Cung cấp thay thế cho việc tự code backend truyền thống nhờ PostgreSQL có sẵn, Authentication, Storage (ảnh phần mộ) và Auto-generated APIs (REST/GraphQL).
- **Môi trường triển khai:** Front-end triển khai trên Vercel hoặc Netlify làm Public Domain. Dữ liệu và Backend sử dụng hạ tầng Supabase Cloud.

## 2. High-level Architecture (Sơ đồ luồng dữ liệu)
Hệ thống tuân thủ nghiêm ngặt **Clean Architecture** (dựa trên Template số 09) với 4 lớp:
- **domain:** Định nghĩa các thực thể cốt lõi (`User`, `Profile`, `TreeConfig`, `ContributionRequest`). Lớp này không phụ thuộc vào bất kỳ framework nào.
- **application:** Chứa các Use Case (Business logic) như `AddNewProfileNode`, `ApproveContribution`, `GetFamilyTree`.
- **infrastructure:** Triển khai kết nối đến Supabase (thông qua `@supabase/supabase-js`), tương tác với PostgreSQL DB và quản lý file trên Supabase Storage.
- **presentation:** Các UI Components trên React gọi các Use Case, có thể sử dụng thêm Supabase Edge Functions nếu có API nào cần logic phức tạp hoặc bảo mật cao không thể gọi trực tiếp từ client.

## 3. Database Schema (Lược đồ cơ sở dữ liệu sơ bộ)
Hệ thống lấy cây gia phả làm trung tâm. Dưới đây là các bảng (tables) quan trọng cấu thành nên Database:

### 3.1 Bảng `Users` (Quản lý Phân quyền kết hợp Supabase Auth)
Quá trình đăng nhập/mật khẩu sẽ do `auth.users` của Supabase đảm nhiệm. Bảng `Users` này (schema `public`) dung để mở rộng thông tin Role.
- `id` (UUID, PK, References `auth.users.id` - RLS Policies sẽ kiểm tra ID này)
- `email` (String, Unique)
- `role` (Enum: `Admin`, `Contributor`)
- `created_at` (Timestamp)

### 3.2 Bảng `Profiles` (Dữ liệu Node gia phả)
Sử dụng cấu trúc **Adjacency List** với tham chiếu đến cha/mẹ, phù hợp cho Top-down Tree.
- `id` (UUID, PK)
- `full_name` (String)
- `birth_date` (String/Date, ISO 8601, Nullable) - **Ngày sinh Dương lịch**: Dùng để tính toán, sắp xếp theo tuổi.
- `birth_date_lunar` (String, Nullable) - **Ngày sinh Âm lịch**: Nhập tay dạng text tự do (VD: "15/4 Giáp Ngọ"). Ưu tiên hiển thị trong Phả ký. *(Tính năng convert Dương → Âm tự động là Optional/Future, chưa triển khai)*
- `seniority_index` (Integer, Nullable) - Thứ tự vai vế trong anh em (1=Trưởng, 2=Thứ...)
- `status` (Enum: `Alive`, `Deceased`)
- `death_anniversary` (Date, Nullable)
- `grave_location_coords` (String, Nullable)
- `grave_image_url` (String, Nullable)
- `phone_number` (String, Nullable)
- `father_id` (UUID, Nullable, FK to Profiles.id) - Liên kết khóa ngoại chỉ định người cha
- `mother_id` (UUID, Nullable, FK to Profiles.id) - Liên kết khóa ngoại chỉ định người mẹ
- `partner_id` (UUID, Nullable, FK to Profiles.id) - Liên kết vợ/chồng (tùy chọn mở rộng)

### 3.3 Bảng `ContributionRequests`
Lưu trữ lịch sử các yêu cầu đóng góp từ Contributor chờ Admin duyệt (Dữ liệu chưa duyệt không hiện lên cây gốc).
- `id` (UUID, PK)
- `contributor_id` (UUID, FK to Users.id)
- `proposed_profile_data` (JSONB) - Chứa cấu trúc tương tự `Profiles` nhưng ở trạng thái nháp.
- `request_status` (Enum: `Pending`, `Approved`, `Rejected`)
- `created_at` (Timestamp)
- `reviewed_at` (Timestamp, Nullable)
- `reviewed_by` (UUID, Nullable, FK to Users.id)

## 4. Định Hình UI/UX Concept
- **Phong cách thiết kế:** Minimalist (Tối giản), tập trung vào hiển thị nội dung trực quan.
- **Chủ đạo màu sắc:** Đen/Trắng (Light theme), điểm xuyết màu xám để phân tách các khối thông tin (cards).
- **Trải nghiệm thao tác (UX):**
  - Giao diện Sơ đồ nhánh (Top-down Tree) phải mượt mà, hỗ trợ thao tác kéo-thả (drag/pan) và phóng to/thu nhỏ (zoom).
  - Trọng tâm UX hướng tới người lớn tuổi: Font chữ lớn, dễ nhìn (`Inter` hoặc `Roboto`), nút bấm rõ ràng (Clear Calls to Action).
  - Các node trên cây được sắp xếp tự động: Giới tính -> Seniority Index -> Ngày sinh.
  - Các node trên cây có thể click vào để mở ra Sidebar/Modal hiển thị chi tiết mảng Hồ Sơ Cá Nhân (Personal Profile).

## 5. Technical Guideline (Hướng dẫn nhóm phát triển)
Căn cứ theo `09_standard_clean_architecture.md`:
1. **Dependency Rule:** Source code chỉ được import từ ngoài vào trong. Không làm rối loạn việc import giữa các Domain và Infrastructure.
2. Dữ liệu trả về cho Front-end (Presentation Layer) phải được format chuẩn trước, tuyệt đối không trả trực tiếp dữ liệu từ entity của DB (Tránh lộ các cột nhạy cảm).
3. Sử dụng Git Flow chuẩn (feature-branch) khi phát triển, và áp dụng quy trình Code Review của Tech Lead trước khi merge vào nhánh `main` (Workflow 06).
4. **Quản lý phiên bản Node.js:** Sử dụng `nvm` kết hợp với file `.nvmrc` tại gốc dự án để đảm bảo toàn bộ team sử dụng đúng phiên bản Node.js v24 LTS. Dev cần chạy `nvm use` trước khi bắt đầu làm việc.
5. **Quy chuẩn đặt tên thư mục:** Tuân thủ quy chuẩn Node.js, sử dụng `lowercase` hoặc `kebab-case` cho tất cả các thư mục trong `src` (ví dụ: `domain`, `application`, `infrastructure`, `presentation`). Tuyệt đối không sử dụng PascalCase như trong môi trường .NET.
6. **Cấm lồng dự án (No Nested Projects):** Tuyệt đối không được tạo thêm dự án con bằng cách chạy `create-vite` hay `npm init` bên trong các thư mục con của `src`. Toàn bộ dependencies và cấu hình (`package.json`, `vite.config.ts`, `node_modules`) phải được quản lý tập trung tại **Gốc dự án (Root)**. Senior Dev có trách nhiệm kiểm soát việc này để tránh gây rác code và khó khăn khi build/deploy.
