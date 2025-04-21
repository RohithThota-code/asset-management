const { Schema } = require('mongoose');

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // ✅ Role-based access
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },

  // ✅ Toggle to control update access (admin can change this)
  canUpdate: {
    type: Boolean,
    default: true
  },

  // ✅ Optional: session logs for audit trail
  sessions: [
    {
      sessionId: String,
      loginTime: Date,
      logoutTime: Date
    }
  ]
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;


