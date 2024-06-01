const mongoose = require('mongoose');

const weatherSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    }
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;