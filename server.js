require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
