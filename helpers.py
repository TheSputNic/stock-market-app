import feedparser
import urllib.parse
import json
import collections
from bs4 import BeautifulSoup

def articles(symbol):
    """Looks up articles for stock symbol"""
    if symbol in articles.cache:
        return articles.cache[symbol]

    feed = feedparser.parse("http://www.google.com/finance/company_news?q=NASDAQ:{}&start=0&num=100&output=rss".format(urllib.parse.quote(symbol, safe="")))

    if not feed["items"]:
        feed = feedparser.parse("https://news.google.com/news/rss/headlines/section/topic/BUSINESS?ned=us&hl=en")

    articles.cache[symbol] = [{"link": item["link"], "title": item["title"]} for item in feed["items"]]

    return articles.cache[symbol]

def history(symbol, timeframe):
	"""Gets the history of a stock"""
	if symbol in history.cache:
		if timeframe in history.cache[symbol] and history.cache[symbol][timeframe] != "":
			return history.cache[symbol][timeframe]

	stock_info = "https://www.alphavantage.co/query?function=TIME_SERIES_" + timeframe \
				+ "&symbol={}&interval=1min".format(urllib.parse.quote(symbol, safe="")) \
				+ "&outputsize=compact&apikey=U62GJHH0AYS16H87";
	with urllib.request.urlopen(stock_info) as url:
		data = json.loads(url.read().decode(), object_pairs_hook=collections.OrderedDict)

	if len(data) == 1:
		return "Error"
	if symbol not in history.cache:
		history.cache[symbol] = {"INTRADAY": "", "DAILY": "", "WEEKLY": "", "MONTHLY": ""}
	history.cache[symbol][timeframe] = data

	return history.cache[symbol][timeframe]

def techtable(symbol, function):
	"""Gets the technical data of a stock"""
	if symbol in techtable.cache:
		if function in techtable.cache[symbol] and techtable.cache[symbol][function] != "":
			return techtable.cache[symbol][function]

	stock_info = "https://www.alphavantage.co/query?function=" + function \
				+ "&symbol={}&interval=daily".format(urllib.parse.quote(symbol, safe="")) \
				+ "&time_period=100&series_type=close&apikey=U62GJHH0AYS16H87";
	with urllib.request.urlopen(stock_info) as url:
		data = json.loads(url.read().decode(), object_pairs_hook=collections.OrderedDict)

	if len(data) == 1:
		return "Error"
	if symbol not in techtable.cache:
		techtable.cache[symbol] = {"SMA": "", "MACD": "", "STOCH": "", "RSI": "", "ADX": "", "CCI": "", "AROON": "", "BBANDS": "", "AD": "", "OBV": ""}
	techtable.cache[symbol][function] = data

	return techtable.cache[symbol][function]

def getTrending():
	""" Gets Trending Stocks """
	if getTrending.cache:
		return getTrending.cache

	trendingStocks = "http://www.wallstreetsurvivor.com/investing-ideas/trending"
	with urllib.request.urlopen(trendingStocks) as url:
		soup = BeautifulSoup(url.read(), "html.parser")
	data = soup.findAll('tbody')
	out = data[0]['data-symbols']
	outlist = out.split(",")

	getTrending.cache = outlist
	return getTrending.cache

# initialize cache
articles.cache = {}
history.cache = {}
techtable.cache = {}
getTrending.cache = {}
