function Hero(maxHealth, skills, draw, speed) {
	this.maxHealth  = maxHealth;
	this.skills  = skills;
	this.draw = draw;
	this.speed   = speed;
}

function ProjectileInfo(speed, onHit, draw) {
	this.speed = speed;
	this.onHit = onHit;
	this.draw = draw;
}

function Skills(Q, W, E, R) {
	this.Q = Q;
	this.W = W;
	this.E = E;
	this.R = R;
}

function Skill(name, cooldown, activate) {
	this.name     = name;
	this.cooldown = cooldown;
	this.activate = activate;
}

exports.Ez = (function () {
	var ezSkills  = new Skills();

	ezSkills.Q = new Skill('Mystic Shot', 0, function (player, mouseX, mouseY) {
		var proj = new Projectile(MysticShot, player, mouseX, mouseY);
		addChild(proj);
	});

	ezSkills.E = new Skill('Jump', 2000, function (player, mouseX, mouseY) {

		var range = 50,
			dist = distance(mouseX, mouseY,	player.display.x, player.display.y),
			animationSpeed = 100;

		player.setCanMove(false);
		createjs.Tween.get(player.display).to({scaleX: 0, scaleY: 0}, animationSpeed, createjs.Tween.elasticIn).call(onComplete);
		function onComplete() {
			player.setCanMove(true);
			if (range < dist) {
				player.move((mouseX - player.display.x) * (range / dist), (mouseY - player.display.y) * (range / dist));
			} else {
				player.move(mouseX - player.display.x, mouseY - player.display.y)
			}
			player.setCanMove(false);
			createjs.Tween.get(player.display).to({scaleX: 1, scaleY: 1}, animationSpeed, createjs.Tween.elasticOut).call(function () {
				player.setCanMove(true);
			});

		}
		
	});

	var ezMaxHealth = 100;
	var ezDisplay   = function (graphics) { graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 10); }
	var ezSpeed     = 0.1;

	return new Hero(ezMaxHealth, ezSkills, ezDisplay, ezSpeed);
})();