# CODING GUIDELINES — LEGACYTREE PROJECT
**Version:** 1.0 | **Tác giả:** @Tech_Lead | **Ngày:** 25/02/2026

---

## 1. QUY TẮC IMPORT — ĐƯỜNG DẪN TUYỆT ĐỐI (Path Aliases)

### ❌ SAI — Tuyệt đối không làm thế này

```ts
// Relative hell — dễ sai, khó đọc, nightmare khi refactor
import { Profile } from '../../../../domain/profiles/Profile';
import { getProfiles } from '../../../application/profile-use-cases/ProfileUseCases';
import { CLAN_NAME } from '../../shared/genealogy/GenealogyConfig';
```

### ✅ ĐÚNG — Dùng Path Aliases

```ts
// Clean, rõ ràng, refactor-proof
import { Profile } from '@domain/profiles/Profile';
import { getProfiles } from '@application/profile-use-cases/ProfileUseCases';
import { CLAN_NAME } from '@shared/genealogy/GenealogyConfig';
```

### Bảng Alias đã được cấu hình

| Alias | Trỏ đến | Dùng khi |
|---|---|---|
| `@domain/*` | `src/domain/*` | Import Entity, Value Object, Interface, Domain Event |
| `@application/*` | `src/application/*` | Import Use Case, Service, DTO |
| `@infrastructure/*` | `src/infrastructure/*` | Import Repository (Supabase), External Service |
| `@presentation/*` | `src/presentation/*` | Import Component, Hook, Context (ít dùng vì cùng layer) |
| `@shared/*` | `src/shared/*` | Import Config, Helper, Constant dùng chung |

> **Lưu ý:** Trong cùng một layer (ví dụ: `presentation`), vẫn dùng relative path ngắn (`./`, `../`) cho các file cùng folder là ĐƯỢC, vì chúng không vi phạm kiến trúc.

---

## 2. QUY TẮC IMPORT THEO LAYER (Clean Architecture)

Phụ thuộc chỉ được phép đi theo một chiều: **Presentation → Application → Domain (← Infrastructure)**

```
Presentation  →  Application  →  Domain
                 ↑
            Infrastructure
```

| Từ Layer | Được import | KHÔNG được import |
|---|---|---|
| `domain/` | Không ai cả (pure) | `application/`, `infrastructure/`, `presentation/` |
| `application/` | `@domain/*`, `@infrastructure/*` | `@presentation/*` |
| `infrastructure/` | `@domain/*` | `@application/*`, `@presentation/*` |
| `presentation/` | `@application/*`, `@domain/*` (type only), `@shared/*` | `@infrastructure/*` trực tiếp |

---

## 3. CẤU TRÚC FILE TRONG MỖI PAGE

Mỗi page trong `src/presentation/pages/<page-name>/` phải tuân theo cấu trúc sau:

```
pages/
  <page-name>/
    <PageName>Page.tsx      ← Component chính — CHỈ chứa JSX/render logic
    components/             ← Sub-components riêng của page này
      <ComponentName>.tsx
    hooks/                  ← Custom hooks riêng của page này
      use<HookName>.ts      ← Data fetching, state management
```

### Template cho một Page mới

```tsx
// src/presentation/pages/example/ExamplePage.tsx

import { WhateverIcon } from 'lucide-react';
import { useExamplePage } from './hooks/useExamplePage';
import { SomeComponent } from './components/SomeComponent';
// Dùng alias để import từ các layer khác
import type { SomeEntity } from '@domain/example/SomeEntity';

interface ExamplePageProps {
    // Props tối giản, không chứa business logic
}

export function ExamplePage({ ...props }: ExamplePageProps) {
    // 1. Hook lấy data — KHÔNG viết useEffect/useState trực tiếp ở đây
    const { data, loading, error, refresh } = useExamplePage();

    // 2. Loading & Error states
    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;

    // 3. Render — thuần JSX
    return (
        <div>
            {/* ... */}
        </div>
    );
}
```

### Template cho một Hook mới

```ts
// src/presentation/pages/example/hooks/useExamplePage.ts

import { useCallback, useEffect, useState } from 'react';
import type { SomeEntity } from '@domain/example/SomeEntity';
import { getSomethingUseCase } from '@application/example-use-cases/ExampleUseCases';

interface UseExamplePageResult {
    data: SomeEntity[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useExamplePage(): UseExamplePageResult {
    const [data, setData] = useState<SomeEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getSomethingUseCase();
            setData(result);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Lỗi không xác định';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { data, loading, error, refresh: fetch };
}
```

---

## 4. QUY TẮC TYPING — KHÔNG DÙNG `any`

```ts
// ❌ SAI
} catch (err: any) {
    setError(err.message);
}
.map((item: any) => ...)

// ✅ ĐÚNG
} catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi không xác định';
    setError(message);
}
.map((item: SpecificType) => ...)
```

---

## 5. CHECKLIST KHI THÊM FILE MỚI

Trước khi commit, dev phải tự kiểm tra:

- [ ] **Imports dùng alias** (`@domain/`, `@application/`, v.v.) thay vì `../../..`
- [ ] **Không vi phạm luồng dependency** (xem Mục 2)
- [ ] **Page component chỉ chứa JSX** — logic đã được extract ra hook
- [ ] **Hook đặt trong** `pages/<name>/hooks/`
- [ ] **Không dùng `any`** — dùng `unknown` + type guard
- [ ] **Build pass** — `npm run build` không có error

---

## 6. PHÂN CHIA MÀN HÌNH TRONG PRESENTATION LAYER

### 6.1 Bản đồ cấu trúc chuẩn

```
src/presentation/
│
├── App.tsx                      ← Router root, layout shell, Context providers
├── main.tsx                     ← Entry point duy nhất
├── index.css                    ← Global CSS / Design tokens
├── styles/
│   └── print.css                ← CSS media-query riêng (print, v.v.)
│
├── assets/                      ← Static assets (svg, img)
│
├── context/                     ← Global React Context (auth, settings)
│   ├── AuthContext.tsx
│   └── ClanSettingsContext.tsx  ← Shared state dùng ở nhiều page
│
├── components/                  ← Shared UI components (KHÔNG phải page)
│   ├── Modal.tsx                ← Generic modal wrapper
│   ├── ProfileForm.tsx          ← Form dùng ở nhiều nơi (create + edit)
│   └── ProfileImageUpload.tsx   ← Hook + logic upload ảnh
│
└── pages/                       ← MỖI màn hình = 1 thư mục riêng
    ├── login/
    │   └── LoginPage.tsx
    ├── tree/
    │   ├── TreePage.tsx
    │   └── components/
    │       ├── TreeNode.tsx
    │       └── OrthogonalEdge.tsx
    ├── ancestry/
    │   ├── AncestryPage.tsx
    │   └── hooks/
    │       └── useAncestryBook.ts
    ├── members/
    │   ├── MembersPage.tsx
    │   └── hooks/
    │       └── useMembersPage.ts
    └── settings/
        ├── SettingsPage.tsx
        ├── components/
        │   ├── ClanSettingsForm.tsx
        │   └── PrefaceEditor.tsx
        └── hooks/
            └── useClanSettings.ts
```

---

### 6.2 Nguyên tắc phân chia: "Cái gì thuộc về đâu?"

#### 🗂️ Đặt vào `pages/<page-name>/` khi:
- Component **chỉ xuất hiện trong đúng 1 màn hình** (không tái sử dụng ở nơi khác)
- Hook **chỉ phục vụ logic của 1 màn hình** duy nhất
- Sub-component là **chi tiết hiển thị của màn hình đó** (ví dụ: `TreeNode`, `PrefaceEditor`)

#### 🗂️ Đặt vào `components/` (shared) khi:
- Component được **dùng ở ít nhất 2 màn hình** khác nhau
- Component là **"building block" thuần UI** không gắn với domain cụ thể nào
- Ví dụ chuẩn: `Modal.tsx`, `ProfileForm.tsx` (dùng tại MembersPage + App.tsx)

#### 🗂️ Đặt vào `context/` khi:
- Cần **chia sẻ state / data** giữa nhiều page (cross-cutting)
- **Không** muốn prop-drill qua nhiều tầng component
- Ví dụ chuẩn: `ClanSettingsContext` — settings được fetch 1 lần duy nhất, cả `TreePage`, `AncestryPage`, `SettingsPage` đều đọc được

---

### 6.3 Các lỗi tiêu biểu đã từng xảy ra trong Sprint 6

| Anti-pattern | Hậu quả | Cách fix |
|---|---|---|
| Đặt `AncestryBook.tsx` vào `components/` | Không rõ đây là page hay component, import nhầm, khó route | Đổi → `pages/ancestry/AncestryPage.tsx` |
| Đặt `useAncestryBook.ts` vào `presentation/hooks/` | Hook bị hiểu là "shared", nhưng thực ra chỉ serve 1 page | Move → `pages/ancestry/hooks/` |
| `ClanSettingsPage.tsx` nằm trong `components/ClanSettings/` | Folder `ClanSettings/` không theo chuẩn `pages/` | Xóa folder, move → `pages/settings/` |
| Logic fetch + sort nằm trực tiếp trong `MembersPage.tsx` | Component quá dài, khó test, vi phạm SRP | Extract → `hooks/useMembersPage.ts` |

---

### 6.4 Quy tắc đặt tên

| Loại file | Convention | Ví dụ |
|---|---|---|
| Page component | `<Name>Page.tsx` | `TreePage.tsx`, `MembersPage.tsx` |
| Shared component | `<Name>.tsx` (PascalCase) | `Modal.tsx`, `ProfileForm.tsx` |
| Page sub-component | `<Name>.tsx` (PascalCase) | `TreeNode.tsx`, `PrefaceEditor.tsx` |
| Page hook | `use<PageName>.ts` hoặc `use<Feature>.ts` | `useMembersPage.ts`, `useAncestryBook.ts` |
| Context | `<Name>Context.tsx` | `AuthContext.tsx`, `ClanSettingsContext.tsx` |

---

### 6.5 "Smell Test" nhanh — Khi nào cần refactor?

Đặt câu hỏi này trước khi viết code:

> **"Nếu màn hình này bị xóa khỏi app, những file nào cần xóa theo?"**

- Nếu câu trả lời là **chỉ 1 thư mục** trong `pages/` → ✅ Cấu trúc tốt, scope rõ ràng
- Nếu câu trả lời là **rải rác khắp nơi** trong `components/`, `hooks/`, `context/` → ❌ Cần refactor, file đang bị đặt sai chỗ

---

*Guideline này được phê duyệt bởi @Tech_Lead. Mọi vi phạm sẽ bị yêu cầu refactor trong Code Review.*
