const router = require("express").Router();
const { response } = require("express");
const { User } = require("../../models");

router.post("/", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (existingUser) {
      console.log("this username is already taken");
      res.status(500).json({ message: "username already taken" });
      return;
    }

    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      res.json(newUser);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: response.statusMessage });
  }
});

//=============================

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    if (!(await user.validatePassword(req.body.password))) {
      res.status(400).json({ message: "Invalid username or password" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.json({ user, message: "Login successful" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.post("/logout", (req, res) => {
  if (req.session.loggedIn = true) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
