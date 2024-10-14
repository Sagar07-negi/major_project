const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee"); // Ensure this model exists for employees
const Trainer = require("../models/Trainer"); // Include the Trainer model
const Course = require("../models/Course"); // Ensure this model exists for courses
const Score = require("../models/Score");

// Hard-coded admin credentials
const ADMIN_EMAIL = "abc@gmail.com"; // Replace with actual email
const ADMIN_PASSWORD = "abc123"; // Change this to a strong password


let employeeCounter = 100;



// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check hard-coded admin credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // If credentials are valid, generate a token
    return res.status(200).json({ message: "Login Successful", success: true });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});


router.post('/add-employee', async (req, res) => {
    const { name, email, phone, address, designation, gender, dateOfJoining } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !phone || !address || !designation || !gender || !dateOfJoining) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email is already used
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Generate employeeId
        const employeeId = `EMP-${employeeCounter++}`;

        // Create a new employee
        const newEmployee = new Employee({
            employeeId,
            name,
            email,
            phone,
            address,
            designation,
            gender,
            dateOfJoining
        });

        // Save the employee to the database
        await newEmployee.save();

        return res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
    } catch (error) {
        console.error('Error adding employee:', error);
        return res.status(500).json({ message: 'Error adding employee', error: error.message });
    }
});

router.post("/add-trainer", async (req, res) => {
  const { trainerId, name, email, phone, expertise } = req.body;

  try {
    if (!trainerId || !name || !email || !phone || !expertise) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new trainer
    const newTrainer = new Trainer({
      trainerId,
      name,
      email,
      phone,
      expertise,
    });

    // Save the trainer to the database
    await newTrainer.save();

    return res.status(201).json({
      message: "Trainer added successfully!",
      trainerId: newTrainer.trainerId,
    });
  } catch (error) {
    console.error("Error adding trainer:", error);
    return res
      .status(500)
      .json({ error: "Failed to add trainer", details: error.message });
  }
});

// Add Course Route
router.post("/add-course", async (req, res) => {
  const {
    courseId,
    name,
    description,
    startDate,
    endDate,
    trainerId,
    employees,
  } = req.body;

  try {
    if (
      !courseId ||
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !trainerId ||
      !employees
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = new Course({
      courseId,
      name,
      description,
      startDate,
      endDate,
      trainer: trainerId,
      employees: employees,
    });

    await course.save();

    // Update the trainer to include this course
    await Trainer.findByIdAndUpdate(trainerId, {
      $push: { courses: course._id },
    });

    res.status(201).json({ message: "Course added successfully", course });
  } catch (error) {
    console.error("Error adding course:", error);
    res
      .status(500)
      .json({ message: "Error adding course", error: error.message });
  }
});

router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find(); // Fetch all employees
    res.status(200).json(employees); // Return employees
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// Fetch all trainers along with their assigned courses
router.get("/trainers", async (req, res) => {
  try {
    // Fetch trainers and populate their associated courses
    const trainers = await Trainer.find().populate({
      path: "courses", // Assuming you have a 'courses' field in the Trainer model
      select: "name description", // Adjust fields to return as needed
    });

    res.status(200).json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ message: "Error fetching trainers" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().populate("trainer", "name"); // Populate trainer's name
    res.status(200).json(courses); // Return employees
  } catch (error) {
    console.error("Error fetching curses:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// Count Employees Route
router.get("/employees-count", async (req, res) => {
  try {
    const count = await Employee.countDocuments(); // Count the number of employees
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting employees:", error);
    res.status(500).json({ message: "Error counting employees" });
  }
});

// Count Trainers Route
router.get("/trainers-count", async (req, res) => {
  try {
    const count = await Trainer.countDocuments(); // Count the number of trainers
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting trainers:", error);
    res.status(500).json({ message: "Error counting trainers" });
  }
});

// Count Courses Route
router.get("/courses-count", async (req, res) => {
  try {
    const count = await Course.countDocuments(); // Count the number of courses
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting courses:", error);
    res.status(500).json({ message: "Error counting courses" });
  }
});

// Combined Counts Route
router.get("/total-counts", async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalTrainers = await Trainer.countDocuments();
    const totalCourses = await Course.countDocuments();

    res.status(200).json({ totalEmployees, totalTrainers, totalCourses });
  } catch (error) {
    console.error("Error fetching total counts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all scores
router.get("/scores", async (req, res) => {
  try {
    const scores = await Score.find().populate("employeeId", "name employeeId");
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scores" });
  }
});

// Fetch the count of scores
router.get("/scores-count", async (req, res) => {
  try {
    const count = await Score.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching score count" });
  }
});

// Fetch score for a specific employee and course, including trainer details
router.get("/scores/:employeeId/:courseId", async (req, res) => {
  const { employeeId, courseId } = req.params;

  try {
    // Find the score entry for the given employee and course
    const score = await Score.findOne({
      employeeId: ObjectId(employeeId),
      courseId: ObjectId(courseId),
    })
      .populate({
        path: "courseId",
        select: "name description trainer",
        populate: {
          path: "trainer",
          select: "name email expertise", // Select the relevant trainer details
        },
      })
      .populate("employeeId", "name email designation"); // Populate employee details

    if (!score) {
      return res
        .status(404)
        .json({ message: "Score not found for the given employee and course" });
    }

    // Return the score with course and trainer details
    res.status(200).json(score);
  } catch (error) {
    console.error("Error fetching score:", error);
    res
      .status(500)
      .json({ message: "Error fetching score", error: error.message });
  }
});

// Fetch Employee Details by ObjectId
router.get("/employees/:objectId/courses", async (req, res) => {
  const { objectId } = req.params;

  try {
    // Find the employee by objectId
    const employee = await Employee.findById(objectId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch the courses the employee is enrolled in
    const courses = await Course.find({ employees: objectId }).populate(
      "trainer",
      "name"
    ); // Assuming trainer is populated

    // Return employee details and their courses
    return res.status(200).json({ employee, courses });
  } catch (error) {
    console.error("Error fetching employee details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
