const mongoose = require("mongoose");

// classrom schema has reference to school _id

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});
ClassroomSchema.pre("deleteOne", { document: true }, async function (next) {
  // delete all students in the classroom
  try {
    await this.model("Student").deleteMany({ classroom: this._id });
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Classroom", ClassroomSchema);
