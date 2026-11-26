import { WorkflowStep } from '../models/workflow-step';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';

/**
 * Handle action callbacks invoked by the native Diagram user handles
 *. Each callback mutates workflow state through
 * the public mutation boundary and never touches the Diagram model directly.
 *
 * @internal
 * @private
 */
export interface HandleActions {
    deleteItem: (id: string) => void;
    executeStep: (step: WorkflowStep) => void;
    addFromNode: (step: WorkflowStep, port: string) => void;
    addFromConnector: (connection: WorkflowConnection) => void;
    updateStickyNoteColor: (note: WorkflowStickyNote, fill: string) => void;
}

/**
 * Stable user-handle names exposed by the native Diagram selector.
 *
 * @private
 */
export const NODE_HANDLE_DELETE: string = 'wfDelete';
/**
 * NODE HANDLE EXECUTE.
 *
 * @private
 */
export const NODE_HANDLE_EXECUTE: string = 'wfExecute';
/**
 * NODE HANDLE ADD.
 *
 * @private
 */
export const NODE_HANDLE_ADD: string = 'wfAdd';
/**
 * CONNECTOR HANDLE ADD.
 *
 * @private
 */
export const CONNECTOR_HANDLE_ADD: string = 'wfConnectorAdd';
/**
 * CONNECTOR HANDLE DELETE.
 *
 * @private
 */
export const CONNECTOR_HANDLE_DELETE: string = 'wfConnectorDelete';
