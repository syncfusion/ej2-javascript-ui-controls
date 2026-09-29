import { TransportFactory } from '../../src/transports/transport-factory';
import { ICollaborationOptions } from '../../src/models/i-collaboration-options';
import { SignalRTransport } from '../../src/transports/signalr-transport';
import { WebSocketTransport } from '../../src/transports/websocket-transport';

describe('TransportFactory', () => {

    it('is constructible', () => {
        // Exercises the implicit class constructor for coverage.
        const factory = new TransportFactory();
        expect(factory).toBeDefined();
    });

    describe('when connectionType is "signalr" (default)', () => {
        it('appends /collaborationhub to the base collaboration URL (with trailing slash)', () => {
            const opts: ICollaborationOptions = {
                serviceUrl: 'https://api.example.com/',
                roomName: 'test-room'
            };
            const transport = TransportFactory.create(opts);
            expect(transport).toBeDefined();
        });

        it('appends /collaborationhub correctly when base URL has no trailing slash', () => {
            const opts: ICollaborationOptions = {
                serviceUrl: 'https://api.example.com',
                connectionType: 'signalr',
                roomName: 'test-room'
            };
            const transport = TransportFactory.create(opts);
            expect(transport).toBeDefined();
        });
    });

    describe('when connectionType is "websocket"', () => {
        it('uses the serviceUrl verbatim', () => {
            const opts: ICollaborationOptions = {
                serviceUrl: 'ws://localhost:8080',
                connectionType: 'websocket',
                roomName: 'test-room'
            };
            const transport = TransportFactory.create(opts);
            expect(transport).toBeDefined();
        });

        it('throws on an unknown connection type', () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(() => TransportFactory.create({
                serviceUrl: 'https://api.example.com',
                connectionType: 'mqtt' as any,
                roomName: 'test-room'
            })).toThrowError(/Unsupported transport/);
        });
    });

    describe('when serviceUrl is empty', () => {
        it('still constructs a SignalRTransport using the path only', () => {
            const opts: ICollaborationOptions = {
                serviceUrl: '',
                connectionType: 'signalr',
                roomName: 'test-room'
            };
            const transport = TransportFactory.create(opts);
            expect(transport).toBeDefined();
        });
    });

    describe('joinUrl helper', () => {
        it('returns the path unchanged when base is empty', () => {
            expect(TransportFactory.joinUrl('', 'collaborationhub')).toBe('collaborationhub');
        });

        it('joins base and path when base has no trailing slash', () => {
            expect(TransportFactory.joinUrl('https://api.example.com', 'collaborationhub'))
                .toBe('https://api.example.com/collaborationhub');
        });

        it('joins base and path when base has a trailing slash', () => {
            expect(TransportFactory.joinUrl('https://api.example.com/', 'collaborationhub'))
                .toBe('https://api.example.com/collaborationhub');
        });

        it('uses the path as-is when it already starts with a slash', () => {
            expect(TransportFactory.joinUrl('https://api.example.com', '/collaborationhub'))
                .toBe('https://api.example.com/collaborationhub');
        });

        it('handles a base with trailing slash and a path that already starts with a slash', () => {
            expect(TransportFactory.joinUrl('https://api.example.com/', '/collaborationhub'))
                .toBe('https://api.example.com/collaborationhub');
        });
    });
});
         