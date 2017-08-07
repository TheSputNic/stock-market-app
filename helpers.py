import feedparser
import urllib.parse
import json
import collections

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
				+ "&apikey=U62GJHH0AYS16H87";
	with urllib.request.urlopen(stock_info) as url:
		data = json.loads(url.read().decode(), object_pairs_hook=collections.OrderedDict)

	if symbol not in history.cache:
		history.cache[symbol] = {"INTRADAY": "", "DAILY": "", "WEEKLY": "", "MONTHLY": ""}
	history.cache[symbol][timeframe] = data

	return history.cache[symbol][timeframe]


# initialize cache
articles.cache = {}
history.cache = {}
