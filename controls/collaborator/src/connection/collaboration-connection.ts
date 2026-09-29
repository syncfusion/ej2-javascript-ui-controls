import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { ICollaborationActionData, ICollaborationOptions } from '../models';
import { ICollaborationTransport } from '../transports/i-collaboration-transport';
import { SignalRTransport, TransportFactory } from '../transports';

/**
 * Thin facade over `ICollaborationTransport` that preserves the
 * original public API consumed by `CollaborationClient`.
 *
 * The SignalR-specific methods (`getState`, `getConnection`) are
 * retained for backward compatibility; they return `undefined`
 * when the active transport is not SignalR.
 *
 * @private
 */
export class CollaborationConnection {

    private transport!: ICollaborationTransport;
    private serviceUrl: string;
    private options: ICollaborationOptions;
    private roomName: string = '';
    private currentUser: string = '';

    constructor(serviceUrl: string, options?: Partial<ICollaborationOptions>) {
        this.serviceUrl = serviceUrl;
        // Defaults preserve prior behavior (SignalR transport).
        // The hub path '/collaborationhub' is appended by the factory.
        this.options = {
            serviceUrl: serviceUrl,
            roomName: '',
            connectionType: 'signalr',
            ...options
        };
    }

    public async connect(roomName: string, currentUser: string): Promise<void> {
        this.roomName = roomName;
        this.currentUser = currentUser;
        this.options.roomName = roomName;

        this.transport = TransportFactory.create(this.options);
        await this.transport.connect();

        this.transport.on('reconnected', async () => { this.sendJoinGroup(); });
    }

    public onDataReceived(callback: (action: string, data: ICollaborationActionData) => void): void {
        if (!this.transport) {
            throw new Error('Transport is not initialized. Call connect() first.');
        }
        // The server emits logical event names like 'connectionId', 'addUser',
        // 'removeUser', 'action'. The transport dispatches them all here and
        // we re-emit with the same (action, data) signature the rest of the
        // code expects, wrapping the inner payload in a typed ICollaborationActionData
        // envelope.
        const knownEvents: string[] = ['connectionId', 'addUser', 'removeUser', 'action'];
        for (const evt of knownEvents) {
            this.transport.on(evt, (payload: any) => {
                const data: ICollaborationActionData = { actionType: evt, payload: payload };
                callback(evt, data);
            });
        }
    }

    public onClosed(callback: () => void): void {
        if (!this.transport) {
            throw new Error('Transport is not initialized. Call connect() first.');
        }
        this.transport.onClose(callback);
    }

    /**
     * Backward-compatible helper for sending a `JoinGroup` invocation.
     *
     * @returns {void} Resolves once the JoinGroup message has been dispatched to the transport.
     */
    public sendJoinGroup(): void {
        this.transport.send('JoinGroup', {
            roomName: this.roomName,
            currentUser: this.currentUser
        });
    }

    /**
     * @deprecated Kept for backward compatibility. Returns `undefined`
     * when the active transport is not SignalR.
     *
     * @returns {HubConnectionState | undefined} The current SignalR `HubConnectionState`, or `undefined` if the active transport is not SignalR.
     */
    public getState(): HubConnectionState | undefined {
        const conn: HubConnection | undefined = this.getConnection();
        return conn ? conn.state : undefined;
    }

    /**
     * @deprecated Kept for backward compatibility. Returns `undefined`
     * when the active transport is not SignalR.
     *
     * @returns {HubConnection | undefined} The underlying SignalR `HubConnection`, or `undefined` if the active transport is not SignalR.
     */
    public getConnection(): HubConnection | undefined {
        if (this.transport instanceof SignalRTransport) {
            return (this.transport as any).connection as HubConnection;
        }
        return undefined;
    }

    public async disconnect(): Promise<void> {
        if (this.transport) {
            await this.transport.disconnect();
        }
    }
}
