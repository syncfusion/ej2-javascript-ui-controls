/**
 * Indents plugin spec
 */
import { createElement, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { NodeSelection, } from '../../../src/selection/index';

describe('Indents plugin', () => {

    describe(' apply Indents testing', () => {
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

        it(' increase indents format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '40px').toBe(true);
            start.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            expect(end.style.marginLeft === '20px').toBe(true);

            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '40px').toBe(true);
            expect(end.style.marginLeft === '40px').toBe(true);
            start.style.marginLeft = '';
            end.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);
        });

        it(' Outdent format', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('p');
            let end: HTMLElement = elem.querySelector('label');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '40px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '0px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '').toBe(true);

            start.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);

            start = elem.querySelector('.first-p-node');
            end = elem.querySelector('.last-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end, 0, 0);
            editorObj.execCommand("Indents", 'Indent', null);
            expect(start.style.marginLeft === '20px').toBe(true);
            expect(end.style.marginLeft === '20px').toBe(true);

            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '0px').toBe(true);
            expect(end.style.marginLeft === '0px').toBe(true);


            editorObj.execCommand("Indents", 'Outdent', null);
            expect(start.style.marginLeft === '').toBe(true);
            expect(end.style.marginLeft === '').toBe(true);

            start.style.marginLeft = '';
            end.style.marginLeft = '';
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });


    describe(' apply Indents to List element testing', () => {
        let editorObj: EditorManager;

        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
            <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
            <ul class='ul-first-node'><li><p class='first-p-node'>one-node</p></li><li><p class='second-p-node'>two-node</p></li><li><p class='third-p-node'>third-node</p></li><li>fifth-node</li></ul><p class='fourth-p-node'>fourth node</p>
         </div>
            ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it(' increase indents format to list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('.second-p-node');
            let end: HTMLElement = elem.querySelector('.fourth-p-node');
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 3);
            editorObj.execCommand("Indents", 'Indent', null);
            let ulList: HTMLElement = elem.querySelector('ul');
            expect(!isNullOrUndefined(ulList.querySelector('ul'))).toBe(true);
            let lastNode: HTMLElement = elem.querySelector('.fourth-p-node');
            expect(lastNode.style.marginLeft === '20px').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it(' Outdent format to list', () => {
            let elem: HTMLElement = editorObj.editableElement as HTMLElement;
            let start: HTMLElement = elem.querySelector('.second-p-node');
            let end: HTMLElement = start;
            editorObj.nodeSelection.setSelectionText(document, start.childNodes[0], end.childNodes[0], 0, 0);
            start = elem.querySelector('.second-p-node');
            expect(!isNullOrUndefined(start.parentElement.querySelector('ul'))).toBe(false);
            editorObj.execCommand("Indents", 'Outdent', null);
            start = elem.querySelector('.second-p-node');
            expect(!isNullOrUndefined(start.parentElement.querySelector('ul'))).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

});