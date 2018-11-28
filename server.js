const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

const PORT = process.env.PORT || 3000;

users = [];
connections = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

require("./routes/api-routes")(app);
require("./sockets/todo-sockets")(io);

app.get("/assets", function (req, res) {
	res.sendFile(path.join(__dirname, "assets"))
});

let db = require("./models");

db.sequelize.sync().then(function () {
	server.listen(PORT, function () {
		console.log("Listening on PORT " + PORT);
	});
});