const express = require("express");
const Router = express.Router();
const { register, login, get_agents, create_agent, get_agent, update_agent, delete_agent } = require("../controllers/admin_controller")
const auth = require("../auth/auth");

//login route
Router.post("/signin", login);
//register route
Router.post('/signup', register);
// create agent
Router.post('/agents', auth("admin"), create_agent);
// get all agents
Router.get('/agents', get_agents);
// get single agent
Router.get('/agents/:id', get_agent);
// update agent
Router.put('/agents/:id', auth("admin"), update_agent);
// delete agent
Router.delete('/agents/:id', auth("admin"), delete_agent);


module.exports = Router;