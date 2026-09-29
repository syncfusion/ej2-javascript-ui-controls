import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('enablePersistence property', () => {
    describe('when enablePersistence is not specified', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({});
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should default enablePersistence to false', () => {
            expect(editor.enablePersistence).toBe(false);
        });
    });

    describe('when enablePersistence is true on initial render', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ enablePersistence: true });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should initialize with enablePersistence enabled', () => {
            expect(editor.enablePersistence).toBe(true);
        });
    });

    describe('when enablePersistence is updated at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ enablePersistence: false });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should apply the updated enablePersistence value after dataBind', () => {
            editor.enablePersistence = true;
            editor.dataBind();
            expect(editor.enablePersistence).toBe(true);
        });
    });

    describe('when enablePersistence is toggled back to false at runtime', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ enablePersistence: true });
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should preserve the disabled persistence state after update', () => {
            editor.enablePersistence = false;
            editor.dataBind();
            expect(editor.enablePersistence).toBe(false);
        });
    });
});
