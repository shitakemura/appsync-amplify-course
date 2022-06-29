const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;

app.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.fycgwjb.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen({ port: port }, () => {
      // localhost:4000
      console.log(`Listening for requests on my awesome port ${port}`);
    });
  })
  .catch((error) => console.log(`Error: ${error}`));
