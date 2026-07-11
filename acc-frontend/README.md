# ACC Frontend — Agent Command Center

A minimal, functional operations console for ACC: mission management, agent
monitoring, reports, and a live dashboard. No demo/mock data — every screen
talks to the real backend and shows genuine loading, error, and empty
states.

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

If the backend isn't reachable, a banner says so and the sidebar status
pill turns red — nothing is silently faked. Pages retry automatically
(the connection probe re-checks every 15s) and every failed call has a
"Retry" button.

## Connecting the backend

**`src/api/client.js` is the single file that talks to the backend.** Every
page and component goes through it — nothing calls `fetch()` directly.

```
GET    /health

GET    /dashboard
GET    /activities

GET    /missions
POST   /missions
GET    /missions/{id}
POST   /missions/{id}/cancel
POST   /missions/{id}/retry

GET    /agents

GET    /reports
GET    /reports/{id}
GET    /reports/{id}/download

GET    /settings
POST   /settings
```

Set the backend URL once, in `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Live behavior

- **Polling**: Dashboard, Missions, Agents, and an open Mission detail page
  poll on an interval (4–8s) so status changes show up without a manual
  refresh. Polling pauses when the tab isn't visible.
- **Toasts**: mission create/cancel/retry, report download/copy, and
  settings save all surface a toast — success or failure.
- **Mission actions**: Cancel (while queued/running) and Retry (while
  failed) are available both inline on the missions list and on the
  mission detail page.
- **Reports**: Download triggers a real file download from
  `/reports/{id}/download` (uses the filename from the response's
  `Content-Disposition` header); Copy puts a plain-text version of the
  report on the clipboard.
- **Settings**: loads existing config from `GET /settings`, saves provider
  + model + API key via `POST /settings`. The API key field is masked with
  a show/hide toggle. "Run health check" hits `/health` directly.

## Project structure

```
src/
  api/
    client.js        ← talks to the backend (the one file to edit for API changes)
  context/
    ThemeContext.jsx       light/dark mode
    ConnectionContext.jsx  backend reachability, polls /health in the background
    ToastContext.jsx       global toast notifications
  hooks/
    useFetch.js        loading/error/refetch wrapper with optional polling
  components/
    layout/             Sidebar, Topbar, MainLayout (the app shell)
    common/              StatusBadge, EmptyState, ErrorState, PageHeader, etc.
    dashboard/           stat grid, system health, activity feed, quick actions
    missions/            mission row (with cancel/retry), new-mission form, pipeline
    agents/               agent status card
    reports/               report row + structured preview (download/copy)
  pages/                 one file per route, composed from the components above
  styles/
    variables.css        design tokens — edit here to reskin
    global.css           reset + base typography
    layout.css            sidebar/topbar/content shell
    components.css        buttons, cards, badges, forms, tables, toasts, etc.
  App.jsx                wires providers + routes together
  main.jsx                mounts the app, imports stylesheets
```

## Notes

- No CSS framework — plain CSS custom properties, so the whole look can be
  re-themed by editing `src/styles/variables.css` alone.
- `react-router-dom` for routing, `lucide-react` for icons. No other UI deps.
- Every list/detail page has real loading, empty, and error states — there
  is nothing hardcoded to fall back on if the backend is down.
