const { AuthError, NotFoundError } = require("./Hamza.errors");
module.exports.GetUsers = async (req, res) => {
  return {
    data: {
      users: ["fuck", "you", "bitch"],
    },
    req,
    res,
  };
};
module.exports.GetUser = async (req, res) => {
  return {
    data: {
      user: req.user,
    },
    req,
    res,
  };
};
module.exports.Authenticate = async (req, res) => {
  const name = req.query.name;

  if (!name) {
    throw new NotFoundError("AuthError At Authenticate MW");
  }

  req.user = name;

  return {
    req,
    res,
  };
};
