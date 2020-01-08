const backPort = 4000;

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// client가 socket.io server(현 서버의 'io')에 접속하면 connection event 발생
// connection event가 발생했을 때의 event handler - callback의 인자의 sockket이 들어온다.
// *socket (object): 각 clinet와의 interacting을 위한 객체
// *io (object) : 연결된 모든 client와의 interacting을 위한 객체

var db = [];
io.on('connection', (socket) => {

  // on (method): ('event_name', event handler)

  // client login query
  socket.on('login', (clientNick) => { // data={name, }
    console.log(`logged in client: ${clientNick}, ${socket.id}`);
    if (db.find(client => client.nick === clientNick)) {
      db[db.findIndex(client => client.nick === clientNick)] = { nick: clientNick, socketId: socket.id };
    }
    else {
      db.push({ nick: clientNick, socketId: socket.id });
    }
  });

  // client로부터 메시지를 송신받음
  socket.on('chat', (msg) => {
    console.log(`From ${msg.sender} to ${msg.receiver}: ${msg.data}`);
    console.log("db: ", db);
    // 받는 사람의 소켓 정보가 없으면 본인에게만 전송
    socket.emit('chat', msg);
    // msg의 receiver에게 다시 전송
    if (db.find(client => client.nick === msg.receiver) === undefined) {
      console.log('수신자 정보를 찾을 수 없습니다!');
      return;
    }
    console.log('db find', db.find(client => client.nick === msg.receiver))
    io.to(db.find(client => client.nick === msg.receiver).socketId).emit('chat', msg);
  });
});

server.listen(backPort, () => {
  console.log(`socket.io server listening on port ${backPort}`);
});
