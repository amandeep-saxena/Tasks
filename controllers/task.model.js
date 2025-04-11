const express = require("express");
const db = require('../config/db.config.js');
const Task = db.Task;

const verifyToken = require('../middleware/auth.middleware');
const { taskValidation } = require('../validators/task.validator');
const { validationResult } = require('express-validator');



module.exports = (app) => {
    const apiRoutes = express.Router();

    const validate = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
        next();
    };

    // Create Task Route
    apiRoutes.post("/tasks", verifyToken, taskValidation, validate, async (req, res) => {
        try {
            const task = await Task.create({ ...req.body, userId: req.user.id });
            console.log(task);
            res.status(201).json({ message: 'Task created successfully', task });
        } catch (err) {
            res.status(400).json({ message: 'Failed to create task', error: err.message });
        }
    });

    apiRoutes.get("/getTasks", verifyToken, async (req, res) => {
        try {

            const tasks = await Task.findAll({ where: { userId: req.user.id } });
            res.status(200).json(tasks);
        } catch (err) {
            res.status(400).json({ message: 'Failed to fetch tasks', error: err.message });
        }
    });

    apiRoutes.post("/updateTask", verifyToken, taskValidation, validate, async (req, res) => {
        try {
            const task = await Task.findByPk(req.body.id);

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }


            if (task.userId !== req.user.id) {
                return res.status(403).json({ message: 'Unauthorized: You can only update your own tasks' });
            }

            await task.update(req.body);

            res.status(200).json({ message: 'Task updated successfully', task });
        } catch (err) {
            res.status(400).json({ message: 'Failed to update task', error: err.message });
        }
    });


    // apiRoutes.post("/updateTask", verifyToken, taskValidation, validate, async (req, res) => {
    //     try {
    //         const task = await Task.findByPk(req.body.id);
    //         if (!task) return res.status(404).json({ message: 'Task not found' });
    //         await task.update(req.body);
    //         res.status(200).json({ message: 'Task updated successfully', task });
    //     } catch (err) {
    //         res.status(400).json({ message: 'Failed to update task', error: err.message });
    //     }
    // });

    apiRoutes.post("/deleteTask", verifyToken, async (req, res) => {
        try {
            const userId = req.user.id;
            const task = await Task.findOne({
                where: {
                    id: req.body.id,
                    userId: userId
                }
            });
            console.log(task);
            if (!task) {
                return res.status(404).json({ message: 'Task not found or not authorized to delete' });
            }

            await task.destroy();
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (err) {
            res.status(400).json({ message: 'Failed to delete task', error: err.message });
        }
    });


    // apiRoutes.post("/deleteTask", verifyToken, async (req, res) => {
    //     try {
    //         const task = await Task.findByPk(req.body.id);
    //         if (!task) return res.status(404).json({ message: 'Task not found' });
    //         await task.destroy();
    //         res.status(200).json({ message: 'Task deleted successfully' });
    //     } catch (err) {
    //         res.status(400).json({ message: 'Failed to delete task', error: err.message });
    //     }
    // });



    app.use('/', apiRoutes);
}