var express = require("express");
var router = express.Router();

// Middleware
const auth = require("../middlewares/auth");

// Models
const Tags = require("../models/tag");
const Scribbles = require("../models/scribble");

// Create new Scribble
router.post("/", auth, async (req, res) => {
	let message = "Operation failed due to improper data.";
	let payload = null;
	let status = 400;

	try {
		const scribble = new Scribbles({ ...req.body, user: req.user._id });
		await scribble.save();

		req.body.tags.forEach(async tag => {
			await Tags.findByIdAndUpdate(tag, {
				$push: { scribbles: scribble._id }
			});
		});

		req.user.scribbles.push(scribble);
		await req.user.save();

		status = 201;
		message = "Scribble successfully created.";
		payload = { scribble };
	} catch (err) {
		console.error(err);
		if (process.env.NODE_ENV === "DEBUG") message = err.message;
	}

	res.status(status).send({ message, payload });
});

// Get all "ACTIVE" Scribbles of logged in user
router.get("/", auth, async (req, res) => {
	let message = "No active scribbles found for this user.";
	let payload = null;
	let status = 404;

	try {
		const scribbles = await Scribbles.find({
			user: req.user._id,
			isActive: true
		});

		// Checking if 3 tasks are there
		if (scribbles.length === 3) {
			status = 200;
			message = "Scribbles successfully found.";
			payload = { scribbles };

			// Activating new scribble in list
		} else {
			const activeTags = [];

			scribbles.forEach(s => activeTags.push(...s.tags));

			const inactiveScribbles = await Scribbles.find(
				{
					user: req.user._id,
					isActive: false,
					isComplete: false,
					tags: { $nin: activeTags }
				},
				{ sort: "-date" }
			);

			let scribble;

			if (inactiveScribbles.length > 0) {
				scribble = inactiveScribbles[0];
				scribble.isActive = true;
				await scribble.save();
			}

			status = 200;
			message = "Scribbles successfully found.";
			payload = { scribbles: [...activeScribbles, scribble] };
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

// Update Scribbles status
router.put("/", async (req, res) => {
	let message = "Operation failed due to improper data.";
	let payload = null;
	let status = 400;

	try {
		const scribbles = await Scribbles.find({
			_id: { $in: req.body.scribbles }
		});

		// Updating current scribbles
		scribbles.forEach(async s => {
			s.isActive = false;
			s.isComplete = true;
			await s.save();
		});

		message = "Scribbles successfully updated.";
		status = 200;
		payload = { scribbles };
	} catch (err) {
		console.error(err);
		if (process.env.NODE_ENV === "DEBUG") message = err.message;
	}

	res.status(status).send({ message, payload });
});

module.exports = router;
