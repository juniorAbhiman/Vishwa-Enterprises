# Vishwa Enterprises

A modular, type-safe clothing-commerce platform for Vishwa Enterprises JNP. The first release focuses on product discovery, variant selection, a persistent shopping cart, checkout, and order management, with a clear path toward inventory, marketing, analytics, and multi-store operations.

## Product scope

The attached product requirements define a broader commerce platform. Development is phased:

1. **Core storefront:** products, categories, variants, search and filters, cart, checkout, and orders.
2. **Business operations:** payments, inventory, customers, shipping, returns, and refunds.
3. **Growth:** banners, coupons, promotions, reviews, notifications, and analytics.
4. **Advanced:** customization, loyalty, AI features, and multi-store support.

The initial build implements the core shopping experience and establishes the application structure for the next phases. External payment processing and customer authentication are not represented as live integrations until providers and account requirements are confirmed.

## Technology

- Next.js with TypeScript for the web application.
- The shared API service and OpenAPI-generated types for server-backed commerce operations.
- PostgreSQL and Drizzle ORM for durable data.
- pnpm workspace packages for modular application and shared-library boundaries.

## Getting started

Use the workspace's managed web and API workflows to run the application. Common checks:

```sh
pnpm run typecheck
pnpm --filter @workspace/api-spec run codegen
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for module boundaries and [WORKFLOW.md](WORKFLOW.md) for development and release flow.
