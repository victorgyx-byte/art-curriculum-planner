# Art Curriculum Planner Online Plan

## Direction

Use option 2.5:

- Teachers can sign in and save their own planning work.
- Planning data belongs to a school/workspace structure.
- HOD oversight can read the same 2YIP map and generated overviews.
- Full role management can stay light for the first online version.

## Stack

- Frontend: Vercel static deployment.
- Backend: Firebase Authentication, Cloud Firestore, and later Firebase Storage.
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
  state.cardLibrary
  state
  updatedAt
```

For the MVP, `state` stores the current app state as one document field. Each plan document also keeps lightweight metadata (`title`, `subject`, `teamId`, `teamName`) so the app can list and switch between plans without opening every full planner state. Later, we can split units and lessons into separate documents if collaboration becomes heavier.

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
5. Redeploy after environment variables are added.

## Current Code Step

- Google sign-in opens the teacher's personal workspace.
- Teachers can create a team workspace and switch between workspaces.
- The plan selector can create and switch between multiple 2YIP plans.
- Firestore workspace and plan documents are discovered into local catalogs after sign-in.
- Each plan stores its own `cardLibrary`, making subject-specific and team-specific card sets possible.

## Next Code Step

Add team membership management so an HOD can invite teachers into a shared workspace and assign roles (`owner`, `teacher`, `viewer`) from the UI.
