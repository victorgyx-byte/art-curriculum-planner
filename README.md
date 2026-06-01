# Art Curriculum Planner

A web prototype for lower secondary art curriculum planning.

The planner supports:

- 2YIP curriculum mapping for Sec 1 and Sec 2
- Unit planning boards
- Lesson activity boards
- HOD-facing overview analysis for Big Ideas, Learning Outcomes, 21CC, Core Learning Experiences, and Pedagogy

## Current State

The app runs as a static web app with Google sign-in, Firestore cloud save, and browser local storage as a resilience fallback. Each signed-in teacher currently gets a personal workspace, and that workspace can contain multiple 2YIP plans. Plan metadata includes subject and team name, and each plan carries its own card library so future Art, Music, or team-specific card sets can diverge without changing the whole app.

## Online Direction

The intended online setup is:

- Vercel for frontend deployment
- Firebase Authentication and Firestore for teacher login and school/workspace saving
- Firebase Storage later for artwork and process reference images

See `ONLINE_DEPLOYMENT.md` for the deployment and data plan.
