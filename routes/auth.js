const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// IMPORT VALIDATIONS
const { registerSchema, loginSchema } = require("../validation");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    // GET THE DATA AND VALIDATE IT
    const { error } = registerSchema.validate(req.body);

    if (error) res.status(400).send(error.details[0].message);

    // VALIDATE THE PASSWORD IF PRESENT
    // ENCODE THE PASSWORD BY HASHING
    // IF NOT CREATE A RANDOM ONE
    let hashedAutoPass;
    let hashedManualPass;
    const salt = bcrypt.genSaltSync(10);

    if (!req.body.password) {
      const myPass = Math.random().toString(36).slice(-8);

      hashedAutoPass = bcrypt.hashSync(myPass, salt);
    } else {
      hashedManualPass = bcrypt.hashSync(req.body.password, salt);
    }

    // SAVE THE DATA TO THE DB

    const newUser = User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password ? hashedManualPass : hashedAutoPass,
      username: req.body.username,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    // VALIDATE THE DATA
    const { error } = loginSchema.validate(req.body);

    if (error) return res.send({message: error.details[0].message});

    // CHECK IF EMAIL EXISTS
    User.findOne({ email: req.body.email }, (err, docs) => {
      if (err) {
        return res.json(err)
      } else {
        if (docs) {
          // COMPARE THE PASSWORDS
          const validateUser = bcrypt.compareSync(
            req.body.password,
            docs.password
          );

          if (!validateUser) {
            return res.json({ message: "Invalid password or email" });
          } else {
            // GENERATE TOKEN
            const token = jwt.sign(
              { _id: docs._id },
              process.env.TOKEN_SECRET_KEY
            );
            res.status(200).header("auth-token", token).json({
              user: docs,
              token: token,
            });
          }
        } else  {
            return res.status(404).json({message: "User does not exist"})
        }
      }
    });

  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
