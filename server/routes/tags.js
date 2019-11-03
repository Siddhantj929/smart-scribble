var express = require("express");
var router = express.Router();

// Middleware
const auth = require("../middlewares/auth");

// Models
const Tags = require("../models/tag");
const Scribbles = require("../models/scribble");

// Create new Tag
router.post("/", auth, async (req, res) => {
	let message = "Operation failed due to improper data.";
	let payload = null;
	let status = 400;

	try {
		const tag = new Tags({ ...req.body, user: req.user._id });
		await tag.save();

		req.user.tags.push(scribble);
		await req.user.save();

		status = 201;
		message = "Tag successfully created.";
		payload = { tag };
	} catch (err) {
		console.error(err);
		if (process.env.NODE_ENV === "DEBUG") message = err.message;
	}

	res.status(status).send({ message, payload });
});

// Get all Tags of logged in user
router.get("/", auth, async (req, res) => {
	let message = "No tags found for this user.";
	let payload = null;
	let status = 404;

	try {
		const tags = await Tags.find({ user: req.user._id });
		if (tags.length > 0) {
			status = 200;
			message = "Tags successfully found.";
			payload = { tags };
		}
	} catch (err) {
		console.error(err);
		if (process.env.NODE_ENV === "DEBUG") message = err.message;
	}

	res.status(status).send({ message, payload });
});

// Get all the scribbles of particular tag
router.get("/:id/scribbles", auth, async (req, res) => {
	let message = "No scribbles found for this tag.";
	let payload = null;
	let status = 404;

	try {
		const scribbles = await Scribbles.find({ tags: req.params.id });
		if (scribbles.length > 0) {
			status = 200;
			message = "Scribbles successfully found.";
			payload = { scribbles };
		}
	} catch (err) {
		console.error(err);
		if (process.env.NODE_ENV === "DEBUG") message = err.message;
	}

	res.status(status).send({ message, payload });
});

module.exports = router;
