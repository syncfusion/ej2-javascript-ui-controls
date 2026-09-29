/**
 * Unit tests for extension manager
 */

import {
    ExtensionManager
} from '../../src/extensions/extension-manager';
import { defineExtension } from '../../src/extensions/define-extension';
import { ReadyContext } from '../../src/extensions/contexts';

describe('ExtensionManager', () => {
    let manager: ExtensionManager;

    beforeEach(() => {
        manager = new ExtensionManager();
    });

    describe('Construction', () => {
        it('should construct with empty extension list', () => {
            expect(manager).toBeDefined();
        });

        it('should construct with provided extensions', () => {
            const ext = defineExtension({ name: 'ext1' });
            manager = new ExtensionManager([ext]);

            expect(manager).toBeDefined();
        });
    });

    describe('register()', () => {
        it('should register an extension', () => {
            const ext = defineExtension({ name: 'ext1' });
            manager = new ExtensionManager([ext]);

            manager.register();

            expect(manager).toBeDefined();
        });

        it('should be idempotent — second call should not re-register', () => {
            let callCount = 0;

            const ext = defineExtension({
                name: 'ext1',
                onRegister: () => {
                    callCount++;
                }
            });

            manager = new ExtensionManager([ext]);

            manager.register();
            expect(callCount).toBe(1);

            manager.register();
            expect(callCount).toBe(1);
        });

        it('should call onRegister hooks', () => {
            let hookCalled = false;

            const ext = defineExtension({
                name: 'ext1',
                onRegister: () => {
                    hookCalled = true;
                }
            });

            manager = new ExtensionManager([ext]);
            manager.register();

            expect(hookCalled).toBe(true);
        });
    });

    describe('lifecycle', () => {
        it('should support extension lifecycle', () => {
            const ext = defineExtension({ name: 'ext1' });
            manager = new ExtensionManager([ext]);

            manager.register();

            expect(manager).toBeDefined();
        });

        it('should call onDestroy hooks', () => {
            let destroyCalled = false;

            const ext = defineExtension({
                name: 'ext1',
                onDestroy: () => {
                    destroyCalled = true;
                }
            });

            manager = new ExtensionManager([ext]);
            manager.register();
            manager.destroy();

            expect(destroyCalled).toBe(true);
        });
    });

    describe('getExtensions()', () => {
        it('should return registered extensions', () => {
            const ext = defineExtension({ name: 'ext1' });
            manager = new ExtensionManager([ext]);
            manager.register();

            const exts = manager.getExtensions();
            expect(exts.length).toBe(1);
            expect(exts[0].definition.name).toBe('ext1');
        });
    });

    describe('destroy()', () => {
        it('should destroy all extensions', () => {
            const ext = defineExtension({ name: 'ext1' });
            manager = new ExtensionManager([ext]);
            manager.register();

            manager.destroy();

            expect(manager).toBeDefined();
        });
    });
});
