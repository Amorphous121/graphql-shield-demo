const { model, Schema } = require('mongoose');
const { hash, compare } = require('bcrypt');

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  role: { type: String, default: 'user' }
});

UserSchema.pre('save', async function (next) {
  this.password = await hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return compare(password, this.password);
}

module.exports = model('user', UserSchema);