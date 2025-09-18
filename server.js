const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URL } = require('./config/config.js');

mongoose.connect(MONGO_URL)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((e) => console.log("Error trying connecting MongoDB", e));

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello, World with Express And Docker !!! '));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));