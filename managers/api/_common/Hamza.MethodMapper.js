const controllers = require("./Hamza.controllers");
module.exports = {
  "get-admins": [controllers.Authenticate, controllers.GetAdmins],

  "new-admin": [controllers.Authenticate, controllers.NewAdmin],

  "admin-login": [controllers.LogInAdmin],
  "admin-logout": [controllers.Authenticate, controllers.LogOutAdmin],
};
