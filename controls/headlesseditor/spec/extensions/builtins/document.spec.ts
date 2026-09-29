/**
 * spec/extensions/builtins/document.spec.ts
 * Test suite for document built-in extension (root document node).
 */

import { documentExtension } from '../../../src/extensions/builtins/document';

describe('Document Extension', () => {
    describe('Metadata', () => {
        it('should have correct name', () => {
            expect(documentExtension.name).toBe('document');
        });

        it('should be defined and truthy', () => {
            expect(documentExtension).toBeTruthy();
        });

        it('should expose a nodes config function', () => {
            expect(typeof (documentExtension as any).config?.nodes).toBe('function');
        });
    });

    describe('Node Definition', () => {
        let nodeDefs: any;

        beforeEach(() => {
            nodeDefs = documentExtension.config.nodes?.() || [];
        });

        it('should contribute exactly one node', () => {
            expect(nodeDefs.length).toBe(1);
        });

        it('should define document node', () => {
            const doc = nodeDefs[0];
            expect(doc.name).toBe('document');
        });

        it('should be in root group', () => {
            const doc = nodeDefs[0];
            expect(doc.group).toBe('root');
        });

        it('should have block content (oneOrMore)', () => {
            const doc = nodeDefs[0];
            expect(doc.content).toBeDefined();
        });

        it('should not be a leaf node', () => {
            const doc = nodeDefs[0];
            expect(doc.leaf).toBeUndefined();
        });

        it('should not have attributes', () => {
            const doc = nodeDefs[0];
            expect(doc.attrs).toBeUndefined();
        });
    });
});
