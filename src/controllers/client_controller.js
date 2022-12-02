const Client = require("../models/Client_model");
const createError = require("http-errors");
const Property = require("../models/Property_model");
const Location = require("../models/Location_model");
const { paginations } = require("../pagination/pagination")
const { propertySet } = require("../utils/propertyset")

// step_1 client data save controler 
// post {host}/api/clients/step-1
exports.step_1 = async (req, res, next) => {
    const { email } = req.body
    if (!email) {
        return next(createError(403, "fill all fields."))
    }
    try {
        const client = await Client.findOne({ [`step_1.email`]: email });
        const propertyPriceRange = await Property.aggregate([
            {
                "$group": {
                    "_id": null,
                    "max": { "$max": "$price" },
                    "min": { "$min": "$price" }
                }
            }
        ]);
        const propertyLocations = await Property.distinct("location");
        if (client) {
            return res.status(200).json({
                success: true,
                message: "email already exist.",
                data: { client, propertyPriceRange: propertyPriceRange[0], propertyLocations }
            });
        } else {
            const clientData = {
                step_1: {
                    email
                },
                stepDone: 1
            };
            const client = await Client.create(clientData);
            res.status(201).json({
                success: true,
                data: { client, propertyPriceRange: propertyPriceRange[0], propertyLocations },
                message: "client data saved"
            });
        }
    } catch (error) {
        next(error)
    }
}


// step_2 client data save controler 
// post {host}/api/clients/step-2/:id
exports.step_2 = async (req, res, next) => {
    const clientId = req.params.id
    const { familyMember, priceRange, propertyLocation } = req.body
    if (!familyMember || !priceRange || !propertyLocation) {
        return next(createError(422, "please provide the requierd fields"))
    }
    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return next(createError(403, "client not found"))
        }
        const clientData = { ...client._doc }
        clientData.step_2 = {
            familyMember,
            priceRange,
            propertyLocation
        }
        clientData.stepDone = 2
        // update client data
        const updatedClient = await Client.findByIdAndUpdate(clientId, clientData, { new: true });
        // // search properties
        const data = await paginations(req, {
            $and: [
                { price: { $gte: priceRange.min, $lte: priceRange.max } },
                { location: propertyLocation }
            ]
        }, Property)

        const propertyset = await propertySet()
        // teting token
        const token = client.getSignedToken()
        // sending response to client
        return res.status(201).json({
            success: true,
            data: { client: { ...updatedClient._doc, token }, properties: data.data, pagination: data.pagination, ...propertyset },
            message: "client data saved"
        })
    } catch (error) {
        next(error)
    }
}

// add property to  wishlist 
// put {host}/api/clients/wish-list/:id
exports.add_to_wishlist = async (req, res, next) => {
    const propertyId = req.params.id;
    try {
        const client = await Client.findById(req.user_id);
        const property = await Property.findById(propertyId);

        if (!property) {
            return next(createError(403, "Property not found"));
        }
        if (!client.wishList) {
            client.wishList = []
        }
        let isPropertyIdExist = client.wishList.find((id) => id.toString() === propertyId.toString());

        if (isPropertyIdExist) {
            return res.status(200).json({
                success: false,
                data: client,
                message: "Property id already exist into client's wish list",
            })
        } else {
            client.wishList.push(propertyId);
        }
        const updatedClient = await Client.findByIdAndUpdate(req.user_id, { ...client }, { new: true });
        return res.status(202).json({
            success: true,
            data: updatedClient,
            message: "Property add to client's wish list",
        })
    } catch (error) {
        next(error)
    }
}

// get all clients
// {host}/api/clients/
exports.get_clients = async (req, res, next) => {
    try {
        const data = await paginations(req, {}, Client)
        if (!data.data) {
            return next(createError(404, "no clients exist."))
        }
        res.status(200).json({
            success: true,
            count: data.data.length,
            data: data.data,
            message: "clients data fatch",
            pagination: data.pagination,
        })
    } catch (error) {
        next(error)
    }
}

// get single client
// get {host}/api/clients/:id
exports.get_client = async (req, res, next) => {
    const clientId = req.params.id
    try {
        const agent = await Client.findById(clientId);
        if (!agent) {
            return next(createError(404, "client dose not exist."))
        }
        res.status(200).json({
            success: true,
            data: agent,
            message: "client data fatch"
        })
    } catch (error) {
        next(error)
    }
}