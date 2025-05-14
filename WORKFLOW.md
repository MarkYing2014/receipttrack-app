# Workflow for Receipt Tracker SaaS

## 1. Project Setup
- [ ] Initialize Next.js 15 project with TypeScript.
- [ ] Install Convex and Inngest.

## 2. Convex Backend
- [ ] Initialize Convex.
- [ ] Create basic receipt storage and retrieval functions.

## 3. Inngest Integration
- [ ] Configure Inngest for event-driven workflows.
- [ ] Add a sample event handler (e.g., for new receipt processing).

## 4. API Handlers with CORS
- [ ] Implement `/api/inngest.ts` and `/api/convex.ts` with POST and OPTIONS.
- [ ] Add CORS headers to all API responses.

## 5. UI Components
- [ ] Create `ReceiptForm.tsx` for adding receipts.
- [ ] Create `ReceiptList.tsx` for displaying receipts.

## 6. Connect Frontend and Backend
- [ ] Wire up form to Convex API.
- [ ] Display receipts from Convex.

## 7. Cross-Browser Testing
- [ ] Test all features in Chrome and Safari.
- [ ] Fix any CORS, cookie, or storage issues.

## 8. Documentation
- [ ] Update README with setup, usage, and browser compatibility notes.

## 9. Feature Iteration
- [ ] Add new features (e.g., image upload, categories) and repeat testing/documentation steps.
