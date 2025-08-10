import { IResolvers } from 'mercurius';
import { userResolvers } from './resolvers/user.resolvers';
import { postResolvers } from './resolvers/post.resolvers';
import { commentResolvers } from './resolvers/comment.resolvers';
import { tagResolvers } from './resolvers/tag.resolvers';
import { authResolvers } from './resolvers/auth.resolvers';
import { scalarResolvers } from './resolvers/scalar.resolvers';

export const resolvers: IResolvers = {
  ...scalarResolvers,
  
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...tagResolvers.Query,
    
    // Stats query
    stats: async () => {
      return {
        totalUsers: 100,
        totalPosts: 250,
        totalComments: 1500,
        totalTags: 50,
        postsToday: 5,
        activeUsers: 25,
      };
    },
  },
  
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...tagResolvers.Mutation,
    ...authResolvers.Mutation,
  },
  
  Subscription: {
    postCreated: {
      subscribe: async (_parent, _args, { pubsub }) => {
        return pubsub.subscribe('POST_CREATED');
      },
    },
    postUpdated: {
      subscribe: async (_parent, { id }, { pubsub }) => {
        return pubsub.subscribe(`POST_UPDATED_${id}`);
      },
    },
    commentAdded: {
      subscribe: async (_parent, { postId }, { pubsub }) => {
        return pubsub.subscribe(`COMMENT_ADDED_${postId}`);
      },
    },
    userStatusChanged: {
      subscribe: async (_parent, { userId }, { pubsub }) => {
        return pubsub.subscribe(`USER_STATUS_${userId}`);
      },
    },
  },
  
  // Field resolvers
  User: {
    fullName: (parent) => {
      if (parent.firstName && parent.lastName) {
        return `${parent.firstName} ${parent.lastName}`;
      }
      return parent.username;
    },
    posts: async () => {
      // This will be handled by the loader
      return [];
    },
  },
  
  Post: {
    excerpt: (parent) => {
      if (parent.excerpt) return parent.excerpt;
      // Generate excerpt from content
      return parent.content.substring(0, 200) + '...';
    },
  },
};