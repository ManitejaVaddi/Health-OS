# NutriAI

NutriAI is a full-stack nutrition and fitness tracker with user authentication, meal tracking, exercise logging, water intake, weight progress, and a modern dashboard experience.

## Project Structure

- `backend/` - Express API server, PostgreSQL integration, JWT auth.
- `frontend/` - React + Tailwind UI, React Router, React Query, Recharts.

## Getting Started

1. Copy `.env.example` to `backend/.env` and configure your PostgreSQL database, JWT secrets, USDA API key, and optional Gemini API key.
2. Run `npm run install:all`.
3. Start the backend: `npm run dev:backend`.
4. Start the frontend: `npm run dev:frontend`.

## Notes

- Use `GEMINI_API_KEY` to enable the AI nutrition coach endpoint.
- The app includes protected routes, meal/exercise/water tracking, weight progress charts, and a health score system.
