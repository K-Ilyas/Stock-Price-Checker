
module.exports = async function (client) {
    const stock = new client.Schema({
        stock: String,
        price: Number,
        likes: Number,
        ipAdresses: [String]
    });
    return client.model("Stock", stock);
}
