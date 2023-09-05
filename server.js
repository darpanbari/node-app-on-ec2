import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Configure env
dotenv.config();

// Database config
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Database successfully connected!");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

// Define a MongoDB schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Middlewares
app.use(cors());
app.use(express.json());

// REST API
app.post("/add-user", async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Error saving user" });
  }
});

// REST API to retrieve user data
app.get("/get-user", async (req, res) => {
    try {
      const user = await User.find();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user" });
    }
  });

// PORT
const PORT = process.env.PORT || 2020;

// Run server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
