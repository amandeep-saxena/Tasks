const express = require('express');

module.exports = (app) => {

    require('../controllers/user.controller.js')(app)
    require('../controllers/task.model.js')(app)

}