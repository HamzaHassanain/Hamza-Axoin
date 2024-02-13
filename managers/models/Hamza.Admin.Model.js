const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/index.config");
const { AuthError } = require("../../managers/api/_common/Hamza.errors");
const AdminSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Token: {
    type: String,
  },
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const admin = await this.constructor.findOne({ adminName: this.adminName });
    if (admin) {
      const err = new Error("Admin name already exists");
      return next(err);
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

AdminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
AdminSchema.methods.createToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id, adminName: this.adminName },
      config.dotEnv.LONG_TOKEN_SECRET
    );
    this.Token = token;
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

AdminSchema.methods.deleteToken = async function () {
  try {
    this.Token = null;
    await this.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const defaultAdmin = {
  adminName: "admin",
  password: "admin",
};

const Admin = mongoose.model("Admin", AdminSchema);

async function createDefaultAdmin() {
  try {
    if (await Admin.findOne({ adminName: defaultAdmin.adminName })) {
      return;
    }
    const admin = new Admin(defaultAdmin);
    console.log("Creating default admin");
    admin.save();
  } catch (err) {
    console.log(err);
  }
}
Admin.verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.dotEnv.LONG_TOKEN_SECRET);
    const admin = await Admin.findOne({
      _id: decoded._id,
      adminName: decoded.adminName,
      Token: token,
    });
    if (!admin) {
      throw new AuthError("Admin not found");
    }
    return admin;
  } catch (err) {
    if (err instanceof AuthError) throw err;
    else throw new Error("Invalid token");
  }
};

createDefaultAdmin()
  .then(() => console.log("Default admin created"))
  .catch((err) => console.log(err));
module.exports = Admin;
