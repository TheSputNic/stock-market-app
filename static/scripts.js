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
		baselineColor: '#262626',
		gridlines: {
			count: 0
		}
	},
	vAxis:
	{
		baselineColor: '#262626',
		gridlines: {
			count: 0
		}
	}
};

var optionsHistory = {
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

var optionsTechnical = {
	legend: 'none',
	fontSize: 14,
	height: 500,
	colors: ['#00FF48', '#FF3333', '#FFFF66'],
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

var optionsSearch = {
	legend: 'none',
	fontSize: 14,
	colors: ['#00FF48'],
	chartArea: {
		left: 50,
		top: 10,
		width: "100%",
		height: "85%"
	},
	backgroundColor: "#262626",
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

function drawChart(k, options) {
	// Create the data table.
	var dates = [["Date", "Price"]];
	var parameters = {
		symbol: $('#symbol'+k).text()
	};
	$.getJSON(Flask.url_for('daily'), parameters)
	.done(function(data) {
		if (data != "Error" && data.length > 1 ) {
			for(i = data.length-1; i>=0; --i)
				dates.push(data[i]);
			table = new google.visualization.arrayToDataTable(dates);

			var chart = new google.visualization.LineChart(document.getElementById('stock-graph'+k));
			chart.draw(table, options);
		}
		else {
			$("#stock-graph"+k).html("<span>No graph data available</span>");
		}
	});
}

function drawMinuteChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("table", {timeframe:"INTRADAY"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var minTable = new google.visualization.DataTable();
			minTable.addColumn('string', 'Date');
			minTable.addColumn('number', 'Price');
			var minChart = new google.visualization.LineChart(document.getElementById('minute-graph'));
			minChart.draw(minTable, optionsHistory);
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=0; i<99; ++i) {
				minTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["4. close"])]);
				if (i == 98) {
					setTimeout(function(){
						$("#intradayTrigger").trigger('click');
					}, 100);
				}
			}

			function reDrawMinute() {
				setTimeout(function(){
					minChart.draw(minTable, optionsHistory);
				}, 200);
			}
			$(window).resize(reDrawMinute);
		    $('#intradayTrigger').click(reDrawMinute);
		}
		else {
			$("#minute-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawDayChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("table", {timeframe:"DAILY"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var dayTable = new google.visualization.DataTable();
			dayTable.addColumn('string', 'Date');
			dayTable.addColumn('number', 'Price');
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			if (arr.length>99) {
				start = arr.length-99;
				limit = arr.length;
			}
			else {
				start = 0;
				limit = arr.length;
			}
			for (var i=start; i<limit; ++i) {
				dayTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["4. close"])]);
			}
			var dayChart = new google.visualization.LineChart(document.getElementById('daily-graph'));
			function reDrawDay() {
				setTimeout(function(){
					dayChart.draw(dayTable, optionsHistory);
				}, 200);
			}
			$(window).resize(reDrawDay);
		    $('#dailyTrigger').click(reDrawDay);
		}
		else {
			$("#daily-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawWeekChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("table", {timeframe:"WEEKLY"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var weekTable = new google.visualization.DataTable();
			weekTable.addColumn('string', 'Date');
			weekTable.addColumn('number', 'Price');
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			if (arr.length>99) {
				start = arr.length-99;
				limit = arr.length;
			}
			else {
				start = 0;
				limit = arr.length;
			}
			for (var i=start; i<limit; ++i) {
				weekTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["4. close"])]);
			}
			var weekChart = new google.visualization.LineChart(document.getElementById('week-graph'));
			function reDrawWeek() {
				setTimeout(function(){
					weekChart.draw(weekTable, optionsHistory);
				}, 200);
			}
			$(window).resize(reDrawWeek);
		    $('#weeklyTrigger').click(reDrawWeek);
		}
		else {
			$("#week-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawMonthChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("table", {timeframe:"MONTHLY"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var monthTable = new google.visualization.DataTable();
			monthTable.addColumn('string', 'Date');
			monthTable.addColumn('number', 'Price');
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			if (arr.length>99) {
				start = arr.length-99;
				limit = arr.length;
			}
			else {
				start = 0;
				limit = arr.length;
			}
			for (var i=start; i<limit; ++i) {
				monthTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["4. close"])]);
			}
			var monthChart = new google.visualization.LineChart(document.getElementById('month-graph'));
			function reDrawMonth() {
				setTimeout(function(){
					monthChart.draw(monthTable, optionsHistory);
				}, 200);
			}
			$(window).resize(reDrawMonth);
		    $('#monthlyTrigger').click(reDrawMonth);
		}
		else {
			$("#month-graph").html("<span>No graph data available</span>");
		}
	});

}

function drawSMAChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"SMA"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var smaTable = new google.visualization.DataTable();
			smaTable.addColumn('string', 'Date');
			smaTable.addColumn('number', 'Price');
			var smaChart = new google.visualization.LineChart(document.getElementById('SMA-graph'));
			smaChart.draw(smaTable, optionsTechnical);
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				smaTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["SMA"])]);
				if (i == arr.length-1) {
					setTimeout(function(){
						$("#SMATrigger").trigger('click');
					}, 100);
				}
			}

			function reDrawSMA() {
				setTimeout(function(){
					smaChart.draw(smaTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawSMA);
		    $('#SMATrigger').click(reDrawSMA);
		}
		else {
			$("#SMA-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawMACDChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"MACD"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var macdTable = new google.visualization.DataTable();
			macdTable.addColumn('string', 'Date');
			macdTable.addColumn('number', 'MACD');
			macdTable.addColumn('number', 'MACD Hist');
			macdTable.addColumn('number', 'MACD MACD Signal');
			var macdChart = new google.visualization.LineChart(document.getElementById('MACD-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				macdTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["MACD"]), parseFloat(data[tableName][arr[i]]["MACD_Hist"]), parseFloat(data[tableName][arr[i]]["MACD_Signal"])]);
			}
			function reDrawMACD() {
				setTimeout(function(){
					macdChart.draw(macdTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawMACD);
		    $('#MACDTrigger').click(reDrawMACD);
		}
		else {
			$("#MACD-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawSTOCHChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"STOCH"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var stochTable = new google.visualization.DataTable();
			stochTable.addColumn('string', 'Date');
			stochTable.addColumn('number', 'SlowD');
			stochTable.addColumn('number', 'SlowK');
			var stochChart = new google.visualization.LineChart(document.getElementById('STOCH-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				stochTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["SlowD"]), parseFloat(data[tableName][arr[i]]["SlowK"])]);
			}
			function reDrawSTOCH() {
				setTimeout(function(){
					stochChart.draw(stochTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawSTOCH);
		    $('#STOCHTrigger').click(reDrawSTOCH);
		}
		else {
			$("#STOCH-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawRSIChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"RSI"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var rsiTable = new google.visualization.DataTable();
			rsiTable.addColumn('string', 'Date');
			rsiTable.addColumn('number', 'RSI');
			var rsiChart = new google.visualization.LineChart(document.getElementById('RSI-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				rsiTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["RSI"])]);
			}
			function reDrawRSI() {
				setTimeout(function(){
					rsiChart.draw(rsiTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawRSI);
		    $('#RSITrigger').click(reDrawRSI);
		}
		else {
			$("#RSI-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawADXChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"ADX"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var adxTable = new google.visualization.DataTable();
			adxTable.addColumn('string', 'Date');
			adxTable.addColumn('number', 'ADX');
			var adxChart = new google.visualization.LineChart(document.getElementById('ADX-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				adxTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["ADX"])]);
			}
			function reDrawADX() {
				setTimeout(function(){
					adxChart.draw(adxTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawADX);
		    $('#ADXTrigger').click(reDrawADX);
		}
		else {
			$("#ADX-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawCCIChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"CCI"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var cciTable = new google.visualization.DataTable();
			cciTable.addColumn('string', 'Date');
			cciTable.addColumn('number', 'CCI');
			var cciChart = new google.visualization.LineChart(document.getElementById('CCI-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				cciTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["CCI"])]);
			}
			function reDrawCCI() {
				setTimeout(function(){
					cciChart.draw(cciTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawCCI);
		    $('#CCITrigger').click(reDrawCCI);
		}
		else {
			$("#CCI-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawAROONChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"AROON"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var aroonTable = new google.visualization.DataTable();
			aroonTable.addColumn('string', 'Date');
			aroonTable.addColumn('number', 'AROON Up');
			aroonTable.addColumn('number', 'AROON Down');
			var aroonChart = new google.visualization.LineChart(document.getElementById('AROON-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				aroonTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["Aroon Up"]), parseFloat(data[tableName][arr[i]]["Aroon Down"])]);
			}
			function reDrawAROON() {
				setTimeout(function(){
					aroonChart.draw(aroonTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawAROON);
		    $('#AROONTrigger').click(reDrawAROON);
		}
		else {
			$("#AROON-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawBBANDSChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"BBANDS"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var bbandsTable = new google.visualization.DataTable();
			bbandsTable.addColumn('string', 'Date');
			bbandsTable.addColumn('number', 'Real Upper Band');
			bbandsTable.addColumn('number', 'Real Lower Band');
			bbandsTable.addColumn('number', 'Real Middle Band');
			var bbandsChart = new google.visualization.LineChart(document.getElementById('BBANDS-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				bbandsTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["Real Upper Band"]), parseFloat(data[tableName][arr[i]]["Real Lower Band"]), parseFloat(data[tableName][arr[i]]["Real Middle Band"])]);
			}
			function reDrawBBANDS() {
				setTimeout(function(){
					bbandsChart.draw(bbandsTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawBBANDS);
		    $('#BBANDSTrigger').click(reDrawBBANDS);
		}
		else {
			$("#BBANDS-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawADChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"AD"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var adTable = new google.visualization.DataTable();
			adTable.addColumn('string', 'Date');
			adTable.addColumn('number', 'Chaikin A/D');
			var adChart = new google.visualization.LineChart(document.getElementById('AD-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				adTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["Chaikin A/D"])]);
			}
			function reDrawAD() {
				setTimeout(function(){
					adChart.draw(adTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawAD);
		    $('#ADTrigger').click(reDrawAD);
		}
		else {
			$("#AD-graph").html("<span>No graph data available</span>");
		}
	});
}

function drawOBVChart() {
	// Create the data table.
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("techtable", {function:"OBV"}), parameters)
	.done(function(data) {
		if (data != "Error") {
			var obvTable = new google.visualization.DataTable();
			obvTable.addColumn('string', 'Date');
			obvTable.addColumn('number', 'OBV');
			var obvChart = new google.visualization.LineChart(document.getElementById('OBV-graph'));
			var table = "";
			for (var item in data) {
				tableName = item;
			}
			var arr = [];
			for (var key in data[tableName]) {
				arr.push(key);
			}
			for (var i=arr.length-365; i<arr.length; ++i) {
				obvTable.addRow([arr[i], parseFloat(data[tableName][arr[i]]["OBV"])]);
			}
			function reDrawOBV() {
				setTimeout(function(){
					obvChart.draw(obvTable, optionsTechnical);
				}, 200);
			}
			$(window).resize(reDrawOBV);
		    $('#OBVTrigger').click(reDrawOBV);
		}
		else {
			$("#OBV-graph").html("<span>No graph data available</span>");
		}
	});
}

function getCompanyInfo(name, out) {
	name = name.replace('"', ' ');
	name = name.replace('"', ' ');
	var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + name + "&redirects&origin=*";
	$.getJSON(url)
	.done(function(data) {
		var info;
		for(var key in data["query"]["pages"]) {
				info = data["query"]["pages"][key]["extract"];
			}
			if (info == undefined)
			{
				replaced = name.replace(",", " ");
				replaced = replaced.replace(/Incorporated/gi, " ");
				replaced = replaced.replace(/Inc/gi, " ");
				replaced = replaced.replace(/Ltd/gi, " ");
				replaced = replaced.replace(/Limited/gi, " ");
				replaced = replaced.replace(/L.P./gi, " ");
				replaced = replaced.replace(/Corporation/gi, " ");
				replaced = replaced.replace(/Corp/gi, " ");
				replaced = replaced.replace(".", " ");
				if (replaced != name) {
					getCompanyInfo(replaced, out);
				}
				else {
					out.html('"No other information could be found for this company"');
				}

			}
			else {
				out.html('"' + info +'"');
			}
	})
}

function getCompanyArticles() {
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
}

function getDBInfo(i) {
	var parameters = {
		symbol: $('#symbol'+ i.toString()).text()
	};
	$.getJSON(Flask.url_for("info"), parameters)
	.done(function(data) {
		name = data[0]["Name"].replace(/&#39;/g, "'");
		$('#name'+ i.toString()).text(name);
		$("#ipoyear" + i.toString()).text(data[0]["IPOYear"]);
		$("#markcap" + i.toString()).text(data[0]["MarketCap"]);
		$("#sector" + i.toString()).text(data[0]["Sector"]);
		$("#industry" + i.toString()).text(data[0]["Industry"]);
		if (window.location.pathname == "/")
		{
			getCompanyInfo(data[0]["Name"], $('#info'+ i.toString()));
		}
	})

}

function getTable(timeframe) {
	var parameters = {
		symbol: $('#symbol').text(),
	};
	$.getJSON(Flask.url_for("table", {timeframe:timeframe}), parameters)
	.done(function(data) {
		var table = "";
		for (var item in data) {
			tableName = item;
		}
		var arr = [];
		for (var key in data[tableName]) {
			arr.push(key);
		}
		timeframe = timeframe.toLowerCase();
		for (var i=arr.length-1, k=0; i>0; --i) {
			table = table + "<tr><td id='" + timeframe + "-date" + String(k) + "'>" + arr[i] + "</td>"
					+ "<td>" + data[tableName][arr[i]]["1. open"] + "</td>"
					+ "<td>" + data[tableName][arr[i]]["2. high"] + "</td>"
					+ "<td>" + data[tableName][arr[i]]["3. low"] + "</td>"
					+ "<td id='" + timeframe + "-close" + String(k) + "'>" + data[tableName][arr[i]]["4. close"] + "</td>"
					+ "<td>" + data[tableName][arr[i]]["5. volume"] + "</td></tr>";
			++k;
		}
		$('#' + timeframe + '-table').append(table);
	});
}


$(function() { //on document ready
	if (window.location.pathname == "/") {
		for( var i=1; i<($('.stock-box').length+1); ++i) {
			name = $('#name'+ i.toString()).text();
			getCompanyInfo(name, $('#info'+ i.toString()));
		}
	}

	if (window.location.pathname == "/trending") {
		for( var i=1; i<($('.stock-box').length+1); ++i) {
			name = $('#name'+ i.toString()).text();
			getCompanyInfo(name, $('#info'+ i.toString()));
		}
	}

	if (window.location.pathname == "/random") {
		for( var i=1; i<($('.stock-box').length+1); ++i) {
			name = $('#name'+ i.toString()).text();
			getCompanyInfo(name, $('#info'+ i.toString()));
		}
	}

	if (window.location.pathname == "/history") {
		getDBInfo("");
		getCompanyArticles();
		getTable("INTRADAY");
		getTable("DAILY");
		getTable("WEEKLY");
		getTable("MONTHLY");
	}

	google.charts.setOnLoadCallback(function () {
		if (window.location.pathname == "/") {
			for( var i=1; i<($('.stock-box').length+1); ++i)
			{
				drawChart(i, optionsIndex);
			}
		}

		if (window.location.pathname == "/trending") {
			for( var i=1; i<($('.stock-box').length+1); ++i)
			{
				drawChart(i, optionsIndex);
			}
		}

		if (window.location.pathname == "/random") {
			for( var i=1; i<($('.stock-box').length+1); ++i)
			{
				drawChart(i, optionsIndex);
			}
		}

		if (window.location.pathname == "/history")	{
			drawMinuteChart();
			drawDayChart();
			drawWeekChart();
			drawMonthChart();
		}

		if (window.location.pathname == "/technical")	{
			drawSMAChart();
			drawMACDChart();
			drawSTOCHChart();
			drawRSIChart();
			drawADXChart();
			drawCCIChart();
			drawAROONChart();
			drawBBANDSChart();
			drawADChart();
			drawOBVChart();
		}

		if (window.location.pathname == "/search") {
			for( var i=1; i<($('.stock-box').length+1); ++i) {
				drawChart(i, optionsSearch);
			}
		}
	});

	$("#search").keypress(function(e) {
		if (e.keyCode == 10 || e.keyCode == 13) {
			e.preventDefault();
			var url = ('/search?q=' + ($("#search").val()));
			window.location.replace(url);
		}
	});

	$("#searchform").on("submit", function(e) {
		e.preventDefault();
		var url = ('/search?q=' + ($("#search").val()));
		window.location.replace(url);
	});
});
