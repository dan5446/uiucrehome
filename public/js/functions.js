var CERVON = true;
var floorplanStatus = [0,0,0,0,0,0,0,0,0,0,0,0];
var deviceList = ['#d0001', '#d0002', '#d0003', '#d0004', '#d0005', '#d0006', '#d0007', '#d0008', '#d0009', '#d0010', '#d0011', '#d0012'];
var getRelayStates = function() {
	//make ajax call recieve an array of states for all of the devices to show on the monitor page
	// btw this function oinly fetches light info from the can2go needs refactoring
	var status = JSON.stringify(floorplanStatus);
	//console.log('Fetching Relay States');
	$.ajax({
		url: "/ajax/floorplanStatus.php",
		data: {'status': status},
		type: "POST",
		success: function(data) {
			if ( data != JSON.stringify(floorplanStatus) ) {
				//console.log(data);
				floorplanStatus = JSON.parse(data);
				for (i = 0; i < 12; i++) {
					if( floorplanStatus[i] == 0 ) {
						$(deviceList[i]).removeClass('inUse');
						$(deviceList[i]).addClass('off');
					}
					else {
						$(deviceList[i]).addClass('inUse');
						$(deviceList[i]).removeClass('off');
					}
				}
				//alert('new Status: ' + floorplanStatus);
			}

		}
	});
};

var globeList = {'#d0000':0, '#d0013':0, '#d0014':0, '#d0015':0, '#d0016':0, '#d0017':0, '#d0018':0, '#d0019':0, '#d0020':0, '#d0021':0, '#d0022':0, '#d0023':0, '#d0024':0};	
var getGlobeStates = function() {
	var status = JSON.stringify(globeList);
	var phantomThreshold = 0.050;
	console.log('Fetching Globe States');
	$.ajax({
		url: "/ajax/globeStatus.php",
		data: {'status': status},
		type: "POST",
		success: function(data) {
			if ( data != JSON.stringify(globeList) ) {
				//console.log(data);
				globeList = JSON.parse(data);
				for( var key in globeList ) {	
					if ( globeList.hasOwnProperty(key) ) {
						//console.log(key);
						//console.log(parseFloat(globeList[key]).toFixed(3));
						if(parseFloat(globeList[key]).toFixed(3) <= 0.001) {
							$(key).removeClass('inUse');
							$(key).removeClass('phantom');
							$(key).addClass('off');
						}
						else if(parseFloat(globeList[key]).toFixed(3) > phantomThreshold) {
							$(key).removeClass('off');
							$(key).removeClass('phantom');
							$(key).addClass('inUse');
						}
						else {
							$(key).removeClass('off');
							$(key).removeClass('inUse');
							$(key).addClass('phantom');						
						}
					}
				}

			}

		}
	});
};

var findTempIndicator = function(value) {
	var position = ((parseFloat(value)+10) / 6);
	position = position.toFixed(0);
	var retVal = 100 + ((27 + 4)*parseFloat(position));
	if( retVal < 102 ) retVal = 102;
	if( retVal > 689) retVal = 689;
	return retVal;
};

var sensorData = {'z1t':0, 'z2t':0, 'z1h':0, 'z2h':0, 'cd1':0, 'cd2':0, 'ost':0, 'osh':0, 'hwt':0, 'vrm':0, 'chm':0};
var getSensorData = function() {
	var dataS = JSON.stringify(sensorData);
	//console.log('Fetching Sensor Data');
	$.ajax({
		url: "/ajax/sensorData.php",
		data: {'status': dataS},
		type: "POST",
		success: function(data) {
			if ( data != JSON.stringify(sensorData) ) {
				//console.log(data);
				sensorData = JSON.parse(data);
				var inHum = (parseFloat(sensorData.z1h) + parseFloat(sensorData.z2h))/2;
				inHum = String(inHum.toFixed(0));
				//console.log('Inside Humidity: ' + inHum);
				var inTemp = (parseFloat(sensorData.z1t) + parseFloat(sensorData.z2t))/2;
				if(inTemp > 100) inTemp = 99.0;
				var inIndicatorLeft = findTempIndicator(inTemp);
				inTemp = String(inTemp.toFixed(0));
				var carbon = (parseFloat(sensorData.cd1) + parseFloat(sensorData.cd2))/2;
				carbon = String(carbon.toFixed(0));
				//console.log('CO2: ' + carbon);
				var outTemp = parseFloat(sensorData.ost).toFixed(0);
				var outIndicatorLeft = findTempIndicator(outTemp);
				outTemp = String(outTemp);
				//console.log('Outside Temp: ' + outTemp);
				var outHum = String(parseFloat(sensorData.osh).toFixed(0));
				//console.log('Outside Humidity: ' + outHum);
				$('.ist').html(inTemp);
				$('.ost').html(outTemp);
				$('.ish').html(inHum);
				$('.osh').html(outHum);
				$('.co2').html(carbon);
				$('#insideIndicator').css('margin-left', inIndicatorLeft);
				$('#outsideIndicator').css('margin-left', outIndicatorLeft);
				Cufon.replace('h2', { fontFamily: 'Helvetica Neue Time' }); // Font Replacement: update the replacement at every refresh
				if(!CERVON){
					$('#ventRecirc').html(' ');
					$('#coolHeat').html('  ');
					$('#stby').html('Standby');
				}
				else {
					//console.log(sensorData.chm);
					var recirc = parseFloat(sensorData.vrm);
					var heat = parseFloat(sensorData.chm);
					(recirc > 0) ? $('#ventRecirc').html('Recirc') : $('#ventRecirc').html('Venting');
					if(heat > 0){ 
						$('#coolHeat').html('Heating'); 
						$('#coolHeat').removeClass('ventGradient');
						$('#coolHeat').addClass('heatGradient');
					}
					else {
						$('#coolHeat').html('Cooling');
						$('#coolHeat').removeClass('heatGradient');
						$('#coolHeat').addClass('ventGradient');
					}
					$('#stby').html(' & ');			
				}
				Cufon.replace('h4', { fontFamily: 'Helvetica Neue CN' }); // Font Replacement: update the replacement at every refresh
				Cufon.replace('h3', { fontFamily: 'Thin' }); // Font Replacement: update the replacement at every refresh
			}

		}
	});
};

var notifications = new Array();
var notifyList;
var notificationsPoller = function() {
	//make ajax call recieve an array of notification messages to display to the user for at least 20 seconds
	//console.log('Fetching Notifications');
	$.ajax({
		url: "/ajax/notify.php",
		type: "POST",
		success: function(data) {
			notifyList = eval(''+ data +'');
			var init = 0;
			for(var i=0; i < notifyList.length; i++) {
				for(var j = 0; j < notifications.length; j++) {
					if(notifyList[i] == notifications[j]) {
						init = 1;
					} 
				}
				if(init == 0) {
					$('#notify').removeClass('inactive');
					break;
				}
			}
			notifications = notifyList;
			//update notifications pane			
			var open = '<ul><li><div class="alert floatLeft"></div><h2>';
			var close = '</h2></li></ul>';
			$("#wrapper").html("");

			var line = "";
			for(var i=0; i < notifications.length; i++) {
				//console.log(notifications[i]);
				line = line + open + notifications[i] + close + "\n";
			}
			$("#wrapper").html(line);
			Cufon.replace('h2', { fontFamily: 'Helvetica Neue Time' }); // Font Replacement: update the replacement at every refresh
		}
	});

};

var CERVManualMode = false;
var setCERV = function(commandNum, value) {
	console.log('Setting CERV Controls: ' + String(commandNum) + " : " + String(value));
	value = parseFloat(value);
	if (isNaN(value)) {
		alert('Enter a numeric value');
		return;
	}
	var returnMessage = '';
	if(commandNum == 1) {
		// show updating process somehow
		returnMessage = 'Status Has Been Updated'
	}
	else if(commandNum < 4) {
		if (value < 0 || value > 160) {
			alert('Enter a value between 0 and 160 hz');
			return;
		}
		else {
			if( commandNum == 2 ) returnMessage = 'Frequency 1 Set to ' + value;
			else returnMessage = 'Frequency 2 Set to ' + value; 
		}
	}
	else if(commandNum < 8) {
		if(commandNum == 4) {
			if($('#v').hasClass('chosen')) { 
				value = 1;
			}
			if(value) returnMessage = 'Vent Mode Set';
			else returnMessage = 'Recirculate Mode Set';
		}
		else if(commandNum == 5) {
			if($('#c').hasClass('chosen')) { 
				value = 1;
			}
			if(value) returnMessage = 'Cool Mode Set';
			else returnMessage = 'Heat Mode Set';
		}
		else if(commandNum == 6) {
			if($('#on1').hasClass('chosen')) { 
				value = 1;
			}
			if(value) returnMessage = 'Blower 1 Set On';
			else returnMessage = 'Blower 1 Set Off';
		}
		else {
			if($('#on2').hasClass('chosen')) { 
				value = 1;
			}
			if(value) returnMessage = 'Blower 2 Set On';
			else returnMessage = 'Blower 2 Set Off';
		}
	}
	else if(commandNum < 9) {
	//set point
	}
	else if(commandNum == 9) {
		if(CERVManualMode == true) {
			CERVManualMode = false;
			$('.disablable').attr('disabled', 'disabled');
			returnMessage = 'Automatic Mode Set';
			value = 1;
		}
		else {	
			CERVManualMode = true;
			$('.disablable').attr('disabled', '');
			returnMessage = 'Manual Mode Set';
			updateCERVStatus();
			value = 0;
		}
	}
	else if(commandNum == 10) {
	// update view
	}
	else if(commandNum == 11) {
	//update view
	}
	else if(commandNum == 12) {
	//update view
	}
	else if(commandNum == 13) {
	//update view
	}
	else {
		return;
	}
	$.ajax({
		url: "/ajax/CERV.php",
		data: { 'command': commandNum.toString(), 'value': value.toString() },
		type: "POST",
		success: function(data) {
			//console.log(data);
			if(data.replace(/\n/g,'') != 'Success') {
				returnMessage = data.replace(/\n/g,''); 
			}
			else if(commandNum == 9 && CERVManualMode == false) CERVManualMode == true;
			else if(commandNum == 9 && CERVManualMode == true) CERVManualMode == false;
			if(commandNum == 1) updateCERVStatus();
			$('#CERVMessage').html('<h3>'+returnMessage+'</h3>');
			Cufon.replace('h3', {fontFamily: 'Thin'});
		}
	});
	
};

var updateCERVStatus = function() {
	$.ajax({
		url: "/ajax/getCERV.php",
		type: "POST",
		success: function(data) {
			var statusList = JSON.parse(data);
			for (var key in statusList) {
				if(key == 'vrm' && statusList.hasOwnProperty(key)) {
					if(statusList[key] == '0') {
						$('#vrm').html('V');
						$('#v').addClass('chosen');
						$('#r').removeClass('chosen');
					}
					else {
						$('#vrm').html('R');
						$('#r').addClass('chosen');
						$('#v').removeClass('chosen');
					}
				}
				else if(key == 'chm' && statusList.hasOwnProperty(key)) {
					if(statusList[key] == '0') {
						$('#chm').html('C');
						$('#c').addClass('chosen');
						$('#h').removeClass('chosen');
					}
					else {
						$('#chm').html('H');
						$('#h').addClass('chosen');
						$('#c').removeClass('chosen');
					}
				}
				else if(key == 'blr' && statusList.hasOwnProperty(key)) {
					if(statusList[key] == '0') {
						$('#blr').html('off/off');
						$('#off1').addClass('chosen');
						$('#on1').removeClass('chosen');
						$('#off2').addClass('chosen');
						$('#on2').removeClass('chosen');
					}
					else if(statusList[key] == '1') {
						$('#blr').html('on/off');
						$('#on1').addClass('chosen');
						$('#off1').removeClass('chosen');
						$('#off2').addClass('chosen');
						$('#on2').removeClass('chosen');
					}
					else if(statusList[key] == '2') {
						$('#blr').html('off/on');
						$('#off1').addClass('chosen');
						$('#on1').removeClass('chosen');
						$('#on2').addClass('chosen');
						$('#off2').removeClass('chosen');
					}
					else {
						$('#blr').html('on/on');
						$('#on1').addClass('chosen');
						$('#off1').removeClass('chosen');
						$('#on2').addClass('chosen');
						$('#off2').removeClass('chosen');
					}
				}
  				else if(statusList.hasOwnProperty(key)) {
					if(!isNaN(statusList[key]))
						statusList[key] = parseFloat(statusList[key]).toFixed(0);
    					$('#'+key).html(statusList[key]);
				}
  			}
			$('.textIn').val('');
			Cufon.replace('h2', {fontFamily: 'Helvetica Neue Time'});
		}
	});
};

var findPIndicator = function(value) {
	var position = value / .35;
	position = position.toFixed(0) - 1;
	var retVal = 100 + ((27 + 4)*position);
	if( retVal < 102 ) retVal = 102;
	if( retVal > 689) retVal = 689;
	return retVal;
};

var solarData = { 'surplus':true, 'production':0, 'consumption':0, 'plh':0, 'pld':0, 'plw':0, 'clh':0, 'cld':0, 'clw':0, 'net':0}
var getSolarStats = function() {
	var dataS = JSON.stringify(solarData);
	console.log('Fetching Solar Data');
	$.ajax({
		url: "/ajax/solarData.php",
		data: {'status': dataS},
		type: "POST",
		success: function(data) {
			if ( data != JSON.stringify(solarData) ) {
				console.log(data);
				solarData = JSON.parse(data);
				if(solarData.surplus) {
					$('.solarStatus').removeClass('heatGradient');
					$('.solarStatus').addClass('sunGradient');
					$('.solarStatus').html('Generating Surplus');
				}
				else {
					$('.solarStatus').removeClass('sunGradient');
					$('.solarStatus').addClass('heatGradient');
					$('.solarStatus').html('Consuming Deficit');
				}
				Cufon.replace('h3', { fontFamily: 'Thin' }); // Font Replacement: update the replacement at every refresh
				if(solarData.plh < 1) {//set Watts`
					$('.plh').html(solarData.plh*1000);
					$('#plhu').html('Wh');
				} else { 
					$('.plh').html(solarData.plh);
					$('#plhu').html('kWh');
				}
				if(solarData.pld < 1) {//set Watts
					$('.pld').html(solarData.pld*1000);
					$('#pldu').html('Wh');
				} else { 
					$('.pld').html(solarData.pld);
					$('#pldu').html('kWh');
				}
				if(solarData.plw < 1) {//set Watts
					$('.plw').html(solarData.plw*1000);
					$('#plwu').html('Wh');
				} else { 
					$('.plw').html(solarData.plw);
					$('#plwu').html('kWh');
				}
				if(solarData.clh < 1) {//set Watts
					$('.clh').html(solarData.clh*1000);
					$('#clhu').html('Wh');
				} else { 
					$('.clh').html(solarData.clh);
					$('#clhu').html('kWh');
				} 
				if(solarData.cld < 1) {//set Watts
					$('.cld').html(solarData.clh*1000);
					$('#cldu').html('Wh');
				} else { 
					$('.cld').html(solarData.cld);
					$('#cldu').html('kWh');
				}
				if(solarData.clw < 1) {//set Watts
					$('.clw').html(solarData.clw*1000);
					$('#clwu').html('Wh');
				} else { 
					$('.clw').html(solarData.clw);
					$('#clwu').html('kWh');
				}

				var inIndicatorLeft = findPIndicator(solarData.production);
				solarData.production /= 1000;
				solarData.consumption /= 1000;
				$('#currentProduction').html(solarData.production.toFixed(2));
				$('#currentConsumption').html(solarData.consumption.toFixed(2));
				$('.netEnergy').html(solarData.net.toFixed(2));
        $('#netUnits').html('kWh Consumed');
				Cufon.replace('h3', { fontFamily: 'Thin' }); 
				$('#insideIndicatorP').css('margin-left', inIndicatorLeft);
			}

		}
	});
};
