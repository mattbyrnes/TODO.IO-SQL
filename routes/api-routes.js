var db = require("../models");

module.exports = function (app) {

	//Get ToDos
	app.get("/api/todos", function (req, res) {
		db.Todo.findAll({})
			.then(function (dbTodo) {
				res.json(dbTodo);
			})
			.catch(function (err) {
				res.json(err)
			});
	});

	//Create ToDo
	app.post("/api/todos", function (req, res) {
		db.Todo.create({
			text: req.body.text,
			complete: req.body.complete
		})
			.then(function (dbTodo) {
				res.json(dbTodo);
			});
	});

	//Delete ToDo
	app.delete("/api/todos/:id", function (req, res) {
		db.Todo.destroy({
			where: { id: req.params.id }
		})
			.then(function (dbTodo) {
				res.json(dbTodo);
			});
	});

	//Update ToDo
	app.put("/api/todos", function (req, res) {
		db.Todo.update({
			text: req.body.text,
			complete: req.body.complete
		}, {
				where: {
					id: req.body.id
				}
			})
			.then(function (dbTodo) {
				res.json(dbTodo);
			});
	});

};
