const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")

const ClientSchema = new mongoose.Schema(
    {
        step_1: {
            email: {
                type: String,
            }
        },
        step_2: {
            familyMember: {
                type: Number,
            },
            priceRange: {
                min: {
                    type: Number
                },
                max: {
                    type: Number
                }
            },
            propertyLocation: {
                type: String
            }
        },
        stepDone: {
            type: Number,
            enum: [0, 1, 2,],
            default: 0,
        },
        wishList: [
            property_id = {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Property",
            },
        ],
        role: {
            type: String,
            default: "client"
        }
    },

    { timestamps: true }
);


ClientSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.TOKENSECRATE);
};

module.exports = mongoose.model("Client", ClientSchema);