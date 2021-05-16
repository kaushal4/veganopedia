var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", checkNotAuthenticated, function (req, res, next) {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    console.log("you are not authenticated");
    return next();
  }
  return res.redirect("/users");
}

module.exports = router;
