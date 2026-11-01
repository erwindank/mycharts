# Super Admin — plan

A private admin page at **dankcharts.fm/admin.html** to manage accounts, account
types, errors and money. Only super admins can open it. Built step by step, and
each step is reviewed before the next one starts.

Decisions (2026-11-01):
- Separate `admin.html` + `admin.js`. Normal visitors never load the admin code.
- Finances: a manual ledger for now. Subscription income plugs in once payments exist.
- Delete = account + all data, after a backup copy is kept for 30 days and can be restored.
- English only. Only admins see it, so no translations.

---

## How it fits together

```
admin.html / admin.js  ──(Firebase ID token)──▶  functions/admin/[[path]].js  (Cloudflare)
        │                                              │  service-account key (secret)
        │  reads errors / own admin doc                ├─▶ Identity Toolkit REST  (list / disable / delete logins)
        ▼                                              └─▶ Firestore REST         (read & write any user's data)
     Firestore (rules)
```

- **Why a server piece:** the browser SDK can't list, disable or delete other
  people's logins. That needs Firebase's admin API, which needs a secret key, and
  the key can't live in the page. The site already runs Cloudflare Functions
  (`grammy-proxy`, `deezer-proxy`), so this is one more.
- **No firebase-admin package:** Cloudflare Functions aren't Node. The function
  signs its own Google OAuth token with WebCrypto (RS256 JWT from the
  service-account key) and calls the REST APIs directly.
- **Every request is checked:** the caller sends their Firebase ID token. The
  function verifies its signature against Google's public keys (`aud`/`iss` =
  `dankcharts`, not expired), then checks that `superAdmins/{uid}` exists.
  Anything else gets a 403.
- **Super admins** go in `superAdmins/{uid}`, an empty doc created by hand in the
  Firebase Console, the same way as `boardAdmins`. Nobody can write it from the site.

### New Firestore collections

| Collection | Who can read | Who can write | Holds |
|---|---|---|---|
| `superAdmins/{uid}` | that user (own doc only) | nobody (Console) | marker |
| `accounts/{uid}` | that user (own doc) | admin function only | plan, status, notes |
| `deletedUsers/{uid}` | nobody | admin function only | 30-day backup of a deleted account |
| `errorReports/{id}` | nobody | anyone may *create* (strict size/keys) | error log |
| `adminLedger/{id}` | nobody | admin function only | income / cost entries |

The function uses the service account, which skips the rules. So "nobody" in the
rules still lets the admin page get at these through the function.
Rules changes must be **pasted into the Firebase Console**, as before.

---

## Steps

### 1. Back end foundation
- `functions/admin/[[path]].js`: token signing, ID-token check, super-admin
  check, JSON helpers, and `GET /admin/me` ("are you a super admin?").
- Cloudflare secrets: `FB_SA_EMAIL`, `FB_SA_KEY`. Local testing uses
  `.dev.vars`, which goes in .gitignore.
- Rules: `superAdmins`.
- **You do once:** Firebase Console → Project settings → Service accounts →
  Generate key. Paste the two values into Cloudflare Pages → Settings →
  Variables (encrypted). Create your `superAdmins/{your uid}` doc. I'll write
  click-by-click instructions.

### 2. Users list (admin.html)
- Page shell: sign in with Google, then "not an admin" or the dashboard. Reuses
  the site's style.css tokens and theme.
- `GET /admin/users`: every login (Identity Toolkit `accounts:batchGet`, paged)
  merged with Firestore info: data source (Last.fm / Sheets / CSV, from their
  config), last saved, rough storage size, moderator yes/no, plan, disabled.
- Table with search (name/email/uid), sorting, and filters (source, plan,
  moderator, disabled).

### 3. User detail + actions
- Click a user → side panel: profile, dates, sign-in provider, stored docs and
  their sizes, awards years, backups, Board posts, errors from this user.
- **Disable / enable:** sets the login disabled *and* revokes their sessions.
  `accounts/{uid}.status = 'disabled'` lets the app sign them out right away
  with a clear message, not up to an hour later. Rules block writes from
  disabled accounts.
- **Board moderator on/off:** creates or removes `boardAdmins/{uid}`.
- Every action goes through the in-site warning window (`dcConfirmBox` style),
  never `confirm()`.
- Admin action log (`adminLog`) records who did what and when.

### 4. Delete with 30-day backup + restore
- Delete: copy all `users/{uid}/data/*` + the login record (email, name,
  provider) into `deletedUsers/{uid}`. Then delete their data, their
  `accounts`/`boardAdmins` docs and the login. Board posts stay but show
  "deleted user". *(Or remove them too? Ask at this step.)*
- "Recently deleted" list with a **Restore** button. It re-imports the login
  with the same uid and Google link (`accounts:batchCreate`) and copies the data
  back.
- Backups older than 30 days are purged when the admin page loads (no cron needed).

### 5. Account types
- `accounts/{uid}`: `plan` (`free` by default, then e.g. `supporter`, `pro`,
  `lifetime`), `planSince`, `planUntil`, `note`.
- Admin can change a user's plan and add a private note.
- The app reads the user's own `accounts` doc. This is the hook for future gated
  features (`dcPlan()` helper). Nothing in the app is gated yet.
- Plan names and limits live in one config object, so adding a tier later is one edit.

### 6. Error tracking
- Small reporter in the app (in firebase.js, so it loads everywhere): catches
  `window.onerror`, `unhandledrejection`, plus explicit reports from the key
  failure points: Last.fm fetch, Sheet load, CSV parse, Firestore sync, sign-in.
- Sends message, short stack, where (tab/feature), data source, browser, app
  version, and uid if signed in. Duplicates are merged and capped per session
  (max ~20), so a crash loop can't flood the database. No listening data is sent.
- Admin **Errors** screen: grouped by message (count, users affected, first/last
  seen), drill down to each report, filter by user, and mark groups as fixed.
  A fixed error that comes back is flagged as "came back".
- Old reports auto-purged after 90 days.
- **privacy.html** gets a short paragraph about error reports.

### 7. Finances
- `adminLedger`: date, income/cost, category (hosting, domain, APIs, email,
  donations, subscriptions…), amount, currency, note, repeats
  (none/monthly/yearly).
- Screen: add/edit/delete entries, monthly and yearly totals, profit/loss,
  running balance, cost by category, upcoming recurring costs. Export to CSV.
- Prefilled suggestions for known services: Cloudflare, Firebase, domain,
  Render (welcome emails), Web3Forms.
- Later: subscription payments write here automatically.

### 8. Overview
- Landing screen of the admin page: total users, new this week/month (small
  chart), active in the last 7/30 days, users per data source, per plan,
  disabled count, errors this week + top error, and this month's income/cost/profit.

---

## Open questions (answer at the step they belong to)
- Currency for the ledger: EUR, USD, or mixed with a main currency? (step 7)
- When deleting a user, keep or remove their Board posts? (step 4)
- Plan names for the future tiers? (step 5. Placeholders are fine.)
- Should users ever see their plan in Settings → Profile now, or only once paid
  tiers exist? (step 5)
