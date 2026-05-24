# QuizMaster — Frontend

QuizMaster is a single-page React application built with Vite that provides a real-time quiz experience (host, join, play, and view scores). It uses Redux for state management and WebSockets for live quiz sessions.

## Key features
- Host and join quizzes with real-time updates via WebSocket
- Authentication flows (signup / signin)
- Quiz creation and question management UI
- Live score and leaderboard pages
- Lightweight UI components with Tailwind CSS

## Tech stack
- React 19
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios for HTTP requests
- WebSockets (custom context) for real-time interaction

## Getting started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the API and WebSocket base URLs:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_WS_BASE_URL=wss://ws.example.com
```

3. Run the dev server:

```bash
npm run dev
```

Open the app at the address shown by Vite (defaults to `http://localhost:5173`).

## Available scripts
- `npm run dev` — start the Vite dev server (with host exposed)
- `npm run build` — build production assets
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint across the project

## Environment variables
The app expects the following environment variables (defined in `src/key.js`):
- `VITE_API_BASE_URL` — base URL for REST API requests
- `VITE_WS_BASE_URL` — WebSocket server URL for real-time quiz sessions

## Project structure (high level)
- `src/` — main source folder
	- `api/` — Axios setup and API modules
	- `components/` — shared UI components and layout
	- `context/` — `WebSocketContext` provider for live updates
	- `features/` — Redux slices and hooks for auth and quizzes
	- `pages/` — route pages (Home, Quiz, Score, Signin, Signup, WaitingRoom, etc.)
	- `Store/` — Redux store configuration

## Notes
- WebSocket provider is wired in `src/main.jsx` inside the Redux `Provider`.
- API endpoints and WebSocket URL are referenced via `src/key.js` and depend on `VITE_` env vars.

## Contributing
- Open an issue or submit a PR. Keep changes focused and add/update tests where applicable.

## License
This project does not currently include a license. Add one if you intend to open-source the repository.

---
If you'd like, I can also add a sample `.env.example`, update `package.json` scripts, or generate a short contributor guide.
