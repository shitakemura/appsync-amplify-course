const graphql = require('graphql');
const _ = require('lodash')

// dummy data
const usersData = [
  {id: '1', name: 'Bond', age: 36, profession: "Programmer"},
  {id: '13', name: 'Anna', age: 26, profession: "Baker"},
  {id: '211', name: 'Bella', age: 16, profession: "Mechanic"},
  {id: '19', name: 'Gina', age: 26, profession: "Painter"},
  {id: '150', name: 'Georgina', age: 36, profession: "Teacher"},
]

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
    age: {type: GraphQLInt},
    profession: {type: GraphQLString}
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
        return _.find(usersData, {id: args.id})

        // get and return data from a datasource
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
