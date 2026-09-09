const ImageKit = require("@imagekit/nodejs");
const { URLEndpoints } = require("@imagekit/nodejs/resources/accounts/url-endpoints.js");

const imagekit = new ImageKit({

   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT

})


async function uploadFile(buffer) {
   const result = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: "image.jpg"
   })

   return result;
}

async function deleteFile(fileId) {
   const result = await imagekit.files.delete(fileId);
   return result;
}
module.exports = { uploadFile, deleteFile };

