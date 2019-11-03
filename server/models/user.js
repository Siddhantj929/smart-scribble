const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		scribbles: [
			{
				type: Schema.Types.ObjectId,
				ref: "Scribbles"
			}
		],
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tags"
			}
		]
	},
	{ timestamps: true }
);

userSchema.pre("save", async function(next) {
	// Hash the password before saving the user model
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.methods.generateAuthToken = async function() {
	// Generate an auth token for the user
	const user = this;
	const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
	return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
	// Search for a user by email and password.
	const user = await Users.findOne({ email });
	if (!user) {
		throw new Error({ error: "Invalid login credentials: Email" });
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		throw new Error({ error: "Invalid login credentials: Password" });
	}
	return user;
};

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
