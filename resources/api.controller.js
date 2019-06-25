const index = require("../db/models/index");

module.exports = {
  getTodos: async (req, res) => {
    try {
      const todos = await index.Todo.findAll({});

      res.status(200).json(todos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  postTodo: async (req, res) => {
    const t = await index.sequelize.transaction();
    try {
      if (!req.body.title) {
        throw new Error("titleを送信してください");
      }
      if (!req.body.body) {
        throw new Error("bodyを送信してください");
      }
      if (
        typeof req.body.completed !== "boolean" &&
        req.body.completed !== undefined
      ) {
        throw new Error("completedにはboolean型のみを入力してください");
      }

      const todo = await index.Todo.create(
        {
          title: req.body.title,
          body: req.body.body,
          completed: req.body.completed,
        },
        { t }
      );

      await t.commit();
      res.status(200).json(todo);
    } catch (err) {
      await t.rollback();
      res.status(400).json({ message: err.message });
    }
  },
  putTodo: async (req, res) => {
    const t = await index.sequelize.transaction();
    try {
      const parseId = parseInt(req.params.id, 10);
      if (Number.isNaN(parseId) || parseId < 1) {
        throw new Error(
          "idに適切でない値が入っています、1以上の数字を入れてください"
        );
      }
      if (
        typeof req.body.completed !== "boolean" &&
        req.body.completed !== undefined
      ) {
        throw new Error("completedにはboolean型のみを入力してください");
      }
      const todo = await index.Todo.findOne({
        where: { id: parseId },
      });
      if (!todo) {
        throw new Error(
          `検索結果: ID:${parseId}に該当するTodoは見つかりませんでした`
        );
      }

      for (let prop in req.body) {
        if (prop) {
          todo[prop] = req.body[prop];
        }
      }

      await todo.save({ t });
      await t.commit();
      res.status(200).json(todo);
    } catch (err) {
      await t.rollback();
      res.status(400).json({ message: err.message });
    }
  },
  deleteTodo: async (req, res) => {
    const t = await index.sequelize.transaction();
    try {
      const parseId = parseInt(req.params.id, 10);
      if (Number.isNaN(parseId) || parseId < 1) {
        throw new Error(
          "idに適切でない値が入っています、1以上の数字を入れてください"
        );
      }
      const todo = await index.Todo.findOne({
        where: { id: parseId },
      });
      if (!todo) {
        throw new Error(
          `検索結果: ID:${parseId}に該当するTodoは見つかりませんでした`
        );
      }

      await todo.destroy({ t });
      await t.commit();
      res.status(200).json(todo);
    } catch (err) {
      await t.rollback();
      res.status(400).json({ message: err.message });
    }
  },
};
