# Development workflow

## Build sequence

1. Confirm the feature belongs to the current product and place new storefront work in its dedicated web artifact.
2. Define or update API contracts in `lib/api-spec/openapi.yaml`.
3. Regenerate typed clients and validation schemas from the OpenAPI document.
4. Implement backend persistence and business rules in focused API routes, domain services, and database schema modules.
5. Implement the Next.js pages and feature modules against the generated client.
6. Run workspace type checks, restart the managed workflows after runtime changes, and check their logs.

## Change rules

- Use TypeScript and preserve strict typing across domain and API boundaries.
- Keep domain modules small and organized by capability; avoid cross-feature imports that bypass public module interfaces.
- Keep generated files generated: update the OpenAPI source and rerun code generation instead of editing generated outputs.
- Make checkout totals and order state authoritative on the server.
- Keep payment providers, identity providers, shipping carriers, and messaging integrations behind explicit adapters.
- Do not simulate successful payment, delivery, or authentication where no real provider is configured.

## Verification and release

- Run `pnpm run typecheck` for changes crossing shared packages.
- Run the affected artifact's typecheck for isolated frontend changes.
- Check API behavior through the shared proxy and confirm the managed API and web workflows start cleanly.
- Publishing is a separate, explicit action after the app has been reviewed and production services have been configured.

## Planned phase gates

- **Phase 1:** searchable catalog, variants, cart, checkout, order creation, and order visibility.
- **Phase 2:** payment, inventory, customer accounts, shipping, returns, and refunds.
- **Phase 3:** campaigns, coupons, reviews, notifications, analytics, and reports.
- **Phase 4:** customization, loyalty, AI, and multi-store capabilities.
