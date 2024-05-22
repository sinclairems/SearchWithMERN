const express = require("express");
const path = require("path");
const { ApolloServer } = require("apollo-server-express"); // Import ApolloServer
const { typeDefs, resolvers } = require("./schemas"); // Import your schema
const db = require("./config/connection");
const AuthService = require("./utils/auth"); // Import AuthService

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create an instance of Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Pass the request object to AuthService to get the token
    const token = AuthService.getToken({ req });
    return { token }; // Return the token in the context
  },
});

// Apply Apollo Server as middleware to the Express app
async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Wildcard route to serve index.html for all unmatched routes (important for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Start the server after the database connection is established
db.once("open", async () => {
  await startApolloServer(); // Start Apollo Server before listening
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
