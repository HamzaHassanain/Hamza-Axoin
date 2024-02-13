const controllers = require("./Hamza.controllers");

module.exports = {
  "get-users": [controllers.GetUsers],
  "get-user": [controllers.Authenticate, controllers.GetUser],
};
