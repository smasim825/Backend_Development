# 🚀 Master Backend Architecture & Concept Revision Notes
> **Complete Unified Guide combining Core Architecture, Handwritten Notes, Security, Redis, Validation, and Jest Testing.**

---

## 📑 Clickable Table of Contents
1. [Architecture: `app.js` vs `server.js`](#1-architecture-appjs-vs-serverjs)
2. [Terminal & Postman Request Execution Flow](#2-terminal--postman-request-execution-flow)
3. [CommonJS Module System & Express Route Anatomy](#3-commonjs-module-system--express-route-anatomy)
4. [Raw Bytes Stream & Middleware "Receptionist" Analogy](#4-raw-bytes-stream--middleware-receptionist-analogy)
5. [Primary Middleware Use Cases & CORS Mechanics](#5-primary-middleware-use-cases--cors-mechanics)
6. [REST API Principles, HTTP Methods & Status Codes](#6-rest-api-principles-http-methods--status-codes)
7. [5-Step Full-Stack Cloud Upload Workflow (React ➔ ImageKit ➔ MongoDB)](#7-5-step-full-stack-cloud-upload-workflow-react--imagekit--mongodb)
8. [Mongoose Schemas (DDL) vs Models (DML) & Multer/FormData](#8-mongoose-schemas-ddl-vs-models-dml--multerformdata)
9. [Axios vs Fetch, Dynamic Routes (`:param`) & Nodemon](#9-axios-vs-fetch-dynamic-routes-param--nodemon)
10. [RAM Volatility & MongoDB Cluster Architecture](#10-ram-volatility--mongodb-cluster-architecture)
11. [MVC Directory Pipeline & Folder Responsibilities](#11-mvc-directory-pipeline--folder-responsibilities)
12. [Password Hashing Mechanics (Bcrypt & Salt Rounds)](#12-password-hashing-mechanics-bcrypt--salt-rounds)
13. [JWT Token Generation, Structure & Verification Decision Tree](#13-jwt-token-generation-structure--verification-decision-tree)
14. [Browser Storage: Cookies vs LocalStorage & Cookie Parser](#14-browser-storage-cookies-vs-localstorage--cookie-parser)
15. [The 4 Security Definitions (Validation vs Verification vs Authentication vs Authorization)](#15-the-4-security-definitions-validation-vs-verification-vs-authentication-vs-authorization)
16. [Token Blacklisting & Redis In-Memory Storage](#16-token-blacklisting--redis-in-memory-storage)
17. [Request Validation (`express-validator`)](#17-request-validation-express-validator)
18. [Automated Testing: `Jest` & `Supertest`](#18-automated-testing-jest--supertest)
19. [Full Level-by-Level Folder Roadmap (Level 1 to Level 5)](#19-full-level-by-level-folder-roadmap-level-1-to-level-5)

---

## 1. Architecture: `app.js` vs `server.js`

### ❓ Why separate `app.js` and `server.js`?

| File | Responsibility | Contents |
| :--- | :--- | :--- |
| **`app.js`** | **App Configuration** | Express setup, parsing middleware (`express.json()`), CORS, mounting routes. Does **NOT** call `.listen()`. |
| **`server.js`** | **Server Execution** | Imports `app.js`, connects to MongoDB, starts listening on a network port (`app.listen(PORT)`). |

### 💡 Primary Benefit for Testing:
If `.listen()` is placed in `app.js`, running tests with `Supertest` will attempt to launch real HTTP servers on network ports repeatedly, causing `EADDRINUSE` port conflict errors. Separating `app.js` allows `Supertest` to test route logic directly without occupying a network port.

---

## 2. Terminal & Postman Request Execution Flow

When executing `node server.js` in terminal:
1. Open **Postman** ➔ Select HTTP Method (`GET` / `POST`).
2. Enter URL: `http://localhost:8000/notes`
   - **Port Number**: `8000`
   - **Endpoint / Route Path**: `/notes` (defines which route/window to open as defined in `app.js`).
3. Click **Send** to trigger the request.

---

## 3. CommonJS Module System & Express Route Anatomy

`app.js` and `server.js` are interconnected using `module.exports` and `require()`. This is known as the **CommonJS Module System**.

```text
[ app.js ]  ──► Exports Express App Object at bottom  ──► module.exports = app;
                                                               │
[ server.js ] ◄── Imports App Object at top           ◄── const app = require('./src/app');
```

### Anatomy of a Route Handler:
```javascript
app.get('/notes', (req, res) => {
    res.json({
        title: "My notes",
        count: 10
    });
});
```
- **`app.get(...)`**: Tells Express to listen for an incoming `GET` request.
- **`'/notes'`**: The root path / endpoint URL.
- **`req` (Request Object)**: Contains all information about the incoming request (headers, params, query, body).
- **`res` (Response Object)**: Used to send the HTTP response back to the client.

---

## 4. Raw Bytes Stream & Middleware "Receptionist" Analogy

1. **Network Transfer**: Data sent from Postman travels over the internet as a **raw stream of text/bytes** (chunks of data).
2. **Node.js Raw Receipt**: Node.js receives raw text/bytes without knowing if it's JSON, XML, or an image. To Node, it is just raw plain text.
3. **The Middleware ("Receptionist")**:
   - Middleware acts like a **receptionist** translating incoming data between the server request and the router handler (`Client Request ◄──► Middleware ◄──► Route Handler`).
   - `app.use(express.json())` acts as a **JSON parser**, converting the raw plaintext stream into a usable JavaScript object (`req.body`).

> ⚠️ **CRITICAL WARNING**: Without `app.use(express.json())`, accessing `req.body` inside your route handler will return `undefined`!

---

## 5. Primary Middleware Use Cases & CORS Mechanics

### 💡 4 Primary Use Cases of Middleware:
1. **Body Parsing (`express.json()`)**: Translates raw text stream ➔ JavaScript object (`req.body`).
2. **Security & Authentication**: Verifies JWT tokens to check if a user is logged in before accessing private endpoints.
3. **Logging (`morgan` / `console.log`)**: Records details of every incoming request.
4. **CORS (`cors()`)**: Allows frontend apps (e.g. React) to communicate with Express backend without browser cross-origin security blocks.

### 🌐 CORS (Cross-Origin Resource Sharing):
- **Problem**: Occurs when React frontend runs on port `5173` and Express backend runs on port `8000`. The browser blocks requests due to mismatched ports.
- **Solution**: Install and configure `cors` middleware (`npm install cors`).
- **How it works**: Express sends a CORS header telling the browser: *"It is safe for the frontend to accept this response."*

---

## 6. REST API Principles, HTTP Methods & Status Codes

**REST** (*Representational State Transfer*) is an architectural style for designing networked applications.
- **Stateless Communication**: Client and server communicate over HTTP. The server **never stores any session state** about the client.
- **Resources & Unique URLs**: Everything is a "Resource" accessible via a unique URL, transferred as **JSON/XML**.

### HTTP Methods Breakdown:
- **`GET`**: Retrieve a resource (`200 OK`).
- **`POST`**: Create a new resource (`201 Created`).
- **`PATCH`**: Partially update a resource (`200 OK`).
- **`PUT`**: Replace an entire resource (`200 OK`).
- **`DELETE`**: Remove a resource (`200 OK` / `204 No Content`).
- **`HEAD`**: Retrieve headers of a resource without downloading the body payload.

### HTTP Status Code Categories:
- **`1XX`**: Informational.
- **`2XX`**: Success (e.g., `200 OK` for JSON payload, `201 Created`).
- **`3XX`**: Redirection.
- **`4XX`**: Client Error (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).
- **`5XX`**: Server Error (e.g., `500 Internal Server Error`).

---

## 7. 5-Step Full-Stack Cloud Upload Workflow (React ➔ ImageKit ➔ MongoDB)

```text
[ 1. React Frontend ] User selects Image & Caption ──► Sent via FormData to Express
                                                             │
[ 2. Express Multer ] Multer catches file ──► Converts file to RAM Buffer (req.file.buffer)
                                                             │
[ 3. ImageKit CDN ] RAM Buffer converted to Base64 ──► Uploaded to ImageKit ──► Returns CDN URL
                                                             │
[ 4. MongoDB Database ] Mongoose saves record ──► { imageUrl: "https://ik.imagekit.io/...", caption: "Text" }
                                                             │
[ 5. React Feed Page ] Calls GET /post ──► Fetches posts ──► Displays Image & Caption
```

---

## 8. Mongoose Schemas (DDL) vs Models (DML) & Multer/FormData

- **Creating a Mongoose Schema (DDL)**: Declares what fields and data types will be stored (`const noteSchema = new mongoose.Schema({ title: String, content: String })`).
- **Creating a Mongoose Model (DML)**: Declares data manipulation instance (`const noteModel = mongoose.model("note", noteSchema)`).
- **`express.json()` vs `multer`**:
  - `express.json()` handles **Raw JSON data**, but fails on binary file uploads.
  - Multipart file uploads (`FormData`) **MUST** use `multer` middleware!

---

## 9. Axios vs Fetch, Dynamic Routes (`:param`) & Nodemon

| Feature | native `fetch` | `axios` |
| :--- | :--- | :--- |
| **Use Case** | Small, simple applications | Larger SaaS / multi-API applications |
| **JSON Parsing** | Manual (`await response.json()`) | Automatic (`response.data`) |
| **HTTP Error Handling** | Does **NOT** reject on 404 or 500 (requires `if (!res.ok)`) | Automatically rejects promise on 4xx/5xx status codes |
| **Sending Cookies** | Requires `{ credentials: 'include' }` | Requires `{ withCredentials: true }` |

- **Dynamic Route Parameters (`:param`)**:
  - Example: `app.delete('/notes/:index', (req, res) => ...)`
  - Everything before `:` is static (`/notes/`), and everything after `:` is dynamic (`:index`). Access via `req.params.index`.
- **Nodemon**:
  - Executed via `npx nodemon server.js`. Automatically restarts the Node.js server upon file changes, avoiding repetitive manual `node server.js` commands.

---

## 10. RAM Volatility & MongoDB Cluster Architecture

- **Why In-Memory Data Resets**: When a Node server restarts, the process stops and the RAM (Random Access Memory) is wiped clean. That's why in-memory arrays reset, and why we use persistent databases!
- **MongoDB Atlas Cluster**: A virtual server instance with CPU, RAM, and Storage hosting database engines.
  - **Network Access Layer**: Whitelists IP addresses to restrict database connections to trusted backend servers.
  - **Database Access Layer**: User credentials enforcing CRUD operations.

---

## 11. MVC Directory Pipeline & Folder Responsibilities

```text
[ Frontend (React/Webpage) ] Action triggered
              │
              ▼
[ app.js ] Creates/configures Express app, connects routes
              │
              ▼
[ Router (routes.js) ] Decides which controller function handles the incoming request
              │
              ▼
[ Controller (controller.js) ] Executes business logic (decides what to do with request)
              │
              ▼
[ Model (model.js) ] Interacts with Mongoose Schema / MongoDB to fetch or update data
```

- **`src/db/db.js`**: Mongoose connection logic.
- **`src/models/`**: Defines entity schemas (`user.model.js`, `product.model.js`, `order.model.js`, `review.model.js`).
- **`src/controllers/`**: Contains actual business logic handlers.
- **`src/routes/`**: Maps URL endpoints to corresponding controller functions.

---

## 12. Password Hashing Mechanics (Bcrypt & Salt Rounds)

### ❓ Why not store plain-text passwords?
If a database is breached, plain-text passwords expose user accounts across multiple web services.

### 🔐 How Bcrypt Hashing Works:
1. **Salt**: A random string added to the password before hashing so identical passwords result in completely different hashes.
2. **Salt Rounds (Cost Factor = 10)**: `const hash = await bcrypt.hash(password, 10);`
   - The number `10` introduces a computational delay for brute-force attacks, making dictionary/hacker attacks take up to 1,000 years to crack!
3. **One-Way Function**: Hashing cannot be reversed/decrypted back into the original password string.

---

## 13. JWT Token Generation, Structure & Verification Decision Tree

### 🧩 The 3 Parts of a JWT (`Header.Payload.Signature`):
1. **Header**: Specifies algorithm (e.g., `HS256`) and token type (`JWT`).
2. **Payload**: User data (e.g., `{ id: "123", role: "artist" }`). *Never store sensitive passwords here!*
3. **Signature**: Cryptographic signature calculated using `Header + Payload + SecretKey`.

### 🌲 Token Verification Decision Tree:

```text
               [ Request to Create Post ]
                           │
                 Is Token Present in Cookie?
                  /                 \
                NO                   YES
                /                     \
       [ 401 Unauthorized ]      Is Token Valid?
                                  /           \
                                NO             YES
                                /               \
                      [ 401 Invalid Token ]  [ Decoded with jwt.verify() ]
                                                    │
                                             Attaches req.user = decoded
                                                    │
                                           [ 201 Post Created Successfully ]
```

---

## 14. Browser Storage: Cookies vs LocalStorage & Cookie Parser

| Feature | LocalStorage | HTTP-Only Cookies |
| :--- | :--- | :--- |
| **JavaScript Accessibility** | Accessible via `localStorage.getItem()` | **Inaccessible** to JavaScript (`httpOnly: true`) |
| **XSS Attack Vulnerability** | **High** (Malicious scripts can steal token) | **Protected** (Browser handles cookie automatically) |
| **Automatic Transmission** | Must manually attach to Authorization header | **Automatic** with every HTTP request to matching domain |

- **`cookie-parser` Middleware**: Installed via `npm i cookie-parser` and mounted using `app.use(cookieParser())`. Allows Express to read cookies into `req.cookies.token`.

---

## 15. The 4 Security Definitions (Validation vs Verification vs Authentication vs Authorization)

| Term | Definition & Purpose | Practical Example |
| :--- | :--- | :--- |
| **Validation** | Checks if the **input data format** is valid before processing. | Checking if input is a valid email string (`isEmail()`). |
| **Verification** | Checks if the input data matches **correct records**. | Verifying an OTP code or confirming an entered phone number matches DB. |
| **Authentication** | Identifies **WHO the user is** making the request. | Verifying JWT token to know if user is User A, User B, or User C. |
| **Authorization** | Identifies **WHAT parts of the site** the user is allowed to access. | Restricting regular customers from accessing the `/admin` dashboard. |

---

## 16. Token Blacklisting & Redis In-Memory Storage

### ❓ What is Token Blacklisting?
JWT tokens are stateless and remain valid until their expiration time. If a user logs out or their token is stolen, the server needs a way to invalidate the token immediately.

### 🔴 Redis for Token Blacklisting:
- **Redis** is an ultra-fast, in-memory key-value database.
- **How Blacklisting Works**:
  1. When a user hits `POST /logout`, the server extracts their JWT token.
  2. The server stores the token in **Redis** with an expiration time equal to the token's remaining lifespan (`redisClient.set(token, 'blacklisted', 'EX', ttl)`).
  3. On every protected request, the auth middleware checks if the incoming token exists in Redis. If found, access is rejected (`401 Token Blacklisted / Logged Out`).

---

## 17. Request Validation (`express-validator`)

### ❓ Why validate inputs before controllers?
Prevents invalid or malicious data from reaching your database, preventing application crashes and database corruption.

```javascript
const { body, validationResult } = require('express-validator');

// 1. Define Rules
const registerValidation = [
    body('username').trim().notEmpty().isLength({ min: 3 }),
    body('email').trim().isEmail(),
    body('password').isLength({ min: 6 })
];

// 2. Process Validation Results in Middleware
function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
```

---

## 18. Automated Testing: `Jest` & `Supertest`

| Tool | Role & Purpose |
| :--- | :--- |
| **Jest** | **Test Runner & Assertion Framework**: Executes tests, provides test blocks (`describe`, `it`), and assertions (`expect().toBe()`). |
| **Supertest** | **HTTP Assertion Library**: Simulates HTTP requests (`request(app).post('/api')`) to Express without requiring a running server port. |

```javascript
const request = require('supertest');
const app = require('../app');

describe('POST /api/auth/register', () => {
    it('should return 400 validation error when email is invalid', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'john', email: 'invalid-email', password: '123' });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
    });
});
```

---

## 19. Full Level-by-Level Folder Roadmap (Level 1 to Level 5)

```text
Level 1: Express Basics & REST APIs (mongoDB with Server)
   ↓
Level 2: Full-Stack CRUD & Cloud File Storage (CRUD website)
   ↓
Level 3: User Authentication & JWT Security (AuthLearn)
   ↓
Level 4: Role-Based Access Control (RBAC), Data Relations & Pagination (role-based-auth)
   ↓
Level 5: Request Validation & Automated Testing (express-validation-jest)
```
