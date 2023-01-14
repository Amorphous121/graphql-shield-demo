const PostModel = require('../../models/post.model');
const UserModel = require("../../models/user.model");

exports.createPost = async (parent, args, context, info) => {
  const { post: { title, description, author }} = args;
  const post = await PostModel.create({ title, description, author });
  return post.toObject();
}

exports.getPosts = async (parent, args, context, info) => {
  const posts = await PostModel.find().lean();
  return posts;
}


exports.authorFieldResolver = async (parent, args, context, info) => {
  const { author } = parent;
  const user = await UserModel.findOne({ _id: author }).lean();
  return user;
};