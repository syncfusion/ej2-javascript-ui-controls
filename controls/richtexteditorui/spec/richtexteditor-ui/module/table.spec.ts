import { getComponent } from '@syncfusion/ej2-base';
import { RichTextEditorUI } from '../../../src';
import { renderRTE, destroyRTE } from '../../base.spec';
import { ARROW_DOWN_EVENT_INIT, ARROW_LEFT_EVENT_INIT, ARROW_UP_EVENT_INIT, ARROWRIGHT_EVENT_INIT, ENTERKEY_EVENT_INIT, ESCAPE_KEY_EVENT_INIT, INSRT_IMG_EVENT_INIT, INSRT_TABLE_EVENT_INIT, SPACE_EVENT_INIT, TAB_KEY_EVENT_INIT } from '../../constant.spec';
import { Toolbar } from '@syncfusion/ej2-navigations';

describe('Table Module Tests', () => {
    describe('Get module name', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Get module nmame', () => {
            const moduleName: string = editor.tableModule.getModuleName();
            expect(moduleName).toBe('table');
        });
    });
    // Table popup open and close test
    describe('Popup Open & Close', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('popup render', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            expect(document.querySelector('.e-rte-ui-table-popup')).not.toBeNull();
        });
        it('popup close when toolbar clicked twice', () => {
            editor.inputElement?.focus();
            const btn: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            btn.click();
            expect((editor.tableModule as any).tablePopup.isVisible()).toBe(true);
            btn.click();
            expect((editor.tableModule as any).tablePopup.isVisible()).toBe(false);
        });
    });
    // Table poup grid rendering test
    describe('Grid Rendering', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('verify row count', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            expect(document.querySelectorAll('.e-rte-table-row').length).toBe(3);
        });
        it('verify grid cell count', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            expect(document.querySelectorAll('[role="gridcell"]').length).toBe(30);
        });
    });
    describe('Mouse Selection', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                valueFormat: 'html',
                value: '<p>text</p><div class="tableWrapper"><table style="--default-cell-min-width: 100px; min-width: 300px;"><colgroup><col><col><col></colgroup><tbody><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td><td><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table></div>',
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Hide Table quick toolbar when focus is not a table element', () => {
            editor.inputElement.focus();
            const tableCell: HTMLElement = editor.inputElement.querySelector('td') as HTMLElement;
            const range: Range = document.createRange();
            range.selectNodeContents(tableCell);
            const selection: Selection = editor.inputElement.ownerDocument.getSelection() as Selection;
            selection.removeAllRanges();
            selection.addRange(range);
            editor.inputElement.ownerDocument.dispatchEvent(new Event('selectionchange'));
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, cancelable: true}));
            expect(document.querySelector('.e-rte-ui-quick-popup.e-popup-open')).not.toBe(null);
            editor.inputElement.focus();
            const paragraph: HTMLElement = editor.inputElement.querySelector('p') as HTMLElement;
            const range1: Range = document.createRange();
            range1.selectNodeContents(paragraph);
            const selection1: Selection = editor.inputElement.ownerDocument.getSelection() as Selection;
            selection1.removeAllRanges();
            selection1.addRange(range1);
            editor.inputElement.ownerDocument.dispatchEvent(new Event('selectionchange'));
            editor.inputElement?.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, cancelable: true}));
            expect(document.querySelector('.e-rte-ui-quick-popup.e-popup-open')).toBe(null);
        });
    });
    // Table poup mouse move test
    describe('Mouse Selection', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('update header on hover', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const cell: HTMLElement = document.querySelector('[data-row="1"][data-col="2"]') as HTMLElement;
            cell.dispatchEvent(new MouseEvent('mousemove'));
            const header: HTMLElement = document.querySelector('.e-rte-ui-table-popup-header') as HTMLElement;
            expect(header.textContent).toBe('3 x 2');
        });
        it('mouse down on header on should not hide popup', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const header: HTMLElement = document.querySelector('.e-rte-ui-table-popup-header') as HTMLElement;
            header.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
            expect(header.textContent).toBe('1 x 1');
        });
        it('mouse down on editor on should not hide popup', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const header: HTMLElement = document.querySelector('.e-rte-ui-table-popup-header') as HTMLElement;
            editor.inputElement.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        });
        it('update header on hover', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const cell: HTMLElement = document.querySelector('[data-row="1"][data-col="2"]') as HTMLElement;
            cell.dispatchEvent(new MouseEvent('mousemove'));
            const header: HTMLElement = document.querySelector('.e-rte-ui-table-popup-header') as HTMLElement;
            expect(header.textContent).toBe('3 x 2');
            const cell1: HTMLElement = document.querySelector('[data-row="0"][data-col="0"]') as HTMLElement;
            cell1.dispatchEvent(new MouseEvent('mousemove'));
        });
        it('Editors mouse up for coverage', () => {
            editor.inputElement!.innerHTML = '<p>test</p>';
            const textNode = editor.inputElement!.querySelector('p')!.firstChild!;
            const range = document.createRange();
            // Select "es" from "test"
            range.setStart(textNode, 1);
            range.setEnd(textNode, 3);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
            editor.inputElement?.focus();
            editor.inputElement?.dispatchEvent(
                new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true
                })
            );
        });
        it('insert 1 x 1 table', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const cell: HTMLElement = document.querySelector('[data-row="0"][data-col="0"]') as HTMLElement;
            cell.dispatchEvent(new MouseEvent('mouseup'));
            expect(editor.inputElement?.querySelector('table')).not.toBe(null);
        });
        it('insert 3 x 10 table', () => {
            editor.inputElement?.focus();
            const button: HTMLElement =
            editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const cell: HTMLElement = document.querySelector('[data-row="2"][data-col="9"]') as HTMLElement;
            cell.dispatchEvent(new MouseEvent('mouseup'));
            expect(editor.inputElement?.querySelector('table')).not.toBe(null);
        });
    });
    // Table popup keyborad navigation
    describe('Keyboard Navigation', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('ArrowRight', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', ARROWRIGHT_EVENT_INIT));
            expect(popup['focusedCell'].col ).toBe(1);
        });
        it('ArrowLeft', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup['focusedCell'].col = 1;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', ARROW_LEFT_EVENT_INIT));
            expect(popup['focusedCell'].col).toBe(0);
        });
        it('ArrowDown', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', ARROW_DOWN_EVENT_INIT));
            expect(popup['focusedCell'].row).toBe(1);
        });
        it('ArrowUp', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup['focusedCell'].row = 1;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', ARROW_UP_EVENT_INIT));
            expect(popup['focusedCell'].row).toBe(0);
        });
        it('Enter inserts table', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT));
            expect(editor.inputElement?.querySelector('table')).not.toBe(null);
        });
        it('Escape closes popup', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', ESCAPE_KEY_EVENT_INIT));
            expect( popup.isVisible()).toBe(false);
        });
        it('Tab focuses insert button', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', TAB_KEY_EVENT_INIT));
            expect(popup['insertBtnInstance']).not.toBeNull();
        });
        it('unsupported key path', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const popup: any = (editor.tableModule as any).tablePopup;
            popup.popup.element.dispatchEvent(new KeyboardEvent('keydown', SPACE_EVENT_INIT));
            expect(popup['focusedCell'].row).toBe(0);
        });
    });
    // Table dialog test
    describe('Dialog', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('open insert dialog from popup button', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            expect(document.querySelector('.e-rte-ui-insert-table-dialog')).not.toBeNull();
        });
        it('apply insert', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-insert-table');
            insertBtn.click();
            expect(editor.inputElement?.querySelector('table')).not.toBe(null);
        });
        it('cancel dialog', () => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-cancel');
            insertBtn.click();
            expect(editor.inputElement?.querySelector('table')).toBe(null);
        });
    });
    // Table shortcut test
    describe('Shortcut', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('Ctrl Shift E opens dialog', () => {
            editor.inputElement?.focus();
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_TABLE_EVENT_INIT));
            expect(document.querySelector('.e-rte-ui-insert-table-dialog')).not.toBeNull();
        });
        it('Ctrl Shift I shout not opens table dialog', () => {
            editor.inputElement?.focus();
            editor.inputElement.dispatchEvent(new KeyboardEvent('keydown', INSRT_IMG_EVENT_INIT));
            expect(document.querySelector('.e-rte-ui-insert-table-dialog')).toBeNull();
        });
    });
    // Table quick toolbar testing
    describe('Quick Toolbar', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('editorMouseUp handler', (done: DoneFn) => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-insert-table');
            insertBtn.click();
            expect(document.querySelector('.e-rte-ui-quick-popup.e-popup-open')).not.toBe(null);
            done();
        });
        it('Quick toolbar row item check', (done: DoneFn) => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-insert-table');
            insertBtn.click();
            const rowBtn: HTMLElement = document.querySelector('.e-rte-ui-quick-popup.e-popup-open')?.querySelectorAll('button')[0];
            rowBtn.click();
            const dropBtn: HTMLElement = document.querySelector('.e-dropdown-popup.e-rte-ui-dropdown-popup.e-popup-open')?.querySelector('li');
            dropBtn.click();
            done();
        });
        it('Quick toolbar color picker item check', (done: DoneFn) => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-insert-table');
            insertBtn.click();
            const colorBtn: HTMLElement = document.querySelector('.e-rte-ui-quick-popup.e-popup-open')?.querySelectorAll('button')[3];
            colorBtn.click();
            done();
        });
        it('Quick toolbar Align item check', (done: DoneFn) => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-insert-table');
            insertBtn.click();
            const alignBtn: HTMLElement = document.querySelector('.e-rte-ui-quick-popup.e-popup-open')?.querySelectorAll('button')[5];
            alignBtn.click();
            const dropBtn: HTMLElement = document.querySelector('.e-dropdown-popup.e-rte-ui-dropdown-popup.e-popup-open')?.querySelector('li');
            dropBtn.click();
            done();
        });
        it('Quick toolbar Align item check', (done: DoneFn) => {
            editor.inputElement?.focus();
            const button: HTMLElement = editor.toolbarModule.element.querySelector('#' + editor.element.id + '_toolbar_Table') as HTMLElement;
            button.click();
            const btn: HTMLElement = document.querySelector('.e-insert-table-btn') as HTMLElement;
            btn.click();
            const insertBtn: HTMLElement = document.querySelector('.e-rte-ui-insert-table-dialog.e-insert-table');
            insertBtn.click();
            const alignBtn: HTMLElement = document.querySelector('.e-rte-ui-quick-popup.e-popup-open')?.querySelectorAll('button')[6];
            alignBtn.click();
            const dropBtn: HTMLElement = document.querySelector('.e-dropdown-popup.e-rte-ui-dropdown-popup.e-popup-open')?.querySelector('li');
            dropBtn.click();
            done();
        });
    });

    describe('Toolbar SubComponent', () => {
        let editor: RichTextEditorUI;
        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Table']
                }
            });
        });
        afterEach(() => {
            destroyRTE(editor);
        });
        it('get table toolbar item using getComponent', () => {
            const toolbarElement: HTMLElement = editor.element.parentElement.querySelector('.e-control.e-toolbar') as HTMLElement;
            const toolbarObj: Toolbar = getComponent(toolbarElement, Toolbar);
            expect(toolbarObj).not.toBeNull();
            const tableElement: HTMLElement = toolbarObj.element.querySelector('.e-create-table') as HTMLElement;
            expect(tableElement).not.toBeNull();
            expect(tableElement.classList.contains('e-create-table')).toBe(true);
        });
    });
});
