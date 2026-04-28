import { createElement, detach, isNullOrUndefined } from "@syncfusion/ej2-base";
import { TableSelection } from "../../../src/editor-manager/plugin/table-selection";
import { RichTextEditor } from "../../../src/rich-text-editor/base/rich-text-editor";
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from "../../rich-text-editor/render.spec";
import { BACKSPACE_EVENT_INIT, BASIC_MOUSE_EVENT_INIT, CONTROL_A_EVENT_INIT, ENTERKEY_EVENT_INIT } from "../../constant.spec";
import { EditorManager } from '../../../src/editor-manager/index';

// Test case for the Table cell selection public methods
// 1. getBlockNodes method - return the block nodes collection after the wraping of inline nodes.
// 2. getTextNodes method - return the text nodes collection.

describe('Table Cell Selection ', () => {

    describe('Block nodes collection testing ', () => {
        const editableElement: HTMLElement = createElement('div', { id: 'editorRoot', className: 'e-richtexteditor'});
        beforeEach(() => {
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
            <tbody>
                <tr>
                    <td style="width: 50%;">Text node</td>
                    <td style="width: 50%;"></td>
                </tr>
                <tr>
                    <td style="width: 50%;"><br></td>
                    <td style="width: 50%;"></td>
                </tr>
                <tr>
                    <td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td>
                    <td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 50%;"><br></td>
                    <td style="width: 50%;">
                        <ol>
                            <li>List 1</li>
                            <li>List 2</li>
                        </ol>
                    </td>
                </tr>
                <tr>
                <td style="width: 50%;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p></td>
                <td><div>The Rich Text Editor</div></td>
                </tr>
            </tbody>
        </table>`;
            editableElement.contentEditable = 'true';
            document.body.appendChild(editableElement);
        });
        afterEach(() => {
            detach(document.getElementById('editorRoot') as HTMLElement);
        });
    
        it('CASE 1 TD with Text Node', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[0].classList.add('e-cell-select');
            tdCollection[1].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(2);
            expect(blockNodes[0].tagName === 'P').toBe(true);
            expect(blockNodes[0].textContent === 'Text node').toBe(true);
            expect(blockNodes[1].tagName === 'P').toBe(true);
            expect(blockNodes[1].textContent === '').toBe(true);
        });

        it('CASE 2 TD with BR Node', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[2].classList.add('e-cell-select');
            tdCollection[3].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(2);
            expect(blockNodes[0].tagName === 'P').toBe(true);
            expect(blockNodes[0].textContent === '').toBe(true);
            expect(blockNodes[1].tagName === 'P').toBe(true);
            expect(blockNodes[1].textContent === '').toBe(true);
        });

        it('CASE 3 TD with Inline nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[4].classList.add('e-cell-select');
            tdCollection[5].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(6);
            expect(blockNodes[0].tagName === 'P').toBe(true);
            expect(blockNodes[0].textContent === 'Span ').toBe(true);
            expect(blockNodes[1].tagName === 'P').toBe(true);
            expect(blockNodes[1].textContent === 'Bold ').toBe(true);
            expect(blockNodes[2].tagName === 'P').toBe(true);
            expect(blockNodes[2].textContent === 'Italic ').toBe(true);
            tdCollection[4].innerHTML = '<p>Span&nbsp;<br></p><p><strong>Bold </strong><br></p><p><em>Italic <br></em></p>';
        });

        it('CASE 4 TD with Block nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[4].classList.add('e-cell-select');
            tdCollection[5].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(6);
            expect(blockNodes[3].tagName === 'P').toBe(true);
            expect(blockNodes[3].textContent === 'Paragraph 1').toBe(true);
            expect(blockNodes[4].tagName === 'P').toBe(true);
            expect(blockNodes[4].textContent === 'Paragraph 2').toBe(true);
            expect(blockNodes[5].tagName === 'P').toBe(true);
            expect(blockNodes[5].textContent === 'Paragraph 3').toBe(true);
            tdCollection[5].innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>';
        });

        it('CASE 5 TD with List nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[6].classList.add('e-cell-select');
            tdCollection[7].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(3);
            expect(blockNodes[0].tagName === 'P').toBe(true);
            expect(blockNodes[0].textContent === '').toBe(true);
            expect(blockNodes[1].tagName === 'LI').toBe(true);
            expect(blockNodes[1].textContent === 'List 1').toBe(true);
            expect(blockNodes[2].tagName === 'LI').toBe(true);
            expect(blockNodes[2].textContent === 'List 2').toBe(true);
            tdCollection[6].innerHTML = '<ol><li>List 1</li><li>List 2</li></ol>';
        });

        it('CASE 6 TD with Table nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[8].classList.add('e-cell-select');
            tdCollection[13].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(6);
            expect(blockNodes[0].tagName === 'P').toBe(true);
            expect(blockNodes[1].tagName === 'P').toBe(true);
            expect(blockNodes[2].tagName === 'P').toBe(true);
            expect(blockNodes[3].tagName === 'P').toBe(true);
            expect(blockNodes[4].tagName === 'P').toBe(true);
            expect(blockNodes[5].tagName === 'DIV').toBe(true);
        });
    });
    
    describe('Text nodes collection testing ', () => {
        const editableElement: HTMLElement = createElement('div', { id: 'editorRoot', className: 'e-richtexteditor'});
        beforeEach(() => {
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
            <tbody>
                <tr>
                    <td style="width: 50%;">Text node</td><td style="width: 50%;"></td>
                </tr>
                <tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"></td>
                </tr>
                <tr>
                    <td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td>
                    <td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p></td>
                </tr>
                <tr>
                    <td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><ol><li>List 1</li><li>List 2</li></ol></td>
                </tr>
                <tr>
                <td style="width: 50%;"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p></td>
                <td><div>The Rich Text Editor</div></td>
                </tr>
            </tbody>
        </table>`;
            editableElement.contentEditable = 'true';
            document.body.appendChild(editableElement);
        });

        afterEach(() => {
            detach(document.getElementById('editorRoot') as HTMLElement);
        });

        it('CASE 1 TD with Text Node', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[0].classList.add('e-cell-select');
            tdCollection[1].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(textNodes.length).toBe(2);
            expect(textNodes[0].textContent === 'Text node').toBe(true);
            expect(textNodes[1].textContent.charCodeAt(0) === 8203).toBe(true);
        });

        it('CASE 2 TD with BR Node', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[2].classList.add('e-cell-select');
            tdCollection[3].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(textNodes.length).toBe(2);
            expect(textNodes[0].textContent.charCodeAt(0) === 8203).toBe(true);
            expect(textNodes[1].textContent.charCodeAt(0) === 8203).toBe(true);
        });

        it('CASE 3 TD with Inline nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[4].classList.add('e-cell-select');
            tdCollection[5].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(textNodes.length).toBe(6);
            expect(textNodes[0].textContent === 'Span ').toBe(true);
            expect(textNodes[1].textContent === 'Bold ').toBe(true);
            expect(textNodes[2].textContent === 'Italic ').toBe(true);
        });

        it('CASE 4 TD with Block nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[4].classList.add('e-cell-select');
            tdCollection[5].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(textNodes.length).toBe(6);
            expect(textNodes[3].textContent === 'Paragraph 1').toBe(true);
            expect(textNodes[4].textContent === 'Paragraph 2').toBe(true);
            expect(textNodes[5].textContent === 'Paragraph 3').toBe(true);
            tdCollection[5].innerHTML = '<p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p>';
        });

        it('CASE 5 TD with List nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[6].classList.add('e-cell-select');
            tdCollection[7].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(textNodes.length).toBe(3);
            expect(textNodes[0].textContent.charCodeAt(0) === 8203).toBe(true);
            expect(textNodes[1].textContent === 'List 1').toBe(true);
            expect(textNodes[2].textContent === 'List 2').toBe(true);
            tdCollection[6].innerHTML = '<ol><li>List 1</li><li>List 2</li></ol>';
        });

        it('CASE 6 TD with Table nodes', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[8].classList.add('e-cell-select');
            tdCollection[13].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(textNodes.length).toBe(5);
            expect(textNodes[0].textContent.charCodeAt(0) === 8203).toBe(true);
            expect(textNodes[1].textContent.charCodeAt(0) === 8203).toBe(true);
            expect(textNodes[2].textContent.charCodeAt(0) === 8203).toBe(true);
            expect(textNodes[3].textContent.charCodeAt(0) === 8203).toBe(true);
            expect(textNodes[4].textContent === 'The Rich Text Editor').toBe(true);
        });
    });

    describe('Combination of Block and Text nodes collection testing ', () => {
        const editableElement: HTMLElement = createElement('div', { id: 'editorRoot', className: 'e-richtexteditor'});
        beforeAll(() => {
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 32.0806%; min-width: 0px; height: 51px;"><tbody><tr style="height: 49.0196%;"><td style="width: 41.0112%;" class="e-cell-select">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid&nbsp;<a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style="box-sizing: border-box;">HTML markup</a>&nbsp;or&nbsp;<a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style="box-sizing: border-box;">markdown</a>&nbsp;of the content<br><br><p style="box-sizing: border-box;"><b style="box-sizing: border-box;">Links</b></p><ol style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px;"><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">You can insert a hyperlink with its corresponding dialog</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">Attach a hyperlink to the displayed text.</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">Customize the quick toolbar based on the hyperlink</p></li></ol></td><td style="width: 58.8015%;" class=""><p style="box-sizing: border-box;"><b style="box-sizing: border-box;">Toolbar</b></p><ol style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px;"><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">The Toolbar is fully customizable</p></li></ol><p style="box-sizing: border-box;"><b style="box-sizing: border-box;">Image.</b></p><ol style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px;"><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">Allows you to insert images from an online source as well as the local computer</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">You can upload an image</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">Provides an option to customize the quick toolbar for an image</p></li></ol></td></tr><tr style="height: 49.0196%;"><td style="width: 41.0019%;"><p style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">Users can create resizable Rich Text Editor by setting the enableResize property to true, which is used to change the size of the Rich Text Editor dynamically.</p><p style="box-sizing: border-box; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;"><span style="box-sizing: border-box; font-weight: 700;">Injecting Module</span></p><p style="box-sizing: border-box; margin-bottom: 10px; font-family: &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">The above features built as modules have to be included in your application. For example, to use image and link, inject the specific module using&nbsp;<code style="box-sizing: border-box; font-family: Menlo, Monaco, Consolas, &quot;Courier New&quot;, monospace; font-size: 12.6px; padding: 2px 4px; color: rgb(199, 37, 78); background-color: rgb(249, 242, 244); border-radius: 4px;">RichTextEditor.Inject (Toolbar, Link, Image, HtmlEditor, QuickToolbar, Resize, PasteCleanup)</code>.</p></td><td style="width: 58.8015%;" class=""><p style="box-sizing: border-box;">Rich Text Editor is a WYSIWYG editing control that will reduce the effort for users while trying to express their formatting word content as HTML or Markdown format.</p><p style="box-sizing: border-box;"><b style="box-sizing: border-box;">API’s:</b></p><ul style="box-sizing: border-box; margin-top: 0px;"><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">maxLength - allows restricting the maximum length to be entered.</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">readOnly - allows to change it as a non-editable state.</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">enabled - enable or disable the RTE component.</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">enableHtmlEncode - Get the encoded string value through value property and source code panel</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">getValue - get the value of RTE.</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">getSelection - get the selected text of RTE.</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">selectAll - select all content in RTE.</p></li></ul></td></tr></tbody></table><p><br></p>`;
            editableElement.contentEditable = 'true';
            document.body.appendChild(editableElement);
        });

        afterAll(() => {
            detach(document.getElementById('editorRoot') as HTMLElement);
        });

        it('Content Copied from Sample browser.', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[0].classList.add('e-cell-select');
            tdCollection[1].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            const textNodes: Node[] = tableSelection.getTextNodes();
            expect(blockNodes.length).toBe(13);
            expect(textNodes.length).toBe(16);
            expect(blockNodes[0].nodeName === 'P').toBe(true);
            expect(blockNodes[12].nodeName === 'P').toBe(true);
            expect(textNodes[15].textContent === 'Provides an option to customize the quick toolbar for an image');
        });
    });

    describe('Content with nested list nodes collection testing ', () => {
        const editableElement: HTMLElement = createElement('div', { id: 'editorRoot', className: 'e-richtexteditor'});
        beforeAll(() => {
            editableElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;">Span&nbsp;<br><strong>Bold </strong><br><em>Italic <br></em></td><td style="width: 50%;"><p>Paragraph 1</p><p>Paragraph 2</p><p>Paragraph 3</p></td></tr><tr><td style="width: 50%;"><ol style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px;"><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">The Toolbar is fully customizable</p><ol style="box-sizing: border-box; margin-top: 0px; margin-bottom: 0px;"><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">The RIch Text Editor</p></li><li style="box-sizing: border-box;"><p style="box-sizing: border-box;">The Nested node</p></li></ol></li></ol></td><td style="width: 50%;"><ol><li>List 1</li><li>List 2</li></ol></td></tr><tr><td>span<br><p>Paragraph</p></td><td><div>The Rich Text Editor</div></td></tr></tbody></table>`;
            editableElement.contentEditable = 'true';
            document.body.appendChild(editableElement);
        });

        afterAll(() => {
            detach(document.getElementById('editorRoot') as HTMLElement);
        });

        it('Content Copied from Sample browser.', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection[2].classList.add('e-cell-select');
            tdCollection[3].classList.add('e-cell-select');
            const tableSelection = new TableSelection(editableElement as HTMLElement, document);
            const blockNodes: HTMLElement[] = tableSelection.getBlockNodes();
            expect(blockNodes.length).toBe(6);
        });
    });

    describe('942813: Format status not updated for the Block level formats inside the table.', () => {
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({});
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should update the proper format when the heading format applied to all table cells.', (done: DoneFn)=> {
            editor.focusIn();
            const content: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 12.6214%;"> <tr style="height: 12.6214%;"> <th style="width: 12.1813%" class="e-cell-select e-multi-cells-select"><span>S No</span><br></th> <th style="width: 23.2295%" class="e-cell-select e-multi-cells-select"><span>Name</span><br></th> <th style="width: 9.91501%" class="e-cell-select e-multi-cells-select"><span>Age</span><br></th> <th style="width: 15.5807%" class="e-cell-select e-multi-cells-select"><span>Gender</span><br></th> <th style="width: 17.9887%" class="e-cell-select e-multi-cells-select"><span>Occupation</span><br></th> <th style="width: 21.1048%" class="e-cell-select e-multi-cells-select">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.0194%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select">1</td> <td style="width: 23.2295%" class="e-cell-select e-multi-cells-select">Selma Rose</td> <td style="width: 9.91501%" class="e-cell-select e-multi-cells-select">30</td> <td style="width: 15.5807%" class="e-cell-select e-multi-cells-select">Female</td> <td style="width: 17.9887%" class="e-cell-select e-multi-cells-select"><span>Engineer</span><br></td> <td style="width: 21.1048%" class="e-cell-select e-multi-cells-select"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 22.8155%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select">2</td> <td style="width: 23.2295%" class="e-cell-select e-multi-cells-select"><span>Robert</span><br></td> <td style="width: 9.91501%" class="e-cell-select e-multi-cells-select">28</td> <td style="width: 15.5807%" class="e-cell-select e-multi-cells-select">Male</td> <td style="width: 17.9887%" class="e-cell-select e-multi-cells-select"><span>Graphic Designer</span></td> <td style="width: 21.1048%" class="e-cell-select e-multi-cells-select"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.0194%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select">3</td> <td style="width: 23.2295%" class="e-cell-select e-multi-cells-select"><span>William</span><br></td> <td style="width: 9.91501%" class="e-cell-select e-multi-cells-select">35</td> <td style="width: 15.5807%" class="e-cell-select e-multi-cells-select">Male</td> <td style="width: 17.9887%" class="e-cell-select e-multi-cells-select">Teacher</td> <td style="width: 21.1048%" class="e-cell-select e-multi-cells-select"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.0194%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select">4</td> <td style="width: 23.2295%" class="e-cell-select e-multi-cells-select"><span>Laura Grace</span><br></td> <td style="width: 9.91501%" class="e-cell-select e-multi-cells-select">42</td> <td style="width: 15.5807%" class="e-cell-select e-multi-cells-select">Female</td> <td style="width: 17.9887%" class="e-cell-select e-multi-cells-select">Doctor</td> <td style="width: 21.1048%" class="e-cell-select e-multi-cells-select"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.0194%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select">5</td><td style="width: 23.2295%" class="e-cell-select e-multi-cells-select"><span>Andrew James</span><br></td><td style="width: 9.91501%" class="e-cell-select e-multi-cells-select">45</td><td style="width: 15.5807%" class="e-cell-select e-multi-cells-select">Male</td><td style="width: 17.9887%" class="e-cell-select e-multi-cells-select">Lawyer</td><td style="width: 21.1048%" class="e-cell-select e-multi-cells-select e-cell-select-end"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table>`;
            editor.inputElement.innerHTML = content;
            const formatDropdownBthn: HTMLElement = editor.element.querySelector('.e-caret');
            formatDropdownBthn.click();
            setTimeout(() => {
                const headingItem: HTMLElement =  document.querySelector('.e-popup-open .e-h2');
                headingItem.click();
                const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                editor.inputElement.dispatchEvent(mouseUpEvent);
                setTimeout(() => {
                    const formatDropDown: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[4] as HTMLElement;
                    expect(formatDropDown.textContent).toBe('Heading 2');
                    done();
                }, 100);
            }, 100);
        });
    });

    describe(' BlockQuote Formats testing', () => {
        let editorObj: EditorManager;
        const editableElement: HTMLElement = createElement('div', { id: 'editorRoot', className: 'e-richtexteditor' });

        beforeAll(() => {
            document.body.appendChild(editableElement);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("editorRoot") });
        });

        beforeEach(() => {
            let tableContent = '<table class="e-rte-table" style="width: 100%; min-width: 0px;">';
            for (let i = 0; i < 6; i++) {
                tableContent += '<tr>';
                for (let j = 0; j < 6; j++) {
                    if (i === 5 && j === 5) {
                        tableContent += `<td style="width: 16.6%;">Text ${i},${j} <hr> <p><br></p></td>`;
                    } else {
                        tableContent += `<td style="width: 16.6%;">Text ${i},${j}</td>`;
                    }
                }
                tableContent += '</tr>';
            }
            tableContent += '</table>';

            editableElement.innerHTML = tableContent;
            editableElement.contentEditable = 'true';
            document.body.appendChild(editableElement);
        });

        afterEach(() => {
            detach(document.getElementById('editorRoot') as HTMLElement);
        });

        it('962747-Block Quote Formatting with Horizontal Line Causes Editor Unresponsive in Angular and Script Error in JS After Reverting', () => {
            const tdCollection: NodeListOf<HTMLTableCellElement> = document.querySelector('.e-rte-table').querySelectorAll('td');
            tdCollection.forEach(td => td.classList.add('e-cell-select'));
            const editorManager = new EditorManager({ document: document, editableElement: editableElement });
            editorManager.nodeSelection.setSelectionText(document,tdCollection[0].firstChild,tdCollection[35].firstChild,0,0);
            editorManager.execCommand("Formats", 'blockquote', null);
            const blockQuoteNodes = Array.from(editableElement.querySelectorAll('blockquote'));
            expect(blockQuoteNodes.length).toBeGreaterThan(0);
            blockQuoteNodes.forEach(node => {
                expect(node.tagName.toLowerCase()).toBe('blockquote');
            });

            editorObj.nodeSelection.Clear(document);
        });
    });

    describe('RTE Table Selection Feature - ', () => {
        describe('1003068:  Test case for the feature table Entire selection with the icon use case', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should create row insertion icons with correct attributes', (done: Function) => {
                rteObj.focusIn();
                const td = rteObj.contentModule.getEditPanel().querySelector('td');
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const rowInsertIcons: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                    rowInsertIcons.click();
                    const tdElements = rteObj.contentModule.getEditPanel().querySelectorAll('td');
                    const allHaveClass = Array.from(tdElements).every(td => td.classList.contains('e-cell-select'));
                    expect(allHaveClass).toBe(true);
                    done();
                }, 100);
            });
        });
        describe('1003068 Test case for the feature row click for row selection', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('Row wrapper icon selection for entire row selection', (done: Function) => {
                rteObj.focusIn();
                const table = rteObj.contentModule.getEditPanel().querySelector('table');
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                    expect(insertIcon).not.toBeNull();
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    insertIcon.dispatchEvent(mouseOverEvent);
                    // Check circle icon styling
                    setTimeout(() => {
                        const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                        circleIcon.click();
                        let trElements = rteObj.contentModule.getEditPanel().querySelector('tr');
                        const allHaveClass = Array.from(trElements.children).every(td => td.classList.contains('e-cell-select'));
                        expect(allHaveClass).toBe(true);
                        done();
                    }, 100)
                }, 100);
            });
        });
        describe('1003068: Test case for the column selection icon for column selection', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('Column wrapper icon selection for entire Column selection', (done: Function) => {
                rteObj.focusIn();
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                    expect(insertIcon).not.toBeNull();
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    insertIcon.dispatchEvent(mouseOverEvent);
                    // Check circle icon styling
                    setTimeout(() => {
                        const circleIcon = rteObj.contentModule.getEditPanel().querySelectorAll('.e-drag-and-drop')[1] as HTMLElement;
                        circleIcon.click();
                        let trElements = rteObj.contentModule.getEditPanel().querySelectorAll('tr');
                        const allFirstCellsHaveClass = Array.from(trElements).every(tr => {
                            const firstCell = tr.querySelector('td');
                            return firstCell && firstCell.classList.contains('e-cell-select');
                        });
                        expect(allFirstCellsHaveClass).toBe(true);
                        done();
                    }, 100)
                }, 100);
            });
        });
        describe('1003068: Test case for the table selection feature for the iframe case', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    iframeSettings: {
                        enable: true
                    },
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('Need to check for the table selection case for the iframe', (done: Function) => {
                rteObj.focusIn();
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                    expect(insertIcon).not.toBeNull();
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    insertIcon.dispatchEvent(mouseOverEvent);
                    // Check circle icon styling
                    setTimeout(() => {
                        const circleIcon = rteObj.contentModule.getEditPanel().querySelectorAll('.e-drag-and-drop')[1] as HTMLElement;
                        circleIcon.click();
                        let trElements = rteObj.contentModule.getEditPanel().querySelectorAll('tr');
                        const allFirstCellsHaveClass = Array.from(trElements).every(tr => {
                            const firstCell = tr.querySelector('td');
                            return firstCell && firstCell.classList.contains('e-cell-select');
                        });
                        expect(allFirstCellsHaveClass).toBe(true);
                        done();
                    }, 100)
                }, 100);
            });
        });
        describe('1003068: Test case for the table selection feature for RTL case', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    enableRtl: true,
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should create row insertion icons with correct attributes', (done: Function) => {
                rteObj.focusIn();
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                    expect(insertIcon).not.toBeNull();
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    insertIcon.dispatchEvent(mouseOverEvent);
                    // Check circle icon styling
                    setTimeout(() => {
                        const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                        circleIcon.click();
                        let trElements = rteObj.contentModule.getEditPanel().querySelector('tr');
                        const allHaveClass = Array.from(trElements.children).every(td => td.classList.contains('e-cell-select'));
                        expect(allHaveClass).toBe(true);
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe('1003068: CTRL + A case inside the table keyboard case ', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    enableRtl: true,
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should create row insertion icons with correct attributes', (done: Function) => {
                rteObj.focusIn();
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                const tr = rteObj.contentModule.getEditPanel().querySelector('tr') as HTMLElement;
                const keyUpEvent: KeyboardEvent = new KeyboardEvent('keydown', CONTROL_A_EVENT_INIT);
                td.dispatchEvent(keyUpEvent);
                setTimeout(() => {
                    expect(td.classList.contains('e-multi-cells-select')).toBe(true);
                    td.dispatchEvent(keyUpEvent);
                    setTimeout(() => {
                        const allHaveClass = Array.from(tr.children).every(td => td.classList.contains('e-multi-cells-select'));
                        expect(allHaveClass).toBe(true);
                        td.dispatchEvent(keyUpEvent);
                        setTimeout(() => {
                            const allHaveClasses = Array.from(rteObj.contentModule.getEditPanel().querySelectorAll('td')).every(td => td.classList.contains('e-multi-cells-select'));
                            expect(allHaveClasses).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            });
        });
        describe('1003068: Test case quictoolbar check while doing table selection', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('when the selection icon is clicked need to check if the quickToolbar is opened or not', (done: Function) => {
                rteObj.focusIn();
                let firstP: Element = (rteObj as any).inputElement.querySelector('tr td');
                setCursorPoint(firstP, 0);
                dispatchEvent(firstP, 'mousedown');
                (firstP as HTMLElement).click();
                dispatchEvent(firstP, 'mouseup');
                setTimeout(() => {
                    const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                    setCursorPoint(td, 0);
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    td.dispatchEvent(mouseOverEvent);
                    setTimeout(() => {
                        const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                        expect(insertIcon).not.toBeNull();
                        // Simulate mouseover on insertion icon
                        const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                        insertIcon.dispatchEvent(mouseOverEvent);
                        // Check circle icon styling
                        setTimeout(() => {
                            const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                            circleIcon.click();
                            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                            circleIcon.dispatchEvent(MOUSEUP_EVENT);
                            setTimeout(() => {
                                let quickPop: HTMLElement = document.querySelector('.e-rte-quick-toolbar');
                                expect(!isNullOrUndefined(quickPop)).toBe(true);
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
        });
        describe('1003068: Test case for the focus change check for the quickToolbar checking ', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    value: '<p> hello </p> <table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('Need to check if the cursor changes to the inside of the table ', (done: Function) => {
                rteObj.focusIn();
                let firstP: Element = (rteObj as any).inputElement.querySelector('tr td');
                setCursorPoint(firstP, 0);
                dispatchEvent((rteObj as any).inputElement, 'mousedown');
                dispatchEvent((rteObj as any).inputElement, 'mouseup');
                setTimeout(() => {
                    const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                    setCursorPoint(td, 0);
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    td.dispatchEvent(mouseOverEvent);
                    setTimeout(() => {
                        const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                        expect(insertIcon).not.toBeNull();
                        // Simulate mouseover on insertion icon
                        const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                        insertIcon.dispatchEvent(mouseOverEvent);
                        // Check circle icon styling
                        setTimeout(() => {
                            const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                            circleIcon.click();
                            const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                            circleIcon.dispatchEvent(MOUSEUP_EVENT);
                            setTimeout(() => {
                                let quickPop: HTMLElement = document.querySelector('.e-rte-quick-toolbar');
                                expect(document.getSelection().getRangeAt(0).endContainer.textContent).toBe('Cell 2');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
        });
        describe('1012280 Test case for the feature table selection and deselection', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable', 'Undo', 'Redo']
                    },
                    value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('Row, Column, Entire Table deselection', (done: Function) => {
                rteObj.focusIn();
                const table = rteObj.contentModule.getEditPanel().querySelector('table');
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                    expect(insertIcon).not.toBeNull();
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    insertIcon.dispatchEvent(mouseOverEvent);
                    // Check circle icon styling
                    setTimeout(() => {
                        const rowIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                        rowIcon.click();
                        let trElements = rteObj.contentModule.getEditPanel().querySelector('tr');
                        const allHaveClass = Array.from(trElements.children).every(td => td.classList.contains('e-cell-select'));
                        expect(allHaveClass).toBe(true);
                        rowIcon.click();
                        const allHaveNoClass = Array.from(trElements.children).every(td => !td.classList.contains('e-cell-select'));
                        expect(allHaveNoClass).toBe(true);
                        const colIcon = rteObj.contentModule.getEditPanel().querySelectorAll('.e-drag-and-drop')[1] as HTMLElement;
                        colIcon.click();
                        let trElementss = rteObj.contentModule.getEditPanel().querySelectorAll('tr');
                        const allFirstCellsHaveClass = Array.from(trElementss).every(tr => {
                            const firstCell = tr.querySelector('td');
                            return firstCell && firstCell.classList.contains('e-cell-select');
                        });
                        expect(allFirstCellsHaveClass).toBe(true);
                        colIcon.click();
                        const allFirstCellsHaveNoClass = Array.from(trElementss).every(tr => {
                            const firstCell = tr.querySelector('td');
                            return !firstCell.classList.contains('e-cell-select');
                        });
                        expect(allFirstCellsHaveNoClass).toBe(true);
                        const rowInsertIcons: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                        rowInsertIcons.click();
                        const tdElements = rteObj.contentModule.getEditPanel().querySelectorAll('td');
                        const allHaveClasstd = Array.from(tdElements).every(td => td.classList.contains('e-cell-select'));
                        expect(allHaveClasstd).toBe(true);
                        rowInsertIcons.click();
                        const allHaveClassNotd = Array.from(tdElements).every(td => !td.classList.contains('e-cell-select'));
                        expect(allHaveClassNotd).toBe(true);
                        done();
                    }, 100)
                }, 100);
            });
        });
    });

    describe('Table cell Properties testing', () => {
        describe('992140: Apply table cell width, height and properties', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should apply width, height, padding, border, colors, and alignment to the selected table cell', (done) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td');
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Increase the cell width testing
                        const cellWidthInput = document.querySelector('#' + rteObj.getID() + '_tableCellWidth') as HTMLInputElement;
                        const initialWidth: number = cell.getClientRects()[0].width;
                        cellWidthInput.value = (initialWidth + 100).toString();
                        cellWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.getClientRects()[0].width).toBeGreaterThan(initialWidth);
                        // Increase the cell height testing
                        const cellHeightInput = document.querySelector('#' + rteObj.getID() + '_tableCellHeight') as HTMLInputElement;
                        const initialHeight: number = cell.getClientRects()[0].height;
                        cellHeightInput.value = (initialHeight + 100).toString();
                        cellHeightInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.getClientRects()[0].height).toBeGreaterThan(initialHeight);
                        // Increase the cell padding testing
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        const initialPadding: string = cell.style.padding;
                        cellPaddingInput.value = '5';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.style.padding).toBe('5px');
                        // Increase the cell border width testing
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        const initialBorderWidth: string = cell.style.borderWidth;
                        cellBorderWidthInput.value = '3';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.style.borderWidth).toBe('3px');
                        const bdrClrInput = document.querySelectorAll('.e-btn.e-rte-border-colorpicker');
                        (bdrClrInput[1] as HTMLElement).click();
                        const bdrClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bdrClrOptions[4] as HTMLElement).click();
                        const bgClrInput = document.querySelectorAll('.e-btn.e-rte-table-bg-colorpicker');
                        (bgClrInput[1] as HTMLElement).click();
                        const bgClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bgClrOptions[3] as HTMLElement).click();
                        // left align testing
                        const leftAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignLeft');
                        leftAlign.click();
                        expect(cell.style.textAlign).toBe('left');
                        // center align testing
                        const centerAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignCenter');
                        centerAlign.click();
                        expect(cell.style.textAlign).toBe('center');
                        // right align testing
                        const rightAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignRight');
                        rightAlign.click();
                        expect(cell.style.textAlign).toBe('right');
                        // full align testing
                        const fullAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignFull');
                        fullAlign.click();
                        expect(cell.style.textAlign).toBe('justify');
                        // top align testing
                        const topAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignTop');
                        topAlign.click();
                        expect(cell.style.verticalAlign).toBe('top');
                        // middle align testing
                        const middleAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignMiddle');
                        middleAlign.click();
                        expect(cell.style.verticalAlign).toBe('middle');
                        // bottom align testing
                        const bottomAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignBottom');
                        bottomAlign.click();
                        expect(cell.style.verticalAlign).toBe('bottom');
                        const updateBtn = document.querySelector('.e-size-update');
                        (updateBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(cell.getClientRects()[0].width).toBeGreaterThan(initialWidth);
                            expect(cell.getClientRects()[0].height).toBeGreaterThan(initialHeight);
                            expect(cell.style.padding).toBe('5px');
                            expect(cell.style.borderWidth).toBe('3px');
                            expect(cell.style.borderColor).not.toBe('');
                            expect(cell.style.backgroundColor).not.toBe('');
                            expect(cell.style.verticalAlign).toBe('bottom');
                            expect(cell.style.textAlign).toBe('justify');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
        });

        describe('992140: Dialog cancellation: table cell property changes should not persist', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should not apply width, height, padding or border changes when the cell properties dialog is canceled', (done) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td');
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const initialHeight: number = cell.getClientRects()[0].height;
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Increase the cell width testing
                        const cellWidthInput = document.querySelector('#' + rteObj.getID() + '_tableCellWidth') as HTMLInputElement;
                        const initialWidth: number = cell.getClientRects()[0].width;
                        cellWidthInput.value = (initialWidth + 100).toString();
                        cellWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.getClientRects()[0].width).toBeGreaterThan(initialWidth);
                        // Increase the cell height testing
                        const cellHeightInput = document.querySelector('#' + rteObj.getID() + '_tableCellHeight') as HTMLInputElement;
                        cellHeightInput.value = (initialHeight + 100).toString();
                        cellHeightInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.getClientRects()[0].height).toBeGreaterThan(initialHeight);
                        // Increase the cell padding testing
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        const initialPadding: string = cell.style.padding;
                        cellPaddingInput.value = '5';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.style.padding).toBe('5px');
                        // Increase the cell border width testing
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        const initialBorderWidth: string = cell.style.borderWidth;
                        cellBorderWidthInput.value = '3';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.style.borderWidth).toBe('3px');
                        // full align testing
                        const fullAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignFull');
                        fullAlign.click();
                        expect(cell.style.textAlign).toBe('justify');
                        // top align testing
                        const topAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignTop');
                        topAlign.click();
                        expect(cell.style.verticalAlign).toBe('top');
                        const cancelBtn = document.querySelector('.e-cancel');
                        (cancelBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(cell.getClientRects()[0].height).toEqual(initialHeight);
                            expect(cell.style.padding).toBe('');
                            expect(cell.style.borderWidth).toBe('');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
        });

        describe('992140: Dialog cancellation (multiple cells): property changes should not persist', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should not persist width, height, padding or border changes when the properties dialog is canceled for multiple selected cells', (done) => {
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));

                setTimeout(() => {
                    const initialHeightOfFirstCell: number = firstCell.getClientRects()[0].height;
                    const initialHeightOfSecondCell: number = secondCell.getClientRects()[0].height;
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Increase the cell width testing
                        const cellWidthInput = document.querySelector('#' + rteObj.getID() + '_tableCellWidth') as HTMLInputElement;
                        const initialWidthOfFirstCell: number = firstCell.getClientRects()[0].width;
                        const initialWidthOfSecondCell: number = secondCell.getClientRects()[0].width;
                        cellWidthInput.value = (initialWidthOfFirstCell + 100).toString();
                        cellWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.getClientRects()[0].width).toBeGreaterThan(initialWidthOfFirstCell);
                        // Increase the cell height testing
                        const cellHeightInput = document.querySelector('#' + rteObj.getID() + '_tableCellHeight') as HTMLInputElement;
                        cellHeightInput.value = (initialHeightOfFirstCell + 100).toString();
                        cellHeightInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.getClientRects()[0].height).toBeGreaterThan(initialHeightOfFirstCell);
                        expect(secondCell.getClientRects()[0].height).toBeGreaterThan(initialHeightOfSecondCell);
                        // Increase the cell padding testing
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        const initialPadding: string = firstCell.style.padding;
                        cellPaddingInput.value = '5';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.style.padding).toBe('5px');
                        expect(secondCell.style.padding).toBe('5px');
                        // Increase the cell border width testing
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        cellBorderWidthInput.value = '3';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.style.borderWidth).toBe('3px');
                        expect(secondCell.style.borderWidth).toBe('3px');
                        // full align testing
                        const fullAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignFull');
                        fullAlign.click();
                        expect(firstCell.style.textAlign).toBe('justify');
                        expect(secondCell.style.textAlign).toBe('justify');
                        // top align testing
                        const topAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignTop');
                        topAlign.click();
                        expect(firstCell.style.verticalAlign).toBe('top');
                        expect(secondCell.style.verticalAlign).toBe('top');
                        const cancelBtn = document.querySelector('.e-cancel');
                        (cancelBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(firstCell.getClientRects()[0].height).toEqual(initialHeightOfFirstCell);
                            expect(secondCell.getClientRects()[0].height).toEqual(initialHeightOfSecondCell);
                            expect(firstCell.style.padding).toBe('');
                            expect(secondCell.style.padding).toBe('');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
        });

        describe('992140: Apply table cell background and border for multiple selection', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    enableRtl: true,
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should apply background color, border color and style to all selected cells', (done) => {
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                expect(firstCell.style.borderColor).toBe('');
                expect(firstCell.style.backgroundColor).toBe('');
                expect(secondCell.style.borderColor).toBe('');
                expect(secondCell.style.backgroundColor).toBe('');
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        const bdrClrInput = document.querySelectorAll('.e-btn.e-rte-border-colorpicker');
                        (bdrClrInput[1] as HTMLElement).click();
                        const bdrClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bdrClrOptions[4] as HTMLElement).click();
                        const bgClrInput = document.querySelectorAll('.e-btn.e-rte-table-bg-colorpicker');
                        (bgClrInput[1] as HTMLElement).click();
                        const bgClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bgClrOptions[3] as HTMLElement).click();
                        const bdrStyleInput = document.querySelector('#' + rteObj.getID() + '_cellborderStyle') as HTMLInputElement;
                        bdrStyleInput.click();
                        const bdrStyleOptions = document.querySelectorAll('.e-item');
                        (bdrStyleOptions[2] as HTMLElement).click(); // Select 'Dashed' style
                        bdrStyleInput.dispatchEvent(new Event('change', { bubbles: true }));
                        const updateBtn = document.querySelector('.e-size-update');
                        (updateBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(firstCell.style.borderColor).not.toBe('');
                            expect(secondCell.style.backgroundColor).not.toBe('');
                            expect(firstCell.style.borderStyle).toBe('dashed');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
        });

        describe('992140: Table cell property coverage', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    enableRtl: true
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should open the cell properties dialog when multiple table headers are selected', (done) => {
                rteObj.inputElement.innerHTML = `<p>Text before table</p><table class="e-rte-table"><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`;
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('th');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('th')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        done();
                    }, 200);
                }, 200);
            });
            it('should open the cell properties dialog for a single table header selection', (done) => {
                rteObj.inputElement.innerHTML = `<p>Text before table</p><table class="e-rte-table"><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`;
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('th');
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        const cellWidthInput = document.querySelector('#' + rteObj.getID() + '_tableCellWidth') as HTMLInputElement;
                        const initialWidth: number = cell.getClientRects()[0].width;
                        cellWidthInput.value = (initialWidth + 100).toString();
                        cellWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        const initialPadding: string = cell.style.padding;
                        cellPaddingInput.value = '8';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        done();
                    }, 200);
                }, 200);
            });
            it('should apply and revert width, height, padding and border for a single cell', (done) => {
                rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td style="height: 35px; padding: 5px; background-color: rgb(237, 125, 49); text-align: right; vertical-align: bottom; border-width: 5px; border-style: outset; border-color: rgb(180, 198, 231);"><br></td><td style="height: 35px; padding: 5px; background-color: rgb(237, 125, 49); text-align: right; vertical-align: bottom; border-width: 5px; border-style: outset; border-color: rgb(180, 198, 231);"><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`;
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td');
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const initialHeight: number = cell.getClientRects()[0].height;
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        // Increase the cell width testing
                        const cellWidthInput = document.querySelector('#' + rteObj.getID() + '_tableCellWidth') as HTMLInputElement;
                        const initialWidth: number = cell.getClientRects()[0].width;
                        cellWidthInput.value = (initialWidth + 100).toString();
                        cellWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.getClientRects()[0].width).toBeGreaterThan(initialWidth);
                        // Increase the cell height testing
                        const cellHeightInput = document.querySelector('#' + rteObj.getID() + '_tableCellHeight') as HTMLInputElement;
                        cellHeightInput.value = (initialHeight + 100).toString();
                        cellHeightInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.getClientRects()[0].height).toBeGreaterThan(initialHeight);
                        // Increase the cell padding testing
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        const initialPadding: string = cell.style.padding;
                        cellPaddingInput.value = '8';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.style.padding).toBe('8px');
                        // Increase the cell border width testing
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        const initialBorderWidth: string = cell.style.borderWidth;
                        cellBorderWidthInput.value = '7';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(cell.style.borderWidth).toBe('7px');
                        // full align testing
                        const fullAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignFull');
                        fullAlign.click();
                        expect(cell.style.textAlign).toBe('justify');
                        // top align testing
                        const topAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignTop');
                        topAlign.click();
                        expect(cell.style.verticalAlign).toBe('top');
                        const bdrClrInput = document.querySelectorAll('.e-btn.e-rte-border-colorpicker');
                        (bdrClrInput[1] as HTMLElement).click();
                        const bdrClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bdrClrOptions[4] as HTMLElement).click();
                        const bgClrInput = document.querySelectorAll('.e-btn.e-rte-table-bg-colorpicker');
                        (bgClrInput[1] as HTMLElement).click();
                        const bgClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bgClrOptions[3] as HTMLElement).click();
                        const bdrStyleInput = document.querySelector('#' + rteObj.getID() + '_cellborderStyle') as HTMLInputElement;
                        bdrStyleInput.click();
                        const bdrStyleOptions = document.querySelectorAll('.e-item');
                        (bdrStyleOptions[2] as HTMLElement).click(); // Select 'Dashed' style
                        bdrStyleInput.dispatchEvent(new Event('change', { bubbles: true }));
                        const cancelBtn = document.querySelector('.e-cancel');
                        (cancelBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(cell.getClientRects()[0].height).toEqual(initialHeight);
                            expect(cell.style.padding).toBe('5px');
                            expect(cell.style.borderWidth).toBe('5px');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
            it('should apply properties and revert changes for multiple selected cells', (done) => {
                rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td style="height: 35px; padding: 5px; background-color: rgb(237, 125, 49); text-align: right; vertical-align: bottom; border-width: 5px; border-style: outset; border-color: rgb(180, 198, 231);"><br></td><td style="height: 35px; padding: 5px; background-color: rgb(237, 125, 49); text-align: right; vertical-align: bottom; border-width: 5px; border-style: outset; border-color: rgb(180, 198, 231);"><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`;
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const initialHeight: number = firstCell.getClientRects()[0].height;
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        // Increase the cell width testing
                        const cellWidthInput = document.querySelector('#' + rteObj.getID() + '_tableCellWidth') as HTMLInputElement;
                        const initialWidth: number = firstCell.getClientRects()[0].width;
                        cellWidthInput.value = (initialWidth + 100).toString();
                        cellWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.getClientRects()[0].width).toBeGreaterThan(initialWidth);
                        // Increase the cell height testing
                        const cellHeightInput = document.querySelector('#' + rteObj.getID() + '_tableCellHeight') as HTMLInputElement;
                        cellHeightInput.value = (initialHeight + 100).toString();
                        cellHeightInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.getClientRects()[0].height).toBeGreaterThan(initialHeight);
                        // Increase the cell padding testing
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        const initialPadding: string = firstCell.style.padding;
                        cellPaddingInput.value = '8';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.style.padding).toBe('8px');
                        // Increase the cell border width testing
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        const initialBorderWidth: string = firstCell.style.borderWidth;
                        cellBorderWidthInput.value = '7';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        expect(firstCell.style.borderWidth).toBe('7px');
                        // full align testing
                        const fullAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellHorizontalAlignFull');
                        fullAlign.click();
                        expect(firstCell.style.textAlign).toBe('justify');
                        // top align testing
                        const topAlign: HTMLElement = document.querySelector('#' + rteObj.getID() + '_tableCellVerticalAlignTop');
                        topAlign.click();
                        expect(firstCell.style.verticalAlign).toBe('top');
                        const bdrClrInput = document.querySelectorAll('.e-btn.e-rte-border-colorpicker');
                        (bdrClrInput[1] as HTMLElement).click();
                        const bdrClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bdrClrOptions[4] as HTMLElement).click();
                        const bgClrInput = document.querySelectorAll('.e-btn.e-rte-table-bg-colorpicker');
                        (bgClrInput[1] as HTMLElement).click();
                        const bgClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bgClrOptions[3] as HTMLElement).click();
                        const bdrStyleInput = document.querySelector('#' + rteObj.getID() + '_cellborderStyle') as HTMLInputElement;
                        bdrStyleInput.click();
                        const bdrStyleOptions = document.querySelectorAll('.e-item');
                        (bdrStyleOptions[2] as HTMLElement).click(); // Select 'Dashed' style
                        bdrStyleInput.dispatchEvent(new Event('change', { bubbles: true }));
                        const cancelBtn = document.querySelector('.e-cancel');
                        (cancelBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(firstCell.getClientRects()[0].height).toEqual(initialHeight);
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
            it('should handle height input and padding changes for multiple selected cells', (done) => {
                rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td class="e-cell-select" style="border-width: 1px; border-style: double; height: 30px; padding: 3px;"><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`;
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[2];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        const cellHeightInput = document.querySelector('#' + rteObj.getID() + '_tableCellHeight') as HTMLInputElement;
                        expect(cellHeightInput.value).toBe('');
                        const cellPaddingInput = document.querySelector('#' + rteObj.getID() + '_cellPadding') as HTMLInputElement;
                        cellPaddingInput.value = '8';
                        cellPaddingInput.dispatchEvent(new Event('change', { bubbles: true }));
                        done();
                    }, 200);
                }, 200);
            });
        });
        describe('Table cell property with dropdown testing, for single cell selection ', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it ('should handel the dropdown for width in sigle cell', (done: DoneFn) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td');
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                        expect(widthDropDownbtn).not.toBeNull();
                        widthDropDownbtn.click();
                        setTimeout(() => {
                            const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                            const secondItem: HTMLElement = dropdownList.childNodes[0] as HTMLElement;
                            secondItem.click();
                            setTimeout(() => {
                                const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                                widthDropDownbtn.click();
                                setTimeout(() => {
                                    const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                                    const thirdItem: HTMLElement = dropdownList.childNodes[2] as HTMLElement;
                                    thirdItem.click();
                                    setTimeout(() => {
                                        expect(cell.closest('table').querySelectorAll('col')[0].style.width).toBe('auto');
                                        const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                                        widthDropDownbtn.click();
                                        setTimeout(() => {
                                            const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                                            const firstItem: HTMLElement = dropdownList.childNodes[0] as HTMLElement;
                                            firstItem.click();
                                            setTimeout(() => {
                                                expect(cell.closest('table').querySelectorAll('col')[0].style.width).not.toBe('auto');
                                                done();
                                            },100)
                                        },100)
                                    },100)
                                },100)
                            },100)
                        },200);
                    }, 200);
                }, 200);
            })
            it ('should handel the dropdown for height in sigle cell selection', (done: DoneFn) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td');
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const heightDropDownbtn: HTMLElement = document.querySelector('#heightValueBtn') as HTMLElement;
                        expect(heightDropDownbtn).not.toBeNull();
                        heightDropDownbtn.click();
                        setTimeout(() => {
                            const dropdownList: HTMLElement = document.getElementById('heightValueBtn-popup').childNodes[0] as HTMLElement;
                            const secondItem: HTMLElement = dropdownList.childNodes[1] as HTMLElement;
                            secondItem.click();
                            setTimeout(() => {
                                const heightDropDownbtn: HTMLElement = document.querySelector('#heightValueBtn') as HTMLElement;
                                heightDropDownbtn.click()
                                setTimeout(() => {
                                    const dropdownList: HTMLElement = document.getElementById('heightValueBtn-popup').childNodes[0] as HTMLElement;
                                    const thirdItem: HTMLElement = dropdownList.childNodes[2] as HTMLElement;
                                    thirdItem.click();
                                    setTimeout(() => {
                                        expect(cell.style.height).toBe('auto');
                                        const heightDropDownbtn: HTMLElement = document.querySelector('#heightValueBtn') as HTMLElement;
                                        heightDropDownbtn.click();
                                        setTimeout(() => {
                                            const dropdownList: HTMLElement = document.getElementById('heightValueBtn-popup').childNodes[0] as HTMLElement;
                                            const firstItem: HTMLElement = dropdownList.childNodes[0] as HTMLElement;
                                            firstItem.click();
                                            setTimeout(() => {
                                                expect(cell.style.height).not.toBe('auto');
                                                done();
                                            },100)
                                        },100)
                                    },100)
                                },100)
                            },100)
                        },200);
                    }, 200);
                }, 200);
            })
        });
        describe('Table cell property with dropdown testing, for multiple cell selction', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it ('should handel the dropdown for width in multiple cell', (done: DoneFn) => {
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                        expect(widthDropDownbtn).not.toBeNull();
                        widthDropDownbtn.click();
                        setTimeout(() => {
                            const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                            const secondItem: HTMLElement = dropdownList.childNodes[0] as HTMLElement;
                            secondItem.click();
                            setTimeout(() => {
                                const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                                widthDropDownbtn.click();
                                setTimeout(() => {
                                    const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                                    const thirdItem: HTMLElement = dropdownList.childNodes[2] as HTMLElement;
                                    thirdItem.click();
                                    setTimeout(() => {
                                        expect(firstCell.closest('table').querySelectorAll('col')[0].style.width).toBe('auto');
                                        const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                                        widthDropDownbtn.click();
                                        setTimeout(() => {
                                            const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                                            const firstItem: HTMLElement = dropdownList.childNodes[1] as HTMLElement;
                                            firstItem.click();
                                            setTimeout(() => {
                                                expect(firstCell.closest('table').querySelectorAll('col')[0].style.width).not.toBe('auto');
                                                done();
                                            });
                                        },100)
                                    },100)
                                },100)
                            },100)
                        },200);
                    }, 200);
                }, 200);
            })
            it ('should handel the dropdown for height in multiple cell selection', (done: DoneFn) => {
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const heightDropDownbtn: HTMLElement = document.querySelector('#heightValueBtn') as HTMLElement;
                        expect(heightDropDownbtn).not.toBeNull();
                        heightDropDownbtn.click();
                        setTimeout(() => {
                            const dropdownList: HTMLElement = document.getElementById('heightValueBtn-popup').childNodes[0] as HTMLElement;
                            const secondItem: HTMLElement = dropdownList.childNodes[1] as HTMLElement;
                            secondItem.click();
                            setTimeout(() => {
                                const heightDropDownbtn: HTMLElement = document.querySelector('#heightValueBtn') as HTMLElement;
                                heightDropDownbtn.click()
                                setTimeout(() => {
                                    const dropdownList: HTMLElement = document.getElementById('heightValueBtn-popup').childNodes[0] as HTMLElement;
                                    const thirdItem: HTMLElement = dropdownList.childNodes[2] as HTMLElement;
                                    thirdItem.click();
                                    setTimeout(() => {
                                        expect(firstCell.style.height).toBe('auto');
                                        const heightDropDownbtn: HTMLElement = document.querySelector('#heightValueBtn') as HTMLElement;
                                        heightDropDownbtn.click();
                                        setTimeout(() => {
                                            const dropdownList: HTMLElement = document.getElementById('heightValueBtn-popup').childNodes[0] as HTMLElement;
                                            const firstItem: HTMLElement = dropdownList.childNodes[0] as HTMLElement;
                                            firstItem.click();
                                            setTimeout(() => {
                                                expect(firstCell.style.height).not.toBe('auto');
                                                done();
                                            })
                                        },100)
                                    },100)
                                },100)
                            },100)
                        },200);
                    }, 200);
                }, 200);
            })
        });
        describe('Table cell editing, dropdown coverage', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: auto;"><col style="width: 50%;"></colgroup><tbody><tr><td style="border-width: 1px; border-style: double; height: auto;" class="e-cell-select e-multi-cells-select"><br></td><td style="height: 41px; vertical-align: middle; border-style: double; border-width: 1px;" class="e-cell-select e-multi-cells-select e-cell-select-end"><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it ('should handel the dropdown for width in multiple cell', (done: DoneFn) => {
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        expect(firstCell.closest('table').querySelectorAll('col')[0].style.width).toBe('auto');
                        done();
                    }, 200);
                }, 200);
            })
        });
        describe('1011840: Editor scrolls to top when clicking Update in Cell Properties dialog', () => {
            let rteObj: RichTextEditor;
            const longContent: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"><thead style="height: 16.5563%"><tr style="height: 16.5563%"><th style="width: 12.1813%"><span>S No</span><br></th><th style="width: 23.2295%"><span>Name</span><br></th><th style="width: 9.91501%"><span>Age</span><br></th><th style="width: 15.5807%"><span>Gender</span><br></th><th style="width: 17.9887%"><span>Occupation</span><br></th><th style="width: 21.1048%">Mode of Transport</th></tr></thead><tbody><tr style="height: 16.5563%"><td style="width: 12.1813%">1</td><td style="width: 23.2295%">Selma Rose</td><td style="width: 9.91501%">30</td><td style="width: 15.5807%">Female</td><td style="width: 17.9887%"><span>Engineer</span><br></td><td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">2</td><td style="width: 23.2295%"><span>Robert</span><br></td><td style="width: 9.91501%">28</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%"><span>Graphic Designer</span></td><td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">3</td><td style="width: 23.2295%"><span>William</span><br></td><td style="width: 9.91501%">35</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Teacher</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">4</td><td style="width: 23.2295%"><span>Laura Grace</span><br></td><td style="width: 9.91501%">42</td><td style="width: 15.5807%">Female</td><td style="width: 17.9887%">Doctor</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them.</p><p>The Editor supports integration with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images.</p>`;

            beforeEach(() => {
                rteObj = renderRTE({
                    height: 400,
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: longContent
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });

            it('should not scroll the editor to the top when Update is clicked', (done: DoneFn) => {
                rteObj.focusIn();
                // Get the first TD of the table in the content
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                expect(cell).not.toBeNull();
                // Place the cursor inside the first td
                const range = document.createRange();
                range.setStart(cell.firstChild || cell, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                // Simulate mousedown + mouseup on the cell to trigger the quick toolbar
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    // Open Cell Properties dialog via quick toolbar button
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties');
                    (tableCellPropsBtn.parentElement as HTMLElement).click();
                    setTimeout(() => {
                        const widthValueBtn = document.querySelector('#widthValueBtn') as HTMLElement;
                        expect(widthValueBtn.title).not.toBeNull();
                        const updateBtn = document.querySelector('.e-size-update') as HTMLElement;
                        expect(updateBtn).not.toBeNull();
                        updateBtn.click();
                        setTimeout(() => {
                            expect((window.getSelection().getRangeAt(0).startContainer.parentElement as HTMLElement).closest('table')).not.toBeNull();
                            done();
                        }, 200);
                    }, 200);
                }, 200);
            });
        });
        describe('1012234: Editor scrolls to top when clicking Update in Cell Properties dialog', () => {
            let rteObj: RichTextEditor;
            const longContent: string = `<h1>Welcome to the Syncfusion Rich Text Editor</h1><p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p><h2>Do you know the key features of the editor?</h2><ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote><h2>Unlock the Power of Tables</h2><p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"><thead style="height: 16.5563%"><tr style="height: 16.5563%"><th style="width: 12.1813%"><span>S No</span><br></th><th style="width: 23.2295%"><span>Name</span><br></th><th style="width: 9.91501%"><span>Age</span><br></th><th style="width: 15.5807%"><span>Gender</span><br></th><th style="width: 17.9887%"><span>Occupation</span><br></th><th style="width: 21.1048%">Mode of Transport</th></tr></thead><tbody><tr style="height: 16.5563%"><td style="width: 12.1813%">1</td><td style="width: 23.2295%">Selma Rose</td><td style="width: 9.91501%">30</td><td style="width: 15.5807%">Female</td><td style="width: 17.9887%"><span>Engineer</span><br></td><td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">2</td><td style="width: 23.2295%"><span>Robert</span><br></td><td style="width: 9.91501%">28</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%"><span>Graphic Designer</span></td><td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">3</td><td style="width: 23.2295%"><span>William</span><br></td><td style="width: 9.91501%">35</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Teacher</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">4</td><td style="width: 23.2295%"><span>Laura Grace</span><br></td><td style="width: 9.91501%">42</td><td style="width: 15.5807%">Female</td><td style="width: 17.9887%">Doctor</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td></tr><tr style="height: 16.5563%"><td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Images</h2><p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them.</p><p>The Editor supports integration with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images.</p>`;

            beforeEach(() => {
                rteObj = renderRTE({
                    height: 400,
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: longContent
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should not scroll the editor to the top when Update is clicked', (done: DoneFn) => {
                rteObj.focusIn();
                // Get the first TD of the table in the content
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                expect(cell).not.toBeNull();
                // Place the cursor inside the first td
                const range = document.createRange();
                range.setStart(cell.firstChild || cell, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                // Simulate mousedown + mouseup on the cell to trigger the quick toolbar
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    // Open Cell Properties dialog via quick toolbar button
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties');
                    (tableCellPropsBtn.parentElement as HTMLElement).click();
                    setTimeout(() => {
                        // Set border style to Solid
                        const bdrStyleInput = document.querySelector('#' + rteObj.getID() + '_cellborderStyle') as HTMLElement;
                        bdrStyleInput.click();
                        setTimeout(() => {
                            const bdrStyleOptions = document.querySelectorAll('.e-item');
                            (bdrStyleOptions[1] as HTMLElement).click(); // Select 'Solid' style
                            bdrStyleInput.dispatchEvent(new Event('change', { bubbles: true }));
                            // Set background color (pick 4th palette tile)
                            const bgClrInput = document.querySelectorAll('.e-btn.e-rte-table-bg-colorpicker');
                            (bgClrInput[1] as HTMLElement).click();
                            const bgClrOptions = document.querySelectorAll('.e-rte-square-palette');
                            (bgClrOptions[3] as HTMLElement).click();
                            // Click Update and verify range is still inside the table
                            const updateBtn = document.querySelector('.e-size-update') as HTMLElement;
                            expect(updateBtn).not.toBeNull();
                            updateBtn.click();
                            setTimeout(() => {
                                expect((window.getSelection().getRangeAt(0).startContainer.parentElement as HTMLElement).closest('table')).not.toBeNull();
                                done();
                            }, 200);
                        }, 200);
                    }, 200);
                }, 200);
            });
        });
        describe('1012026: Cell selection should be retained after setting border style to solid', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should retain e-cell-select class on the selected td after setting border style to Solid and after updating the width to auto', (done: DoneFn) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        // Open the border style dropdown and select 'Solid' (index 1)
                        const bdrStyleInput = document.querySelector('#' + rteObj.getID() + '_cellborderStyle') as HTMLElement;
                        bdrStyleInput.click();
                        const bdrStyleOptions = document.querySelectorAll('.e-item');
                        (bdrStyleOptions[1] as HTMLElement).click(); // Select 'Solid' style
                        bdrStyleInput.dispatchEvent(new Event('change', { bubbles: true }));
                        // Open the width dropdown
                        const widthDropDownbtn: HTMLElement = document.querySelector('#widthValueBtn') as HTMLElement;
                        expect(widthDropDownbtn).not.toBeNull();
                        widthDropDownbtn.click();
                        setTimeout(() => {
                            // Select 'Auto' — the third item (index 2)
                            const dropdownList: HTMLElement = document.getElementById('widthValueBtn-popup').childNodes[0] as HTMLElement;
                            const autoItem: HTMLElement = dropdownList.childNodes[2] as HTMLElement;
                            autoItem.click();
                            setTimeout(() => {
                                // The td should still have the e-cell-select class
                                expect(cell.classList.contains('e-cell-select')).toBe(true);
                                done();
                            }, 100);
                        }, 200);
                    }, 200);
                }, 200);
            });
        });
        describe('1012535: Border width and border style auto-apply behavior in cell property dialog', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['CreateTable']
                    },
                    quickToolbarSettings: {
                        table: ['TableCellProperties', 'Styles']
                    },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td>Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteEle = rteObj.element;
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('should not add border-width or border-style to td when Update is clicked without any border interaction', (done) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                // Capture border state before dialog opens
                const initialBorderWidth: string = cell.style.borderWidth;
                const initialBorderStyle: string = cell.style.borderStyle;
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Click Update without making any border changes
                        const updateBtn = document.querySelector('.e-size-update');
                        (updateBtn as HTMLElement).click();
                        setTimeout(() => {
                            // border-width and border-style must remain as they were before the dialog opened
                            expect(cell.style.borderWidth).toBe(initialBorderWidth);
                            expect(cell.style.borderStyle).toBe(initialBorderStyle);
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
            it('should auto-apply border-style when border color is changed and border-style was not set', (done) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                // Ensure td has no border-style initially
                expect(cell.style.borderStyle).toBe('');
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Change the border color
                        const bdrClrInput = document.querySelectorAll('.e-btn.e-rte-border-colorpicker');
                        (bdrClrInput[1] as HTMLElement).click();
                        const bdrClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bdrClrOptions[4] as HTMLElement).click();
                        // After picking a border color, border-color should be set
                        expect(cell.style.borderColor).not.toBe('');
                        // border-style should have been auto-applied since it was empty
                        expect(cell.style.borderStyle).not.toBe('');
                        const updateBtn = document.querySelector('.e-size-update');
                        (updateBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(cell.style.borderColor).not.toBe('');
                            expect(cell.style.borderStyle).not.toBe('');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
            it('should auto-apply border-style when border-width is changed and border-style was not set', (done) => {
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                // Ensure td has no border-style initially
                expect(cell.style.borderStyle).toBe('');
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Increase the border width
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        cellBorderWidthInput.value = '3';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        // After changing border-width, it should be applied on td
                        expect(cell.style.borderWidth).toBe('3px');
                        // border-style should have been auto-applied since it was empty
                        expect(cell.style.borderStyle).not.toBe('');
                        const updateBtn = document.querySelector('.e-size-update');
                        (updateBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(cell.style.borderWidth).toBe('3px');
                            expect(cell.style.borderStyle).not.toBe('');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
            it('should preserve existing border-width when border-style is changed directly', (done) => {
                // Override value to have a td with pre-existing border-width
                destroy(rteObj);
                rteObj = renderRTE({
                    toolbarSettings: { items: ['CreateTable'] },
                    quickToolbarSettings: { table: ['TableCellProperties', 'Styles'] },
                    value: `<p>Text before table</p><table class="e-rte-table"><tbody><tr><td style="border-width: 2px;">Cell content</td><td>More content</td></tr></tbody></table><p>Text after table</p>`,
                });
                rteObj.focusIn();
                const cell = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                const range = document.createRange();
                range.setStart(cell.firstChild, 0);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 50,
                    button: 0
                };
                // td already has border-width: 2px from value
                expect(cell.style.borderWidth).toBe('2px');
                cell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                cell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        expect(dialog).not.toBeNull();
                        // Change border style via dropdown
                        const bdrStyleInput = document.querySelector('#' + rteObj.getID() + '_cellborderStyle') as HTMLElement;
                        bdrStyleInput.click();
                        const bdrStyleOptions = document.querySelectorAll('.e-item');
                        (bdrStyleOptions[2] as HTMLElement).click(); // Select 'Dashed' style
                        bdrStyleInput.dispatchEvent(new Event('change', { bubbles: true }));
                        // Border style should be updated to dashed
                        expect(cell.style.borderStyle).toBe('dashed');
                        // Border width set before must still be present
                        expect(cell.style.borderWidth).toBe('2px');
                        const updateBtn = document.querySelector('.e-size-update');
                        (updateBtn as HTMLElement).click();
                        setTimeout(() => {
                            expect(cell.style.borderStyle).toBe('dashed');
                            expect(cell.style.borderWidth).toBe('2px');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            });
            it ('should handle multiple cell selction border style usecase', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td style="border-width: 2px; border-style: solid; border-color: rgb(244, 176, 131);" class="e-cell-select e-multi-cells-select"><br></td><td class="e-cell-select e-multi-cells-select e-cell-select-end" style=""><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`;
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        // Increase the border width
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        cellBorderWidthInput.value = '3';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        setTimeout(() => {
                            expect(firstCell.style.borderWidth).toBe('3px');
                            expect(firstCell.style.borderColor).toBe('');
                            expect(secondCell.style.borderStyle).not.toBe('');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            })
            it ('should handle multiple cell selction border color usecase', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td style="border-width: 2px; border-style: solid; border-color: rgb(244, 176, 131);" class="e-cell-select e-multi-cells-select"><br></td><td class="e-cell-select e-multi-cells-select e-cell-select-end" style=""><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`;
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        // Change the border color
                        const bdrClrInput = document.querySelectorAll('.e-btn.e-rte-border-colorpicker');
                        (bdrClrInput[1] as HTMLElement).click();
                        const bdrClrOptions = document.querySelectorAll('.e-rte-square-palette');
                        (bdrClrOptions[4] as HTMLElement).click();
                        setTimeout(() => {
                            expect(firstCell.style.borderColor).not.toBe('');
                            expect(secondCell.style.borderStyle).toBe(firstCell.style.borderStyle);
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            })
            it ('should handle multiple cell selction border color with existing border color', (done: DoneFn) => {
                rteObj.inputElement.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 50%;"><col style="width: 50%;"></colgroup><tbody><tr><td class="e-cell-select e-multi-cells-select"><br></td><td class="e-cell-select e-multi-cells-select e-cell-select-end" style="border-width: 2px; border-style: solid; border-color: rgb(244, 176, 131);"><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table>`;
                rteObj.focusIn();
                let firstCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td');
                const eventsArg: MouseEventInit = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: 50,
                    clientY: 300,
                    button: 0
                };
                firstCell.dispatchEvent(new MouseEvent('mousedown', eventsArg));
                let ev = new MouseEvent("mousemove", {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                let secondCell: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('td')[1];
                secondCell.dispatchEvent(ev);
                firstCell.dispatchEvent(new MouseEvent('mouseup', eventsArg));
                setTimeout(() => {
                    const tableCellPropsBtn = document.querySelector('.e-table-editCell-properties').parentElement;
                    (tableCellPropsBtn as HTMLElement).click();
                    setTimeout(() => {
                        const dialog = document.querySelector('.e-rte-edit-table');
                        // Increase the border width
                        const cellBorderWidthInput = document.querySelector('#' + rteObj.getID() + '_cellborderWidth') as HTMLInputElement;
                        cellBorderWidthInput.value = '3';
                        cellBorderWidthInput.dispatchEvent(new Event('change', { bubbles: true }));
                        setTimeout(() => {
                            expect(firstCell.style.borderColor).not.toBe('');
                            expect(secondCell.style.borderColor).not.toBe('');
                            done();
                        }, 100);
                    }, 200);
                }, 200);
            })
        });
    });
    describe('1011281:  Table header cells (th) not selected during entire table selection', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"> <colgroup> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> </colgroup> <thead> <tr> <th><br/></th> <th><br/></th> <th><br/></th> </tr> </thead> <tbody> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> </tbody> </table>'
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Selecting the entire table should select th tag also', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const rowInsertIcons: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                rowInsertIcons.click();
                const tdElements = rteObj.contentModule.getEditPanel().querySelectorAll('td, th');
                const allHaveClass = Array.from(tdElements).every(td => td.classList.contains('e-cell-select'));
                expect(allHaveClass).toBe(true);
                done();
            }, 100);
        });
    });

    describe('1012279:  enter key is pressed to check the position of the wrappers', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"> <colgroup> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> </colgroup> <thead> <tr> <th><br/></th> <th><br/></th> <th><br/></th> </tr> </thead> <tbody> <tr> <td class = "e-cell-select"><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> </tbody> </table>'
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Selecting the entire table should select th tag also', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            setCursorPoint(td, 0);
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                (rteObj as any).tableModule.tableObj.updateSelectionWrappers();
                (rteObj as any).tableModule.tableObj.updateLastInsertIconPositions();
                expect(rteObj.inputElement.querySelector('.e-cell-select')).not.toBeNull();
                done();
            }, 100);
        });
    });

    describe('1011281:  Test the scroll for the positoining of the wrapper icons', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                height: '400',
                value: '<h1>Welcome to the Syncfusion Rich Text Editor</h1> <p>The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p> <h2>Do you know the key features of the editor?</h2> <ul> <li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li> <li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> <li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li> <li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li> </ul> <blockquote> <p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p> </blockquote> <h2>Unlock the Power of Tables</h2> <p>A table can be created in the editor using either a keyboard shortcut or the toolbar. With the quick toolbar, you can perform table cell insert, delete, split, and merge operations. You can style the table cells using background colours and borders.</p> <table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br/></th> <th style="width: 23.2295%"><span>Name</span><br/></th> <th style="width: 9.91501%"><span>Age</span><br/></th> <th style="width: 15.5807%"><span>Gender</span><br/></th> <th style="width: 17.9887%"><span>Occupation</span><br/></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br/></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br/></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br/></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br/></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td> <td style="width: 23.2295%"><span>Andrew James</span><br/></td> <td style="width: 9.91501%">45</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Lawyer</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td> </tr> </tbody> </table> <h2>Elevating Your Content with Images</h2> <p>Images can be added to the editor by pasting or dragging into the editing area, using the toolbar to insert one as a URL, or uploading directly from the File Browser. Easily manage your images on the server by configuring the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/#insertimagesettings" title="Insert Image Settings API" aria-label="Open in new window">insertImageSettings</a> to upload, save, or remove them.</p> <p>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images. Check out the demos <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/image-editor-integration.html" title="Image Editor Demo" aria-label="Open in new window">here</a>.</p> <p><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-img-inline"/></p>'
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('scrolling the RTE content and then checking the position', (done: Function) => {
            rteObj.focusIn();
            rteObj.inputElement.scrollTop = 200;
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const rowInsertIcons: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                rowInsertIcons.click();
                const topPosition = parseFloat(rowInsertIcons.parentElement.style.top);
                expect(topPosition).toBeGreaterThan(450);
                done();
            }, 100);
        });
    });
    describe('1011281: Test the row add icon is present or not ', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"> <colgroup> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> </colgroup> <thead> <tr> <th><br/></th> <th><br/></th> <th><br/></th> </tr> </thead> <tbody> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> </tbody> </table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Selecting the entire table should select th tag also', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const rowInsertIcons: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                rowInsertIcons.click();
                const tdElements = rteObj.contentModule.getEditPanel().querySelectorAll('.e-rte-table-resize.e-tb-col-insert .e-icons.e-circle, .e-rte-table-resize.e-tb-row-insert .e-icons.e-circle');
                expect(tdElements.length).toBe(3);
                done();
            }, 100);
        });
    });
    describe('1014931: Table selection wrappers persist during table resize operation', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"> <colgroup> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> </colgroup> <thead> <tr> <th><br/></th> <th><br/></th> <th><br/></th> </tr> </thead> <tbody> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> </tbody> </table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('selection the row add icon must remove the all the wrappers', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const circle: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-circle');
                circle.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const rowInsertIcons: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                    expect(rowInsertIcons).not.toBeNull;
                    const circleAdd: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-circle-add');
                    circleAdd.click();
                    const rowInsert: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-move');
                    expect(rowInsert).toBeNull;
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('1014830: Test the row add icon is removed after code view ', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo', 'SourceCode']
                },
                value: '<table class="e-rte-table" style="width: 100%; min-width: 0px;"> <colgroup> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> <col style="width: 33.3333%;"> </colgroup> <thead> <tr> <th><br/></th> <th><br/></th> <th><br/></th> </tr> </thead> <tbody> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> <tr> <td><br/></td> <td><br/></td> <td><br/></td> </tr> </tbody> </table>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Selecting the entire table should select th tag also', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td');
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const entireTableSelectIcon: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-table-wrapper');
                const rowSelectIcon: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-row-wrapper');
                const ColSelectIcon: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-col-wrapper');
                expect(entireTableSelectIcon).not.toBeNull;
                expect(rowSelectIcon).not.toBeNull;
                expect(ColSelectIcon).not.toBeNull;
                const sourceCodeItem: HTMLElement = rteObj.element.querySelector('#' + rteObj.element.id + '_toolbar_SourceCode');
                sourceCodeItem.click();
                setTimeout(() => {
                    let textarea: HTMLTextAreaElement = (rteObj as any).element.querySelector('.e-rte-srctextarea');
                    expect(textarea.querySelector('.e-table-wrapper')).toBeNull;
                    expect(textarea.querySelector('.e-row-wrapper')).toBeNull;
                    expect(textarea.querySelector('.e-col-wrapper')).toBeNull;
                    done();
                }, 100);
            }, 100);
        });
    });
    describe('1012030: Test case quictoolbar check while doing table selection when show on Right click is enabled', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                quickToolbarSettings: {
                    table: ['Tableheader', 'TableRemove', '|', 'TableRows', 'TableColumns', 'TableCell', '|', 'TableEditProperties', 'TableCellProperties', 'Styles', 'BackgroundColor', 'Alignments', 'TableCellVerticalAlign'],
                    showOnRightClick: true,
                },
                value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('when the selection icon is clicked need to check if the quickToolbar is opened or not', (done: Function) => {
            rteObj.focusIn();
            let firstP: Element = (rteObj as any).inputElement.querySelector('tr td');
            const mouseDownEvent: MouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 2, buttons: 2 });
            const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 2, buttons: 2 });
            setCursorPoint(firstP, 0);
            firstP.dispatchEvent(mouseDownEvent);
            firstP.dispatchEvent(mouseUpEvent);
            setTimeout(() => {
                const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                setCursorPoint(td, 0);
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                td.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    const insertIcon = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert');
                    expect(insertIcon).not.toBeNull();
                    // Simulate mouseover on insertion icon
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    insertIcon.dispatchEvent(mouseOverEvent);
                    // Check circle icon styling
                    setTimeout(() => {
                        const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                        circleIcon.click();
                        const MOUSEUP_EVENT: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                        circleIcon.dispatchEvent(MOUSEUP_EVENT);
                        setTimeout(() => {
                            let quickPop: HTMLElement = document.querySelector('.e-rte-quick-toolbar');
                            expect(!isNullOrUndefined(quickPop)).toBe(true);
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('1012432: Undo doesnt restore table cell content after selecting entire table and pressing Backspace', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="e-cell-select" style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('when the selection icon is clicked back space is pressed and undo is clicked', (done: Function) => {
            const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
            // Simulate mouseover on insertion icon
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-move') as HTMLElement;
                dispatchEvent(circleIcon, 'mousedown');
                circleIcon.click();
                dispatchEvent(circleIcon, 'mouseup');
                setTimeout(() => {
                    const backSpaceKeyDown: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
                    const backSpaceKeyUp: KeyboardEvent = new KeyboardEvent('keyup', BACKSPACE_EVENT_INIT);
                    rteObj.inputElement.dispatchEvent(backSpaceKeyDown);
                    rteObj.inputElement.dispatchEvent(backSpaceKeyUp);
                    setTimeout(() => {
                        const toolbarItems = rteObj.element.querySelectorAll(".e-toolbar-item");
                        (toolbarItems[1] as HTMLElement).click();
                        expect(rteObj.inputElement.querySelector('td').textContent === 'Cell 1').toBe(true);
                        done();
                    }, 300);
                }, 100);
            }, 100);
        });
    });

    describe('1013870: Script error when selecting entire table column/row after inserting table', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let consoleSpy: jasmine.Spy;
        beforeEach(() => {
            consoleSpy = jasmine.createSpy('console');
            rteObj = renderRTE({
                toolbarSettings: { items: ['CreateTable'] },
                value: ''
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it('should not call console.error when selecting first column after inserting table', (done: DoneFn) => {
            rteObj.focusIn();
            (rteEle.querySelector('.e-toolbar-item button') as HTMLElement).click();
            setTimeout(() => {
                const insertTableBtn = document.querySelector('.e-insert-table-btn') as HTMLElement;
                insertTableBtn.click();
                setTimeout(() => {
                    const confirmBtn = document.querySelector('.e-insert-table') as HTMLElement;
                    confirmBtn.click();
                    setTimeout(() => {
                        const tables = rteObj.contentModule.getEditPanel().querySelectorAll('table');
                        expect(tables.length).toBe(1);
                        // select first column via column-select icon and ensure no console error
                        const firstTd = rteObj.contentModule.getEditPanel().querySelector('table td') as HTMLElement;
                        expect(firstTd).not.toBeNull();
                        setCursorPoint(firstTd, 0);
                        rteObj.inputElement.dispatchEvent(new MouseEvent('mousedown', BASIC_MOUSE_EVENT_INIT));
                        firstTd.dispatchEvent(new MouseEvent('mouseover', { view: window, bubbles: true, cancelable: true }));
                        setTimeout(() => {
                            const colInsert = rteObj.contentModule.getEditPanel().querySelector('.e-tb-col-insert') as HTMLElement;
                            colInsert.dispatchEvent(new MouseEvent('mouseover', { view: window, bubbles: true, cancelable: true }));
                            setTimeout(() => {
                                const circleIcons = rteObj.contentModule.getEditPanel().querySelectorAll('.e-drag-and-drop');
                                const colSelectIcon = circleIcons[1] as HTMLElement || circleIcons[0] as HTMLElement;
                                colSelectIcon.click();
                                const mouseUpEvent: MouseEvent = new MouseEvent('mouseup', BASIC_MOUSE_EVENT_INIT);
                                colSelectIcon.dispatchEvent(mouseUpEvent);
                                setTimeout(() => {
                                    expect(consoleSpy).not.toHaveBeenCalled();
                                    const rows = rteObj.contentModule.getEditPanel().querySelectorAll('tr');
                                    const firstColSelected = Array.from(rows).every(r => {
                                        const first = r.querySelector('td, th') as HTMLElement;
                                        return first && first.classList.contains('e-cell-select');
                                    });
                                    expect(firstColSelected).toBe(true);
                                    const lastRow = rows[rows.length - 1] as HTMLElement;
                                    const lastCell = lastRow.querySelector('td') as HTMLElement;
                                    const sel = window.getSelection();
                                    expect(sel.rangeCount).toBeGreaterThan(0);
                                    const startNode = sel.getRangeAt(0).startContainer;
                                    expect(lastCell.contains(startNode) || lastCell === startNode).toBe(true);
                                    done();
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('Bug 1014441: Table add icon is getting removed while hovering table selection icon', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Row wrapper icon selection for entire row selection', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
            setCursorPoint(td, 0);
            // Simulate mouseover on insertion icon
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const rowIcon = rteObj.contentModule.getEditPanel().querySelector('.e-drag-and-drop') as HTMLElement;
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                rowIcon.dispatchEvent(mouseOverEvent);
                // Check circle icon styling
                setTimeout(() => {
                    const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle') as HTMLElement;
                    expect(circleIcon).not.toBeNull;
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    circleIcon.dispatchEvent(mouseOverEvent);
                    setTimeout(() => {
                        const circleAddIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle-add') as HTMLElement;
                        expect(circleAddIcon).not.toBeNull;
                        const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                        rowIcon.dispatchEvent(mouseOverEvent);
                        setTimeout(() => {
                            const circleAddIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle-add') as HTMLElement;
                            expect(circleAddIcon).toBeNull;
                            const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle') as HTMLElement;
                            expect(circleIcon).not.toBeNull;
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });
    describe('Bug 1014441: Table add icon is getting removed while hovering table selection icon', () => {
        let rteObj: RichTextEditor;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable', 'Undo', 'Redo']
                },
                value: '<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;">Cell 1</td><td style="width: 50%;">Cell 2</td></tr><tr><td style="width: 50%;">Cell 3</td><td style="width: 50%;">Cell 4</td></tr></tbody></table><p><br></p>'
            });
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Row wrapper icon selection for entire row selection', (done: Function) => {
            rteObj.focusIn();
            const td = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
            setCursorPoint(td, 0);
            // Simulate mouseover on insertion icon
            const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
            td.dispatchEvent(mouseOverEvent);
            setTimeout(() => {
                const colIcon = rteObj.contentModule.getEditPanel().querySelectorAll('.e-drag-and-drop')[1] as HTMLElement;
                // Simulate mouseover on insertion icon
                const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                colIcon.dispatchEvent(mouseOverEvent);
                // Check circle icon styling
                setTimeout(() => {
                    const circleIcon = rteObj.contentModule.getEditPanel().querySelectorAll('.e-circle')[1] as HTMLElement;
                    expect(circleIcon).not.toBeNull;
                    const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                    circleIcon.dispatchEvent(mouseOverEvent);
                    setTimeout(() => {
                        const circleAddIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle-add') as HTMLElement;
                        expect(circleAddIcon).not.toBeNull;
                        const mouseOverEvent = new MouseEvent('mouseover', { 'view': window, 'bubbles': true, 'cancelable': true });
                        colIcon.dispatchEvent(mouseOverEvent);
                        setTimeout(() => {
                            const circleAddIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle-add') as HTMLElement;
                            expect(circleAddIcon).toBeNull;
                            const circleIcon = rteObj.contentModule.getEditPanel().querySelector('.e-circle') as HTMLElement;
                            expect(circleIcon).not.toBeNull;
                            done();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        });
    });
});
