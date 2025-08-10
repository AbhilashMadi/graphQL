import { IResolvers } from 'mercurius';
import { mockUsers } from '../../data/mock-data';

export const userResolvers: Partial<IResolvers> = {
  Query: {
    me: async (parent, args, context) => {
      // In a real app, get current user from context
      return mockUsers[0];
    },
    
    user: async (parent, { id }, context) => {
      return mockUsers.find(u => u.id === id) || null;
    },
    
    users: async (parent, { limit = 10, offset = 0 }, context) => {
      return mockUsers.slice(offset, offset + limit);
    },
    
    userByUsername: async (parent, { username }, context) => {
      return mockUsers.find(u => u.username === username) || null;
    },
  },
  
  Mutation: {
    createUser: async (parent, { input }, context) => {
      const newUser = {
        id: String(mockUsers.length + 1),
        ...input,
        role: input.role || 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newUser);
      return newUser;
    },
    
    updateUser: async (parent, { id, input }, context) => {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...input,
        updatedAt: new Date(),
      };
      
      return mockUsers[userIndex];
    },
    
    deleteUser: async (parent, { id }, context) => {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return false;
      }
      
      mockUsers.splice(userIndex, 1);
      return true;
    },
    
    changePassword: async (parent, { oldPassword, newPassword }, context) => {
      // In a real app, verify old password and update
      console.log('Password changed');
      return true;
    },
  },
};