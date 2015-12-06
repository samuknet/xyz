var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });

var players = {};
var Msgs = require('../Msgs');
var HeroDB = require('./HeroDB');

var _ = require('underscore');

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
msgRouter['SpawnMsg'] = function(ws, message) {
	var id = nextPlayerID();
	var ps = new PlayerState(id, message.playerName, [Math.random() * 550, Math.random()* 400]);
	players[id] = {id: id, ws: ws, ps: ps};
	var others =[];
	for (var i in players) {
		if (players[i].id !== id) {
			others.push(players[i].ps);
		}
	}


	ws.send(Msgs.SpawnGrantedMsg(ps, others));
	_.forEach(players, function(player) {
		if (player.ps.id !== id) {
			player.ws.send(Msgs.PlayerJoinedMsg(ps));
		}
	});
}

msgRouter['PlayerMoveReqMsg'] = function(ws, message) {
	_.forEach(players, function (player) {
		if (player.ps.id !== message.id) {
			player.ws.send(Msgs.PlayerMoveCommandMsg(message.id, message.moveX, message.moveY))
		}
	})
}


wss.on('connection', function connection(ws) {
  
  ws.on('message', function incoming(message) {
  	message = JSON.parse(message);


    msgRouter[message.type](ws, message);

  	
  });

});