const express = require("express");
const Router = express.Router();
const { create_property, update_property, get_property, get_properties, delete_property, search_property, insertMany, price_range, property_type } = require("../controllers/property_controller")
const auth = require("../auth/auth");


// create property
Router.post("/", auth(["admin", "agent"]), create_property);
// create property
Router.post("/insert-many", auth("admin"), insertMany);
// price range 
Router.get("/price-range", price_range)
// price range 
Router.get("/property-type", property_type)
// search properties
Router.get("/search", search_property);
// get all properties
Router.get("/", get_properties);
// get a single property
Router.get("/:id", get_property);
// update property
Router.put("/:id", auth("admin"), update_property);
// delete property
Router.delete("/:id", auth("admin"), delete_property);



module.exports = Router;