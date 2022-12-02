const Location = require("../models/Location_model");
const createError = require("http-errors");

// create locations
// {host}/api/locations
// request : post
exports.create_location = async (req, res, next) => {
    try {
        const isExist = await Location.findOne({ locationName: req.body.locationName })
        // console.log(isExist)
        if (isExist) {
            return next(createError(404, "location exist."))
        }
        const location = await Location.create(req.body)
        res.status(200).json({
            success: true,
            data: location,
            message: "location data fatch",
        })
    } catch (error) {
        next(error)
    }
}

// get all locations
// {host}/api/locations
// request : get
exports.get_locations = async (req, res, next) => {
    try {
        const locations = await Location.find({})
        res.status(200).json({
            success: true,
            data: locations,
            message: "locations data fatch",
        })
    } catch (error) {
        next(error)
    }
}


// get single location
// {host}/api/locations/:id
// request : get
exports.get_location = async (req, res, next) => {
    const locationId = req.params.id
    try {
        const isExist = await Location.findById(locationId);
        if (!isExist) {
            return next(createError(404, "no location exist."));
        }
        const updateLocation = await Location.findById(locationId)
        res.status(200).json({
            success: true,
            data: updateLocation,
            message: "locations data fatched",
        })
    } catch (error) {
        next(error)
    }
}
// update location
// {host}/api/locations/:id
// request : put
exports.update_locations = async (req, res, next) => {
    const locationId = req.params.id
    try {
        const isExist = await Location.findById(locationId);
        if (!isExist) {
            return next(createError(404, "no location exist."));
        }
        const updateLocation = await Location.findByIdAndUpdate(locationId, req.body, { new: true })
        res.status(200).json({
            success: true,
            data: updateLocation,
            message: "locations data updated",
        })
    } catch (error) {
        next(error)
    }
}
// delete location
// {host}/api/locations/:id
// request : delete
exports.delete_locations = async (req, res, next) => {
    const locationId = req.params.id
    try {
        const isExist = await Location.findById(locationId);
        if (!isExist) {
            return next(createError(404, "no location exist."));
        }
        const updateLocation = await Location.findByIdAndDelete(locationId)
        res.status(200).json({
            success: true,
            data: updateLocation,
            message: "locations data deleted",
        })
    } catch (error) {
        next(error)
    }
}