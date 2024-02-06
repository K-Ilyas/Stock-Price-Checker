'use strict';
const bcrypt = require('bcryptjs');





async function addLikes(StockModel, name, ip) {
  let stocks = await StockModel.findOne({ "stock": name });
  let exist = false;

  stocks["ipAdresses"].forEach((e) => {
    if (bcrypt.compareSync(ip, e)) {
      exist = true;
    }
  });

  if (!exist) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(ip, salt, async function (err, hash) {

        stocks = await StockModel.findOneAndUpdate({ "stock": name }, {
          $inc: { likes: 1 }, $push: { ipAdresses: hash }
        },
          { new: true });

      });
    });
  }

  return await stocks;
}





module.exports = async function (app, client, StockModel) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const like = req.query?.like;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let stocks = undefined;
      let [firstStock, secondStock] = [undefined, undefined];



      if (Array.isArray(req.query["stock"])) {

        [firstStock, secondStock] = [await StockModel.findOne({ "stock": req.query["stock"][0] }), await StockModel.findOne({ "stock": req.query["stock"][1] })];

        if (like != undefined && like == "true") {
          [firstStock, secondStock] = [await addLikes(StockModel, req.query["stock"][0], ip), await addLikes(StockModel, req.query["stock"][1], ip)];
        }

        [firstStock, secondStock] = [{ "_id": firstStock._id, "stock": firstStock.stock, "price": firstStock.price, "rel_likes": Number(firstStock.likes) - Number(secondStock.likes) }, { "_id": secondStock._id, "stock": secondStock.stock, "price": secondStock.price, "rel_likes": Number(firstStock.likes) - Number(secondStock.likes) }]
        stocks = { "stockData": [{ ...firstStock }, { ...secondStock }] };

      } else {
        stocks = await StockModel.findOne({ "stock": req.query["stock"] });
        if (like != undefined && like == "true") {
          stocks = await addLikes(StockModel, req.query["stock"], ip);
        }
        stocks = { "stockData": { "_id": stocks._id, "stock": stocks.stock, "price": stocks.price, "likes": stocks.likes } };
      }

      if (stocks) {
        res.json(stocks);
      } else {
        res.json({ "error": "something went wrong!!!" });
      }
    });

};


