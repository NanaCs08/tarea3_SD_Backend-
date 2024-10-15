const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authorsRoute = require('./functions/authors');
const publishersRoute = require('./functions/publishers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/authors', authorsRoute);
app.use('/api/publishers', publishersRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
