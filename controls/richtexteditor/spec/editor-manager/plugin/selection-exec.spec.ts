/**
 * Indents plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';

describe('Selection Exec plugin', () => {

    describe('apply bold testing', () => {
        let editorObj: EditorManager;
        let keyBoardEvent: any;
        let callback: boolean = false;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
          <p class='first-p-node'>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <label id="label1">First label Node</label>
           <label id="label3">Third label Node</label>
           <label id="label4">Fourth label Node</label>
           <label id="label5">Fifth label Node</label>
           <label id="label6">Six label Node</label>
           <label id="label7">Seven label Node</label>
           <label id="label8">Eight label Node</label>
           <label id="label9">Nine label Node</label>
           <label id="label10">Ten label Node</label>
           <label id="label11">Eleven label Node</label>
           </p>
           <p class='last-p-node'>
             <label id="label2">Last Label Node</label>
           </p>
         </div>
         ` });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            keyBoardEvent = {
                            'callBack': (): boolean => { callback = true; return true;},
                            'event': { preventDefault: (): void => { },
                            'stopPropagation': ():void => { },
                            'shiftKey': false,
                            'ctrlKey': true,
                            'keyCode': -1 } };
        });

        it('Boldformat', () => {
            let node: HTMLElement = document.getElementById('label1');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            editorObj.execCommand("Font", 'Bold', null, ():boolean => { return true;} );
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('strong');
        });
        it('Italic format', () => {
            let node: HTMLElement = document.getElementById('label2');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            editorObj.execCommand("Font", 'Italic', null );
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('em');
        });
        it('keyboard navigation for bold', () => {
            let node: HTMLElement = document.getElementById('label3');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 66;
            keyBoardEvent.event.action = 'bold';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('strong');
        });
        it('keyboard navigation for Italic', () => {
            let node: HTMLElement = document.getElementById('label4');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 73;
            keyBoardEvent.event.action = 'italic';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('em');
        });
        it('keyboard navigation for lowercase', () => {
            let node: HTMLElement = document.getElementById('label5');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 76;
            keyBoardEvent.event.shiftKey = true;
            keyBoardEvent.event.action = 'lowercase';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].textContent).toBe('fifth');
        });
        it('keyboard navigation for strikethrough', () => {
            let node: HTMLElement = document.getElementById('label6');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 83;
            keyBoardEvent.event.shiftKey = true;
            keyBoardEvent.event.action = 'strikethrough';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('span');
        });
        it('keyboard navigation for underline', () => {
            let node: HTMLElement = document.getElementById('label7');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 85;
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.event.action = 'underline';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('span');
        });
        it('keyboard navigation for uppercase', () => {
            let node: HTMLElement = document.getElementById('label8');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 85;
            keyBoardEvent.event.shiftKey = true;
            keyBoardEvent.event.action = 'uppercase';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].textContent).toBe('EIGHT');
        });
        it('keyboard navigation for superscript', () => {
            let node: HTMLElement = document.getElementById('label9');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            keyBoardEvent.event.keyCode = 187;
            keyBoardEvent.event.shiftKey = true;
            keyBoardEvent.event.action = 'superscript';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('sup');
        });
        it('keyboard navigation for subscript', () => {
            let node: HTMLElement = document.getElementById('label10');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            callback = false;
            keyBoardEvent.event.keyCode = 187;
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.callBack = null;
            keyBoardEvent.event.action = 'subscript';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('sub');
            expect(callback).toBe(false);
        });
        it('keyboard navigation for unknown tag', () => {
            let node: HTMLElement = document.getElementById('label11');
            editorObj.nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 5);
            callback = false;
            keyBoardEvent.event.keyCode = 188;
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.event.action = 'subscript1234';
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(node.childNodes[0].nodeName.toLowerCase()).toBe('#text');
            expect(callback).toBe(false);
        });
        afterAll(() => {
            detach(elem);
        });
    });

});