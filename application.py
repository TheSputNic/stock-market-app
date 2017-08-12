import os
import tokenize
import urllib
import json
import collections
from flask import Flask, jsonify, render_template, request, url_for, redirect
from flask_jsglue import JSGlue
from cs50 import SQL
import helpers

app = Flask(__name__)
JSGlue(app)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

db = SQL("sqlite:///companies.db")

@app.route("/")
def index():
	stocks = db.execute("SELECT * FROM companylist WHERE (Symbol = 'AMD') OR (Symbol = 'NFLX') OR (Symbol = 'TSLA')")
	return render_template("index.html", stocks = stocks)

@app.route("/random")
def random():
	""" Renders a page with Random Stocks """
	stocks = db.execute("SELECT * FROM companylist WHERE Symbol IN (SELECT Symbol FROM companylist ORDER BY RANDOM() LIMIT 3)")
	return render_template("index.html", stocks = stocks)

@app.route("/trending")
def trending():
	""" Renders a page with Trending Stocks """
	stocks = []
	trendingList = helpers.getTrending()
	for symbol in trendingList:
		stocks = stocks + db.execute("SELECT * FROM companylist WHERE Symbol = :symbol", symbol = symbol)
	return render_template("index.html", stocks = stocks)

@app.route("/history")
def history():
	"""Show the historical stats for a stock"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	return render_template("history.html", symbol= symbol)

@app.route("/technical")
def technical():
	"""Show the technical stats for a stock"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	name = db.execute("SELECT Name FROM companylist WHERE Symbol LIKE :symbol", symbol = symbol)[0]["Name"]
	return render_template("technical.html", symbol= symbol, name = name)

@app.route("/techtable/<function>")
def techtable(function):
	"""Returns technical analysis data for a stock in JSON format"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	data = helpers.techtable(symbol, function)
	if data == "Error":
		return jsonify("Error")
	return jsonify(data)

@app.route("/table/<timeframe>")
def table(timeframe):
	"""Returns table data in JSON format"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	data = helpers.history(symbol, timeframe)
	if data == "Error":
		return jsonify("Error")
	return jsonify(data)

@app.route("/daily")
def daily():
	"""Returns the JSON Data of a company's daily closings"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	data = helpers.history(symbol, "DAILY")
	if data == "Error":
		return jsonify("Error")
	keys = map(int, data.keys())
	dates = []
	for keys in data["Time Series (Daily)"]:
		close = float(data["Time Series (Daily)"][keys]["4. close"])
		dates.append([keys, close])
	return jsonify(dates)

@app.route("/articles")
def articlesearch():
	"""Search for articles relating to a stock symbol"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("Missing arguments")
	symbol = symbol.upper()
	return jsonify(helpers.articles(symbol))

@app.route("/info")
def info():
	"""Show information on the specified company"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("Missing Argument (symbol)")
	symbol = symbol.upper()
	result = db.execute("SELECT * FROM companylist WHERE Symbol LIKE :symbol", symbol = symbol)
	return jsonify(result)

@app.route("/search")
def search():
	""" Search for a stock ticker """
	q = request.args.get("q")
	q = q.split(' ', 1)[0]
	obj = []
	result = db.execute("SELECT * FROM companylist WHERE Symbol LIKE :symbol LIMIT 20", symbol = q)
	if result == []:
		results = db.execute("SELECT * FROM companylist WHERE (Symbol LIKE :q) OR (Name LIKE :q) LIMIT 20", q = "%"+q+"%")
		if results == []:
			return render_template("search.html", results= results, apology="sorry, no results could be found...", q=q)
		return render_template("search.html", results= results, apology="", q=q)
	return redirect("/history?symbol="+q)

if __name__ == '__main__':
	app.run()
