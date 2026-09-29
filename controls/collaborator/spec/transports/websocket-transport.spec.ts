import { WebSocketTransport } from '../../src/transports/websocket-transport';

/**
 * Unit tests for WebSocketTransport.
 *
 * The browser-native `WebSocket` global is replaced with a fake constructor
 * for the duration of each test. The fake is a real function so `new
 * WebSocket(url)` from the source works, and each constructed instance
 * exposes the callbacks (`onopen`, `onerror`, `onclose`, `onmessage`) the
 * transport registers as directly-assignable properties.
 */
describe('WebSocketTransport', () => {

    const URL: string = 'ws://localhost:8080';

    interface FakeWebSocket {
        url: string;
        readyState: number;
        sent: string[];
        close: jasmine.Spy;
        onopen: ((ev: Event) => void) | null;
        onerror: ((ev: Event) => void) | null;
        onclose: ((ev: Event) => void) | null;
        onmessage: ((ev: MessageEvent) => void) | null;
    }

    interface FakeWebSocketCtor {
        (url: string): FakeWebSocket;
        OPEN: number;
        CLOSED: number;
        instances: FakeWebSocket[];
    }

    function makeFakeWebSocketFactory(): FakeWebSocketCtor {
        const instances: FakeWebSocket[] = [];
        const FakeWS: any = function (this: any, url: string): void {
            this.url = url;
            this.readyState = 0;            // CONNECTING
            this.sent = [] as string[];
            this.close = jasmine.createSpy('close');
            this.send = (data: string) => { (this.sent as string[]).push(data); };
            // Callbacks the source registers. Each starts as a noop; the
            // source replaces them by assignment, and the test fires them.
            this.onopen = (ev: Event) => { /* noop */ };
            this.onerror = (ev: Event) => { /* noop */ };
            this.onclose = (ev: Event) => { /* noop */ };
            this.onmessage = (ev: MessageEvent) => { /* noop */ };
            // Push `this` so the test sees the exact object the source
            // constructed (i.e. the one whose onopen/onerror/onclose/
            // onmessage the transport just assigned to).
            instances.push(this as FakeWebSocket);
        };
        FakeWS.OPEN = 1;
        FakeWS.CLOSED = 3;
        FakeWS.instances = instances;
        return FakeWS as FakeWebSocketCtor;
    }

    let originalWS: any;
    let FakeWS: FakeWebSocketCtor;

    beforeEach(() => {
        FakeWS = makeFakeWebSocketFactory();
        originalWS = (window as any).WebSocket;
        (window as any).WebSocket = FakeWS;
    });

    afterEach(() => {
        (window as any).WebSocket = originalWS;
    });

    function lastInstance(): FakeWebSocket {
        // Read the readyState (etc.) off the actual `this` instance the
        // source created, not a closure-captured stale reference.
        const idx: number = FakeWS.instances.length - 1;
        return FakeWS.instances[idx];
    }

    it('constructs with the provided URL', () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        expect(transport).toBeDefined();
    });

    it('connect() resolves when the socket opens', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        // Read live instance via the constructor's instances array; this
        // is the same object the source's `new WebSocket(url)` produced.
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        let resolved: boolean = false;
        try {
            await promise;
            resolved = true;
        } catch {
            resolved = false;
        }
        expect(resolved).toBe(true);
        expect(ws.url).toBe(URL);
    });

    it('connect() returns the same promise on concurrent calls', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const p1: Promise<void> = transport.connect();
        const p2: Promise<void> = transport.connect();
        expect(p1).toBe(p2);
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        let resolved: boolean = false;
        try {
            await p1;
            resolved = true;
        } catch {
            resolved = false;
        }
        expect(resolved).toBe(true);
        expect(FakeWS.instances.length).toBe(1);
    });

    it('connect() rejects when the socket errors', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        (ws.onerror as any)(new Event('error'));
        let rejected: boolean = false;
        try {
            await promise;
        } catch {
            rejected = true;
        }
        expect(rejected).toBe(true);
    });

    it('connect() dispatches "reconnected" on a subsequent open', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const first: Promise<void> = transport.connect();
        const ws1: FakeWebSocket = FakeWS.instances[0];
        ws1.readyState = 1;
        (ws1.onopen as any)({} as Event);
        await first;

        const received: any[] = [];
        transport.on('reconnected', (data: any) => { received.push(data); });

        // Force a disconnect. Because manuallyClosed is false, the
        // transport's onclose handler calls scheduleReconnect(), which
        // invokes `setTimeout(() => this.connect(), 1000)`. We wait long
        // enough for that timer to fire, then let the real connect() (not
        // a spy) construct a fresh fake socket and drive its onopen.
        (ws1.onclose as any)(new CloseEvent('close'));
        await new Promise<void>((r) => setTimeout(r, 1100));

        const ws2: FakeWebSocket = FakeWS.instances[1];
        expect(ws2).toBeDefined();
        ws2.readyState = 1;
        (ws2.onopen as any)({} as Event);
        // Yield so the dispatch runs in its microtask.
        await Promise.resolve();

        expect(received.length).toBe(1);
        expect(received[0]).toBeUndefined();
    });

    it('send() throws when the socket is not open', () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        // Never called connect(); socket is null.
        expect(() => transport.send('action', { x: 1 }))
            .toThrowError(/not open/i);
    });

    it('send() JSON-stringifies the { event, data } envelope', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        transport.send('action', { x: 1 });

        expect(ws.sent.length).toBe(1);
        expect(JSON.parse(ws.sent[0])).toEqual({ event: 'action', data: { x: 1 } });
    });

    it('onmessage parses a JSON envelope and dispatches the event', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        const received: any[] = [];
        transport.on('custom-event', (data: any) => { received.push(data); });

        (ws.onmessage as any)({ data: JSON.stringify({ event: 'custom-event', data: { hi: 1 } }) } as MessageEvent);

        expect(received).toEqual([{ hi: 1 }]);
    });

    it('onmessage ignores malformed JSON', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        expect(() => (ws.onmessage as any)({ data: 'not json {' } as MessageEvent)).not.toThrow();
    });

    it('onclose fires every registered close handler', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        const cb1: jasmine.Spy = jasmine.createSpy('cb1');
        const cb2: jasmine.Spy = jasmine.createSpy('cb2');
        transport.onClose(cb1);
        transport.onClose(cb2);

        (ws.onclose as any)(new CloseEvent('close'));

        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('disconnect() closes the socket and prevents reconnect', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        const closeCb: jasmine.Spy = jasmine.createSpy('closeCb');
        transport.onClose(closeCb);

        await transport.disconnect();

        expect(ws.close).toHaveBeenCalled();

        // Simulate the close event arriving after disconnect. Because
        // manuallyClosed is true, onclose must NOT call scheduleReconnect.
        // We assert this by ensuring no new WebSocket is constructed.
        const beforeCount: number = FakeWS.instances.length;
        (ws.onclose as any)(new CloseEvent('close'));
        expect(FakeWS.instances.length).toBe(beforeCount);
    });

    it('disconnect() is a no-op when never connected', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        let resolved: boolean = false;
        try {
            await transport.disconnect();
            resolved = true;
        } catch {
            resolved = false;
        }
        expect(resolved).toBe(true);
        expect(FakeWS.instances.length).toBe(0);
    });

    it('send() throws when the socket exists but is not OPEN', () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        // Start connecting but DO NOT await — the socket is now created
        // (so !this.socket is false) but its readyState is still 0
        // (CONNECTING), so the guard `readyState !== WebSocket.OPEN`
        // must throw. We discard the pending promise so it doesn't leak.
        void transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        expect(ws.readyState).toBe(0);
        expect(() => transport.send('action', { x: 1 }))
            .toThrowError(/not open/i);
    });

    it('on() supports multiple subscribers for the same event', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        const a: jasmine.Spy = jasmine.createSpy('a');
        const b: jasmine.Spy = jasmine.createSpy('b');
        transport.on('shared', a);
        transport.on('shared', b);

        (ws.onmessage as any)({ data: JSON.stringify({ event: 'shared', data: 42 }) } as MessageEvent);

        expect(a).toHaveBeenCalledWith(42);
        expect(b).toHaveBeenCalledWith(42);
    });

    it('dispatch ignores events with no registered handlers', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        // No transport.on(...) call for 'unheard'; must not throw.
        expect(() => (ws.onmessage as any)({
            data: JSON.stringify({ event: 'unheard', data: 1 })
        } as MessageEvent)).not.toThrow();
    });

    it('onerror after a successful connect does not affect anything', async () => {
        const transport: WebSocketTransport = new WebSocketTransport(URL);
        const promise: Promise<void> = transport.connect();
        const ws: FakeWebSocket = FakeWS.instances[0];
        ws.readyState = 1;
        (ws.onopen as any)({} as Event);
        await promise;

        // After the connection is established, pendingConnect is null.
        // An onerror at this point must NOT call reject (no observable
        // effect, just exercises the early-return branch).
        expect(() => (ws.onerror as any)(new Event('error'))).not.toThrow();
    });
});
