# Go Business — Referral Dashboard

A secure, responsive referral management system built for **Go Business**. Users sign in, view referral overview metrics and service summary data, share their referral link/code, and browse a searchable, sortable, paginated table of referrals pulled from a live API.

## Features

- 🔐 **Authentication** — JWT-based sign-in, session persisted via cookie
- 📊 **Overview metrics** — key stats pulled from the API (balance, referrals, commission, earnings, etc.)
- 🧾 **Service summary** — service name, referral counts, and total earnings at a glance
- 🔗 **Referral sharing** — copyable referral link and referral code
- 📋 **Referrals table** — search, sort by date, and client-side pagination (10 rows per page)
- 🔍 **Referral details page** — full info for a single referral, accessed by clicking a row
- 🚪 **Logout** — clears the session and returns to login
- 📱 **Responsive design** — adapts across desktop, tablet, and mobile
- 🚫 **404 page** — graceful fallback for unmatched routes and missing referrals

## Tech Stack

- **React** (functional components, hooks)
- **React Router** (`react-router-dom`) for routing and protected routes
- **js-cookie** for storing/reading the JWT
- **CSS** for styling (no framework dependency assumed)

## Application Flow

```
[ User Authentication ] ──> [ Protected Dashboard ] ──> [ Referral Management ]
        │
   [ Logout ] <─────────────────┘
```

1. **User Authentication** — users log in with email and password against a secure endpoint.
2. **Dashboard Access** — on success, users land on the protected dashboard at `/`.
3. **Referral Management** — users view overview metrics, service summary, their referral link/code, and search/sort/paginate their referrals.
4. **Logout** — clears the session cookie and returns the user to `/login`.

## Routes

| Route                  | Type      | Notes                                                      |
| ---------------------- | --------- | ---------------------------------------------------------- |
| `/login`               | Public    | Authenticated users are redirected to `/`                  |
| `/`                    | Protected | Requires `jwt_token` cookie — the Referral Dashboard       |
| `/referral/:id`        | Protected | Detailed view of an individual referral                    |
| `/dashboard/referrals` | Optional  | May redirect to `/` (same dashboard)                       |
| `*`                    | Public    | Not Found / 404 page — **not** wrapped in `ProtectedRoute` |

**Routing rules:**

- Unauthenticated users hitting a protected route are redirected to `/login`.
- Authenticated users visiting `/login` are redirected to `/`.
- The 404 route must remain reachable with no token present.
- `App.jsx` wraps `<Routes>` in `<BrowserRouter>`; `main.jsx` renders only `<App />`, with no router there.

## Authentication

**Login endpoint**

```
POST https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin
```

**Request body**

```json
{
  "email": "<user_email>",
  "password": "<user_password>"
}
```

**Success response**

```json
{
  "data": { "token": "<jwt_token_string>" }
}
```

The token is read from `responseJson.data.token`, stored via `Cookies.set('jwt_token', token)`, and the user is navigated to `/`.

**Failure response (401)**

```json
{ "message": "Invalid email or password" }
```

The message is read from `responseJson.message` and shown on the login page. The **Sign in** button stays enabled regardless of field contents — every click POSTs to the login API, and the API's response determines whether the user proceeds.

**Token reuse** — for every subsequent request (referrals list, referral detail), the token is read back out of the cookie and sent as:

```
Authorization: Bearer <jwt_token>
```

There is no separate API key; the JWT from login is the only credential needed.

## Referrals API

All endpoints share one base URL and require the Bearer token:

```
https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals
```

| Purpose                   | Request                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Full list (default)       | `GET /api/referrals`                                                                 |
| Search by name or service | `GET /api/referrals?search=pm` (or `?q=graphics`)                                    |
| Single referral by id     | `GET /api/referrals?id=5`                                                            |
| Sort by date              | `GET /api/referrals?sort=asc` (`asc` = oldest first, `desc` = newest first, default) |

- `search` and `q` are interchangeable — either filters by name or service.
- `sort` accepts `asc` or `desc`; defaults to `desc`.
- `search`/`q` and `sort` can be combined, e.g. `?search=pm&sort=asc`.
- **The API does not paginate.** Every call returns the full matching set — pagination (10 rows/page) is implemented entirely client-side.

**Response shape**

```json
{
  "success": true,
  "data": {
    "metrics": [{ "id": "...", "label": "...", "value": "..." }],
    "serviceSummary": {
      "service": "...",
      "yourReferrals": "...",
      "activeReferrals": "...",
      "totalRefEarnings": "..."
    },
    "referral": { "link": "...", "code": "..." },
    "referrals": [
      {
        "id": 1,
        "name": "...",
        "serviceName": "...",
        "date": "YYYY-MM-DD",
        "profit": 12345
      }
    ]
  }
}
```

The parser also supports `metrics`, `serviceSummary`, and `referral` sitting beside `referrals` directly on the response object (rather than only nested under `data`).

For a single referral fetch (`?id=<id>`), the `data` field is often the row itself (an object with `id`, `name`, `serviceName`, `date`, `profit`) rather than nested inside a `referrals` array — both shapes count as a successful match.

## Pages

### Login (`/login`)

- Brand title **Go Business**, tagline _"Sign in to open your referral dashboard."_
- Email input (`placeholder="you@example.com"`) and Password input, each with a properly associated label
- **Sign in** button — always enabled; validation is handled by the API response

### Dashboard (`/`)

- Heading **Referral Dashboard**, subtitle _"Track your referrals, earnings, and partner activity in one place."_
- Loading state while fetching; error message (with status code, where available) if the fetch fails
- **Overview** — renders each metric's label and value from the API
- **Service summary** — labels: Service, Your Referrals, Active Referrals, Total Ref. Earnings
- **Refer friends and earn more** — referral link and code, each with a **Copy** button
- **All referrals** table:
  - Columns: Name, Service, Date (`YYYY/MM/DD`), Profit (USD, no decimals, e.g. `$1,234`)
  - Search input (`placeholder="Name or service…"`) — triggers a new API call
  - Sort control (label includes "Sort by date") — **Newest first** (`desc`, default) / **Oldest first** (`asc`)
  - Client-side pagination, 10 rows/page — **Previous**/**Next** buttons, numbered pages, footer text `"Showing <from>–<to> of <total> entries"`
  - Clicking a row navigates to `/referral/<id>`

### Footer

- `<footer>` element with brand text **Go Business**
- Nav with **About** and **Privacy** links
- Copyright line containing **"© 2024 Go Business"**

### Referral Details (`/referral/:id`)

- Heading **Referral Details**, partner's name as a heading
- Rows: Referral ID, Service Name, Date, Profit (same formatting as the table)
- **← Back to dashboard** link to `/`
- Falls back to **"Referral not found"** if the id doesn't resolve to a row

### Not Found (`*`)

- **404** / **Page not found**
- **Back to dashboard** link to `/`

## Cookie & Protected Route Logic

- Cookie name: `jwt_token` — set on login success, removed on logout
- `ProtectedRoute` checks `Cookies.get('jwt_token')`:
  - present → renders the route
  - missing → redirects to `/login`
- The `*` (Not Found) route is **never** wrapped in `ProtectedRoute`

## Test Credentials

```
Email: admin@example.com
Password: admin123
```

## Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Login/
│   ├── ProtectedRoute/
│   ├── Navbar/
│   ├── OverviewCard/
│   ├── ServiceSummary/
│   ├── ShareReferral/
│   ├── AllReferrals/
│   ├── Referral/
│   ├── ReferralDetails/
│   ├── Footer/
│   └── NotFound/
├── App.jsx
└── main.jsx
```
