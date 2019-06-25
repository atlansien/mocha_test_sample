const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const router = require("./resources/api.router");

const app = express();

app.use(logger("short"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/todos", router);

module.exports = app;
