const cron = require('node-cron');
const { Op } = require('sequelize');
const { Task, User } = require('../config/db.config');

cron.schedule('0 9 * * *', async () => {
  console.log(' Running Daily Task Reminder Job');

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await Task.findAll({
    where: {
      dueDate: {
        [Op.lte]: in24Hours,
        [Op.gte]: now,
      },
      status: {
        [Op.ne]: 'completed',
      },
    },
    include: [User],
  });

  tasks.forEach(task => {
    console.log(` Reminder: Task "${task.title}" is due soon (Due: ${task.dueDate.toLocaleString()}) for user: ${task.User.email}`);
  });
});
