const express = require('express');
const path = require('path');
const { ApolloServer } = require("apollo-server-express");//Apollo server
const db = require('./config/connection');//db conections
const routes = require('./routes');//db conections

//express server
const app = express();
const PORT = process.env.PORT || 3001;

//Apollo server to pass to schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

server.applyMiddleware({ app });

//middleware parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

// get all client file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/"));
});

db.once('open', () => {
  app.listen(PORT, () => 
  console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log('Use GraphQL at http://127.0.0.1:${PORT}${server.graphqlPath}')

});
