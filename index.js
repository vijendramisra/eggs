var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port_number = server.listen(process.env.PORT || 3000);

app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log("a user connected");

	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
});

http.listen(port_number, function(){
	console.log('listening on *:3000')
});