
Highcharts.setOptions({
   global: {
      useUTC: false
   }
});


var chart = [{},{},{},{}];
var setCharts = function() {
	var portalOptions = {
			title: {
				text: 'Net Power Draw vs Time'
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text: 'Watts'
				},
				minorGridLineWidth: 0, 
				gridLineWidth: 0.1,
				alternateGridColor: null,
			},
			tooltip: {
				backgroundColor: 'rgba(50,50,50,0.7)',
				style: {
         			color: '#FFF'
      			},
				borderWidth: 0,
				crosshairs: true,
				shadow: true,
				snap: 25,
				formatter: function() {
		                return ''+
						Highcharts.dateFormat('%e. %b %Y, %l:%M%P', this.x) +' '+ this.y +' Watts';
				}
			},
			colors: ['#d5d61d', '#1d90c6', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
			legend: 'null',
		    	credits: 'null',
			plotOptions: {
				areaspline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 4,
								lineWidth: 0.1
							}
						}	
					},
					pointStart: Date.UTC(2011, 4, 12, 0, 0, 0)
				}
			},
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		};

	for(i=1;i<5;i++) {
		var graphic = "graphic" + i;
		var logData = getNetEnergy(i);
		portalOptions.chart = {
				renderTo: graphic,
				defaultSeriesType: 'areaspline',
				backgroundColor: 'rgba(0,0,0,0)',
			}
		portalOptions.series = [{
				id: String(i),
				fillColor: {
				        linearGradient: [0, 0, 0, 270],
				        stops: [
				            [0, 'rgb(255, 246, 60)'],
				            [1, 'rgba(2,0,0,0)']
				        ]
		            	}
			}];
		chart[i] = new Highcharts.Chart(portalOptions);
	}
	
};

var thermChart = [{},{},{},{}];
var setThermCharts = function() {
	
	for(i=1;i<5;i++) {
		var graphic = "thermGraphic" + i;
		thermChart[i] = new Highcharts.Chart({
			chart: {
				renderTo: graphic,
				defaultSeriesType: 'areaspline',
				backgroundColor: 'rgba(0,0,0,0)',
			},
			title: {
				text: 'Indoor and Outdoor Temperature vs Time'
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text: 'Degrees Fahrenheit'
				},
				min: 0,
				minorGridLineWidth: 0, 
				gridLineWidth: 0.1,
				alternateGridColor: null,
			},
			tooltip: {
				backgroundColor: 'rgba(50,50,50,0.7)',
				style: {
         			color: '#FFF'
      			},
				borderWidth: 0,
				crosshairs: true,
				shadow: true,
				snap: 25,
				formatter: function() {
		                return ''+
						Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y +' degrees F';
				}
			},
			colors: ['#d5d61d', '#1d90c6', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
			legend: 'null',
		    credits: 'null',
			plotOptions: {
				areaspline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 4,
								lineWidth: 0.1
							}
						}	
					},
					pointInterval: 3600000, // one hour
					pointStart: Date.UTC(2011, 4, 12, 0, 0, 0)
				}
			},
			series: [{
				fillColor: {
		                linearGradient: [0, 0, 0, 200],
		                stops: [
		                    [0, 'rgb(255, 246, 60)'],
		                    [1, 'rgba(2,0,0,0)']
		                ]
		            },
				data: [4.3+i, 5.1+i, 4.3+i, 5.2+i, 5.4+i, 4.7+i, 3.5+i, 4.1+i, 5.6+i, 7.4+i, 6.9+i, 7.1+i, 
					7.9, 7.9, 7.5, 6.7, 7.7, 7.7, 7.4, 7.0, 7.1, 5.8, 5.9, 7.4+i, 
					8.2, 8.5, 9.4, 8.1, 10.9, 10.4, 10.9, 12.4, 12.1, 9.5, 7.5+i, 
					7.1, 7.5, 8.1, 6.8, 3.4, 2.1, 1.9, 2.8, 2.9, 1.3+i*2, 4.4, 4.2+i, 
					3.0, 3.0]
		
			}, {
				fillColor: {
		                linearGradient: [0, 0, 0, 350],
		                stops: [
		                    [0, 'rgb(2, 130, 191)'],
		                    [1, 'rgba(2,0,0,0)']
		                ]
		            },
				data: [0.0+i, 0.0+i, 0.0, 0.0+i, 0.0+i, 0.0+i, 0.0, 0.0, 0.1, 0.0, 0.3, 0.0, 
					0.0, 0.4+i, 0.0, 0.1, 0.0+i, 0.0+i, 0.0+i, 0.0, 0.0, 0.0, 0.0, 0.0, 
					0.0, 0.6, 1.2+i, 1.7+i, 0.7, 2.9, 4.1, 2.6, 3.7, 3.9, 1.7, 2.3, 
					3.0, 3.3, 4.8, 5.0+i, 4.8+i, 5.0+i*2, 3.2, 2.0, 0.9, 0.4+i*3, 0.3, 0.5, 0.4]
			}]
			,
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		});
	}
	
};

var historyChart = [{},{},{},{}];
var sethistoryCharts = function(devices) {
	
	var portalOptions = {
		title: {
			text: 'Power vs Time'
		},
		xAxis: {
			type: 'datetime'
		},
		yAxis: {
			title: {
				text: 'Watts'
			},
			minorGridLineWidth: 0, 
			gridLineWidth: 0.1,
			alternateGridColor: null,
		},
		tooltip: {
			backgroundColor: 'rgba(50,50,50,0.7)',
			style: {
 			color: '#FFF'
		},
			borderWidth: 0,
			crosshairs: true,
			shadow: true,
			snap: 25,
			formatter: function() {
	                return ''+
					Highcharts.dateFormat('%e. %b %Y, %l:%M%P', this.x) +' '+ this.y +' Watts';
			}
		},
		colors: ['#d5d61d', '#1d90c6', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
		legend: 'null',
	    	credits: 'null',
		plotOptions: {
			areaspline: {
				lineWidth: 3,
				states: {
					hover: {
						lineWidth: 3
					}
				},
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true,
							symbol: 'circle',
							radius: 4,
							lineWidth: 0.1
						}
					}	
				},
				pointStart: Date.UTC(2011, 4, 12, 0, 0, 0)
			}
		},
		navigation: {
			menuItemStyle: {
				fontSize: '10px'

			}
		}
	};

	for(i=1;i<5;i++) {
		var graphic = "historyGraphic" + i;
		var logData = getGraph(i, historyChart, devices);
		portalOptions.chart = {
				renderTo: graphic,
				defaultSeriesType: 'areaspline',
				backgroundColor: 'rgba(0,0,0,0)',
			}
		portalOptions.series = [{
				id: String(i),
				fillColor: {
					linearGradient: [0, 0, 0, 270],
					stops: [
					    [0, 'rgb(255, 246, 60)'],
					    [1, 'rgba(2,0,0,0)']
					]
			    	}
			}];
		historyChart[i] = new Highcharts.Chart(portalOptions);
	}

};

var sunChart = [{},{},{},{}];
var setSunCharts = function() {
	var portalOptions = {
			title: {
				text: 'Power Usage and Production vs Time'
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text: 'Watts'
				},
				minorGridLineWidth: 0, 
				gridLineWidth: 0.1,
				alternateGridColor: null,
			},
			tooltip: {
				backgroundColor: 'rgba(50,50,50,0.7)',
				style: {
         			color: '#FFF'
      			},
				borderWidth: 0,
				crosshairs: true,
				shadow: true,
				snap: 25,
				formatter: function() {
		                return ''+
						Highcharts.dateFormat('%e. %b %Y, %l:%M%P', this.x) +' '+ this.y +' Watts';
				}
			},
			colors: ['#d5d61d', '#1d90c6', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
			legend: 'null',
		    	credits: 'null',
			plotOptions: {
				areaspline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 4,
								lineWidth: 0.1
							}
						}	
					},
					pointStart: Date.UTC(2011, 4, 12, 0, 0, 0)
				}
			},
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		};

	for(i=1;i<5;i++) {
		var graphic = "sunGraphic" + i;
		var logData = getConGraph(i);
		var logData2 = getProGraph(i);
		portalOptions.chart = {
				renderTo: graphic,

				defaultSeriesType: 'areaspline',
				backgroundColor: 'rgba(0,0,0,0)',
			}
		portalOptions.series = [{
				id: String(i),
				fillColor: {
				        linearGradient: [0, 0, 0, 270],
				        stops: [
				            [0, 'rgb(255, 246, 60)'],
				            [1, 'rgba(2,0,0,0)']
				        ]
		            	}},
				{
				id: String(i+1),
				fillColor: {
				        linearGradient: [0, 0, 0, 270],
				        stops: [
				            [0, 'rgb(2, 130, 191)'],
		                    	    [1, 'rgba(2,0,0,0)']
				        ]
		            	}
			}];
		sunChart[i] = new Highcharts.Chart(portalOptions);
	}
	
};

var waterChart = [{},{},{},{}];
var setWaterCharts = function() {
	
	for(i=1;i<5;i++) {
		var graphic = "waterGraphic" + i;
		thermChart[i] = new Highcharts.Chart({
			chart: {
				renderTo: graphic,
				defaultSeriesType: 'areaspline',
				backgroundColor: 'rgba(0,0,0,0)',
			},
			title: {
				text: 'Water Consumption vs Time'
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text: 'Gallons'
				},
				min: 0,
				minorGridLineWidth: 0, 
				gridLineWidth: 0.1,
				alternateGridColor: null,
			},
			tooltip: {
				backgroundColor: 'rgba(50,50,50,0.7)',
				style: {
         			color: '#FFF'
      			},
				borderWidth: 0,
				crosshairs: true,
				shadow: true,
				snap: 25,
				formatter: function() {
		                return ''+
						Highcharts.dateFormat('%e. %b %Y, %H:00', this.x) +': '+ this.y +' Gallons';
				}
			},
			colors: ['#d5d61d', '#1d90c6', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
			legend: 'null',
		    credits: 'null',
			plotOptions: {
				areaspline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 4,
								lineWidth: 0.1
							}
						}	
					},
					pointInterval: 3600000, // one hour
					pointStart: Date.UTC(2011, 4, 12, 0, 0, 0)
				}
			},
			series: [{
				fillColor: {
		                linearGradient: [0, 0, 0, 200],
		                stops: [
		                    [0, 'rgb(255, 246, 60)'],
		                    [1, 'rgba(2,0,0,0)']
		                ]
		            },
				data: [4.3+i, 5.1+i, 4.3+i, 5.2+i, 5.4+i, 4.7+i, 3.5+i, 4.1+i, 5.6+i, 7.4+i, 6.9+i, 7.1+i, 
					7.9, 7.9, 7.5, 6.7, 7.7, 7.7, 7.4, 7.0, 7.1, 5.8, 5.9, 7.4+i, 
					8.2, 8.5, 9.4, 8.1, 10.9, 10.4, 10.9, 12.4, 12.1, 9.5, 7.5+i, 
					7.1, 7.5, 8.1, 6.8, 3.4, 2.1, 1.9, 2.8, 2.9, 1.3+i*2, 4.4, 4.2+i, 
					3.0, 3.0]
		
			}]
			,
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		});
	}
	
};
