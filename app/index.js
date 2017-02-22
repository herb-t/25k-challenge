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
