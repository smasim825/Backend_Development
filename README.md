# 📘 Master Backend Architecture & Concept Notes
> **A Comprehensive Guide to Core Concepts, Security, APIs, Validation, and Testing**

---

## 📑 Table of Contents
1. [Architecture: `app.js` vs `server.js`](#1-architecture-appjs-vs-serverjs)
2. [End-to-End API Execution Flow](#2-end-to-end-api-execution-flow)
3. [Frontend Data Fetching: `fetch` vs `axios`](#3-frontend-data-fetching-fetch-vs-axios)
4. [Password Hashing (Bcrypt)](#4-password-hashing-bcrypt)
5. [JWT (JSON Web Tokens) & Token Generation](#5-jwt-json-web-tokens--token-generation)
6. [Security Storage: Cookies vs LocalStorage](#6-security-storage-cookies-vs-localstorage)
7. [Complete Authentication System Flow](#7-complete-authentication-system-flow)
8. [Cloud File Uploads (Multer & ImageKit)](#8-cloud-file-uploads-multer--imagekit)
9. [Request Validation (`express-validator`)](#9-request-validation-express-validator)
10. [Automated Testing: `Jest` & `Supertest`](#10-automated-testing-jest--supertest)

---

## 1. Architecture: `app.js` vs `server.js`

### ❓ Why separate `app.js` and `server.js`?

| File | Responsibility | Contents |
| :--- | :--- | :--- |
| **`app.js`** | **App Configuration** | Express setup, parsing middleware (`express.json()`), CORS, mounting routes. Does **NOT** call `.listen()`. |
| **`server.js`** | **Server Execution** | Imports `app.js`, connects to MongoDB, starts listening on a network port (`app.listen(PORT)`). |

### 💡 Primary Benefit for Testing:
If `.listen()` is in `app.js`, running tests with `Supertest` will attempt to launch real HTTP servers on network ports repeatedly, causing `EADDRINUSE` port conflict errors. Separating `app.js` allows `Supertest` to test route logic directly without occupying a network port.

---

## 2. End-to-End API Execution Flow

When a client sends a request (e.g., `POST /api/auth/register`), it travels through a pipeline:

```text
[ Client (Postman/React) ]
          │
          ▼  (HTTP Request Payload)
[ Express App (app.js) ]
          │
          ▼  (Match Route Path)
[ Router (auth.routes.js) ]
          │
          ▼  (Check Input Rules)
[ Validator (auth.validator.js) ]
          │
          ▼  (Catch Validation Errors)
[ Validation Middleware (validate.js) ]
          │
          ▼  (Verify Token & Roles)
[ Auth Middleware (auth.middleware.js) ]
          │
          ▼  (Execute Business Logic)
[ Controller (auth.controller.js) ]
          │
          ▼  (Database Query)
[ Mongoose Model (user.model.js) ] ◄──► [ MongoDB Atlas ]
          │
          ▼  (Format JSON Response)
[ Client Receives Response ]
```

---

## 3. Frontend Data Fetching: `fetch` vs `axios`

| Feature | native `fetch` | `axios` |
| :--- | :--- | :--- |
| **JSON Parsing** | Manual (`await response.json()`) | Automatic (`response.data`) |
| **HTTP Error Handling** | Does **NOT** reject on 404 or 500 (requires `if (!res.ok)`) | Automatically rejects promise on 4xx/5xx status codes |
| **Sending Cookies** | Requires `{ credentials: 'include' }` | Requires `{ withCredentials: true }` |
| **Request Interceptors** | Not natively supported | Supported out of the box |

---

## 4. Password Hashing (Bcrypt)

### ❓ Why not store plain-text passwords?
If a database is breached, plain-text passwords expose user accounts across multiple web services.

### 🔐 How Bcrypt Hashing Works:
1. **Salt**: A random string added to the password before hashing so identical passwords result in completely different hashes.
2. **Salt Rounds (Cost Factor)**: Determines how computationally intensive the hashing is (e.g., `10` rounds).
3. **One-Way Function**: Hashing cannot be reversed/decrypted back into the original password string.

```javascript
const bcrypt = require('bcryptjs');

// 1. Hash Password during Registration
const hashedPassword = await bcrypt.hash(rawPassword, 10);

// 2. Compare Password during Login
const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
```

---

## 5. JWT (JSON Web Tokens) & Token Generation

### ❓ What is a JWT?
A JSON Web Token is a compact, URL-safe string used to securely transmit information between parties as a JSON object.

### 🧩 The 3 Parts of a JWT (`Header.Payload.Signature`):
1. **Header**: Specifies algorithm (e.g., `HS256`) and token type (`JWT`).
2. **Payload**: User data (e.g., `{ id: "123", role: "artist" }`). *Never store sensitive passwords here!*
3. **Signature**: Cryptographic signature calculated using `Header + Payload + SecretKey`.

```javascript
const jwt = require('jsonwebtoken');

// Generate Token
const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
);

// Verify Token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## 6. Security Storage: Cookies vs LocalStorage

| Feature | LocalStorage | HTTP-Only Cookies |
| :--- | :--- | :--- |
| **JavaScript Accessibility** | Accessible via `localStorage.getItem()` | **Inaccessible** to JavaScript (`httpOnly: true`) |
| **XSS Attack Vulnerability** | **High** (Malicious scripts can steal token) | **Protected** (Browser handles cookie automatically) |
| **Automatic Transmission** | Must manually attach to Authorization header | **Automatic** with every HTTP request to matching domain |

```javascript
// Setting HTTP-Only Cookie in Express
res.cookie('token', token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: 24 * 60 * 60 * 1000 // 1 day expiry
});
```

---

## 7. Complete Authentication System Flow

```text
1. USER REGISTRATION
   User Submits (Username, Email, Password)
     ──► Hash Password with Bcrypt
     ──► Save User to Database

2. USER LOGIN
   User Submits (Email, Password)
     ──► Find User in Database by Email
     ──► Compare Passwords with bcrypt.compare()
     ──► Generate JWT Token with jwt.sign()
     ──► Set Token in res.cookie('token', token, { httpOnly: true })

3. ACCESSING PROTECTED ROUTES
   User Requests (GET /api/music/albums)
     ──► Browser automatically attaches Cookie ('token')
     ──► Middleware extracts req.cookies.token
     ──► Verify Token with jwt.verify()
     ──► Attach user object to req.user
     ──► Proceed to Controller if role checks pass

4. USER LOGOUT
   User Hits (POST /api/auth/logout)
     ──► Execute res.clearCookie('token')
```

---

## 8. Cloud File Uploads (Multer & ImageKit)

### 📤 Upload Pipeline:
1. **Client Sends File**: `multipart/form-data` payload containing image or audio file.
2. **Multer Middleware**: Parses file in memory buffer (`multer.memoryStorage()`) available at `req.file.buffer`.
3. **ImageKit Cloud Upload**: Base64 converts buffer (`req.file.buffer.toString('base64')`) and uploads to ImageKit CDN storage to obtain public URI.

```javascript
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('music'), async (req, res) => {
    const fileBase64 = req.file.buffer.toString('base64');
    const cloudResponse = await imagekit.upload({ file: fileBase64, fileName: req.file.originalname });
    res.status(201).json({ uri: cloudResponse.url });
});
```

---

## 9. Request Validation (`express-validator`)

### ❓ Why validate inputs before controllers?
Prevents invalid or malicious data from reaching your database, preventing application crashes and database corruption.

```javascript
// 1. Define Rules
const registerValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

## 10. Automated Testing: `Jest` & `Supertest`

| Tool | Role & Purpose |
| :--- | :--- |
| **Jest** | **Test Runner & Assertion Framework**: Executes tests, provides `describe()`, `it()`, and assertions (`expect().toBe()`). |
| **Supertest** | **HTTP Assertion Library**: Simulates HTTP requests (`request(app).get('/api')`) to Express without requiring a running server port. |

### 📝 Example Test Case:
```javascript
const request = require('supertest');
const app = require('../app');

describe('GET /api/user/profile', () => {
    it('should return status 200 and user details', async () => {
        const response = await request(app).get('/api/user/profile');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
    });
});
```
