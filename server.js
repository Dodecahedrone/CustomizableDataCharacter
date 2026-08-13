const express = require('express');
const path = require('path');
require('dotenv').config(); // Secures your API key locally

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve your frontend files from a directory named "public"
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`🚀 Server safely running at http://localhost:${PORT}`);
});