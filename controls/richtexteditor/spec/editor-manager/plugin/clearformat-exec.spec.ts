/**
 * Indents plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { NodeSelection } from '../../../src/selection/selection';

describe('Clear Format Exec plugin', () => {

    describe('apply Clear testing', () => {
        let editorObj: EditorManager;
        let domSelection: NodeSelection = new NodeSelection();
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <div id="paragraph1">  
        <p id="paragraph2" class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label id="label1">First label Node</label>
           </p> paragraph 2 </div>
           <p id='last-p-node'>
             <label id="label2">Last Label Node</label>
             P element
           </p>
           <label id="label3">Last Label Node</label>
           <ol>
        <li><p id="paragraph4">Provide <b>the tool bar support, it’s also customizable.</b></p></li>
        <li><p id="paragraph5"><b>Options to get</b> the HTML elements with styles.</p></li>
        <li><p id="paragraph6">Support to insert image from <p></p>a defined path.</p></li>
        <li><p id="paragraph7">Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li>
        <li><p id="paragraph8">Re-size the editor support.</p></li>
        <li><p id="paragraph9">Provide efficient public methods and client side events.</p></li>
        <li><p id="paragraph10">Keyboard navigation support.<img width="250" height="250"></p></li>
        </ol>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
        });

        it('paragraph clear format', () => {
            let node: HTMLElement = document.getElementById('paragraph2');
            editorObj.nodeSelection.setSelectionText(document, node, node, 0, 2);
            let callback: boolean = false;
            editorObj.execCommand("Clear", 'ClearFormat', null, ():boolean => { callback = true; return true;} );
            expect(document.getElementById('paragraph1').querySelectorAll('a').length).toBe(0);
            expect(callback).toBe(true);
        });
        it('label clear format', () => {
            let node: HTMLElement = document.getElementById('label2');
            editorObj.nodeSelection.setSelectionText(document, node, node, 0, 1);
            editorObj.execCommand("Clear", 'ClearFormat', null, null );
            expect(document.getElementById('last-p-node').childNodes[0].nodeName.toLowerCase()).toBe('#text');
        });
        it('Cursor clear format', () => {
            let node: HTMLElement = document.getElementById('label3');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0],  node.childNodes[0], 2, 2);
            editorObj.execCommand("Clear", 'ClearFormat', null, null );
            expect(document.getElementById('label3').childNodes[0].nodeName.toLowerCase()).toBe('#text');
        });
        it('No Command clear format', () => {
            let callback: boolean = false;
            editorObj.execCommand("Clear", 'ClearFormat1', null, ():boolean => { callback = true; return true;} );
            expect(callback).toBe(false);
        });
        it('Clear bold element', () => {
            let node1: Node = document.getElementById('paragraph4').childNodes[0];
            let node2: Node = document.getElementById('paragraph5').childNodes[1];
            domSelection.setSelectionText(document, node1, node2, 2, 2);
            editorObj.execCommand("Clear", 'ClearFormat', null, null );
            expect(document.getElementById('paragraph4').querySelectorAll('b').length).toEqual(0);
        });
        afterAll(() => {
            detach(elem);
        });
    });

});