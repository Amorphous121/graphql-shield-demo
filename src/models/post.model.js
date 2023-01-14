const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
  title: { type: String },
  description: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = model('post', PostSchema);