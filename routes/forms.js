var express = require("express");
var router = express.Router();
const { asyncCon } = require("../db");
var querystring = require("querystring");

router.get("/place", checkAuthenticated, async function (req, res) {
  const user = await req.user;
  res.render("forms/place", { name: user.username });
});

router.post("/place", checkAuthenticated, async function (req, res) {
  let error = "no error";
  const user = await req.user;
  const foodItems = [];
  const re = new RegExp("^item[0-9]*");
  for (const property in req.body) {
    if (re.test(property) && req.body[property]) {
      foodItems.push(req.body[property]);
    }
  }
  const sql = `insert into place(placeName,${req.body["road"] ? "road," : ""} ${
    req.body["city"] ? "city," : ""
  } ${req.body["state"] ? "state," : ""} ${
    req.body["photo"] ? "photos," : ""
  }pincode,username,rating) values("${req.body["placeName"]}",${
    req.body["road"] ? `"${req.body["road"]}",` : ""
  } ${req.body["city"] ? `"${req.body["city"]}",` : ""} ${
    req.body["state"] ? `"${req.body["state"]}",` : ""
  } ${req.body["photo"] ? `"${req.body["photo"]}",` : ""} ${
    req.body["pincode"]
  },"${user.username}",${req.body["rating"]})`;
  try {
    const addPlacesResult = await asyncCon.query(sql);
  } catch (err) {
    const query = querystring.stringify({
      error: "Failed To add place.The place might already be added.",
    });
    res.redirect("/users/?" + query);
  }
  console.log(foodItems);
  foodItems.forEach(async (element) => {
    placeFoodSql = `insert into place_food(food_name,placeName) values("${element}","${req.body["placeName"]}")`;
    try {
      const placeFoodResult = await asyncCon.query(placeFoodSql);
    } catch (error) {
      error = "Failed to add a food item please check place description";
      console.log(error);
    }
  });
  if (error === "no error") {
    const query = querystring.stringify({
      success: "Place added successfully!!",
    });
    res.redirect("/users/?" + query);
  } else {
    const query = querystring.stringify({
      error:
        "failed to add some food Items please check the place in your dashboard.",
    });
    res.redirect("/users/?" + query);
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

module.exports = router;
