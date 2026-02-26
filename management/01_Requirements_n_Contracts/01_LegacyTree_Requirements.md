# TÀI LIỆU YÊU CẦU DỰ ÁN (REQUIREMENTS & PROPOSAL): LEGACY TREE (Gia Phả Dòng Họ)
*Tài liệu thuộc Bước 4 - Quy trình 01: Pre-sales & Discovery*
*Cập nhật lần cuối: 25/02/2026 — Discovery Session sau Sprint 6*

## 1. Tổng Quan Dự Án
- **Mục tiêu:** Xây dựng một ứng dụng lưu trữ và hiển thị cây gia phả dòng họ, dễ dàng truy cập, chia sẻ Public và thân thiện với người lớn tuổi.
- **Nền tảng công nghệ:** React for Web (hướng tới đa nền tảng web + mobile).
- **Quy mô dự kiến:** Mức độ vừa và nhỏ (Không đến mức vài chục ngàn người).
- **Giao diện (UI/UX):** Phong cách Minimalist, chủ đạo Đen/Trắng (Light theme), không cầu kỳ.

## 2. Phân Quyền Người Dùng (Roles & Permissions)
- **Khách vãng lai (Public Viewer):** Bất kỳ ai cũng có thể xem cây gia phả (Public cho cả thế giới xem).
- **Thành viên đóng góp (Contributor):** Các thành viên trong dòng họ có thể nhập liệu/đóng góp thông tin vào cây. Tuy nhiên dữ liệu cần được chờ duyệt.
- **Trưởng Tộc (Admin):** Nắm quyền phê duyệt cuối cùng. Mọi nội dung do thành viên đóng góp phải được Admin này duyệt mới hiển thị chính thức lên cây gia phả.

## 3. Danh Sách Tính Năng Cốt Lõi (Core Features)

### 3.1. Cây Gia Phả (Family Tree)
- Hiển thị theo dạng Sơ đồ nhánh từ trên xuống dưới (Top-down Tree).
- Giao diện trực quan, dễ thao tác kéo thả/zoom.

### 3.2. Hồ Sơ Cá Nhân (Personal Profile)
Mỗi thành viên (Node) có một trang thông tin ghi nhận:
- Họ và tên, ngày sinh.
- **Hệ thống ngày sinh kép (Dual-date System):**
    - `birth_date` (Dương lịch, ISO Date): Dùng để tính toán, sắp xếp, so sánh tuổi. Chủ yếu áp dụng cho con cháu.
    - `birth_date_lunar` (Âm lịch, Text tự do): Cho phép nhập tay linh hoạt (VD: "15 tháng 4 Giáp Ngọ"). Ưu tiên hiển thị trong Phả ký. Chủ yếu dùng cho các thế hệ trước.
    - **Logic hiển thị:** Nếu có `birth_date_lunar` thì hiển thị Âm lịch. Nếu chỉ có `birth_date` thì hiển thị Dương lịch.
    - **Tính năng Convert:** ~~Tích hợp thư viện `lunar-calendar` để tự động convert ngày dương sang âm.~~
      > **[PERMANENTLY DROPPED — 25/02/2026]** `birth_date_lunar` đang là free text (`"15 tháng 4 Giáp Ngọ"`) — không có thư viện nào parse đáng tin cậy tất cả biến thể. Chi phí kỹ thuật quá cao so với giá trị thực tế. **Sẽ không triển khai.**
- Thứ tự vai vế (Seniority Index): Dùng để xác định thứ tự Anh/Em khi không rõ ngày sinh hoặc theo truyền thống.
- Trạng thái: Còn sống (Alive) / Đã mất (Deceased).
- Ngày giỗ (Nếu đã mất).
- Phần mộ: Tọa độ phần mộ và Ảnh chụp phần mộ (Nếu có).
- Số điện thoại liên lạc.

### 3.3. Danh Sách Thành Viên (Member List) — *Tích hợp vào route `/members`*
- Danh sách tổng hợp toàn bộ thành viên trong gia phả.
- **Logic sắp xếp:** Tuân thủ cấu trúc phân cấp và quan hệ gia đình (Unit-based sorting):
    - Sắp xếp theo Đời (Thế hệ) từ trên xuống dưới.
    - **Quy tắc "Phu phụ tương tùy":** Phối ngẫu (Vợ/Chồng) phải luôn được hiển thị ngay sau người chồng/vợ (Head).
    - Thứ tự ưu tiên trong đời/nhánh: Head → Phối ngẫu → Con cái (theo quy tắc Nam > Thứ bậc > Tuổi).
- Hỗ trợ tra cứu nhanh theo tên.

> **Ghi chú navigation [25/02/2026]:** Route `/directory` (Danh bạ) đã bị loại bỏ khỏi nav. Chức năng Danh bạ được phục vụ hoàn toàn bởi `/members` (Thành viên). Không tạo trang riêng.
### 3.4. Sách Gia Phả (Ancestry Book) - Phả Ký/Phả Chí
- **Tính năng tự động hóa:** Tự động "phổ" (generate) nội dung sách từ dữ liệu cây gia phả hiện có.
- **Quy trình dàn trang (Logic):** Duyệt theo từng đời (Generation-based traversal).
    - *Đời 1:* Hiển thị Cụ Tổ & Phối ngẫu -> Liệt kê danh sách các con.
    - *Đời 2:* Đi sâu vào từng người con ở Đời 1 (theo thứ tự trưởng/thứ). Hiển thị (Người con + Phối ngẫu) -> Liệt kê danh sách cháu nội. Lặp lại cho đến hết đời 2.
    - *Đời 3, 4, ...:* Tiếp tục quy trình tương tự cho đến thế hệ cuối cùng.
- **Yêu cầu trình bày:** Giao diện dạng trang sách, typography trang trọng.
- **Tiêu chí sắp xếp (Ranking):** Tuân thủ quy tắc truyền thống Việt Nam:
    1. Giới tính (Nam trước - Nữ sau).
    2. Vai vế (Căn cứ vào `Seniority Index` nếu có, sau đó đến Ngày sinh).
- **Quy tắc hiển thị:** Con gái (Nữ, có Cha trong hệ thống) không được tạo "Hộ" (Family Unit) riêng biệt. Thông tin về con gái chỉ được liệt kê trong phần Hậu duệ của Cha.

### 3.5. Cài đặt Dòng Họ (Clan Settings) — *Sprint 4*
Mỗi cuốn gia phả thuộc về một **nhánh (Chi)** cụ thể trong một đại tộc. Cần có trang Settings cho Admin để cấu hình siêu dữ liệu của cuốn phả:

**Định danh dòng họ:**
- `clan_name`: Tên Đại Tộc *(VD: Nguyễn Đăng Tộc)*
- `branch_name`: Tên Phái (Nhánh lớn) *(VD: Đệ Nhất Phái)*
- `sub_branch_name`: Tên Chi (Nhánh nhỏ) *(VD: Đệ Tứ Chi)*

**Quê quán gốc (đến cấp Làng/Xã):**
- `hometown_village`: Làng / Thôn / Ấp
- `hometown_commune`: Xã / Phường / Thị trấn
- `hometown_district`: Huyện / Quận / Thị xã
- `hometown_province`: Tỉnh / Thành phố

**Thông tin cuốn phả:**
- `book_title`: Tiêu đề cuốn phả *(VD: Đệ Tứ Chi Gia Phổ)*
- `book_compiled_year`: Năm lập phả
- `book_compiler_name`: Người lập phả
- `generation_display_offset`: Số thứ tự Đời bắt đầu tính *(VD: nếu Chi này bắt đầu từ Đời 5 của Tộc thì nhập 5, Đời 1 trong sách sẽ hiển thị là Đời 5)*

**Bài thơ thay lời tựa:**
- `preface_poem`: Bài thơ/lời tựa **định dạng HTML** (nhập qua Rich Text Editor — hỗ trợ in đậm, in nghiêng, căn chỉnh thơ, xuống dòng...). Render trực tiếp HTML ra trang Sách Gia Phả, hiển thị trang trọng trước khi vào nội dung chính.
  - *Lưu ý bảo mật:* Phải sanitize HTML trước khi render để tránh XSS (dùng thư viện `DOMPurify`).
  - *Gợi ý Editor:* Tích hợp một Rich Text Editor nhẹ (VD: `TipTap`, `Quill`) thay vì textarea thuần.

> **Phạm vi:** Chỉ Admin (Trưởng Tộc) mới có quyền xem và chỉnh sửa trang Cài đặt này.

### 3.7. Bản Tin Dòng Họ (Announcement Board) — *Sprint 8*

> **Quyết định [Discovery 25/02/2026]:** Thêm vào scope. Thay thế hoàn toàn cho "Sự kiện" và "Tạo viên" đã bị loại bỏ.

Tính năng cho phép Admin đăng các thông báo chính thức đến toàn thể thành viên dòng họ.

**Mục đích:** Thay thế kênh tin nhắn không chính thức (Zalo, Facebook) bằng kênh thông tin gắn liền với gia phả — trang trọng, lưu trữ lâu dài.

**Phân loại thông báo (Category):**
- 📣 **Thông báo chung** — Thông tin họp mặt, lịch chạp, kỷ niệm
- ⚰️ **Cáo phó** — Thông báo thành viên qua đời
- 🕯️ **Chạp giỗ kỵ** — Nhắc nhở ngày giỗ tổ, ngày kỵ quan trọng
- 🎊 **Tin vui** — Mừng thọ, khai hoa nở nhụy, thăng quan tiến chức

**Phân quyền:**
- Trưởng Tộc (Admin): Toàn quyền tạo, sửa, xóa, publish/unpublish bài.
- Contributor & Public Viewer: Chỉ đọc — không được bình luận hay đăng bài.

**Yêu cầu kỹ thuật:**
- Bảng DB: `announcements(id, title, content_html, category, published_at, created_by, is_published)`
- Nội dung bài viết dùng Rich Text (tái sử dụng **Tiptap** đã có sẵn trong dự án).
- Sanitize HTML bằng **DOMPurify** trước khi render (đã có sẵn).
- Danh sách bài viết sắp xếp theo `published_at` giảm dần (mới nhất lên đầu).

**Acceptance Criteria:**
- [ ] Admin thấy nút "Đăng bài" trên trang Bản tin.
- [ ] Admin chọn được phân loại (category) khi đăng bài.
- [ ] Nội dung bài hỗ trợ in đậm, in nghiêng, xuống dòng (rich text).
- [ ] Public và Contributor chỉ thấy danh sách bài đã publish — không thấy nút Đăng.
- [ ] Bài chưa publish (draft) chỉ Admin mới thấy.
- [ ] Bài hiển thị đúng thứ tự mới nhất lên đầu.

---

### 3.8. TÍNH NĂNG ĐÃ BỊ LOẠI BỎ KHỎI SCOPE (DESCOPED)

> Các mục dưới đây đã được thảo luận và **chính thức loại bỏ** trong Discovery Session ngày 25/02/2026. Ghi lại để làm bằng chứng quyết định, **không được phục hồi mà không có Discovery Session mới.**

| Tính năng | Lý do loại bỏ | Ngày quyết định |
|---|---|---|
| **Sự kiện** (`/events`) | Overlap hoàn toàn với Bản tin. Tính ngày giỗ từ `birth_date_lunar` (free text) quá phức tạp, không đáng. | 25/02/2026 |
| **Tạo viên** (`/network`) | Scope chưa rõ ràng, không có user story cụ thể, không có nhu cầu thực tế được xác nhận. | 25/02/2026 |
| **Danh bạ** (`/directory`) | Trùng hoàn toàn với `/members` (Thành viên). Không cần trang riêng. | 25/02/2026 |
| **Tự động convert Âm lịch** (LT-801) | `birth_date_lunar` là free text với vô số biến thể → không parse đáng tin cậy được. | 25/02/2026 |
| **Thông báo ngày Giỗ qua email** (LT-802) | Thay thế bằng Bản tin (Admin tự đăng) — đơn giản hơn, không cần infrastructure email. | 25/02/2026 |

## 4. Kiến Trúc Sơ Bộ (Architecture Preview)
- Áp dụng chuẩn **Clean Architecture** (dựa trên Template số 09).
- Database cần các bảng cốt lõi: `Users` (Admin/Contributor), `Profiles` (Dữ liệu Node gia phả, cấu trúc Adjacency List), và `ContributionRequests` (Lưu lịch sử các yêu cầu chờ Admin duyệt).

## 5. Lộ Trình Triển Khai (Roadmap)
Dự án được đề xuất chạy theo Agile (Standard Sprint - Workflow 04):
- **Sprint Zero:** Setup thư mục quản trị dự án, thiết kế kiến trúc chuẩn Clean Architecture, Init Database. ✅ HOÀN THÀNH.
- **Sprint 1:** Authentication (Admin login), Profile CRUD, Danh sách thành viên. ✅ HOÀN THÀNH.
- **Sprint 2:** Cây Gia Phả (Tree Rendering) + Thuật toán duyệt đệ quy. ✅ HOÀN THÀNH.
- **Sprint 3:** Routing, Modal, Storage, Sách Gia Phả. ✅ HOÀN THÀNH.
- **Sprint 4:** Clan Settings + Unit Tests. ✅ HOÀN THÀNH.
- **Sprint 5:** Xuất PDF + Public View. ✅ HOÀN THÀNH.
- **Sprint 6:** Tech Debt — Presentation Refactor, Domain Events, Bug Fixes, Code Splitting. ✅ HOÀN THÀNH.
- **Sprint 7 (26/02 – 05/03/2026):** Bảo mật (Protected Routes + RLS), Mobile Responsive, Refactor ProfileForm.
- **Sprint 8:** Bản tin Dòng Họ (Announcement Board — Section 3.7) + Contribution Flow (LT-701, LT-702).
- **Sprint 9:** TBD — Xác định sau khi Sprint 8 hoàn thành.

## 6. Kế Hoạch Tiếp Theo (Next Steps)
Căn cứ theo **Workflow 01 (Pre-sales)** và **Workflow 02 (Architecture)**:
1. Hai bên xác nhận các yêu cầu trong tài liệu này hợp lệ.
2. PM sẽ tổ chức họp Kick-off và chốt các thỏa thuận bằng biểu mẫu: `01_project_kickoff_meeting.md`.
3. Tech Lead khởi tạo thư mục dự án và thiết kế chi tiết Database Schema (Đã hoàn thiện bản nháp lưu tại `management/02_Architecture_n_Design/architecture_legacy_tree.md`).
