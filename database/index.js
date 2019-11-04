const mongoose = require("mongoose");

// Connecting to the DB
mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-cqxyc.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => console.log("Connected to DB"))
	.catch(e => console.error(e));
