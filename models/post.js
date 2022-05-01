const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  timeStamp: { type: Date, required: true },
});

module.exports = mongoose.model('Post', PostSchema);
