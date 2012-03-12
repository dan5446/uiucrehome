var getNetEnergy = function(i){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':false, 'net':true, 'devices':[], 'period':i};
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Net Power Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			console.log(data);
			retObj = JSON.parse(data);
			chart[i].options.plotOptions.areaspline.pointStart = retObj.start;
			chart[i].get(String(i)).setData(retObj.data);
			//console.log(chart[i]);
		}
	});
};

var getConGraph = function(i){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':true, 'net':false, 'devices':[], 'period':i};
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Consumed Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			console.log(data);
			retObj = JSON.parse(data);
			sunChart[i].options.plotOptions.areaspline.pointStart = retObj.start;
			sunChart[i].get(String(i)).setData(retObj.data);
			//console.log(chart[i]);
		}
	});
};


var getProGraph = function(i){
	var chartData = {'data':[],'start':Date.UTC(1970, 4, 12, 0, 0, 0)};
	var args = { 'all':false, 'net':true, 'devices':[], 'period':i};
	var argString = JSON.stringify(args);
	var retObj;
	console.log('Fetching Net Power Data');
	$.ajax({
		url: "/ajax/powerData.php",
		data: {'arguments': argString},
		type: "POST",
		success: function(data) {
			console.log(data);
			retObj = JSON.parse(data);
			chart[i].options.plotOptions.areaspline.pointStart = retObj.start;
			chart[i].get(String(i)).setData(retObj.data);
			//console.log(chart[i]);
		}
	});
};
