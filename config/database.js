const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Contect Success");
    }
    catch {
        console.log("Contect Error");
    }
}

