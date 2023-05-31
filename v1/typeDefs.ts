// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console

// Do not change this export. Satsuma expects a non-default `resolvers` string to be exported from this file.
export const typeDefs = `
    type AvailableEntityTable {
        name: String!
        description: String
        columns: [String]
    }
    
    type CustomQueryHelpers {
      available_entity_tables: [AvailableEntityTable]
    }
    
    type Query {
        # Your type definitions here
        custom_query_helpers: CustomQueryHelpers
    }
`;
