const mongoose = require('mongoose');

const { Schema } = require('mongoose');

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },


  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },

 
  canUpdate: {
    type: Boolean,
    default: true
  },

  
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


