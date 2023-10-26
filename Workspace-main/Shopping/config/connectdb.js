const  mongoose = require("mongoose");

const connectDB = () => {

    try {
        mongoose.connect(process.env.MONGODB_URL).then(() => {
            console.log('Database is connected successfully..');
        })
    }
    catch(err) {
        console.log('Databse is not connected ..', err);
    }
}

module.exports = connectDB;