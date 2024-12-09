require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { type } = require("os");
const app = express();

// Manage DB connection
mongoose.connect(process.env.MONGO_URI, {});
const database = mongoose.connection;
database.on("error", (error) =>
  console.error("Database connection error:", error),
);
database.once("open", () => console.log("Database connected"));

// Define data schemas (document formatting)
const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  accessToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const classSchema = new mongoose.Schema({
  code: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  }
});

const ratingSchema = new mongoose.Schema({
  code: {
    required: true,
    type: String,
  },
  rating: {
    required: true,
    type: Number,
  },
  difficulty: {
    required: true,
    type: Number,
  },
  professor: {
    required: true,
    type: String,
  },
  comments: {
    required: true,
    type: String,
  },
  createdBy: {
    required: true,
    type: String,
  }
});

// Define cursor to the collection
const User = mongoose.model("User", userSchema);
const Class = mongoose.model("Class", classSchema);
const Rating = mongoose.model("Rating", ratingSchema);

app.use(express.json());

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, "dist/ratemyclass-frontend/browser")));

// Token Helper Functions
const generateAccessToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const authenticateToken = async (req, res, next) => {
  console.log(req)
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  try {
    const user = await User.findOne({ accessToken: token });
    if (!user) return res.sendStatus(403);

    req.user = user;
    next();
  } catch (error) {
    res.sendStatus(500).json({ message: error.message });
  }
};

// ------------------- API ROUTING -------------------

app.get("/api/test", async (req, res) => {
  res.status(200).json("Hello, World!");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken();

    user.accessToken = accessToken;
    await user.save();

    res.status(200).json({ username: user.username, accessToken: accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({messages: 'success'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/addClass", authenticateToken, async (req, res) => {
  const { courseCode, courseTitle } = req.body;

  try {
    const existingClass = await Class.findOne({ code: courseCode });
    if (existingClass) {
      return res.status(400).json({ message: "Course already exists." });
    }


    const newClass = new Class({
      code: courseCode,
      title: courseTitle
    });

    const savedClass = await newClass.save();
    res.status(201).json({messages: 'success'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/getCourses', async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const courses = await Class.find({
      code: { $regex: query, $options: 'i' }
    }).limit(10);

    res.json(courses.map(course => course.code));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/api/getTitle/:courseCode', async (req, res) => {
  const { courseCode } = req.params;

  try {
    const course = await Class.findOne({ code: courseCode });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ courseTitle: course.title });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/api/getRatings/:courseCode', async (req, res) => {
  const { courseCode } = req.params;

  try {
    const ratings = await Rating.find({ code: courseCode });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ratings', error: error.message });
  }
});

app.post('/api/rateCourse', authenticateToken, async (req, res) => {
  const { code, rating, difficulty, professor, comments, createdBy } = req.body;

  if (!code || !rating || !difficulty || !professor || !comments || !createdBy) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {

    const newRating = new Rating({
      code,
      rating,
      difficulty,
      professor,
      comments,
      createdBy,
    });

    const savedRating = await newRating.save();

    res.status(201).json({message: 'success',});

  } catch (error) {

    console.error(error);
    
    res.status(500).json({ message: 'Error saving rating', error: error.message });
  }
});


// Server static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/ratemyclass-frontend/browser/index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});