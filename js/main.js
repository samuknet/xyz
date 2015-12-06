var stage;
var gameObjects = [];

var Msgs = require('./Msgs.js');

var myPlayer;
var otherPlayers = {};

function WS(port, onOpen) {
	var ws = new WebSocket('ws://192.168.1.6:' + port);
	ws.addEventListener('open', function() {
		onOpen();

	});

	ws.addEventListener('message', function(message) {
		message = JSON.parse(message.data);
		if (message.type === 'SpawnGrantedMsg') {
			if (!myPlayer) {
				myPlayer = new Player(JSON.parse(message.playerState));
				addChild(myPlayer);

				_.forEach(JSON.parse(message.otherPlayerStates), function(otherPlayerState) {
					var otherPlayer = new Player(otherPlayerState);
					otherPlayers[otherPlayer.id] = otherPlayer;
					addChild(otherPlayer);
				})

			}
		} else if (message.type === 'PlayerJoinedMsg') {
			var otherPlayer = new Player(JSON.parse(message.playerState));
			otherPlayers[otherPlayer.id] = otherPlayer;
			addChild(otherPlayer);
		} else if (message.type === 'PlayerMoveCommandMsg') {
			console.log(otherPlayers);
			otherPlayers[message.id].moveTo(message.moveX, message.moveY);
		}
	})

	this.spawnRequest = function (heroName, playerName) {
		ws.send(Msgs.SpawnRequestMsg(heroName, playerName));
	};

	this.PlayerMoveReq = function (moveX, moveY) {
		ws.send(Msgs.PlayerMoveReqMsg(myPlayer.id, moveX, moveY));
	}
}
var net;

window.addEventListener('load', function() {
	net = new WS(8080, onLoad);
});


function addChild(gameObject) {
	stage.addChild(gameObject.display);
	gameObjects.push(gameObject);
} 

function onLoad() {
	net.spawnRequest('Ez', 'Rowan');
	stage = new createjs.Stage('cv');
	

	// var rowan = new Player(Ez, [200, 200]);
	// addChild(rowan);

	stage.update();
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick', update);

	var mouseX, mouseY; 
	stage.on('stagemousedown', function(evt) {
		myPlayer.moveTo(evt.stageX, evt.stageY);
		net.PlayerMoveReq(evt.stageX, evt.stageY)
	});
	stage.on('stagemousemove', function(evt) {
		mouseX = evt.stageX;
		mouseY = evt.stageY;
	});

	window.addEventListener('keydown', function(evt) {
		var ch = String.fromCharCode(evt.keyCode).toUpperCase();

		if (ch === 'Q' || ch === 'W' || ch === 'E' || ch === 'R') {
			myPlayer.skill(ch, mouseX, mouseY);
		}

		switch (ch) {
			case 'S':
			myPlayer.stopMoving();
			break;
		}
	});

	function update() {

		gameObjects.forEach(function (gameObject) { gameObject.update(); });
		stage.update();
	}
	
	
}