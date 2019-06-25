const express = require("express");
const router = express.Router();
const contoroller = require("./api.controller");

router
  .route("/")
  .get(contoroller.getTodos)
  .post(contoroller.postTodo);

router
  .route("/:id")
  .put(contoroller.putTodo)
  .delete(contoroller.deleteTodo);

module.exports = router;
