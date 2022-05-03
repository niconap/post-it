const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

var CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timeStamp: { type: Date, required: true },
});

CommentSchema.virtual('displayDate').get(() => {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString({
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
  });
});

module.exports = mongoose.model('Comment', CommentSchema);
