# Project Rules for Receipt Tracker SaaS

## 1. Code Quality
- All code must be written in TypeScript (for both frontend and backend).
- Use functional React components and hooks.
- Follow Next.js and Convex best practices.
- All API endpoints must include proper CORS headers for cross-browser compatibility.

## 2. Browser Compatibility
- All features must be tested in both Chrome and Safari (including Safari Private mode).
- Avoid using browser APIs that are not supported in Safari.
- If using cookies, set `SameSite=None; Secure` and avoid third-party cookies.
- Use tokens in headers for authentication instead of cookies where possible.

## 3. Security
- Never expose sensitive keys or secrets in the frontend.
- Validate all user input on both client and server.
- Use HTTPS for all API calls.

## 4. Documentation
- Every new feature or fix must be documented in the README.
- Document any browser-specific issues and their solutions.

## 5. Collaboration
- Use clear commit messages.
- Review all code before merging.
- Discuss major changes in Windsurf before implementation.
