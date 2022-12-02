const Property = require("../models/Property_model");
const createError = require("http-errors");
const Agent = require("../models/Agent_model");
const { paginations } = require("../pagination/pagination")
const { propertySet } = require("../utils/propertyset")

// get all property
// {host}/api/properties/
exports.get_properties = async (req, res, next) => {
    try {
        const data = await paginations(req, {}, Property)
        if (!data.data) {
            return next(createError(404, "no property exist."))
        }
        // res.status(200).json({
        //     success: true,
        //     count: data.data.length,
        //     data: data.data,
        //     message: "property data fatch",
        //     pagination: data.pagination,
        // })
        const propertyset = await propertySet()
        res.status(200).json({
            success: true,
            count: data.data.length,
            data: { properties: data.data, pagination: data.pagination, ...propertyset },
            message: "properties data fatch",
        })
    } catch (error) {
        next(error)
    }
}

// get single property
// {host}/api/properties/:id
exports.get_property = async (req, res, next) => {
    const propertyId = req.params.id
    // console.log(propertyId)
    try {
        const property = await Property.findById(propertyId).populate("agentId")
        if (!property) {
            return next(createError(404, "property dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: property,
            message: "property data fatch"
        })
    } catch (error) {
        next(error)
    }
}

// property data save by admin controller
// {host}/api/properties/
exports.create_property = async (req, res, next) => {
    const { agentId } = req.body;
    try {
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return next(createError(403, "agent not found."))
        }
        const property = await Property.create(req.body);
        agent.properties.push(property._id);
        await Agent.findByIdAndUpdate(agentId, { ...agent });
        res.status(200).json({
            success: true,
            data: property,
            message: "property created"
        })
    } catch (error) {
        next(error)
    }
}

// insert many property
exports.insertMany = async (req, res, next) => {
    try {
        const properties = await Property.insertMany(req.body)
        res.status(200).json({
            success: true,
            data: properties,
            message: "properties created"
        })
    } catch (error) {
        next(error)
    }
}

// property data update by admin controller
// {host}/api/properties/:id
exports.update_property = async (req, res, next) => {
    const propertyId = req.params.id;
    try {
        const property = await Property.findByIdAndUpdate(propertyId, req.body, { new: true });
        if (!property) {
            return next(createError(404, "property dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: property,
            message: "property updated"
        })
    } catch (error) {
        next(error)
    }
}
// delete property
// {host}/api/properties/:id
exports.delete_property = async (req, res, next) => {
    const propertyId = req.params.id;
    try {
        const property = await Property.findByIdAndDelete(propertyId)
        if (!property) {
            return next(createError(404, "property dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: property,
            message: "property deleted"
        })
    } catch (error) {
        next(error)
    }
}


// search property
// {host}/api/properties/search
exports.search_property = async (req, res, next) => {
    // l_price = lowest price
    // bed = bed number
    // bath = bathroom number
    // location = property location
    // p_type = property type
    // p_cat = propertyCatagory buy or rent
    // p_status = propertyStatus "ready", "off-plan"

    let quiries = req.query
    const searchQueries = {}
    for (let q in quiries) {
        if (quiries[q]) {
            searchQueries[q] = quiries[q]
        }
    }
    const searchAbleQuiries = []
    searchQueries.l_price && searchQueries.h_price && searchAbleQuiries.push({ price: { $gte: searchQueries.l_price } })
    searchQueries.p_type && searchAbleQuiries.push({ propertyType: searchQueries.p_type })
    searchQueries.location && searchAbleQuiries.push({ location: searchQueries.location })
    searchQueries.bed && searchAbleQuiries.push({ bed: { $gte: searchQueries.bed } })
    searchQueries.bath && searchAbleQuiries.push({ bathroom: { $gte: searchQueries.bath } })
    searchQueries.p_cat && searchAbleQuiries.push({ propertyCatagory: searchQueries.p_cat })
    searchQueries.p_status && searchAbleQuiries.push({ propertyStatus: searchQueries.p_status })
    searchAbleQuiries.push({ propertyVisibility: "published" })

    try {
        const data = await paginations(req, { $and: searchAbleQuiries }, Property)
        if (!data.data) {
            return next(createError(404, "no property exist."))
        }
        const propertyset = await propertySet()
        res.status(200).json({
            success: true,
            count: data.data.length,
            data: { properties: data.data, pagination: data.pagination, ...propertyset },
            message: "properties data fatch",
        })
    } catch (error) {
        next(error)
        console.log(error)
    }
}

// property price range
// {host}/api/properties/price-range
// request : get
exports.price_range = async (req, res, next) => {

    try {
        const propertyPriceRange = await Property.aggregate([
            {
                "$group": {
                    "_id": null,
                    "max": { "$max": "$price" },
                    "min": { "$min": "$price" }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: propertyPriceRange,
            message: "property price range fatched"
        })
    } catch (error) {
        next(error)
    }
}

// property price types
// {host}/api/properties/property-types
// request : get
exports.property_type = async (req, res, next) => {

    try {
        const propertyType = await Property.distinct("propertyType")
        res.status(200).json({
            success: true,
            data: propertyType,
            message: "property types fatched"
        })
    } catch (error) {
        next(error)
    }
}
