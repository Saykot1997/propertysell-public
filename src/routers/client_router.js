const express = require("express");
const Router = express.Router();
const { step_1, step_2, add_to_wishlist, get_clients, get_client } = require("../controllers/client_controller");
const auth = require("../auth/auth");

// client data save stap 1 
Router.post("/step-1", step_1);
// client data save stap 2
Router.post("/step-2/:id", step_2);
// property add to client wishlist
Router.put("/wish-list/:id", auth("client"), add_to_wishlist);
// get all clients
Router.get("/", auth(["admin"]), get_clients);
// get single client
Router.get("/:id", auth(["admin", "client"]), get_client);

module.exports = Router;