// Public schema API: type and builder interfaces only.
// SchemaDefinition, validators, DocumentSerializer, MigrationEngine, and SchemaMigration
// are intentionally NOT re-exported here — they are internal implementation details.
// Internal modules import them directly from their sub-barrels.
export * from './types/index';
