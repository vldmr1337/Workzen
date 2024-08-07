
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Aprovado', 'Rejeitado', 'Outro'],
    default: 'Outro',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
