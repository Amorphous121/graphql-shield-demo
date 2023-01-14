const { connect, set } = require('mongoose');

exports.connectDB = () => {
  set('strictQuery', true);
  return connect('mongodb://localhost:27017/graphql-shield-demo');
}