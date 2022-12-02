const express = require("express");
const Router = express.Router();
const { create_location, get_locations, get_location, update_locations, delete_locations } = require("../controllers/location_controller")
const auth = require("../auth/auth");

// create location
Router.post("/", auth("admin"), create_location);
// get all locations
Router.get("/", get_locations);
// get a single location
Router.get("/:id", get_location);
// update location
Router.put("/:id", auth("admin"), update_locations);
// delete location
Router.delete("/:id", auth("admin"), delete_locations);

module.exports = Router;