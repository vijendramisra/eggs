var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
	res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log("a user connected");

	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
});

var port = Number(process.env.PORT || 5000);

http.listen(port_number, function(){
	console.log('listening on *:3000')
});