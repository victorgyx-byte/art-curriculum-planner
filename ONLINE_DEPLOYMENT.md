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

workspaces/{workspaceId}
  name
  schoolName
  createdBy
  createdAt

workspaces/{workspaceId}/members/{uid}
  role: owner | teacher | viewer
  email
  displayName

workspaces/{workspaceId}/plans/{planId}
  title
  ownerId
  state
  updatedAt
```

For the MVP, `state` can store the current app state as one document field. Later, we can split units and lessons into separate documents if collaboration becomes heavier.

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

## Next Code Step

Add a small data adapter:

- `localAdapter`: current browser local storage.
- `firebaseAdapter`: signed-in workspace save/load.

The UI should call `loadPlannerState()` and `savePlannerState()` instead of touching local storage directly. That lets us keep the local prototype while adding login and shared workspaces cleanly.
