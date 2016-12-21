'use strict';

// Handle keyboard controls
var keysDown = {};

var Game = function() {

	this.canvas = document.querySelector('#game');
	this.ctx = this.canvas.getContext('2d');
	// this.canvas.width = 480;
	// this.canvas.height = 800;
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	
	// document.body.appendChild(this.canvas);

	addEventListener('keydown', function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener('keyup', function (e) {
		delete keysDown[e.keyCode];
	}, false);

	// initialize
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
		speed: 256 // movement in pixels per second
	};

	this.giftToGet = {};
	this.giftsCollected = 0;

	this.santaCharacter.x = this.canvas.width / 2;
	this.santaCharacter.y = this.canvas.height / 2;


	this.setRandomGiftLocation();
	this.animate();

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

	if (38 in keysDown) { // Player holding up
		if (this.santaCharacter.y >= 0) {
			this.santaCharacter.y -= this.santaCharacter.speed * modifier;
		};
	}
	if (40 in keysDown) { // Player holding down
		if (this.santaCharacter.y <= this.canvas.height - 64) {
			this.santaCharacter.y += this.santaCharacter.speed * modifier;
		};
	}
	if (37 in keysDown) { // Player holding left
		if (this.santaCharacter.x >= 0) {
			this.santaCharacter.x -= this.santaCharacter.speed * modifier;
			this.santa.src = 'images/santa-sleigh.png';

		};
	}
	if (39 in keysDown) { // Player holding right
		if (this.santaCharacter.x <= (this.canvas.width - 32)) {
			this.santaCharacter.x += this.santaCharacter.speed * modifier;
			this.santa.src = 'images/santa-sleigh_flip.png';
		};
	}

	// collision detection
	if (this.santaCharacter.x <= (this.giftToGet.x + 32) && this.giftToGet.x <= (this.santaCharacter.x + 32) && this.santaCharacter.y <= (this.giftToGet.y + 32)
 && this.giftToGet.y <= (this.santaCharacter.y + 32)) {

		// if (this.giftsCollected < 9) {
		if (this.giftsCollected >= 0) {
			this.giftsCollected++;
			this.setRandomGiftLocation();

			// var overlay = document.querySelector('.end-game');
			// TweenLite.to(overlay, 0.5, {
			// 	delay: 60,
			// 	opacity: 1,
			// 	zIndex: 15,
			// 	ease: Power4.easeOut,
			// 	onStart: function() {
			// 		document.querySelector('#finalScore').innerHTML = this.giftsCollected + ' lost presents!';
			// 	}.bind(this)
			// });
		}
	}
};

// Draw everything
Game.prototype.render = function () {

	// this.ctx.drawImage(this.bgImage, 0, 0);

	// this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);

	var repeatPattern = this.ctx.createPattern(this.bgImage, 'repeat'); // Create a pattern with this image, and set it to 'repeat'.
 	this.ctx.fillStyle = repeatPattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.ctx.drawImage(this.santa, this.santaCharacter.x, this.santaCharacter.y);
	this.ctx.drawImage(this.gift, this.giftToGet.x, this.giftToGet.y);

	// Score
	// this.ctx.fillStyle = 'rgb(152, 0, 0)';
	this.ctx.fillStyle = 'rgb(255, 255, 255)';
	this.ctx.font = '26px PT Sans';
	this.ctx.textAlign = 'left';
	this.ctx.textBaseline = 'top';
	this.ctx.fillText('Presents Collected: ' + this.giftsCollected, 32, 32);
};

// The main game loop
Game.prototype.animate = function () {
	var now = Date.now();
	var delta = now - this.then;

	this.update(delta / 1000);
	this.render();

	this.then = now;

	requestAnimationFrame(this.animate.bind(this));
};

// d pad movement
Game.prototype.dPad = function() {
	// mobile d pad movement
	var top = document.querySelector('#top');
	var left = document.querySelector('#left');
	var right = document.querySelector('#right');
	var bottom = document.querySelector('#down');

	top.addEventListener('mousedown', function() {
		if (this.santaCharacter.y >= 0) {
			this.santaCharacter.y -= this.santaCharacter.speed * 0.1;
		};
	}.bind(this));

	down.addEventListener('mousedown', function() {
		if (this.santaCharacter.y <= this.canvas.height - 64) {
			this.santaCharacter.y += this.santaCharacter.speed * 0.1;
		};
	}.bind(this));

	left.addEventListener('mousedown', function() {
		if (this.santaCharacter.x >= 0) {
			this.santaCharacter.x -= this.santaCharacter.speed * 0.1;
			this.santa.src = 'images/santa-sleigh.png';
		};
	}.bind(this));

	right.addEventListener('mousedown', function() {
		if (this.santaCharacter.x <= (this.canvas.width - 32)) {
			this.santaCharacter.x += this.santaCharacter.speed * 0.1;
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