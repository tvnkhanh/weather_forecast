require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const weatherRouter = require("./routes/weather");

const app = express();
const PORT = 5000;
const DB = process.env.MONGODB_CONNECTION_STRING;

app.use(cors());

// middleware
app.use(express.json());
app.use(weatherRouter);

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
