# Lake Pass MVP

**Airbnb for boat rentals + Marina Management Software**

Lake Pass is a multi-marina boat rental platform with three products:
1. **Marina Dashboard** — fleet, calendar, reservations, customers, payments
2. **Consumer Booking App** — search, book, and pay online
3. **Embeddable Widget** — drop-in booking widget for marina websites

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JWT (Bearer token + httpOnly cookie) |
| Payments | Stripe Connect (test mode) |
| Calendar | FullCalendar |

## Architecture

```
apps/dashboard (React)  ──┐
apps/consumer (React)   ──┼──► backend (Express) ──► MongoDB (local)
apps/widget (Vite)      ──┘         │
                                    └── Stripe (test mode)
```

**Multi-marina isolation:** Every tenant-scoped document carries `marinaId`. JWT-authenticated requests resolve the user's marina from their account; all queries filter by `marinaId`. Marina A cannot see Marina B data.

## Prerequisites

- Node.js 18+
- MongoDB installed and running locally ([MongoDB Community Server](https://www.mongodb.com/try/download/community))

## MongoDB Setup

Install MongoDB on your machine, then start the service:

```bash
# Ubuntu / Debian
sudo systemctl start mongod
sudo systemctl enable mongod   # start on boot (optional)

# macOS (Homebrew)
brew services start mongodb-community

# Verify MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"
```

Lake Pass uses the database `lakepass` on the default port `27017`. Mongoose creates it automatically on first connection.

## Setup

```bash
cd lake-pass

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set JWT_SECRET at minimum

# 3. Seed database (4 marinas, boats, demo users)
npm run seed

# 4. Start all services
npm run dev
```

| Service | URL |
|---------|-----|
| Marina Dashboard | http://localhost:5173 |
| Consumer App | http://localhost:5174 |
| Widget Demo | http://localhost:5175 |
| API | http://localhost:8000 |

## Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/lakepass
PORT=8000
JWT_SECRET=your_jwt_secret_change_in_production
```

For a remote or cloud database (e.g. MongoDB Atlas), set `MONGO_URI` to your connection string.

## Demo Credentials

| Email | Password | Role | Marina |
|-------|----------|------|--------|
| owner@marina-a.com | password123 | Owner | Marina A |
| manager@marina-a.com | password123 | Manager | Marina A |
| staff@marina-a.com | password123 | Staff | Marina A |
| owner@marina-b.com | password123 | Owner | Marina B |

## API Overview

Base URL: `http://localhost:8000/api/v1`

| Group | Key Endpoints |
|-------|---------------|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Boats | `GET/POST /boats`, `PUT/DELETE /boats/:id` |
| Availability | `GET/POST /boats/:id/availability`, `GET /calendar/events` |
| Reservations | `GET/POST /reservations`, `PUT/DELETE /reservations/:id` |
| Customers | `GET/POST /customers`, `GET /customers/:id` |
| Payments | `POST /payments/deposit`, `POST /payments/full`, `GET /payments/stripe/onboard` |
| Public | `GET /public/marinas`, `GET /public/marinas/:slug/boats`, `POST /public/reservations` |

## Embeddable Widget

```html
<div id="lakepass-widget" data-marina="marina-a" data-api="http://localhost:8000"></div>
<script src="lakepass-widget.js"></script>
```

Build the widget bundle:
```bash
npm run build --workspace=apps/widget
# Output: apps/widget/dist/lakepass-widget.iife.js
```

## Assumptions

- **MongoDB** runs locally (or via `MONGO_URI` for Atlas/remote)
- **Stripe** runs in test mode; without `STRIPE_SECRET_KEY`, payments are mocked and auto-succeed
- **Emails** are mocked (logged to console)
- **Boat images** use placeholder URLs (picsum.photos)
- **Customer auth** is optional; guest checkout by email
- **4 seeded marinas** (Marina A–D); no self-service marina signup in MVP
- **Turnaround buffer** defaults to 1 day per marina

## Loom Walkthrough Script (5–8 min)

1. Login as `owner@marina-a.com` — show dashboard stats
2. Fleet → Add a new boat
3. Calendar → add a maintenance block
4. Reservations → create a new booking
5. Login as `owner@marina-b.com` — confirm Marina A data is invisible
6. Consumer app → search Marina A boats → book → pay deposit
7. Widget demo page → complete embedded booking flow
8. Brief architecture + multi-tenancy explanation

## Project Structure

```
lake-pass/
├── backend/           Express API + Mongoose models
├── apps/
│   ├── dashboard/     Marina operator dashboard (React)
│   ├── consumer/      Public booking app (React)
│   └── widget/        Embeddable booking widget (Vite)
└── README.md
```

## License

MIT
