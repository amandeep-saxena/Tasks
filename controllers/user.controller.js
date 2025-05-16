const express = require("express");
const db = require("../config/db.config.js");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require('../middleware/auth.middleware.js')
const { literal } = require("sequelize");
const Sequelize = require("sequelize");



function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}


module.exports = (app) => {
    const apiRoutes = express.Router();

    apiRoutes.post("/create", async (req, res) => {
        const { name, email, password, address, latitude, longitude } = req.body;

        if (!name || !email || !password || !address || !latitude || !longitude) {
            return res.status(400).json({
                status_code: "400",
                message: "All fields are required",
            });
        }

        console.log(req.body);
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                address,
                latitude,
                longitude,
            });

            const token = jwt.sign({
                id: user.id,
                latitude: user.Latitude,
                longitude: user.Longitude
            }, "aman@123", { expiresIn: "1h" });

            return res.status(200).json({
                status_code: "200",
                message: "User created successfully",
                data: {
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    latitude: user.latitude,
                    longitude: user.longitude,
                    status: user.status,
                    register_at: user.register_at,
                    token: token,
                },
            });
        } catch (error) {
            console.log(error);
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(400).json({
                    status_code: "400",
                    message: "Email already exists",
                });
            }
            res.status(500).json({ status_code: "500", message: error.message });
        }
    });



    apiRoutes.post("/toggle-status", verifyToken, async (req, res) => {
        try {
            const [affectedCount] = await User.update(
                {
                    status: Sequelize.literal(`CASE 
                        WHEN status = 'active' THEN 'inactive' 
                        WHEN status = 'inactive' THEN 'active' 
                        ELSE status 
                    END`)
                },
                {
                    where: {}
                }
            );

            console.log("Toggle affected rows:", affectedCount);
            res.status(200).json({
                status_code: 200,
                message: `User statuses toggled successfully`,
                updated_count: affectedCount
            });
        } catch (error) {
            console.log("Toggle error:", error);
            res.status(500).json({
                status_code: 500,
                message: "Error toggling user statuses"
            });
        }
    })



    apiRoutes.get("/getUserListing", async (req, res) => {
        try {
            // weekNumbers = req.body.week_number?.split(',').map(Number);
            const weekNumbers = req.query.week_number?.split(',').map(Number);
            if (!weekNumbers || weekNumbers.length === 0) {
                return res.status(400).json({ message: 'week_number query parameter is required' });
            }

            const users = await User.findAll({
                attributes: [
                    'name',
                    'email',
                    [literal('(DAYOFWEEK(createdAt) + 5) % 7'), 'dayIndex']
                ],
                where: literal(`(DAYOFWEEK(createdAt) + 5) % 7 IN (${weekNumbers.join(',')})`),
                raw: true,
            });


            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

            const result = {};
            weekNumbers.forEach(num => {
                result[days[num]] = [];
            });


            users.forEach(user => {
                const dayName = days[user.dayIndex];
                if (result[dayName]) {
                    result[dayName].push({
                        name: user.name,
                        email: user.email
                    });
                }
            });


            res.status(200).json({
                status_code: "200",
                message: "User list fetched successfully",
                data: result
            });

        } catch (err) {
            console.log("Error fetching user listing:", err);
            res.status(500).json({ message: err.message });
        }
    });



    apiRoutes.get('/getDistance', verifyToken,async(req, res) => {
        try {
            const { Destination_Latitude, Destination_Longitude } = req.query;

            if (!Destination_Latitude || !Destination_Longitude) {
                return res.status(400).json({ message: 'Destination_Latitude and Destination_Longitude are required' });
            }

            const user = await User.findByPk(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userLat = parseFloat(user.latitude);
            const userLng = parseFloat(user.longitude);
            const destLat = parseFloat(Destination_Latitude);
            const destLng = parseFloat(Destination_Longitude);

            if (
                isNaN(userLat) || isNaN(userLng) ||
                isNaN(destLat) || isNaN(destLng)
            ) {
                return res.status(400).json({ message: 'Invalid latitude or longitude values' });
            }

            const distanceKm = getDistanceFromLatLonInKm(userLat, userLng, destLat, destLng);

            res.status(200).json({
                status_code: "200",
                message: "Distance calculated successfully",
                distance: `${distanceKm.toFixed(2)} km`
            });
        } catch (err) {
            console.log("Error calculating distance:", err);
            res.status(500).json({ message: err.message });
        }
    });



    apiRoutes.get("/getAll", async (req, res) => {
        res.status(200).json({
            status_code: "200",
            message: "User data fetched successfully",
            data: await User.findAll(),
        });
    })
    app.use('/', apiRoutes)
}