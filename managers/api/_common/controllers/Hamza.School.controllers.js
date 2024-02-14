const School = require("../../../models/Hamza.School.Model");
const Classrooms = require("../../../models/Hamza.Classroom.Model");
const {
  AuthError,
  NotFoundError,
  ServerError,
  ValidationError,
} = require("../../../../_common/Hamza.errors");

module.exports.GetSchools = async (req, res) => {
  try {
    const schoolsData = await School.find();
    const schools = [];
    for (let i = 0; i < schoolsData.length; i++) {
      const classrooms = await Classrooms.find({
        school: schoolsData[i]._id,
      });
      const school = {
        ...schoolsData[i]._doc,
        classrooms,
      };

      schools.push(school);
    }
    console.log("schools", schools);
    return {
      data: {
        schools,
      },
    };
  } catch (err) {
    throw new ServerError("Error while fetching schools");
  }
};

module.exports.NewSchool = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new ValidationError("School name is required");
    }
    const old_school = await School.findOne({ name });
    if (old_school) {
      throw new ValidationError("School name already exists");
    }
    const school = new School({ name });
    await school.save();

    return {
      data: {
        name: school.name,
        _id: school._id,
      },
    };
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while creating new school");
  }
};

module.exports.DeleteSchool = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new ValidationError("School id is required");
    const school = await School.findById(id);
    if (!school) {
      throw new NotFoundError("School not found");
    }
    await school.deleteOne();
    return {
      data: {
        message: "School deleted successfully",
      },
    };
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    else throw new ServerError("Error while deleting school");
  }
};

module.exports.GetSchool = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) throw new ValidationError("Query Param School id is required");

    const schoolData = await School.findById(id);
    if (!schoolData) {
      throw new NotFoundError("School not found");
    }

    const classrooms = await Classrooms.find({
      school: id,
    });

    const school = {
      ...schoolData._doc,
      classrooms,
    };
    return {
      data: {
        school,
      },
    };
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    else throw new ServerError("Error while fetching school");
  }
};

// update
module.exports.UpdateSchool = async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id) throw new ValidationError("Query Param School id is required");

    const school = await School.findById(id);
    if (!school) {
      throw new NotFoundError("School not found");
    }
    if (name) {
      // check if the neme already exists
      const old_school = await School.findOne({ name }).where("_id").ne(id);
      if (old_school) {
        throw new ValidationError("School name already exists");
      }
      school.name = name;
      await school.save();
    }
    return {
      data: {
        school,
      },
    };
  } catch (err) {
    if (err instanceof NotFoundError) throw err;
    if (err instanceof ValidationError) throw err;
    else throw new ServerError("Error while updating school");
  }
};
