const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "Users",
			required: true
		},
		name: {
			type: String,
			required: true
		},
		scribbles: [
			{
				type: Schema.Types.ObjectId,
				ref: "Scribbles"
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tags", tagSchema);
