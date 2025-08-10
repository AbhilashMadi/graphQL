import { IResolvers } from 'mercurius';
import { mockPosts } from '../../data/mock-data';

export const postResolvers: Partial<IResolvers> = {
  Query: {
    post: async (parent, { id }, context) => {
      return mockPosts.find(p => p.id === id) || null;
    },
    
    posts: async (parent, { filter, pagination, orderBy, orderDirection }, context) => {
      let filteredPosts = [...mockPosts];
      
      // Apply filters
      if (filter) {
        if (filter.status) {
          filteredPosts = filteredPosts.filter(p => p.status === filter.status);
        }
        if (filter.authorId) {
          filteredPosts = filteredPosts.filter(p => p.authorId === filter.authorId);
        }
      }
      
      // Sort
      filteredPosts.sort((a, b) => {
        const aValue = a[orderBy] || a.createdAt;
        const bValue = b[orderBy] || b.createdAt;
        const direction = orderDirection === 'ASC' ? 1 : -1;
        return aValue > bValue ? direction : -direction;
      });
      
      // Pagination
      const first = pagination?.first || 10;
      const paginatedPosts = filteredPosts.slice(0, first);
      
      return {
        edges: paginatedPosts.map((post, index) => ({
          node: post,
          cursor: Buffer.from(`cursor:${index}`).toString('base64'),
        })),
        pageInfo: {
          hasNextPage: filteredPosts.length > first,
          hasPreviousPage: false,
          startCursor: paginatedPosts.length > 0 ? Buffer.from('cursor:0').toString('base64') : null,
          endCursor: paginatedPosts.length > 0 
            ? Buffer.from(`cursor:${paginatedPosts.length - 1}`).toString('base64') 
            : null,
          totalCount: filteredPosts.length,
        },
      };
    },
    
    postsByUser: async (parent, { userId, limit = 10, offset = 0 }, context) => {
      const userPosts = mockPosts.filter(p => p.authorId === userId);
      return userPosts.slice(offset, offset + limit);
    },
    
    searchPosts: async (parent, { query, limit = 10 }, context) => {
      const searchTerm = query.toLowerCase();
      const results = mockPosts.filter(p => 
        p.title.toLowerCase().includes(searchTerm) || 
        p.content.toLowerCase().includes(searchTerm)
      );
      return results.slice(0, limit);
    },
  },
  
  Mutation: {
    createPost: async (parent, { input }, context) => {
      const newPost = {
        id: String(mockPosts.length + 1),
        ...input,
        authorId: '1', // Would come from context in real app
        status: input.status || 'DRAFT',
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: input.status === 'PUBLISHED' ? new Date() : null,
      };
      mockPosts.push(newPost);
      
      // Emit subscription event
      if (context.pubsub) {
        context.pubsub.publish({
          topic: 'POST_CREATED',
          payload: { postCreated: newPost },
        });
      }
      
      return newPost;
    },
    
    updatePost: async (parent, { id, input }, context) => {
      const postIndex = mockPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      
      mockPosts[postIndex] = {
        ...mockPosts[postIndex],
        ...input,
        updatedAt: new Date(),
      };
      
      // Emit subscription event
      if (context.pubsub) {
        context.pubsub.publish({
          topic: `POST_UPDATED_${id}`,
          payload: { postUpdated: mockPosts[postIndex] },
        });
      }
      
      return mockPosts[postIndex];
    },
    
    deletePost: async (parent, { id }, context) => {
      const postIndex = mockPosts.findIndex(p => p.id === id);
      if (postIndex === -1) {
        return false;
      }
      
      mockPosts.splice(postIndex, 1);
      return true;
    },
    
    publishPost: async (parent, { id }, context) => {
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }
      
      post.status = 'PUBLISHED';
      post.publishedAt = new Date();
      post.updatedAt = new Date();
      
      return post;
    },
    
    unpublishPost: async (parent, { id }, context) => {
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }
      
      post.status = 'DRAFT';
      post.publishedAt = null;
      post.updatedAt = new Date();
      
      return post;
    },
    
    incrementPostView: async (parent, { id }, context) => {
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }
      
      post.viewCount += 1;
      return post;
    },
  },
};