const { shield, rule, and, or, chain } = require("graphql-shield");
const { verify } = require("jsonwebtoken");
const UserModel = require("../../models/user.model");

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    let { token } = ctx;
    if (!token) return false;

    try {
      token = token.split(" ")[1];
      const payload = verify(token, "secret-key");
      const { _id } = payload;
      const user = await UserModel.findOne({ _id }).lean();
      if (!user) return false;
      ctx.user = user;
      console.log("RETURNING TRUE");
      return true;
    } catch (error) {
      console.log("Authentication Failed => ", error);
      return false;
    }
  }
);

const isAdmin = rule()(async (parent, args, ctx, info) => {
  const {
    user: { role = null },
  } = ctx;
  if (role && role === "admin") return true;
  return false;
});

const isUser = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    const {
      user: { role = null },
    } = ctx;
    if (role && role === "user") return true;
    return false;
  }
);

/* 
  NOTE
  1. [and, or] Are used for parellel Execution of rules.
  2. [chain] is used to sequential Execution of rules
*/

exports.permissions = shield({
  Query: {
    // getPosts: isAuthenticated
    // getPosts: or(isAuthenticated, isAdmin)
    // getPosts: chain(isAuthenticated, isAdmin),
    // getPosts: and(isAuthenticated, isUser)
    getPosts: chain(isAuthenticated, or(isAdmin, isUser))
  },
});
