# Weave Online Plan

## Direction

Use option 2.5:

- Teachers can sign in and save their own planning work.
- Planning data belongs to a school/workspace structure.
- HOD oversight can read the same 2YIP map and generated overviews.
- Full role management can stay light for the first online version.

## Stack

- Frontend: Vercel static deployment.
- Backend: Firebase Authentication, Cloud Firestore, Firebase Storage, and Vercel serverless API routes.
- AI drafting: OpenAI API called only from Vercel serverless routes, never from the browser.
- Current fallback: browser local storage remains the prototype fallback until Firebase is connected.

## First Online Data Shape

```text
users/{uid}
  displayName
  email
  lastWorkspaceId
  workspaces.{workspaceId}
    id
    name
    type
    role

workspaces/{workspaceId}
  name
  schoolName
  type: personal | team
  sharedCardLibrary
  createdBy
  createdAt

workspaces/{workspaceId}/members/{uid}
  role: owner | teacher | viewer
  email
  displayName

workspaces/{workspaceId}/plans/{planId}
  title
  subject
  teamId
  teamName
  ownerId
  state.plan
  state.cardLibrary        # subject-specific cards only
  state
  updatedAt
```

For the MVP, `state` stores the current app state as one document field. Each plan document also keeps lightweight metadata (`title`, `subject`, `teamId`, `teamName`) so the app can list and switch between plans without opening every full planner state. Subject-specific cards live with the plan. Shared cross-curricular cards, currently 21CC, live with the workspace so they remain consistent across Art, Music, and other plans. Later, we can split units and lessons into separate documents if collaboration becomes heavier.

## Firebase Setup Checklist

1. Create a Firebase project.
2. Enable Authentication.
3. Start with Google sign-in or email link sign-in.
4. Create a Cloud Firestore database.
5. Add the rules from `firebase/firestore.rules`.
6. Add Storage later only when online image upload is needed.
7. Put Firebase web app values into Vercel environment variables.

## Vercel Setup Checklist

1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Deploy as a static frontend.
4. Add Firebase environment variables from `.env.example`.
5. Add `OPENAI_API_KEY` for the AI rubric drafter.
6. Optionally add `OPENAI_MODEL`; if omitted, Weave uses the default in `api/draft-rubric.js`.
7. Redeploy after environment variables are added.

## AI Rubric Drafter Setup

The rubric drafter uses `/api/draft-rubric`, a Vercel serverless route. The browser sends the selected Assessment Task context and the signed-in teacher's Firebase ID token. The route verifies the token, adds curated LO and assessment guidance, calls OpenAI, and returns an editable rubric draft.

Required Vercel environment variables:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
FIREBASE_PROJECT_ID=
```

Do not place the OpenAI API key in `index.html`, `app.js`, or any browser file.

## Current Code Step

- Google sign-in opens the teacher's personal workspace.
- Teachers can create a team workspace and switch between workspaces.
- The plan selector can create and switch between multiple 2YIP plans.
- Firestore workspace and plan documents are discovered into local catalogs after sign-in.
- Each plan stores its own subject-specific `cardLibrary`, making Art/Music/team-specific card sets possible.
- Each workspace stores `sharedCardLibrary` for subject-agnostic 21CC cards.

## Next Code Step

Add team membership management so an HOD can invite teachers into a shared workspace and assign roles (`owner`, `teacher`, `viewer`) from the UI.
