const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
    {
        locationName: {
            type: String,
            required: [true, "locationName is required"],
        }
    },
    { strict: false },
    { timestamps: true },
);


module.exports = mongoose.model("Location", LocationSchema);