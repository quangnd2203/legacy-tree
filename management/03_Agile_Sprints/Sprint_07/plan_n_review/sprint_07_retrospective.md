# BIÊN BẢN HỌP: SPRINT RETROSPECTIVE (CẢI TIẾN LIÊN TỤC)

**Dự án:** Legacy Tree | **Sprint:** 07
**Ngày họp:** 26/02/2026
**Quy tắc ngầm (Prime Directive):** "Bất kể điều gì đã xảy ra trong Sprint trước, chúng ta tin rằng mỗi cá nhân đã cố gắng hết sức theo khả năng của họ lúc đó. Cuộc họp này là để TÌM LỖI HỆ THỐNG, KHÔNG PHẢI TÌM LỖI CON NGƯỜI."
**Thành phần tham dự:** @Senior_Dev, @Tech_Lead, @Managing_Director_PM, @QA

---

## 1. THU THẬP DỮ LIỆU SPRINT VỪA RỒI
- **Velocity đạt được:** 28/28 điểm cam kết (100% hoàn thành).
- **Số Bug trả lại từ QA (Re-open rate):** 0
- **Khối lượng công việc:** Khá ổn định, không block nhau. Tốc độ triển khai rất nhanh.

## 2. PHÂN TÍCH THEO MÔ HÌNH (MAD - SAD - GLAD)

### 🟢 GLAD (Cái Gì TỐT - Nên phát huy)
- @Senior_Dev: "Các sub-tasks và Tech Spec phân tích trong `sprint_07_tasks.md` vô cùng chi tiết, tôi code trơn tru mà không cần hỏi lại yêu cầu."
- @Tech_Lead: "Code chất lượng rất cao, TailwindCSS áp dụng mobile-first pattern chuẩn xác mà không cần class tuỳ chỉnh nào."
- @Managing_Director_PM: "100% tỷ lệ hoàn thành Sprint 7 ngay khi vừa vào Sprint. Quá nhanh! Chúng ta đã cover Tech Debt và Security."

### 🔴 SAD (Cái Gì CHƯA TỐT - Cần né tránh)
- @Tech_Lead: "Chưa có vấn đề trầm trọng. File `AncestryPage.tsx` có dung lượng khá lớn (446 dòng) do gánh cả logic in ấn, nhưng vẫn nằm trong mức an toàn."

### 🟣 MAD (Cái Gì GÂY ỨC CHẾ - Phải diệt tận gốc)
- @QA: "Không có lỗi gì gây ức chế trong Sprint này. Tiến độ rất tuyệt vời."

## 3. HÀNH ĐỘNG CẢI TIẾN (ACTION ITEMS)
| STT | Vấn đề | Giải pháp đề xuất | Người xử lý (Owner) | Deadline |
|:---:|:---|:---|:---:|:---:|
| 1 | Thấy có UI Component to (`AncestryPage.tsx`) | Nếu gặp logic phức tạp thêm vào tương lai, có thể tách logic layout/print ra 1 Custom Hook. Chưa cần làm ngay nhưng phải theo dõi nợ kỹ thuật. | @Tech_Lead | Monitor in Sprint 8 |
