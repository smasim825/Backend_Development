const musicModel = require("../models/music.model");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model");

async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Music file is required" });
        }

        const result = await uploadFile(file.buffer.toString('base64'));

        const music = await musicModel.create({
            uri: result.uri,
            title,
            artist: req.user.id
        });

        res.status(201).json({
            message: "Music uploaded successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function createAlbum(req, res) {
    try {
        const { title, musicIds } = req.body;
        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musicIds
        });

        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getAllMusics(req, res) {
    try {
        const skip = parseInt(req.query.skip) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const musics = await musicModel.find().skip(skip).limit(limit).populate("artist", "username email");

        res.status(200).json({
            message: "Musics fetched successfully",
            count: musics.length,
            musics: musics
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getAllAlbums(req, res) {
    try {
        const albums = await albumModel.find().select("-musics").populate("artist", "username email");

        res.status(200).json({
            message: "Albums fetched successfully",
            albums: albums
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getAlbumById(req, res) {
    try {
        const { id } = req.params;
        const album = await albumModel.findById(id).populate("artist", "username email").populate("musics");

        if (!album) {
            return res.status(404).json({ message: "Album not found" });
        }

        res.status(200).json({
            message: "Album fetched successfully",
            album: album
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById };