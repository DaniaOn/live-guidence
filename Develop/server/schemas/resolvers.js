const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password');
  
            return userData;
        }
      throw new AuthenticationError("Error: Invalid User. Please login or register");
    },
  },

  Mutation: {
    addUser: async (parent, { name, email, password }) => {
      const user = await User.create({ name, email, password });
      const token = signToken(user);

      return { token, user};
    },
    login: async (_parent, { email, password }) => {
      const profile = await user.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No profile with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(profile);
      return { token, profile };
    },

    removeBook: async (parent, { book }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: book } },
              { new: true }
            );
            return updatedUser;
          }
          throw new AuthenticationError('No profile with this email found, please login or register"!');
        },
    },
};
    

module.exports = resolvers;