
var express=require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');


/*app.use('/assets', express.static(__dirname + '/js'));*/

app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(__dirname + '/images'));


var port = Number(process.env.PORT || 5000);

http.listen(port, function(){
	console.log('listening on *:3000')
});

app.get('/', function(req, res){
	res.sendfile('index.html');
});



io.on('connection', function(socket){
	console.log("a user connected");

	socket.on('chat message', function(msg){
		//console.log('message: ' +msg);
		io.emit('chat message', msg);
	});

	socket.on('turn', function(dir){
		//console.log(dir);
		io.emit('turn', dir);
	});

	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});
});

