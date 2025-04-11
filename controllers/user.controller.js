const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../config/db.config.js');
const User = db.User;
const { validationResult } = require('express-validator');
const verifyToken = require('../middleware/auth.middleware.js');
const registerValidation = require('../validators/auth.validator.js').registerValidation
const loginValidation = require('../validators/auth.validator.js').loginValidation;

module.exports = (app) => {
    const apiRoutes = express.Router();


    apiRoutes.post("/register", registerValidation, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashedPassword });
            res.status(201).json({ message: 'User registered', user });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });


    apiRoutes.post("/login", loginValidation, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user.id }, 'aman@123', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });



    app.get("/token", verifyToken, async (req, res) => {
        const user = await User.findByPk(req.userId);
        console.log(user);
        res.json({
            message: "User loging",
            user,
        });
    });

    app.use("/", apiRoutes);
}
