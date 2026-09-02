# Health endpoint

The application exposes `/health` as a lightweight liveness endpoint. Keep this endpoint independent from external providers and database queries so the deployment platform can use it without turning dependency failures into application restarts.

The endpoint returns HTTP 200 with a small JSON payload and does not require Supabase or external search providers.
