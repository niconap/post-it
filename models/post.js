const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  content: String,
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  timeStamp: Date,
});

module.exports = mongoose.model('Post', PostSchema);
