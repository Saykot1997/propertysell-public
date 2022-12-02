const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AgentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        profilePhoto: String,
        designation: String,
        role: {
            type: String,
            default: "agent",
        },
        properties: [
            property_id = {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Property",
            },
        ],
        description: String,
    },
    { timestamps: true }
);

AgentSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

AgentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

AgentSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.TOKENSECRATE);
};

module.exports = mongoose.model("Agent", AgentSchema);