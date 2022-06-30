const mongoose = require('mongoose');
const MSchema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const hobbySchema = MSchema({
  title: String,
  description: String,
});
module.exports = mongoose.model('Hobby', hobbySchema);
