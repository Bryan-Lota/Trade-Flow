# TradeFlow

TradeFlow is a milestone-triggered escrow payment rail for agricultural exporters, built for a one-day Stellar + Trustless Work hackathon demo.

Exporters create a shipment, buyers fund a USDC escrow, and milestone approvals release payment in two tranches:

1. Port clearance approved
2. Delivery confirmed

The MVP is intentionally demo-safe: it uses Freighter when available, Stellar testnet configuration, and a Trustless Work adapter that falls back to deterministic demo payloads when live credentials or SDK methods are unavailable.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Zustand
- Freighter wallet API
- Stellar testnet Horizon/RPC configuration
- Trustless Work adapter layer, ready for live API credentials

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` and run the demo flow:

1. Connect Freighter, or continue in demo mode.
2. Create a shipment escrow.
3. Switch to Buyer and fund escrow.
4. Switch to Exporter or Verifier and submit milestone proof.
5. Switch to Buyer and approve each milestone release.

## Environment variables

See `.env.example` for the expected Stellar testnet, Trustless Work, asset, and local-only secret seed variables. Do not expose private keys in client bundles.
