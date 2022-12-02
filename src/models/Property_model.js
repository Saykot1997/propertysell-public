const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
    {
        propertyName: {
            type: String,
            required: [true, "propertyName is required"],
        },
        price: {
            type: Number,
            required: [true, "price is required"],
        },
        propertyType: {
            type: String,
            required: [true, "propertyType is required"],
        },
        propertyVisibility: {
            type: String,
            enum: ["published", "draft"],
            required: [true, "propertyVisibility is required. 'published' or 'draft' is allowed"],
        },
        propertyCatagory: {
            type: String,
            enum: ["buy", "rent"],
            required: [true, "propertyCatagory is required. 'buy' or 'rent' is allowed"],
        },
        propertyStatus: {
            type: String,
            enum: ["ready", "off-plan"],
            required: [true, "propertyStatus is required.'ready' or 'off-plan' is allowed"],
        },
        listCatagory: {
            type: String,
            enum: ["featured", "best-sell", "most-searched", "recommended"],
            required: [true, "listCatagory is required.'featured','best-sell','most-searched' or 'recommended' is allowed"],
        },
        agentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            required: [true, "agent id is required"],
        },
        fearute_image: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            required: [true, "location is required"],
        },
        streetLocation: {
            type: String,
            default: ""
        },
        latitude: {
            type: Number,
            required: [true, "location latitude is required"],
        },
        longitude: {
            type: Number,
            required: [true, "location longitude is required"],
        },
        propertyImage: [
            {
                image: {
                    type: String,
                    default: ""
                }
            }
        ]
    },
    { strict: false },
    { timestamps: true },
);


module.exports = mongoose.model("Property", PropertySchema);