const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./router.js');

// DB setup
mongoose.connect('mongodb://localhost:27017/auth');

const PORT = process.env.PORT || 3030;

const app = express();

app.use(morgan('combined'));
app.use(express.json());

router(app);

app.listen(PORT, () => {
  console.log(`The Server is listening on port: ${PORT}`);
});
