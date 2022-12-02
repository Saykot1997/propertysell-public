const express = require("express");
const Router = express.Router();
const auth = require("../auth/auth");
const { login, get_properties } = require("../controllers/agent_controller");
const { get_agent, update_agent } = require("../controllers/admin_controller");

// get properties of the agent
Router.get("/properties", get_properties);
// singin
Router.post("/signin", login);
// get single agent
Router.get("/:id", get_agent);
// update agent
Router.put("/:id", auth("agent"), update_agent);

module.exports = Router;