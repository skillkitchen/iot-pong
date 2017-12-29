/*
 * IOT Pong
 * by Skill Kitchen
 * http://www.skillkitchen.co/
 */

var Pong = function(){};

Pong.prototype.init = function($element) {
	this.$el = $element;

	console.log('Pong.js is ready');
};

// Init Pong.js
$(document).ready(function(){
	var myPongApp = new Pong( $('body') );
	myPongApp.init();
});