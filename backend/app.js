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

var numUsers = 0; // 전체 사람 수

io.on('connection', (socket) => {

  // on (method): ('event_name', event handler)

  // client login query
  socket.on('login', (data) => { // data={name, }
    console.log(`logged in client:${data.name}`);
    //socket 객체에 client의 정보 저장
    socket.name = data.name;
    // 자신을 제외한 모든 client에게 login했다고 알림
    socket.broadcast.emit('login', { name: socket.name });
  });

  // client로부터 메시지를 송신받음
  socket.on('chat', (data) => {
    console.log(`From ${socket.name}: ${data.msg}`);
    // 자신을 포함한 모든 client에게 메시지 전송
    io.emit('chat', { name: socket.name, msg: data.msg });
  });
});

server.listen(backPort, () => {
  console.log(`socket.io server listening on port ${backPort}`);
});
