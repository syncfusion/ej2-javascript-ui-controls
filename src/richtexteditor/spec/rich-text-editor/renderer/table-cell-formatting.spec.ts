import { RichTextEditor } from "../../../src";
import { BACKSPACE_EVENT_INIT, SPACE_EVENT_INIT } from "../../constant.spec";
import { renderRTE, destroy, selectTableCell, drawCellSelection } from "../render.spec";

// Tests for Table cell formatting


describe('Table cell formatting ', () => {
    beforeAll((done: DoneFn) => {
        const link: HTMLLinkElement = document.createElement('link');
        link.href = '/base/demos/themes/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        document.head.appendChild(link);
        setTimeout(() => {
            done(); // Style should be loaded before done() called
        }, 1000);
    });

    afterAll((done: DoneFn) => {
        document.getElementById('materialTheme').remove();
        done();
    });

    describe('Table Cell select format testing -  Testing integration with selection commands', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td><td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><ol><li>List 1</li><li>List 2</li></ol></td></tr><tr><td>span<br><p>Paragraph</p></td><td><div>The Rich Text Editor</div></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Select table cell 1, 2 and then apply Bold', () => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[0] as HTMLElement).click();
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
            expect(table.rows[0].cells[0].innerHTML === '<strong>Span&nbsp;</strong><br><strong>Bold </strong><br><em><strong>Italic </strong><br></em>').toBe(true);
            expect(table.rows[0].cells[1].innerHTML === '<p><strong>Paragraph 1</strong></p><p><strong>Paragraph 2</strong></p><p><strong>Paragraph 3</strong></p>').toBe(true);
        });
        it('Revert the bold', () => {
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[0] as HTMLElement).click();
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
            expect(table.rows[0].cells[0].innerHTML === 'Span&nbsp;<br>Bold <br><em>Italic <br></em>').toBe(true);
            expect(table.rows[0].cells[1].innerHTML === '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>').toBe(true);
        });
    });

    describe('Table Cell select format testing -  Testing integration with Formsts plugin', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td><td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><ol><li>List 1</li><li>List 2</li></ol></td></tr><tr><td>span<br><p>Paragraph</p></td><td><div>The Rich Text Editor</div></td></tr></tbody></table><p><br></p>`
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Select table cell 1, 2 and then apply Heading', (done: DoneFn) => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[3] as HTMLElement).click();
            setTimeout(() => {
                (document.body.querySelector('.e-item.e-h1') as HTMLElement).click();
                expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
                expect(table.rows[0].cells[0].innerHTML === '<h1>Span&nbsp;<br></h1><h1><strong>Bold </strong><br></h1><h1><em>Italic <br></em></h1>').toBe(true);
                expect(table.rows[0].cells[1].innerHTML === '<h1>Paragraph 1</h1><h1>Paragraph 2</h1><h1>Paragraph 3</h1>').toBe(true);
                done();
            }, 100);
        });
        it('Revert to paragraph', (done: DoneFn) => {
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[3] as HTMLElement).click();
            setTimeout(() => {
                (document.body.querySelector('.e-item.e-paragraph') as HTMLElement).click();
                expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
                expect(table.rows[0].cells[0].innerHTML === '<p>Span&nbsp;<br></p><p><strong>Bold </strong><br></p><p><em>Italic <br></em></p>').toBe(true);
                expect(table.rows[0].cells[1].innerHTML === '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>').toBe(true);
                done();
            }, 100);
        });
    });

    describe('Table Cell select format testing -  Testing integration with List plugin', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td><td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><ol><li>List 1</li><li>List 2</li></ol></td></tr><tr><td>span<br><p>Paragraph</p></td><td><div>The Rich Text Editor</div></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Select table cell 1, 2 and then apply Bullet list', () => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[7] as HTMLElement).click();
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
            expect(table.rows[0].cells[0].innerHTML === '<ul><li>Span&nbsp;<br></li><li><strong>Bold </strong><br></li><li><em>Italic <br></em></li></ul>').toBe(true);
            expect(table.rows[0].cells[1].innerHTML === '<ul><li>Paragraph 1</li><li>Paragraph 2</li><li>Paragraph 3</li></ul>').toBe(true);
        });
        it('Revert the list', () => {
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[7] as HTMLElement).click();
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
            expect(table.rows[0].cells[0].innerHTML === '<p>Span&nbsp;<br></p><p><strong>Bold </strong><br></p><p><em>Italic <br></em></p>').toBe(true);
            expect(table.rows[0].cells[1].innerHTML === '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>').toBe(true);
        });
    });

    describe('Table Cell select format testing -  Backspace and space action', () => {
        let editor: RichTextEditor;
        beforeAll(() => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td><td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><ol><li>List 1</li><li>List 2</li></ol></td></tr><tr><td>span<br><p>Paragraph</p></td><td><div>The Rich Text Editor</div></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Backspace should remove the class name.', () => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            const backspaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(backspaceDownEvent);
            const backspaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(backspaceUpEvent);
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(0);
            expect((table.rows[0].cells[1].getAttribute('class'))).toBe('');
        });
        it('Space should remove the class name.', () => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            const backspaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
            editor.inputElement.dispatchEvent(backspaceDownEvent);
            expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(0);
            expect((table.rows[0].cells[1].getAttribute('class'))).toBe('');
            expect((table.rows[0].cells[0].innerHTML.charCodeAt(0))).toBe(8203);
        });
    });

    describe('Table Cell select format testing -  List with wrapped paragraph nodes', () => {
        let editor: RichTextEditor;
        beforeAll((done: DoneFn) => {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;">This issue replicated only when the content is typed and then changed to list<br>Replication procedure<br><ol><li>Run the sample</li><li>Create a table</li><li>Create a list</li><li>Now select two cells and then apply heading</li><li>Now apply paragraph</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`
            });
            done();
        });
        afterAll((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('Select table cell 1, 2 and then apply Heading', (done: DoneFn) => {
            editor.focusIn();
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            selectTableCell(table, 0, 0);
            drawCellSelection(table, 0, 1);
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[3] as HTMLElement).click();
            setTimeout(() => {
                (document.body.querySelector('.e-item.e-h1') as HTMLElement).click();
                expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
                expect(table.rows[0].cells[0].innerHTML === '<h1>This issue replicated only when the content is typed and then changed to list<br></h1><h1>Replication procedure<br></h1><ol><li><h1>Run the sample</h1></li><li><h1>Create a table</h1></li><li><h1>Create a list</h1></li><li><h1>Now select two cells and then apply heading</h1></li><li><h1>Now apply paragraph</h1></li></ol>').toBe(true);
                expect(table.rows[0].cells[1].innerHTML === '<h1><br></h1>').toBe(true);
                done();
            }, 100);
        });
        it('Revert to paragraph', (done: DoneFn) => {
            const table: HTMLTableElement = editor.inputElement.querySelector('table');
            const toolbarButtons : NodeList = editor.element.querySelectorAll('.e-tbar-btn');
            (toolbarButtons[3] as HTMLElement).click();
            setTimeout(() => {
                (document.body.querySelector('.e-item.e-paragraph') as HTMLElement).click();
                expect(editor.inputElement.querySelectorAll('.e-cell-select').length).toBe(2);
                expect(table.rows[0].cells[0].innerHTML === '<p>This issue replicated only when the content is typed and then changed to list<br></p><p>Replication procedure<br></p><ol><li><p>Run the sample</p></li><li><p>Create a table</p></li><li><p>Create a list</p></li><li><p>Now select two cells and then apply heading</p></li><li><p>Now apply paragraph</p></li></ol>').toBe(true);
                expect(table.rows[0].cells[1].innerHTML === '<p><br></p>').toBe(true);
                done();
            }, 100);
        });
    });
});