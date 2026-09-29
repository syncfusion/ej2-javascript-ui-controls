/**
 * Integration test — full bootstrap sequence.
 * Validates that DiagnosticsService → EventBus → ServiceRegistry →
 * lifecycleManager.initializeAll() → lifecycleManager.disposeAll() works end-to-end.
 */
import { DiagnosticsService } from '../../src/diagnostics/diagnostics-service';
import { EventBus } from '../../src/events/event-bus';
import { ServiceRegistry } from '../../src/services/service-registry';
import { ServiceLifecycleManager } from '../../src/services/service-lifecycle-manager';
import { ManagedService } from '../../src/services/service-lifecycle-manager';
import { createToken } from '../../src/services/service-token';
import { DiagnosticsToken, EventBusToken } from '../../src/services/built-in-tokens';

describe('Bootstrap sequence (integration)', () => {
    it('completes full init and dispose without errors', () => {
        // 1. Bootstrap singletons
        const diagnostics = new DiagnosticsService();
        const eventBus = new EventBus(diagnostics);
        const registry = new ServiceRegistry();

        // 2. Register bootstrap singletons into registry for consumers
        registry.register(DiagnosticsToken, diagnostics);
        registry.register(EventBusToken, eventBus);

        // 3. Create a custom managed service
        const customToken = createToken<ManagedService>('CustomService');
        let initialized = false;
        let disposed = false;
        const customService: ManagedService = {
            dependencies: [DiagnosticsToken, EventBusToken],
            initialize(): void { initialized = true; },
            dispose(): void { disposed = true; },
        };

        // 4. Register into lifecycle manager and init
        const lifecycleManager = new ServiceLifecycleManager();
        lifecycleManager.addService(customToken, customService);
        lifecycleManager.initializeAll();

        expect(initialized).toBe(true);

        // 5. Teardown
        lifecycleManager.disposeAll();
        expect(disposed).toBe(true);

        lifecycleManager.dispose();
        eventBus.dispose();
        registry.dispose();
        diagnostics.dispose();
    });

    it('DiagnosticsService captures EventBus subscriber errors', () => {
        const diagnostics = new DiagnosticsService();
        const eventBus = new EventBus(diagnostics);

        eventBus.subscribe('test', () => { throw new Error('subscriber boom'); });
        eventBus.publish({ type: 'test', payload: null });

        const entries = diagnostics.getEntries();
        expect(entries.length).toBe(1);
        expect(entries[0].level).toBe('error');
        expect(entries[0].message).toContain('subscriber boom');

        eventBus.dispose();
        diagnostics.dispose();
    });
});
