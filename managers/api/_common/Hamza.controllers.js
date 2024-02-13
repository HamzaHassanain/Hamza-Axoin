const Admin = require("../../models/Hamza.Admin.Model");
const { AuthError, NotFoundError, ServerError } = require("./Hamza.errors");
module.exports.GetAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return {
      data: {
        admins,
      },
    };
  } catch (err) {
    throw new ServerError("Error while fetching admins");
  }
};
module.exports.NewAdmin = async (req, res) => {
  try {
    const { adminName, password } = req.body;

    if (!adminName || !password) {
      throw new AuthError("Admin name and password are required");
    }
    const old_admin = await Admin.findOne({ adminName });
    if (old_admin) {
      throw new AuthError("Admin name already exists");
    }
    const admin = new Admin({ adminName, password });
    await admin.save();

    return {
      data: {
        adminName: admin.adminName,
        _id: admin._id,
      },
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    else throw new ServerError("Error while creating new admin");
  }
};
module.exports.LogInAdmin = async (req, res) => {
  try {
    const { adminName, password } = req.body;
    if (!adminName || !password) {
      throw new AuthError("Admin name and password are required");
    }
    const admin = await Admin.findOne({ adminName });
    if (!admin) {
      throw new AuthError("Admin not found");
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new AuthError("Invalid password");
    }
    const token = await admin.createToken();

    return {
      data: {
        adminName: admin.adminName,
        _id: admin._id,
        Token: token,
      },
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    else throw new ServerError("Error while logging in admin");
  }
};
module.exports.LogOutAdmin = async (req, res) => {
  try {
    const adminName = req.admin.adminName;

    const admin = await Admin.findOne({ adminName });
    if (!admin) {
      throw new AuthError("Admin not found");
    }
    await admin.deleteToken();
    return {
      message: "Admin logged out successfully",
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    else throw new ServerError("Error while logging out admin");
  }
};
module.exports.Authenticate = async (req, res) => {
  try {
    // using the token in authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) throw new AuthError("Token is required");
    const admin = await Admin.verifyToken(token);

    if (!admin) throw new AuthError("Invalid Token");

    req.admin = admin;

    return {
      req,
      res,
    };
  } catch (err) {
    if (err instanceof AuthError) throw err;
    else if (err instanceof NotFoundError) throw err;
    else throw new ServerError("Error while authenticating");
  }
};
