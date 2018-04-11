const express = require("express");
let router = express.Router();

//修改router/index.js,第一次请求时我们保存一条用户信息。
router.get("/", function(req, res, next) {
  var user = {
    name: "yangshirui",
    age: "26",
    address: "shenzhen"
  };
  req.session.user = user;
  res.render("index", {
    title: "the test for nodejs session",
    name: "sessiontest"
  });
});

module.exports = router;
