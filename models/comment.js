const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timeStamp: Date,
});

module.exports = mongoose.model('Comment', CommentSchema);
