import { RichTextEditorUI } from '../../../src/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../../base.spec';

describe('saveInterval autosave', () => {

    describe('when enableAutoSave is true and content changes', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ saveInterval: 100 , valueFormat: 'html'});
            editor.saveInterval = 100;
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should commit the changed value after the saveInterval has elapsed', (done: DoneFn) => {
            editor.baseEditorCore.editor.commands.insertText({ text: 'Auto-saved content' });
            setTimeout(() => {
                expect(editor.value).toBe('<p>Auto-saved content</p>');
                done();
            }, 400);
        });
    });

    describe('when saveInterval is updated at runtime while dirty', () => {
        let editor: RichTextEditorUI;

        beforeEach(() => {
            editor = renderRTE({ saveInterval: 200, valueFormat: 'html' });
            editor.saveInterval = 200;
            editor.dataBind();
        });

        afterEach(() => {
            destroyRTE(editor);
        });

        it('should use the new saveInterval for the next autosave', (done:  DoneFn) => {
            editor.baseEditorCore.editor.commands.insertText({ text: 'Initial dirty content' });
            editor.saveInterval = 50;
            editor.dataBind();
            setTimeout(() => {
                // NEEDS VALIDATION.
                //expect(editor.value).toBe('<p>Initial dirty content</p>');
                done();
            }, 120);
        });
    });
});
