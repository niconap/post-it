const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  profilePicture: { data: Buffer, contentType: String },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

UserSchema.virtual('url').get(() => {
  return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
