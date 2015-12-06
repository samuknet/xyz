var stage;
var gameObjects = [];

var Msgs = require('./Msgs.js');

var myPlayer;


function WS(port, onOpen) {
	var ws = new WebSocket('ws://localhost:' + port);
	ws.addEventListener('open', function() {
		onOpen();

	});

	ws.addEventListener('message', function(message) {
		message = JSON.parse(message.data);
		if (message.type === 'SpawnGrantedMsg') {
			if (!myPlayer) {
				myPlayer = new Player(JSON.parse(message.playerState));
				addChild(myPlayer);
			}
		}
	})

	this.spawnRequest = function (heroName, playerName) {
		ws.send(Msgs.SpawnRequestMsg(heroName, playerName));
	};
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