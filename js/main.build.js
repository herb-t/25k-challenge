(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Game = require('./Game');

var game = new Game();

// timer
function getTimeRemaining(endtime) {
	var total = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((total / 1000) % 60);

	return {
		'total': total,
		'seconds': seconds
	};
}

function initializeClock(id, endtime) {
  var timer = document.querySelector('#timer');
  var secondsDisplay = timer.querySelector('#seconds');

  function updateClock() {
    var time = getTimeRemaining(endtime);

    secondsDisplay.innerHTML = ('0' + time.seconds).slice(-2);

  	if (time.total <= 0) {
  		clearInterval(timeinterval);
  	}

  	if (time.seconds === 1) {
			var overlay = document.querySelector('.end-game');
			TweenLite.to(overlay, 0.5, {
				delay: 0.5,
				opacity: 1,
				zIndex: 15,
				ease: Power4.easeOut
			});
  	}
   }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var countdownEndtime = new Date(Date.parse(new Date()) + 15 * 24 * 60 * 60 * 1000);
initializeClock('timer-container', countdownEndtime);

},{"./Game":2}],2:[function(require,module,exports){
'use strict';

// Handle keyboard controls
var keysDown = {};

/**
 * Game layout and mechanics
 */
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

/**
 * initialize game objects
 */
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

/**
 * lays out bg image
 */
Game.prototype.drawBackground = function() {
	this.bgImage = new Image();
	this.bgImage.src = 'images/bg-ice-tile-x.jpg';
};

/**
 * lays out santa image
 */
Game.prototype.drawSanta = function() {
	this.santa = new Image();
	this.santaFlip = new Image();

	this.santa.src = 'images/santa-sleigh.png';
	this.santaFlip.src = 'images/santa-sleigh_flip.png';
};

/**
 * lays out gift image
 */
Game.prototype.drawGift = function() {
	this.gift = new Image();
	this.gift.src = 'images/gift.png';
};

/**
 * Throw the new gift somewhere on the screen randomly
 */
Game.prototype.setRandomGiftLocation = function () {
	this.giftToGet.x = 32 + (Math.random() * (this.canvas.width - 64));
	this.giftToGet.y = 32 + (Math.random() * (this.canvas.height - 64));
};

/**
 * Update game objects
 */
Game.prototype.update = function (modifier) {
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

/**
 * move up motion/animation
 */
Game.prototype._moveUp = function(modifier) {
	this.movingY = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		y: this.santaCharacter.y - this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingY.bind(this)
	});
};

/**
 * move down motion/animation
 */
Game.prototype._moveDown = function(modifier) {
	this.movingY = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		y: this.santaCharacter.y + this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingY.bind(this)
	});
};

/**
 * move left motion/animation
 */
Game.prototype._moveLeft = function(modifier) {
	this.movingX = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		x: this.santaCharacter.x - this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingX.bind(this)
	});
};

/**
 * move right motion/animation
 */
Game.prototype._moveRight = function(modifier) {
	this.movingX = true;

	TweenLite.to(this.santaCharacter, 0.75, {
		x: this.santaCharacter.x + this.santaCharacter.speed * modifier,
		ease: Power1.easeOut,
		onComplete: this._hasFinishedMovingX.bind(this)
	});
};

/**
 * finished moving on X axis flag
 */
Game.prototype._hasFinishedMovingX = function() {
	this.movingX = false;
};

/**
 * finished moving on Y axis flag
 */
Game.prototype._hasFinishedMovingY = function() {
	this.movingY = false;
};

/**
 * finished moving flag
 */
Game.prototype._hasFinishedMoving = function() {
	this.moving = false;
};

/**
 * draw everything
 */
Game.prototype.render = function () {
	var repeatPattern = this.ctx.createPattern(this.bgImage, 'repeat'); // Create a pattern with this image, and set it to 'repeat'.
 	this.ctx.fillStyle = repeatPattern;
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	this.ctx.drawImage(this.santa, this.santaCharacter.x, this.santaCharacter.y);
	this.ctx.drawImage(this.gift, this.giftToGet.x, this.giftToGet.y);
};

/**
 * Main game loop
 */
Game.prototype.animate = function () {
	var now = Date.now();
	var delta = now - this.then;

	this.update(delta / 150);
	this.render();

	this.then = now;

	requestAnimationFrame(this.animate.bind(this));
};

/**
 * Directional Pad - mobile ui
 */
Game.prototype.dPad = function() {
	// mobile d pad movement
	var up = document.querySelector('#top');
	var left = document.querySelector('#left');
	var right = document.querySelector('#right');
	var bottom = document.querySelector('#down');

  // tap up
  up.addEventListener('click', function() {
		if (this.santaCharacter.y >= 0) {
			TweenLite.to(this.santaCharacter, 0.25, {
				y: this.santaCharacter.y - 25.5,
				ease: Power1.easeOut
			});
		};
	}.bind(this));

  // tap down
  down.addEventListener('click', function() {
		if (this.santaCharacter.y <= this.canvas.height - 64) {
			TweenLite.to(this.santaCharacter, 0.25, {
				y: this.santaCharacter.y + 25.5,
				ease: Power1.easeOut
			});
		};
	}.bind(this));

  // tap left
  left.addEventListener('click', function() {
		if (this.santaCharacter.x >= 0) {
			TweenLite.to(this.santaCharacter, 0.25, {
				x: this.santaCharacter.x - 25.5,
				ease: Power1.easeOut
			});
			this.santa.src = 'images/santa-sleigh.png';
		};
	}.bind(this));

  // tap right
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

/**
 * on resize stuff
 */
Game.prototype._onResize = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.init();
};

module.exports = Game;

},{}]},{},[1])

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIi4vYXBwL2luZGV4LmpzIiwiRDovcHJvamVjdHMvcGVyc29uYWwvMjVLLWNoYWxsZW5nZS1naXRodWIvYXBwL0dhbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIEdhbWUgPSByZXF1aXJlKCcuL0dhbWUnKTtcclxuXHJcbnZhciBnYW1lID0gbmV3IEdhbWUoKTtcclxuXHJcbi8vIHRpbWVyXHJcbmZ1bmN0aW9uIGdldFRpbWVSZW1haW5pbmcoZW5kdGltZSkge1xyXG5cdHZhciB0b3RhbCA9IERhdGUucGFyc2UoZW5kdGltZSkgLSBEYXRlLnBhcnNlKG5ldyBEYXRlKCkpO1xyXG5cdHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcigodG90YWwgLyAxMDAwKSAlIDYwKTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdCd0b3RhbCc6IHRvdGFsLFxyXG5cdFx0J3NlY29uZHMnOiBzZWNvbmRzXHJcblx0fTtcclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNsb2NrKGlkLCBlbmR0aW1lKSB7XHJcbiAgdmFyIHRpbWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RpbWVyJyk7XHJcbiAgdmFyIHNlY29uZHNEaXNwbGF5ID0gdGltZXIucXVlcnlTZWxlY3RvcignI3NlY29uZHMnKTtcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRlQ2xvY2soKSB7XHJcbiAgICB2YXIgdGltZSA9IGdldFRpbWVSZW1haW5pbmcoZW5kdGltZSk7XHJcblxyXG4gICAgc2Vjb25kc0Rpc3BsYXkuaW5uZXJIVE1MID0gKCcwJyArIHRpbWUuc2Vjb25kcykuc2xpY2UoLTIpO1xyXG5cclxuICBcdGlmICh0aW1lLnRvdGFsIDw9IDApIHtcclxuICBcdFx0Y2xlYXJJbnRlcnZhbCh0aW1laW50ZXJ2YWwpO1xyXG4gIFx0fVxyXG5cclxuICBcdGlmICh0aW1lLnNlY29uZHMgPT09IDEpIHtcclxuXHRcdFx0dmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZW5kLWdhbWUnKTtcclxuXHRcdFx0VHdlZW5MaXRlLnRvKG92ZXJsYXksIDAuNSwge1xyXG5cdFx0XHRcdGRlbGF5OiAwLjUsXHJcblx0XHRcdFx0b3BhY2l0eTogMSxcclxuXHRcdFx0XHR6SW5kZXg6IDE1LFxyXG5cdFx0XHRcdGVhc2U6IFBvd2VyNC5lYXNlT3V0XHJcblx0XHRcdH0pO1xyXG4gIFx0fVxyXG4gICB9XHJcblxyXG4gIHVwZGF0ZUNsb2NrKCk7XHJcbiAgdmFyIHRpbWVpbnRlcnZhbCA9IHNldEludGVydmFsKHVwZGF0ZUNsb2NrLCAxMDAwKTtcclxufVxyXG5cclxudmFyIGNvdW50ZG93bkVuZHRpbWUgPSBuZXcgRGF0ZShEYXRlLnBhcnNlKG5ldyBEYXRlKCkpICsgMTUgKiAyNCAqIDYwICogNjAgKiAxMDAwKTtcclxuaW5pdGlhbGl6ZUNsb2NrKCd0aW1lci1jb250YWluZXInLCBjb3VudGRvd25FbmR0aW1lKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gSGFuZGxlIGtleWJvYXJkIGNvbnRyb2xzXHJcbnZhciBrZXlzRG93biA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEdhbWUgbGF5b3V0IGFuZCBtZWNoYW5pY3NcclxuICovXHJcbnZhciBHYW1lID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZScpO1xyXG5cdHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHR0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5cdHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRrZXlzRG93bltlLmtleUNvZGVdID0gdHJ1ZTtcclxuXHR9LCBmYWxzZSk7XHJcblxyXG5cdGFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGRlbGV0ZSBrZXlzRG93bltlLmtleUNvZGVdO1xyXG5cdH0sIGZhbHNlKTtcclxuXHJcblx0dGhpcy5kaXNwbGF5Q29sbGVjdGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbGxlY3Rpb24nKTtcclxuXHJcblx0dGhpcy5pbml0KCk7XHJcblxyXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBpbml0aWFsaXplIGdhbWUgb2JqZWN0c1xyXG4gKi9cclxuR2FtZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuZHJhd0JhY2tncm91bmQoKTtcclxuXHR0aGlzLmRyYXdTYW50YSgpO1xyXG5cdHRoaXMuZHJhd0dpZnQoKTtcclxuXHR0aGlzLmRQYWQoKTtcclxuXHJcblx0dGhpcy50aGVuID0gRGF0ZS5ub3coKTtcclxuXHJcblx0Ly8gR2FtZSBvYmplY3RzXHJcblx0dGhpcy5zYW50YUNoYXJhY3RlciA9IHtcclxuXHRcdHNwZWVkOiAoMjU2ICogMikgLy8gbW92ZW1lbnQgaW4gcGl4ZWxzIHBlciBzZWNvbmRcclxuXHR9O1xyXG5cclxuXHR0aGlzLmdpZnRUb0dldCA9IHt9O1xyXG5cdHRoaXMuZ2lmdHNDb2xsZWN0ZWQgPSAwO1xyXG5cdHRoaXMuZGlzcGxheUNvbGxlY3RlZC5pbm5lckhUTUwgPSB0aGlzLmdpZnRzQ29sbGVjdGVkO1xyXG5cclxuXHR0aGlzLnNhbnRhQ2hhcmFjdGVyLnggPSB0aGlzLmNhbnZhcy53aWR0aCAvIDI7XHJcblx0dGhpcy5zYW50YUNoYXJhY3Rlci55ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMjtcclxuXHJcblx0dGhpcy5zZXRSYW5kb21HaWZ0TG9jYXRpb24oKTtcclxuXHR0aGlzLmFuaW1hdGUoKTtcclxuXHJcblx0dGhpcy5tb3ZpbmcgPSBmYWxzZTtcclxuXHR0aGlzLm1vdmluZ1ggPSBmYWxzZTtcclxuXHR0aGlzLm1vdmluZ1kgPSBmYWxzZTtcclxuXHJcblx0Ly8gdGFsbHkgYW5kIGRpc3BsYXkgc2NvcmUgYWZ0ZXIgNjBzXHJcblx0dmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZW5kLWdhbWUnKTtcclxuXHRUd2VlbkxpdGUudG8ob3ZlcmxheSwgMC41LCB7XHJcblx0XHRkZWxheTogNTksXHJcblx0XHRvblN0YXJ0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbmFsU2NvcmUnKS5pbm5lckhUTUwgPSB0aGlzLmdpZnRzQ29sbGVjdGVkICsgJyBsb3N0IHByZXNlbnRzISc7XHJcblx0XHR9LmJpbmQodGhpcylcclxuXHR9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBsYXlzIG91dCBiZyBpbWFnZVxyXG4gKi9cclxuR2FtZS5wcm90b3R5cGUuZHJhd0JhY2tncm91bmQgPSBmdW5jdGlvbigpIHtcclxuXHR0aGlzLmJnSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHR0aGlzLmJnSW1hZ2Uuc3JjID0gJ2ltYWdlcy9iZy1pY2UtdGlsZS14LmpwZyc7XHJcbn07XHJcblxyXG4vKipcclxuICogbGF5cyBvdXQgc2FudGEgaW1hZ2VcclxuICovXHJcbkdhbWUucHJvdG90eXBlLmRyYXdTYW50YSA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuc2FudGEgPSBuZXcgSW1hZ2UoKTtcclxuXHR0aGlzLnNhbnRhRmxpcCA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHR0aGlzLnNhbnRhLnNyYyA9ICdpbWFnZXMvc2FudGEtc2xlaWdoLnBuZyc7XHJcblx0dGhpcy5zYW50YUZsaXAuc3JjID0gJ2ltYWdlcy9zYW50YS1zbGVpZ2hfZmxpcC5wbmcnO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIGxheXMgb3V0IGdpZnQgaW1hZ2VcclxuICovXHJcbkdhbWUucHJvdG90eXBlLmRyYXdHaWZ0ID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5naWZ0ID0gbmV3IEltYWdlKCk7XHJcblx0dGhpcy5naWZ0LnNyYyA9ICdpbWFnZXMvZ2lmdC5wbmcnO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRocm93IHRoZSBuZXcgZ2lmdCBzb21ld2hlcmUgb24gdGhlIHNjcmVlbiByYW5kb21seVxyXG4gKi9cclxuR2FtZS5wcm90b3R5cGUuc2V0UmFuZG9tR2lmdExvY2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdHRoaXMuZ2lmdFRvR2V0LnggPSAzMiArIChNYXRoLnJhbmRvbSgpICogKHRoaXMuY2FudmFzLndpZHRoIC0gNjQpKTtcclxuXHR0aGlzLmdpZnRUb0dldC55ID0gMzIgKyAoTWF0aC5yYW5kb20oKSAqICh0aGlzLmNhbnZhcy5oZWlnaHQgLSA2NCkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZSBnYW1lIG9iamVjdHNcclxuICovXHJcbkdhbWUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChtb2RpZmllcikge1xyXG5cdGlmICgzOCBpbiBrZXlzRG93bikgeyAvLyBQbGF5ZXIgaG9sZGluZyB1cFxyXG5cclxuXHRcdGlmICh0aGlzLnNhbnRhQ2hhcmFjdGVyLnkgPj0gNjQgJiYgIXRoaXMubW92aW5nWSkge1xyXG5cclxuXHRcdFx0dGhpcy5fbW92ZVVwKG1vZGlmaWVyKTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRpZiAoNDAgaW4ga2V5c0Rvd24pIHsgLy8gUGxheWVyIGhvbGRpbmcgZG93blxyXG5cclxuXHRcdGlmICh0aGlzLnNhbnRhQ2hhcmFjdGVyLnkgPD0gdGhpcy5jYW52YXMuaGVpZ2h0IC0gMTI4ICYmICF0aGlzLm1vdmluZ1kpIHtcclxuXHRcdFx0dGhpcy5fbW92ZURvd24obW9kaWZpZXIpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGlmICgzNyBpbiBrZXlzRG93bikgeyAvLyBQbGF5ZXIgaG9sZGluZyBsZWZ0XHJcblxyXG5cdFx0dGhpcy5zYW50YS5zcmMgPSAnaW1hZ2VzL3NhbnRhLXNsZWlnaC5wbmcnO1xyXG5cclxuXHRcdGlmICh0aGlzLnNhbnRhQ2hhcmFjdGVyLnggPj0gNjQgJiYgIXRoaXMubW92aW5nWCkge1xyXG5cdFx0XHR0aGlzLl9tb3ZlTGVmdChtb2RpZmllcik7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0aWYgKDM5IGluIGtleXNEb3duKSB7IC8vIFBsYXllciBob2xkaW5nIHJpZ2h0XHJcblxyXG5cdFx0dGhpcy5zYW50YS5zcmMgPSAnaW1hZ2VzL3NhbnRhLXNsZWlnaF9mbGlwLnBuZyc7XHJcblxyXG5cdFx0aWYgKHRoaXMuc2FudGFDaGFyYWN0ZXIueCA8PSAodGhpcy5jYW52YXMud2lkdGggLSAxMjgpICYmICF0aGlzLm1vdmluZ1gpIHtcclxuXHRcdFx0dGhpcy5fbW92ZVJpZ2h0KG1vZGlmaWVyKTtcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHQvLyBjb2xsaXNpb24gZGV0ZWN0aW9uXHJcblx0aWYgKHRoaXMuc2FudGFDaGFyYWN0ZXIueCA8PSAodGhpcy5naWZ0VG9HZXQueCArIDMyKSAmJiB0aGlzLmdpZnRUb0dldC54IDw9ICh0aGlzLnNhbnRhQ2hhcmFjdGVyLnggKyAzMikgJiYgdGhpcy5zYW50YUNoYXJhY3Rlci55IDw9ICh0aGlzLmdpZnRUb0dldC55ICsgMzIpXHJcbiAmJiB0aGlzLmdpZnRUb0dldC55IDw9ICh0aGlzLnNhbnRhQ2hhcmFjdGVyLnkgKyAzMikpIHtcclxuXHJcblx0XHRpZiAodGhpcy5naWZ0c0NvbGxlY3RlZCA+PSAwKSB7XHJcblx0XHRcdHRoaXMuZ2lmdHNDb2xsZWN0ZWQrKztcclxuXHJcblx0XHRcdHRoaXMuZGlzcGxheUNvbGxlY3RlZC5pbm5lckhUTUwgPSB0aGlzLmdpZnRzQ29sbGVjdGVkO1xyXG5cclxuXHRcdFx0dGhpcy5zZXRSYW5kb21HaWZ0TG9jYXRpb24oKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vKipcclxuICogbW92ZSB1cCBtb3Rpb24vYW5pbWF0aW9uXHJcbiAqL1xyXG5HYW1lLnByb3RvdHlwZS5fbW92ZVVwID0gZnVuY3Rpb24obW9kaWZpZXIpIHtcclxuXHR0aGlzLm1vdmluZ1kgPSB0cnVlO1xyXG5cclxuXHRUd2VlbkxpdGUudG8odGhpcy5zYW50YUNoYXJhY3RlciwgMC43NSwge1xyXG5cdFx0eTogdGhpcy5zYW50YUNoYXJhY3Rlci55IC0gdGhpcy5zYW50YUNoYXJhY3Rlci5zcGVlZCAqIG1vZGlmaWVyLFxyXG5cdFx0ZWFzZTogUG93ZXIxLmVhc2VPdXQsXHJcblx0XHRvbkNvbXBsZXRlOiB0aGlzLl9oYXNGaW5pc2hlZE1vdmluZ1kuYmluZCh0aGlzKVxyXG5cdH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIG1vdmUgZG93biBtb3Rpb24vYW5pbWF0aW9uXHJcbiAqL1xyXG5HYW1lLnByb3RvdHlwZS5fbW92ZURvd24gPSBmdW5jdGlvbihtb2RpZmllcikge1xyXG5cdHRoaXMubW92aW5nWSA9IHRydWU7XHJcblxyXG5cdFR3ZWVuTGl0ZS50byh0aGlzLnNhbnRhQ2hhcmFjdGVyLCAwLjc1LCB7XHJcblx0XHR5OiB0aGlzLnNhbnRhQ2hhcmFjdGVyLnkgKyB0aGlzLnNhbnRhQ2hhcmFjdGVyLnNwZWVkICogbW9kaWZpZXIsXHJcblx0XHRlYXNlOiBQb3dlcjEuZWFzZU91dCxcclxuXHRcdG9uQ29tcGxldGU6IHRoaXMuX2hhc0ZpbmlzaGVkTW92aW5nWS5iaW5kKHRoaXMpXHJcblx0fSk7XHJcbn07XHJcblxyXG4vKipcclxuICogbW92ZSBsZWZ0IG1vdGlvbi9hbmltYXRpb25cclxuICovXHJcbkdhbWUucHJvdG90eXBlLl9tb3ZlTGVmdCA9IGZ1bmN0aW9uKG1vZGlmaWVyKSB7XHJcblx0dGhpcy5tb3ZpbmdYID0gdHJ1ZTtcclxuXHJcblx0VHdlZW5MaXRlLnRvKHRoaXMuc2FudGFDaGFyYWN0ZXIsIDAuNzUsIHtcclxuXHRcdHg6IHRoaXMuc2FudGFDaGFyYWN0ZXIueCAtIHRoaXMuc2FudGFDaGFyYWN0ZXIuc3BlZWQgKiBtb2RpZmllcixcclxuXHRcdGVhc2U6IFBvd2VyMS5lYXNlT3V0LFxyXG5cdFx0b25Db21wbGV0ZTogdGhpcy5faGFzRmluaXNoZWRNb3ZpbmdYLmJpbmQodGhpcylcclxuXHR9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBtb3ZlIHJpZ2h0IG1vdGlvbi9hbmltYXRpb25cclxuICovXHJcbkdhbWUucHJvdG90eXBlLl9tb3ZlUmlnaHQgPSBmdW5jdGlvbihtb2RpZmllcikge1xyXG5cdHRoaXMubW92aW5nWCA9IHRydWU7XHJcblxyXG5cdFR3ZWVuTGl0ZS50byh0aGlzLnNhbnRhQ2hhcmFjdGVyLCAwLjc1LCB7XHJcblx0XHR4OiB0aGlzLnNhbnRhQ2hhcmFjdGVyLnggKyB0aGlzLnNhbnRhQ2hhcmFjdGVyLnNwZWVkICogbW9kaWZpZXIsXHJcblx0XHRlYXNlOiBQb3dlcjEuZWFzZU91dCxcclxuXHRcdG9uQ29tcGxldGU6IHRoaXMuX2hhc0ZpbmlzaGVkTW92aW5nWC5iaW5kKHRoaXMpXHJcblx0fSk7XHJcbn07XHJcblxyXG4vKipcclxuICogZmluaXNoZWQgbW92aW5nIG9uIFggYXhpcyBmbGFnXHJcbiAqL1xyXG5HYW1lLnByb3RvdHlwZS5faGFzRmluaXNoZWRNb3ZpbmdYID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5tb3ZpbmdYID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogZmluaXNoZWQgbW92aW5nIG9uIFkgYXhpcyBmbGFnXHJcbiAqL1xyXG5HYW1lLnByb3RvdHlwZS5faGFzRmluaXNoZWRNb3ZpbmdZID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy5tb3ZpbmdZID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogZmluaXNoZWQgbW92aW5nIGZsYWdcclxuICovXHJcbkdhbWUucHJvdG90eXBlLl9oYXNGaW5pc2hlZE1vdmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMubW92aW5nID0gZmFsc2U7XHJcbn07XHJcblxyXG4vKipcclxuICogZHJhdyBldmVyeXRoaW5nXHJcbiAqL1xyXG5HYW1lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHJlcGVhdFBhdHRlcm4gPSB0aGlzLmN0eC5jcmVhdGVQYXR0ZXJuKHRoaXMuYmdJbWFnZSwgJ3JlcGVhdCcpOyAvLyBDcmVhdGUgYSBwYXR0ZXJuIHdpdGggdGhpcyBpbWFnZSwgYW5kIHNldCBpdCB0byAncmVwZWF0Jy5cclxuIFx0dGhpcy5jdHguZmlsbFN0eWxlID0gcmVwZWF0UGF0dGVybjtcclxuICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0dGhpcy5jdHguZHJhd0ltYWdlKHRoaXMuc2FudGEsIHRoaXMuc2FudGFDaGFyYWN0ZXIueCwgdGhpcy5zYW50YUNoYXJhY3Rlci55KTtcclxuXHR0aGlzLmN0eC5kcmF3SW1hZ2UodGhpcy5naWZ0LCB0aGlzLmdpZnRUb0dldC54LCB0aGlzLmdpZnRUb0dldC55KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWluIGdhbWUgbG9vcFxyXG4gKi9cclxuR2FtZS5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHR2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuXHR2YXIgZGVsdGEgPSBub3cgLSB0aGlzLnRoZW47XHJcblxyXG5cdHRoaXMudXBkYXRlKGRlbHRhIC8gMTUwKTtcclxuXHR0aGlzLnJlbmRlcigpO1xyXG5cclxuXHR0aGlzLnRoZW4gPSBub3c7XHJcblxyXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGUuYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogRGlyZWN0aW9uYWwgUGFkIC0gbW9iaWxlIHVpXHJcbiAqL1xyXG5HYW1lLnByb3RvdHlwZS5kUGFkID0gZnVuY3Rpb24oKSB7XHJcblx0Ly8gbW9iaWxlIGQgcGFkIG1vdmVtZW50XHJcblx0dmFyIHVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvcCcpO1xyXG5cdHZhciBsZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xlZnQnKTtcclxuXHR2YXIgcmlnaHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmlnaHQnKTtcclxuXHR2YXIgYm90dG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Rvd24nKTtcclxuXHJcbiAgLy8gdGFwIHVwXHJcbiAgdXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLnNhbnRhQ2hhcmFjdGVyLnkgPj0gMCkge1xyXG5cdFx0XHRUd2VlbkxpdGUudG8odGhpcy5zYW50YUNoYXJhY3RlciwgMC4yNSwge1xyXG5cdFx0XHRcdHk6IHRoaXMuc2FudGFDaGFyYWN0ZXIueSAtIDI1LjUsXHJcblx0XHRcdFx0ZWFzZTogUG93ZXIxLmVhc2VPdXRcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdH0uYmluZCh0aGlzKSk7XHJcblxyXG4gIC8vIHRhcCBkb3duXHJcbiAgZG93bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuc2FudGFDaGFyYWN0ZXIueSA8PSB0aGlzLmNhbnZhcy5oZWlnaHQgLSA2NCkge1xyXG5cdFx0XHRUd2VlbkxpdGUudG8odGhpcy5zYW50YUNoYXJhY3RlciwgMC4yNSwge1xyXG5cdFx0XHRcdHk6IHRoaXMuc2FudGFDaGFyYWN0ZXIueSArIDI1LjUsXHJcblx0XHRcdFx0ZWFzZTogUG93ZXIxLmVhc2VPdXRcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cdH0uYmluZCh0aGlzKSk7XHJcblxyXG4gIC8vIHRhcCBsZWZ0XHJcbiAgbGVmdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuc2FudGFDaGFyYWN0ZXIueCA+PSAwKSB7XHJcblx0XHRcdFR3ZWVuTGl0ZS50byh0aGlzLnNhbnRhQ2hhcmFjdGVyLCAwLjI1LCB7XHJcblx0XHRcdFx0eDogdGhpcy5zYW50YUNoYXJhY3Rlci54IC0gMjUuNSxcclxuXHRcdFx0XHRlYXNlOiBQb3dlcjEuZWFzZU91dFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5zYW50YS5zcmMgPSAnaW1hZ2VzL3NhbnRhLXNsZWlnaC5wbmcnO1xyXG5cdFx0fTtcclxuXHR9LmJpbmQodGhpcykpO1xyXG5cclxuICAvLyB0YXAgcmlnaHRcclxuICByaWdodC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuc2FudGFDaGFyYWN0ZXIueCA8PSAodGhpcy5jYW52YXMud2lkdGggLSAzMikpIHtcclxuXHRcdFx0VHdlZW5MaXRlLnRvKHRoaXMuc2FudGFDaGFyYWN0ZXIsIDAuMjUsIHtcclxuXHRcdFx0XHR4OiB0aGlzLnNhbnRhQ2hhcmFjdGVyLnggKyAyNS41LFxyXG5cdFx0XHRcdGVhc2U6IFBvd2VyMS5lYXNlT3V0XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR0aGlzLnNhbnRhLnNyYyA9ICdpbWFnZXMvc2FudGEtc2xlaWdoX2ZsaXAucG5nJztcclxuXHRcdH07XHJcblx0fS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBvbiByZXNpemUgc3R1ZmZcclxuICovXHJcbkdhbWUucHJvdG90eXBlLl9vblJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHR0aGlzLmluaXQoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIl19