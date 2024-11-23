import app from "./app.js";
import cloudinary from "cloudinary";
import connectToDb from "./config/database.js";

// PORT
const PORT = process.env.PORT;

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.listen(PORT, async () => {
  await connectToDb();
  console.log(`Server is Running At localhost:${PORT}`);
});
