/* eslint-disable no-undef */
const assert = require("power-assert");
const controller = require("../../../../resources/api.controller");

describe("api.controllerのテスト", () => {
  it("controller.getTodosはメソッドである", () => {
    assert.strictEqual(typeof controller.getTodos, "function");
  });
  it("controller.postTodoはメソッドである", () => {
    assert.strictEqual(typeof controller.postTodo, "function");
  });
  it("controller.putCommentはメソッドである", () => {
    assert.strictEqual(typeof controller.putTodo, "function");
  });
  it("controller.deleteTodoはメソッドである", () => {
    assert.strictEqual(typeof controller.deleteTodo, "function");
  });
});
