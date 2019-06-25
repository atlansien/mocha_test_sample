"use strict";
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define(
    "Todo",
    {
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      completed: DataTypes.BOOLEAN,
    },
    {}
  );
  // eslint-disable-next-line no-unused-vars
  Todo.associate = function(models) {
    // associations can be defined here
  };
  return Todo;
};
