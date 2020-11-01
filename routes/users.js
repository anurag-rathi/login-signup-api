var express = require("express");
var router = express.Router();

const bodyParser = require("body-parser");
var User = require("../models/user");

router.use(bodyParser.json());
var passport = require("passport");
var authenticate = require("../authenticate");

//api to find the authenticated user information 
router.get(
    "/me",
    authenticate.verifyUser,
    function (req, res, next) {
      User.findById(req.user.id)
        .then(
          (user) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

//sign up api

router.post("/signup", (req, res, next) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        } else {
          if (req.body.firstname) user.firstname = req.body.firstname;
          if (req.body.lastname) user.lastname = req.body.lastname;
          user.save((err, user) => {
            passport.authenticate("local")(req, res, () => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ success: true, status: "Registration Successful!" });
            });
          });
        }
      }
    );
  });

  //login api 
  router.post('/login', passport.authenticate('local'), (req, res) => {

    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  });

module.exports = router;