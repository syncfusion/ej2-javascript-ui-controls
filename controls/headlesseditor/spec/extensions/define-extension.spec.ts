/**
 * Unit tests for defineExtension() factory and ExtensionDefinition behavior
 */

import {
    ExtensionConfig,
    ExtensionDefinition
} from '../../src/extensions/types';
import { defineExtension } from '../../src/extensions/define-extension';

describe('defineExtension()', () => {
    describe('factory function', () => {
        it('should create an immutable extension definition from config', () => {
            const config: ExtensionConfig = {
                name: 'test-ext'
            };

            const def = defineExtension(config);

            expect(def.name).toBe('test-ext');
        });
    });

    describe('immutability', () => {
        it('should seal the definition object', () => {
            const config: ExtensionConfig = {
                name: 'test-ext'
            };

            const def = defineExtension(config);

            expect(() => {
                (def as any).name = 'changed';
            }).toThrowError();
        });

        it('should not mutate the original config', () => {
            const config: ExtensionConfig = {
                name: 'test-ext'
            };

            const configCopy = { ...config };

            defineExtension(config);

            expect(config).toEqual(configCopy);
        });
    });

    describe('configure()', () => {
        it('should create a new definition with configured options', () => {
            interface TestOptions {
                value: string;
            }

            const config: ExtensionConfig<TestOptions> = {
                name: 'test-ext',
                defineOptions: () => ({ value: 'default' })
            };

            const def = defineExtension(config);
            const configured = def.configure({ value: 'custom' });

            expect(configured).not.toBe(def);
            expect(configured.name).toBe('test-ext');
        });
    });

    describe('extend()', () => {
        it('should return a new definition with overridden config', () => {
            const config: ExtensionConfig = {
                name: 'test-ext'
            };

            const def = defineExtension(config);
            const extended = def.extend({ name: 'extended-ext' });

            expect(extended).not.toBe(def);
            expect(extended.name).toBe('extended-ext');
            expect(def.name).toBe('test-ext');
        });
    });
});
