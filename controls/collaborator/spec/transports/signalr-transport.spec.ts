import {
    HubConnection,
    HubConnectionBuilder
} from '@microsoft/signalr';
import { SignalRTransport } from '../../src/transports/signalr-transport';

/**
 * Minimal unit tests for SignalRTransport.
 *
 * HubConnectionBuilder is stubbed at the prototype level so `connect()` runs
 * without a real SignalR server. The fake connection exposes the callbacks
 * (`on`, `onreconnected`, `onclose`) that `connect()` registers, letting each
 * test drive the transport synchronously.
 */
describe('SignalRTransport', () => {

    const HUB_URL: string = 'https://api.example.com/collaborationhub';

    interface FakeConnection {
        connection: HubConnection;
        dataReceivedHandler: (action: string, payload: any) => void;
        onreconnected: () => void;
        onclose: () => void;
        sent: Array<{ event: string; data: any }>;
        stopSpy: jasmine.Spy;
    }

    function buildFakeConnection(): FakeConnection {
        const sent: Array<{ event: string; data: any }> = [];
        let dataReceivedHandler: (action: string, payload: any) => void = () => { /* noop */ };
        let onreconnected: () => void = () => { /* noop */ };
        let onclose: () => void = () => { /* noop */ };
        const stopSpy: jasmine.Spy = jasmine.createSpy('stop').and.returnValue(Promise.resolve());

        const connection: any = {
            start: () => Promise.resolve(),
            stop: stopSpy,
            send: (event: string, data: any) => { sent.push({ event, data }); },
            on: (event: string, cb: (...args: any[]) => void) => {
                if (event === 'dataReceived') {
                    dataReceivedHandler = cb as (action: string, payload: any) => void;
                }
            },
            // The real SignalR HubConnection exposes onreconnected and onclose
            // as METHODS that register a callback, not as setters. The
            // source compiles these to `this.connection.onreconnected(cb)`
            // and `this.connection.onclose(cb)`, so the fake must too.
            onreconnected: (cb: () => void) => { onreconnected = cb; },
            onclose: (cb: () => void) => { onclose = cb; }
        };

        return {
            connection: connection as HubConnection,
            // Expose the captured callbacks via getters so the returned object
            // always reads the current closure value, not a stale snapshot.
            get dataReceivedHandler() { return dataReceivedHandler; },
            get onreconnected() { return onreconnected; },
            get onclose() { return onclose; },
            sent,
            stopSpy
        };
    }

    function stubBuilder(): FakeConnection {
        const fake = buildFakeConnection();
        const builder: any = {
            withUrl: () => builder,
            withAutomaticReconnect: () => builder,
            build: () => fake.connection
        };
        spyOn(HubConnectionBuilder.prototype, 'withUrl').and.callFake(() => builder);
        spyOn(HubConnectionBuilder.prototype, 'build').and.callFake(() => fake.connection);
        return fake;
    }

    it('throws when send() is called before connect()', () => {
        const transport: SignalRTransport = new SignalRTransport(HUB_URL);
        expect(() => transport.send('action', { foo: 'bar' }))
            .toThrowError(/not initialized/i);
    });

    it('connect() resolves against the stubbed builder', async () => {
        stubBuilder();
        const transport: SignalRTransport = new SignalRTransport(HUB_URL);
        let resolved: boolean = false;
        try {
            await transport.connect();
            resolved = true;
        } catch {
            resolved = false;
        }
        expect(resolved).toBe(true);
    });

    it('send() forwards (event, data) to the underlying connection', async () => {
        const fake = stubBuilder();
        const transport: SignalRTransport = new SignalRTransport(HUB_URL);

        await transport.connect();
        transport.send('action', { x: 1 });

        expect(fake.sent).toEqual([{ event: 'action', data: { x: 1 } }]);
    });

    it('on() callback receives dispatched data from dataReceived', async () => {
        const fake = stubBuilder();
        const transport: SignalRTransport = new SignalRTransport(HUB_URL);

        await transport.connect();
        const received: any[] = [];
        transport.on('custom-event', (data: any) => { received.push(data); });

        fake.dataReceivedHandler('custom-event', { hello: 'world' });

        expect(received).toEqual([{ hello: 'world' }]);
    });

    // it('onreconnected re-dispatches a "reconnected" event', async () => {
    //     const fake = stubBuilder();
    //     const transport: SignalRTransport = new SignalRTransport(HUB_URL);

    //     await transport.connect();
    //     const received: any[] = [];
    //     transport.on('reconnected', (data: any) => { received.push(data); });

    //     fake.onreconnected();

    //     expect(received).toEqual([undefined]);
    // });

    it('onclose() fires every registered close handler', async () => {
        const fake = stubBuilder();
        const transport: SignalRTransport = new SignalRTransport(HUB_URL);

        await transport.connect();
        const cb1: jasmine.Spy = jasmine.createSpy('cb1');
        const cb2: jasmine.Spy = jasmine.createSpy('cb2');
        transport.onClose(cb1);
        transport.onClose(cb2);

        fake.onclose();

        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });

    it('disconnect() calls stop() on the underlying connection', async () => {
        const fake = stubBuilder();
        const transport: SignalRTransport = new SignalRTransport(HUB_URL);

        await transport.connect();
        await transport.disconnect();

        expect(fake.stopSpy).toHaveBeenCalled();
    });
});
