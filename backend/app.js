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
// Uniqueness is checked server-side
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

const taskSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  dueDate: {
    type: Date,
  },
  include: {
    require: true,
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const statsSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  timeStudy: {
    /* Cummulative time studying (Pomodoro session based)  */ type: Number,
  },
  completedTasks: {
    /* Number of tasks removed (Making assumption that all input tasks are correct) */ type: Number,
  },
  tasksLifetime: {
    /* Total Number of tasks (active and inactive) */ type: Number,
  },
  NumberSessions: {
    /* Number of Pomodoro timers started AND completed */ type: Number,
  },
  streak: {
    /* Current consecutive Number days on the application */ type: Number,
  },
  longestStreak: {
    /* Max consecutive Number days on the application */ type: Number,
  },
  activeDays: { /* Number days on the application (lifetime)*/ type: Number },
  lastDateOnline: { type: Date },
});

// Define cursor to the collection
const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);
const Stats = mongoose.model("Stats", statsSchema);

app.use(express.json());

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, "dist/ratemyclass-frontend/browser")));

// Token Helper Functions
const generateAccessToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const authenticateToken = async (req, res, next) => {
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