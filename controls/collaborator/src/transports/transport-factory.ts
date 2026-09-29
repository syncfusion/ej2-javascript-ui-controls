import { ICollaborationOptions } from '../models';
import { ICollaborationTransport, ConnectionType } from './i-collaboration-transport';
import { SignalRTransport } from './signalr-transport';
import { WebSocketTransport } from './websocket-transport';

/**
 * Creates the appropriate transport based on configuration.
 *
 * The factory is the ONLY place that decides which concrete
 * transport to instantiate AND how to derive the connection URL.
 * Consumers receive the abstract `ICollaborationTransport` and stay
 * unaware of the backend.
 *
 * URL rules:
 *   - 'signalr'   : dials <serviceUrl> + '/collaborationhub'
 *   - 'websocket' : dials <serviceUrl> + '/ws'
 *
 * @private
 */
export class TransportFactory {

    private static readonly SIGNALR_HUB_PATH: string = 'collaborationhub';
    private static readonly WEBSOCKET_PATH: string = 'ws';

    public static create(options: ICollaborationOptions): ICollaborationTransport {
        const type: ConnectionType = options.connectionType || 'signalr';

        switch (type) {
        case 'signalr': {
            const hubUrl: string = this.joinUrl(options.serviceUrl, this.SIGNALR_HUB_PATH);
            return new SignalRTransport(hubUrl);
        }
        case 'websocket': {
            const wsUrl: string = this.joinUrl(options.serviceUrl, this.WEBSOCKET_PATH);
            return new WebSocketTransport(wsUrl);
        }
        default: {
            // Exhaustiveness check
            const _exhaustive: never = type;
            throw new Error(`Unsupported transport: ${_exhaustive as string}`);
        }
        }
    }

    public static joinUrl(base: string, path: string): string {
        if (!base) { return path; }
        const trimmed: string = base.endsWith('/') ? base.slice(0, -1) : base;
        const suffix: string = path.startsWith('/') ? path : '/' + path;
        return trimmed + suffix;
    }
}
