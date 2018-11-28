module.exports = function (io) {

    io.on('connection', function(socket) {
        socket.on('new-todo', function (data) {
            io.emit('new-todo', data);
        })
        socket.on('check-todo', function () {
            io.emit('update-todo');
        })
        socket.on('delete-todo', function (data) {
            io.emit('delete-todo', data);
        })
    })

}
