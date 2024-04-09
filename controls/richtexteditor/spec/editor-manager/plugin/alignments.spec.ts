/**
 * Alignments plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/base';

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
        });

        it(' Align', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelectorAll('p')[2];
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-imgright')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-imgright')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            expect(end.lastElementChild.classList.contains('e-imgcenter')).toBe(true);
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
        });
        it('Align', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = document.getElementById('content-edit');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-imgright')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyRight', null);
            expect(end.lastElementChild.classList.contains('e-imgright')).toBe(true);
            editorObj.execCommand("Alignments", 'JustifyCenter', null);
            expect(end.lastElementChild.classList.contains('e-imgcenter')).toBe(true);
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
});