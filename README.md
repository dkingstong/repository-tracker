# Instructions to get the project running

* Needs v18.17.0. installed. You can install nvm to use different versions easily.
* Verify npm is installed as well

## Frontend

1.- Go into the Frontend folder

2.- Run npm ci - installs dependencies

3.- Run npm run dev - starts the server

## Backend

1.- Go into the Backend folder

2.- Run npm ci - installs dependencies

3.- Run npm run db:start - this starts the db

4.- Run npm run migration:run - this runs the migrations

5.- Run npm run dev - to start the server

# Project improvements, tradeoffs and implementations.

## Implemented

### Frontend

* Frontend caching
* User Authentication: GitHub OAuth login integration.

  Repository Management: Add, delete, and sync GitHub repositories.
* Filtering System: Generic, reusable filtering component with:

  * Text search filtering
  * Boolean toggle filters
  * Sorting with direction control

### Backend

* Backend caching
* GraphQL API with CRUD operations for repositories
* PostgresDB - Many to Many relationship between users and repositories
* Auth with GitHub - this is a REST API, exposing a callback webhook for GitHub to give us the access token and user information
* Cron job to update repositories
* Protected routes that check if a user exists and the token is valid

---

## Tradeoffs Made

### Frontend

* State Management: Using React's useState instead of a more robust state management solution like Redux or Context API.
* Component Composition: The EntityFilters component is highly reusable but complex, with many props and internal state management.

### Backend

* Used in-memory cache vs Apollo caching, because this scales better for distributed cache scenarios (although for this project either would work)
* Did not use an expiration time on the cache to save time, though it could be implemented easily
* Cache is used for caching the `getRequests` of the user repositories. Each time there's a new repo or an update, the cache key is dropped
* Cache is also used for caching requests to GitHub, using the repo name and repo owner as part of the key
* When adding a repository, a request is always made to GitHub to check for updates; if there are any, the repo, cache, and user repo are updated accordingly (prioritizing correctness over write latency)
* Updates to the “seen” field in user repositories could be improved by using a listener that tracks changes in the `latestRelease` field in the repository table

---

## Improvements

### Frontend

* Leverage Next.js to use Server-Side Rendering (SSR)
* Input validation
* Add testing

### Backend

* Change the versions in `package.json` to static versions to prevent unnecessary updates

* Improve the definition of types (both backend and frontend) to ensure type safety

* Maybe create a `release` table to historically track releases for a given repository

* Include more repository details beyond latest release (e.g., commits and PRs)

* Expose a webhook to GitHub for real-time repository updates

* Add pagination where necessary

* Allow repository updates to accept more fields beyond just “seen”

* Consider an alternative to GitHub sign-in (e.g., using IP address as user ID), but be cautious of shared IP issues (e.g., proxy users)

* Make cron jobs a separate container to run independently

* Decouple the cron job, use an event queue to queue messages with batches of ids of repositories to scale and perform the updates better.

* Define a proper Dockerfile for production deployment

* Use a secret manager instead of plain environment variables

* Rate-limit the sync mutation

* Improve error handling (e.g., remove sensitive information from logs)

* Implement additional authentication methods

* Add request retries

* Add better logging

* Add observability tools

* Add testing

* Support different providers like BitBucket or GitLab
