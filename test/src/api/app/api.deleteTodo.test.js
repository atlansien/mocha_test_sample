/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const assert = require("power-assert");

const index = require("../../../../db/models/index");

const DummyTodo = require("../../../../helper/createHelper");
const requestHelper = require("../../../.././helper/requestHelper").request;

const getTodos = async () => {
  const response = await requestHelper({
    method: "get",
    endPoint: "/api/todos",
    statusCode: 200,
  });
  return response.body;
};

const deleteTodo = async (code, id) => {
  const response = await requestHelper({
    method: "delete",
    endPoint: `/api/todos/${id}`,
    statusCode: code,
  });
  return response;
};

describe("TEST 「DELETE /api/todos/:id」", () => {
  before(async () => {
    const promises = [];
    for (let i = 0; i < 5; i++) {
      const promise = await index.Todo.create(
        new DummyTodo({
          title: `title${i}`,
          body: `body${i}`,
        })
      );
      promises.push(promise);
    }
    await Promise.all(promises);
  });
  after(async () => {
    await index.Todo.truncate();
  });

  it("idの引数に不正な値が入っていた場合、エラーが返る", async () => {
    const invalidIdList = [0, -1, "0", undefined, null, {}, []];

    invalidIdList.forEach(async id => {
      const response = await deleteTodo(400, id);

      assert.strictEqual(
        response.body.message,
        "idに適切でない値が入っています、1以上の数字を入れてください"
      );
    });
  });

  it("idの引数と合致するTodoがない場合、エラーが返る", async () => {
    const invalidId = 99999999999;
    const response = await deleteTodo(400, invalidId);

    assert.strictEqual(
      response.body.message,
      `検索結果: ID:${invalidId}に該当するTodoは見つかりませんでした`
    );
  });
  it("適切なidを渡した場合、idと合致したTodo一件が返ってくる。またそのTodoはDBから削除される", async () => {
    const oldTodos = await getTodos();

    const validId = 3;

    const response = await deleteTodo(200, validId);
    const todo = response.body;

    //idと合致したTodo一件が返ってくる
    assert.deepStrictEqual(todo, {
      id: validId,
      title: todo.title,
      body: todo.body,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });

    const cuccentTodos = await getTodos();

    // idと合致したTodo一件はDBから削除される。
    assert.strictEqual(oldTodos.length - 1, cuccentTodos.length);
  });
});
