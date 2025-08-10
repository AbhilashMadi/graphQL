import { MercuriusLoaders } from 'mercurius';
import { mockUsers, mockPosts, mockComments, mockTags } from '../data/mock-data';

export const loaders: MercuriusLoaders = {
  User: {
    async posts(queries, { reply }) {
      // Batch load posts for multiple users
      const results = queries.map(({ obj }) => {
        return mockPosts.filter(post => post.authorId === obj.id);
      });
      return results;
    },
  },
  
  Post: {
    async author(queries, { reply }) {
      // Batch load authors for multiple posts
      const authorIds = queries.map(({ obj }) => obj.authorId);
      const uniqueIds = [...new Set(authorIds)];
      
      const authors = uniqueIds.reduce((acc, id) => {
        const author = mockUsers.find(u => u.id === id);
        if (author) acc[id] = author;
        return acc;
      }, {} as Record<string, any>);
      
      return queries.map(({ obj }) => authors[obj.authorId] || null);
    },
    
    async tags(queries, { reply }) {
      // Batch load tags for multiple posts
      // In real app, this would query the database
      return queries.map(() => []);
    },
    
    async comments(queries, { reply }) {
      // Batch load comments for multiple posts
      const results = queries.map(({ obj }) => {
        return mockComments.filter(comment => comment.postId === obj.id);
      });
      return results;
    },
  },
  
  Comment: {
    async post(queries, { reply }) {
      // Batch load posts for multiple comments
      const postIds = queries.map(({ obj }) => obj.postId);
      const uniqueIds = [...new Set(postIds)];
      
      const posts = uniqueIds.reduce((acc, id) => {
        const post = mockPosts.find(p => p.id === id);
        if (post) acc[id] = post;
        return acc;
      }, {} as Record<string, any>);
      
      return queries.map(({ obj }) => posts[obj.postId] || null);
    },
    
    async author(queries, { reply }) {
      // Batch load authors for multiple comments
      const authorIds = queries.map(({ obj }) => obj.authorId);
      const uniqueIds = [...new Set(authorIds)];
      
      const authors = uniqueIds.reduce((acc, id) => {
        const author = mockUsers.find(u => u.id === id);
        if (author) acc[id] = author;
        return acc;
      }, {} as Record<string, any>);
      
      return queries.map(({ obj }) => authors[obj.authorId] || null);
    },
  },
  
  Tag: {
    async posts(queries, { reply }) {
      // Batch load posts for multiple tags
      // In real app, this would query the database
      return queries.map(() => []);
    },
  },
};