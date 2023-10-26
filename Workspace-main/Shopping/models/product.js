const mongoose = require('mongoose');

const product = new mongoose.Schema({

    productId: {
        type : Number,
        require : true,
        unique: [true, 'This product id is already exists.']
    },
    productName : {
        type : String,
        require:  true
    },
    qty : {
        type : Number,
        require : true
    },
    description : {
        type : String
    },
    productImage : {
        type : String,
        require : true
    },
    dateOfProduct : {
        type : Date
    },
    ExpiryDate : {
        type : Date
    }
})

module.exports = mongoose.model("product", product)