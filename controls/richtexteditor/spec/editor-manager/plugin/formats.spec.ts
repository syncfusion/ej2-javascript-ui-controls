/**
 * Formats plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { NodeSelection, } from '../../../src/selection/index';


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
            expect(changeNode.tagName.toLowerCase() === 'blockquote').toBe(true);

            // Should be apply the format from 'blockquote' to h1
            start = elem.querySelector('blockquote');
            end = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Formats", 'h1', null);
            changeNode = elem.querySelector('.first-p-node');
            expect(changeNode.tagName.toLowerCase() === 'h1').toBe(true);

            // should be apply the format from 'h1' and 'h2' to 'blockquote'.
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            editorObj.nodeSelection.setSelectionText(document, start, end, 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null);
            start = elem.querySelector('.h1-tag-node');
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'blockquote').toBe(true);
            expect(end.tagName.toLowerCase() === 'blockquote').toBe(true);

            
            // should be apply the blockquote format to parent node of 'OL''.
            start = elem.querySelector('.li-first');
            end = elem.querySelector('.li-second');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 0);
            editorObj.execCommand("Formats", 'blockquote', null);
            start = elem.querySelector('.ol-first');        
            expect((start as Element).tagName.toLowerCase() === 'blockquote').toBe(true);

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
            expect(elem.querySelectorAll('br').length === 0).toBe(true);
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
});