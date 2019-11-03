// loading env variables
require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tagsRouter = require("./routes/tags");
var scribblesRouter = require("./routes/scribbles");

var app = express();

// Loading database
require("./database");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tags", tagsRouter);
app.use("/scribbles", scribblesRouter);

module.exports = app;
