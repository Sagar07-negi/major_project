const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const Course = require('../models/Course');
const Score = require('../models/Score');


// Add trainer route
router.post('/add-trainer', async (req, res) => {
    const { trainerId, name, email, phone, expertise } = req.body;

    try {
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

        // Send response with the trainer object
        res.status(201).json({
            message: 'Trainer added successfully',
            trainer: newTrainer,
        });
    } catch (error) {
        console.error('Error adding trainer:', error);
        res.status(500).json({ error: 'Failed to add trainer. Please try again.' });
    }
});

router.post('/check-trainer', async (req, res) => {
    const { email } = req.body;

    try {
        const trainer = await Trainer.findOne({ email });
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Create the token with trainerId and role
        
        // Send the trainerId and token in the response
        return res.status(200).json({ message: 'Login successful',success: true, trainerId: trainer._id });
    } catch (error) {
        console.error('Error during trainer login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Fetch trainer details along with courses and employees by ID
router.get('/:id', async (req, res) => {
    // console.log("pagal bnda dia ")
    const { id } = req.params;

    try {
        const trainer = await Trainer.findById(id);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        // Fetch courses associated with the trainer
        const courses = await Course.find({ trainer: id }).populate('employees', 'name email'); // Assuming employees have name and email fields

        return res.status(200).json({ trainer, courses });
    } catch (error) {
        console.error('Error fetching trainer details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



// Fetch course details by ID
router.get('/courses/:courseId', async (req, res) => { // Ensure the parameter matches
    const { courseId } = req.params; // Access the parameter correctly


    try {
        const course = await Course.findById(courseId).populate('employees');

        // Fetch existing scores for the course
        const existingScores = await Score.find({ courseId: courseId });

        // Map the scores to employee IDs
        const scoresMap = {};
        existingScores.forEach(score => {
            scoresMap[score.employeeId.toString()] = score;
        });

        // Attach the scores to each employee
        const employeesWithScores = course.employees.map(emp => ({
            ...emp.toObject(),
            score: scoresMap[emp._id.toString()] || null // If score exists, attach it; otherwise null
        }));

        res.json({ ...course.toObject(), employees: employeesWithScores });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Error fetching course details.' });
    }
});

router.post('/courses/:courseId/scores', async (req, res) => {
    const { courseId } = req.params;
    const scoresWithFeedback = Array.isArray(req.body) 
  ? req.body 
  : [req.body];
    // Array of score objects
    console.log("Course " , req.body)

    try {
        // Check for existing scores for the course and employees being submitted
        const existingScores = await Score.find({
            courseId: courseId,
            employeeId: { $in: scoresWithFeedback.map(entry => entry.employeeId) } // Array of employeeIds from the request
        });

        if (existingScores.length > 0) {
            // If there are existing scores, return an error message
            return res.status(400).json({ message: 'Scores and feedback have already been submitted for some employees.' });
        }

        // If no existing scores, proceed to save new scores
        const scorePromises = scoresWithFeedback.map(async (entry) => {
            const scoreEntry = new Score(entry);
            return scoreEntry.save();
        });

        await Promise.all(scorePromises);

        res.status(200).json({ message: 'Scores and feedback submitted successfully' });
    } catch (error) {
        console.error('Error saving scores and feedback:', error);
        res.status(500).json({ message: 'Error saving scores and feedback' });
    }
});

// Inside your router.js
router.get('/courses/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId).populate('employees');

        // Fetch existing scores for the course
        const existingScores = await Score.find({ courseId: courseId });

        // Map the scores to employee IDs
        const scoresMap = {};
        existingScores.forEach(score => {
            scoresMap[score.employeeId.toString()] = score;
        });

        // Attach the scores to each employee
        const employeesWithScores = course.employees.map(emp => ({
            ...emp.toObject(),
            score: scoresMap[emp._id.toString()] || null // If score exists, attach it, otherwise null
        }));

        res.json({ ...course.toObject(), employees: employeesWithScores });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ message: 'Error fetching course details.' });
    }
});


router.get('/courses/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
        // Fetch course details using the `courseId` parameter
        const course = await Course.findOne({ _id: courseId }) // Ensure to match with Number
            .populate('trainer')
            .populate('employees');

            console.log(course)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch scores and feedback for employees in the course using the course._id
        const scores = await Score.find({ courseId: course._id }).populate('employeeId');
console.log(scores)
        // Combine course details with scores
        const courseDetailsWithScores = {
            ...course.toObject(),
            employees: course.employees.map(employee => {
                const scoreEntry = scores.find(score => score.employeeId.toString() === employee._id.toString());
                return {
                    ...employee.toObject(),
                    score: scoreEntry ? scoreEntry.score : null, // Include score
                    feedback: scoreEntry ? scoreEntry.feedback : null, // Include feedback
                };
            }),
        };

        res.json(courseDetailsWithScores);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
