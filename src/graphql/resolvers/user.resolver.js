const { GraphQLError } = require("graphql");
const { sign } = require('jsonwebtoken');
const UserModel = require("../../models/user.model");
const PostModel = require("../../models/post.model");

exports.createUser = async (parent, args, context, info) => {
  const {
    user: { username, password },
  } = args;
  const user = await UserModel.create({ username, password });
  return user.toObject();
};

exports.getUsers = async (parent, args, context, info) => {
  const users = await UserModel.find().lean();
  return users;
};

exports.postsFieldResolver = async (parent, args, context, info) => {
  const { _id } = parent;
  const posts = await PostModel.find({ author: _id }).lean();
  return posts;
};

exports.login = async (parent, args, context, info) => {
  const {
    loginData: { username, password },
  } = args;

  const user = await UserModel.findOne({ username });

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) throw new GraphQLError('Invalid Credentials');

  const payload = { _id: user._id };
  
  const token = sign(payload, 'secret-key');
  return 'Bearer ' + token;
  
}