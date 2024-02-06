const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let CONST_LIKES = 0;

suite('Functional Tests', function () {


    test('Viewing one stock: GET request to /api/stock-prices/', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/?stock=MSFT')
            .end(function (err, res) {
                const { stock, price, likes } = res.body.stockData;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(stock, "MSFT");
                assert.equal(price, 62.3);
                assert.isNumber(likes, "the likes filed should be a valid Int");
                done();
            });
    });


    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/?stock=MSFT&like=true')
            .end(function (err, res) {
                const { stock, price, likes } = res.body.stockData;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(stock, "MSFT");
                assert.equal(price, 62.3);
                console.log(likes);
                assert.isNumber(likes, "the likes filed should be a valid Int");
                CONST_LIKES = likes;
                done();
            });
    });



    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/?stock=MSFT&like=true')
            .end(function (err, res) {
                const { stock, price, likes } = res.body.stockData;
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(stock, "MSFT");
                assert.equal(price, 62.3);
                assert.isNumber(likes, "the likes filed should be a valid Int");
                assert.equal(likes, CONST_LIKES, "only 1 like per IP should be accepted");
                done();
            });
    });


    test('Viewing two stocks: GET request to /api/stock-prices/', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/?stock=GOOG&stock=MSFT')
            .end(function (err, res) {
                
                const { stock: stock_first, price: price_first, rel_likes: rel_likes_first } = res.body.stockData[0];
                const { stock: stock_second, price: price_second, rel_likes: rel_likes_second } = res.body.stockData[1];

                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(stock_first, "GOOG");
                assert.equal(price_first, 786.90);
                assert.isNumber(rel_likes_first, "the first rel likes filed should be a valid Int");

                assert.equal(stock_second, "MSFT");
                assert.equal(price_second, 62.3);
                assert.isNumber(rel_likes_second, "the second rel likes filed should be a valid Int");

                assert.equal(Math.abs(rel_likes_second), Math.abs(rel_likes_first));

                done();

            });
    });


    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/stock-prices/?stock=GOOG&stock=MSFT&like=true')
            .end(function (err, res) {
                
                const { stock: stock_first, price: price_first, rel_likes: rel_likes_first } = res.body.stockData[0];
                const { stock: stock_second, price: price_second, rel_likes: rel_likes_second } = res.body.stockData[1];

                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(stock_first, "GOOG");
                assert.equal(price_first, 786.90);
                assert.isNumber(rel_likes_first, "the first rel likes filed should be a valid Int");

                assert.equal(stock_second, "MSFT");
                assert.equal(price_second, 62.3);
                assert.isNumber(rel_likes_second, "the second rel likes filed should be a valid Int");

                assert.equal(Math.abs(rel_likes_second), Math.abs(rel_likes_first));

                done();

            });
    });

});
