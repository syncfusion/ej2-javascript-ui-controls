import {
    HubConnection,
    HubConnectionBuilder,
    HttpTransportType
} from '@microsoft/signalr';
import { ICollaborationTransport } from './i-collaboration-transport';

/**
 * SignalR transport for ASP.NET Core (SignalR + Redis backplane).
 *
 * This is a 1:1 port of the previous logic that lived inside
 * CollaborationConnection. It only handles the connection lifecycle
 * and event dispatch — no rooms / users / OT logic.
 *
 * Server contract:
 *   - Hub URL:    <hubUrl>  (the complete URL, including '/collaborationhub')
 *   - Outgoing:   connection.send(event, data)
 *   - Incoming:   connection.on('dataReceived', (action, payload) => ...)
 *                 where the server sends: { action: string, data: any }
 *
 * @private
 */
export class SignalRTransport implements ICollaborationTransport {

    private connection!: HubConnection;
    private handlers: Map<string, Array<(data: any) => void>> = new Map();
    private closeHandlers: Array<() => void> = [];

    /**
     * @param {string} hubUrl The complete SignalR hub URL
     *                       (e.g. 'https://api.example.com/collaborationhub').
     *                       The factory is responsible for URL composition.
     */
    private hubUrl: string;

    constructor(hubUrl: string) {
        this.hubUrl = hubUrl;
    }

    public async connect(): Promise<void> {
        this.connection = new HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        this.connection.onreconnected(async () => {
            // Re-raise a generic 'reconnected' so the higher layer can re-JoinGroup.
            this.dispatch('reconnected', undefined);
        });

        this.connection.on('dataReceived', (action: string, payload: any) => {
            // Normalize the (action, payload) shape to the { event, data } envelope
            // so this transport matches WebSocketTransport's wire contract.
            this.dispatch(action, payload);
        });

        this.connection.onclose(() => {
            for (const cb of this.closeHandlers) {
                cb();
            }
        });

        await this.connection.start();
    }

    public send(event: string, data: any): void {
        if (!this.connection) {
            throw new Error('SignalR connection is not initialized. Call connect() first.');
        }
        this.connection.send(event, data);
    }

    public on(event: string, callback: (data: any) => void): void {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event)!.push(callback);
    }

    public onClose(callback: () => void): void {
        this.closeHandlers.push(callback);
    }

    public async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
        }
    }

    private dispatch(event: string, data: any): void {
        const list: Array<(data: any) => void> | undefined = this.handlers.get(event);
        if (!list) { return; }
        for (const cb of list) {
            cb(data);
        }
    }
}
