var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

var players = {};
var Msgs = require('../Msgs');
var HeroDB = require('./HeroDB');

var nextPlayerID = (function() {
	var n = 0;
	return function() {
		return n++;
	};
})();


function PlayerState(id, playerName, pos) {
	this.id = id;
	this.playerName = playerName;
	this.pos = pos;
	this.canMove = true;
}

var msgRouter = {};
msgRouter['SpawnMessage'] = function(ws, message) {
	var id = nextPlayerID();
	var ps = new PlayerState(id, message.playerName, [Math.random() * 550, Math.random()* 400]);
	players[id] = {ws: ws, ps: ps};
	ws.send(Msgs.SpawnGrantedMsg(ps));
}


wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(message) {
  	message = JSON.parse(message);


    msgRouter[message.type](ws, message);

  	
  });

});