import { RichTextEditorUI } from '../../src/richtexteditor-ui/richtexteditor-ui';
import { destroyRTE, renderRTE } from '../base.spec';
import { EditorDialog, EditorDialogModel } from '../../src/base/renderer/editor-dialog';

describe('EditorDialog sub component', () => {
    let editor: RichTextEditorUI;
    let dialog: EditorDialog;
    let host: HTMLElement;

    beforeEach(() => {
        editor = renderRTE({});
        host = editor.element;
    });

    afterEach(() => {
        if (dialog) {
            dialog.destroy();
            dialog = undefined;
        }
        destroyRTE(editor);
    });

    it('should construct and render the dialog root with the given id', () => {
        const model: EditorDialogModel = { header: 'Test', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-test-dialog', host, model);
        const root: HTMLElement = document.getElementById('rte-test-dialog');
        expect(root).not.toBe(null);
        expect(root.classList.contains('e-editor-dialog-root')).toBe(true);
        expect(dialog.id).toBe('rte-test-dialog');
    });

    it('should render the dialog root into the document (Dialog re-parents to body)', () => {
        const model: EditorDialogModel = { header: 'Target', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-target-dialog', host, model);
        const root: HTMLElement = document.getElementById('rte-target-dialog');
        // Syncfusion Dialog moves its root to document.body so it can layer
        // above all content; the sub component still owns the element by id.
        expect(root).not.toBe(null);
        expect(document.body.contains(root)).toBe(true);
    });

    it('should create an underlying Syncfusion Dialog instance', () => {
        const model: EditorDialogModel = { header: 'Instance', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-instance-dialog', host, model);
        const root: HTMLElement = document.getElementById('rte-instance-dialog');
        // Dialog applies the e-dialog class to the root element itself.
        expect(root.classList.contains('e-dialog')).toBe(true);
    });

    it('should start in the closed popup state until show() is called', () => {
        const model: EditorDialogModel = { header: 'Hidden', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-hidden-dialog', host, model);
        const root: HTMLElement = document.getElementById('rte-hidden-dialog');
        expect(root.classList.contains('e-popup-open')).toBe(false);
        expect(root.classList.contains('e-popup-close')).toBe(true);
    });

    it('should reveal the dialog after show()', () => {
        const model: EditorDialogModel = { header: 'Show', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-show-dialog', host, model);
        dialog.show();
        const root: HTMLElement = document.getElementById('rte-show-dialog');
        expect(root.classList.contains('e-popup-open')).toBe(true);
        expect(root.classList.contains('e-popup-close')).toBe(false);
    });

    it('should hide the dialog after hide()', () => {
        const model: EditorDialogModel = { header: 'Hide', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-hide-dialog', host, model);
        dialog.show();
        dialog.hide();
        const root: HTMLElement = document.getElementById('rte-hide-dialog');
        expect(root).toBe(null);
    });

    it('should honour enableRtl of the parent editor', () => {
        editor = renderRTE({ enableRtl: true });
        host = editor.element;
        const model: EditorDialogModel = { header: 'Rtl', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-rtl-dialog', host, model);
        const root: HTMLElement = document.getElementById('rte-rtl-dialog');
        expect(root.classList.contains('e-rtl')).toBe(true);
    });

    it('should not trigger parent beforeDialogOpen event when shown', () => {
        let beforeDialogOpenCalled: boolean = false;
        editor = renderRTE({ beforeDialogOpen: (): void => { beforeDialogOpenCalled = true; } });
        host = editor.element;
        const model: EditorDialogModel = { header: 'Event', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-event-dialog', host, model);
        dialog.show();
        expect(beforeDialogOpenCalled).toBe(false);
    });

    it('should not trigger parent beforeDialogClose event when hidden', () => {
        let beforeDialogCloseCalled: boolean = false;
        editor = renderRTE({ beforeDialogClose: (): void => { beforeDialogCloseCalled = true; } });
        host = editor.element;
        const model: EditorDialogModel = { header: 'CloseEvent', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-close-event-dialog', host, model);
        dialog.show();
        dialog.hide();
        expect(beforeDialogCloseCalled).toBe(false);
    });

    it('should invoke caller-supplied model.beforeDialogOpen before parent beforeDialogOpen', () => {
        const callOrder: string[] = [];
        editor = renderRTE({ beforeDialogOpen: (): void => { callOrder.push('parent'); } });
        host = editor.element;
        const model: EditorDialogModel = {
            header: 'Order',
            content: 'Body',
            animationSettings: { effect: 'None' },
            beforeDialogOpen: (): void => { callOrder.push('model'); }
        };
        dialog = new EditorDialog(editor, 'rte-order-dialog', host, model);
        dialog.show();
        expect(callOrder).toEqual(['model']);
    });

    it('should NOT restore selection when beforeDialogClose cancels the close', () => {
        editor.inputElement.innerHTML = '<p id="cancel-target">Keep me</p>';
        const target: HTMLElement = editor.inputElement.querySelector('#cancel-target');
        editor.focus();
        const range: Range = document.createRange();
        range.selectNodeContents(target);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        let restoreSpy: jasmine.Spy;
        const model: EditorDialogModel = {
            header: 'Cancel',
            content: 'Body',
            animationSettings: { effect: 'None' },
            beforeDialogClose: (args: any): void => {
                // Cancel the close so restoreRange MUST NOT run.
                args.cancel = true;
            }
        };
        dialog = new EditorDialog(editor, 'rte-cancel-close-dialog', host, model);
        dialog.show();
        // Move the browser selection outside the editor so a restoreRange
        // call (if it wrongly ran) would be detectable.
        const outside: HTMLElement = document.createElement('div');
        outside.contentEditable = 'true';
        document.body.appendChild(outside);
        outside.focus();
        const outsideRange: Range = document.createRange();
        outsideRange.selectNodeContents(outside);
        const sel: Selection = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(outsideRange);
        dialog.hide();
        // Because beforeDialogClose cancelled, restoreRange was skipped; the
        // browser selection should still be the outside element, not the
        // editor's saved range.
        const after: Selection = window.getSelection();
        expect(editor.inputElement.contains(after.anchorNode)).toBe(false);
        document.body.removeChild(outside);
    });

    it('should restore editor selection after close even with caller beforeDialogClose', () => {
        editor.inputElement.innerHTML = '<p id="sel-target">Restore me</p>';
        const target: HTMLElement = editor.inputElement.querySelector('#sel-target');
        editor.focus();
        const range: Range = document.createRange();
        range.selectNodeContents(target);
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        let cancelCalled: boolean = false;
        const model: EditorDialogModel = {
            header: 'Restore',
            content: 'Body',
            animationSettings: { effect: 'None' },
            beforeDialogClose: (): void => {
                cancelCalled = true;
            }
        };
        dialog = new EditorDialog(editor, 'rte-restore-dialog', host, model);
        dialog.show();
        dialog.hide();
        expect(cancelCalled).toBe(true);
        // The restoreRange call in beforeDialogClose re-selects the saved range.
        const restored: Selection = window.getSelection();
        expect(editor.inputElement.contains(restored.anchorNode)).toBe(true);
    });

    it('should be idempotent on destroy (calling twice does not throw)', () => {
        const model: EditorDialogModel = { header: 'Idem', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-idem-dialog', host, model);
        dialog.destroy();
        expect((): void => {
            dialog.destroy();
        }).not.toThrow();
    });

    it('should remove the dialog root from the DOM after destroy', () => {
        const model: EditorDialogModel = { header: 'Remove', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-remove-dialog', host, model);
        const id: string = dialog.id;
        dialog.destroy();
        expect(document.getElementById(id)).toBe(null);
    });

    it('should not throw when show()/hide() are called after destroy', () => {
        const model: EditorDialogModel = { header: 'AfterDestroy', content: 'Body', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-after-destroy-dialog', host, model);
        dialog.destroy();
        expect((): void => {
            dialog.show();
            dialog.hide();
        }).not.toThrow();
    });

    it('should apply caller-supplied cssClass to the dialog', () => {
        const model: EditorDialogModel = { header: 'Css', content: 'Body', cssClass: 'custom-dialog-class', animationSettings: { effect: 'None' } };
        dialog = new EditorDialog(editor, 'rte-css-dialog', host, model);
        const root: HTMLElement = document.getElementById('rte-css-dialog');
        expect(root.classList.contains('custom-dialog-class')).toBe(true);
    });
});

