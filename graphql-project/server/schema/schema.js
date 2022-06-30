const graphql = require('graphql');
const _ = require('lodash');
const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

// dummy data
// const usersData = [
//   { id: '1', name: 'Bond', age: 36, profession: 'Programmer' },
//   { id: '13', name: 'Anna', age: 26, profession: 'Baker' },
//   { id: '211', name: 'Bella', age: 16, profession: 'Mechanic' },
//   { id: '19', name: 'Gina', age: 26, profession: 'Painter' },
//   { id: '150', name: 'Georgina', age: 36, profession: 'Teacher' },
// ];

// const hobbiesData = [
//   {
//     id: '1',
//     title: 'Programming',
//     description: 'Using computers to make the world a better place',
//     userId: '150',
//   },
//   {
//     id: '2',
//     title: 'Rowing',
//     description: 'Sweat and feel better before easing donouts',
//     userId: '211',
//   },
//   {
//     id: '3',
//     title: 'Swimming',
//     description: 'Get in the water and learn to become the water',
//     userId: '211',
//   },
//   {
//     id: '4',
//     title: 'Fencing',
//     description: 'A hobby for fency people',
//     userId: '13',
//   },
//   {
//     id: '5',
//     title: 'Hiking',
//     description: 'Wear hiking boots and explore the world',
//     userId: '150',
//   },
// ];

// const postsData = [
//   { id: '1', comment: 'Building a Mind', userId: '1' },
//   { id: '2', comment: 'GraphQL is Amazing', userId: '1' },
//   { id: '3', comment: 'How to change the World', userId: '19' },
//   { id: '4', comment: 'How to change the World', userId: '211' },
//   { id: '5', comment: 'How to change the World', userId: '1' },
// ];

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return _.filter(postsData, { userId: parent.id });
        return Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return _.filter(hobbiesData, { userId: parent.id });
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Description for hobby',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId });
        return User.find({ id: parent.userId });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Description for post',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId });
        return User.find({ id: parent.userId });
      },
    },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(usersData, { id: args.id });
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        // return usersData;
        return User.find({});
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(hobbiesData, { id: args.id });
        Hobby.findById(args.id);
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return hobbiesData;
        return Hobby.find({ id: args.userId });
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(postsData, { id: args.id });
        return Post.findById(args.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return postsData;
        return Post.find({});
      },
    },
  },
});

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        const user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        return user.save();
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true } // send back the updated object
        ));
      },
    },
    createPost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    createHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
