# STANDARD CLEAN ARCHITECTURE PROJECT TEMPLATE

Đây là cấu trúc dự án tuân thủ chuẩn Clean Architecture nguyên thủy của Uncle Bob (Robert C. Martin), được tinh gọn để áp dụng cho mọi dự án phần mềm từ nhỏ đến lớn (Web Backend, Mobile App, Frontend SPA), không bị trói buộc vào tư duy "Enterprise nặng nề".

> **Tầm áp dụng:** React, Flutter, SwiftUI, Android Jetpack Compose, Vue, Angular, .NET, Node.js, ...

---

## 1. CẤU TRÚC THƯ MỤC GỐC (Folder Structure)

```text
src/
├── Domain/                # Core domain logic — KHÔNG import bất kỳ layer nào khác
│   ├── <Feature>/         # Entities, Value Objects, Domain Events, Interfaces (Ports)
│   └── Core/              # Shared domain primitives: EventDispatcher, base classes
│
├── Application/           # Business logic & Use Cases — chỉ import Domain
│   ├── <Feature>UseCases/ # Use Cases / Services / Commands / Queries
│   └── <Feature>Events/   # Application-level event handlers (nếu dùng CQRS)
│
├── Infrastructure/        # External implementations — import Domain & Application
│   ├── Core/              # DB connection, ORM config, Supabase client, ...
│   ├── Repository/        # Concrete implementations of Domain Interfaces
│   └── ExternalServices/  # Third-party: Analytics, Audit Log, Push Notification, ...
│
├── Presentation/          # UI & User Interaction — import Application & Domain (type only)
│   ├── pages/ (screens/)  # Mỗi màn hình = 1 thư mục riêng (xem Mục 4)
│   ├── components/        # Shared UI components (dùng ≥ 2 màn hình)
│   ├── context/ (providers/) # Global state, cross-cutting concerns
│   └── App / Router       # Entry point, route config, context wiring
│
└── Shared/                # Cross-layer utilities — không thuộc layer nào
    └── <domain>/          # Constants, Helpers, Config không chứa business logic
```

---

## 2. QUY TẮC PHỤ THUỘC (Dependency Rules)

Phụ thuộc chỉ được phép đi **từ ngoài vào trong**:

```
Presentation  →  Application  →  Domain
                     ↑
               Infrastructure
```

| Layer | Được import | KHÔNG được import |
|---|---|---|
| `Domain` | Không ai — thuần ngôn ngữ | Tất cả |
| `Application` | `Domain`, `Infrastructure` (qua Interface) | `Presentation` |
| `Infrastructure` | `Domain` | `Application`, `Presentation` |
| `Presentation` | `Application`, `Domain` (type only), `Shared` | `Infrastructure` trực tiếp |

**3 Quy Tắc Sống Còn:**

1. **Dependency Rule:** Source code chỉ `import` từ ngoài vào trong. `Domain` không import gì cả.
2. **Dependency Inversion:** `Application` KHÔNG gọi trực tiếp `Infrastructure`. Nó định nghĩa Interface (Port) — `Infrastructure` implement Interface đó.
3. **Framework Independence:** Framework-specific code chỉ tồn tại ở `Infrastructure` và `Presentation`. `Domain` và `Application` phải là mã nguồn thuần.

---

## 3. PATH ALIAS — BẮT BUỘC KHI CÓ ≥ 3 LAYERS

Khi codebase đủ lớn, **phải thiết lập path alias cho mỗi layer**. Không dùng relative import leo quá 2 cấp (`../../`).

### Bảng alias chuẩn

| Alias | Trỏ đến | Cấu hình tương đương |
|---|---|---|
| `@domain` | `src/Domain/` | `tsconfig paths`, Dart package, Xcode module |
| `@application` | `src/Application/` | — |
| `@infrastructure` | `src/Infrastructure/` | — |
| `@shared` | `src/Shared/` | — |

### ❌ SAI — Relative hell
```
import { Profile } from '../../../../domain/profiles/Profile';
import { getProfiles } from '../../../application/use-cases/ProfileUseCases';
```

### ✅ ĐÚNG — Path alias
```
import { Profile } from '@domain/profiles/Profile';
import { getProfiles } from '@application/use-cases/ProfileUseCases';
```

> **Quy tắc vàng:** Nếu thấy `../../..` thứ 3 trở đi → đó là dấu hiệu bắt buộc phải dùng alias.

---

## 4. PRESENTATION LAYER — CẤU TRÚC NỘI BỘ

### 4.1 Triết lý cốt lõi

> **"Một màn hình là một đơn vị độc lập. Xóa nó đi, không có gì khác bị vỡ."**

Presentation layer có 3 tầng con, bất kể framework:

```
┌───────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                   │
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Screen/Page  │  │  State /     │  │  Shared UI  │  │
│  │              │→ │  ViewModel   │  │  Components │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│    Render only       Calls UseCases   Reusable UI      │
└───────────────────────────────────────────────────────┘
                           ↓
                   APPLICATION LAYER
```

| Tầng con | Trách nhiệm | React | Flutter | Android |
|---|---|---|---|---|
| **Screen/Page** | Layout, compose components, điều hướng | `MembersPage.tsx` | `MembersScreen.dart` | `MembersFragment.kt` |
| **State/ViewModel** | Giữ state, gọi Use Case, xử lý error | `useMembersPage.ts` | `MembersCubit.dart` | `MembersViewModel.kt` |
| **Shared Component** | Hiển thị thuần, không có state riêng | `Modal.tsx` | `AppButton.dart` | `AvatarView.kt` |

### 4.2 Cấu trúc thư mục Feature-first (KHÔNG phải Type-first)

#### ❌ Type-first (KHÔNG NÊN)
```
presentation/
  screens/       ← dump tất cả screens vào đây
  components/    ← dump tất cả components vào đây
  viewmodels/    ← dump tất cả viewmodels vào đây
```
**Vấn đề:** Thêm feature mới → sửa ở nhiều folder. Xóa feature → không biết xóa gì.

#### ✅ Feature-first (NÊN DÙNG)
```
presentation/
  pages/ (screens/)
    <feature-name>/
      <FeatureName>Page       ← Screen/View chính — chỉ chứa render
      components/             ← Sub-components chỉ dùng cho màn hình này
      hooks/ (viewmodels/, cubits/)
        use<FeatureName>      ← State management của màn hình này
  components/                 ← CHỈ shared components (dùng ≥ 2 màn hình)
  context/ (providers/)       ← Global state, cross-cutting concerns
```

### 4.3 Ba câu hỏi phân loại file

Khi không biết đặt file vào đâu, hỏi theo thứ tự:

```
Câu 1: "File này phục vụ bao nhiêu màn hình?"
        │
        ├─ Chỉ 1 màn hình  →  Đặt vào pages/<feature-name>/
        │
        └─ Nhiều hơn 1     →  Câu 2

Câu 2: "File này có state bên trong không?"
        │
        ├─ Không (thuần UI)  →  Đặt vào components/ (shared)
        │
        └─ Có (quản lý data)  →  Câu 3

Câu 3: "State này cần share giữa nhiều màn hình không?"
        │
        ├─ Có   →  Đặt vào context/ / providers/
        │
        └─ Không →  Giữ cục bộ trong pages/<feature-name>/
```

### 4.4 Quy tắc đặt tên (ngôn ngữ độc lập)

| Loại | Pattern | Ví dụ |
|---|---|---|
| Screen / Page | `<Name>Page`, `<Name>Screen`, `<Name>View` | `TreePage`, `MembersScreen` |
| State / ViewModel | `use<Name>`, `<Name>ViewModel`, `<Name>Cubit` | `useMembersPage`, `MembersCubit` |
| Shared Component | `<Name>` (không suffix) | `Modal`, `Avatar`, `Button` |
| Global Provider | `<Name>Provider`, `<Name>Context` | `AuthContext`, `ThemeProvider` |

### 4.5 Screen life cycle — Phân chia trách nhiệm cứng

```
[Màn hình được khởi tạo]
         │
         ▼
[State/ViewModel] ─── gọi ──────► [Use Case / Service]
   Quản lý: data, loading,            Xử lý: business logic
            error state               Trả về: domain data
         │
         ▼
[Screen / Page] ──── render ────► [UI Components]
   Nhận: state thuần                  Hiển thị: UI elements
   Không biết: API, DB                Không biết: data source
```

**Quy tắc cứng — không ngoại lệ:**
- Screen/Page **KHÔNG** gọi trực tiếp database / API / repository
- State/ViewModel **KHÔNG** chứa markup / Widget / View code
- Shared Component **KHÔNG** biết đến business domain cụ thể nào

---

## 5. CODE SMELLS — DẤU HIỆU CẦN REFACTOR

| Triệu chứng | Bệnh | Cách chữa |
|---|---|---|
| Screen > 300 dòng | Logic fetch + render + state trộn lẫn | Extract ViewModel/Hook ra file riêng |
| Shared component nhận > 8 props | Gánh quá nhiều use case | Tách thành nhiều component chuyên biệt |
| 2 màn hình copy-paste cùng 1 đoạn | Chưa extract shared component | Tạo component dùng chung ở `components/` |
| Import path có `../../../../` (≥ 3 cấp) | Thiếu path alias | Thiết lập alias cho layer |
| Screen gọi trực tiếp repository | Vi phạm Clean Architecture | Tạo Use Case làm trung gian |
| Xóa 1 màn hình phải sửa > 1 folder | File đặt sai chỗ | Áp dụng Feature-first organization |
| Hook/ViewModel đặt ở global `hooks/` | Bị hiểu là shared nhưng thực ra cục bộ | Move vào `pages/<feature>/hooks/` |

---

## 6. CHECKLIST KHI TẠO FEATURE MỚI

```
□ Thêm Domain Entity / Event vào Domain/<Feature>/
□ Viết Use Case vào Application/<Feature>UseCases/
□ Implement Repository / Service vào Infrastructure/
□ Tạo thư mục:  pages/<feature-name>/
□ Tạo file:     <FeatureName>Page (Screen/View) — chỉ chứa render
□ Tạo file:     hooks/use<FeatureName>  (hoặc ViewModel/Cubit)
□ Screen chỉ gọi hook/viewmodel → không gọi API hoặc DB trực tiếp
□ Hook/ViewModel chỉ gọi Use Case → không gọi DB trực tiếp
□ Import dùng alias — không có ../../.. (≥ 3 cấp)
□ Component dùng ≥ 2 màn hình → move vào components/ shared
□ State share đa màn hình → tạo Context/Provider riêng
□ Build pass — 0 errors
```

---

*Template này được duy trì bởi @Tech_Lead.*
*Cập nhật lần cuối: 25/02/2026 — Bổ sung Presentation Layer Principles từ Sprint 6 LegacyTree post-mortem.*
