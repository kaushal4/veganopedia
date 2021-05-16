var express = require("express");
var router = express.Router();
const { asyncCon } = require("../db");

/* GET users listing. */
router.get("/", async (req, res) => {
  const placeName = req.query.placeName;
  const dbPlaceSql = `select * from place where(placeName="${placeName}")`;
  const dbFoodItemsSql = `select * from place_food where(placeName="${placeName}")`;
  const dbPlaceResponse = await asyncCon.query(dbPlaceSql);
  const dbFoodResponse = await asyncCon.query(dbFoodItemsSql);
  console.log(dbPlaceResponse);
  console.log(dbFoodResponse);

  res.render("place", {
    dbPlaceResponse: dbPlaceResponse[0],
    dbFoodResponse: dbFoodResponse,
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("here");
    return next();
  }
  return res.redirect("/");
}

module.exports = router;
