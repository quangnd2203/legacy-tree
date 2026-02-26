---
description: Thiết lập môi trường, Repository và CI/CD cơ bản
---
# 03. Sprint Zero Setup Workflow

Giai đoạn chuẩn bị hạ tầng kỹ thuật trước khi bắt đầu các vòng lặp Sprint sản xuất tính năng.

### Bước 1: Quản lý Mã nguồn (VCS)
- [ ] **Khởi tạo Repository**
  - `@Tech_Lead` cấu trúc thư mục dự án và thiết lập Git Flow.
- [ ] **Phân quyền truy cập**
  - `@Managing_Director_PM` cấp quyền cho các thành viên.

### Bước 2: Thiết lập hạ tầng CI/CD
- [ ] **Cấu hình Pipeline cơ bản**
  - Gọi `@Tech_Lead` để setup auto build/deploy lên môi trường Development.
  - *Lệnh mẫu:* `@Tech_Lead /write Hãy soạn thảo file cấu hình GitHub Actions cơ bản để tự động chạy Unit Test khi có PR.`

### Bước 3: Chuẩn bị môi trường thiết kế & Test
- [ ] **Khởi tạo Design Workspace**
  - `@Designer` setup file Figma và Design System.
- [ ] **Khởi tạo Test Management**
  - `@QA` setup công cụ log bug và quản lý test cases.

### Bước 4: Chốt Definition of Done (DoD)
- [ ] **Thống nhất tiêu chuẩn hoàn thành**
  - Toàn team họp để chốt khi nào một ticket được coi là XONG.

### Bước 5: Khởi tạo Cây thư mục Lưu trữ Biên bản (Evidence Vault)
- [ ] **Tạo cấu trúc thư mục quản trị dự án**
  - `@Tech_Lead` chịu trách nhiệm tạo cấu trúc thư mục `/management` ngay trong gốc dự án để lưu mọi Bằng chứng (Biên bản, Báo cáo) sau khi điền Template.
  - Cấu trúc bắt buộc:
    ```text
    /management/
      ├── /01_Requirements_n_Contracts/   # Lưu KS Hiện trạng, Proposal, Kickoff (Template 01)
      ├── /02_Architecture_n_Design/      # Lưu System Arch, DB Schema, DoD, Template 09
      ├── /03_Agile_Sprints/              # Lưu thư mục con theo Sprint (Sprint_01, Sprint_02...)
      │   └── /Sprint_01/
      │       ├── plan_n_review/          # Lưu Planning (Tmp02), Review (Tmp04), Retro (Tmp05)
      │       └── daily_reports/          # Lưu Daily (Tmp03), Work Logs (Tmp07)
      ├── /04_Quality_n_Review/           # Lưu PR Reviews (Template 08), SIT Reports
      ├── /05_Security_n_Migration/       # Lưu Security Audit, Data Mapping
      ├── /06_Releases_n_UAT/             # Lưu UAT Sign-off, CI/CD Release Notes
      ├── /07_Operations_n_Incidents/     # Lưu Post-Mortem (Template 06), Performance Logs
      └── /08_Handover_n_Support/         # Lưu User Manuals, Training Minutes, Post-Live Feedback
    ```
  - *Lệnh mẫu:* `@Tech_Lead /write Dựa trên quy chuẩn công ty, hãy viết Bash Script tự động tạo cây thư mục /management 8 nhánh này để quản trị dự án.`
