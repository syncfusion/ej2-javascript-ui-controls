/**
 * Unit tests for ExtensionResolver
 * 
 * Tests the flattening and deduplication of nested extensions
 */

import { ExtensionResolver } from '../../src/extensions/extension-resolver';
import { defineExtension } from '../../src/extensions/define-extension';

describe('ExtensionResolver', () => {
    let resolver: ExtensionResolver;

    beforeEach(() => {
        resolver = new ExtensionResolver();
    });

    describe('resolve()', () => {
        it('should return empty array for empty extensions', () => {
            const result = resolver.resolve([]);
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should flatten single extension', () => {
            const ext = defineExtension({ name: 'test-ext' });
            const result = resolver.resolve([ext]);

            expect(result.length).toBe(1);
            expect(result[0].definition.name).toBe('test-ext');
            expect(result[0].registrationOrder).toBe(0);
        });

        it('should flatten multiple extensions', () => {
            const ext1 = defineExtension({ name: 'ext1' });
            const ext2 = defineExtension({ name: 'ext2' });
            const ext3 = defineExtension({ name: 'ext3' });

            const result = resolver.resolve([ext1, ext2, ext3]);

            expect(result.length).toBe(3);
            expect(result[0].definition.name).toBe('ext1');
            expect(result[1].definition.name).toBe('ext2');
            expect(result[2].definition.name).toBe('ext3');
        });

        it('should preserve registration order', () => {
            const ext1 = defineExtension({ name: 'ext1' });
            const ext2 = defineExtension({ name: 'ext2' });

            const result = resolver.resolve([ext1, ext2]);

            expect(result[0].registrationOrder).toBe(0);
            expect(result[1].registrationOrder).toBe(1);
        });

        it('should remove duplicate extensions by name', () => {
            const ext1 = defineExtension({ name: 'shared-ext' });
            const ext2 = defineExtension({ name: 'unique-ext' });
            const ext1Duplicate = defineExtension({ name: 'shared-ext' });

            const result = resolver.resolve([ext1, ext2, ext1Duplicate]);

            expect(result.length).toBe(2);
            expect(result[0].definition.name).toBe('shared-ext');
            expect(result[1].definition.name).toBe('unique-ext');
        });
    });
});
