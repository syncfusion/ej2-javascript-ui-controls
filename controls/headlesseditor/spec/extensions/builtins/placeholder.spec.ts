import { placeholderExtension } from '../../../src/extensions/builtins/placeholder';

describe('Built-in: placeholder', () => {
    const scope = { options: {} } as any;

    it('should have correct name', () => {
        expect(placeholderExtension.name).toBe('placeholder');
    });

    it('should provide default options', () => {
        const options = placeholderExtension.config.defineOptions!();
        expect(options).toEqual({
            placeholder: 'Write something...',
            emptyNodeClass: 'e-placeholder-is-empty',
            emptyEditorClass: 'e-placeholder-is-editor-empty',
            dataAttribute: 'data-placeholder',
            showOnlyCurrent: true,
            showOnlyWhenEditable: true,
            includeChildren: true,
            showOnlyWhenEditorEmpty: true
        });
    });

    it('should return new options object on each call', () => {
        const first = placeholderExtension.config.defineOptions!();
        const second = placeholderExtension.config.defineOptions!();
        expect(first).not.toBe(second);
    });

    it('should contribute one placeholder plugin', () => {
        const plugins =placeholderExtension.config.plugins!.call(scope);
        expect(plugins.length).toBe(1);
    });

    it('should create plugin using default configuration', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: {} } as any);
        expect(plugins.length).toBe(1);
    });

    it('should create plugin when custom placeholder text is supplied', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { placeholder: 'Enter content' } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should create plugin when placeholder is provided as callback', () => {
        const placeholder = (context: { nodeType: string }) => `Enter ${context.nodeType}`;
        const plugins = placeholderExtension.config.plugins!.call({ options: { placeholder } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should create plugin when emptyNodeClass is provided as callback', () => {
        const emptyNodeClass = (context: { nodeType: string }) => `empty-${context.nodeType}`;
        const plugins = placeholderExtension.config.plugins!.call({ options: { emptyNodeClass } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support custom emptyNodeClass', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { emptyNodeClass: 'custom-empty' } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support custom emptyEditorClass', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { emptyEditorClass: 'custom-editor-empty' } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support custom data attribute', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { dataAttribute: 'data-custom-placeholder' } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support showOnlyCurrent option', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { showOnlyCurrent: false } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support showOnlyWhenEditable option', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { showOnlyWhenEditable: false } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support includeChildren option', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { includeChildren: false } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support showOnlyWhenEditorEmpty option', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: { showOnlyWhenEditorEmpty: false } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should support fully customized configuration', () => {
        const plugins = placeholderExtension.config.plugins!.call({
                options: {
                    placeholder: 'Custom placeholder',
                    emptyNodeClass: 'custom-node',
                    emptyEditorClass: 'custom-editor',
                    dataAttribute: 'data-custom',
                    showOnlyCurrent: false,
                    showOnlyWhenEditable: false,
                    includeChildren: false,
                    showOnlyWhenEditorEmpty: false
                } } as any);
        expect(plugins.length).toBe(1);
    });

    it('should provide default options', () => {
        const options = placeholderExtension.config.defineOptions!();
        expect(options).toEqual({
            placeholder: 'Write something...',
            emptyNodeClass: 'e-placeholder-is-empty',
            emptyEditorClass: 'e-placeholder-is-editor-empty',
            dataAttribute: 'data-placeholder',
            showOnlyCurrent: true,
            showOnlyWhenEditable: true,
            includeChildren: true,
            showOnlyWhenEditorEmpty: true
        });
    });

    it('should contribute placeholder plugin', () => {
        const plugins = placeholderExtension.config.plugins!.call({ options: {} } as any);
        expect(plugins.length).toBe(1);
    });
});