const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer)

// console.log(socketIO.engine.clientCount());

io.on('connection', socket => {

  console.log('Connected...', socket.id);
  console.log(io.of("/").sockets.size);
  socket.on("message", (msg) => {
    io.to(msg['receiverID']).emit("message", msg);
  });

socket.on('disconnect', function () {
    console.log(io.of("/").sockets.size);
    console.log('Disconnected...', socket.id);
  })

  socket.on('error', function (err) {
    console.log('Error detected', socket.id);
    console.log(err);
  })
})



var port = process.env.PORT || 8080;

httpServer.listen(port, function (err) {

  if (err) console.log(err);
    console.log('Listening on port', port);

  });