/* eslint-disable no-undef */
const assert = require("power-assert");

const index = require("../../../../db/models/index");

const DummyTodo = require("../../../../helper/createHelper");
const requestHelper = require("../../../../helper/requestHelper").request;

describe("test 「GET /api/todos」", () => {
  before(async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      const promise = index.Todo.create(
        new DummyTodo({
          title: `title ${i}`,
          body: `body ${i}`,
        })
      );
      promises.push(promise);
    }
    await Promise.all(promises);
  });
  after(async () => {
    await index.Todo.truncate();
  });
  it("getリクエストで返されたデータは適切である", async () => {
    const response = await requestHelper({
      method: "get",
      endPoint: "/api/todos",
      statusCode: 200,
    });
    // responseはjsonなので分解する
    const todos = response.body;

    // todosは配列である
    assert.strictEqual(Array.isArray(todos), true);

    todos.forEach(todo => {
      assert.strictEqual(typeof todo.id, "number");
      assert.strictEqual(typeof todo.title, "string");
      assert.strictEqual(typeof todo.body, "string");
      assert.strictEqual(typeof todo.completed, "boolean");
      assert.strictEqual(typeof todo.createdAt, "string");
      assert.strictEqual(typeof todo.updatedAt, "string");
    });
  });
});
