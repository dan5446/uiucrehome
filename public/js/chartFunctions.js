
var getNetEnergy = function(i){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':false, 'net':true, 'devices':[], 'period':i };
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Net Power Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			//console.log(data);
			retObj = JSON.parse(data);
			chart[i].options.plotOptions.areaspline.pointStart = retObj.start;
			chart[i].get(String(i)).setData(retObj.data);
			//console.log(chart[i]);
		}
	});
};

var getConGraph = function(i){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':true, 'net':false, 'devices':[], 'period': i };
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Consumed Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			//console.log(data);
			retObj = JSON.parse(data);
			sunChart[i].options.plotOptions.areaspline.pointStart = retObj.start;
			sunChart[i].get(String(i)).setData(retObj.data);
			//console.log(chart[i]);
		}
	});
};

var getProGraph = function(i){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':false, 'net':false, 'devices':[8003], 'period':i};
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Produced Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			//console.log(data);
			retObj = JSON.parse(data);
			sunChart[i].get(String(i+1)).setData(retObj.data);
			//console.log(sunChart[i]);
		}
	});
};

var getGraph = function(i, targetChart, devices){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':false, 'net':false, 'devices':devices, 'period':i};
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching History Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			//console.log(data);
			retObj = JSON.parse(data);
			targetChart[i].get(String(i)).setData(retObj.data);
			//console.log(targetChart[i]);
		}
	});
};

var getStats = function(devices){
	var chartData = {'latest':0,'day':0,'week':0};
	var args = { 'devices':devices };
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Room Stats');
	$.ajax({
		url: "/ajax/powerStats.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			console.log(data);
			retObj = JSON.parse(data);
			$('#currentUsage').html(retObj.latest);
			$('#todayUsage').html(retObj.day);
			$('#weekUsage').html(retObj.week);
			Cufon.replace('h3', { fontFamily: 'Thin' }); 
		}
	});
};
