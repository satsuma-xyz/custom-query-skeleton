// You can import types as you wish, but libraries you import will not be available in the VM where these functions are run.
// The available global libraries are:
// _ (lodash)
// moment
// knex
// console

import { Context, CustomQueryHelpers } from './schema'


// Do not change this export. Satsuma expects a non-default `resolvers` object to be exported from this file.
export const resolvers = {
    Query: {
        // ... - Your resolvers here


        custom_query_helpers: async (root: any, args: any, context: Context, info: any): Promise<CustomQueryHelpers> => {
            // Get a list of the fields that are being requested.
            const expectedFields = new Set<string>(info.fieldNodes[0].selectionSet.selections.map((selection: any) => selection.name.value));
            const result: CustomQueryHelpers = {};

            // This field is expensive, so let's only run it if it's requested.
            if (expectedFields.has('available_entity_tables')) {
                // See if the columns field is requested.
                const availableEntityTables = info.fieldNodes[0].selectionSet.selections.find((selection: any) => selection.name.value === 'available_entity_tables');
                const wantsColumns = availableEntityTables.selectionSet.selections.some((selection: any) => selection.name.value === 'columns');

                // Get the list of tables and their descriptions.
                result.available_entity_tables = await Promise.all(
                    Object.entries(context.db.entities.tablesRaw).map(async (table) => {
                        const [tableName, tableMapping] = table as [string, {description?: string; name: string, actualName: string}];
                        let columns: Array<string> = [];

                        // Expensive query, only run if requested
                        if (wantsColumns) {
                            columns = (
                                await context.db.entities.raw(
                                    `SELECT * FROM information_schema.columns WHERE table_schema = ? AND table_name = ?`,
                                    [context.db.entities.schema, tableMapping.actualName]
                                )
                            ).rows.map((row: any) => row.column_name);
                        }

                        return {
                            name: tableName,
                            description: tableMapping.description,
                            columns
                        }
                    }));
            }

            return result;
        }
    }
};
