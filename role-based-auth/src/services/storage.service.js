const ImageKit = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(fileBuffer) {
    const result = await ImageKitClient.files.upload({
        file: fileBuffer.toString("base64"),
        fileName: "music_" + Date.now() + ".mp3",
        folder: "music"
    });

    return result;
}

module.exports = { uploadFile };