const express = require("express");
const app = express();
const dotenv = require('dotenv');
const db = require("./config/db_connect");
const cors = require("cors");
const createError = require('http-errors');
const { error_handler } = require("./error/error_handler");
const AdminRouter = require("./routers/admin_router");
const ClientRouter = require("./routers/client_router");
const PropertyRouter = require("./routers/property_router");
const AgentRouter = require("./routers/agent_router");
const LocationRouter = require("./routers/location_router")

// console.log(process.env.PORT)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// connect to mongodb
db()

app.get("/api/", (req, res) => {
    res.send("welcome to global immigration consultant property sell api");
});

app.use("/api/admins", AdminRouter);
app.use("/api/clients", ClientRouter);
app.use("/api/properties", PropertyRouter);
app.use("/api/agents", AgentRouter);
app.use("/api/locations", LocationRouter);


app.use((req, res, next) => {
    next(createError(404, "can not get data for this requiest"));
})

app.use(error_handler);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});