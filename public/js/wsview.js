/**
 * This Script sets up all the necessary widescreen components
 * @author Dan Mestas
 * @date Summer 2011
 */

var current;
var CurrentNum;

var displayClicks = function() {
	current = $('.radialGlow').attr('id');
	$('#'+current).addClass('noGlow');
	$('#'+current).removeClass('radialGlow');
	currentNum = parseInt(current.substr(5, current.length));
	if(currentNum > 11) $('#'+current).addClass('noGlowLeft');
	else $('#'+current).addClass('noGlowRight');
	currentNum += 1;
	if(currentNum > 23) currentNum = 0;
	$('#click'+currentNum).removeClass('noGlow');
	$('#click'+currentNum).removeClass('noGlowRight');
	$('#click'+currentNum).removeClass('noGlowLeft');
	$('#click'+currentNum).addClass('radialGlow');
	
};


var statusCheck;
$(document).ready(function() { 

  $('.clock').jclock();
  statusCheck = setInterval('displayClicks()', 150);

  var notify = setInterval('notificationsPoller()', 2000);
  var sensorCheck = setInterval('getSolarStats()', 2000);
  var solarCheck = setInterval('getSensorData()', 4000);;

});


