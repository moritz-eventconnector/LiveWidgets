# LiveWidgets

LiveWidgets wird gerade von Grund auf neu aufgebaut. Ziel ist eine robuste,
modulare Plattform für Twitch-Creator mit Overlays, Community-Aktionen und
Billing-Workflows.

## Status
- ✅ Neue UI-Grundstruktur für Landing und Dashboard-Preview.
- ✅ Dashboard-Navigation mit Modul-Platzhaltern (Overlays, Community, Billing).
- ✅ BonusHunt-Modul mit vollständiger DB-Persistenz und Overlay-Integration.
- ⏳ Realtime Gateway + Event-Bus in Vorbereitung.
- ⏳ Auth, Billing und Workspace-Module folgen nach dem Datenmodell.

## Server-Update (1-Klick)

Um die Anwendung auf dem Server auf den neuesten Stand zu bringen:

```bash
./scripts/update.sh
```

Das Skript führt automatisch aus:
- Git Pull (neueste Änderungen)
- Docker Build (neue Container bauen)
- Docker Compose Up (Container starten)
- Datenbank-Migrationen (automatisch anwenden)
- Alles in einem Schritt!

Optional:
- `./scripts/update.sh --clean` - Clean rebuild (ohne Cache)
- `./scripts/update.sh --force` - Erzwingt Reset bei uncommitted changes

## Installation

Für die erste Installation:

```bash
./scripts/install.sh
```

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Hinweis
- Die aktuelle Version ist eine neue Basis. Legacy-Features werden schrittweise
  wieder integriert.
