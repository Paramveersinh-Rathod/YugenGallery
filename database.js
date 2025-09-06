import mongoose from "mongoose";

mongoose.connect(uri) // No extra options needed
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));


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