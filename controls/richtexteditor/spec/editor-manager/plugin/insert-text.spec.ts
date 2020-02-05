/**
 * Insert Text spec document
 */
import { detach } from '@syncfusion/ej2-base';
import { NodeSelection } from '../../../src/selection/index';
import { EditorManager } from '../../../src/editor-manager/index';

describe('Insert text', () => {
    //HTML value
    let divElement: HTMLDivElement;
    let innervalue: string = `
        <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
        <p id="pnode1">Sample</p>
        <p id="pnode4">Sample</p>
        <p id="pnode2">Sample</p>
        <p id="pnode3">Sample</p>
         </div>
         `;

    let domSelection: NodeSelection = new NodeSelection();
    let editorObj: EditorManager;
    beforeEach(() => {
        //DIV Element
        divElement = document.createElement('div');
        divElement.innerHTML = innervalue;
        document.body.appendChild(divElement);
        editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
    });
    afterEach(() => {
        detach(divElement);
    });

    // insert text
    it('Insert text in  cursor position', () => {
        let node1: Node = document.getElementById('pnode1');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 3, 3);
        editorObj.execCommand("InsertText", null, null, null, "<p>RichTextEditor</p>");
        expect(node1.textContent === "Sam<p>RichTextEditor</p>ple").toBe(true);
    });

    it('Insert text in  specific selection', () => {
        let node1: Node = document.getElementById('pnode1');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 1, 3);
        editorObj.execCommand("InsertText", null, null, null, "<p>RichTextEditor</p>");
        expect(node1.textContent === "S<p>RichTextEditor</p>ple").toBe(true);
    });

    it('Insert text in  two node selection', () => {
        let node1: Node = document.getElementById('pnode1');
        let node2: Node = document.getElementById('pnode2');
        domSelection.setSelectionText(document, node1.childNodes[0], node2.childNodes[0], 1, 2);
        editorObj.execCommand("InsertText", null, null, null, "<p>RichTextEditor</p>");
        expect(node1.textContent === "S<p>RichTextEditor</p>").toBe(true);
    });

    it('Insert text in  callback method', () => {
        let node1: Node = document.getElementById('pnode1');
        let text1: Node = node1.childNodes[0];
        domSelection.setSelectionText(document, text1, text1, 1, 1);
        let requestType: string;
        editorObj.execCommand("InsertText", 'InsertText', null, (args: any) => {
            requestType = args.requestType;
        }, "<p>RichTextEditor</p>");
        expect(requestType === "InsertText").toBe(true);
    });
});
