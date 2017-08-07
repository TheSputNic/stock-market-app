// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set chart options
var optionsIndex = {
	title: '99 Day Performance',
	legend: 'none',
	colors: ['#00ff48'],
	fontSize: 14,
	chartArea: {
		left: 00,
		top: 50,
		width: "100%"
	},
	titleTextStyle:
	{
		color: '#ffffff'
	},
	backgroundColor: '#262626',
	hAxis:
	{
		textPosition: 'none',
		format: 'currency',
		baselineColor: '#ffffff',
		gridlines: {
			count: 0
		}
	},
	vAxis:
	{
		baselineColor: '#ffffff',
		gridlines: {
			count: 0
		}
	}
};

var optionsHistory = {
	/*title: '',
	legend: 'none',
	fontSize: 14,
	chartArea: {
		left: 0,
		top: 0,
		width: "100%",
		height: "100%"
	},
	titleTextStyle:
	{
		color: '#ffffff'
	},
	backgroundColor: '#323232',
	hAxis:
	{
		textPosition: 'none',
		format: 'currency',
		baselineColor: '#000000',
		gridlines: {
			count: 0
		}
	},
	vAxis:
	{
		textPosition: 'none',
		baselineColor: '#000000',
		gridlines: {
			count: 0
		}
	}
};
*/
	legend: 'none',
	fontSize: 14,
	colors: ['#00FF48'],
	chartArea: {
		left: 50,
		top: 10,
		width: "100%",
		height: "85%"
	},
	backgroundColor: "#323232",
	hAxis: {
		textPosition: 'out',
		textStyle: {
			fontSize: 10,
			color: '#ffffff'
		},
		showTextEvery: 15
	},
	vAxis: {
		textStyle: {
			color: '#ffffff'
		},
		gridlines: {
			color: '#7F7F7F'
		}
	}
};

function drawChart() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	var parameters = {
		symbol: $('#symbol1').text()
	};
	$.getJSON(Flask.url_for('daily'), parameters)
	.done(function(data) {
		for(i = 99; i>=0; --i)
			dates.push(data[i]);
		table = new google.visualization.arrayToDataTable(dates);
		var chart = new google.visualization.LineChart(document.getElementById('stock-graph1'));
		function reDraw() {
			chart.draw(table, optionsIndex);
		}
		reDraw();
		$(window).resize(reDraw);
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});
}

function drawChart2() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	var parameters = {
		symbol: $('#symbol2').text()
	};
	$.getJSON(Flask.url_for('daily'), parameters)
	.done(function(data) {
		for(i = 99; i>=0; --i)
			dates.push(data[i]);
		table2 = new google.visualization.arrayToDataTable(dates);
		var chart2 = new google.visualization.LineChart(document.getElementById('stock-graph2'));
		function reDraw2() {
			chart2.draw(table2, optionsIndex);
		}
		reDraw2();
		$(window).resize(reDraw2);
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});
}

function drawChart3() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	var parameters = {
		symbol: $('#symbol3').text()
	};
	$.getJSON(Flask.url_for('daily'), parameters)
	.done(function(data) {
		for(i = 99; i>=0; --i)
			dates.push(data[i]);
		table3 = new google.visualization.arrayToDataTable(dates);
		var chart3 = new google.visualization.LineChart(document.getElementById('stock-graph3'));
		function reDraw3() {
			chart3.draw(table3, optionsIndex);
		}
		reDraw3();
		$(window).resize(reDraw3);
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});
}

function drawMinuteChart() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	for(i = 100; i>=1; --i)
		dates.push([$('#minute-date' + String(i)).text(), parseFloat($('#minute-close' + String(i)).text())]);
	minTable = new google.visualization.arrayToDataTable(dates);
	var minChart = new google.visualization.LineChart(document.getElementById('minute-graph'));
	function reDrawMinute() {
		setTimeout(function(){
			minChart.draw(minTable, optionsHistory);
		}, 200);
	}
	$(window).resize(reDrawMinute);
    $('#minTrigger').click(reDrawMinute);
}

function drawDayChart() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	for(i = 100; i>=1; --i)
		dates.push([$('#day-date' + String(i)).text(), parseFloat($('#day-close' + String(i)).text())]);
	dayTable = new google.visualization.arrayToDataTable(dates);
	var dayChart = new google.visualization.LineChart(document.getElementById('day-graph'));
	function reDrawDay() {
		setTimeout(function(){
			dayChart.draw(dayTable, optionsHistory);
		}, 200);
	}

	$(window).resize(reDrawDay);
    $('#dayTrigger').click(reDrawDay);
}

function drawWeekChart() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	for(i = 100; i>=1; --i)
		dates.push([$('#week-date' + String(i)).text(), parseFloat($('#week-close' + String(i)).text())]);
	weekTable = new google.visualization.arrayToDataTable(dates);
	var weekChart = new google.visualization.LineChart(document.getElementById('week-graph'));
	function reDrawWeek() {
		setTimeout(function(){
			weekChart.draw(weekTable, optionsHistory);
		}, 200);
	}
	$(window).resize(reDrawWeek);
    $('#weekTrigger').click(reDrawWeek);
}

function drawMonthChart() {
	// Create the data table.
	var dates = [["Date", "Price"]];
	for(i = 100; i>=1; --i)
		dates.push([$('#month-date' + String(i)).text(), parseFloat($('#month-close' + String(i)).text())]);
	monthTable = new google.visualization.arrayToDataTable(dates);
	var monthChart = new google.visualization.LineChart(document.getElementById('month-graph'));
	function reDrawMonth() {
		setTimeout(function(){
			monthChart.draw(monthTable, optionsHistory);
		}, 200);
	}
	$(window).resize(reDrawMonth);
    $('#monthTrigger').click(reDrawMonth);
}

function getCompanyInfo(name, out)
{
	var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + name + "&redirects&origin=*";
	$.getJSON(url)
	.done(function(data) {
		var info;
		for(var key in data["query"]["pages"]) {
				info = data["query"]["pages"][key]["extract"];
			}
			if (info == undefined)
			{
				name = name.replace(", Inc.", " ");
				getCompanyInfo(name, out);
			}
			out.html('"' + info +'"');
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});
}

/*
function getStockHistory(symbol)
{
	var url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + symbol + "&interval=1min&apikey=U62GJHH0AYS16H87";
	$.getJSON(url)
	.done(function(data) {
		for(var key in data["Time Series (Daily)"]) {
			$('#daily').append( '<tr> \
								<td> ' + key + '</td> \
								<td> ' + data["Time Series (Daily)"][key]["1. open"] + '</td> \
								<td> ' + data["Time Series (Daily)"][key]["2. high"] + '</td> \
								<td> ' + data["Time Series (Daily)"][key]["3. low"] + '</td> \
								<td> ' + data["Time Series (Daily)"][key]["4. close"] + '</td> \
								<td> ' + data["Time Series (Daily)"][key]["5. volume"] + '</td> \
								</tr>' );
		}
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});
}
*/

function getCompanyArticles()
{
	var parameters = {
		symbol: $("#symbol").text()
	};
	$.getJSON(Flask.url_for('articlesearch'), parameters)
	.done(function(data) {
		for(var i = 0; i<data.length; ++i)
		{
			$("#article-list").append("  <li class='article'><a href=" + data[i].link + ' target="_blank" class="blocklink"</a>' + data[i].title + "</li>");
		}
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});
}

function getDBInfo(i)
{
	var parameters = {
		symbol: $('#symbol'+ i.toString()).text()
	};
	$.getJSON(Flask.url_for("info"), parameters)
	.done(function(data) {
		$('#name'+ i.toString()).text(data[0]["Name"]);
		$("#ipoyear" + i.toString()).text(data[0]["IPOYear"]);
		$("#markcap" + i.toString()).text(data[0]["MarketCap"]);
		$("#sector" + i.toString()).text(data[0]["Sector"]);
		$("#industry" + i.toString()).text(data[0]["Industry"]);
		if (window.location.pathname == "/")
		{
			getCompanyInfo(data[0]["Name"], $('#info'+ i.toString()));
		}
	})
	.fail(function() {
		console.log(errorThrown.toString());
	});

}

$(function() //on document ready
{
	google.charts.setOnLoadCallback(function () {
		if (window.location.pathname == "/")
		{
			drawChart();
			drawChart2();
			drawChart3();
		}
		if (window.location.pathname == "/history")
		{
			drawMinuteChart();
			drawDayChart();
			drawWeekChart();
			drawMonthChart();
		}
	});

	if (window.location.pathname == "/")
	{
		for( var i=1; i<4; ++i)
		{
			getDBInfo(i);
		}
	}


	if (window.location.pathname == "/history")
	{
		getDBInfo("");
		getCompanyArticles();
		setTimeout(function(){
			$("#minTrigger").trigger('click');
		}, 100);
	}

	/*$("#search").keyup(function(e) {
		if (e.keyCode == 13) {
			var url = ('/history?symbol=' + ($("#search").val()));
			console.log(url);
			if (window.location != url) {
				window.location.href = url;
			}
		}
	});*/
});