const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  displayName: String,
  facebookId: String,
  token: String,
  email: String,
});

UserSchema.virtual('url').get(() => {
  return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
