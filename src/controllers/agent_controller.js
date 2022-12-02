const Agent = require("../models/Agent_model");
const createError = require("http-errors");
const Property = require("../models/Property_model");

// login controler 
// post {host}/api/agents/signin
exports.login = async (req, res, next) => {
    const { email } = req.body
    try {
        const agent = await Agent.findOne({ email })
        if (!agent) {
            return next(createError(403, "agent not found"))
        }
        const isPasswordCorrect = await agent.matchPassword(req.body.password)
        if (!isPasswordCorrect) {
            return next(createError(403, "incorrect password"))
        }
        const token = await agent.getSignedToken()
        const { password, ...others } = agent._doc;
        res.status(201).json({
            success: true,
            data: { ...others, token },
            message: "login success"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// get all properties of the agent
// post {host}/api/agents/properties
exports.get_properties = async (req, res, next) => {
    const agentId = req.user_id
    try {
        let page = 1;
        let limit = 10;
        let now;
        const total = await Property.countDocuments({ agentId: agentId });
        //check there is page in query
        if (req.query.page) {
            page = parseInt(req.query.page);
        }
        //check there is limit in query
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        //set now
        now = page;
        //set skip
        const skip = (page - 1) * limit;
        const pagination = {};
        if (page > 1) {
            pagination.prev = now - 1;
        }
        if (total > page * limit) {
            pagination.next = now + 1;
        }
        const property = await Property.find({ agentId: agentId })
            .sort("-createdAt")
            .skip(skip)
            .limit(limit);

        if (!property) {
            return next(createError(404, "no property exist."))
        }
        res.status(200).json({
            success: true,
            count: property.length,
            data: property,
            message: "property data fatch",
            pagination,
        })
    } catch (error) {
        next(error)
    }
}





