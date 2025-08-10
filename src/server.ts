import Fastify from 'fastify';
import mercurius from 'mercurius';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { schema } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { loaders } from './graphql/loaders';

const buildApp = async () => {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register GraphQL with Mercurius
  await fastify.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true, // Enable GraphiQL IDE
    ide: true, // Enable Mercurius GraphQL IDE
    path: '/graphql',
    context: (request, reply) => {
      // Add context that will be available to all resolvers
      return {
        request,
        reply,
        // Add authentication context here if needed
        // user: request.user
      };
    },
    subscription: {
      // Enable subscriptions
      context: (connection, request) => {
        return {
          // Add subscription context here
        };
      },
    },
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return fastify;
};

const start = async () => {
  try {
    const app = await buildApp();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    console.log(`🚀 GraphQL Server ready at http://localhost:${port}/graphql`);
    console.log(`📊 GraphiQL IDE available at http://localhost:${port}/graphiql`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

start();