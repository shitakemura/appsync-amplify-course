const mongoose = require('mongoose');
const MSchema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const postSchema = MSchema({
  comment: String,
});
module.exports = mongoose.model('Post', postSchema);
