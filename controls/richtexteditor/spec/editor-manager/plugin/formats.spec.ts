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
            end = elem.querySelector('.h2-tag-node');
            expect(start.tagName.toLowerCase() === 'pre').toBe(true);
            expect(end.tagName.toLowerCase() === 'pre').toBe(true);

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

});