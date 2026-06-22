# VoltOps Inventory Module — V2

A modular, production-ready inventory management system for EV repair workshops.

## Directory Structure

```
inventory/
├── page.tsx                          ← Root page (orchestrator only)
│
├── types/
│   └── inventory.ts                  ← All TypeScript interfaces & enums
│
├── services/
│   ├── inventoryService.ts           ← All API calls (fetch, add, edit, delete, addStock)
│   └── inventoryUtils.ts             ← Pure functions: status, stats, formatCurrency
│
├── hooks/
│   └── useInventory.ts               ← All state: data, filtering, sorting, pagination, CRUD
│
└── components/
    ├── StatsCards.tsx                ← Summary cards (Total Parts, Value, Low, Out)
    ├── InventoryTable.tsx            ← Table with toolbar, sort, filter, actions
    ├── ui/
    │   ├── StatusBadge.tsx           ← In Stock / Low Stock / Out of Stock badge
    │   ├── Skeletons.tsx             ← Loading skeletons for cards + table
    │   ├── EmptyState.tsx            ← Empty inventory illustration + CTA
    │   ├── ErrorState.tsx            ← Error card with Retry button
    │   └── Pagination.tsx            ← Reusable paginator
    └── modals/
        ├── AddInventoryModal.tsx     ← Create new part
        ├── EditInventoryModal.tsx    ← Edit part (SKU read-only)
        ├── DeleteModal.tsx           ← Confirm deletion
        └── AddStockModal.tsx         ← Add quantity with live preview
```

## Features Implemented

| Step | Feature                     | Status |
|------|-----------------------------|--------|
| 1    | UI Refactor                 | ✅     |
| 2    | Stats Cards                 | ✅     |
| 3    | Realtime Search             | ✅     |
| 4    | Filters (All/Low/OOS)       | ✅     |
| 5    | Sorting (4 fields, 2 dirs)  | ✅     |
| 6    | Table with Status Column    | ✅     |
| 7    | Actions Column (icons)      | ✅     |
| 8    | Edit Modal                  | ✅     |
| 9    | Delete Modal                | ✅     |
| 10   | Add Stock Modal             | ✅     |
| 11   | Empty State                 | ✅     |
| 12   | Loading Skeletons           | ✅     |
| 13   | Error State + Retry         | ✅     |
| 14   | Pagination (10/page)        | ✅     |
| 15   | Backend Compatibility       | ✅     |
| 16   | Future-ready columns        | ✅     |
| 17   | Clean TypeScript code       | ✅     |

## Backend Endpoints Used

### Existing (unchanged)
- `GET  /api/inventory`          → fetch all items
- `POST /api/inventory`          → add new item (server generates SKU)

### New endpoints required
- `PUT   /api/inventory/:id`       → edit item (partName, category, price, alert)
- `DELETE /api/inventory/:id`      → delete item
- `PATCH  /api/inventory/:id/stock` → add stock quantity `{ quantity: number }`

## Integration

1. Drop this folder as `app/inventory/` in your Next.js project.
2. The base URL is set to `http://127.0.0.1:3000/api` in `services/inventoryService.ts`.
   Change it to your environment variable: `process.env.NEXT_PUBLIC_API_URL`.
3. Install Lucide: `npm install lucide-react` (likely already installed in VoltOps).

## Future Placeholders (Step 16)
The table and types are structured to accept:
- `movementHistory` — inventory movement log
- `supplierId` — supplier linkage
- `purchasePrice` — buy vs retail margin
- `aiPrediction` — stock prediction score
- `barcode` — barcode/QR scanner field
- `History` action button already present (disabled) in each row
