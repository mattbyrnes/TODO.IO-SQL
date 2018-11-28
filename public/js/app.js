const socket = io.connect();

const appFunctions = {

	// Get ToDos 
	getTodos: function () {
		$('.todos').empty();
		$.get('/api/todos').then(function (data) {
			data.forEach(e => {
				if (e.complete === false) {
					$('.todos').append(
						$('<div>').addClass('todo').attr('id', `${e.id}`).data(e).append(
							$('<i>').addClass('far fa-circle'),
							$('<p>').addClass('todoText').text(e.text)
						)
					)
				} else {
					$('.todos').append(
						$('<div>').addClass('todo').data(e).append(
							$('<i>').addClass('far fa-dot-circle'),
							$('<p>').addClass('todoText').text(e.text)
						)
					)
				}
			})
		})
	},

	// New ToDo 
	newToDo: function () {
		var todo = {
			text: $('#todoInput').val().trim(),
			complete: false
		};
		$.post("/api/todos", todo)
			.then(function (data) {
				socket.emit('new-todo', data);
			})
	},

	// Check ToDo
	checkTodo: function (todo) {
		todo.complete = !todo.complete;
		$.ajax({ method: "PUT", url: "/api/todos", data: todo })
			.then(
				// ? 
				socket.emit('check-todo')
			);
	},

	// Update ToDo
	updateTodo: function (todo) {
		todo.text = $('#updatetodoInput').val();
		$.ajax({ method: 'PUT', url: '/api/todos', data: todo })
			.then(
				socket.emit('update-todo')
			);
	},

	// Delete To Do
	deleteTodo: function (id) {
		$.ajax({ method: 'DELETE', url: `/api/todos/${id}` })
		socket.emit('delete-todo', id)
	}

}


// Initial Functions
$(document).ready(function () {
	appFunctions.getTodos();
	$('.todoList').append(
		$('<input>').attr('id', 'todoInput').attr('placeholder', 'Type a ToDo!')
	)
	socket.on('check-todo', function () {
		appFunctions.getTodos();
	});
	socket.on('delete-todo', function (id) {
		appFunctions.getTodos();
	});
	socket.on('new-todo', function (data) {
		$('.todos').append(
			$('<div>').addClass('todo').attr('id', `${data.id}`).data(data).append(
				$('<i>').addClass('far fa-circle'),
				$('<p>').addClass('todoText').text(data.text)
			)
		);
		$('#todoInput').val('');
	});
});

// Interaction Functions
$(document).on('click', '.todoText', function () {
	let ifText = $(this).text();
	if (ifText != '') {
		$(this).text('').append(
			$('<input>').attr('id', 'updatetodoInput')
		)
		$('#updatetodoInput').focus();
		$('#updatetodoInput').on('focusout', function () {
			let data = $(this).parent().parent().data();
			let container = $(this).parent();
			container.text(data.text);
		})
	}
});

$(document).on('click', '.fa-circle', function () {
	let todo = $(this).parent().data();
	appFunctions.checkTodo(todo);
	$(this).removeClass('fa-circle').addClass('fa-dot-circle')
});

$(document).on('click', '.fa-dot-circle', function () {
	let id = $(this).parent().data("id");
	appFunctions.deleteTodo(id);
});

$(document).keypress(function (e) {
	if (e.which == 13) {
		if ($('#todoInput').is(':focus')) {
			appFunctions.newToDo();
		}
		if ($('#updatetodoInput').is(':focus')) {
			let todo = $('#updatetodoInput').parent().parent().data();
			appFunctions.updateTodo(todo);
		}
	}
});

