/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const assert = require("power-assert");
const chalk = require("chalk");

const index = require("../../../../db/models/index");

const DummyTodo = require("../../../../helper/createHelper");
const requestHelper = require("../../../../helper/requestHelper").request;

const updateTodo = async (code, id, data) => {
  const response = await requestHelper({
    method: "put",
    endPoint: `/api/todos/${id}`,
    statusCode: code,
  }).send(data);
  return response;
};

describe("TEST 「PUT /api/todos/:id」", () => {
  before(async () => {
    const promises = [];
    for (let i = 0; i < 10; i++) {
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

  // テストが例外処理で通る
  it("idの引数に不正な値が入っていた場合、エラーが返る(ver.forEach) ", async () => {
    const invalidIdList = [0, -1, "3", undefined, null, {}, []];
    const data = {
      title: "title",
      body: "body",
    };

    invalidIdList.forEach(async id => {
      const response = await updateTodo(400, id, data);

      assert.strictEqual(
        response.body.message,
        "idに適切でない値が入っています、1以上の数字を入れてください"
      );
    });
  });

  // テストが通らない
  it("idの引数と合致するTodoがない場合、エラーが返る(ver.for([]あり))", async () => {
    const invalidIdList = [0, -1, "0", undefined, null, {}, []];
    const data = {
      title: "title",
      body: "body",
    };

    for (let i = 0; i < invalidIdList.length; i++) {
      const response = await updateTodo(400, invalidIdList[i], data);
      assert.strictEqual(
        response.body.message,
        "idに適切でない値が入っています、1以上の数字を入れてください"
      );
    }
  });
  
  // テストが通る
  it("idの引数と合致するTodoがない場合、エラーが返る(ver.for([]なし))", async () => {
    const invalidIdList = [0, -1, "0", undefined, null, {}];
    const data = {
      title: "title",
      body: "body",
    };

    for (let i = 0; i < invalidIdList.length; i++) {
      const response = await updateTodo(400, invalidIdList[i], data);
      assert.strictEqual(
        response.body.message,
        "idに適切でない値が入っています、1以上の数字を入れてください"
      );
    }
  });

  it("completedにboolean型以外を送った場合、エラーが返る", async () => {
    const invalidCompletedList = [-1, 2, "0", null, [], {}];
    const id = 3;

    invalidCompletedList.forEach(async completed => {
      const data = {
        title: "title",
        body: "body",
        completed: completed,
      };
      const response = await updateTodo(400, id, data);

      assert.strictEqual(
        response.body.message,
        "completedにはboolean型のみを入力してください"
      );
    });
  });
});
