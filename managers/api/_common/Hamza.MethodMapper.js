const admin_controllers = require("./controllers/Hamza.Admin.controllers");
const student_controllers = require("./controllers/Hamza.Student.controllers");
const school_controllers = require("./controllers/Hamza.School.controllers");
const classroom_controllers = require("./controllers/Hamza.Classroom.controllers");

module.exports = {
  "get-admins": [admin_controllers.Authenticate, admin_controllers.GetAdmins],

  "new-admin": [admin_controllers.Authenticate, admin_controllers.NewAdmin],

  "admin-login": [admin_controllers.LogInAdmin],
  "admin-logout": [
    admin_controllers.Authenticate,
    admin_controllers.LogOutAdmin,
  ],

  "new-student": [
    admin_controllers.Authenticate,
    student_controllers.NewStudent,
  ],
  "update-student": [
    admin_controllers.Authenticate,
    student_controllers.UpdateStudent,
  ],
  "delete-student": [
    admin_controllers.Authenticate,
    student_controllers.DeleteStudent,
  ],

  "new-school": [admin_controllers.Authenticate, school_controllers.NewSchool],
  "update-school": [
    admin_controllers.Authenticate,
    school_controllers.UpdateSchool,
  ],
  "delete-school": [
    admin_controllers.Authenticate,
    school_controllers.DeleteSchool,
  ],

  "get-classroom": [
    admin_controllers.Authenticate,
    classroom_controllers.GetClassroom,
  ],
  "new-classroom": [
    admin_controllers.Authenticate,
    classroom_controllers.NewClassroom,
  ],
  "update-classroom": [
    admin_controllers.Authenticate,
    classroom_controllers.UpdateClassroom,
  ],
  "delete-classroom": [
    admin_controllers.Authenticate,
    classroom_controllers.DeleteClassroom,
  ],

  "get-schools": [school_controllers.GetSchools],
  "get-school": [school_controllers.GetSchool],
  "get-classrooms": [classroom_controllers.GetClassrooms],
  "get-classrooms-by-school": [classroom_controllers.GetClassroomsBySchool],
  "get-students": [student_controllers.GetStudents],
  "get-student": [student_controllers.GetStudent],
  "get-students-by-school": [student_controllers.GetStudentsBySchool],
  "get-students-by-classroom": [student_controllers.GetStudentsByClassroom],
};
