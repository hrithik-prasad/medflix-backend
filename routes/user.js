const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { TOKEN_KEY } = require("../config");
const User = require("../databaseQueries/user");
// const User = require("../models/user");

router.post("/create", (req, res) => {
  if (req.body.name) {
    const name = req.body.name;
    res.status(200).send({ user: name });
  } else {
    res.status(400).send({ message: "Bad Request" });
  }
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const full_name = first_name + " " + last_name;
  if (!(first_name && email && password)) {
    res.status(400).send({ message: "Send All Data" });
  }

  const encryPass = await bcrypt.hash(password, 10);

  const user_id = mongoose.Types.ObjectId();

  try {
    const token = jwt.sign({ user_id, email }, TOKEN_KEY, {
      expiresIn: "5h",
    });
    const user = await User.create_user({
      first_name,
      last_name,
      full_name,
      email: email.toLowerCase(),
      password: encryPass,
      token,
    });
    console.log(user);
    res.send({ message: "Hello", id: user_id, token });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err?.data });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    try {
      const { data: user } = await User.find_users({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
          expiresIn: "5h",
        });
        user.token = token;
        console.log(token);
        res.cookie("token", token, { httpOnly: true });
        return res.send(user);
      }
      res.send({ message: "Password Wrong!" });
    } catch (err) {
      console.log(err);
      return res.send({ err: "Error" });
    }
  } else {
    res.status(400).send({ message: "Provide Credentials" });
  }
});

module.exports = router;
