# Architecture

## Goals

- Keep product, cart, checkout, and order concepts in focused modules.
- Use strict TypeScript types from the API contract through the UI.
- Keep business rules in server-side domain services rather than duplicating them across screens.
- Make additions such as inventory, promotions, returns, and multiple warehouses incremental.

## System boundaries

```text
Next.js web application
  ├── storefront routes and admin workspace
  ├── feature modules: catalog, discovery, cart, checkout, orders
  └── typed API client
          │
          ▼
Shared API service (Express)
  ├── versioned commerce routes
  ├── validation at request boundaries
  ├── commerce domain services
  └── Drizzle repositories
          │
          ▼
PostgreSQL
```

The OpenAPI document is the source of truth for API contracts. Generated clients and validators are derived from it; generated files must not be edited by hand.

## Initial domain modules

- **Catalog:** products, categories, collections, brands, and product variants.
- **Discovery:** query, category, size, color, availability, and price filtering; sorting.
- **Cart:** selected product variant, quantity, and calculated totals.
- **Checkout:** customer and delivery details, shipping calculation, and order creation.
- **Orders:** order summary and status tracking.
- **Administration:** product publishing and order operations, to be expanded with role-specific permissions.

## Data and trust boundaries

- Validate all API input and output at server boundaries.
- Calculate prices, discounts, shipping, and order totals on the server.
- Do not store payment credentials or claim that a payment has been collected without a configured payment provider.
- Persist cart convenience data client-side only when appropriate; the order is authoritative on the server.
- Protect administration routes with managed authentication and role-based authorization before production use.

## Growth path

Phase 2 adds inventory, payment-provider adapters, customer accounts, shipping, return, and refund modules. Phase 3 adds promotion and content management, reviews, notifications, analytics, and reports. Phase 4 adds customization, loyalty, AI capabilities, and multi-store support.
