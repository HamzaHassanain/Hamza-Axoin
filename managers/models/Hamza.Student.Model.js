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

module.exports = mongoose.model("Student", StudentSchema);
