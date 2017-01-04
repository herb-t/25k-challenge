'use strict';

// Handle keyboard controls
var keysDown = {};

var Game = function() {

	this.canvas = document.querySelector('#game');
	this.ctx = this.canvas.getContext('2d');
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	addEventListener('keydown', function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener('keyup', function (e) {
		delete keysDown[e.keyCode];
	}, false);

	this.displayCollected = document.querySelector('#collection');

	this.init();

	window.addEventListener('resize', this._onResize.bind(this));
};

Game.prototype.init = function() {

	this.drawBackground();
	this.drawSanta();
	this.drawGift();
	this.dPad();

	this.then = Date.now();

	// Game objects
	this.santaCharacter = {
		speed: (256 * 2) // movement in pixels per second
	};

	this.giftToGet = {};
	this.giftsCollected = 0;
	this.displayCollected.innerHTML = this.giftsCollected;

	this.santaCharacter.x = this.canvas.width / 2;
	this.santaCharacter.y = this.canvas.height / 2;


	this.setRandomGiftLocation();
	this.animate();

	this.moving = false;
	this.movingX = false;
	this.movingY = false;

	// tally and display score after 60s
	var overlay = document.querySelector('.end-game');
	TweenLite.to(overlay, 0.5, {
		delay: 59,
		onStart: function() {
			document.querySelector('#finalScore').innerHTML = this.giftsCollected + ' lost presents!';
		}.bind(this)
	});
};


Game.prototype.drawBackground = function() {

	this.bgImage = new Image();
	this.bgImage.src = 'images/bg-ice-tile-x.jpg';

};

Game.prototype.drawSanta = function() {

	this.santa = new Image();
	this.santaFlip = new Image();

	this.santa.src = 'images/santa-sleigh.png';
	this.santaFlip.src = 'images/santa-sleigh_flip.png';
};

Game.prototype.drawGift = function() {

	this.gift = new Image();
	this.gift.src = 'images/gift.png';
};


// Throw the new gift somewhere on the screen randomly
Game.prototype.setRandomGiftLocation = function () {

	// this.santaCharacter.x = this.canvas.width / 2;
	// this.santaCharacter.y = this.canvas.height / 2;
	this.giftToGet.x = 32 + (Math.random() * (this.canvas.width - 64));
	this.giftToGet.y = 32 + (Math.random() * (this.canvas.height - 64));
};

// Update game objects
Game.prototype.update = function (modifier) {

	// if (38 in keysDown) { // Player holding up
	// 	if (this.santaCharacter.y >= 128) {
	// 		this._moveUp(modifier);
	// 	};
	// }
	// if (40 in keysDown) { // Player holding down
	// 	if (this.santaCharacter.y <= this.canvas.height - 200) {
	// 		this._moveDown(modifier);
	// 	};
	// }
	// if (37 in keysDown) { // Player holding left
	// 	if (this.santaCharacter.x >= 128) {
	// 		this._moveLeft(modifier);
	// 		this.santa.src = 'images/santa-sleigh.png';

	// 	};
	// }
	// if (39 in keysDown) { // Player holding right
	// 	if (this.santaCharacter.x <= (this.canvas.width - 200)) {
	// 		this._moveRight(modifier);
	// 		this.santa.src = 'images/santa-sleigh_flip.png';
	// 	};
	// }
	var diff = 20;

	// if (38 in keysDown) { // Player holding up
	// 	// if (this.santaCharacter.y >= 64) {
	// 	// 	this._moveUp(modifier);
	// 	// };
	// 	if (this.santaCharacter.y >= 64 && this.santaCharacter.y > this.santaCharacter.y - diff) {
	// 		this._moveUp(modifier);
	// 	};
	// }
	// if (40 in keysDown) { // Player holding down
	// 	// if (this.santaCharacter.y <= this.canvas.height - 128) {
	// 	// 	this._moveDown(modifier);
	// 	// };
	// 	if (this.santaCharacter.y <= this.canvas.height - 128 && this.santaCharacter.y + diff) {
	// 		this._moveDown(modifier);
	// 	};
	// }
	// if (37 in keysDown) { // Player holding left
	// 	if (this.santaCharacter.x >= 64) {
	// 		this._moveLeft(modifier);
	// 		this.santa.src = 'images/santa-sleigh.png';

	// 	};
	// }
	// if (39 in keysDown) { // Player holding right
	// 	if (this.santaCharacter.x <= (this.canvas.width - 128)) {
	// 		this._moveRight(modifier);
	// 		this.santa.src = 'images/santa-sleigh_flip.png';
	// 	};
	// }
	
	if (38 in keysDown) { // Player holding up

		if (this.santaCharacter.y >= 64 && !this.movingY) {
			
			this._moveUp(modifier);
		};
	}
	if (40 in keysDown) { // Player holding down

		if (this.santaCharacter.y <= this.canvas.height - 128 && !this.movingY) {
			this._moveDown(modifier);
		};
	}
	if (37 in keysDown) { // Player holding left

		this.santa.src = 'images/santa-sleigh.png';

		if (this.santaCharacter.x >= 64 && !this.movingX) {
			this._moveLeft(modifier);
		};
	}
	if (39 in keysDown) { // Player holding right

		this.santa.src = 'images/santa-sleigh_flip.png';

		if (this.santaCharacter.x <= (this.canvas.width - 128) && !this.movingX) {
			this._moveRight(modifier);
		};
	}

	// collision detection
	if (this.santaCharacter.x <= (this.giftToGet.x + 32) && this.giftToGet.x <= (this.santaCharacter.x + 32) && this.santaCharacter.y <= (this.giftToGet.y + 32)
 && this.giftToGet.y <= (this.santaCharacter.y + 32)) {

		if (this.giftsCollected >= 0) {
			this.giftsCollected++;

			this.displayCollected.innerHTML = this.giftsCollected;

			this.setRandomGiftLocation();
		}
	}
};

Game.prototype._moveUp = function(modifier) {
	this.movingY = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		y: this.santaCharacter.y - this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingY.bind(this)
	});
};

Game.prototype._moveDown = function(modifier) {
	this.movingY = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		y: this.santaCharacter.y + this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingY.bind(this)
	});
};

Game.prototype._moveLeft = function(modifier) {
	this.movingX = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		x: this.santaCharacter.x - this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingX.bind(this)
	});
};

Game.prototype._moveRight = function(modifier) {
	this.movingX = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		x: this.santaCharacter.x + this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingX.bind(this)
	});
};

Game.prototype._hasFinishedMovingX = function() {
	this.movingX = false;
};

Game.prototype._hasFinishedMovingY = function() {
	this.movingY = false;
};

Game.prototype._hasFinishedMoving = function() {
	this.moving = false;
};

// Draw everything
Game.prototype.render = function () {

	var repeatPattern = this.ctx.createPattern(this.bgImage, 'repeat'); // Create a pattern with this image, and set it to 'repeat'.
 	this.ctx.fillStyle = repeatPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.ctx.drawImage(this.santa, this.santaCharacter.x, this.santaCharacter.y);
	this.ctx.drawImage(this.gift, this.giftToGet.x, this.giftToGet.y);
};

// The main game loop
Game.prototype.animate = function () {
	var now = Date.now();
	var delta = now - this.then;

	this.update(delta / 150);
	this.render();

	this.then = now;

	requestAnimationFrame(this.animate.bind(this));
};

// d pad movement
Game.prototype.dPad = function() {
	// mobile d pad movement
	var up = document.querySelector('#top');
	var left = document.querySelector('#left');
	var right = document.querySelector('#right');
	var bottom = document.querySelector('#down');

	up.addEventListener('click', function() {
		if (this.santaCharacter.y >= 0) {
			TweenLite.to(this.santaCharacter, 0.25, {
				y: this.santaCharacter.y - 25.5,
				ease: Power1.easeOut
			});
		};
	}.bind(this));

	down.addEventListener('click', function() {
		if (this.santaCharacter.y <= this.canvas.height - 64) {
			TweenLite.to(this.santaCharacter, 0.25, {
				y: this.santaCharacter.y + 25.5,
				ease: Power1.easeOut
			});
		};
	}.bind(this));

	left.addEventListener('click', function() {
		if (this.santaCharacter.x >= 0) {
			TweenLite.to(this.santaCharacter, 0.25, {
				x: this.santaCharacter.x - 25.5,
				ease: Power1.easeOut
			});
			this.santa.src = 'images/santa-sleigh.png';
		};
	}.bind(this));

	right.addEventListener('click', function() {
		if (this.santaCharacter.x <= (this.canvas.width - 32)) {
			TweenLite.to(this.santaCharacter, 0.25, {
				x: this.santaCharacter.x + 25.5,
				ease: Power1.easeOut
			});
			this.santa.src = 'images/santa-sleigh_flip.png';
		};
	}.bind(this));
};

Game.prototype._onResize = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.init();
};

module.exports = Game;