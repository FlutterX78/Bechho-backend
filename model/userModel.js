const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = Schema({
    username: {
        type: String,
        // lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    mybids:[
        {
            productId:String,
            bidOffer: Number,
            accepted: Boolean,
        }
    ]
    // products: [
    //     {
    //         userproductId: String,
    //         //   address: String,
    //         name: String,
    //         price: Number
    //     }
    // ],
});

module.exports = mongoose.model("User", User);