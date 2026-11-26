import { CURRENT_WORKFLOW_SCHEMA_VERSION, WorkflowDefinitionModel } from '../models/workflow-definition';
import { WorkflowSchemaVersion } from '../models/workflow-enums';

/**
 * Compatibility and migration policy for persisted workflow JSON.
 * Unknown future versions are rejected by the serializer; 1.0 is upgraded to 1.1.
 *
 * @private
 */
export class SchemaMigrator {
    public static migrate(definition: WorkflowDefinitionModel): WorkflowDefinitionModel {
        const version: WorkflowSchemaVersion = (definition.schemaVersion || definition.version || '1.0') as WorkflowSchemaVersion;
        if (version === '1.0') {
            return {
                ...definition,
                schemaVersion: CURRENT_WORKFLOW_SCHEMA_VERSION
            };
        }
        return definition;
    }
}
