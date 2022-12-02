const Admin = require("../models/Admin_model");
const createError = require("http-errors");
const Agent = require("../models/Agent_model");
const bcrypt = require("bcrypt");


// register controler 
// {host}/api/admin/signup
exports.register = async (req, res, next) => {
    try {
        const isExist = await Admin.findOne({ email: req.body.email })
        if (isExist) {
            return next(createError(403, "email alrady exist"))
        }
        const admin = await Admin.create(req.body);
        const { password, updatedAt, createdAt, ...rest } = admin._doc;
        console
        res.status(201).json({
            success: true,
            data: rest,
            message: "admin create success"
        })
    } catch (error) {
        next(error)
    }
}

// login controler 
// {host}/api/admin/signin

exports.login = async (req, res, next) => {
    const { email } = req.body
    try {
        const admin = await Admin.findOne({ email })
        const isPasswordCorrect = await admin.matchPassword(req.body.password)
        if (!isPasswordCorrect) {
            return next(createError(403, "incorrect password"))
        }
        const token = await admin.getSignedToken()
        const { password, ...others } = admin._doc;
        res.status(200).json({
            success: true,
            data: { ...others, token },
            message: "login success"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// get all agent
// {host}/api/admin/agents/
// request : get
exports.get_agents = async (req, res, next) => {

    try {
        let page = 1;
        let limit = 10;
        let now;

        const total = await Agent.countDocuments({});

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

        const agents = await Agent.find({})
            .sort("-createdAt")
            .skip(skip)
            .limit(limit);

        if (!agents) {
            return next(createError(404, "no agents exist."))
        }
        res.status(200).json({
            success: true,
            count: agents.length,
            data: agents,
            message: "agents data fatch",
            pagination,
        })
    } catch (error) {
        next(error)
    }
}

// get single agent
// get {host}/api/admin/agents/:id
// request : get
exports.get_agent = async (req, res, next) => {
    const agentId = req.params.id
    try {
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return next(createError(404, "agent dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: agent,
            message: "agent data fatch"
        })
    } catch (error) {
        next(error)
    }
}

// property data save by admin controller
// {host}/api/admin/agents/
// request : post
exports.create_agent = async (req, res, next) => {
    try {
        const isExist = await Agent.findOne({ email: req.body.email })
        if (isExist) {
            return next(createError(403, "email alrady exist"))
        }
        const agent = await Agent.create(req.body);
        const { password, updatedAt, createdAt, ...rest } = agent._doc
        res.status(200).json({
            success: true,
            data: rest,
            message: "agent created"
        })
    } catch (error) {
        next(error)
    }
}

// property data update by admin controller
// {host}/api/admin/agents/:id
// request : put
exports.update_agent = async (req, res, next) => {
    const agentId = req.params.id;
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const agent = await Agent.findByIdAndUpdate(agentId, req.body, { new: true });
        if (!agent) {
            return next(createError(404, "agent dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: agent,
            message: "agent updated"
        })
    } catch (error) {
        next(error)
    }
}

// delete property
// {host}/api/admin/agents/:id
// request : delete
exports.delete_agent = async (req, res, next) => {
    const agentId = req.params.id;
    try {
        const agent = await Agent.findByIdAndDelete(agentId)
        if (!agent) {
            return next(createError(404, "agent dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: agent,
            message: "agent deleted"
        })
    } catch (error) {
        next(error)
    }
}