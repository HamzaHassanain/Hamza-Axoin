const Classroom = require("./Hamza.Classroom.Model");
const School = require("./Hamza.School.Model");

const { ValidationError, ServerError } = require("../../_common/Hamza.errors");
const mongoose = require("mongoose");

// the student schema has reference to the classroom _id , and school _id

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});
StudentSchema.pre("save", async function (next) {
  try {
    const classroom = await Classroom.findById(this.classroom);
    const school = await School.findById(this.school);
    if (!classroom) {
      throw new ValidationError("Classroom not found");
    }
    if (!school) {
      throw new ValidationError("School not found");
    }
    if (classroom.school.toString() !== this.school.toString()) {
      throw new ValidationError("Classroom is not in the same school");
    }
    next();
  } catch (err) {
    next(err);
  }
});
module.exports = mongoose.model("Student", StudentSchema);
