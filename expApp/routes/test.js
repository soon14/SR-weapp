const express = require("express");
let router = express.Router();

// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  res.send("Time: ", Date.now());
  next();
});

// 定义网站主页的路由
router.all("/c", (req, res) => {
  // res.send('hello world');
  res.json("hello world");
  // res.jsonp('hello world');
});

router.get("/", function(req, res) {
  res.send("Birds home page");
});

// 定义 about 页面的路由
router.get("/about", function(req, res) {
  res.send("About birds");
});

module.exports = router;
