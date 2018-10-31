/**
 * Alignments plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { Alignments } from '../../../src/editor-manager/plugin';
import { EditorManager } from '../../../src/editor-manager/base';
import { NodeSelection, } from '../../../src/selection/index';

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

});