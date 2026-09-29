/**
 * Provides the payload of a remote action dispatched by the
 * collaboration backend to the local editor.
 *
 * This envelope mirrors the wire contract used by both the
 * SignalR and WebSocket transports (`{ event, data }`) but is
 * exposed to consumers as a typed shape so that adapter
 * implementations do not need to use `any`.
 *
 * NOTE: `UserInfo` lives in its own file
 * (`./i-collaboration-user-info`) to avoid an intra-file type reference
 * that crashes TypeDoc 0.16.x's `getExportsOfModule` resolution.
 */
export interface ICollaborationActionData {
    /**
     * The logical name of the action (e.g. 'action', 'addUser', 'removeUser').
     */
    actionType: string;

    /**
     * The payload of the action.
     *
     * The concrete shape depends on the originating event:
     *  - For 'connectionId'  : a string holding the connection id.
     *  - For 'addUser'/'removeUser': a `UserInfo` payload.
     *  - For 'action'      : a product-specific OT envelope
     *                         (e.g. Syncfusion Document Editor's
     *                         `{ action, selection, version }`).
     */
    payload: string | object;
}
