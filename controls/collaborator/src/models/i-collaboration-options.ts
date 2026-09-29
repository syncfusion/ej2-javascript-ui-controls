import { ConnectionType } from '../transports/i-collaboration-transport';

/**
 * @private
 */
export interface ICollaborationOptions {

    /**
     * URL of the collaboration server.
     *
     * Note: Use the full URL of the collaboration server. The server should expose the required collaboration APIs such as ImportFile, UpdateAction, and GetActionsFromServer.
     * Examples:
     * Node.js Server -serviceUrl: "ws://localhost:8080"
     * ASP.NET Core + WebSocket -serviceUrl: "ws://localhost:62870/ws"
     * ASP.NET Core + SignalR - serviceUrl: "http://localhost:62870/"
     */
    serviceUrl: string;

    /**
     * Transport abstraction for collaboration backends.
     *
     * Implementations:
     *   - SignalRTransport   -> ASP.NET Core (SignalR + Redis backplane)
     *   - WebSocketTransport ->  Node.js with websocket or ASP.NET Core with websocket
     *
     */
    connectionType?: ConnectionType;

    /**
     * Collaboration room identifier. Set internally by
     * `CollaborationConnection.connect()`; consumers do not
     * need to populate this when constructing the options.
     */
    roomName: string;
}

