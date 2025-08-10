# GraphQL Practice - Fastify + TypeScript + Mercurius

A modern GraphQL API built with Fastify, TypeScript, and Mercurius (GraphQL adapter for Fastify).

## Features

- ⚡ **Fastify** - High-performance web framework
- 🚀 **GraphQL** with **Mercurius** - Fast GraphQL implementation
- 📝 **TypeScript** - Type-safe development
- 🎯 **TypeBox** - Runtime type validation
- 🔄 **DataLoaders** - Efficient batching and caching
- 📊 **GraphiQL** - Interactive GraphQL IDE
- 🔥 **Hot Reload** - Development with nodemon
- 📦 **Modular Architecture** - Organized schema and resolvers

## Tech Stack

- **Fastify** v5.4.0 - Web framework
- **Mercurius** v16.2.0 - GraphQL adapter
- **GraphQL** v16.11.0 - Query language
- **TypeScript** v5.9.2 - Type safety
- **TypeBox** - Schema validation
- **pnpm** - Package manager

## Project Structure

```
src/
├── server.ts              # Main server setup
├── graphql/
│   ├── schema.ts         # GraphQL schema definition
│   ├── resolvers.ts      # Main resolver aggregator
│   ├── loaders.ts        # DataLoaders for batching
│   └── resolvers/
│       ├── user.resolvers.ts
│       ├── post.resolvers.ts
│       ├── comment.resolvers.ts
│       ├── tag.resolvers.ts
│       ├── auth.resolvers.ts
│       └── scalar.resolvers.ts
└── data/
    └── mock-data.ts      # Mock data for development
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (or npm/yarn)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

### Development

Run the development server with hot reload:
```bash
pnpm dev
```

The server will start on `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking

## GraphQL API

### Access Points

- **GraphQL Endpoint**: `http://localhost:3000/graphql`
- **GraphiQL IDE**: `http://localhost:3000/graphiql`
- **Health Check**: `http://localhost:3000/health`

### Schema Overview

The API includes the following main types:

#### Types
- **User** - User accounts with roles (ADMIN, USER, MODERATOR)
- **Post** - Blog posts with status (DRAFT, PUBLISHED, ARCHIVED)
- **Comment** - Comments on posts
- **Tag** - Tags for categorizing posts

#### Features
- **Authentication** - Login, logout, token refresh
- **CRUD Operations** - Full CRUD for all entities
- **Pagination** - Cursor-based pagination for posts
- **Filtering** - Filter posts by status, author, tags
- **Search** - Search posts by query
- **Subscriptions** - Real-time updates for posts and comments
- **DataLoaders** - Efficient N+1 query prevention

### Example Queries

#### Get all posts with pagination
```graphql
query GetPosts {
  posts(
    pagination: { first: 10 }
    orderBy: "createdAt"
    orderDirection: "DESC"
  ) {
    edges {
      node {
        id
        title
        excerpt
        author {
          username
        }
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
      totalCount
    }
  }
}
```

#### Create a new post
```graphql
mutation CreatePost {
  createPost(input: {
    title: "My New Post"
    content: "This is the content..."
    status: PUBLISHED
  }) {
    id
    title
    status
    createdAt
  }
}
```

#### Subscribe to new comments
```graphql
subscription OnCommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    content
    author {
      username
    }
    createdAt
  }
}
```

## Performance Features

- **Mercurius** - Fast GraphQL execution with JIT compilation
- **DataLoaders** - Automatic batching of database queries
- **Fastify** - High-performance HTTP server
- **TypeScript** - Compiled for optimal runtime performance

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis caching
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] File uploads
- [ ] Testing suite
- [ ] Docker support
- [ ] API documentation

## License

MIT