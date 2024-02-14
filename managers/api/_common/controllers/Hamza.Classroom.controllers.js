const Classroom = require("../../../models/Hamza.Classroom.Model");
const Student = require("../../../models/Hamza.Student.Model");
const {
  AuthError,
  NotFoundError,
  ServerError,
  ValidationError,
} = require("../../../../_common/Hamza.errors");

module.exports.GetClassrooms = async (req, res) => {
  try {
    const classroomsData = await Classroom.find();
    const classrooms = [];
    for (let i = 0; i < classroomsData.length; i++) {
      const students = await Student.find({
        classroom: classroomsData[i]._id,
      });
      const classroom = {
        ...classroomsData[i]._doc,
        students,
      };

      classrooms.push(classroom);
    }
    return {
      data: {
        classrooms,
      },
    };
  } catch (err) {
    throw new ServerError("Error while fetching classrooms");
  }
};

module.exports.NewClassroom = async (req, res) => {
  try {
    const { name, school } = req.body;
    console.log("name, school", name, school);
    if (!name || !school) {
      throw new ValidationError("Classroom name and school id are required");
    }

    const classroom = new Classroom({ name, school });
    await classroom.save();

    return {
      data: {
        name: classroom.name,
        _id: classroom._id,
        school: classroom.school,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while creating new classroom");
  }
};

module.exports.DeleteClassroom = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new ValidationError("Classroom id is required");
    const classroom = await Classroom.findById(_id).populate("school");
    if (!classroom) {
      throw new NotFoundError("Classroom not found");
    }
    await classroom.deleteOne();
    return {
      data: {
        message: "Classroom deleted successfully",
      },
    };
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    else throw new ServerError("Error while deleting classroom");
  }
};

module.exports.GetClassroom = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new ValidationError("Classroom id is required");
    const classroomData = await Classroom.findById(id).populate("school");
    if (!classroomData) {
      throw new NotFoundError("Classroom not found");
    }

    const students = await Student.find({
      classroom: id,
    });
    const classroom = {
      ...classroomData._doc,
      students,
    };

    return {
      data: {
        classroom,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else if (err instanceof NotFoundError) throw err;
    throw new ServerError("Error while fetching classroom");
  }
};

module.exports.GetClassroomsBySchool = async (req, res) => {
  try {
    const { school_id } = req.query;
    if (!school_id)
      throw new ValidationError("Query Param school_id is required");
    const classrooms = await Classroom.find({ school: school_id });
    return {
      data: {
        classrooms,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ServerError("Error while fetching classrooms");
  }
};

// update
module.exports.UpdateClassroom = async (req, res) => {
  try {
    const { id, name, school } = req.body;
    if (!id) throw new ValidationError("Classroom id is required");
    if (!name || !school) {
      throw new ValidationError("Classroom name and school id are required");
    }
    const classroom = await Classroom.findById(id);
    if (!classroom) {
      throw new NotFoundError("Classroom not found");
    }
    classroom.name = name;
    classroom.school = school;
    await classroom.save();
    return {
      data: {
        name: classroom.name,
        _id: classroom._id,
        school: classroom.school,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while updating classroom");
  }
};
