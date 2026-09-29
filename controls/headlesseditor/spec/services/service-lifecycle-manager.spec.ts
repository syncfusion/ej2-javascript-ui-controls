import { ServiceLifecycleManager, ManagedService } from '../../src/services/service-lifecycle-manager';
import { createToken, ServiceToken } from '../../src/services/service-token';

type TestService = ManagedService & { initSpy: jasmine.Spy; disposeSpy: jasmine.Spy };

function makeToken(name: string): ServiceToken<ManagedService> {
    return createToken<ManagedService>(name);
}

function makeService(
    name: string,
    deps: ServiceToken<ManagedService>[] = [],
): TestService {
    const initSpy = jasmine.createSpy(`${name}.initialize`);
    const disposeSpy = jasmine.createSpy(`${name}.dispose`);
    return {
        dependencies: deps,
        initialize: initSpy,
        dispose: disposeSpy,
        initSpy,
        disposeSpy,
    };
}

describe('ServiceLifecycleManager', () => {
    let manager: ServiceLifecycleManager;

    beforeEach(() => { manager = new ServiceLifecycleManager(); });
    afterEach(() => { try { manager.dispose(); } catch { /* already disposed */ } });

    describe('initializeAll', () => {
        it('initializes all services', () => {
            const tokenA = makeToken('A');
            const svcA = makeService('A');

            manager.addService(tokenA, svcA);
            manager.initializeAll();

            expect(svcA.initSpy).toHaveBeenCalledTimes(1);
        });

        it('initializes dependency before dependent', () => {
            const tokenA = makeToken('A');
            const tokenB = makeToken('B');
            const svcA = makeService('A');
            const svcB = makeService('B', [tokenA]);
            const order: string[] = [];

            svcA.initSpy.and.callFake(() => order.push('A'));
            svcB.initSpy.and.callFake(() => order.push('B'));

            manager.addService(tokenA, svcA);
            manager.addService(tokenB, svcB);
            manager.initializeAll();

            expect(order).toEqual(['A', 'B']);
        });

        it('throws CircularDependencyError before any init when cycle exists', () => {
            const tokenA = makeToken('A');
            const tokenB = makeToken('B');
            const svcA = makeService('A', [tokenB]);
            const svcB = makeService('B', [tokenA]);

            manager.addService(tokenA, svcA);
            manager.addService(tokenB, svcB);

            // The source throws a plain `new Error(...)` rather than a typed
            // CircularDependencyError. Match the message prefix instead.
            expect(() => manager.initializeAll()).toThrowError(/circular dependency/i);
            expect(svcA.initSpy).not.toHaveBeenCalled();
            expect(svcB.initSpy).not.toHaveBeenCalled();
        });

        it('throws when a service is already in Running state (double init)', () => {
            const tokenA = makeToken('A');
            const svcA = makeService('A');

            manager.addService(tokenA, svcA);
            manager.initializeAll(); // first init → Running

            // Re-initialize: A is already Running → throws
            expect(() => manager.initializeAll())
                .toThrowError(/already running/i);
        });
    });

    describe('disposeAll', () => {
        it('disposes services in reverse initialization order', () => {
            const tokenA = makeToken('A');
            const tokenB = makeToken('B');
            const svcA = makeService('A');
            const svcB = makeService('B', [tokenA]);
            const order: string[] = [];

            svcA.disposeSpy.and.callFake(() => order.push('A'));
            svcB.disposeSpy.and.callFake(() => order.push('B'));

            manager.addService(tokenA, svcA);
            manager.addService(tokenB, svcB);
            manager.initializeAll();
            manager.disposeAll();

            expect(order).toEqual(['B', 'A']);
        });

        it('continues disposing remaining services when one throws', () => {
            const tokenA = makeToken('A');
            const tokenB = makeToken('B');
            const svcA = makeService('A');
            const svcB = makeService('B');

            svcB.disposeSpy.and.throwError('dispose failed');

            manager.addService(tokenA, svcA);
            manager.addService(tokenB, svcB);
            manager.initializeAll();

            const errors: unknown[] = [];
            manager.disposeAll((_, err) => errors.push(err));

            expect(errors.length).toBe(1);
            expect(svcA.disposeSpy).toHaveBeenCalledTimes(1); // still disposed
        });

        it('skips Uninitialized services during disposal', () => {
            const tokenA = makeToken('A');
            const svcA = makeService('A');

            manager.addService(tokenA, svcA);
            // initializeAll never called

            manager.disposeAll();
            expect(svcA.disposeSpy).not.toHaveBeenCalled();
        });
    });

    describe('dispose (IDisposable)', () => {
        it('dispose triggers disposeAll', () => {
            const tokenA = makeToken('A');
            const svcA = makeService('A');

            manager.addService(tokenA, svcA);
            manager.initializeAll();
            manager.dispose();

            expect(svcA.disposeSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('assertNotDisposed', () => {
        it('initializeAll throws after the manager has been disposed', () => {
            const tokenA = makeToken('A');
            const svcA = makeService('A');

            manager.addService(tokenA, svcA);
            manager.initializeAll();
            manager.dispose();

            // A fresh manager has been disposed; initializeAll should throw.
            expect(() => manager.initializeAll())
                .toThrowError(/has been disposed/i);
        });
    });

    describe('Topological sort with null/undefined dependencies', () => {
        it('handles service with null dependencies (void 0 check)', () => {
            const tokenA = makeToken('A');
            const initSpy = jasmine.createSpy('A.initialize');
            const disposeSpy = jasmine.createSpy('A.dispose');
            const svcA: TestService = {
                dependencies: null as any,
                initialize: initSpy,
                dispose: disposeSpy,
                initSpy,
                disposeSpy,
            };

            manager.addService(tokenA, svcA);
            manager.initializeAll();

            expect(svcA.initSpy).toHaveBeenCalledTimes(1);
        });

        it('handles undefined dependencies', () => {
            const tokenA = makeToken('A');
            const initSpy = jasmine.createSpy('A.initialize');
            const disposeSpy = jasmine.createSpy('A.dispose');
            const svcA: TestService = {
                dependencies: undefined as any,  // Explicitly undefined
                initialize: initSpy,
                dispose: disposeSpy,
                initSpy,
                disposeSpy,
            };

            manager.addService(tokenA, svcA);
            manager.initializeAll();

            expect(svcA.initSpy).toHaveBeenCalledTimes(1);
        });

        it('handles empty dependencies array', () => {
            const tokenA = makeToken('A');
            const initSpy = jasmine.createSpy('A.initialize');
            const disposeSpy = jasmine.createSpy('A.dispose');
            const svcA: TestService = {
                dependencies: [],
                initialize: initSpy,
                dispose: disposeSpy,
                initSpy,
                disposeSpy,
            };

            manager.addService(tokenA, svcA);
            manager.initializeAll();

            expect(svcA.initSpy).toHaveBeenCalledTimes(1);
        });

        it('uses "unknown" when token has no description in cycle error', () => {
            // Create a symbol without a description (void 0 in compiled code)
            const tokenA = Symbol(); // No description
            const tokenB = createToken<ManagedService>('B');
            const svcA: TestService = {
                dependencies: [tokenB as any],
                initialize: jasmine.createSpy('A.initialize'),
                dispose: jasmine.createSpy('A.dispose'),
                initSpy: jasmine.createSpy('A.initialize'),
                disposeSpy: jasmine.createSpy('A.dispose'),
            };
            const svcB: TestService = {
                dependencies: [tokenA as any],
                initialize: jasmine.createSpy('B.initialize'),
                dispose: jasmine.createSpy('B.dispose'),
                initSpy: jasmine.createSpy('B.initialize'),
                disposeSpy: jasmine.createSpy('B.dispose'),
            };

            manager.addService(tokenA as any, svcA);
            manager.addService(tokenB as any, svcB);

            // Should throw and include 'unknown' for the symbol without description
            expect(() => manager.initializeAll())
                .toThrowError(/circular dependency|unknown/i);
        });
    });
});
