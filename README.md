# Sweeps Casino Starter (Web-only, Chumba-style model)

**Includes:** Next.js web app + Express API, Postgres ledger (GC/SC), daily bonus, slot spin, redemption (gift cards), basic admin.

## Quick start (local)
1) Install Node.js 18+ and Docker.
2) In the project root:
```bash
docker compose up -d
npm install
npm run dev:api
# new terminal
npm run dev:web
```

- API: http://localhost:4000
- Web: http://localhost:3000

## Configure
Copy `.env.example` to `.env` inside `apps/api` and adjust values.

## What’s implemented
- Dual currency wallet: **Gold Coins (GC)** + **Sweeps Cash (SC)**
- Starting balances: **1,000,000 GC** + **100 SC**
- Minimum redemption: **50 SC**
- Daily bonus with streak tracking (SC + GC)
- Slots: server-authoritative spin + payout
- Redemptions: request + admin approve/reject + gift-card code storage
- Simple geo-block placeholder hooks (you should plug in a real geo provider)

## Important
This is a technical starter kit — you must have a qualified attorney review sweepstakes terms, AMOE, state restrictions, and redemption policies.
