# 🚀 Backend Web Development Master Learning Notes
> **A Complete Step-by-Step Backend Architecture & Quick Revision Guide**

---

## 📌 Roadmap Overview
This guide summarizes all essential backend engineering concepts from basic server setup to production-grade role-based access control, input validation, and automated testing.

```
Level 1: Express Basics & REST APIs
   ↓
Level 2: Full-Stack CRUD & Cloud File Storage
   ↓
Level 3: User Authentication & JWT Cookies
   ↓
Level 4: Role-Based Access Control (RBAC), DB Relations & Pagination
   ↓
Level 5: Request Validation & Automated Testing
```

---

## 🟢 Level 1: Express.js Fundamentals & REST APIs
*Folder: `mongoDB with Server` / `RestAPI notes`*

### 💡 Core Concepts:
- **Express Server Setup**: Initialize an Express server with middleware and port listeners.
- **REST API HTTP Methods**:
  - `GET`: Retrieve data from server (`200 OK`).
  - `POST`: Send new data to server (`201 Created`).
  - `PUT` / `PATCH`: Update existing resource (`200 OK`).
  - `DELETE`: Remove resource (`200 OK` / `204 No Content`).
- **Database Connection**: Connect Node.js to MongoDB Atlas using `mongoose.connect(MONGO_URI)`.

### 📝 Key Code Snippet:
```javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.listen(8000, () => console.log("Server listening on port 8000"));
```

---

## 🟡 Level 2: Full-Stack CRUD & Cloud File Uploads
*Folder: `CRUD website`*

### 💡 Core Concepts:
- **Mongoose Models**: Define structured database collections using `mongoose.Schema`.
- **Multer Memory Buffer**: Process file uploads in memory (`multer.memoryStorage()`) instead of saving to disk.
- **ImageKit CDN Upload**: Convert file buffer to Base64 and send to ImageKit storage to receive a CDN URL (`result.url`).

### 📝 Key Code Snippet:
```javascript
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Handle file upload route
app.post('/upload', upload.single('image'), async (req, res) => {
    const fileBase64 = req.file.buffer.toString('base64');
    const result = await imagekit.upload({ file: fileBase64, fileName: req.file.originalname });
    res.status(201).json({ url: result.url });
});
```

---

## 🟠 Level 3: User Authentication & JWT Security
*Folder: `AuthLearn`*

### 💡 Core Concepts:
- **Password Hashing**: Encrypt passwords with `bcrypt.hash(password, 10)` before saving to database. Verify with `bcrypt.compare`.
- **JSON Web Tokens (JWT)**: Generate encrypted token containing user payload signed with a secret key.
- **HTTP-Only Cookies**: Send JWT token in secure cookies (`httpOnly: true`) to protect against Cross-Site Scripting (XSS).
- **Auth Middleware**: Protect routes by verifying cookie tokens (`jwt.verify()`) before granting access.

### 📝 Key Code Snippet:
```javascript
// Register
const hashedPassword = await bcrypt.hash(password, 10);
const user = await userModel.create({ username, email, password: hashedPassword });

// Login & Issue Token in Cookie
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
res.cookie('token', token, { httpOnly: true }).json({ message: "Login successful" });
```

---

## 🔴 Level 4: Role-Based Access Control (RBAC), Data Relations & Pagination
*Folder: `role-based-auth`*

### 💡 Core Concepts:
- **Role-Based Access Control (RBAC)**: Enforce strict role checks (`"user"` vs `"artist"`) in middleware.
- **Data Population (`.populate()`)**: Connect schemas using `ObjectId` references (`ref: 'user'`) and expand detailed objects upon query.
- **Field Selection (`.select()`)**: Exclude heavy array properties (e.g. `.select("-musics")`) when fetching summary lists.
- **Database Pagination (`.skip()` & `.limit()`)**: Page results (`.skip(1).limit(2)`) to keep payload light and response times fast.

### 📝 Key Code Snippet:
```javascript
// Exclude musics array when fetching album list
async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("-musics").populate("artist", "username email");
    res.status(200).json({ albums });
}

// Fetch single album by ID with full populated tracks
async function getAlbumById(req, res) {
    const album = await albumModel.findById(req.params.id).populate("artist", "username email").populate("musics");
    res.status(200).json({ album });
}

// Paginated Music Fetch
async function getAllMusics(req, res) {
    const skip = parseInt(req.query.skip) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const musics = await musicModel.find().skip(skip).limit(limit);
    res.status(200).json({ musics });
}
```

---

## 🟣 Level 5: Input Validation & Automated Testing
*Folder: `express-validation-jest`*

### 💡 Core Concepts:
- **Express-Validator Rules**: Validate incoming payloads (`body('email').isEmail()`, `body('password').isLength({ min: 6 })`) before executing controllers.
- **Generic Error Handler Middleware**: Convert validation errors into clean JSON response format.
- **Jest & Supertest Integration Testing**: Test API routes programmatically without running a manual server port.

### 📝 Key Code Snippet:
```javascript
// Validation Middleware
function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// Jest & Supertest Integration Test
describe('POST /api/auth/register', () => {
    it('should fail when email format is invalid', async () => {
        const res = await request(app).post('/api/auth/register').send({ email: 'bad-email' });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe('fail');
    });
});
```

---

## 🎯 Quick Revision Checklist for Next Time
1. ✅ **Server**: Express app setup & CORS/JSON middleware.
2. ✅ **DB Connection**: Mongoose connected to MongoDB Atlas.
3. ✅ **CRUD & Storage**: Multer + ImageKit cloud uploads.
4. ✅ **Auth & Security**: Bcrypt hashing + JWT token stored in HTTP-Only Cookie.
5. ✅ **RBAC**: Middleware enforcing `artist` vs `user` permissions.
6. ✅ **Query Optimization**: `.select("-field")` for light responses & `.skip().limit()` for pagination.
7. ✅ **Validation**: `express-validator` rules + central middleware.
8. ✅ **Testing**: `jest` + `supertest` covering status codes & response bodies.
