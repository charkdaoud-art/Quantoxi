# Quantoxi

Marketing site and partner portal prototype for Quantoxi, a North American AI and data analytics company with a compensated data partnership program.

Built with React 18, Vite, Tailwind CSS, Framer Motion and Lucide icons.

## Run locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (single self-contained dist/index.html)
```

## Configuration

All business figures live in `src/config/siteConfig.js`:

- `company` – business name, location (Toronto, Ontario), email and phone
- `statsMode` – `'demo'` shows illustrative targets with a label; `'production'` shows only stats marked `verified: true`
- `dataRates` – per-record rates (currently 8¢ / 13¢ / 17¢)
- `industries`, `crms`, `timelines`

## Routes (hash-based)

| Hash | Page |
|---|---|
| (none) | Home |
| `#dashboard` | Partner dashboard (synthetic demo data) |
| `#login` | Partner login placeholder |
| `#privacy`, `#terms`, `#agreement` | Legal drafts |

## Prototype status

Working in the browser: earnings calculator, navigation, contact section (email and phone), demo dashboard.

Requires a production backend before launch: authentication, secure upload and storage, consent and authorization verification, payouts, real statistics.

No personal information or payment credentials are collected or transmitted by this prototype.

## Before launch

- Fill in the company placeholders in `siteConfig.js`
- Have Canadian and US privacy counsel review and finalize the legal pages and consent requirements
- Confirm data broker registration obligations in any US states in scope
