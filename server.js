const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
require('dotenv/config');

// IMPORT ROUTES
const postRoute = require('./routes/posts')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')

const app = express();

// MIDDLEWARES
app.use(bodyParser.json())
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/post', postRoute)


// ROUTES
app.get("/", (req, res) => {
  res.send("We are learning how to create a rest api with nodejs");
});

// CONNECT TO DB
mongoose.connect(
  process.env.MONGO_DB_URI,
  () => console.log("db connected successfully")
);

app.listen(4000);
