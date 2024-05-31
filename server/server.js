// server.js
const express = require("express");
const { StreamChat } = require("stream-chat");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

const apiKey = "4aa9juvhnvyq";
const apiSecret =
  "r5kv8uqbgnjhkjeheyrdznfxtym7r2zutzdurezmkf9fcmr8f4s257fxcww4zrhx";
const serverClient = new StreamChat(apiKey, apiSecret);

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Route to get token for a specific user
app.get("/static-token", (req, res) => {
  const userId = "static-user-id"; // Replace with your static user ID
  const token = serverClient.createToken(userId);
  res.json({ token });
});

const PORT = process.env.PORT || 5001; // Change the port here if necessary
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
