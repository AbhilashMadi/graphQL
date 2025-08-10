export const schema = `
  # Custom Scalars
  scalar DateTime

  # Enums
  enum UserRole {
    ADMIN
    USER
    MODERATOR
  }

  enum PostStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  # Types
  type User {
    id: ID!
    email: String!
    username: String!
    firstName: String
    lastName: String
    fullName: String
    role: UserRole!
    posts: [Post!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    status: PostStatus!
    author: User!
    authorId: ID!
    tags: [Tag!]!
    comments: [Comment!]!
    viewCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    publishedAt: DateTime
  }

  type Comment {
    id: ID!
    content: String!
    post: Post!
    postId: ID!
    author: User!
    authorId: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    posts: [Post!]!
    postCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Pagination Types
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
  }

  type PostEdge {
    node: Post!
    cursor: String!
  }

  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  # Input Types
  input CreateUserInput {
    email: String!
    username: String!
    password: String!
    firstName: String
    lastName: String
    role: UserRole
  }

  input UpdateUserInput {
    email: String
    username: String
    firstName: String
    lastName: String
    role: UserRole
  }

  input CreatePostInput {
    title: String!
    content: String!
    excerpt: String
    status: PostStatus
    tagIds: [ID!]
  }

  input UpdatePostInput {
    title: String
    content: String
    excerpt: String
    status: PostStatus
    tagIds: [ID!]
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
  }

  input CreateTagInput {
    name: String!
    slug: String
  }

  input PostFilterInput {
    status: PostStatus
    authorId: ID
    tagIds: [ID!]
  }

  input PaginationInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  # Queries
  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(limit: Int = 10, offset: Int = 0): [User!]!
    userByUsername(username: String!): User

    # Post queries
    post(id: ID!): Post
    posts(
      filter: PostFilterInput
      pagination: PaginationInput
      orderBy: String = "createdAt"
      orderDirection: String = "DESC"
    ): PostConnection!
    postsByUser(userId: ID!, limit: Int = 10, offset: Int = 0): [Post!]!
    searchPosts(query: String!, limit: Int = 10): [Post!]!

    # Comment queries
    comment(id: ID!): Comment
    commentsByPost(postId: ID!, limit: Int = 50, offset: Int = 0): [Comment!]!

    # Tag queries
    tag(id: ID!): Tag
    tagBySlug(slug: String!): Tag
    tags(limit: Int = 20, offset: Int = 0): [Tag!]!
    popularTags(limit: Int = 10): [Tag!]!

    # Stats queries
    stats: Stats!
  }

  # Mutations
  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    changePassword(oldPassword: String!, newPassword: String!): Boolean!

    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post!
    unpublishPost(id: ID!): Post!
    incrementPostView(id: ID!): Post!

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!

    # Tag mutations
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, name: String!, slug: String): Tag!
    deleteTag(id: ID!): Boolean!

    # Auth mutations
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    refreshToken(token: String!): AuthPayload!
  }

  # Subscriptions
  type Subscription {
    postCreated: Post!
    postUpdated(id: ID!): Post!
    commentAdded(postId: ID!): Comment!
    userStatusChanged(userId: ID!): User!
  }

  # Additional Types
  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
    expiresIn: Int!
  }

  type Stats {
    totalUsers: Int!
    totalPosts: Int!
    totalComments: Int!
    totalTags: Int!
    postsToday: Int!
    activeUsers: Int!
  }
`;