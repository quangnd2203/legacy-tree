# BIÊN BẢN HỌP: SPRINT RETROSPECTIVE (CẢI TIẾN LIÊN TỤC)

**Dự án:** LegacyTree | **Sprint:** 03
**Ngày họp:** 25/02/2026 — Ngay sau buổi Sprint Review
**Quy tắc ngầm (Prime Directive):** *"Cuộc họp này để TÌM LỖI HỆ THỐNG, KHÔNG PHẢI TÌM LỖI CON NGƯỜI."*
**Thành phần tham dự:** @Antigravity (Tech Lead & Senior Dev), @USER (PM)

---

## 1. THU THẬP DỮ LIỆU SPRINT

| Chỉ số | Kết quả | Đánh giá |
|---|---|---|
| Velocity | 44 / 39 SP (cam kết ban đầu 39 SP, làm được 44 SP) | ✅ Tốt hơn kế hoạch |
| Ticket Done | 10 / 10 | ✅ |
| Ticket Rollover | 0 | ✅ |
| Bug phát sinh trong Sprint | 2 (LT-311) | ⚠️ Phát hiện muộn (lúc Demo) |
| Ticket phát sinh ngoài kế hoạch | 1 (LT-310) | ⚠️ Không được estimate trước |

---

## 2. PHÂN TÍCH THEO MÔ HÌNH (MAD - SAD - GLAD)

### 🟢 GLAD — Cái Gì TỐT, Nên Phát Huy

- **Tốc độ phản ứng cao:** Hai bug (con gái lập hộ sai, sort sai thứ bậc) được phát hiện ngay trong Demo và fix trực tiếp trong Sprint, không cần Rollover.
- **Clean Architecture nghiêm túc:** Việc refactor LT-305→LT-308 đặt nền tảng vững chắc, giúp LT-310 (Dual-date System) chỉ cần sửa đúng 5 file theo đúng tầng, không đụng chạm nhộn xạ.
- **Tech Lead → Senior Dev workflow hiệu quả:** Phân tách vai trò rõ ràng — Tech Lead review & ra spec, Senior Dev execute. Giúp tránh "làm luôn mà quên document".
- **Yêu cầu phát sinh (LT-310) được xử lý gọn trong Sprint:** Không làm ảnh hưởng đến các ticket ban đầu.

---

### 🔴 SAD — Cái Gì CHƯA TỐT, Cần Né Tránh

- **Thiếu kiểm thử sớm (Early testing):** Hai bug liên quan đến logic Phả ký (con gái lập hộ, thứ bậc sắp xếp hộ) lẽ ra phải được phát hiện ngay lúc code, không phải lúc Demo. Nguyên nhân: không có unit test cho `processAncestryBook()`.
- **Không có Unit Test:** Suốt Sprint 3, không một bộ test nào được viết. Đây là vi phạm trực tiếp DoD của Workflow 05. Nếu business logic `ProcessAncestryBook.ts` bị sai, không có gì "catch" được khi Deploy.
- **Planning chưa tính Acceptance Criteria cụ thể:** Ticket LT-304 (Phả ký) thiếu tiêu chí "con gái không lập hộ" và "thứ tự hộ theo Seniority Index". Nếu có AC rõ thì bug sẽ không qua được bước code review.
- **DB Migration không nằm trong quy trình tự động:** LT-310 yêu cầu chạy tay SQL trên Supabase mà không có script migration được version-control. Đây là rủi ro nếu sau này cần rollback hoặc có thêm người tham gia deploy.

---

### 🟣 MAD — Cái Gì GÂY ỨC CHẾ, Phải Diệt Tận Gốc

- **Thuật toán `FamilyTree.tsx` phức tạp nhưng chưa có comment giải thích:** Phần tính toán `layoutNode`, `genMap`, `getPartners` rất tinh vi nhưng hoàn toàn thiếu JSDoc. Nếu một Dev mới vào đọc code này, sẽ không hiểu gì trong 1 giờ đầu.
- **Lỗi Đời 4 lên trên Đời 1 trong Cây gia phả (FamilyTree):** Lỗi này đã được fix trong Sprint nhưng nguyên nhân gốc (thuật toán tính `y` dùng tham số tương đối thay vì tuyệt đối theo generation) phản ánh một thiếu sót trong thiết kế ban đầu. Cần review lại toàn bộ thuật toán layout sau khi có thêm dữ liệu test phức tạp hơn.
- **Duplicate header `## 4. GHI CHÚ TECH LEAD`** xuất hiện 2 lần trong file `sprint_03_planning.md` — cho thấy quy trình chỉnh sửa document thiếu consistency.

---

## 3. HÀNH ĐỘNG CẢI TIẾN CHO SPRINT 4 (ACTION ITEMS)

| STT | Vấn đề | Giải pháp đề xuất | Owner | Deadline |
|:---:|:---|:---|:---:|:---:|
| 1 | **Không có Unit Test** | Viết ít nhất **1 bộ test** cho hàm `processAncestryBook()` và `sortProfilesByTraditionalSeniority()` — đây là core logic, phải được bảo vệ | @Senior_Dev | Sprint 4 — tuần đầu |
| 2 | **Acceptance Criteria mờ nhạt** | Mỗi ticket trong Sprint Planning phải có mục **AC (Acceptance Criteria)** dạng checklist cụ thể trước khi dev bắt tay làm | @Tech_Lead + @PM | Sprint Planning 4 |
| 3 | **DB Migration chạy tay** | Tạo thư mục `supabase/migrations/` và lưu toàn bộ các SQL script theo format `YYYYMMDD_description.sql` vào đó để version-control | @Senior_Dev | Sprint 4 — tuần đầu |
| 4 | **Thiếu JSDoc trong `FamilyTree.tsx`** | Bổ sung comment/JSDoc cho các hàm `layoutNode`, `buildGenMap`, `getPartners` giải thích rõ thuật toán và các edge case | @Senior_Dev | Sprint 4 |
| 5 | **Bug mãi đến Demo mới phát hiện** | Thêm bước **"Self-demo trên data thực"** vào DoD của mỗi ticket trước khi báo Done — không chỉ `npm run dev` là xong | Toàn bộ team | Áp dụng ngay Sprint 4 |

---

## 4. KẾT LUẬN

> Sprint 3 đạt kết quả **xuất sắc về mặt delivery** (100% Ticket, 0 Rollover). Tuy nhiên, **nền tảng chất lượng** (Testing, Documentation, Migration process) vẫn còn nhiều khoảng trống cần lấp đầy trước khi dự án chuyển sang giai đoạn Public/Production.
>
> **Sprint 4 phải là Sprint lấy lại nợ kỹ thuật (Technical Debt) về chất lượng — không chỉ chạy theo tính năng.**

---

*Biên bản Retrospective được lập bởi @Antigravity (Tech Lead) ngày 25/02/2026.*
