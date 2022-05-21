const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timeStamp: { type: Date, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
