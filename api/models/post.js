const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

var PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  timeStamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

PostSchema.virtual('url').get(() => {
  return '/post/' + this._id;
});

PostSchema.virtual('displayDate').get(() => {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString({
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
  });
});

module.exports = mongoose.model('Post', PostSchema);
