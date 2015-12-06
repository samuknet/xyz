exports.SpawnRequestMsg = function(heroName, playerName) {
	return JSON.stringify({
		type: 'SpawnMessage',
		heroName: heroName,
		playerName: playerName
	});
}
exports.SpawnGrantedMsg = function(playerState) {
	return JSON.stringify({
		type: 'SpawnGrantedMsg',
		playerState: JSON.stringify(playerState)
	});
}