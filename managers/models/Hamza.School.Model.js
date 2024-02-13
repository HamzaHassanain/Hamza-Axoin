const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
SchoolSchema.pre("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }
  try {
    // check if the school name is unique
    const school = await this.constructor.findOne({ name: this.name });
    if (school) {
      const err = new Error("School name already exists");
      return next(err);
    }
    next();
  } catch (err) {
    return next(err);
  }
});
module.exports = mongoose.model("School", SchoolSchema);
