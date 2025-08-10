import { IResolvers } from 'mercurius';
import { mockUsers } from '../../data/mock-data';

export const authResolvers: Partial<IResolvers> = {
  Mutation: {
    login: async (parent, { email, password }, context) => {
      // In real app, verify password hash
      const user = mockUsers.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Generate tokens (in real app, use JWT)
      return {
        token: 'mock-jwt-token-' + user.id,
        refreshToken: 'mock-refresh-token-' + user.id,
        user,
        expiresIn: 3600, // 1 hour
      };
    },
    
    logout: async (parent, args, context) => {
      // In real app, invalidate token
      return true;
    },
    
    refreshToken: async (parent, { token }, context) => {
      // In real app, verify refresh token and generate new access token
      const userId = token.replace('mock-refresh-token-', '');
      const user = mockUsers.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('Invalid refresh token');
      }
      
      return {
        token: 'mock-jwt-token-' + user.id,
        refreshToken: 'mock-refresh-token-' + user.id,
        user,
        expiresIn: 3600,
      };
    },
  },
};