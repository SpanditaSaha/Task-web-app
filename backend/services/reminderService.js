const Task = require("../models/taskModel");
const User = require("../models/userModel");
const NotificationPreferences = require("../models/notificationPreferencesModel");
const emailService = require("./emailService");

exports.sendTaskReminders = async () => {
  try {
    const tasks = await Task.find({
      dueDate: {
        $gte: new Date(),
        $lte: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    }).populate("collaborators");

    for (const task of tasks) {
      const users = await User.find({ _id: { $in: task.collaborators } });

      for (const user of users) {
        const preferences = await NotificationPreferences.findOne({
          user: user._id,
        });

        if (preferences && preferences.taskReminders) {
          await sendReminderEmail(user.email, task);
        }
      }
    }
  } catch (error) {
    console.error("Error sending task reminders:", error);
  }
};

async function sendReminderEmail(email, task) {
  try {
    await emailService.sendEmail({
      to: email,
      subject: "Reminder: Upcoming Task",
      text: `Hi,\n\nThis is a reminder that you have an upcoming task "${task.title}" due on ${task.dueDate}.\n\nBest regards,\nYour Task Management App`,
    });
    console.log("Reminder email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
}
