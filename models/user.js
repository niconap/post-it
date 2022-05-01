const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  displayName: { type: String, required: true },
  facebookId: { type: String, required: true },
  token: { type: String, required: true },
  email: { type: String, required: true },
  picture: { type: String, required: false },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

UserSchema.virtual('url').get(() => {
  return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
