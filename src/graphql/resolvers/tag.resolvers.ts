import { IResolvers } from 'mercurius';
import { mockTags } from '../../data/mock-data';

export const tagResolvers: Partial<IResolvers> = {
  Query: {
    tag: async (parent, { id }, context) => {
      return mockTags.find(t => t.id === id) || null;
    },
    
    tagBySlug: async (parent, { slug }, context) => {
      return mockTags.find(t => t.slug === slug) || null;
    },
    
    tags: async (parent, { limit = 20, offset = 0 }, context) => {
      return mockTags.slice(offset, offset + limit);
    },
    
    popularTags: async (parent, { limit = 10 }, context) => {
      // In real app, sort by usage count
      return mockTags.slice(0, limit);
    },
  },
  
  Mutation: {
    createTag: async (parent, { input }, context) => {
      const slug = input.slug || input.name.toLowerCase().replace(/\s+/g, '-');
      const newTag = {
        id: String(mockTags.length + 1),
        ...input,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTags.push(newTag);
      return newTag;
    },
    
    updateTag: async (parent, { id, name, slug }, context) => {
      const tag = mockTags.find(t => t.id === id);
      if (!tag) {
        throw new Error('Tag not found');
      }
      
      tag.name = name;
      tag.slug = slug || name.toLowerCase().replace(/\s+/g, '-');
      tag.updatedAt = new Date();
      
      return tag;
    },
    
    deleteTag: async (parent, { id }, context) => {
      const tagIndex = mockTags.findIndex(t => t.id === id);
      if (tagIndex === -1) {
        return false;
      }
      
      mockTags.splice(tagIndex, 1);
      return true;
    },
  },
};