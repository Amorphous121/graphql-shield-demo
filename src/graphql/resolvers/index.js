const { createPost, getPosts, authorFieldResolver } = require('./post.resolver');
const { createUser, getUsers, postsFieldResolver, login } = require('./user.resolver');

exports.resolvers = {
  Query: {
    getUsers,
    getPosts
  },

  Mutation: {
    createPost,
    createUser,
    login
  },

  User: {
    posts: postsFieldResolver
  },

  Post: {
    author: authorFieldResolver
  }
}