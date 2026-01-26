# LiveWidgets

LiveWidgets ist ein SaaS für Twitch-Streamer mit interaktiven OBS-Overlays, Viewer-Interaktion und Stripe Billing.

## Features
- Twitch OAuth + optional Email Login
- Multi-Tenant Channel Workspaces
- Bonus Hunts, Slot Requests, Tournaments
- OBS Overlays mit Token-Schutz + WebSocket Live Updates
- Stripe Checkout + Customer Portal + Webhooks
- Admin Backoffice
- Docker Compose + Traefik v3

## Lokale Entwicklung

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
npm run realtime
```

## Twitch Setup
- Erstelle eine Twitch App und trage Client ID/Secret in `.env` ein.
- OAuth Redirect URL: `https://<DOMAIN>/api/auth/callback/twitch`
- Bot Account: Lege einen zentralen Bot an (z.B. LiveWidgetsBot) und setze `BOT_TWITCH_USERNAME` + `BOT_TWITCH_OAUTH_TOKEN`.

Bot starten:

```bash
npm run bot
```

Bot Commands:
- `!sr <slot>` – Slot Request einreichen
- `!sr pick` – nächsten Slot auswählen (mods/broadcaster)
- `!sr clear` – Queue leeren (mods/broadcaster)
- `!join` – Join-Link per Whisper erhalten (Slot/Name eintragen)

## Realtime / OBS Overlays
- Socket.IO wird unter `/socket` via Traefik geroutet.
- `NEXT_PUBLIC_SOCKET_URL` sollte auf deine Domain zeigen.

## Stripe Setup
- Lege zwei Price IDs für Creator / Creator+ an.
- Konfiguriere Webhook Endpoint: `https://<DOMAIN>/api/stripe/webhook`.
- Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`.

## VPS Installation (Ubuntu 22.04 / 24.04)

```bash
bash scripts/install.sh
```

## Update

```bash
bash scripts/update.sh
```

Vorher nichts entfernen, solange die `.env` vorhanden ist und das bestehende `POSTGRES_PASSWORD` weiterhin passt. Nur wenn du das Datenbank-Passwort geändert hast oder bewusst eine frische Datenbank willst, musst du die Volumes löschen:

```bash
sudo docker compose down -v
```

## Hinweise
- Das Projekt ist ein Streaming Companion ohne Echtgeld-Glücksspiel.
- Secrets werden ausschließlich via `.env` geladen.
- Wenn `POSTGRES_PASSWORD` nach der initialen Datenbank-Erstellung geändert wird, musst du das alte Passwort wieder setzen oder das Volume neu erstellen (`docker compose down -v`), sonst schlagen Prisma-Migrationen mit Auth-Fehlern fehl.
