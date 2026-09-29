import { RichTextEditorUI } from '../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from './base.spec';

describe('interactionSettings.enableAutoFormat property', () => {

    describe('Default value when interactionSettings is not provided', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should expose a default interactionSettings model', () => {
            expect(editor.interactionSettings).not.toBeNull();
            expect(editor.interactionSettings).not.toBeUndefined();
        });

        it('should default enableAutoFormat to true on the component model', () => {
            expect(editor.interactionSettings.enableAutoFormat).toBe(true);
        });
    });

    describe('Explicit value on initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                interactionSettings: {
                    enableAutoFormat: true
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should reflect enableAutoFormat = true on the component model', () => {
            expect(editor.interactionSettings.enableAutoFormat).toBe(true);
        });
    });

    describe('enableAutoFormat = false on initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                interactionSettings: {
                    enableAutoFormat: false
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should reflect enableAutoFormat = false on the component model', () => {
            expect(editor.interactionSettings.enableAutoFormat).toBe(false);
        });
    });

    describe('Runtime property change via inner-property mutation', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                interactionSettings: {
                    enableAutoFormat: true
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should reflect the new enableAutoFormat value after mutating the inner property', () => {
            editor.interactionSettings.enableAutoFormat = false;
            editor.dataBind();

            expect(editor.interactionSettings.enableAutoFormat).toBe(false);
        });
    });

    describe('Runtime property change via top-level reassignment', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                interactionSettings: {
                    enableAutoFormat: true
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should reflect the new enableAutoFormat value after reassigning interactionSettings', () => {
            editor.interactionSettings = { enableAutoFormat: false };
            editor.dataBind();

            expect(editor.interactionSettings.enableAutoFormat).toBe(false);
        });
    });

    describe('Invalid / ignored values', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                interactionSettings: {
                    // Explicitly omit enableAutoFormat to verify the model default applies.
                } as any
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should fall back to the InteractionSettings default (true) when enableAutoFormat is omitted', () => {
            expect(editor.interactionSettings.enableAutoFormat).toBe(true);
        });
    });

    describe('Cleanup', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({
                interactionSettings: {
                    enableAutoFormat: false
                }
            });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should not throw when destroyed with enableAutoFormat = false', () => {
            expect(() => editor.destroy()).not.toThrow();
        });
    });
});