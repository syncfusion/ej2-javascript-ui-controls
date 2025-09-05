/**
 * Formats plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { destroy, renderRTE, setCursorPoint } from '../../rich-text-editor/render.spec';

describe('Formats plugin', () => {
    let innerHTML: string = `
    <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
      <p class='first-p-node'>dom node
       <a href="https://www.google.com" tabindex="1">Google</a>
       <label>First label Node</label>
       </p>
       <p class='last-p-node'>
         <label>Last Label Node</label>
       </p>
       <h1 class="h1-tag-node" style="display:block;font-weight:500;margin-bottom:4px;font-size:17px;margin-left:4px;margin-left:4px;margin-right:4px;">Header 1</h1>
       <h2 class="h2-tag-node" style="display:block;font-weight:500;margin-bottom:4px;font-size:17px;margin-left:4px;margin-left:4px;margin-right:4px;">Header 2</h2>

       <ol class='ol-first'><li class="li-first">LI first</li><li class="li-second">LI Second</li></ol>
     </div>
     `;

    describe(' Paragraph Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply p formats ', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;

            // Should not affect the format while apply to same format node
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'p', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName === 'P').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'p'.
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'p', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName === 'P').toBe(true);
            expect(end.tagName === 'P').toBe(true);

            // should not remove the inline style while format to 'p'
            expect(start.style.display !== '').toBe(true);
            expect(start.style.marginBottom !== '').toBe(true);
            expect(start.style.marginLeft !== '').toBe(true);
            expect(start.style.marginRight !== '').toBe(true);
            expect(start.style.fontSize !== '').toBe(true);
            expect(start.style.fontWeight !== '').toBe(true);
            expect(end.style.display !== '').toBe(true);
            expect(end.style.marginBottom !== '').toBe(true);
            expect(end.style.marginLeft !== '').toBe(true);
            expect(end.style.marginRight !== '').toBe(true);
            expect(end.style.fontSize !== '').toBe(true);
            expect(end.style.fontWeight !== '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' BlockQuote Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply blockquote format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;

            // Should be apply the format from 'p' to blockquote
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'p').toBe(true);
            expect(changeNode.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);

            // Should be apply the format from 'blockquote' to h1
            start = elem.querySelector('blockquote');
            end = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h1', null);
            changeNode = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h1').toBe(true);
            expect(changeNode.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'blockquote'.
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);
            expect(end.parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);
            expect(start.tagName.toLowerCase() === 'h1').toBe(true);
            expect(end.tagName.toLowerCase() === 'h2').toBe(true);

            
            // should be apply the blockquote format to parent node of 'OL''.
            start = elem.querySelector('.li-first');
            end = elem.querySelector('.li-second');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null);
            start = elem.querySelector('.ol-first');
            expect((start as Element).parentElement.tagName.toLowerCase() === 'blockquote').toBe(true);
            expect((start as Element).tagName.toLowerCase() === 'ol').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply pre format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
              // Should be apply the format from 'p' to pre
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'pre', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'pre').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'pre'.
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'pre', null);
            start = elem.querySelector('.h1-tag-node');
            expect(start.tagName.toLowerCase() === 'pre').toBe(true);
            expect(start.innerHTML === 'Header 1<br>Header 2').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 1 Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply h1 format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            // Should be apply the format from 'p' to 'h1'
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h1', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h1').toBe(true);

           // should be apply the format from 'h2' to 'h1' and ignore the same format tag.
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'h1', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'h1').toBe(true);
            expect(end.tagName.toLowerCase() === 'h1').toBe(true);

            // should be remove the inline default styles of h1 tag.
            expect(end.style.display === '').toBe(true);
            expect(end.style.marginBottom === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);
            expect(end.style.marginRight === '').toBe(true);
            expect(end.style.fontSize === '').toBe(true);
            expect(end.style.fontWeight === '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 2 Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply h2 format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            // Should be apply the format from 'p' to 'h2'
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h2', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h2').toBe(true);

            // should be apply the format from 'h1' to 'h2' and ignore the same format tag.
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'h2', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'h2').toBe(true);
            expect(end.tagName.toLowerCase() === 'h2').toBe(true);

            // should be remove the inline default styles of h2 tag.
            expect(start.style.display === '').toBe(true);
            expect(start.style.marginBottom === '').toBe(true);
            expect(start.style.marginLeft === '').toBe(true);
            expect(start.style.marginRight === '').toBe(true);
            expect(start.style.fontSize === '').toBe(true);
            expect(start.style.fontWeight === '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 3 Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply h3 format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            // Should be apply the format from 'p' to 'h3'
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h3', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h3').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'h3'
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'h3', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'h3').toBe(true);
            expect(end.tagName.toLowerCase() === 'h3').toBe(true);

            // should be remove the inline default styles of h3 tag.
            expect(start.style.display === '').toBe(true);
            expect(start.style.marginBottom === '').toBe(true);
            expect(start.style.marginLeft === '').toBe(true);
            expect(start.style.marginRight === '').toBe(true);
            expect(start.style.fontSize === '').toBe(true);
            expect(start.style.fontWeight === '').toBe(true);
            expect(end.style.display === '').toBe(true);
            expect(end.style.marginBottom === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);
            expect(end.style.marginRight === '').toBe(true);
            expect(end.style.fontSize === '').toBe(true);
            expect(end.style.fontWeight === '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });

        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 4 Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply h4 format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
             // Should be apply the format from 'p' to 'h4'
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h4', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h4').toBe(true);

             // should be apply the format from 'h1' and 'h2' to 'h4'
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'h4', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'h4').toBe(true);
            expect(end.tagName.toLowerCase() === 'h4').toBe(true);

            // should be remove the inline default styles of h4 tag.
            expect(start.style.display === '').toBe(true);
            expect(start.style.marginBottom === '').toBe(true);
            expect(start.style.marginLeft === '').toBe(true);
            expect(start.style.marginRight === '').toBe(true);
            expect(start.style.fontSize === '').toBe(true);
            expect(start.style.fontWeight === '').toBe(true);
            expect(end.style.display === '').toBe(true);
            expect(end.style.marginBottom === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);
            expect(end.style.marginRight === '').toBe(true);
            expect(end.style.fontSize === '').toBe(true);
            expect(end.style.fontWeight === '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 5 Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply h5 format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
             // Should be apply the format from 'p' to 'h5'
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h5', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h5').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'h5'
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'h5', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'h5').toBe(true);
            expect(end.tagName.toLowerCase() === 'h5').toBe(true);

            // should be remove the inline default styles of h5 tag.
            expect(start.style.display === '').toBe(true);
            expect(start.style.marginBottom === '').toBe(true);
            expect(start.style.marginLeft === '').toBe(true);
            expect(start.style.marginRight === '').toBe(true);
            expect(start.style.fontSize === '').toBe(true);
            expect(start.style.fontWeight === '').toBe(true);
            expect(end.style.display === '').toBe(true);
            expect(end.style.marginBottom === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);
            expect(end.style.marginRight === '').toBe(true);
            expect(end.style.fontSize === '').toBe(true);
            expect(end.style.fontWeight === '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 6 Formats testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: innerHTML
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' apply h6 format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            // Should be apply the format from 'p' to 'h6'
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h6', null);
            let changeNode: HTMLElement = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h6').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'h6'
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'h6', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'h6').toBe(true);
            expect(end.tagName.toLowerCase() === 'h6').toBe(true);

            // should be remove the inline default styles of h6 tag.
            expect(start.style.display === '').toBe(true);
            expect(start.style.marginBottom === '').toBe(true);
            expect(start.style.marginLeft === '').toBe(true);
            expect(start.style.marginRight === '').toBe(true);
            expect(start.style.fontSize === '').toBe(true);
            expect(start.style.fontWeight === '').toBe(true);
            expect(end.style.display === '').toBe(true);
            expect(end.style.marginBottom === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);
            expect(end.style.marginRight === '').toBe(true);
            expect(end.style.fontSize === '').toBe(true);
            expect(end.style.fontWeight === '').toBe(true);

            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Header 6 Formats testing', () => {
        let editorObj: EditorManager;
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p id='p1'>Paragraph 1</p><p id='p2'>Paragraph 2</p><p id='p3'>Paragraph 3</p><table><tbody><tr><td>cell 1 1</td><td>cell 1 2</td></tr><tr><td>cell 2 1</td><td id="lastCell">Cell 2 2</td></tr></tbody></table></div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('select all with last element as table', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            let end: HTMLElement = elem.querySelector('#lastCell');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], editorObj.editableElement, 0, 4);
            editorObj.execCommand("Formats", 'h6', null);
            expect(window.getSelection().focusNode.textContent === 'Cell 2 2').toBe(true);
            expect(window.getSelection().focusOffset === 8).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre Formats testing', () => {
        let editorObj: EditorManager;
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><ol><li class="l1">list1</li><li>list2</li><li class="l3">list3</li></ol></div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Apply pre to List with out P tag in list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('.l1');
            let end: HTMLElement = elem.querySelector('.l3');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 2);
            editorObj.execCommand("Formats", 'pre', null);
            expect(elem.querySelector('pre.l1').textContent === 'list1').toBe(true);
            expect(elem.querySelector('pre.l3').textContent === 'list3').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre format testing', () => {
        let editorObj: EditorManager;
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p id='p1'>Paragraph 1</p><p id='p2'>Paragraph 2</p><p id='p3'>Paragraph 3</p><table><tbody><tr><td>cell 1 1</td><td>cell 1 2</td></tr><tr><td>cell 2 1</td><td id="lastCell">Cell 2 2</td></tr></tbody></table></div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('select all with last element as table', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            let end: HTMLElement = elem.querySelector('#lastCell');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], editorObj.editableElement, 0, 4);
            editorObj.execCommand("Formats", 'pre', null);
            expect(elem.querySelector('#p1').innerHTML === 'Paragraph 1<br>Paragraph 2<br>Paragraph 3').toBe(true);
            expect(elem.querySelector('table').querySelectorAll('pre').length === 4).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre format Enter key testing', () => {
        let editorObj: EditorManager;
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <pre id='p1'>Paragraph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6</pre>
        </div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Enter key at the start of the pre text', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[0] as Element, 0);
            expect(start.innerHTML === 'Paragraph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(start.innerHTML === '<br>Paragraph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key at the middle of the pre text', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[1] as Element, 4);
            expect(start.innerHTML === '<br>Paragraph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br>Para<br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key at the middle of the pre text but at the end of the current line', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[1] as Element, 4);
            expect(start.innerHTML === '<br>Para<br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br>Para<br><br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key at the start of the pre textbefore br tag', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[2] as Element, 0);
            expect(start.innerHTML === '<br>Para<br><br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br><br>Para<br><br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key at the middle of the pre text inbetween br tag', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start as Element, 4);
            expect(start.innerHTML === '<br><br>Para<br><br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br><br>Para<br><br><br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key with selection at the middle of the pre tag', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[2], start.childNodes[6], 1, 3);
            expect(start.innerHTML === '<br><br>Para<br><br><br>graph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br><br>P<br>ph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key with selection as start to middle of the pre tag', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setSelectionText(document, start, start, 0, 10);
            expect(start.innerHTML === '<br><br>P<br>ph 1<br>Paragraph 2<br>Paragraph 3<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
        });
        it('Enter key with end of the pre tag', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[5] as Element, 11);
            expect(start.innerHTML === '<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6').toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === '<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6<br><br>').toBe(true);
        });
        it('Double enter key press at the end of the pre tag', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[7] as Element, 0);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let expectedElem: HTMLElement = elem.querySelector('#p1');
            expect(expectedElem.innerHTML === `<br>Paragraph 4<br>Paragraph 5<br>Paragraph 6<br>`).toBe(true);
            expect(expectedElem.nextElementSibling.tagName === 'P').toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre format Enter key testing - 2', () => {
        let editorObj: EditorManager;
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <p id="prePara">previous paragraph</p><pre id='p1'>Paragraph 1<br>Paragraph 2</pre><p id="nextPara">Paragraph</p>
        </div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Enter key at the start of the pre text', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#prePara');
            let end: HTMLElement =  elem.querySelector('#p1');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 4);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(elem.querySelector('#prePara').textContent === '').toBe(true);
            expect(elem.querySelector('#p1').innerHTML === 'graph 1<br>Paragraph 2').toBe(true);
        });
        it('Enter key at the start of the pre text', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            let end: HTMLElement =  elem.querySelector('#nextPara');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[2], end.childNodes[0], 4, 9);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(elem.querySelector('#nextPara').textContent === '').toBe(true);
            expect(elem.querySelector('#p1').innerHTML === 'graph 1<br>Para').toBe(true);
        });

        '<pre><span;">span 1</span><br><span>span 2</span><br><span>span 3</span><br><br><span id="selectSpan">﻿﻿</span><br><span>span 5</span></pre>'
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre format Enter key testing - 3', () => {
        let editorObj: EditorManager;
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <pre><span;">span 1</span><br><span>span 2</span><br><span>span 3</span><br><br><span id="selectSpan">revanth﻿﻿</span><br><span>span 5</span></pre>
        </div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Enter key at the middle of the pre text with style and span inside', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#selectSpan');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[0] as Element, 7);
            expect(elem.querySelectorAll('br').length === 5).toBe(true);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(elem.querySelectorAll('br').length === 6).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Pre format Enter key with list as parent testing - 3', () => {
        let editorObj: EditorManager;
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <ol><li><pre id='listPre'>para</pre></li></ol>
        </div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Enter key at the end of the list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#listPre');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[0] as Element, 4);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(elem.querySelectorAll('br').length === 1).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('Empty pre format with testing', () => {
        let editorObj: EditorManager;
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <pre id="selectPre">﻿﻿<br></pre>
        </div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('Enter key press when pre is empty', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#selectPre');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[0] as Element, 2);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(elem.querySelectorAll('br').length === 2).toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Apply heading format with content having commensts tag testing', () => {
        let editorObj: EditorManager;
        let tableContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p id="p1">The rich text editor is WYSIWYG ("what you see is what you get") editor useful to create and edit content, and return the valid <!-- /react-text --><a href="https://ej2.syncfusion.com/home/" target="_blank">HTML markup</a><!-- react-text: 30 --> or <!-- /react-text --><a href="https://ej2.syncfusion.com/home/" target="_blank">markdown</a><!-- react-text: 32 --> of the content<!-- /react-text --></p><!-- react-text: 33 --> <!-- /react-text --><p id="lastPara">Toolbar</p></div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: tableContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('select all with last element as table', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#p1');
            let end: HTMLElement = elem.querySelector('#lastPara');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'h1', null);
            expect(elem.querySelector('#p1').tagName === 'H1').toBe(true);
            expect(elem.querySelector('#lastPara').tagName === 'H1').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });
    describe("914424: The reverting operation does not work correctly after using block quotation combination of both normal and list areas", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Blockquote']
                },
                value: `<blockquote><h1>Do you know the key features of the editor?</h1><ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote>`
            });
            done();
        });
        it('Reverting the blockquotes for the list with blockquotes', (done: DoneFn) => {
            rteEle = rteObj.element;
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteEle.querySelector('li'), 0);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let expectContent = `<blockquote><h1>Do you know the key features of the editor?</h1></blockquote><ul><li>Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li>Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>, 😀 and more.</li><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li><li><b>Paste from MS Word</b> - helps to reduce the effort while converting the Microsoft Word content to HTML format with format and styles. To learn more, check out the documentation <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/paste-cleanup" title="Paste from MS Word Documentation" aria-label="Open in new window">here</a>.</li><li>Other features: placeholder text, character count, form validation, enter key configuration, resizable editor, IFrame rendering, tooltip, source code view, RTL mode, persistence, HTML Sanitizer, autosave, and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/api/rich-text-editor/" title="Rich Text Editor API" aria-label="Open in new window">more</a>.</li></ul><blockquote><p><em>Easily access Audio, Image, Link, Video, and Table operations through the quick toolbar by right-clicking on the corresponding element with your mouse.</em></p></blockquote>`
            expect(rteObj.contentModule.getEditPanel().innerHTML === expectContent).toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe("942807: Block Quote Format Fails to Revert for Selected Table Area", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Blockquote']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 13.5417%;"> <tr style="height: 13.5417%;"> <th style="width: 12.1813%" class="e-cell-select e-multi-cells-select"><blockquote><p><span>S No</span><br></p></blockquote></th>     <th style="width: 21.1048%" class="e-cell-select e-multi-cells-select"><blockquote><p>Mode of Transport</p></blockquote></th> </tr> </thead> <tbody> <tr style="height: 17.1875%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select"><blockquote><p>1</p></blockquote></td>     <td style="width: 21.1048%" class="e-cell-select e-multi-cells-select"><blockquote><p><span style="font-size: 14pt">🚴</span></p></blockquote></td> </tr> <tr style="height: 17.1875%;"> <td style="width: 12.1813%" class="e-cell-select e-multi-cells-select"><blockquote><p>2</p></blockquote></td>     <td style="width: 21.1048%" class="e-cell-select e-multi-cells-select e-cell-select-end"><blockquote><p><span style="font-size: 14pt"></span></p><p class=focusNode>🚗</p><p><br></p></blockquote></td> </tr>   </tbody></table>`
            });
            done();
        });
        it('Reverting the blockquotes for the table', (done: DoneFn) => {
            rteEle = rteObj.element;
            let start: Node = rteEle.querySelector('.focusNode').childNodes[0];
            let end: Node = rteEle.querySelector('.focusNode').childNodes[0];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start, end, 2, 2);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.element.querySelectorAll('blockquote').length === 0).toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });

    describe(' 943711: Block Quote format when cursor at the start of the table', () => {
        let editorObj: EditorManager;
        let rteContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p><span style="font-size: 1em; text-align: inherit; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, sans-serif, -apple-system, BlinkMacSystemFont;">A table.</span><br></p><table class="e-rte-table" style="width: 100%; min-width: 0px; height: 151px"> <thead style="height: 16.5563%"> <tr style="height: 16.5563%"> <th style="width: 12.1813%"><span>S No</span><br></th> <th style="width: 23.2295%"><span>Name</span><br></th> <th style="width: 9.91501%"><span>Age</span><br></th> <th style="width: 15.5807%"><span>Gender</span><br></th> <th style="width: 17.9887%"><span>Occupation</span><br></th> <th style="width: 21.1048%">Mode of Transport</th> </tr> </thead> <tbody> <tr style="height: 16.5563%"> <td style="width: 12.1813%">1</td> <td style="width: 23.2295%">Selma Rose</td> <td style="width: 9.91501%">30</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%"><span>Engineer</span><br></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚴</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">2</td> <td style="width: 23.2295%"><span>Robert</span><br></td> <td style="width: 9.91501%">28</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%"><span>Graphic Designer</span></td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">3</td> <td style="width: 23.2295%"><span>William</span><br></td> <td style="width: 9.91501%">35</td> <td style="width: 15.5807%">Male</td> <td style="width: 17.9887%">Teacher</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚗</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">4</td> <td style="width: 23.2295%"><span>Laura Grace</span><br></td> <td style="width: 9.91501%">42</td> <td style="width: 15.5807%">Female</td> <td style="width: 17.9887%">Doctor</td> <td style="width: 21.1048%"><span style="font-size: 14pt">🚌</span></td> </tr> <tr style="height: 16.5563%"> <td style="width: 12.1813%">5</td><td style="width: 23.2295%"><span>Andrew James</span><br></td><td style="width: 9.91501%">45</td><td style="width: 15.5807%">Male</td><td style="width: 17.9887%">Lawyer</td><td style="width: 21.1048%"><span style="font-size: 14pt">🚕</span></td></tr></tbody></table><h2>Elevating Your Content with Image</h2><p></div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: rteContent
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' Applying & reverting and applying the blockquotes for the table when cursor at the start of the table', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, elem, elem, 1, 1);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('table').parentElement.nodeName.toLowerCase() === 'blockquote').toBe(true);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('table').parentElement.nodeName.toLowerCase() !== 'blockquote').toBe(true);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('table').parentElement.nodeName.toLowerCase() === 'blockquote').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' Apply blockquotes after improvement', () => {
        let editorObj: EditorManager;
        let rteContent: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p id="startNode">Content 1</p><p>Content 2</p><p>Content 3</p><p>Content 4</p><p id="endNode">Content 5</p></div>`;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: rteContent
        });
        let keyBoardEvent: any = { callBack: () => { }, event: { action: null, preventDefault: () => { }, shiftKey: false, which: 13 } };
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' - select all content and applying blockquote', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('#startNode').tagName === 'P').toBe(true);
            expect(elem.querySelector('#endNode').tagName === 'P').toBe(true);
            expect(elem.querySelector('#startNode').parentElement.tagName === 'BLOCKQUOTE').toBe(true);
            expect(elem.querySelector('#endNode').parentElement.tagName === 'BLOCKQUOTE').toBe(true);
            expect(elem.querySelectorAll('BLOCKQUOTE').length === 1).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - few lines(middle) of selection and then applying blockquotes to the content that already blockquotes', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<blockquote><p>Content 1</p><p id="startNode">Content 2</p><p id="endNode">Content 3</p><p>Content 4</p><p>Content 5</p></blockquote>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('#startNode').tagName === 'P').toBe(true);
            expect(elem.querySelector('#endNode').tagName === 'P').toBe(true);
            expect(elem.innerHTML === `<blockquote><p>Content 1</p></blockquote><p id="startNode">Content 2</p><p id="endNode">Content 3</p><blockquote><p>Content 4</p><p>Content 5</p></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for selection start as normal text and end has blockquotes content ', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<blockquote><p>Content 1</p></blockquote><p>Content 2</p><p id="startNode">Content 3</p><blockquote><p id="endNode">Content 4</p><p>Content 5</p></blockquote>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('#startNode').parentElement.tagName === 'BLOCKQUOTE').toBe(true);
            expect(elem.innerHTML === `<blockquote><p>Content 1</p></blockquote><p>Content 2</p><blockquote><p id="startNode">Content 3</p><p id="endNode">Content 4</p><p>Content 5</p></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for selection start as blockquote text and end has normal text ', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<blockquote><p id="startNode">Content 1</p></blockquote><p id="endNode">Content 2</p><p>Content 3</p><blockquote><p>Content 4</p><p>Content 5</p></blockquote>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.querySelector('#endNode').parentElement.tagName === 'BLOCKQUOTE').toBe(true);
            expect(elem.innerHTML === `<blockquote><p id="startNode">Content 1</p><p id="endNode">Content 2</p></blockquote><p>Content 3</p><blockquote><p>Content 4</p><p>Content 5</p></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for selection start as blockquote text and end has blockquote text with text content as middle', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<blockquote><p>Content 1</p><p id="startNode">Content 2</p></blockquote><p>Content 3</p><blockquote><p id="endNode">Content 4</p><p>Content 5</p></blockquote>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.innerHTML === `<blockquote><p>Content 1</p></blockquote><p id="startNode">Content 2</p><p>Content 3</p><p id="endNode">Content 4</p><blockquote><p>Content 5</p></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for selection start as normal text and end has normal text with blockquote content as middle', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<p>Content 1</p><p id="startNode">Content 2</p><blockquote><p>Content 3</p><p id="endNode">Content 4</p></blockquote><p>Content 5</p><p>Content 6</p>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 7);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.innerHTML === `<p>Content 1</p><blockquote><p id="startNode">Content 2</p><p>Content 3</p><p id="endNode">Content 4</p></blockquote><p>Content 5</p><p>Content 6</p>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for selection start as normal text and end has list text', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<p id="startNode">Content 1</p><p>Content 2</p><p>Content 3</p><ol><li>List 1</li><li>List 2</li><li id="endNode">List 3</li></ol>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            let end: HTMLElement = elem.querySelector('#endNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 3);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.innerHTML === `<blockquote><p id="startNode">Content 1</p><p>Content 2</p><p>Content 3</p><ol><li>List 1</li><li>List 2</li><li id="endNode">List 3</li></ol></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for selection start as normal text and end has normal text with enter action as BR', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `Content 1<br>Content 2<br>Content 3<br>Content 4<br>Content 5`;
            editorObj.nodeSelection.setSelectionText(document, elem.childNodes[0], elem.childNodes[8], 0, 3);
            editorObj.execCommand("Formats", 'blockquote', null, null, null, null, null, 'BR');
            expect(elem.innerHTML === `<blockquote>Content 1<br>Content 2<br>Content 3<br>Content 4<br>Content 5</blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes to the empty cotenteditable DIV with enter action as BR', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = ``;
            editorObj.nodeSelection.setSelectionText(document, elem, elem, 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null, null, null, null, null, 'BR');
            expect(elem.innerHTML === `<blockquote><br></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - applying blockquotes for by focusing the first table TD cell', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;" id="startNode"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            editorObj.nodeSelection.setSelectionText(document, start, start, 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.innerHTML === `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 50%;" id="startNode"><blockquote><p><br></p></blockquote></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - enter key press inside list when blockquote is applied to the list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<blockquote><ol><li>List 1</li><li>List 2</li><li>List 3</li><li id="startNode"><br></li></ol></blockquote>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            editorObj.nodeSelection.setCursorPoint(document, start.childNodes[0] as Element, 0);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(elem.innerHTML === `<blockquote><ol><li>List 1</li><li>List 2</li><li>List 3</li></ol><br></blockquote>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' - reverting the blockquotes for the list with blockquotes', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            elem.innerHTML = `<blockquote><ol><li id="startNode">List 1</li><li>List 2</li><li>List 3</li></ol></blockquote>`;
            let start: HTMLElement = elem.querySelector('#startNode');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], start.childNodes[0], 2, 2);
            editorObj.execCommand("Formats", 'blockquote', null);
            expect(elem.innerHTML === `<ol><li id="startNode">List 1</li><li>List 2</li><li>List 3</li></ol>`).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        afterAll(() => {
            detach(elem);
        });
    });

    describe("921851: Blockquote action not functioning for div", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Blockquote']
                },
                value: `<div><p>The Rich Text Editor component is a WYSIWYG ('what you see is what you get') editor that provides the best user experience to create and update the content. Users can format their content using standard toolbar commands.</p><p><b> Key features:</b></p></div>`
            });
            done();
        });
        it('Blockquote action not functioning for div', (done: DoneFn) => {
            rteEle = rteObj.element;
            rteObj.formatter.editorManager.nodeSelection.setCursorPoint(document, rteEle.querySelector('p'), 0);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            let expectContent = `<div><blockquote><p>The Rich Text Editor component is a WYSIWYG ('what you see is what you get') editor that provides the best user experience to create and update the content. Users can format their content using standard toolbar commands.</p></blockquote><p><b> Key features:</b></p></div>`
            expect(rteObj.contentModule.getEditPanel().innerHTML === expectContent).toBe(true);
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
    describe("959495 - Code and CodeBlock format retained when converting code block element to H1 using Format toolbar option", () => {
        let rteObj: RichTextEditor;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Blockquote']
                },
                value: `<p>Rich</p><pre data-language="Plain text" spellcheck="false"><code>Text<br></code></pre><p>Editor</p>`
            });
            done();
        });
        it('Should not retain the code and codeblock format when converting code block element to H1 using Format toolbar option', (done: DoneFn) => {
            const start: HTMLElement = rteObj.element.querySelectorAll('p')[0];
            const end: HTMLElement = rteObj.element.querySelectorAll('p')[1];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, end.firstChild, 1, 2);
            rteObj.executeCommand('formatBlock', 'H1');
            const codeElem = rteObj.element.querySelector('code');
            expect(codeElem).toBeNull();
            const format = rteObj.element.querySelector('*[data-language]');
            expect(format).toBeNull();
            done();
        });
        it('Should not retain the code and codeblock format when converting code block element to Preformatted using Format toolbar option', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Rich</p><pre data-language="Plain text" spellcheck="false"><code>Text<br></code></pre><p>Editor</p>`;
            const start: HTMLElement = rteObj.element.querySelectorAll('p')[0];
            const end: HTMLElement = rteObj.element.querySelectorAll('p')[1];
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, end.firstChild, 1, 2);
            rteObj.executeCommand('formatBlock', 'Preformatted');
            const codeElem = rteObj.element.querySelector('code');
            expect(codeElem).toBeNull();
            const format = rteObj.element.querySelector('*[data-language]');
            expect(format).toBeNull();
            done();
        });
        it('Should not add the codeBlock element inside the pre format when the selection is not in the code block element', (done: DoneFn) => {
            rteObj.inputElement.innerHTML = `<p>Rich</p><pre data-language="Plain text" spellcheck="false"><code class="language-plaintext">Text Editor<br></code></pre>`;
            const start: HTMLElement = rteObj.element.querySelectorAll('p')[0];
            setCursorPoint(start.firstChild, 2);
            rteObj.executeCommand('formatBlock', 'pre');
            const codeElem = rteObj.element.querySelector('pre:not([data-language])');
            expect(codeElem).not.toBeNull();
            const format = rteObj.element.querySelector('*[data-language]');
            expect(format).not.toBeNull();
            done();
        });
        afterAll((done) => {
            destroy(rteObj);
            done();
        });
    });
});