import { basicExtensions } from '../../../src/extensions/builtins/basic';

describe('Built-in: corePreset', () => {
    it('should be an extension definition', () => {
        expect(basicExtensions).toBeDefined();
        expect(basicExtensions.name).toBe('basic');
    });

    it('addExtensions() includes a document extension', () => {
        const extensions = basicExtensions.config.addExtensions!();
        const names = extensions.map((e: { name: string }) => e.name);
        expect(names).toContain('document');
    });

    it('addExtensions() composes all 16 expected builtin extensions', () => {
        const extensions = basicExtensions.config.addExtensions!();
        const names = extensions.map((e: { name: string }) => e.name);
        const expected = [
            'document', 'paragraph', 'heading', 'bold', 'italic',
            'underline', 'strikethrough', 'inlineCode', 'codeBlock',
            'list', 'blockquote', 'horizontalRule', 'hardBreak', 'task-list', 'text', 'undoRedo'
        ];
        for (const name of expected) {
            expect(names).toContain(name);
        }
    });

    it('does not export CORE_PRESET_DEPENDENCIES', () => {
        const mod = require('../../../src/extensions/builtins/basic');
        expect(mod.CORE_PRESET_DEPENDENCIES).toBeUndefined();
    });
});
