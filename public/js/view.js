/**
 * The view Script sets up all the necessary view components
 * @author Dan Mestas, Mark Swafford
 * @date Spring 2011
 */

// This calls all the contained functions when the document is ready
// which means that the DOM tree has been loaded
var statusCheck;
var sensorCheck;
var globeCheck;
$(document).ready(function() { 
	 // Runs the jquery.clock script in order to fetch the date and time widgets for 
	 // all the pages which contain it
	$('.clock').jclock();
	//get all chart data
	setCharts();
	setThermCharts();
	sethistoryCharts([2001,9006,2003,9001,2003,9002,2004,9003,1002,2005,1003,2006,9004,2007,9005,2002,2008]);
	setSunCharts();
	setWaterCharts();
	drawFloorPlan();

  // Show splash screen
  setTimeout(function() { $('body').removeClass('startUp'); $('#landscape').removeClass('inactive'); }, 5000); //change stall time b4 live

  //Setup interval polling functions
  getRelayStates();
  statusCheck = setInterval('getRelayStates()', 3000); // Check once for relay states
  clearInterval(statusCheck);

  getGlobeStates();
  globeCheck = setInterval('getGlobeStates()', 3000); // check once for globe states
  clearInterval(globeCheck);

  getSensorData();
  sensorCheck = setInterval('getSensorData()', 5000);

  notificationsPoller()
  var notify = setInterval('notificationsPoller()', 20000);

});


