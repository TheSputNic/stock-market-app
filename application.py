import os
import tokenize
import urllib
import json
import collections
from flask import Flask, jsonify, render_template, request, url_for
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
	popular = [{"symbol": "AMD"}, {"symbol": "NFLX"}, {"symbol": "TSLA"}]
	return render_template("index.html", popular = popular)

@app.route("/history")
def history():
	"""Show the historical stats for a stock"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	return render_template("history.html", symbol= symbol)

@app.route("/table/<timeframe>")
def table(timeframe):
	"""Returns table data in JSON format"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	data = helpers.history(symbol, timeframe)
	return jsonify(data)

@app.route("/daily")
def daily():
	"""Returns the JSON Data of a company's daily closings"""
	symbol = request.args.get("symbol")
	if symbol == None:
		raise RuntimeError("MissingArgument")
	symbol = symbol.upper()
	data = helpers.history(symbol, "DAILY")
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

if __name__ == '__main__':
	app.run()
