const mongoose = require("mongoose");

// classrom schema has reference to school _id

const ClassroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
