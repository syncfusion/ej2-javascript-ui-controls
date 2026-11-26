import { WorkflowSchemaVersion } from './workflow-enums';
import { WorkflowConnection } from './workflow-connection';
import { WorkflowStep } from './workflow-step';
import { WorkflowStickyNote } from './workflow-sticky-note';

/**
 * @private
 */
export const WORKFLOW_SCHEMA_VERSIONS: WorkflowSchemaVersion[] = ['1.0', '1.1'];
/**
 * @private
 */
export const CURRENT_WORKFLOW_SCHEMA_VERSION: WorkflowSchemaVersion = '1.1';

/**
 * Defines a workflow in its saved JSON form. This is the object returned by `exportWorkflow`,
 * accepted by `importWorkflow`, and passed in the `workflow` argument of the workflow events.
 */
export interface WorkflowDefinitionModel {
    /**
     * The schema version of the workflow JSON. Workflows with version `'1.0'` or `'1.1'` can be
     * imported; exported workflows use `'1.1'`.
     *
     * @private
     */
    schemaVersion?: WorkflowSchemaVersion;

    /**
     * Legacy schema version field accepted on import; replaced by `schemaVersion` and never written on export.
     *
     * @private
     */
    version?: WorkflowSchemaVersion;

    /**
     * The unique identifier of the workflow.
     */
    id?: string;
    /**
     * The display name of the workflow.
     */
    name?: string;
    /**
     * The steps of the workflow.
     */
    workflowSteps: WorkflowStep[];
    /**
     * The connections between the workflow steps.
     */
    workflowConnections: WorkflowConnection[];
    /**
     * The sticky notes on the canvas. Sticky notes are documentation only and are not run.
     */
    stickyNotes?: WorkflowStickyNote[];
}
