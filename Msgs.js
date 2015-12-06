exports.SpawnRequestMsg = function(heroName, playerName) {
	return JSON.stringify({
		type: 'SpawnMsg',
		heroName: heroName,
		playerName: playerName
	});
}
exports.SpawnGrantedMsg = function(playerState, otherPlayerStates) {
	return JSON.stringify({
		type: 'SpawnGrantedMsg',
		playerState: JSON.stringify(playerState),
		otherPlayerStates: JSON.stringify(otherPlayerStates)
	});
}

exports.PlayerJoinedMsg = function(playerState) {
	return JSON.stringify({
		type: 'PlayerJoinedMsg',
		playerState: JSON.stringify(playerState)
	});
}

exports.PlayerMoveReqMsg = function(id, moveX, moveY) {
	return JSON.stringify({
		type: 'PlayerMoveReqMsg',
		id: id,
		moveX: moveX,
		moveY: moveY
	});
}

exports.PlayerMoveCommandMsg = function (id, moveX, moveY) {
	return JSON.stringify({
		type: 'PlayerMoveCommandMsg',
		id: id,
		moveX: moveX,
		moveY: moveY
	});
}