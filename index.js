const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { PORT, MONGO_URI, FRONTEND_URL } = require("./config");
const User = require("./routes/user");

const app = express();

const port = PORT || 5000;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("unable to connect to DB");
    console.log(error);
  });

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));

app.use("/user", User);

app.get("/", (req, res) => {
  res.status(200).send({ message: "Server Up and Running" });
});

app.listen(port, () => {
  console.log(`Server Up & Running on ${port}`);
});
