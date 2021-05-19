var express = require("express");
var router = express.Router();
const { asyncCon } = require("../db");

//get request for searching

router.get("/search", async (req, res) => {
  let user = { name: null };
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    let reqUser = await req.user;
    user = { name: reqUser.username };
  }

  if (Object.keys(req.query).length == 0) {
    res.render("search/place", { queryResult: null, ...user });
  } else {
    const items = req.query;
    let sqlQuery = "";
    if (req.query.item === "") {
      sqlQuery = `select * from place where(${
        items.placeName !== "" ? `placeName="${items.placeName}" and` : ""
      } ${items.road !== "" ? `road="${items.road}" and` : ""} ${
        items.city !== "" ? `city="${items.city}" and` : ""
      } ${items.state !== "" ? `state="${items.state}" and` : ""} ${
        items.pincode !== "" ? `pincode="${items.pincode}" and` : ""
      } 0=0)`;
    } else {
      sqlQuery = `select * from place inner join place_food on place_food.placeName = place.placeName where(${
        items.placeName !== "" ? `placeName="${items.placeName}" and` : ""
      } ${items.road !== "" ? `road="${items.road}" and` : ""} ${
        items.city !== "" ? `city="${items.city}" and` : ""
      } ${items.state !== "" ? `state="${items.state}" and` : ""} ${
        items.pincode !== "" ? `pincode="${items.pincode}" and` : ""
      } ${items.item !== "" ? `food_name="${items.item}" and` : ""} 0=0)`;
    }
    const queryResult = await asyncCon.query(sqlQuery);
    res.render("search/place", { queryResult: queryResult, ...user });
  }
});

router.get("/:placeName", async (req, res) => {
  let user = { username: null };
  let didUserComment = false;
  let userObj = {};
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    user = await req.user;
    const dbUserCommentSql = `select * from comment_place where(username="${user.username}" and placeName="${req.params.placeName}")`;
    try {
      const dbUserCommentResponse = await asyncCon.query(dbUserCommentSql);
      if (dbUserCommentResponse.length > 0) {
        didUserComment = true;
        userObj = {
          dbUserCommentResponse: dbUserCommentResponse[0],
          didUserComment: didUserComment,
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
  const placeName = req.params.placeName;
  const dbPlaceSql = `select * from place where(placeName="${placeName}")`;
  const dbFoodItemsSql = `select * from place_food where(placeName="${placeName}")`;
  const dbCommentSql = `select * from comment_place where(placeName="${placeName}")`;

  const dbPlaceResponse = await asyncCon.query(dbPlaceSql);
  const dbFoodResponse = asyncCon.query(dbFoodItemsSql);
  const dbCommentResponse = asyncCon.query(dbCommentSql);
  console.log(didUserComment);
  res.render("place", {
    dbPlaceResponse: dbPlaceResponse[0],
    dbFoodResponse: await dbFoodResponse,
    dbCommentResponse: await dbCommentResponse,
    name: user.username,
    isAuth: isAuth,
    ...userObj,
  });
});

router.post("/:placeName/comment", checkAuthenticated, async (req, res) => {
  const user = await req.user;
  const addCommentSql = `insert into comment_place(username,placeName,commentPlace,rating) values("${user.username}","${req.params.placeName}","${req.body.comment}","${req.body.rating}")`;
  const dbPlaceSql = `select * from place where(placeName="${req.params.placeName}")`;
  const dbPlaceResponse = await asyncCon.query(dbPlaceSql);
  let commentNum = parseInt(dbPlaceResponse[0].commentNum) + 1;
  let rating =
    (parseFloat(dbPlaceResponse[0].rating) * (commentNum - 1) +
      parseFloat(req.body.rating)) /
    commentNum;
  console.log(rating);
  console.log(commentNum);
  await asyncCon.query(
    `update place set rating=${
      Math.round(rating) == 0 ? 1 : Math.round(rating)
    }, commentNum=${Math.round(commentNum)} where(placeName="${
      req.params.placeName
    }")`
  );
  const dbResponse = await asyncCon.query(addCommentSql);
  res.redirect("/place/" + req.params.placeName);
});

router.put("/:placeName/comment", checkAuthenticated, async (req, res) => {
  const user = await req.user;
  const dbPlaceSql = `select * from place where(placeName="${req.params.placeName}")`;
  const dbPlaceResponse = await asyncCon.query(dbPlaceSql);
  const oldComment = await asyncCon.query(
    `select * from comment_place where(placeName="${req.params.placeName}" and username="${user.username}")`
  );
  let rating =
    (parseFloat(dbPlaceResponse[0].rating) *
      (dbPlaceResponse[0].commentNum - 1) +
      parseFloat(req.body.rating) -
      parseFloat(oldComment[0].rating)) /
    dbPlaceResponse[0].commentNum;
  console.log(rating);
  await asyncCon.query(
    `update place set rating=${
      Math.round(rating) == 0 ? 1 : Math.round(rating)
    } where(placeName="${req.params.placeName}")`
  );
  const commentUpdateSql = `update comment_place set commentPlace="${req.body.comment}",rating=${req.body.rating} where(username="${user.username}" and placeName="${req.params.placeName}")`;
  try {
    await asyncCon.query(commentUpdateSql);
  } catch (err) {
    console.log(err);
    res.redirect(`/place/${req.params.placeName}`);
  }
  console.log(commentUpdateSql);
  res.redirect(`/place/${req.params.placeName}`);
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

module.exports = router;
