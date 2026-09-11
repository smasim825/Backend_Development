const express = require('express');
const musicController = require("../controller/music.controller");
const { authArtist, authUser } = require("../middleware/auth.middleware");
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
});

const router = express.Router();

router.post("/upload", authArtist, upload.single("music"), musicController.createMusic);

router.post("/album", authArtist, musicController.createAlbum);

router.get("/", authUser, musicController.getAllMusics);

router.get("/albums", authUser, musicController.getAllAlbums);

router.get("/album/:id", authUser, musicController.getAlbumById);
router.get("/albums/:id", authUser, musicController.getAlbumById);

module.exports = router;