import { createToken, ServiceToken } from './service-token';
import { DiagnosticsService } from '../diagnostics/diagnostics-service';
import { EventBus } from '../events/event-bus';

/**
 * Well-known service tokens for bootstrap singletons.
 * These are registered into ServiceRegistry but NOT managed by ServiceLifecycleManager.
 *
 * @hidden
 */
export const DiagnosticsToken: ServiceToken<DiagnosticsService> = createToken<DiagnosticsService>('DiagnosticsService');
export const EventBusToken: ServiceToken<EventBus> = createToken<EventBus>('EventBus');
