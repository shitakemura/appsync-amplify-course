const graphql = require('graphql');

const {
  GraphQLSchema,
  GraphQLObjectType, 
  GraphQLString,
  GraphQLInt
} = graphql

// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    age: {type: GraphQLInt}
  })
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLString}},
      resolve(parent, args) {
        // get and return data from a datasource
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
