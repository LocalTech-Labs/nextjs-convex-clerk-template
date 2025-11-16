# Major Version Updates Requiring Review

This file lists all dependencies that have major version jumps (breaking changes). Please review each one individually before updating.

## Dependencies with Major Version Jumps

### 1. **date-fns**
- **Current Version:** `^3.6.0`
- **Latest Version:** `4.1.0`
- **Version Jump:** 3.x → 4.x
- **Notes:** Major version update may include breaking changes in date formatting, parsing, or API changes.

### 2. **next**
- **Current Version:** `15.3.2`
- **Latest Version:** `16.0.1`
- **Version Jump:** 15.x → 16.x
- **Notes:** Next.js 16 is a major release that may include breaking changes in routing, API routes, or React Server Components.

### 3. **react-day-picker**
- **Current Version:** `^8.10.1`
- **Latest Version:** `9.11.1`
- **Version Jump:** 8.x → 9.x
- **Notes:** Major version update for the calendar/date picker component. May include API changes and styling updates.

### 4. **recharts**
- **Current Version:** `^2.15.4`
- **Latest Version:** `3.4.1`
- **Version Jump:** 2.x → 3.x
- **Notes:** Major version update for charting library. May include breaking changes in chart configuration and component APIs.

### 5. **zod**
- **Current Version:** `^3.25.76`
- **Latest Version:** `4.1.12`
- **Version Jump:** 3.x → 4.x
- **Notes:** Major version update for schema validation library. May include breaking changes in schema definitions and validation APIs.

## DevDependencies with Major Version Jumps

### 6. **@types/node**
- **Current Version:** `^20.19.8`
- **Latest Version:** `24.10.0`
- **Version Jump:** 20.x → 24.x
- **Notes:** Major version jump in Node.js type definitions. This likely corresponds to Node.js version updates. Ensure your Node.js runtime version is compatible.

### 7. **eslint-config-next**
- **Current Version:** `15.3.2`
- **Latest Version:** `16.0.1`
- **Version Jump:** 15.x → 16.x
- **Notes:** This follows the Next.js version. Update this together with Next.js.

## Summary

**Total Major Version Jumps:** 7 dependencies

**Critical Updates (Framework):**
- `next` (15 → 16)
- `eslint-config-next` (15 → 16) - follows Next.js

**Critical Updates (Core Libraries):**
- `zod` (3 → 4)
- `date-fns` (3 → 4)

**Component Library Updates:**
- `react-day-picker` (8 → 9)
- `recharts` (2 → 3)

**Type Definitions:**
- `@types/node` (20 → 24)

---

**Recommendation:** Review each major update individually, starting with Next.js 16 as it's the framework foundation. Test thoroughly after each update.
