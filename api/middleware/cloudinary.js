const cloudinary = require("cloudinary").v2;

require("dotenv").config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  // api_key: process.env.API_KEY,
  api_key: "415995813342542",
  api_secret: process.env.API_SECRET,
  cloudinary_url: process.env.CLOUDINARY_URL
});

module.exports = cloudinary;
