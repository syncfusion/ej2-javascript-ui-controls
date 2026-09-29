/**
 * every source file under src/errors/.
 */

import { SchemaValidationError } from '../../src/errors/schema-validation-error';
import { DeserializationError } from '../../src/errors/deserialization-error';
import { UnknownNodeTypeError } from '../../src/errors/unknown-node-type-error';
import { EditorLifecycleError } from '../../src/errors/editor-lifecycle-error';
import { validResult, invalidResult } from '../../src/errors/validation-error';

describe('Validation error types', () => {
    it('SchemaValidationError aggregates multiple errors in its message', () => {
        const err = new SchemaValidationError([
            { path: 'nodes.paragraph.attrs.align', message: 'invalid enum' },
            { path: 'nodes.heading', message: 'missing attrs' }
        ]);
        expect(err.errors.length).toBe(2);
        expect(err.message).toContain('nodes.paragraph.attrs.align');
        expect(err.message).toContain('nodes.heading');
        expect(err.name).toBe('SchemaValidationError');
    });

    it('SchemaValidationError is instanceof Error', () => {
        const err = new SchemaValidationError([{ path: '', message: 'x' }]);
        expect(err instanceof Error).toBe(true);
        expect(err instanceof SchemaValidationError).toBe(true);
    });

    it('DeserializationError preserves the cause', () => {
        const cause = new SyntaxError('Unexpected token');
        const err = new DeserializationError('bad json', cause);
        expect(err.cause).toBe(cause);
        expect(err.message).toContain('bad json');
    });

    it('UnknownNodeTypeError captures node type and id', () => {
        const err = new UnknownNodeTypeError('callout', 'n42');
        expect(err.nodeType).toBe('callout');
        expect(err.nodeId).toBe('n42');
        expect(err.message).toContain('callout');
        expect(err.message).toContain('n42');
    });

    it('validResult returns valid=true with empty errors', () => {
        const r = validResult();
        expect(r.valid).toBe(true);
        expect(r.errors).toEqual([]);
    });

    it('invalidResult returns valid=false with the supplied errors', () => {
        const r = invalidResult([{ path: 'x', message: 'bad' }]);
        expect(r.valid).toBe(false);
        expect(r.errors.length).toBe(1);
        expect(r.errors[0].path).toBe('x');
    });

    it('SchemaValidationError uses default message when error list is empty', () => {
        const err = new SchemaValidationError([]);

        expect(err.errors).toEqual([]);
        expect(err.message).toContain('document is invalid');
        expect(err.name).toBe('SchemaValidationError');
        expect(err instanceof SchemaValidationError).toBeTruthy();
    });

    it('DeserializationError can be created without a cause', () => {
        const err = new DeserializationError('just a message');
        expect(err.cause).toBeUndefined();
        expect(err.message).toBe('DeserializationError: just a message');
        expect(err.name).toBe('DeserializationError');
        expect(err instanceof Error).toBe(true);
        expect(err instanceof DeserializationError).toBe(true);
    });

    it('EditorLifecycleError preserves the supplied message and name', () => {
        const err = new EditorLifecycleError('Editor not initialized');
        expect(err.message).toBe('Editor not initialized');
        expect(err.name).toBe('EditorLifecycleError');
        expect(err instanceof Error).toBe(true);
        expect(err instanceof EditorLifecycleError).toBe(true);
    });

    it('SchemaValidationError exposes the original error list', () => {
        const list: { path: string; message: string }[] = [
            { path: 'a', message: 'm1' },
            { path: 'b', message: 'm2' },
            { path: 'c', message: 'm3' }
        ];
        const err = new SchemaValidationError(list);
        expect(err.errors).toBe(list);
        expect(err.message).toContain('a: m1');
        expect(err.message).toContain('b: m2');
        expect(err.message).toContain('c: m3');
    });

    it('invalidResult with empty array still reports valid=false', () => {
        const r = invalidResult([]);
        expect(r.valid).toBe(false);
        expect(r.errors).toEqual([]);
    });
    
});
