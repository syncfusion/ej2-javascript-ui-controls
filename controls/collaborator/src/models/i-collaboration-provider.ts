import { ICollaborationActionData } from './i-collaboration-action-data';

/**
 * Adapter contract between the common collaboration package
 * and a product-specific editor (Document Editor, PDF Viewer,
 * Spreadsheet, etc.).
 *
 * The common package is intentionally minimal: it only ever
 * needs to push remote actions into the local editor. Everything
 * else — loading the document, wiring the editor's own change
 * events, calling product-specific REST endpoints — is the
 * adapter's responsibility and lives outside this contract.
 */
export interface ICollaborationProvider {

    /**
     * Apply a remote action received from the collaboration
     * backend to the local editor state.
     *
     * This is the ONLY method the common package calls on the
     * adapter at runtime. The adapter decides how to interpret
     * the action (e.g. dispatch to Syncfusion's internal
     * collaborative-editing handler, mutate its own OT model, etc.).
     *
     * @param action Logical action name from the server
     *               (e.g. 'action', 'addUser', 'removeUser').
     * @param data   Typed payload envelope (see {@link ICollaborationActionData}).
     */
    applyRemoteAction(action: string, data: ICollaborationActionData): void;
}
