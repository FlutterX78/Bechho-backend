const mongoose = require("mongoose");

const Schema = mongoose.Schema;

Product = Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    place:
    {
        type: String,
    },
    id: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    productuserId: {
        type: String,
        // default: Date.now
    },
    img: [{
        type: String,
        default: ""
    }],
    bid: [
        {
            price: Number,
            userBidding: String,
        }
    ]
});

module.exports = mongoose.model("Product", Product);