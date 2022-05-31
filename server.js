var express = require("express");
var app = express();
const PORT = 3000;
var path = require("path");

app.use(express.json());
app.use(express.static("static")); // serwuje stronę index.html

app.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT);
});
