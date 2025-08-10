import { IResolvers } from 'mercurius';
import { mockComments } from '../../data/mock-data';

export const commentResolvers: Partial<IResolvers> = {
  Query: {
    comment: async (parent, { id }, context) => {
      return mockComments.find(c => c.id === id) || null;
    },
    
    commentsByPost: async (parent, { postId, limit = 50, offset = 0 }, context) => {
      const postComments = mockComments.filter(c => c.postId === postId);
      return postComments.slice(offset, offset + limit);
    },
  },
  
  Mutation: {
    createComment: async (parent, { input }, context) => {
      const newComment = {
        id: String(mockComments.length + 1),
        ...input,
        authorId: '1', // Would come from context in real app
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockComments.push(newComment);
      
      // Emit subscription event
      if (context.pubsub) {
        context.pubsub.publish({
          topic: `COMMENT_ADDED_${input.postId}`,
          payload: { commentAdded: newComment },
        });
      }
      
      return newComment;
    },
    
    updateComment: async (parent, { id, content }, context) => {
      const comment = mockComments.find(c => c.id === id);
      if (!comment) {
        throw new Error('Comment not found');
      }
      
      comment.content = content;
      comment.updatedAt = new Date();
      
      return comment;
    },
    
    deleteComment: async (parent, { id }, context) => {
      const commentIndex = mockComments.findIndex(c => c.id === id);
      if (commentIndex === -1) {
        return false;
      }
      
      mockComments.splice(commentIndex, 1);
      return true;
    },
  },
};