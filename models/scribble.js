const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scribbleSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "Users",
			required: true
		},
		note: {
			type: String,
			required: true
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: "Tags"
			}
		],
		isActive: {
			type: Boolean,
			default: false
		},
		isComplete: {
			type: Boolean,
			default: false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Scribbles", scribbleSchema);
