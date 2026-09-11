# 📘 Master Backend Architecture & Concept Notes
> **Complete Handwritten Notes Integration & Full Backend Revision Guide**

---

## 📌 Part 1: Postman Flow, CommonJS & Middleware Mechanics

### 1.1 Terminal & Postman Request Flow
When executing `node server.js` in terminal:
1. Open **Postman** ➔ Select HTTP Method (`GET` / `POST`).
2. Enter URL: `http://localhost:8000/notes`
   - **Port Number**: `8000`
   - **Endpoint / Route Path**: `/notes` (defines which route/window to open as defined in `app.js`).
3. Click **Send** to trigger the request.

---

### 1.2 CommonJS Module System (`app.js` vs `server.js`)
`app.js` and `server.js` are interconnected using `module.exports` and `require()`. This is known as the **CommonJS Module System**.

```text
[ app.js ]  ──► Exports Express App Object at bottom  ──► module.exports = app;
                                                               │
[ server.js ] ◄── Imports App Object at top           ◄── const app = require('./src/app');
```

#### Anatomy of a Route Handler:
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

### 1.3 How Express Reads Postman Data (Raw Stream to JS Object)
1. **Network Transfer**: Data sent from Postman travels over the internet as a **raw stream of text/bytes** (chunks of data).
2. **Node.js Raw Receipt**: Node.js receives raw text/bytes without knowing if it's JSON, XML, or an image. To Node, it is just raw plain text.
3. **The Middleware ("Receptionist")**:
   - Middleware acts like a **receptionist** translating incoming data between the server request and the router handler (`Client Request ◄──► Middleware ◄──► Route Handler`).
   - `app.use(express.json())` acts as a **JSON parser**, converting the raw plaintext stream into a usable JavaScript object (`req.body`).

> ⚠️ **CRITICAL WARNING**: Without `app.use(express.json())`, accessing `req.body` inside your route handler will return `undefined`!

---

### 1.4 Primary Use Cases of Middleware
1. **Body Parsing (`express.json()`)**: Translates raw text stream ➔ JavaScript object (`req.body`).
2. **Security & Authentication**: Verifies JWT tokens to check if a user is logged in before accessing private endpoints.
3. **Logging (`morgan` / `console.log`)**: Records details of every incoming request.
4. **CORS (`cors()`)**: Allows frontend apps (e.g. React) to communicate with Express backend without browser cross-origin security blocks.

---

## 📌 Part 2: REST Architecture, CORS & Full-Stack Cloud CRUD Workflow

### 2.1 REST API Principles & HTTP Status Codes
**REST** (*Representational State Transfer*) is an architectural style for designing networked applications.
- **Stateless Communication**: Client and server communicate over HTTP. The server **never stores any session state** about the client.
- **Resources & Unique URLs**: Everything is a "Resource" accessible via a unique URL, transferred as **JSON/XML**.

#### HTTP Methods Breakdown:
- **`GET`**: Retrieve a resource.
- **`POST`**: Create a new resource.
- **`PATCH`**: Partially update a resource.
- **`PUT`**: Replace an entire resource.
- **`DELETE`**: Remove a resource.
- **`HEAD`**: Retrieve headers of a resource without downloading the body payload.

#### HTTP Status Code Categories:
- **`1XX`**: Informational.
- **`2XX`**: Success (e.g., `200 OK` for JSON payload, `201 Created`).
- **`3XX`**: Redirection.
- **`4XX`**: Client Error (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).
- **`5XX`**: Server Error (e.g., `500 Internal Server Error`).

---

### 2.2 CORS (Cross-Origin Resource Sharing)
- **Problem**: Occurs when React frontend runs on port `5173` and Express backend runs on port `8000`. The browser blocks requests due to mismatched ports.
- **Solution**: Install and configure `cors` middleware (`npm install cors`).
- **How it works**: Express sends a CORS header telling the browser: *"It is safe for the frontend to accept this response."*

---

### 2.3 5-Step Full-Stack Cloud Upload Workflow (React ➔ Express ➔ ImageKit ➔ MongoDB)

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

### 2.4 Mongoose Schemas & Models vs Multer / FormData
- **Creating a Mongoose Schema (DDL)**: Declares what fields and data types will be stored (`const noteSchema = new mongoose.Schema({ title: String, content: String })`).
- **Creating a Mongoose Model (DML)**: Declares data manipulation instance (`const noteModel = mongoose.model("note", noteSchema)`).
- **`express.json()` vs `multer`**:
  - `express.json()` handles **Raw JSON data**, but fails on binary file uploads.
  - Multipart file uploads (`FormData`) **MUST** use `multer` middleware!

---

### 2.5 `Axios` vs `Fetch`, Dynamic Routes, & Nodemon
- **`Axios` vs `Fetch`**:
  - `fetch`: Ideal for smaller, simple applications.
  - `axios`: Preferred for larger SaaS applications (automatic JSON parsing, better error handling).
- **Dynamic Parameters (`:param`)**:
  - Example: `app.delete('/notes/:index', ...)`
  - Everything before `:` is static (`/notes/`), and everything after `:` is dynamic (`:index`). Access via `req.params.index`.
- **Nodemon**:
  - Executed via `npx nodemon server.js`. Automatically restarts the Node.js server upon file changes, avoiding repetitive manual `node server.js` commands.

---

### 2.6 RAM Volatility & Database Cluster Architecture
- **Why In-Memory Data Resets**: When a Node server restarts, the process stops and the RAM (Random Access Memory) is wiped clean. That's why in-memory arrays reset, and why we use persistent databases!
- **MongoDB Atlas Cluster**: A virtual server instance with CPU, RAM, and Storage hosting database engines.
  - **Network Access Layer**: Whitelists IP addresses to restrict database connections to trusted backend servers.
  - **Database Access Layer**: User credentials enforcing CRUD operations.

---

## 📌 Part 3: Architecture Pipeline, Cookies, Token Decision Trees & Security Definitions

### 3.1 MVC Directory Structure & Execution Pipeline

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

### 3.2 Browser Storage, Cookies & `cookie-parser`
- **Cookies**: Browser storage that the server can **directly Read and Update**.
- **`cookie-parser` Middleware**: Installed via `npm i cookie-parser` and mounted using `app.use(cookieParser())`. Allows Express to parse cookies into `req.cookies`.
- **Automatic Transmission**:
  1. Frontend triggers HTTP request.
  2. Browser automatically checks if a Cookie is stored for the domain.
  3. If available, browser automatically attaches the Cookie to request headers.
  4. Backend reads `req.cookies.token` via `cookie-parser` middleware to identify the logged-in user.

---

### 3.3 Token Verification Flow (Decision Tree)

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

- `jwt.verify(token, process.env.JWT_SECRET)` decodes the token payload and unlocks user details (`req.user`), informing the server exactly **who is performing the action**.

---

### 3.4 Password Hashing Mechanics (Bcrypt & Salt Rounds)
- **Why Hash Passwords**: If a database is breached, raw passwords should never be exposed. Passwords must be converted to irreversible hash codes (`Plaintext ➔ Hash Code`).
- **Salt Rounds (Cost Factor = 10)**: `const hash = await bcrypt.hash(password, 10);`
  - The number `10` introduces a computational delay for brute-force attacks, making dictionary/hacker attacks take up to 1,000 years to crack!

---

### 3.5 The 4 Core Security Definitions

| Term | Definition & Purpose | Practical Example |
| :--- | :--- | :--- |
| **Validation** | Checks if the **input data format** is valid before processing. | Checking if input is a valid email string (`isEmail()`). |
| **Verification** | Checks if the input data matches **correct records**. | Verifying an OTP code or confirming an entered phone number matches DB. |
| **Authentication** | Identifies **WHO the user is** making the request. | Verifying JWT token to know if user is User A, User B, or User C. |
| **Authorization** | Identifies **WHAT parts of the site** the user is allowed to access. | Restricting regular customers from accessing the `/admin` dashboard. |
