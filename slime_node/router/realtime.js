module.exports = (httpServer) => {
  const io = require('socket.io')(httpServer);
  
  io.on('connection', (socket)=>{
    console.log(' connected ! ');
    
    socket.emit('request', { hello: 'workd' });
    socket.on('diagram_process', function (data) {
      console.log(data);
    });
  });
};

/*

const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
  httpSErver: server
});

wsServer.on('request', function(request){
  const connection = request.accept(null, request.origin);
  connection.on('message', function(message){
    console.log('Received message: ', message.utf8Data);
    connection.sendUTF('hi this is websocket server!');
  });
  connection.on('close', function(reasonCode, description){
    console.log('client has disconnected');
  });
});

*/