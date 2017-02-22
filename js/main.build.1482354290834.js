/* Version: 1482354290834 */
/* Created: Wed Dec 21 2016 16:04:50 GMT-0500 (Eastern Standard Time) */
!function t(e,a,i){function s(r,h){if(!a[r]){if(!e[r]){var o="function"==typeof require&&require;if(!h&&o)return o(r,!0);if(n)return n(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var d=a[r]={exports:{}};e[r][0].call(d.exports,function(t){var a=e[r][1][t];return s(a?a:t)},d,d.exports,t,e,a,i)}return a[r].exports}for(var n="function"==typeof require&&require,r=0;r<i.length;r++)s(i[r]);return s}({1:[function(t,e,a){"use strict";function i(t){var e=Date.parse(t)-Date.parse(new Date),a=Math.floor(e/1e3%60);return{total:e,seconds:a}}function s(t,e){function a(){var t=i(e);if(n.innerHTML=("0"+t.seconds).slice(-2),t.total<=0&&clearInterval(r),1===t.seconds){var a=document.querySelector(".end-game");TweenLite.to(a,.5,{delay:.5,opacity:1,zIndex:15,ease:Power4.easeOut})}}var s=document.querySelector("#timer"),n=s.querySelector("#seconds");a();var r=setInterval(a,1e3)}var n=t("./Game"),r=(new n,new Date(Date.parse(new Date)+1296e6));s("timer-container",r)},{"./Game":2}],2:[function(t,e,a){"use strict";var i={},s=function(){this.canvas=document.querySelector("#game"),this.ctx=this.canvas.getContext("2d"),this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,addEventListener("keydown",function(t){i[t.keyCode]=!0},!1),addEventListener("keyup",function(t){delete i[t.keyCode]},!1),this.displayCollected=document.querySelector("#collection"),this.init(),window.addEventListener("resize",this._onResize.bind(this))};s.prototype.init=function(){this.drawBackground(),this.drawSanta(),this.drawGift(),this.dPad(),this.then=Date.now(),this.santaCharacter={speed:256},this.giftToGet={},this.giftsCollected=0,this.displayCollected.innerHTML=this.giftsCollected,this.santaCharacter.x=this.canvas.width/2,this.santaCharacter.y=this.canvas.height/2,this.setRandomGiftLocation(),this.animate();var t=document.querySelector(".end-game");TweenLite.to(t,.5,{delay:59,onStart:function(){document.querySelector("#finalScore").innerHTML=this.giftsCollected+" lost presents!"}.bind(this)})},s.prototype.drawBackground=function(){this.bgImage=new Image,this.bgImage.src="images/bg-ice-tile-x.jpg"},s.prototype.drawSanta=function(){this.santa=new Image,this.santaFlip=new Image,this.santa.src="images/santa-sleigh.png",this.santaFlip.src="images/santa-sleigh_flip.png"},s.prototype.drawGift=function(){this.gift=new Image,this.gift.src="images/gift.png"},s.prototype.setRandomGiftLocation=function(){this.giftToGet.x=32+Math.random()*(this.canvas.width-64),this.giftToGet.y=32+Math.random()*(this.canvas.height-64)},s.prototype.update=function(t){38 in i&&this.santaCharacter.y>=0&&(this.santaCharacter.y-=this.santaCharacter.speed*t),40 in i&&this.santaCharacter.y<=this.canvas.height-64&&(this.santaCharacter.y+=this.santaCharacter.speed*t),37 in i&&this.santaCharacter.x>=0&&(this.santaCharacter.x-=this.santaCharacter.speed*t,this.santa.src="images/santa-sleigh.png"),39 in i&&this.santaCharacter.x<=this.canvas.width-32&&(this.santaCharacter.x+=this.santaCharacter.speed*t,this.santa.src="images/santa-sleigh_flip.png"),this.santaCharacter.x<=this.giftToGet.x+32&&this.giftToGet.x<=this.santaCharacter.x+32&&this.santaCharacter.y<=this.giftToGet.y+32&&this.giftToGet.y<=this.santaCharacter.y+32&&this.giftsCollected>=0&&(this.giftsCollected++,this.displayCollected.innerHTML=this.giftsCollected,this.setRandomGiftLocation())},s.prototype.render=function(){var t=this.ctx.createPattern(this.bgImage,"repeat");this.ctx.fillStyle=t,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.drawImage(this.santa,this.santaCharacter.x,this.santaCharacter.y),this.ctx.drawImage(this.gift,this.giftToGet.x,this.giftToGet.y)},s.prototype.animate=function(){var t=Date.now(),e=t-this.then;this.update(e/1e3),this.render(),this.then=t,requestAnimationFrame(this.animate.bind(this))},s.prototype.dPad=function(){var t=document.querySelector("#top"),e=document.querySelector("#left"),a=document.querySelector("#right");document.querySelector("#down");t.addEventListener("mousedown",function(){this.santaCharacter.y>=0&&(this.santaCharacter.y-=.1*this.santaCharacter.speed)}.bind(this)),down.addEventListener("mousedown",function(){this.santaCharacter.y<=this.canvas.height-64&&(this.santaCharacter.y+=.1*this.santaCharacter.speed)}.bind(this)),e.addEventListener("mousedown",function(){this.santaCharacter.x>=0&&(this.santaCharacter.x-=.1*this.santaCharacter.speed,this.santa.src="images/santa-sleigh.png")}.bind(this)),a.addEventListener("mousedown",function(){this.santaCharacter.x<=this.canvas.width-32&&(this.santaCharacter.x+=.1*this.santaCharacter.speed,this.santa.src="images/santa-sleigh_flip.png")}.bind(this))},s.prototype._onResize=function(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight,this.init()},e.exports=s},{}]},{},[1]);