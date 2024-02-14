const Student = require("../../../models/Hamza.Student.Model");
const {
  AuthError,
  NotFoundError,
  ServerError,
  ValidationError,
} = require("../../../../_common/Hamza.errors");

// students have reference to school and classroom

module.exports.GetStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return {
      data: {
        students,
      },
    };
  } catch (err) {
    throw new ServerError("Error while fetching students");
  }
};

module.exports.NewStudent = async (req, res) => {
  try {
    const { name, school, classroom } = req.body;

    if (!name || !school || !classroom) {
      throw new ValidationError(
        "Student name, school id and classroom id are required"
      );
    }
    const old_student = await Student.findOne({ name });
    if (old_student) {
      throw new ValidationError("Student name already exists");
    }
    const student = new Student({ name, school, classroom });
    await student.save();

    return {
      data: {
        name: student.name,
        _id: student._id,
        school: student.school,
        classroom: student.classroom,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while creating new student");
  }
};
module.exports.GetStudent = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new ValidationError("Student id is required");
    const student = await Student.findById(id).populate("school classroom");
    if (!student) {
      throw new NotFoundError("Student not found");
    }
    return {
      data: {
        student,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while fetching student");
  }
};
module.exports.DeleteStudent = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new ValidationError("Student id is required");
    const student = await Student.findById(id);
    if (!student) {
      throw new NotFoundError("Student not found");
    }
    await student.deleteOne();
    return {
      data: {
        message: "Student deleted successfully",
      },
    };
  } catch (err) {
    throw new ServerError("Error while deleting student");
  }
};

// get students by school

module.exports.GetStudentsBySchool = async (req, res) => {
  try {
    const { school_id } = req.query;
    if (!school_id) throw new ValidationError("School id is required");
    const students = await Student.find({
      school: school_id,
    });
    return {
      data: {
        students,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while fetching students");
  }
};
// get students by classroom

module.exports.GetStudentsByClassroom = async (req, res) => {
  try {
    const { classroom_id } = req.query;
    if (!classroom_id) throw new ValidationError("Classroom id is required");
    const students = await Student.find({
      classroom: classroom_id,
    });
    return {
      data: {
        students,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while fetching students");
  }
};

// update student

module.exports.UpdateStudent = async (req, res) => {
  try {
    const { id, name, school, classroom } = req.body;
    if (!id) throw new ValidationError("Student id is required");

    const student = await Student.findById(id);
    if (!student) {
      throw new NotFoundError("Student not found");
    }
    if (name) {
      student.name = name;
    }
    if (school) {
      student.school = school;
    }
    if (classroom) {
      student.classroom = classroom;
    }
    await student.save();
    return {
      data: {
        student,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while updating student");
  }
};
