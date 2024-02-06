## Stock Price Checker
Build a full stack JavaScript app that is functionally similar to this: https://stock-price-checker.freecodecamp.rocks/.


The following tests in tests/2_functional-tests.js are valid :

1. Viewing one stock: GET request to /api/stock-prices/
2. Viewing one stock and liking it: GET request to /api/stock-prices/
3. Viewing the same stock and liking it again: GET request to /api/stock-prices/
4. Viewing two stocks: GET request to /api/stock-prices/
5. Viewing two stocks and liking them: GET request to /api/stock-prices/

## Tests : 
1. You can provide your own project, not the example URL.
2. You should set the content security policies to only allow loading of scripts and CSS from your server.
3. You can send a GET request to /api/stock-prices, passing a NASDAQ stock symbol to a stock query parameter. The returned object will contain a property named stockData.
4. The stockData property includes the stock symbol as a string, the price as a number, and likes as a number.
5. You can also pass along a like field as true (boolean) to have your like added to the stock(s). Only 1 like per IP should be accepted.
6. If you pass along 2 stocks, the returned value will be an array with information about both stocks. Instead of likes, it will display rel_likes (the difference between the likes on both stocks) for both stockData objects.
7. All 5 functional tests are complete and passing.
