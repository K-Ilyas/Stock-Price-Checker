'use strict';
const bcrypt = require('bcryptjs');





async function addLikes(StockModel, name, ip) {
  let stocks = await StockModel.findOne({ "stock": name });
  let exist = false;

  exist = stocks["ipAdresses"].some((e) => {
    return bcrypt.compareSync(ip, e);
  });

  if (!exist) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(ip, salt);

    stocks = await StockModel.findOneAndUpdate({ "stock": name }, {
      $inc: { likes: 1 }, $push: { ipAdresses: hash }
    },
      { new: true });
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


        if (like != undefined && like == "true") {
          [firstStock, secondStock] = [await addLikes(StockModel, req.query["stock"][0], ip), await addLikes(StockModel, req.query["stock"][1], ip)];
        } else {
          [firstStock, secondStock] = [await StockModel.findOne({ "stock": req.query["stock"][0] }), await StockModel.findOne({ "stock": req.query["stock"][1] })];
        }

        [firstStock, secondStock] = [{ "_id": firstStock._id, "stock": firstStock.stock, "price": firstStock.price, "rel_likes": Number(firstStock.likes) - Number(secondStock.likes) }, { "_id": secondStock._id, "stock": secondStock.stock, "price": secondStock.price, "rel_likes": Number(firstStock.likes) - Number(secondStock.likes) }]
        stocks = { stockData: [{ ...firstStock }, { ...secondStock }] };

      } else {
        stocks = await StockModel.findOne({ "stock": req.query["stock"] });
        if (like != undefined && like == "true") {
          stocks = await addLikes(StockModel, req.query["stock"], ip);
        }
        stocks = { stockData: { "_id": stocks._id, "stock": stocks.stock, "price": stocks.price, "likes": stocks.likes } };
      }

      if (stocks) {
        res.status(200).json(stocks);
      } else {
        res.json({ "error": "something went wrong!!!" });
      }
    });

};


