/**
 * Alignments plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/base';
import { ImageCommand } from '../../../src/editor-manager/plugin/image';
import { setCursorPoint, renderRTE, destroy } from '../../rich-text-editor/render.spec';
import { RichTextEditor } from '../../../src';

describe('Alignments plugin', () => {

    describe(' apply alignments testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
          <p class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label>First label Node</label>
           </p>
           <p class='last-p-node'>
             <label>Last Label Node</label>
           </p>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' JustifyLeft format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyLeft', null);
            expect(start.style.textAlign === 'left').toBe(true);
            start.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyLeft', null);
            expect(start.style.textAlign === 'left').toBe(true);
            expect(end.style.textAlign === 'left').toBe(true);
            start.style.textAlign = '';
            end.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);
        });

        it(' JustifyRight format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(start.style.textAlign === 'right').toBe(true);
            start.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(start.style.textAlign === 'right').toBe(true);
            expect(end.style.textAlign === 'right').toBe(true);
            start.style.textAlign = '';
            end.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);
        });

        it(' JustifyCenter format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            expect(start.style.textAlign === 'center').toBe(true);
            start.style.textAlign = '';
            end.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            expect(start.style.textAlign === 'center').toBe(true);
            expect(end.style.textAlign === 'center').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        it(' JustifyFull format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyFull', null);
            expect(start.style.textAlign === 'justify').toBe(true);
            start.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyFull', null);
            expect(start.style.textAlign === 'justify').toBe(true);
            expect(end.style.textAlign === 'justify').toBe(true);
            start.style.textAlign = '';
            end.style.textAlign = '';
            editorObj.nodeSelection.Clear(document);
        });

        afterAll(() => {
            detach(elem);
        });
    });
    describe('align test-img and text in same line', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <p><b>Description:</b></p>
        <p><b>Functional
        Specifications/Requirements:</b></p>
        <ol><li><p>Keyboard
        navigation support.<img src="C:\\Users\\gunasekar.kuppusamy\\Downloads\\download.jpg" alt="Image"> </p></li></ol>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editorObj.imgObj = new ImageCommand(editorObj);
        });

        it(' Align', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelectorAll('p')[2];
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-img-right')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-img-right')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            expect(end.lastElementChild.classList.contains('e-img-center')).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });
    describe('align test-img and text in diff line', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <p><b>Description:</b></p>
        <p><b>Functional
        Specifications/Requirements:</b></p>
        <ol><li><p>Keyboard
        navigation support.</p></li></ol>
        <img src="C:\\Users\\gunasekar.kuppusamy\\Downloads\\download.jpg" alt="Image">
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editorObj.imgObj = new ImageCommand(editorObj);
        });
        it('Align', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = document.getElementById('content-edit');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-img-right')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-img-right')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            expect(end.lastElementChild.classList.contains('e-img-center')).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('876815 - Alignment not Maintenance properly', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p class="startFocus">The Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit content and return the valid <a href='https://ej2.syncfusion.com/home/' target='_blank'>HTML markup</a> or <a href='https://ej2.syncfusion.com/home/' target='_blank'>markdown</a> of the content</p>
            <p><b>Toolbar</b></p>
            <ol>
                <li>
                    <p>The Toolbar contains commands to align the text, insert a link, insert an image, insert list, undo/redo operations, HTML view, etc </p>
                </li>
                <li>
                    <p>The Toolbar is fully customizable </p>
                </li>
            </ol>
            <p><b>Links</b></p>
            <ol>
                <li>
                    <p>You can insert a hyperlink with its corresponding dialog </p>
                </li>
                <li>
                    <p>Attach a hyperlink to the displayed text. </p>
                </li>
                <li>
                    <p>Customize the quick toolbar based on the hyperlink </p>
                </li>
            </ol>
            <p><b>Image.</b></p>
            <ol>
                <li>
                    <p>Allows you to insert images from an online source as well as the local computer </p>
                </li>
                <li>
                    <p>You can upload an image </p>
                </li>
                <li class="endFocus">
                    <p>Provides an option to customize the quick toolbar for an image </p>
                </li>
            </ol></div>`
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        it('Checking the alignments', () => {
            startNode = editNode.querySelector('.startFocus');
            endNode = editNode.querySelector('.endFocus');
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 0);
            editorObj.execCommand("Lists", 'OL', null);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            editorObj.execCommand("Lists", 'OL', null);
            expect(startNode.tagName === 'P').toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('873565 - Alignment not working when enter key is configured as BR', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true">Content 1&nbsp;<strong>line</strong><br><strong class="startFocus">Content 2 line</strong><br><strong class="endFocus">Content 3&nbsp;</strong>line<br>Content 4&nbsp;<strong>line</strong></div>`
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        it('Checking the alignments', () => {
            startNode = editNode.querySelector('.startFocus');
            endNode = editNode.querySelector('.endFocus').nextSibling as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode, 3, 3);
            editorObj.execCommand("Alignments", 'JustifyRight', null, null, null, null, null, 'BR');
            expect(editNode.innerHTML === `Content 1&nbsp;<strong>line</strong><br><div style="text-align: right;"><strong class="startFocus">Content 2 line</strong></div><div style="text-align: right;"><strong class="endFocus">Content 3&nbsp;</strong>line</div>Content 4&nbsp;<strong>line</strong>`).toBe(true);
        });

        it('Checking the alignments with bold in the content ', () => {
            editNode.innerHTML = `Content 1 line<br>Content 2&nbsp;<strong class="startFocus">line&nbsp;</strong>extended<br>Content 3 line<br class="endFocus">Content 4 line`;
            startNode = editNode.querySelector('.startFocus').nextSibling as HTMLElement;
            endNode = editNode.querySelector('.endFocus').nextSibling as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 3, 3);
            editorObj.execCommand("Alignments", 'JustifyRight', null, null, null, null, null, 'BR');
            expect(editNode.innerHTML === `Content 1 line<br><div style="text-align: right;">Content 2&nbsp;<strong class="startFocus">line&nbsp;</strong>extended</div><div style="text-align: right;">Content 3 line</div><div style="text-align: right;">Content 4 line</div>`).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('1020864: Alignments - dropdown active state after applying align left', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'Alignments']
                },
                value: `<p style="text-align: center;"><span style="color: rgb(95, 99, 104); font-family: \"Google Sans\", Roboto, RobotoDraft, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-weight: 400; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgba(241, 243, 244, 0.87); float: none; display: inline !important;">Messages that have been in Spam more than 30 days will be automatically deleted.</span></p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('should apply align left and show correct active state in align dropdown', (done: DoneFn) => {
            const paragraph: HTMLElement = rteObj.element.querySelector('p') as HTMLElement;
            setCursorPoint(paragraph.childNodes[0].childNodes[0], 5)
            const alignBtn: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
            alignBtn.click();
            setTimeout(() => {
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                const leftItem: HTMLElement = popup.querySelectorAll('.e-item')[0] as HTMLElement;
                leftItem.click();
                setTimeout(() => {
                    alignBtn.click();
                    setTimeout(() => {
                        popup = document.getElementById(controlId + '_toolbar_Alignments-popup');
                        expect(popup.querySelectorAll('.e-item')[0].classList.contains('e-active')).toBe(true);
                        done();
                    }, 100);
                }, 100);
            }, 100);
        });
    });
});