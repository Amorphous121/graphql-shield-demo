const { readFileSync } = require("fs");
const { join } = require("path");
const { ApolloServer } = require("@apollo/server");
const { ApolloServerPluginLandingPageLocalDefault } = require("@apollo/server/plugin/landingPage/default");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { connectDB } = require("./database");
const { resolvers } = require("./graphql/resolvers");
const { permissions } = require('./graphql/shield');

const typeDefs = readFileSync(
  join(__dirname, "graphql", "schema.graphql"),
  "utf-8"
);

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  plugins: [ ApolloServerPluginLandingPageLocalDefault() ]
});

connectDB()
  .then(async () => {
    const { url } = await startStandaloneServer(server, {
      listen: { path: "/graphql", port: 4000 },
      context: ({ req }) => {
        const { headers: { authorization = null } } = req;
        return Promise.resolve({ token: authorization })
      }
    });
    console.log(`🔥 Database Connected`);
    console.log(`🚀 Server is up and running at ${url}graphql`);
  })
  .catch((error) => {
    console.log("Error at  ====> ", error);
    process.exit(0);
  });
