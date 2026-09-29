/**
 * Unit tests for LifecycleRunner
 * 
 * Tests execution of extension lifecycle hooks in the correct order:
 * Register → Ready → Destroy
 */

import { LifecycleRunner } from '../../src/extensions/lifecycle-runner';
import { defineExtension } from '../../src/extensions/define-extension';
import { ExtensionLifecycleState } from '../../src/extensions/types';
import type { FlattenedExtension } from '../../src/extensions/types';

describe('LifecycleRunner', () => {
    let runner: LifecycleRunner;

    beforeEach(() => {
        runner = new LifecycleRunner();
    });

    describe('runRegister()', () => {
        it('should execute onRegister hook', () => {
            let registerCalled = false;
            const ext = defineExtension({
                name: 'test-ext',
                onRegister: () => { registerCalled = true; }
            });

            const flattened: FlattenedExtension[] = [{
                definition: ext,
                registrationOrder: 0
            }];

            runner.runRegister(flattened);

            expect(registerCalled).toBe(true);
            expect(runner.getState('test-ext')).toBe(ExtensionLifecycleState.Registered);
        });

        it('should handle missing onRegister hook', () => {
            const ext = defineExtension({ name: 'test-ext' });

            const flattened: FlattenedExtension[] = [{
                definition: ext,
                registrationOrder: 0
            }];

            runner.runRegister(flattened);

            expect(runner.getState('test-ext')).toBe(ExtensionLifecycleState.Registered);
        });
    });

    describe('runReady()', () => {
        it('should execute onReady hook for registered extensions', () => {
            let readyCalled = false;
            const ext = defineExtension({
                name: 'test-ext',
                onReady: () => { readyCalled = true; }
            });

            const flattened: FlattenedExtension[] = [{
                definition: ext,
                registrationOrder: 0
            }];

            runner.runRegister(flattened);
            runner.runReady(flattened);

            expect(readyCalled).toBe(true);
            expect(runner.getState('test-ext')).toBe(ExtensionLifecycleState.Ready);
        });
    });

    describe('runDestroy()', () => {
        it('should execute onDestroy hook in reverse registration order', () => {
            let order: string[] = [];

            const ext1 = defineExtension({
                name: 'ext1',
                onDestroy: () => { order.push('ext1'); }
            });

            const ext2 = defineExtension({
                name: 'ext2',
                onDestroy: () => { order.push('ext2'); }
            });

            const flattened: FlattenedExtension[] = [
                { definition: ext1, registrationOrder: 0 },
                { definition: ext2, registrationOrder: 1 }
            ];

            runner.runRegister(flattened);
            runner.runReady(flattened);
            runner.runDestroy(flattened);

            // Destroy should be called in reverse order
            expect(order).toEqual(['ext2', 'ext1']);
        });
    });

    describe('getState()', () => {
        it('should return lifecycle state of extension', () => {
            const ext = defineExtension({ name: 'test-ext' });

            const flattened: FlattenedExtension[] = [{
                definition: ext,
                registrationOrder: 0
            }];

            runner.runRegister(flattened);
            expect(runner.getState('test-ext')).toBe(ExtensionLifecycleState.Registered);
        });

        it('should return undefined for unknown extension', () => {
            expect(runner.getState('unknown-ext')).toBeUndefined();
        });
    });

    describe('getAllStates()', () => {
        it('should return snapshot of all lifecycle states', () => {
            const ext1 = defineExtension({ name: 'ext1' });
            const ext2 = defineExtension({ name: 'ext2' });

            const flattened: FlattenedExtension[] = [
                { definition: ext1, registrationOrder: 0 },
                { definition: ext2, registrationOrder: 1 }
            ];

            runner.runRegister(flattened);
            const states = runner.getAllStates();

            expect(states['ext1']).toBe(ExtensionLifecycleState.Registered);
            expect(states['ext2']).toBe(ExtensionLifecycleState.Registered);
        });
    });

    describe('reset()', () => {
        it('should clear all lifecycle state', () => {
            const ext = defineExtension({ name: 'test-ext' });

            const flattened: FlattenedExtension[] = [{
                definition: ext,
                registrationOrder: 0
            }];

            runner.runRegister(flattened);
            expect(runner.getState('test-ext')).toBe(ExtensionLifecycleState.Registered);

            runner.reset();
            expect(runner.getState('test-ext')).toBeUndefined();
        });
    });
});
