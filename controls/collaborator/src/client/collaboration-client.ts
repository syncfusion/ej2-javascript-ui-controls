import { CollaborationConnection } from '../connection';
import { ICollaborationOptions, ICollaborationActionData, ICollaborationProvider, UserInfo } from '../models';
import { ConnectionType } from '../transports/i-collaboration-transport';

/**
 * Options for the common collaboration client.
 *
 * This package is product-agnostic: it only orchestrates the
 * real-time collaboration transport (SignalR or WebSocket) and
 * delegates content concerns to the adapter via `ICollaborationProvider`.
 *
 * It deliberately does NOT know about any product-specific REST
 * API (e.g. Document Editor's `/api/CollaborativeEditing/ImportFile`).
 * If a product needs to load a document from a server, the product
 * (or its adapter) is responsible for making that HTTP call and
 * passing the resulting payload to `client.joinRoomAsync(...)`.
 */
export interface CollaborationClientOptions {
    /**
     * Service URL of the collaboration server.
     *
     * Note: The server should expose the required collaboration APIs such as UpdateAction, and GetActionsFromServer.
     * Examples:
     * Node.js Server -serviceUrl: "ws://localhost:8080"
     * ASP.NET Core + WebSocket -serviceUrl: "ws://localhost:62870"
     * ASP.NET Core + SignalR - serviceUrl: "http://localhost:62870"
     */
    serviceUrl: string;

    /**
     * Selects the backend transport.
     *  - 'signalr'   -> ASP.NET Core with SignalR (default)
     *  - 'websocket' -> Node.js with websocket or ASP.NET Core with websocket.
     */
    connectionType?: ConnectionType;
    currentUser: string;
    /**
     * Optional callback invoked when a remote peer enters the same room.
     * The current user is NOT reported on its own callback (remote peers only).
     * @param info Information about the user who joined.
     */
    onUserJoined?: (info: UserInfo) => void;
    /**
     * Optional callback invoked when a remote peer disconnects from the room.
     * @param info Information about the user who left.
     */
    onUserLeft?: (info: UserInfo) => void;
}

export class CollaborationClient {

    private connection: CollaborationConnection;
    private connectionId: string = '';
    private adapter: ICollaborationProvider;
    private options: CollaborationClientOptions;

    constructor(adapter: ICollaborationProvider, options: CollaborationClientOptions) {
        this.adapter = adapter;
        this.options = options;

        const connectionOptions: Partial<ICollaborationOptions> = {
            connectionType: options.connectionType
        };
        this.connection = new CollaborationConnection(options.serviceUrl, connectionOptions);
    }

    /**
     * Joins a collaboration room and attaches the real-time transport.
     *
     * The common package is product-agnostic: it does NOT parse
     * the response payload, does NOT know the document format,
     * and does NOT touch the adapter here. The sample is
     * responsible for:
     *
     *   1. Loading the document via its own product-specific API
     *   2. Wiring the adapter (whatever that means for the
     *      product `load`, `updateRoomInfo`, change-event
     *      subscription, etc.). The adapter is free to define
     *      any methods it needs; the only contract is
     *      `ICollaborationProvider.applyRemoteAction`.
     *   3. Then calling `client.joinRoomAsync(roomName)` to attach the
     *      real-time transport.
     *
     * This keeps the common package focused on transport
     * orchestration only.
     *
     * @param {string} roomName Identifier of the room to join.
     * @returns {Promise<void>} Resolves once the transport is connected and the join-group message has been sent.
     */
    public async joinRoomAsync(roomName: string): Promise<void> {
        await this.connection.connect(roomName, this.options.currentUser);
        // Preserve the original SignalR behavior: server expects an
        // explicit JoinGroup invocation after the connection is open.
        this.connection.sendJoinGroup();
        this.connection.onDataReceived(this.handleRemoteAction.bind(this));
        this.connection.onClosed(() => {
            alert('Connection lost. Please reload the browser.');
        });
    }

    private handleRemoteAction(action: string, data: ICollaborationActionData): void {
        if (action === 'connectionId' && typeof data.payload === 'string') {
            this.connectionId = data.payload;
        } else if (this.connectionId !== (data.payload as UserInfo).connectionId) {
            const userInfo: UserInfo = data.payload as UserInfo;
            if (this.options.onUserJoined && (action === 'action' || action === 'addUser')) {
                this.options.onUserJoined(userInfo);
            } else if (this.options.onUserLeft && action === 'removeUser') {
                this.options.onUserLeft(userInfo);
            }
        }
        this.adapter.applyRemoteAction(action, data);
    }

}
