const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  content: { type: String, required: true },
  timeStamp: { type: Date, required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
