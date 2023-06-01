const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const auth = (roles = []) => {
	if (typeof roles === "string") {
		roles = [roles];
	}
	return async (req, res, next) => {
		if (
			!req.headers.authorization &&
			!req?.headers?.authorization?.startsWith("Bearer")
		) {
			return next(createError(403, "Authorization token is required"));
		}
		const token = req.headers.authorization.replace("Bearer ", "");
		console.log(token);
		try {
			const isvarified = await jwt.verify(token, process.env.TOKENSECRATE);
			if (!isvarified) {
				console.log(isvarified);
				return next(createError(403, "Invalid Token"));
			}
			if (roles.length > 0) {
				if (roles.includes(isvarified.role)) {
					req.user_id = isvarified.id;
					req.role = isvarified.role;
                    req.user = isvarified
					next();
				} else {
					return next(
						createError(403, `Only ${roles.toString()} can do this request.`)
					);
				}
			} else {
				req.user_id = isvarified.id;
				req.role = isvarified.role;
                req.user = isvarified
				next();
			}
		} catch (error) {
			return next(error);
		}
	};
};

const authorize = (roles = []) => {
	if (typeof roles === "string") {
		roles = [roles];
	}
	return (req, res, next) => {
		try {
			const tokenWithBearer = req.header("Authorization");

			if (!tokenWithBearer) return res.status(401).send("Access denied.");

			const newToken = tokenWithBearer.split(" ")[1];

			const verified = jwt.verify(newToken, process.env.TOKENSECRATE);
			req.auth = verified; // set the request "authorized" property with the validation result

			if (roles.length > 0 && !roles.includes(verified.role)) {
				return res.status(401).send("Access Denied");
			}
			next();
		} catch (err) {
			console.log(err);
			return res.status(501).json(err);
		}
	};
};

module.exports = { auth, authorize };
