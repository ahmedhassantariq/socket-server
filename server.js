const httpServer = require('http').createServer()
const io = require('socket.io')(httpServer,{
  maxHttpBufferSize: 1e15 //Determines buffer size per message.
})

// console.log(socketIO.engine.clientCount());

var users = {}; //Maintains a list of usersers connected. Finds, adds, removes users to manage messaging.



io.on('connection', socket => {

  const connectID = socket['handshake']['auth']['userID'];
  if(connectID==null||connectID==""){
    console.log("Disconnecting", socket.id);
    socket.disconnect();
    console.log(io.of("/").sockets.size);

  }else{
    console.log("UserID: ", socket['handshake']['auth']['userID']);
    console.log('Connected...', socket.id);
    console.log(io.of("/").sockets.size);
    users[connectID] = socket.id;
    console.log(users);

  }

  socket.on("message", (msg) => {
    const receiverID = msg['receiverID'];
    const receiverSocketID = users[receiverID];
    console.log(msg);
    if(receiverSocketID!=null&&receiverSocketID!=''){
      io.to(receiverSocketID).emit("message", msg);
      console.log("Sending to:", receiverSocketID);
    }
  
  });

  socket.on("data", (msg) => {
    const receiverID = msg['receiverID'];
    const receiverSocketID = users[receiverID];
    console.log(msg);
    if(receiverSocketID!=null&&receiverSocketID!=''){
      io.to(receiverSocketID).emit("data", msg);
      console.log("Sending to:", receiverSocketID);
    }
  
  });

socket.on('disconnect', function () {
    console.log(io.of("/").sockets.size);
    console.log('Disconnected...', socket.id);

    for(const [userID, id] of Object.entries(users)){
      if(id==socket.id){
        delete users[userID];
        console.log("User Removed", userID);
        console.log(users);
        break;
      }
    }


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