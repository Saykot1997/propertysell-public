const express = require("express");
const app = express();
const dotenv = require('dotenv');
const db = require("./config/db_connect");
const cors = require("cors");
const compression = require('compression');
const rateLimit = require('express-rate-limit')
const createError = require('http-errors');
const { error_handler } = require("./error/error_handler");
const AdminRouter = require("./routers/admin_router");
const ClientRouter = require("./routers/client_router");
const PropertyRouter = require("./routers/property_router");
const AgentRouter = require("./routers/agent_router");
const LocationRouter = require("./routers/location_router")


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// connect to mongodb
db()

// compretion data before response
app.use(compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
        if (req.headers["x-on-compression"]) {
            return false
        }
        return compression.filter(req, res)
    }
}))

// rate limit
app.use(rateLimit({
    windowMs: 5000, // 5 secound
    max: 5, // Limit each IP to 5 requests per `window` (here, per 5 secound)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        code: 429,
        message: "Too many request."
    }
}))

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