// notificationPreferencesModel.js

const mongoose = require("mongoose");

const notificationPreferencesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskReminders: {
      type: Boolean,
      default: true,
    },
    // Add more preferences as needed
    // For example: emailNotifications, smsNotifications, etc.
  },
  { timestamps: true }
);

const NotificationPreferences = mongoose.model(
  "NotificationPreferences",
  notificationPreferencesSchema
);

module.exports = NotificationPreferences;
