import { IResolvers } from 'mercurius';
import { userResolvers } from './user.resolvers';
import { postResolvers } from './post.resolvers';
import { commentResolvers } from './comment.resolvers';
import { tagResolvers } from './tag.resolvers';
import { authResolvers } from './auth.resolvers';
import { scalarResolvers } from './scalar.resolvers';

export const resolvers: IResolvers = {
  ...scalarResolvers,
  
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...tagResolvers.Query,
    
    // Stats query
    stats: async (parent, args, context) => {
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
      subscribe: async (parent, args, { pubsub }) => {
        return pubsub.subscribe('POST_CREATED');
      },
    },
    postUpdated: {
      subscribe: async (parent, { id }, { pubsub }) => {
        return pubsub.subscribe(`POST_UPDATED_${id}`);
      },
    },
    commentAdded: {
      subscribe: async (parent, { postId }, { pubsub }) => {
        return pubsub.subscribe(`COMMENT_ADDED_${postId}`);
      },
    },
    userStatusChanged: {
      subscribe: async (parent, { userId }, { pubsub }) => {
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
    posts: async (parent, args, context) => {
      // This would typically load from database
      return [];
    },
  },
  
  Post: {
    author: async (parent, args, context) => {
      // Use dataloader to batch load authors
      return context.loaders.userLoader.load(parent.authorId);
    },
    tags: async (parent, args, context) => {
      // Load tags for post
      return [];
    },
    comments: async (parent, args, context) => {
      // Load comments for post
      return [];
    },
    excerpt: (parent) => {
      if (parent.excerpt) return parent.excerpt;
      // Generate excerpt from content
      return parent.content.substring(0, 200) + '...';
    },
  },
  
  Comment: {
    post: async (parent, args, context) => {
      return context.loaders.postLoader.load(parent.postId);
    },
    author: async (parent, args, context) => {
      return context.loaders.userLoader.load(parent.authorId);
    },
  },
  
  Tag: {
    posts: async (parent, args, context) => {
      // Load posts for tag
      return [];
    },
    postCount: async (parent, args, context) => {
      // Count posts for tag
      return 0;
    },
  },
};