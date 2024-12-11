require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatController = require('./controllers/chatController');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/tina', chatController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
