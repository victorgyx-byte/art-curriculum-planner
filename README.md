# Weave

A web prototype for curriculum, unit, and lesson planning.

Weave supports:

- 2YIP curriculum mapping for Sec 1 and Sec 2
- Unit planning boards
- Lesson activity boards
- HOD-facing overview analysis for Big Ideas, Learning Outcomes, 21CC, Core Learning Experiences, and Pedagogy

## Current State

The app runs as a static web app with Google sign-in, Firestore cloud save, and browser local storage as a resilience fallback. Each signed-in teacher gets a personal workspace and can create team workspaces. Each workspace can contain multiple 2YIP plans. Plan metadata includes subject and team name, each plan carries its own subject-specific card library, and the workspace carries shared 21CC cards so cross-curricular emphases stay consistent across Art, Music, and other plans.

## Online Direction

The intended online setup is:

- Vercel for frontend deployment
- Firebase Authentication and Firestore for teacher login and school/workspace saving
- Firebase Storage later for artwork and process reference images

See `ONLINE_DEPLOYMENT.md` for the deployment and data plan.
