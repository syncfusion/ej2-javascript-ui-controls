/**
 * Unit tests for extension context types
 *
 * These tests verify:
 * - RegisterContext and ReadyContext type definitions
 * - Context properties and phase gating
 */

import type {
    RegisterContext,
    ReadyContext,
    SchemaAccessor,
    CommandRegistrar,
    SelectionAccessor
} from '../../src/extensions/contexts';

describe('Context Types — Phase Gating', () => {
    describe('RegisterContext', () => {
        it('should have extensionName property', () => {
            const ctx: RegisterContext = {
                extensionName: 'test-extension'
            };

            expect(ctx.extensionName).toBe('test-extension');
        });
    });

    describe('ReadyContext', () => {
        it('should have extensionName property', () => {
            const ctx: ReadyContext = {
                extensionName: 'test-extension',
                schema: {} as any,
                commands: {} as any,
                selection: {} as any,
                editor: {} as any
            };

            expect(ctx.extensionName).toBe('test-extension');
        });

        it('should have schema property', () => {
            const schema: SchemaAccessor = {
                getNodeType: () => undefined,
                getMarkType: () => undefined
            };

            const ctx: ReadyContext = {
                extensionName: 'test-extension',
                schema,
                commands: {} as any,
                selection: {} as any,
                editor: {} as any
            };

            expect(ctx.schema).toBe(schema);
        });

        it('should have commands property', () => {
            const commands: CommandRegistrar = {
                register: () => { }
            };

            const ctx: ReadyContext = {
                extensionName: 'test-extension',
                schema: {} as any,
                commands,
                selection: {} as any,
                editor: {} as any
            };

            expect(ctx.commands).toBe(commands);
        });

        it('should have selection property', () => {
            const selection: SelectionAccessor = {
                getCurrent: () => ({} as any),
                isActive: () => false
            };

            const ctx: ReadyContext = {
                extensionName: 'test-extension',
                schema: {} as any,
                commands: {} as any,
                selection,
                editor: {} as any
            };

            expect(ctx.selection).toBe(selection);
        });

        it('should have editor property', () => {
            const editor = { readonly: true } as any;

            const ctx: ReadyContext = {
                extensionName: 'test-extension',
                schema: {} as any,
                commands: {} as any,
                selection: {} as any,
                editor
            };

            expect(ctx.editor).toBe(editor);
        });
    });
});
