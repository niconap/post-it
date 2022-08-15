const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

module.exports = mongoose.model('User', UserSchema);
