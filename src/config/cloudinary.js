import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })
//console.log('api'+process.env.CLOUDINARY_CLOUD_NAME)
const url = new URL(process.env.CLOUDINARY_URL.replace("cloudinary://", "https://"))

cloudinary.config({
  cloud_name: url.hostname,
  api_key: url.username,
  api_secret: url.password,
})

export default cloudinary