# Note Tracker

A note-taking REST API with a functional frontend. Users manage their own notes; admins also manage users and can read every note. Authentication uses JWT and role-based access control. The MongoDB layer uses as few indexes as possible, and each index exists for a specific query.

| Layer | Stack |
| ----- | ----- |
| Backend | NestJS 11, Mongoose 8, MongoDB 7+, Passport JWT, argon2, class-validator |
| Frontend | Next.js 16 (App Router), React 19, TanStack Query 5, React Hook Form, Zod, Tailwind CSS 4 |

The repository holds two independent apps. They share no code, and each one is installed, built and run from its own directory.

```
note_tracker/
├── server/   NestJS REST API (Yarn 4)
└── client/   Next.js frontend (Yarn 4)
```

## Roles

| Capability | Guest | User | Admin |
| ---------- | :---: | :--: | :---: |
| Register, log in | ✓ | | |
| View and edit own profile and interests | | ✓ | ✓ |
| Create, list, view, update, delete own notes | | ✓ | ✓ |
| View any note, list all notes | | | ✓ |
| Update or delete another user's note | | | |
| Create a post | | ✓ | ✓ |
| Read the post feed, a single post, and a user's posts | ✓ | ✓ | ✓ |
| Create, list, view, update, delete users | | | ✓ |
| View users grouped by interest | | | ✓ |

Admins cannot delete their own account or change their own role. Deleting a user also deletes that user's notes and posts.

## Getting Started

### Prerequisites

- Node.js 22 LTS or 24
- Yarn 4 via Corepack (`corepack enable`)
- MongoDB 7.0+ running as a replica set. Deleting a user removes their notes and posts in one transaction, and MongoDB only supports transactions on a replica set. A single node is enough.

```bash
corepack enable
docker run -d --name note-tracker-mongo -p 27017:27017 mongo:7 --replSet rs0
docker exec note-tracker-mongo mongosh --quiet --eval 'rs.initiate()'
```

For a native `mongod`, add `replication: { replSetName: rs0 }` to `mongod.conf`, restart it, and run `rs.initiate()` once in `mongosh`.

### Environment

`server/.env`

| Variable | Required | Default | Notes |
| -------- | -------- | ------- | ----- |
| `NODE_ENV` | no | `development` | `development` or `production` |
| `PORT` | no | `4000` | |
| `MONGODB_URI` | yes | | `mongodb://localhost:27017/note_tracker?directConnection=true` |
| `JWT_SECRET` | yes | | At least 32 characters: `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | no | `1d` | |
| `CORS_ORIGIN` | no | `http://localhost:3000` | Comma-separated list allowed |
| `ADMIN_NAME` | for seed | `Administrator` | |
| `ADMIN_EMAIL` | for seed | | |
| `ADMIN_PASSWORD` | for seed | | 8–128 characters with a letter and a number |

`client/.env.local`

| Variable | Required | Default |
| -------- | -------- | ------- |
| `API_URL` | no | `http://localhost:4000` |

### Run

```bash
cd server
cp .env.example .env
yarn install
yarn seed
yarn start:dev
```

```bash
cd client
cp .env.example .env.local
yarn install
yarn dev
```

Open `http://localhost:3000` and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. You can run `yarn seed` more than once safely. It upserts the admin account and inserts demo users (password `Demo1234`) with overlapping interests, plus notes and posts for each.

### Scripts

| App | Script | Purpose |
| --- | ------ | ------- |
| server | `start:dev` | Development server with watch |
| server | `build`, `start:prod` | Compile and run the production build |
| server | `lint`, `format` | ESLint and Prettier |
| server | `seed` | Admin account and demo data |
| server | `db:sync-indexes` | Build the declared indexes and drop any index the schemas don't declare |
| client | `dev`, `build`, `start` | Next.js development, build, serve |
| client | `lint` | ESLint |

## API

Base path `/api`. In the browser, the client calls `/api/*` on its own origin, and Next.js rewrites those requests to the API. This keeps the auth cookie first-party.

### Authentication

- Register and login set an httpOnly `access_token` cookie. API clients can send `Authorization: Bearer <token>` instead, using the `accessToken` returned by login.
- The token carries only the user id. The API reads the role from the database on every request, so role changes and deletions apply immediately.

### Pagination

Every list endpoint uses cursor pagination.

```
GET /api/notes?limit=20&cursor=6716f1c2e4b0a1b2c3d4e5f6
```

```json
{
  "data": [],
  "meta": { "limit": 20, "hasNextPage": true, "nextCursor": "6716f0a9e4b0a1b2c3d4e5a1" }
}
```

`limit` is 1–100 (default 20). Lists are ordered newest first by `_id`. Each page fetches `limit + 1` documents through an index range scan and never runs a count query.

### Endpoints

| Method | Path | Access | Purpose |
| ------ | ---- | ------ | ------- |
| POST | `/auth/register` | Public | Create account (role `user`) |
| POST | `/auth/login` | Public | Log in |
| POST | `/auth/logout` | Public | Revoke the user's tokens and clear session cookie |
| GET | `/auth/me` | Auth | Current user |
| PATCH | `/auth/password` | Auth | Change own password, revoke other sessions, reissue cookie |
| PATCH | `/users/me` | Auth | Update own name and interests |
| GET | `/users` | Admin | List users |
| POST | `/users` | Admin | Create user |
| GET | `/users/interests` | Admin | Users grouped by interest |
| GET | `/users/:id` | Admin | Get user |
| PATCH | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user, their notes and posts |
| GET | `/users/:id/posts` | Public | Posts of a user |
| GET | `/notes` | Auth | List own notes |
| POST | `/notes` | Auth | Create note |
| GET | `/notes/:id` | Auth | Get own note (admin: any note) |
| PATCH | `/notes/:id` | Owner | Update note |
| DELETE | `/notes/:id` | Owner | Delete note |
| GET | `/admin/notes` | Admin | List all notes, optional `ownerId` filter |
| GET | `/posts` | Public | Post feed |
| GET | `/posts/:id` | Public | Get post |
| POST | `/posts` | Auth | Create post |

A note that belongs to another user returns `404`, not `403`, so callers can't probe which note ids exist.

### Errors

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["title must be shorter than or equal to 120 characters"],
  "path": "/api/notes",
  "timestamp": "2026-10-21T10:00:00.000Z"
}
```

| Status | Meaning |
| ------ | ------- |
| 400 | Validation failure, malformed id, unknown property |
| 401 | Missing or invalid token, wrong credentials |
| 403 | Role not allowed, or an admin acting on their own role or account |
| 404 | Not found, or not owned by the caller |
| 409 | Email already in use |
| 429 | Rate limit exceeded |

## Data Model

```
users  { name, email, password, role, interests[], tokenVersion, createdAt, updatedAt }
notes  { owner → users._id, title, content, createdAt, updatedAt }
posts  { author → users._id, title, body, createdAt, updatedAt }
```

Notes and posts reference their user and are not embedded in the user document. Both are unbounded, and both are queried on their own.

## Indexes

All indexes are declared with `schema.index()` and none on field definitions, so each schema file shows its complete index set.

| Collection | Index | Supports |
| ---------- | ----- | -------- |
| all | `{ _id: 1 }` (built in) | By-id reads, updates, deletes; newest-first global lists; JWT user lookup |
| users | `{ email: 1 }` unique | Login lookup; duplicate-email protection |
| users | `{ interests: 1 }` | Users-by-interest aggregation |
| notes | `{ owner: 1, _id: -1 }` | Own notes list; admin notes filtered by owner; cascade delete |
| posts | `{ author: 1, _id: -1 }` | `$lookup` in user posts aggregation; cascade delete |

There are four secondary indexes in total.

### Why these and no others

- **No `createdAt` index.** An `ObjectId` embeds its creation time and increases with each insert, so sorting by `_id: -1` gives newest-first order from the built-in `_id` index. This covers the admin user list, the admin notes list and the post feed.
- **Compound, not single-field, for owned lists.** With `{ owner: 1 }` alone, entries that share an owner are not stored in `_id` order, so sorting a user's notes would need an in-memory `SORT`. With `{ owner: 1, _id: -1 }`, MongoDB returns them already in order, and the condition `_id < cursor` becomes an index bound.
- **No single-field `{ owner: 1 }` or `{ author: 1 }`.** Each one is a prefix of the matching compound index, so the compound index already serves those queries.
- **No `{ role: 1 }`.** No query filters by role. Admin self-protection compares ids instead of counting admins.
- **No `{ name: 1 }`, text, or `{ interests: 1, name: 1 }` index.** Nothing searches or sorts by name. A multikey index can't cover a query, so adding `name` would only make the index bigger.

### Expected query plans

| Query | Plan |
| ----- | ---- |
| `users.findOne({ email })` | `IXSCAN email_1` |
| `users.find().sort({ _id: -1 })` | `IXSCAN _id_` backward, no `SORT` |
| `notes.find({ owner }).sort({ _id: -1 })` | `IXSCAN owner_1__id_-1`, no `SORT` |
| `notes.findOne({ _id, owner })` | at most one key examined |
| `notes.deleteMany({ owner })` | `IXSCAN owner_1__id_-1` |
| interests aggregation | `IXSCAN interests_1` (multikey) |
| user posts aggregation | `_id_` for the user, `author_1__id_-1` inside `$lookup` |

Verify with `mongosh`:

```js
db.users.getIndexes();
db.notes.getIndexes();
db.posts.getIndexes();

const uid = db.users.findOne({ email: "admin@gmail.com" })._id;
db.notes.find({ owner: uid }).sort({ _id: -1 }).limit(21).explain("executionStats");
```

`autoIndex` is enabled only in development. In production, run `yarn db:sync-indexes`. It applies the declared indexes and drops any index the schemas don't declare.

## Aggregations

### Users grouped by interest

`GET /api/users/interests?limit=20&cursor=<interest>`: a single `aggregate()` call and no other model method.

```ts
const afterInterest = { interests: { $gt: cursor ?? '' } };
const groups = await this.userModel.aggregate<InterestGroup>([
  { $match: afterInterest },
  { $project: { name: 1, email: 1, interests: 1 } },
  { $unwind: '$interests' },
  { $match: afterInterest },
  {
    $group: {
      _id: '$interests',
      userCount: { $sum: 1 },
      users: { $push: { id: '$_id', name: '$name', email: '$email' } },
    },
  },
  { $sort: { _id: 1 } },
  { $limit: limit + 1 },
  {
    $project: {
      _id: 0,
      interest: '$_id',
      userCount: '$userCount',
      users: '$users',
    },
  },
]);
```

- The first `$match` turns into index bounds on the multikey `interests_1` index, so MongoDB does not scan the whole collection. With no cursor, `$gt: ''` matches every user who has at least one interest.
- The second `$match`, after `$unwind`, drops a user's interests that sort at or before the cursor.
- `$project` removes `password` and other unused fields before `$unwind` multiplies the documents.
- Interests are stored trimmed, lowercased and de-duplicated, so `Chess` and `chess` end up in one group.
- Pages advance alphabetically: `nextCursor` is the last interest returned.

### Posts of a user

`GET /api/users/:id/posts?limit=20&cursor=<postId>`: a single pipeline with `$lookup`.

```ts
const postStages: PipelineStage.Lookup['$lookup']['pipeline'] = [
  ...(cursor ? [{ $match: { _id: { $lt: toObjectId(cursor) } } }] : []),
  { $sort: { _id: -1 } },
  { $limit: limit + 1 },
  {
    $project: {
      _id: 0,
      id: '$_id',
      title: '$title',
      body: '$body',
      createdAt: '$createdAt',
    },
  },
];

const [result] = await this.userModel.aggregate<UserPosts>([
  { $match: { _id: authorId } },
  { $project: { name: 1 } },
  {
    $lookup: {
      from: this.postModel.collection.name,
      localField: '_id',
      foreignField: 'author',
      pipeline: postStages,
      as: 'posts',
    },
  },
  { $project: { _id: 0, author: { id: '$_id', name: '$name' }, posts: 1 } },
]);
```

- The pipeline starts from `users`, so an unknown user returns `404` instead of an empty list. The author's details come back in the same round trip.
- The cursor, sort and limit sit inside the `$lookup` sub-pipeline. `{ author: 1, _id: -1 }` handles the equality, the range and the sort, so each page reads `limit + 1` index keys and does no in-memory sort.
- Using `localField`/`foreignField` together with `pipeline` requires MongoDB 5.0 or later.

```json
{
  "data": {
    "author": { "id": "6716f1c2e4b0a1b2c3d4e5f6", "name": "Amara Okafor" },
    "posts": [{ "id": "6717aa01e4b0a1b2c3d4e601", "title": "Opening theory", "body": "…", "createdAt": "2026-10-20T09:12:00.000Z" }]
  },
  "meta": { "limit": 20, "hasNextPage": false, "nextCursor": null }
}
```

## Security

| Concern | Measure |
| ------- | ------- |
| Password storage | argon2id (m = 19456 KiB, t = 2, p = 1); `password` field is `select: false` |
| User enumeration | Login always gives the same error, and runs a verify against a dummy hash when the email is unknown, so response times match |
| Brute force | 5 requests per minute per IP on register and login |
| Token theft | httpOnly cookie, `SameSite=Lax`, `Secure` in production |
| Token revocation | Each JWT carries the user's `tokenVersion`, checked on the existing `_id` lookup, so no extra index. Logout, password change and an admin password reset increment it, which invalidates every token issued before |
| Privilege escalation | Role loaded from the database on each request; register and profile updates do not accept `role` |
| Orphaned data | Deleting a user removes the user, their notes and their posts in one transaction |
| Insecure direct object reference | Ownership is part of the query filter, e.g. `{ _id, owner }` |
| Operator injection, mass assignment | Global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`, so every query value is a validated string or `ObjectId`; schemas use `strictQuery` |
| Configuration | Environment validated at startup; the app refuses to start on a missing or weak `JWT_SECRET` |
| Headers | `helmet`; CORS limited to `CORS_ORIGIN` |

## Validation

The same rules are enforced by class-validator on the server and Zod on the client.

| Field | Rules |
| ----- | ----- |
| `name` | trimmed, 2–50 characters |
| `email` | trimmed, lowercased, valid email, max 254 |
| `password` | 8–128 characters, at least one letter and one digit |
| `interests` | up to 10; each trimmed, lowercased, 2–30 characters of letters, digits, spaces or hyphens; duplicates removed |
| note `title` / `content` | 1–120 / 1–10 000 characters |
| post `title` / `body` | 3–150 / 1–5 000 characters |
| `limit` | integer 1–100 |
| `:id`, `cursor`, `ownerId` | 24-character hex `ObjectId` (interest cursor follows the interest rules) |

Update requests accept a partial body and reject an empty one.

## Frontend

- `proxy.ts` (the Next.js 16 replacement for middleware) redirects protected routes to `/login` when no session cookie is present. Protected and admin layouts then confirm the session with `/api/auth/me`. The API still enforces every permission.
- Yarn uses the `node-modules` linker because Turbopack does not support Plug'n'Play.
- Code is organized by feature (`features/auth`, `notes`, `posts`, `users`, `interests`). Each feature has its own API calls, hooks, Zod schemas and components, built on shared UI primitives in `components/ui`.
- All lists share one `useInfiniteQuery` wrapper and a "Load more" control.
- Forms use React Hook Form with Zod schemas that mirror the server rules. A shared `useFormSubmit` hook maps server validation messages back onto the matching fields.
- Colors come from the Radix Colors Sand and Teal scales and are used through semantic tokens. Every text pairing meets WCAG 2.2 AA contrast in both light and dark themes. Fonts: IBM Plex Sans, Source Serif 4, IBM Plex Mono.

## Out of Scope

Refresh tokens, email verification, password reset, full-text search, editing or deleting posts, and automated tests.
