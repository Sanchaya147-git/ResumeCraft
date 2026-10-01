const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI, {
  family: 4,
  serverSelectionTimeoutMS: 15000
});

let resumesCollection;


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "ResumeCraft Backend is running!",
    database: "MongoDB Atlas"
  });
});


// ===============================
// AI SUMMARY
// ===============================

app.post("/api/improve-summary", async (req, res) => {
  try {
    const { summary } = req.body;

    if (!summary || !summary.trim()) {
      return res.status(400).json({
        message: "Summary is required."
      });
    }

    const improvedSummary =
      `Computer Science student with strong interest in ${summary}. ` +
      `Passionate about developing technical skills, solving problems, ` +
      `and building practical software solutions.`;

    res.status(200).json({
      improvedSummary
    });

  } catch (error) {
    console.error("AI SUMMARY ERROR:", error);

    res.status(500).json({
      message: "Something went wrong while improving the summary."
    });
  }
});


// ===============================
// SAVE RESUME
// ===============================

app.post("/api/resumes", async (req, res) => {
  try {
    const resumeData = req.body;

    if (!resumeData || Object.keys(resumeData).length === 0) {
      return res.status(400).json({
        message: "Resume data is required."
      });
    }

    const resume = {
      ...resumeData,
      savedAt: new Date()
    };

    const result = await resumesCollection.insertOne(resume);

    console.log("✅ Resume saved to MongoDB!");

    res.status(201).json({
      message: "Resume saved successfully!",
      resume: {
        ...resume,
        _id: result.insertedId
      }
    });

  } catch (error) {
    console.error("SAVE RESUME ERROR:", error);

    res.status(500).json({
      message: "Failed to save resume."
    });
  }
});


// ===============================
// GET ALL RESUMES
// ===============================

app.get("/api/resumes", async (req, res) => {
  try {

    const resumes = await resumesCollection
      .find({})
      .sort({ savedAt: -1 })
      .toArray();

    res.json({
      resumes
    });

  } catch (error) {

    console.error("GET RESUMES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch resumes."
    });
  }
});


// ===============================
// START SERVER
// ===============================

const PORT = 5000;

async function startServer() {

  try {

    console.log("Connecting to MongoDB...");

    await client.connect();

    await client.db("admin").command({
      ping: 1
    });

    console.log("✅ MongoDB connected successfully!");

    const database = client.db("resumecraft");

    resumesCollection = database.collection("resumes");

    console.log("✅ Database: resumecraft");

    console.log("✅ Collection: resumes");

    app.listen(PORT, () => {

      console.log("=================================");
      console.log("✅ ResumeCraft Backend Started");
      console.log(`✅ http://localhost:${PORT}`);
      console.log("✅ MongoDB Atlas Connected");
      console.log("=================================");

    });

  } catch (error) {

    console.error("❌ MongoDB CONNECTION ERROR:");
    console.error(error);

    process.exit(1);
  }
}

startServer();