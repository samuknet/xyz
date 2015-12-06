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

/* ProjectileInfo Section */
var MysticShot = (function() {
	var speed = 10;

	var onHit = function(player) {

	};

	var draw = function(graphics) {
		graphics.beginFill('#c10a15').drawCircle(0, 0, 2);
	};

	return new ProjectileInfo(speed, onHit, draw);
})();

var Ez = (function () {
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

function Projectile(projectileInfo, player, targetX, targetY) {
	this.projectileInfo = projectileInfo;
	this.player = player;

	// Draw projectile
	var display = new createjs.Shape();
	this.projectileInfo.draw(display.graphics);
	this.display = display;
	
	// Set initial position
	this.display.x = player.display.x;
	this.display.y = player.display.y;

	var distToTarget = distance(targetX, targetY, this.display.x, this.display.y);
	var dx = ((targetX - this.display.x) * this.projectileInfo.speed) / distToTarget,
		dy = ((targetY - this.display.y) * this.projectileInfo.speed) / distToTarget;

	this.move = function(dx, dy) {
		this.stopMoving();
		this.display.x += dx;
		this.display.y += dy;
	}

	this.moveTo = function(destX, destY) {
		this.stopMoving();
		var dist = distance(x, y, this.display.x, this.display. y);
		createjs.Tween.get(this.display).to({x: destX, y: destY}, (dist / this.projectileInfo.speed), createjs.Ease.none);		
	}

	this.stopMoving = function() {
		createjs.Tween.removeTweens(this.display);
	}

	this.update = function() {
		this.move(dx, dy);
	}


}

function Player(hero, pos) {
	this.hero = hero;
	this.health = hero.maxHealth;

	this.availableSkills = {Q: true, W: true, E: true, R: true};

	var display = new createjs.Shape();
	this.hero.draw(display.graphics);
	this.display = display;

	// Set initial position
	this.display.x = pos[0];
	this.display.y = pos[1];

	this.canMove = true;

	this.root = function(duration) {
		setCanMove(false);
		setTimout(_.partial(setCanMove, true), duration);
	}

	this.move = function(dx, dy) {
		if (this.canMove) {
			this.stopMoving();
			this.display.x += dx;
			this.display.y += dy;
		}
	}

	this.moveTo = function(x, y) {
		if (this.canMove) {
			this.stopMoving();
			var dist = distance(x, y, this.display.x, this.display. y);
			createjs.Tween.get(this.display).to({x: x, y: y}, (dist / this.hero.speed), createjs.Ease.none);		
		}
			
	}

	this.stopMoving = function() {
		createjs.Tween.removeTweens(this.display);
	}

	this.update = function() {
		// this.move(dx, dy);
	}

	this.skill = function (ch, mouseX, mouseY) {
		// Q, W, E or R

		if (this.availableSkills[ch]) {
			this.hero.skills[ch].activate(this, mouseX, mouseY);
			this.availableSkills[ch] = false;
			setTimeout(function() { this.availableSkills[ch] = true; }.bind(this), this.hero.skills[ch].cooldown);
		} else {
			console.log('Skill ' + ch + ' on cooldown, cannot use!');
		}


	}

	this.setCanMove = function(canMove) {
		this.canMove = canMove;
	}
}


function Player(playerState, id, playerName) {
	this.id = playerState.id;
	this.playerName = playerState.playerName;
	this.hero = Ez;
	this.health = this.hero.maxHealth;

	this.availableSkills = {Q: true, W: true, E: true, R: true};

	var display = new createjs.Shape();
	this.hero.draw(display.graphics);
	this.display = display;
	

	// Set initial position
	this.display.x = playerState.pos[0];
	this.display.y = playerState.pos[1];

	this.canMove = true;

	this.root = function(duration) {
		setCanMove(false);
		setTimout(_.partial(setCanMove, true), duration);
	}

	this.move = function(dx, dy) {
		if (this.canMove) {
			this.stopMoving();
			this.display.x += dx;
			this.display.y += dy;
		}
	}

	this.moveTo = function(x, y) {
		if (this.canMove) {
			this.stopMoving();
			var dist = distance(x, y, this.display.x, this.display. y);
			createjs.Tween.get(this.display).to({x: x, y: y}, (dist / this.hero.speed), createjs.Ease.none);		
		}
			
	}

	this.stopMoving = function() {
		createjs.Tween.removeTweens(this.display);
	}

	this.update = function() {
		// this.move(dx, dy);
	}

	this.skill = function (ch, mouseX, mouseY) {
		// Q, W, E or R

		if (this.availableSkills[ch]) {
			this.hero.skills[ch].activate(this, mouseX, mouseY);
			this.availableSkills[ch] = false;
			setTimeout(function() { this.availableSkills[ch] = true; }.bind(this), this.hero.skills[ch].cooldown);
		} else {
			console.log('Skill ' + ch + ' on cooldown, cannot use!');
		}


	}

	this.setCanMove = function(canMove) {
		this.canMove = canMove;
	}
}

function Arena(dims, players) {
	this.dims = dims;
	this.players = players;
}