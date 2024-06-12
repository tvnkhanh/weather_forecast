const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    cities: [
        {
            type: String,
            required: true,
        }
    ],
});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;