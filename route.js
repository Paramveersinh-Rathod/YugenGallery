import express from "express";
import bodyParser from "body-parser";

import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

import multer from "multer";
import 'dotenv/config';
const uri = process.env.MONGO_URI;
const storage = multer.memoryStorage();
const upload = multer({ storage }); 

mongoose.connect(uri) 
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cardSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    authorName: String,
    typeOfArt: String,
    image: String,
    imgId: String
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);


const app = express();
const port = process.env.PORT || 3000; // Use Render's port if available
const cards = {}
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: "10mb" }));  // Allow large JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));  // Allow form data


app.get("/", (req, res) => {
    const readFun = async () => {
        try {
          const cards = await Card.find({});
          const recentPosts = await Card.aggregate([
            { $sort: { createdAt: -1 } },  // Sort by newest first
            { $limit: 3 },                 // Limit to 3 documents
            { 
              $project: { 
                createdAt: { 
                  $dateToString: { format: "%B %d, %Y", date: "$createdAt" } 
                },
                title: 1, 
                body: 1, 
                image: 1, 
                _id: 0  // Exclude `_id`
              } 
            }
          ]);
          res.render("home.ejs", {cards, recentPosts});
        } catch (error) {
          console.error("Error:", error);
        }
      };
      
      readFun();   
});

// Handle form submission with image upload
app.post("/submit", upload.single("NPimage"), async (req, res) => {
  try {
    console.log("Received Form Data:", req.body);
    console.log("Received File:", req.file);
    console.log("File Buffer Length:", req.file?.buffer?.length);
    const { NPtitle, NPbody, NPauthorName, NPdropdown, editMode, oldId,oldImgId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image data provided!" });
    }
    // Upload image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blog_images", timeout: 60000  },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }

        const imagePath = result.secure_url; // Cloudinary image URL
        const imagePubId = result.public_id; // Cloudinary image ID

        if (editMode === "true") {
          // Update existing post
          await Card.findByIdAndUpdate(oldId, {
            title: NPtitle,
            body: NPbody,
            authorName: NPauthorName,
            typeOfArt: NPdropdown,
            image: imagePath,
            imgId: imagePubId
          });
          cloudinary.uploader.destroy(oldImgId, (error, result) => {
            if (error) console.log(error);
            else console.log('Delete result:', result);
          });
        } else {
          // Create a new post
          await Card.create({
            title: NPtitle,
            body: NPbody,
            authorName: NPauthorName,
            typeOfArt: NPdropdown,
            image: imagePath,
            imgId: imagePubId
          });
        }

        res.json({ success: true });
      }
    );

    uploadStream.end(req.file.buffer); // Send image buffer to Cloudinary

  } catch (error) {
    console.error("Error in /submit:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




app.post("/delete", (req, res) => {
    const { id, imageid } = req.body;
    const deleteFun = async() => {
        try{
            // Delete operation
            await Card.deleteOne({ _id: id });
            cloudinary.uploader.destroy(imageid, (error, result) => {
              if (error) console.log(error);
              else console.log('Delete result:', result);
            });
            
        } catch(error) {
            console.log("error is:" + error);
        }
    };
    deleteFun();
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});