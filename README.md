*Read this in other languages: [English](#english) | [Tiếng Việt](#tiếng-việt)*

---

# <a id="english"></a>🌳 Legacy Tree (Electronic Genealogy) - AI Agentic Built

![Legacy Tree Banner](https://img.shields.io/badge/Status-Active-success) ![AI Built](https://img.shields.io/badge/Built_by-AI_Agents(Antigravity)-purple) ![React](https://img.shields.io/badge/Frontend-React_18-blue) ![Supabase](https://img.shields.io/badge/Backend-Supabase-green)

**Legacy Tree** is a modern Web application that helps Vietnamese families and clans digitize, manage, and preserve their generational history and ancestry records.

🔗 **Live Demo:** [https://legacy.quangit.dev](https://legacy.quangit.dev)

> **💡 Credits & Inspiration:**
> - The wonderful open-source project [**Gia-Pha-Dien-Tu** by **Le Huy Duc Anh (0xAstroAlpha)**](https://github.com/0xAstroAlpha/Gia-Pha-Dien-Tu) was the direct inspiration for the core ideas, business logic, and initial UI/UX of this project.
> - The mindset of building a set of **Skills, Prompts, Workflows** and the philosophy of utilizing an AI Agents system (Antigravity) to fully execute a project from start to finish was deeply inspired by [**this post by Quy Phu Nguyen**](https://www.facebook.com/share/p/18XYiKAgVA/).

✨ **Special Highlight:** This entire project (from Requirements gathering, Architecture design, Agile Sprint planning, to actual Coding, automated Testing, and Code Review) was built entirely from scratch to finish by the **AI Agents (Antigravity)** system.

---

## 🚀 Key Features

- **🗺️ Visual Tree Map:** An interactive, beautiful generational tree view using `React Flow`, with full support for zoom/pan and deep interaction for individual members.
- **📖 Ancestry Book:** A user interface designed like an ancient book that automatically aggregates information, biographies, and family units of every clan member. It is perfectly optimized for physical printing (Print-friendly).
- **👥 Members Management:** A data table that helps search, add, edit, or delete member profiles efficiently. Highly responsive on mobile devices with smart column-hiding logic.
- **⚙️ Clan Settings:** Customize the clan name, the ancestry book's preface, and flexibly change the generation offset calculations.
- **🔒 Security & Authorization (Supabase RLS):** 
  - Secure authentication via Supabase Auth.
  - Strict Database tier permissions (Row Level Security) differentiating Admins (Clan Leaders) and Guests (Viewers). Guests have read-only access.
- **📱 Mobile-First Design:** The UI is completely responsive and looks stunning on mobile devices (e.g., iPhone SE, Android).

---

## 🛠 Tech Stack

The project strictly follows the **Clean Architecture** pattern (clearly separating Domain, Application, Infrastructure, and Presentation layers) to ensure future scalability.

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS v4
- **State Management & Data Fetching:** SWR (for read operations), Context API (for shared states)
- **Database & Auth:** Supabase (PostgreSQL)
- **Tree Visualization:** `@xyflow/react` (React Flow)
- **Icons:** `lucide-react`
- **Agile Management:** All Sprint history, Product Backlog, and Code Reviews are automatically managed by AI via Markdown files.

---

## 🤖 How AI (Antigravity) built this project

This project is not coded conventionally. We established a set of AI Agent Workflows:
1. `01. Pre-sales & Discovery:` Gather requirements, write Product Requirement Documents (PRD).
2. `02. Architecture & Tech Stack:` Finalize system architecture (Clean Architecture).
3. `04. Standard Agile Sprint:` The Agent automatically pulls tasks from the Backlog and conducts weekly Sprint Planning.
4. `06. Feature Dev & PR:` The `Senior_Dev` subagent reads technical specs, modifies code, and fixes bugs autonomously.
5. `07. Code Review:` The `Tech_Lead` subagent reviews the code and enforces rewrites if Clean Architecture rules are violated.

*All decisions, code smells, or tech debts are noted automatically by the AI into Sprint Retrospective meeting files.*

---

## 📦 Local Development Setup

### System Requirements
- Node.js (v18+)
- A Supabase Account (to create a new project)

### Step 1: Clone the repository
```bash
git clone https://github.com/your-repo/legacy-tree.git
cd legacy-tree
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Run Database Migrations
Go to your Supabase Dashboard -> SQL Editor, and run the SQL schema files located in:
`supabase/migrations/`

### Step 5: Start the project
```bash
npm run dev
```
The browser will automatically open at `http://localhost:5173`.

---

## 📜 Credits & Acknowledgments

- Thanks to **[Le Huy Duc Anh (0xAstroAlpha)]**(https://github.com/0xAstroAlpha) for the original idea and the open-source project **Gia-Pha-Dien-Tu** which is extremely meaningful to the community. This project is a remake/re-architect from that inspiration.
- Thanks to **Quy Phu Nguyen** for the pioneering post about applying [AI Agent workflows](https://www.facebook.com/share/p/18XYiKAgVA/) into real-world software engineering. His patience in sharing his set of Skills, Prompts, and Workflows directly served as the foundation for creating the automated processes in this project.
- Built under the dedication of the AI Engineering team aiming toward the vision: **"AI replacing humans to build an entire, real-world Product."**

---

# <a id="tiếng-việt"></a>🌳 Legacy Tree (Gia Phả Điện Tử) - AI Agentic Built

![Legacy Tree Banner](https://img.shields.io/badge/Status-Active-success) ![AI Built](https://img.shields.io/badge/Built_by-AI_Agents(Antigravity)-purple) ![React](https://img.shields.io/badge/Frontend-React_18-blue) ![Supabase](https://img.shields.io/badge/Backend-Supabase-green)

Legacy Tree (Gia Phả Điện Tử) là một ứng dụng Web hiện đại giúp các dòng họ, gia tộc tại Việt Nam số hóa, quản lý và lưu giữ thông tin thế hệ.

🔗 **Live Demo:** [https://legacy.quangit.dev](https://legacy.quangit.dev)

> **💡 Lời tri ân & Cảm hứng:**
> - Dự án mã nguồn mở tuyệt vời [**Gia-Pha-Dien-Tu** của tác giả **Le Huy Duc Anh (0xAstroAlpha)**](https://github.com/0xAstroAlpha/Gia-Pha-Dien-Tu) là nguồn cảm hứng trực tiếp cho toàn bộ ý tưởng, luồng nghiệp vụ và UI/UX ban đầu của dự án này.
> - Tư duy xây dựng bộ **Skill, Prompt, Workflow** và triết lý sử dụng hệ thống AI Agents (Antigravity) để chạy hoàn chỉnh một dự án từ đầu đến cuối được truyền cảm hứng sâu sắc từ [**bài viết này của tác giả Quy Phu Nguyen**](https://www.facebook.com/share/p/18XYiKAgVA/).

✨ **Điểm đặc biệt:** Toàn bộ dự án này (từ khâu thu thập yêu cầu - Requirements, thiết kế kiến trúc - Architecture, lập kế hoạch Sprint theo Agile, cho đến viết Code, tự động Test và Review) đều được xây dựng hoàn toàn từ đầu đến cuối bởi hệ thống **AI Agents (Antigravity)**.

---

## 🚀 Tính năng nổi bật

- **🗺️ Phả đồ trực quan (Tree View):** Hiển thị sơ đồ thế hệ dạng cây phân nhánh đẹp mắt sử dụng thư viện `React Flow`, hỗ trợ zoom/pan và tương tác sâu vào từng thành viên.
- **📖 Phả ký (Ancestry Book):** Giao diện tựa như một cuốn sách cổ, tự động tổng hợp thông tin, tiểu sử và gia đình nhỏ (Family Unit) của từng thành viên, được tối ưu hoàn hảo để in ấn ra giấy (Print-friendly).
- **👥 Quản lý Thành viên (Members List):** Bảng dữ liệu giúp tìm kiếm, thêm/sửa/xóa hồ sơ thành viên nhanh chóng. Responsive cực tốt trên mobile (ẩn/hiện cột thông minh).
- **⚙️ Quản lý Dòng họ (Clan Settings):** Tùy chỉnh tên dòng họ, lời tựa phả ký, thay đổi độ lệch thế hệ (Generation Offset) linh hoạt.
- **🔒 Bảo mật & Phân quyền (Supabase RLS):** 
  - Đăng nhập an toàn qua Supabase Auth.
  - Phân quyền chặt chẽ tầng Database (Row Level Security) giữa Admin (Trưởng tộc) và Guest (Người xem). Khách vãng lai chỉ được xem, không thể sửa đổi dữ liệu.
- **📱 Mobile-First Design:** Giao diện hoàn toàn tương thích và hiển thị đẹp mắt trên các thiết bị di động (iPhone SE, Android).

---

## 🛠 Tech Stack

Dự án tuân thủ nghiêm ngặt mô hình **Clean Architecture** (phân tách rõ ràng giữa Domain, Application, Infrastructure, và Presentation) để đảm bảo khả năng mở rộng trong tương lai.

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS v4
- **State Management & Data Fetching:** SWR (cho read), Context API (cho shared state)
- **Database & Auth:** Supabase (PostgreSQL)
- **Biểu đồ Cây:** `@xyflow/react` (React Flow)
- **Icons:** `lucide-react`
- **Agile Management:** Toàn bộ lịch sử Sprint, Product Backlog, Code Review được AI quản lý bằng file Markdown tự động.

---

## 🤖 Cách AI (Antigravity) xây dựng dự án này

Dự án không được code theo cách truyền thống. Chúng tôi thiết lập một quy trình làm việc (Workflows) cho AI Agent:
1. `01. Pre-sales & Discovery:` Lấy yêu cầu, viết Product Requirements.
2. `02. Architecture & Tech Stack:` Chốt kiến trúc hệ thống (Clean Architecture).
3. `04. Standard Agile Sprint:` AI tự lôi task từ Backlog, lập phiên Sprint Planning đầu tuần.
4. `06. Feature Dev & PR:` Subagent Senior_Dev tự động đọc Specs, sửa code, fix bug.
5. `07. Code Review:` Subagent Tech_Lead đọc lại code, ép phải viết lại nếu vi phạm Clean Architecture.

*Mọi quyết định, code smell, hay tech debt đều được AI tự ghi nhận lại vào biên bản họp Retrospective.*

---

## 📦 Hướng dẫn cài đặt & Chạy cục bộ (Local Development)

### Yêu cầu hệ thống
- Node.js (v18+)
- Tài khoản Supabase (để tạo project mới)

### Bước 1: Clone dự án
```bash
git clone https://github.com/your-repo/legacy-tree.git
cd legacy-tree
```

### Bước 2: Cài đặt thư viện
```bash
npm install
```

### Bước 3: Cấu hình biến môi trường
Tạo file `.env` ở thư mục gốc và điền thông tin Supabase của bạn:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Bước 4: Chạy Migration Database
Vào Dashboard Supabase của bạn -> SQL Editor, chạy nội dung các file cấu trúc trong thư mục:
`supabase/migrations/`

### Bước 5: Khởi động dự án
```bash
npm run dev
```
Trình duyệt sẽ tự động mở tại `http://localhost:5173`.

---

## 📜 Cảm hứng & Lời Cảm Ơn

- Cảm ơn tác giả **[Le Huy Duc Anh (0xAstroAlpha)]**(https://github.com/0xAstroAlpha) vì ý tưởng gốc và open-source dự án **Gia-Pha-Dien-Tu** vô cùng ý nghĩa cho cộng đồng. Dự án này là một bản remake/re-architect từ nguồn cảm hứng đó.
- Cảm ơn tác giả **Quy Phu Nguyen** vì bài viết mang dấu ấn tiên phong về [quy trình ứng dụng AI Agent](https://www.facebook.com/share/p/18XYiKAgVA/) vào thực chiến phần mềm. Sự kiên nhẫn chia sẻ về các bộ Skill, Prompt, và Workflow của anh đã trực tiếp làm nền tảng để tạo ra quy trình tự động hóa cho dự án này.
- Được xây dựng dưới sự tận tâm của đội ngũ AI Engineering hướng tới viễn cảnh **"AI thay con người viết toàn bộ 1 Product thực tế"**.

---
*Created by Antigravity Agents - 2026*
