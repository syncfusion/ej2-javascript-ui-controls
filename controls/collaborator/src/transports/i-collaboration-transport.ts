/**
 * Transport abstraction for collaboration backends.
 *
 * Implementations:
 *   - SignalRTransport   -> ASP.NET Core (SignalR + Redis backplane)
 *   - WebSocketTransport -> Node.js (ws + Redis)
 *
 * Wire contract (WebSocketTransport):
 *   Outgoing: { event: string, data: any }
 *   Incoming: { event: string, data: any }
 *
 * The transport layer MUST NOT contain business logic
 * (rooms, users, actions, OT processing). It only handles
 * connection lifecycle and message dispatch.
 *
 * @private
 */
export type ConnectionType = 'signalr' | 'websocket';

/**
 * @private
 */
export interface ICollaborationTransport {

    /**
     * Establishes the underlying connection.
     * Resolves once the connection is open and ready to send.
     */
    connect(): Promise<void>;

    /**
     * Closes the underlying connection.
     */
    disconnect(): Promise<void>;

    /**
     * Sends a message to the server.
     *
     * @param event Logical event name (e.g. 'JoinGroup', 'action')
     * @param data  Payload
     */
    send(event: string, data: any): void;

    /**
     * Registers a callback for a logical event coming from the server.
     * Implementations should support multiple subscribers per event.
     */
    on(event: string, callback: (data: any) => void): void;

    /**
     * Registers a callback fired when the underlying connection closes.
     */
    onClose(callback: () => void): void;
}
