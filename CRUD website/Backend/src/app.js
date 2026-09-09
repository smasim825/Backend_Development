const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { uploadFile, deleteFile } = require('./services/storage.server');
const postModel = require("./models/post.models")

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() })

app.post('/create-post', upload.single("image"), async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    const result = await uploadFile(req.file.buffer);

    const posts = await postModel.create({
        image: result.url,
        caption: req.body.caption,
        fileId: result.fileId
    })

    return res.status(201).json({
        message: "post created successfully",
        posts
    })
})

app.get('/post', async (req, res) => {

    const posts = await postModel.find()

    return res.status(200).json({
        message: "post fetched succesfully",
        posts
    })
})

app.delete('/post/:id', async (req, res) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    if (post && post.fileId) {
        await deleteFile(post.fileId); // 👈 Call deleteFile helper
    }
    await postModel.findByIdAndDelete(id);
    return res.status(200).json({
        message: "post deleted successfully"
    });
});

module.exports = app;