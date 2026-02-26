# PRESENTATION LAYER — NGUYÊN TẮC KIẾN TRÚC
**Tầm áp dụng:** React, Flutter, SwiftUI, Android Jetpack Compose, Vue, Angular, ...
**Tác giả:** @Tech_Lead | **Ngày:** 25/02/2026

---

## 1. TRIẾT LÝ CỐT LÕI

> **"Một màn hình là một đơn vị độc lập. Xóa nó đi, không có gì khác bị vỡ."**

Presentation layer không phải nơi chứa business logic. Nhiệm vụ duy nhất của nó là **nhận data → hiển thị → phản hồi user input**. Mọi quyết định thiết kế đều xoay quanh triết lý này.

---

## 2. PHÂN TẦNG BÊN TRONG PRESENTATION LAYER

Dù dùng ngôn ngữ/framework nào, Presentation layer luôn có 3 tầng con:

```
┌─────────────────────────────────────────────────┐
│               PRESENTATION LAYER                │
│                                                 │
│  ┌──────────┐   ┌──────────┐   ┌─────────────┐  │
│  │  Screen  │   │  State / │   │  Shared UI  │  │
│  │   Pages  │ → │  ViewModel│   │  Components │  │
│  └──────────┘   └──────────┘   └─────────────┘  │
│        ↓              ↓                         │
│    [Render UI]   [Calls Use Cases]              │
└─────────────────────────────────────────────────┘
                       ↓
              APPLICATION LAYER
```

| Tầng con | Trách nhiệm | Ví dụ (ngôn ngữ độc lập) |
|---|---|---|
| **Screen / Page** | Điều phối layout, compose các component | `TreePage`, `MembersScreen`, `SettingsView` |
| **State / ViewModel** | Giữ và quản lý state của màn hình, giao tiếp với Use Case | `useMembersPage`, `MembersViewModel`, `MembersCubit` |
| **Shared UI Component** | Hiển thị thuần túy, không có state riêng, tái sử dụng được | `Button`, `Modal`, `Avatar`, `LoadingSpinner` |

---

## 3. QUY TẮC TỔ CHỨC THƯ MỤC

### Nguyên tắc: "Feature-first, không phải Type-first"

#### ❌ Type-first (KHÔNG NÊN)
```
presentation/
  screens/          ← tất cả screens dump vào đây
  components/       ← tất cả components dump vào đây
  viewmodels/       ← tất cả viewmodels dump vào đây
  hooks/            ← tất cả hooks dump vào đây
```
**Vấn đề:** Khi thêm màn hình mới, dev phải sửa ở 4 chỗ khác nhau. Không thể nhìn vào thư mục và hiểu được app làm gì.

#### ✅ Feature-first (NÊN DÙNG)
```
presentation/
  pages/ (hoặc screens/, views/)
    <feature-name>/
      <FeatureName>Page       ← Screen/View chính
      components/             ← Sub-components chỉ của màn này
      hooks/ (hoặc viewmodels/, cubits/)
        use<FeatureName>      ← State management của màn này
  components/                 ← Chỉ chứa shared components (dùng ≥ 2 màn hình)
  context/ (hoặc providers/)  ← Global state, cross-cutting concerns
```

**Lợi ích:** Xóa 1 feature = xóa 1 folder. Không ảnh hưởng gì khác.

---

## 4. BA CÂU HỎI PHÂN LOẠI FILE

Khi không biết đặt một file vào đâu, hỏi theo thứ tự:

```
Câu 1: "File này phục vụ bao nhiêu màn hình?"
        │
        ├─ Chỉ 1 màn hình  →  Đặt vào pages/<feature-name>/
        │
        └─ Nhiều hơn 1    →  Câu 2

Câu 2: "File này có state bên trong không?"
        │
        ├─ Không (thuần UI)  →  Đặt vào components/ (shared)
        │
        └─ Có (quản lý data) →  Câu 3

Câu 3: "State này cần share giữa nhiều màn hình không?"
        │
        ├─ Có  →  Đặt vào context/ / providers/
        │
        └─ Không →  Giữ cục bộ trong màn hình đó
```

---

## 5. QUY TẮC ĐẶT TÊN (NGÔN NGỮ ĐỘC LẬP)

| Loại | Pattern đặt tên | Lý do |
|---|---|---|
| Screen / Page | `<Name>Page`, `<Name>Screen`, `<Name>View` | Suffix rõ ràng → biết ngay đây là màn hình gốc |
| State / ViewModel / Hook | `use<Name>`, `<Name>ViewModel`, `<Name>Cubit` | Gắn với tên màn hình → biết ngay nó serve cái gì |
| Shared Component | `<Name>` (không suffix) | Generic, tái sử dụng → không nên gắn với domain cụ thể |
| Global Provider / Context | `<Name>Provider`, `<Name>Context` | Cross-cutting → tên phải nói lên được phạm vi global |

---

## 6. QUY TẮC PATH / IMPORT ALIAS

Dù là ngôn ngữ nào, khi codebase đủ lớn (≥ 3 layer), **phải thiết lập path alias cho các layer lớn**:

| Alias | Trỏ đến layer | Cấu hình tương đương |
|---|---|---|
| `@domain` / `domain/` | Domain layer | `tsconfig paths`, `pubspec` package alias, `Xcode module` |
| `@application` / `usecases/` | Application layer | — |
| `@infrastructure` / `data/` | Infrastructure / Data layer | — |
| `@shared` / `core/` | Shared utilities | — |

**Quy tắc vàng:** Nếu đường dẫn tương đối phải leo quá **2 cấp** (`../../`), đó là dấu hiệu cần alias.

---

## 7. SCREEN LIFE CYCLE — PHÂN CHIA TRÁCH NHIỆM

Mỗi màn hình phải chia rõ trách nhiệm theo vòng đời sau:

```
[Màn hình được khởi tạo]
         │
         ▼
[State/ViewModel] ───── gọi ────► [Use Case / Service]
   Giữ: data, loading,               Xử lý: business logic
         error state                  Trả về: domain data
         │
         ▼
[Screen / Page] ──── render ────► [UI Components]
   Nhận: state thuần                 Hiển thị: UI elements
   Không biết: fetch, DB, API        Không biết: data source
```

**Quy tắc cứng:**
- **Screen/Page KHÔNG** được gọi trực tiếp database / API / repository
- **State/ViewModel KHÔNG** được chứa JSX / Widget / View code
- **Shared Component KHÔNG** được biết đến business domain cụ thể

---

## 8. DẤU HIỆU CẦU REFACTOR (CODE SMELLS)

| Triệu chứng | Bệnh | Cách chữa |
|---|---|---|
| Một màn hình có > 300 dòng | Logic fetch + render + state trộn vào nhau | Tách State/ViewModel ra file riêng |
| Một shared component nhận > 8 props | Component đang gánh quá nhiều case | Tách thành nhiều component chuyên biệt hơn |
| Hai màn hình copy-paste cùng một đoạn code | Chưa extract shared component | Tạo component dùng chung trong `components/` |
| Import path có `../../../../` (≥ 3 cấp) | Thiếu path alias | Thiết lập alias cho layer |
| Screen trực tiếp gọi repository/database | Vi phạm Clean Architecture | Tạo Use Case làm trung gian |
| Xóa 1 màn hình phải sửa > 1 folder | File bị đặt sai chỗ | Áp dụng Feature-first organization |

---

## 9. TỔNG KẾT — CHECKLIST KHI TẠO MÀN HÌNH MỚI

```
□ Tạo thư mục:  pages/<feature-name>/
□ Tạo file:     <FeatureName>Page (Screen/View)
□ Tạo file:     hooks/use<FeatureName> (hoặc ViewModel/Cubit)
□ Screen chỉ gọi hook → không gọi API trực tiếp
□ Hook/ViewModel chỉ gọi Use Case → không gọi DB trực tiếp
□ Import dùng alias (không có ../../..)
□ Component nào dùng ≥ 2 màn hình → chuyển vào components/ shared
□ State share đa màn hình → tạo Context/Provider riêng
```

---

*Nguyên tắc này áp dụng đồng nhất cho mọi dự án trong team, bất kể tech stack.*
*Phê duyệt: @Tech_Lead — LegacyTree Sprint 6 Post-mortem*
