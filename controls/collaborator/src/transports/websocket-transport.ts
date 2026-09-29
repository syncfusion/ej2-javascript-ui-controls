import { ICollaborationTransport } from './i-collaboration-transport';

/**
 * WebSocket transport for Node.js (ws + Redis) backends.
 *
 * Uses the browser-native `WebSocket` global (already present in
 * `lib: ["dom"]` in tsconfig). No extra runtime dependency needed.
 *
 * Wire contract (must match the server):
 *   Outgoing:  { event: string, data: any }   (JSON stringified)
 *   Incoming:  { event: string, data: any }   (JSON parsed)
 *
 * This transport handles only the connection lifecycle:
 *   - connect / disconnect
 *   - send / receive JSON envelopes
 *   - automatic reconnection with exponential backoff
 *   - event registration and dispatch
 *
 * No business logic (rooms, users, actions, OT) lives here.
 *
 * @private
 */
export class WebSocketTransport implements ICollaborationTransport {

    private socket: WebSocket | null = null;
    private handlers: Map<string, Array<(data: any) => void>> = new Map();
    private closeHandlers: Array<() => void> = [];
    private reconnectAttempts: number = 0;
    private readonly maxReconnectAttempts: number = 5;
    private manuallyClosed: boolean = false;
    private pendingConnect: Promise<void> | null = null;
    private hasConnected: boolean = false;

    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public connect(): Promise<void> {
        // Deduplicate concurrent connect() calls
        if (this.pendingConnect) {
            return this.pendingConnect;
        }

        this.manuallyClosed = false;
        this.pendingConnect = new Promise<void>((resolve: () => void, reject: (err: unknown) => void) => {
            try {
                const socket: WebSocket = new WebSocket(this.url);
                this.socket = socket;

                socket.onopen = () => {
                    // WebSocket connected
                    const isReconnect: boolean = this.hasConnected;
                    this.hasConnected = true;
                    this.reconnectAttempts = 0;
                    this.pendingConnect = null;
                    resolve();
                    if (isReconnect) {
                        this.dispatch('reconnected', undefined);
                    }
                };

                socket.onerror = (err: Event) => {
                    if (this.pendingConnect) {
                        this.pendingConnect = null;
                        reject(err);
                    }
                };

                socket.onclose = () => {
                    // WebSocket disconnected
                    for (const cb of this.closeHandlers) {
                        cb();
                    }
                    if (!this.manuallyClosed) {
                        this.scheduleReconnect();
                    }
                };

                socket.onmessage = (event: MessageEvent) => {
                    // Message received
                    let parsed: { event: string; data: any };
                    try {
                        parsed = JSON.parse(event.data as string);
                    } catch {
                        return; // ignore malformed frames
                    }
                    this.dispatch(parsed.event, parsed.data);
                };
            } catch (err) {
                this.pendingConnect = null;
                reject(err);
            }
        });

        return this.pendingConnect;
    }

    public send(event: string, data: any): void {
        // Sending event
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not open. Call connect() and await it first.');
        }
        this.socket.send(JSON.stringify({ event, data }));
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

    public disconnect(): Promise<void> {
        this.manuallyClosed = true;
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        return Promise.resolve();
    }

    private dispatch(event: string, data: any): void {
        const list: Array<(data: any) => void> | undefined = this.handlers.get(event);
        if (!list) { return; }
        for (const cb of list) {
            cb(data);
        }
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            return;
        }
        const delay: number = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 15000);
        this.reconnectAttempts++;
        setTimeout(() => {
            // Fire-and-forget; errors are surfaced through onclose + onerror.
            this.connect().catch(() => { /* swallow; onclose will retry again */ });
        }, delay);
    }
}
