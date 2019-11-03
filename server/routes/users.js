var express = require("express");
var router = express.Router();

const Users = require("../models/user");

// Signup user
router.post("/", async (req, res) => {
	let message = "Operation failed due to improper data.";
	let payload = null;
	let status = 400;

	try {
		const user = new Users(req.body);
		await user.save();
		const token = await user.generateAuthToken();

		status = 201;
		message = "User successfully created.";
		payload = { user, token };
	} catch (err) {
		console.error(err);
		if (process.env.NODE_ENV === "DEBUG") message = err;
	}

	res.status(status).send({ message, payload });
});

// Login the user / get access token
router.post("/login", async (req, res) => {
	let message = "Operation failed due to improper data.";
	let payload = null;
	let status = 400;

	//Login a registered user
	try {
		const { email, password } = req.body;
		const user = await Users.findByCredentials(email, password);
		if (!user) {
			status = 401;
			message = "Login failed! Check authentication credentials";
		} else {
			message = "User successfully logged.";
			status = 200;

			const token = await user.generateAuthToken();
			payload = { user, token };
		}
	} catch (error) {
		console.error(error);
		if (process.env.NODE_ENV === "DEBUG") message = error;
	}

	res.status(status).send({ message, payload });
});

module.exports = router;
