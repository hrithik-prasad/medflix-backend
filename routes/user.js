const router = require("express").Router();

router.post("/create", (req, res) => {
  if (req.body.name) {
    const name = req.body.name;
    res.status(200).send({ user: name });
  } else {
    res.status(400).send({ message: "Bad Request" });
  }
});

module.exports = router;
