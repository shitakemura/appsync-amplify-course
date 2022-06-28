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

const hobbiesData = [
  {id: '1', title: 'Programming', description: 'Using computers to make the world a better place'},
  {id: '2', title: 'Rowing', description: 'Sweat and feel better before easing donouts'},
  {id: '3', title: 'Swimming', description: 'Get in the water and learn to become the water'},
  {id: '4', title: 'Fencing', description: 'A hobby for fency people'},
  {id: '5', title: 'Hiking', description: 'Wear hiking boots and explore the world'},
]

const postsData = [
  {id: '1', comment: 'Building a Mind'},
  {id: '2', comment: 'GraphQL is Amazing'},
  {id: '3', comment: 'How to change the World'},
]

const {
  GraphQLSchema,
  GraphQLObjectType, 
  GraphQLID,
  GraphQLString,
  GraphQLInt
} = graphql

// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    profession: {type: GraphQLString}
  })
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Description for hobby',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    description: {type: GraphQLString}
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Description for post',
  fields: () => ({
    id: {type: GraphQLID},
    comment: {type: GraphQLString}  
  })
});



// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(usersData, {id: args.id});
      }
    },
    hobby: {
      type: HobbyType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(hobbiesData, {id: args.id});
      }
    },
    post: {
      type: PostType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(postsData, {id: args.id});
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
