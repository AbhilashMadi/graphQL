import { GraphQLScalarType, Kind } from 'graphql';
import { IResolvers } from 'mercurius';

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date time scalar type',
  serialize(value: any) {
    // Convert outgoing Date to ISO string
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: any) {
    // Convert incoming ISO string to Date
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      // Convert hard-coded AST string to Date
      return new Date(ast.value);
    }
    return null;
  },
});

export const scalarResolvers: Partial<IResolvers> = {
  DateTime: dateTimeScalar,
};