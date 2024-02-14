module.exports = {
  admins: {
    get: ["get-admins"],
    post: ["new-admin", "admin-login"],
    delete: ["admin-logout"],
  },
  students: {
    get: [
      "get-students",
      "get-student",
      "get-students-by-school",
      "get-students-by-classroom",
    ],
    post: ["new-student"],
    put: ["update-student"],
    delete: ["delete-student"],
  },
  schools: {
    get: ["get-schools", "get-school"],
    post: ["new-school"],
    put: ["update-school"],
    delete: ["delete-school"],
  },

  classrooms: {
    get: ["get-classrooms", "get-classrooms-by-school", "get-classroom"],
    post: ["new-classroom"],
    put: ["update-classroom"],
    delete: ["delete-classroom"],
  },
};
