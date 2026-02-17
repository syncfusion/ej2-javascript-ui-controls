/**
 * Lists plugin spec
 */
import { createElement, detach, isNullOrUndefined, selectAll, Browser } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { destroy, renderRTE, dispatchEvent, setSelection } from '../../rich-text-editor/render.spec';
import { RichTextEditor } from '../../../src';
import { CustomUserAgentData } from '../../../src/common/user-agent';
import { BACKSPACE_EVENT_INIT, ENTERKEY_EVENT_INIT, DELETE_EVENT_INIT, SPACE_EVENT_INIT } from '../../constant.spec';

function setCursorPoint(element: Element, point: number) {
    let range: Range = document.createRange();
    let sel: Selection = document.defaultView.getSelection();
    range.setStart(element, point);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

describe('Lists plugin', () => {
    let olHTML: string = ` <div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
   
    <p>First p node-0</p><p>First p node-1</p>

    <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

   <p class='second-p-node'><label class='second-label'>label node</label></p>

   <ol class='ol-first-node'><li><p class='third-p-node'>one-node</p></li><li><p class='fourth-p-node'>two-node</p></li></ol>
   
   <ol class='ol-second-node'><li class='li-item'>level-0</li><li class='li-item'>level-1<ol><li class='li-item'>level-1-1</li><li class='li-item'>level-1-2</li><li class='li-item'>level-1-3</li></ol><li class='li-item'>level-2</li></li></ol>

   <ol class='ol-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ol>

   <ul class='ul-first-node'>
        <li><p class='sixth-p-node'>one-node</p></li>
        <li><p class='seventh-p-node'>two-node</p></li>
   </ul>

   <ol class='ol-fourth-node'>
        <li><p class='eight-p-node'>one-node &lt;IFRAME&gt; and &lt;DIV&gt; </p></li>
        <li><p class='nine-p-node'>two-node</p></li>
   </ol>

   <h1 class='heading-one'>Heading 1</h1>

 </div>`;

    let ulHTML: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner">
   
 <p>First p node-0</p><p>First p node-1</p>

 <p class='first-p-node'>dom node<label class='first-label'>label node</label></p>

<p class='second-p-node'><label class='second-label'>label node</label></p>

<ul class='ul-first-node'><li><p class='third-p-node'>one-node</p></li><li><p class='fourth-p-node'>two-node</p></li></ul>

<ul class='ul-second-node'><li class='li-item'>level-0</li><li class='li-item'>level-1<ul><li class='li-item'>level-1-1</li><li class='li-item'>level-1-2</li><li class='li-item'>level-1-3</li></ul><li class='li-item'>level-2</li></li></ul>

<ul class='ul-third-node'><li>one-node</li><li>two-node</li><li>three-node</li></ul>

<ol class='ol-first-node'>
     <li><p class='sixth-p-node'>one-node</p></li>
     <li><p class='seventh-p-node'>two-node</p></li>
</ol>

</div>`;

    let indentHTML: string = `<div style='color:red;' id='content-edit' contenteditable='true' class='e-node-deletable e-node-inner'>
    <ol class='ol-first-node'><li><p class='one-p-node'>one-node</p></li><li><p class='two-p-node'>two-node</p></li><li><p class='three-p-node'>three-node</p></li><li><p class='four-p-node'>four-node</p></li><li><p class='five-p-node'>five-node</p></li><li><p class='six-p-node'>six-node</p></li><li><p class='seven-p-node'>seven-node</p></li>
    </ol>
    <hr/>
    <ol class='ol-second-node'><li><p class='one-p-node'>One Node</p><ol><li style="list-style-type: none;"><ol><li>Two Node</li></ol></li><li><p>Three Node</p></li></ol></li></ol>
    <hr/>
    <ol class='ol-third-node'><li><p class='one-p-node'>One Node</p><ol><li>Two Node<ol><li><p>Three Node</p></li></ol></li></ol></li></ol>
    <hr/>
    <ol class='ol-four-node'><li>One Node</li><li>Two Node<ol><li style="list-style-type: none;"><ol><li><p>Three Node</p></li></ol></li></ol></li></ol>

</div>`;

    let leftindentHTML: string = `<div style='color:red;' id='content-edit' contenteditable='true' class='e-node-deletable e-node-inner'>
    <ol class='ol-first-node'><li style='list-style-type:none;'><ol><li><p class='one-p-node'>one-node</p></li></ol></li><li><p class='two-p-node'>two-node</p></li></ol>
    <hr/>
    <ol class='ol-second-node'><li style='list-style-type:none;'><ol><li><p class='one-p-node'>one-node</p></li><li><p class='two-p-node'>two-node</p></li><li><p class='three-p-node'>Third-node</p></li></ol></li></ol>
    <hr/>
    <ol class='ol-third-node'><li style='list-style-type:none;'><ol><li><p class='one-p-node'>one-node</p><ol><li><p class='two-p-node'>two-node</p></li><li><p class='three-p-node'>Third-node</p></li></ol></li></ol></li></ol>
    <hr/>
    <ol class='ol-four-node'><li style='list-style-type:none;'><ol><li><p class='one-p-node'>one-node</p><ol><li><p class='two-p-node'>two-node</p></li><li><p class='three-p-node'>Third-node</p></li></ol></li><li><p class='four-p-node'>Four-node</p><ol><li><p class='five-p-node'>Five-node</p></li><li><p class='six-p-node'>Six-node</p></li></ol></li></ol></li></ol>
</div>`;

let revertListHTML: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><ol>

    <li>
    <p class='revertPara-1'>Provide
    the tool bar support, it’s also customizable.</p>
    
    </li>
    
    <li>
    <p>Options
    to get the HTML elements with styles.</p>
    </li>
    
    <li><p class='revertPara-3'>Support
    to insert image from a defined path.</p></li>
    
    </ol></div>
    `;

let tableHTML: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;">helo</td><td style="width: 25%;">this</td><td style="width: 25%;">is</td><td style="width: 25%;">a</td></tr><tr><td style="width: 25%;">test</td><td style="width: 25%;">table</td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table></div>`;

describe ('left indent testing', () => {
    let editorObj: EditorManager;
    let editNode: HTMLElement;
    let startNode: HTMLElement;
    let endNode: HTMLElement;
    let elem: HTMLElement;

    beforeEach(() => {
        elem = createElement('div', {
            id: 'dom-node', innerHTML: leftindentHTML.trim()
        });
        document.body.appendChild(elem);
        editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
        editNode = editorObj.editableElement as HTMLElement;
    });
    afterEach(() => {
        detach(elem);
    });
    it (' apply the left indent to the first LI element',function() {
        startNode = editNode.querySelector('.ol-first-node');
        expect(!isNullOrUndefined(startNode.querySelector('ol'))).toBe(true);
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        endNode = startNode;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        setCursorPoint(startNode, 0);
        editNode.focus();
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === startNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-first-node').querySelector('ol');
        expect(startNode).toBeNull();
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the first LI element with next sibling is within the same parent OL',function() {
        startNode = editNode.querySelector('.ol-second-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        endNode = startNode;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        setCursorPoint(startNode, 0);
        editNode.focus();
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === startNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-second-node').querySelector('li');
        startNode = startNode.childNodes[1] as HTMLElement;
        expect(startNode.tagName === 'OL').toBe(true);
        expect(startNode.childNodes.length === 2).toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the multiple LI element from second element with all elements are within the same parent OL',function() {
        startNode = editNode.querySelector('.ol-second-node');
        endNode = editNode.querySelector('.ol-second-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
        endNode = endNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-second-node');
        expect ((startNode.childNodes[1] as HTMLElement).tagName === 'LI').toBe(true);
        expect ((startNode.childNodes[2] as HTMLElement).tagName === 'LI').toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the one LI element with OL as child element and selecting all elements',function() {
        startNode = editNode.querySelector('.ol-third-node');
        endNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        endNode = endNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-third-node').querySelector('li');
        startNode = startNode.childNodes[1] as HTMLElement;
        expect(startNode.tagName === 'OL').toBe(true);
        expect(startNode.childNodes.length === 2).toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the one LI element with OL as child element and selecting first two elements',function() {
        startNode = editNode.querySelector('.ol-third-node');
        endNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        endNode = endNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-third-node');
        expect (startNode.childNodes[0].childNodes[1].childNodes.length === 1).toBe(true);
        startNode = startNode.childNodes[0].childNodes[1] as HTMLElement;
        expect (startNode.tagName === 'OL').toBe(true);
        startNode = startNode.childNodes[0].childNodes[1] as HTMLElement;
        expect (startNode.tagName === 'OL').toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the one LI element with OL as child element and selecting first(one) elements in the LI',function() {
        startNode = editNode.querySelector('.ol-third-node');
        endNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        endNode = startNode;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-third-node');
        expect (startNode.childNodes.length === 1).toBe(true);
        startNode = startNode.childNodes[0].childNodes[1].childNodes[0] as HTMLElement;
        expect (startNode.childNodes[0].childNodes.length === 2).toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the one LI element with OL as child element and selecting first elements in the OL ',function() {
        startNode = editNode.querySelector('.ol-third-node');
        endNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        endNode = startNode;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
        expect (startNode.childNodes.length === 2).toBe(true);
        expect ((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
        expect ((startNode.childNodes[1] as HTMLElement).tagName === 'LI').toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the one LI element with OL as child element and selecting second elements in the OL ',function() {
        startNode = editNode.querySelector('.ol-third-node');
        endNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
        endNode = startNode;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-third-node');
        startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
        expect (startNode.childNodes.length === 2).toBe(true);
        expect ((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
        expect ((startNode.childNodes[1] as HTMLElement).tagName === 'LI').toBe(true);
        startNode = startNode.childNodes[0].childNodes[1] as HTMLElement;
        expect (startNode.tagName === 'OL').toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    it (' apply the left indent to the childs of multiple nested OL element',function() {
        startNode = editNode.querySelector('.ol-four-node');
        endNode = editNode.querySelector('.ol-four-node');
        startNode = startNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
        endNode = endNode.childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
        editorObj.execCommand("Indents", 'Outdent', null);

        expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
        expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
        startNode = editNode.querySelector('.ol-four-node');
        startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
        expect (startNode.childNodes.length === 2).toBe(true);
        expect ((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
        expect ((startNode.childNodes[1] as HTMLElement).tagName === 'LI').toBe(true);
        startNode = editNode.querySelector('.ol-four-node');
        startNode = startNode.childNodes[1] as HTMLElement;
        expect (startNode.tagName === 'LI').toBe(true);
        startNode = startNode.childNodes[1] as HTMLElement;
        expect (startNode.tagName === 'OL').toBe(true);
        editorObj.nodeSelection.Clear(document);
    });

    afterAll(() => {
        detach(elem);
    });
});

    describe ('right indent testing', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement;
    
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: indentHTML.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
            detach(elem);
        });

        it (' apply the right indent to the LI element with two childs where the selection is the parent element and the first child',function() {
            startNode = editNode.querySelector('.ol-second-node');
            endNode = editNode.querySelector('.ol-second-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-second-node');
            startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'OL').toBe(true);
            expect(startNode.childNodes.length === 2).toBe(true);
            expect((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            expect((startNode.childNodes[1] as HTMLElement).tagName === 'LI').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to the child element with childs having parent having nested child where the selection is the nested child element',function() {
            startNode = editNode.querySelector('.ol-third-node');
            endNode = editNode.querySelector('.ol-third-node');
            startNode = startNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-third-node');
            startNode = startNode.childNodes[0].childNodes[1] as HTMLElement;
            let siblingListLI: NodeListOf<HTMLLIElement> = (startNode as Element).querySelectorAll('li') as NodeListOf<HTMLLIElement>;
            let siblingListOL: Element[] = <NodeListOf<Element> & Element[]>(startNode as Element).querySelectorAll('ol, ul');
            expect(siblingListLI.length === 3).toBe(true);
            expect(siblingListOL.length === 2).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to the li element with child element right indented twice and with previous element ',function() {
            startNode = editNode.querySelector('.ol-four-node');
            endNode = editNode.querySelector('.ol-four-node');
            startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-four-node');
            expect(startNode.childNodes.length === 1).toBe(true);
            expect((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to the first LI element',function() {
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = startNode;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            setCursorPoint(startNode, 0);
            editNode.focus();
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === startNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            expect(startNode.childNodes.length === 1).toBe(true);
            expect((startNode.childNodes[0] as Element).tagName === 'OL').toBe(true);
            editorObj.nodeSelection.Clear(document);
            
        });

        it (' apply the right indent to multiple LI element',function() {
            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            expect(startNode.childNodes[0].childNodes.length == 3).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to multiple LI element with previous Element as OL',function() {
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = startNode;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[3].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            expect(startNode.childNodes[0].childNodes.length == 4).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to one LI element which the Ol element as child and with previous Element as OL ',function() {
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = startNode;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);
   
            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[3].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);


            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            expect(startNode.childNodes[0].childNodes.length == 2).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[1].childNodes[1] as HTMLElement;
            expect(startNode.childNodes.length == 2).toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to one LI element which the Ol elements as child with previous Element as OL with range cutsout to first child of OL',function() {
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = startNode;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);
   
            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[3].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);


            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            expect(startNode.childNodes[0].childNodes.length == 3).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[1].childNodes[1] as HTMLElement;
            expect(startNode.childNodes.length == 1).toBe(true);
            expect((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to multiple LI element with one li having the Ol element as child with previous Element as OL ',function() {
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = startNode;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);
   
            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[3].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);


            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            expect(startNode.childNodes[0].childNodes.length == 3).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[1].childNodes[1] as HTMLElement;
            expect(startNode.childNodes.length == 2).toBe(true);
            expect((startNode.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            editorObj.nodeSelection.Clear(document);
        });

        it (' apply the right indent to childs in the multiple LI element with two li having the Ol element as child ',function() {
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            endNode = startNode;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);
   
            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[2].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[3].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[3].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[4].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            startNode = editNode.querySelector('.ol-first-node');
            endNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
            endNode = endNode.childNodes[2].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
            editorObj.execCommand("Indents", 'Indent', null);

            expect((editorObj as any).nodeSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
            expect((editorObj as any).nodeSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1] as HTMLElement;
            expect(startNode.tagName === 'LI').toBe(true);
            startNode = editNode.querySelector('.ol-first-node');
            startNode = startNode.childNodes[1].childNodes[1] as HTMLElement;
            expect(startNode.childNodes.length == 3).toBe(true);
            expect(startNode.childNodes[0].childNodes[1].childNodes.length == 1)
            expect(startNode.childNodes[1].childNodes[1].childNodes.length == 1)
            editorObj.nodeSelection.Clear(document);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe(' OL testing', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };

        describe(' basic OL format apply and revert with content with space', () => {
            
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: revertListHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' apply the OL format to selected "p"and revert with content with space', () => {
                startNode = editNode.querySelector('.revertPara-1');
                endNode = editNode.querySelector('.revertPara-3');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
                startNode = editNode.querySelector('.revertPara-1');
                endNode = editNode.querySelector('.revertPara-3');
                expect(startNode.parentElement.tagName !== 'OL').toBe(true);
                expect(endNode.parentElement.tagName !== 'OL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });
            afterAll(() => {
                detach(elem);
            });
        });
    
        describe('Table OL testing', () => {            
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: tableHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it(' apply the OL format to table with empty content at the end of the table', () => {
                startNode = editNode.querySelector('#content-edit');
                endNode = editNode.querySelector('.revertPara-3');
                startNode = editNode as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, startNode, 0, 1);
                editorObj.execCommand("Lists", 'OL', null);
                expect(editNode.querySelectorAll('li').length === 8).toBe(true);
                expect(editNode.querySelectorAll('li')[7].children[0].nodeName === 'BR').toBe(true);
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe('912827 - Decreasing indent should convert list items into a single paragraph', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true" ><ol><li style=\"list-style-type: none;\"><ol><li>List 1</li><li>List 2</li><li>List 3</li><li>List 4</li></ol></li></ol></div>`,
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it('Decreasing indent should convert list items into a single paragraph', () => {
                startNode = editNode.querySelector('ol');
                editorObj.nodeSelection.setSelectionNode(document, startNode);
                editorObj.execCommand("Indents", 'Outdent', null);
                editorObj.execCommand("Indents", 'Outdent', null);
                editorObj.execCommand("Indents", 'Outdent', null);
                editorObj.execCommand("Indents", 'Outdent', null);
                editorObj.nodeSelection.Clear(document);
                expect(editNode.innerHTML === '<p>List 1</p><p>List 2</p><p>List 3</p><p>List 4</p>').toBe(true);
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe('EJ2-59780 - List not applied in fire fox testing', () => {
            let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
            let defaultUA: string = navigator.userAgent;
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p class="startFocus">A paragraph is a series of sentences that are organized and coherent,
                and are all related to a single topic. Almost every piece of writing 
               you do that is longer than a few sentences should be organized into 
               paragraphs. This is because paragraphs show a reader where the 
               subdivisions of an essay begin and end, and thus help the reader see the
                organization of the essay and grasp its main points.</p><p class="endFocus">Paragraphs 
               can contain many different kinds of information. A paragraph could 
               contain a series of brief examples or a single long illustration of a 
               general point. It might describe a place, character, or process; narrate
                a series of events; compare or contrast two or more things; classify 
               items into categories; or describe causes and effects. Regardless of the
                kind of information they contain, all paragraphs share certain 
               characteristics. One of the most important of these is a topic sentence.</p></div>`
            });
            beforeAll(() => {
                Browser.userAgent = fireFox;
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it(' apply list not working for the pasted content when select all', () => {
                startNode = editNode.querySelector('.startFocus');
                endNode = editNode.querySelector('.endFocus');
                startNode = editNode as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 0);
                editorObj.execCommand("Lists", 'OL', null);
                expect(editNode.querySelectorAll('li').length === 2).toBe(true);
            });
            afterAll(() => {
                Browser.userAgent = defaultUA;
                detach(elem);
            });
        });

        describe('832588 - console error occurs when you apply the number format when start of the selection is a empty line', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p>rich text editor</p><p class="startFocus"><br></p><p>rich text editor</p><p class="endFocus">rich text editor</p></div>`
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it(' console error occurs when you apply the number format when start of the selection is a empty line', () => {
                startNode = editNode.querySelector('.startFocus');
                endNode = editNode.querySelector('.endFocus');
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode.childNodes[0], 0, 16);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.nodeSelection.range.startContainer as HTMLElement).classList.contains('startFocus')).toBe(true);
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe('873315 - Applying list to the blockquotes element', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p class="startFocus">Line 1</p><p>Line 2</p><blockquote>Line 3 with quotation</blockquote><p>Line 4</p><p>Line 5</p><blockquote>Line 6&nbsp;<span style="background-color: unset; text-align: inherit;">with quotation</span></blockquote><p>Line 7</p><p class="endFocus">Line 8</p></div>`
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it(' Applying list to the blockquotes content', () => {
                startNode = editNode.querySelector('.startFocus');
                endNode = editNode.querySelector('.endFocus');
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 3);
                editorObj.execCommand("Lists", 'OL', null);
                expect(editNode.querySelectorAll('blockquote')[0].closest('OL')).toBe(null);
                expect(editNode.querySelectorAll('blockquote')[1].closest('OL')).toBe(null);
                expect(editNode.innerHTML === `<ol><li class="startFocus">Line 1</li><li>Line 2</li></ol><blockquote><ol><li>Line 3 with quotation</li></ol></blockquote><ol><li>Line 4</li><li>Line 5</li></ol><blockquote><ol><li>Line 6&nbsp;<span style="background-color: unset; text-align: inherit;">with quotation</span></li></ol></blockquote><ol><li>Line 7</li><li class="endFocus">Line 8</li></ol>`).toBe(true);
            });
            afterAll(() => {
                detach(elem);
            });
        });
        
        describe('EJ2-60037 - Console error occurs when list applied in fire fox testing', () => {
            let fireFox: string = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0";
            let defaultUA: string = navigator.userAgent;
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p class="startFocus">A paragraph is a series of sentences that are organized and coherent,
                and are all related to a single topic. Almost every piece of writing 
               you do that is longer than a few sentences should be organized into 
               paragraphs. This is because paragraphs show a reader where the 
               subdivisions of an essay begin and end, and thus help the reader see the
                organization of the essay and grasp its main points.</p><p class="endFocus">Paragraphs 
               can contain many different kinds of information. A paragraph could 
               contain a series of brief examples or a single long illustration of a 
               general point. It might describe a place, character, or process; narrate
                a series of events; compare or contrast two or more things; classify 
               items into categories; or describe causes and effects. Regardless of the
                kind of information they contain, all paragraphs share certain 
               characteristics. One of the most important of these is a topic sentence.</p></div>`
            });
            beforeAll(() => {
                Browser.userAgent = fireFox;
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it('  Console error occurs when list applied for the pasted content when select all', () => {
                startNode = editNode.querySelector('#content-edit');
                endNode = editNode.querySelector('.endFocus');
                startNode = editNode as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, startNode, 0, 2);
                editorObj.execCommand("Lists", 'OL', null);
                expect(editNode.querySelectorAll('li').length === 2).toBe(true);
                expect(window.getSelection().anchorOffset === 0).toBe(true);
                expect(window.getSelection().focusOffset === 610).toBe(true);
            });
            afterAll(() => {
                Browser.userAgent = defaultUA;
                detach(elem);
            });
        });

        describe(' basic OL format apply and revert', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: olHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' apply the OL format to selected "p" node with different class', () => {
                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.second-p-node');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0].childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.second-p-node');
                expect(startNode.childNodes.length === 2).toBe(true);
                expect(endNode.childNodes.length === 1).toBe(true);
                expect(startNode.parentElement.tagName === 'OL').toBe(true);
                expect(endNode.parentElement.tagName === 'OL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });
            
            it(' apply the OL format to selected "p" node without class', () => {
                startNode = (editNode.querySelectorAll('p') as NodeListOf<HTMLParagraphElement> & Element[])[0] as HTMLElement;
                endNode = (editNode.querySelectorAll('p') as NodeListOf<HTMLParagraphElement> & Element[])[1] as HTMLElement;
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
                startNode = editNode.querySelector('ol');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = editNode.querySelector('ol');
                endNode = endNode.childNodes[1] as HTMLElement;
                expect(startNode.textContent === 'First p node-0').toBe(true);
                expect(endNode.textContent === 'First p node-1').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' apply the OL format to already applied "OL" format elements', () => {
                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.ol-first-node');
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[1].childNodes[0].childNodes[0], 0, 4);
                editorObj.execCommand("Lists", 'OL', null , null , null ,null , null , 'p');
                startNode = editNode.querySelector('.first-p-node');
                endNode = elem.querySelector('.second-p-node');
                expect((startNode as Element).tagName === 'P').toBe(true);
                expect((endNode as Element).tagName === 'P').toBe(true);

                let replaceNodes: Element[] = <Element[] & NodeListOf<Element>>editNode.querySelectorAll('p.ol-first-node');
                let olP3: Element = replaceNodes[0]
                let olP4: Element = replaceNodes[1];
                expect((olP3.parentNode as Element).tagName !== 'LI').toBe(true);
                expect((olP4.parentNode as Element).tagName !== 'LI').toBe(true);

                editorObj.nodeSelection.Clear(document);
            });

            it(' revert from parent LI node and nested LI selection point', () => {
                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                endNode = editNode.querySelector('.ol-second-node');
                endNode = endNode.childNodes[1].childNodes[1].childNodes[1] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode.childNodes[0], 0, 4);
                editNode.focus();
                editorObj.execCommand("Lists", 'OL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.childNodes[0].textContent).toBe(true);

                expect(editNode.querySelector('p.ol-second-node')).not.toBeNull();
                expect(editNode.querySelectorAll('.ol-second-node').length === 5).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' apply the OL format to selected "h1" node', () => {
                startNode = editNode.querySelector('.heading-one');
                endNode = startNode;
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = startNode;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
                startNode = editNode.querySelector('.heading-one');
                expect(!isNullOrUndefined(startNode.querySelector('h1'))).toBe(true);
                expect(startNode.parentElement.tagName === 'OL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe(' tab and shift+tab and revert', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: olHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' revert from parent LI node and nested LI selection point', () => {
                startNode = editNode.querySelector('.ol-second-node');
                endNode = startNode.childNodes[1].childNodes[1].childNodes[2].childNodes[0] as HTMLElement;
                setCursorPoint(endNode, 0);
                keyBoardEvent.event.shiftKey = true;
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === endNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-second-node');
                setCursorPoint(startNode.childNodes[3].childNodes[0] as Element, 0);
                keyBoardEvent.event.shiftKey = false;
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);

                startNode = editNode.querySelector('.ol-second-node');
                endNode = startNode.childNodes[2].childNodes[0] as HTMLElement;
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editNode.focus();
                editorObj.execCommand("Lists", 'OL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);

                expect(editNode.querySelector('p.ol-second-node')).not.toBeNull();
                expect(editNode.querySelectorAll('p.ol-second-node').length === 4).toBe(true);
                editorObj.nodeSelection.Clear(document);   
            });
            afterAll(() => {
                detach(elem);
            });
        });
        describe(' OL format with tab and shift+tab key', () => {
            let elem: HTMLElement;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: olHTML.trim()
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' tab key navigation from first li start point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node').querySelector('ol');
                expect(startNode.tagName === 'OL').toBe(true);
                expect(startNode.childNodes.length === 1).toBe(true);
                expect((startNode.childNodes[0] as Element).tagName === 'LI').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li and second point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node').querySelector('ol');
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' without tab key navigation from second li and first point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                keyBoardEvent.event.which = 9;
                startNode = editNode.querySelector('.ol-third-node').querySelector('ol');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li start point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node').querySelector('ol');
                expect(startNode.tagName === 'OL').toBe(true);
                expect(startNode.childNodes.length === 1).toBe(true);
                expect((startNode.childNodes[0] as Element).tagName === 'LI').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "OL" first li node start point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                startNode= startNode.childNodes[1].childNodes[0] as HTMLElement;
                endNode = startNode;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Indents", 'Indent', null);
                
                startNode = editNode.querySelector('.ol-third-node');
                startNode= startNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node')
                expect(startNode.childNodes.length === 3).toBe(true);
                startNode = startNode.querySelector('ol');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li "p" element start point', () => {
                startNode = editNode.querySelector('.ol-first-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-first-node');
                startNode = startNode.childNodes[0].childNodes[1] as HTMLElement;
                expect(startNode.tagName === 'OL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "OL" li "p" element start point', () => {
                startNode = editNode.querySelector('.ol-first-node');
                startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                endNode = startNode;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Indents", 'Indent', null);

                startNode = editNode.querySelector('.ol-first-node');
                startNode = startNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-first-node')
                expect(startNode.childNodes.length === 2).toBe(true);
                startNode = startNode.querySelector('ol');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li with nested OL element start point', () => {
                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);
                
                startNode = editNode.querySelector('.ol-second-node').querySelector('ol');
                expect(startNode).not.toBeNull();
                expect(editNode.querySelector('.ol-second-node').querySelectorAll('ol').length === 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from next second LI start point', () => {
                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-second-node');
                expect(startNode.childNodes.length == 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from second li start point of nested OL element', () => {
                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[1].childNodes[1].childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-second-node');
                expect(startNode.childNodes.length == 4).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });
            it(' tab key navigation from second li start point with \n line', () => {                
                editNode.innerHTML = "<ol class='ol-third-node'><li>one-node</li>\n<li>two-node</li>\n<li>three-node</li></ol>";
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[2].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);
                startNode = editNode.querySelector('.ol-third-node').querySelector('ol');
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            afterAll(() => {
                detach(elem);
            });
        });

        xdescribe(' ul format with tab and shift+tab key', () => {
            let elem: HTMLElement;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: ulHTML.trim()
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' tab key navigation from first li start point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-third-node').querySelector('ul');
                expect(startNode.tagName === 'UL').toBe(true);
                expect(startNode.childNodes.length === 1).toBe(true);
                expect((startNode.childNodes[0] as Element).tagName === 'LI').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li and second point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-third-node').querySelector('ul');
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' without tab key navigation from second li and first point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                keyBoardEvent.event.which = 9;
                startNode = editNode.querySelector('.ul-third-node').querySelector('ul');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li start point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-third-node').querySelector('ul');
                expect(startNode.tagName === 'UL').toBe(true);
                expect(startNode.childNodes.length === 1).toBe(true);
                expect((startNode.childNodes[0] as Element).tagName === 'LI').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "ul" first li node start point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                startNode= startNode.childNodes[1].childNodes[0] as HTMLElement;
                endNode = startNode;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Indents", 'Indent', null);
                
                startNode = editNode.querySelector('.ul-third-node');
                startNode= startNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-third-node')
                expect(startNode.childNodes.length === 3).toBe(true);
                startNode = startNode.querySelector('ul');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li "p" element start point', () => {
                startNode = editNode.querySelector('.ul-first-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-first-node');
                startNode = startNode.childNodes[0].childNodes[1] as HTMLElement;
                expect(startNode.tagName === 'UL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "ul" li "p" element start point', () => {
                startNode = editNode.querySelector('.ul-first-node');
                startNode = startNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                endNode = startNode;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Indents", 'Indent', null);

                startNode = editNode.querySelector('.ul-first-node');
                startNode = startNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-first-node')
                expect(startNode.childNodes.length === 2).toBe(true);
                startNode = startNode.querySelector('ul');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li with nested ul element start point', () => {
                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);
                
                startNode = editNode.querySelector('.ul-second-node').querySelector('ul');
                expect(startNode).not.toBeNull();
                expect(editNode.querySelector('.ul-second-node').querySelectorAll('ul').length === 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from next second LI start point', () => {
                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-second-node');
                expect(startNode.childNodes.length == 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from second li start point of nested ul element', () => {
                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[1].childNodes[1].childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-second-node');
                expect(startNode.childNodes.length == 4).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe(' OL to UL ', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: olHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' convert the OL list to UL list', () => {
                startNode = editNode.querySelector('.ol-third-node');
                endNode = startNode.childNodes[2] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 4);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.childNodes[0].textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.childNodes[0].textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });
            it(' convert the OL list to UL list while render with inner HTML tag', () => {
                startNode = editNode.querySelector('.eight-p-node');
                setCursorPoint(startNode.childNodes[0] as Element, 0);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.childNodes[0].textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.childNodes[0].textContent).toBe(true);
                startNode = editNode.querySelector('.eight-p-node');
                startNode = editNode.querySelector('iframe');
                expect(isNullOrUndefined(startNode)).toBe(true);
                expect(editNode.querySelector('.ol-fourth-node').tagName === 'UL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });
            it(' convert the OL list to UL list while selection point within a list item', () => {
                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode.childNodes[0] as Element, 0);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.childNodes[0].textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.childNodes[0].textContent).toBe(true);

                startNode = editNode.querySelector('.ol-second-node');
                expect(startNode.tagName === 'UL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe(' OL format apply with toolbar icon, when applying the new list with OL ', () => {
            revertListHTML = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><ol style="list-style-image: none; list-style-type: lower-greek;">

            <li>
            <p class='revertPara-1'>Testing 1</p>
            
            </li>
            
            <li>
            <p>Testing 2</p>
            </li>
            
            <li><p class='revertPara-3'>Testing 3</p></li>
            
            </ol></div>`;
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: revertListHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' apply the OL format to selected "p"and revert with content with space', () => {
                startNode = editNode.querySelector('.revertPara-1');
                endNode = editNode.querySelector('.revertPara-3');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 9);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
                startNode = editNode.querySelector('.revertPara-1');
                expect(startNode.parentElement.parentElement.hasAttribute('style')).toBe(false);
                editorObj.nodeSelection.Clear(document);
            });
            afterAll(() => {
                detach(elem);
            });
        });
        describe('865019 - console error occurs when you apply the number format when end of the selection is a empty line', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p>rich text editor</p><p class="startFocus">rich text editor</p><p>rich text editor</p><p class="endFocus"><br></p></div>`
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it('console error occurs when you apply the number format when end of the selection is a empty line', () => {
                startNode = editNode.querySelector('.startFocus');
                endNode = editNode.querySelector('.endFocus');
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode.childNodes[0], 0, 0);
                editorObj.execCommand("Lists", 'OL', null);
                expect((editorObj.nodeSelection.range.endContainer as HTMLElement).classList.contains('endFocus')).toBe(true);
            });
            afterAll(() => {
                detach(elem);
            });
        });
        describe('876790 - applying list to the content with indentation and other style applied in block element', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p class="startFocus" style="margin-left: 120px; color: red; background-color: yellow;">sdvsdvsdv</p><p style="margin-left: 80px; color: yellow; background-color: red;">sdvdsvdsvsdvsdv</p><p>sdv</p><p class="endFocus" style="margin-left: 40px;">sdvsdvdsvsdv</p></div>`
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            it('console error occurs when you apply the number format when end of the selection is a empty line', () => {
                startNode = editNode.querySelector('.startFocus');
                endNode = editNode.querySelector('.endFocus');
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 1, 3);
                editorObj.execCommand("Lists", 'OL', null);
                expect(editNode.innerHTML === `<ol style="margin-left: 120px;"><li class="startFocus" style="color: red; background-color: yellow;">sdvsdvsdv</li><li style="color: yellow; background-color: red;">sdvdsvdsvsdvsdv</li><li>sdv</li><li class="endFocus" style="">sdvsdvdsvsdv</li></ol>`).toBe(true);
            });
            afterAll(() => {
                detach(elem);
            });
        });
    });

    describe(' UL testing', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };

        xdescribe(' basic ul format apply and revert', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: ulHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' apply the ul format to selected "p" node with different class', () => {
                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.second-p-node');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0].childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);

                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.second-p-node');
                expect(startNode.parentElement.tagName === 'UL').toBe(true);
                expect(endNode.parentElement.tagName === 'UL').toBe(true);
                expect(startNode.childNodes.length === 2).toBe(true);
                expect(endNode.childNodes.length === 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' apply the ul format to selected "p" node without class', () => {
                startNode = (editNode.querySelectorAll('p') as NodeListOf<HTMLParagraphElement> & Element[])[0] as HTMLElement;
                endNode = (editNode.querySelectorAll('p') as NodeListOf<HTMLParagraphElement> & Element[])[1] as HTMLElement;
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);

                startNode = editNode.querySelector('ul').childNodes[0] as HTMLElement;
                endNode = editNode.querySelector('ul').childNodes[1] as HTMLElement;
                expect(startNode.textContent === 'First p node-0').toBe(true);
                expect(endNode.textContent === 'First p node-1').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' apply the ul format to already applied "ul" format elements', () => {
                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.ul-first-node');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);

                startNode = editNode.querySelector('.first-p-node');
                endNode = elem.querySelector('.second-p-node');
                expect((startNode as Element).tagName === 'P').toBe(true);
                expect((endNode as Element).tagName === 'P').toBe(true);

                let replaceNodes: Element[] = <Element[] & NodeListOf<Element>>editNode.querySelectorAll('p.ul-first-node');
                let ulP3: Element = replaceNodes[0]
                let ulP4: Element = replaceNodes[1];
                expect((ulP3.parentNode as Element).tagName !== 'LI').toBe(true);
                expect((ulP4.parentNode as Element).tagName !== 'LI').toBe(true);

                editorObj.nodeSelection.Clear(document);
            });

            it(' revert from parent LI node and nested LI selection point', () => {
                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
                endNode = editNode.querySelector('.ul-second-node');
                endNode = endNode.childNodes[1].childNodes[1].childNodes[1] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode.childNodes[0], 0, 4);
                editNode.focus();
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.childNodes[0].textContent).toBe(true);

                expect(editNode.querySelector('p.ul-second-node')).not.toBeNull();
                expect(editNode.querySelectorAll('.ul-second-node').length === 3).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe(' UL to OL ', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: ulHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' convert the UL list to OL list', () => {
                startNode = editNode.querySelector('.ul-third-node');
                endNode = startNode.childNodes[2] as HTMLElement;
                startNode = startNode.childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 4);
                editorObj.execCommand("Lists", 'OL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.childNodes[0].textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.childNodes[0].textContent).toBe(true);

                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' convert the UL list to OL list while selection point within a list item', () => {
                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editorObj.execCommand("Lists", 'OL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-second-node');
                expect(startNode.tagName === 'OL').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe('Space key press testing', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><p>one node</p><p class='space-two-node'>1.two node</p><p><br></p>
            <p>three node</p><p class='space-four-node'>*four node</p><p><br></p>
            <p class='space-five-node'>*five node</p><p class='space-six-node'>1.six node</p>
            <p><br></p><p class='space-seven-node'>a.seven node</p>
            <p><br></p><p class='space-eight-node'>i.eight node</p>
            <p><br></p><p class='space-nine-node'>11.nine node</p><div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' space key press after 1.', () => {
                startNode = editNode.querySelector('.space-two-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-two-node').parentElement.tagName).toBe('OL');
            });

            it(' space key press after *', () => {
                startNode = editNode.querySelector('.space-four-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 1);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-four-node').parentElement.tagName).toBe('UL');
            });

            it(' space key press after 1. when previous element starting with *', () => {
                startNode = editNode.querySelector('.space-six-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-six-node').parentElement.tagName).not.toBe('OL');
                expect(editNode.querySelector('.space-six-node').tagName).toBe('P');
            });

            it(' space key press after * when previous element starting with *', () => {
                startNode = editNode.querySelector('.space-five-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 1);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-five-node').parentElement.tagName).not.toBe('OL');
                expect(editNode.querySelector('.space-five-node').tagName).toBe('P');
            });

            it(' space key press after a.', () => {
                startNode = editNode.querySelector('.space-seven-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-seven-node').parentElement.tagName).toBe('OL');
            });

            it(' space key press after i.', () => {
                startNode = editNode.querySelector('.space-eight-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-eight-node').parentElement.tagName).toBe('OL');
            });

            it(' space key press after 11.', () => {
                startNode = editNode.querySelector('.space-nine-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 3);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-nine-node').tagName).toBe('P');
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe('992601: Auto format support for checklist and checked checklist', () => {
            let rteObj: RichTextEditor;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['SourceCode']
                    },
                    enableMarkdownAutoFormat: true,
                });
                done();
            });
            afterEach((done: Function) => {
                destroy(rteObj);
                done();
            });
            it('Auto format support for checklist', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 2);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
            it('Auto format support for checked checklist', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[x] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 3);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    expect((rteObj.inputElement.querySelectorAll('.e-rte-checklist-checked')).length === 1).toBe(true);
                    done();
                }, 50);
            });
            it('Auto format support for checklist in Unordered list', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<ul><li>list1</li><li>list</li><li class="select">[] </li></ul>';
                let content: HTMLElement = rteObj.inputElement.querySelector('.select').firstChild as HTMLElement;
                setCursorPoint(content, 2);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
            it('Auto format support for checklist in Ordered list', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<ol><li>list1</li><li>list</li><li class="select">[x] </li></0l>';
                let content: HTMLElement = rteObj.inputElement.querySelector('.select').firstChild as HTMLElement;
                setCursorPoint(content, 3);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
        });

        describe('995046: Auto format support for checklist and checked checklist with single space inside the []', () => {
            let rteObj: RichTextEditor;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['SourceCode']
                    },
                    enableMarkdownAutoFormat: true,
                });
            });
            afterEach(() => {
                destroy(rteObj);
            });
            it('Should create checklist when single space is present inside [ ]', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[ ] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 3);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
            it('Should create checked checklist when single space is present inside [ x], before the x', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[ x] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 4);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
            it('Should create checked checklist when single space is present inside [x ], after the x', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[x ] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 4);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
            it('Should create checked checklist when single space is present [ x ], beofre and after the x', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[ x ] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 5);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelector('ul').classList.contains('e-rte-checklist')).toBe(true);
                    done();
                }, 50);
            });
            it('Should not create checklist for the multiple spaces inside []', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[  ] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 4);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelectorAll('ul').length).toBe(0);
                    done();
                }, 50);
            });
             it('Should not create checklist for the multiple spaces inside [ x ]', (done: Function) => {
                rteObj.focusIn();
                rteObj.inputElement.innerHTML = '<p>[x  ] </p>';
                let content: HTMLElement = rteObj.inputElement.querySelector('p').firstChild as HTMLElement;
                setCursorPoint(content, 5);
                const spaceDownEvent: KeyboardEvent = new KeyboardEvent('keydown', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceDownEvent);
                const spaceUpEvent: KeyboardEvent = new KeyboardEvent('keyup', SPACE_EVENT_INIT);
                rteObj.inputElement.dispatchEvent(spaceUpEvent);
                setTimeout(() => {
                    expect(rteObj.inputElement.querySelectorAll('ul').length).toBe(0);
                    done();
                }, 50);
            });
        });

        describe('Space key press testing bold applied', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><p class="selectNode"><strong>​1.</strong></p><div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' space key press after 1. when bold is applied', () => {
                startNode = editNode.querySelector('.selectNode');
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 3);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.selectNode').parentElement.tagName).toBe('OL');
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe('941259 - Auto List Conversion - Space Key Press Tests', () => {
            let elem: HTMLElement;
            let editorObj: EditorManager;
            let editNode: HTMLElement;
            let startNode: Node;
            let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 32 } };
       
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node',
                    innerHTML: `<div id="content-edit">
                                    <ol><li class="olNode">1.</li></ol>
                                    <ul><li class="ulNode">1.</li></ul>
                                    <ul><li class="ulNode-star">*</li></ul>
                                    <ol><li class="olNode-star">*</li></ol>
                                </div>`
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
       
            afterEach(() => {
                detach(elem);
            });
       
            it('Should not change the OL list when "1." is pressed at the start of OL\'s LI content', () => {
                startNode = editNode.querySelector('.olNode').childNodes[0];
                setCursorPoint(startNode as Element, 2);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.olNode').parentElement.tagName).toBe('OL');
            });
       
            it('Should change UL to OL when "1." is pressed at the start of UL’s LI content', () => {
                startNode = editNode.querySelector('.ulNode').childNodes[0];
                setCursorPoint(startNode as Element, 2);
                editNode.focus();
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.ulNode').parentElement.tagName).toBe('OL'); // Expected change
            });
       
            it('Should not change the UL list when "*" is pressed at the start of UL\'s LI content', () => {
                startNode = editNode.querySelector('.ulNode-star').childNodes[0];
                setCursorPoint(startNode as Element, 1);
                editNode.focus();
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.ulNode-star').parentElement.tagName).toBe('UL');
            });
       
            it('Should change OL to UL when "*" is pressed at the start of OL’s LI content', () => {
                startNode = editNode.querySelector('.olNode-star').childNodes[0];
                setCursorPoint(startNode as Element, 1);
                editNode.focus();
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.olNode-star').parentElement.tagName).toBe('UL'); // Expected change
            });
       
            afterAll(() => {
                detach(elem);
            });
        });

        describe('872830 - Space key press cursor position test ', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><p>RTE Content</p><p class="selectNode">1.</p><div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });
            it(' Space key press cursor position test', () => {
                startNode = editNode.querySelector('.selectNode');
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.selectNode').parentElement.tagName).toBe('OL');
                expect(editNode.querySelector('.selectNode').parentElement.childNodes[0].childNodes[0].nodeName).toBe('BR');
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe('- Space key press testing', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><p>one node</p><p class='space-two-node'>1.two node</p><p><br></p>
            <p>three node</p><p class='space-four-node'>-four node</p><p><br></p>
            <p class='space-five-node'>*five node</p><p class='space-six-node'>1.six node</p>
            <p><br></p><p class='space-seven-node'>a.seven node</p>
            <p><br></p><p class='space-eight-node'>i.eight node</p><div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });
            it(' space key press after -', () => {
                startNode = editNode.querySelector('.space-four-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 1);
                editNode.focus();
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'space';
                keyBoardEvent.event.which = 32;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('.space-four-node').parentElement.tagName).toBe('UL');
            });
        });

        describe('Enter key press testing in list', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ol><li id='firstli'>&#65279;&#65279;</li></ol></div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' enter key press after OL 1.', () => {
                startNode = editNode.querySelector('#firstli');
                expect(startNode.textContent.length === 2).toBe(true);
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'enter';
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('#firstli')).toBe(null);
                innerValue = `<div id="content-edit"><ul><li>List Content 1</li><li id="imageList"><img src="blob:null/bc977338-2728-4625-b218-2099b4dfbf23" class="e-rte-image e-imginline e-img-focus" alt="Tiny_Image.PNG" width="auto" height="auto" style="min-width: 0px; max-width: 1233px; min-height: 0px;"> </li></ul></div>`;
            });

            it(' enter key press inside list element with only image', () => {
                startNode = editNode.querySelector('#imageList');
                setCursorPoint(startNode, 1);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'enter';
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('#imageList')).not.toBe(null);
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe('872421 - Enter key press testing in nested list', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ol><li>List 1</li><li>List 2<ol><li style="list-style-type: none;"><ol><li style="list-style-type: none;"><ol><li class="focusNode"><br></li></ol></li></ol></li></ol></li></ol></div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' Enter key press testing in nested list after OL 1.', () => {
                startNode = editNode.querySelector('.focusNode');
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'enter';
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.innerHTML === `<ol><li>List 1</li><li>List 2<ol><li style="list-style-type: none;"><ol><li style=""></li></ol></li></ol></li></ol>`).toBe(true);
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe('Enter key press testing in list with empty space', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ol><li id='firstli'>&nbsp;</li></ol></div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' enter key press after OL', () => {
                startNode = editNode.querySelector('#firstli');
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'enter';
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('#firstli')).not.toBe(null);
            });

            it(' enter key press after UL', () => {
                innerValue = `<div id="content-edit"><ul><li id='firstli'>&nbsp;</li></ul></div>`;
                startNode = editNode.querySelector('#firstli');
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'enter';
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelector('#firstli')).not.toBe(null);
            });
            afterAll(() => {
                detach(elem);
            });
        });

        describe('Bug 939469: List not removed when we press backspace key in the RichTextEditor', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ul><li class="rte">Hello</li></ul></div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' Backspace key press at start of the normal list', () => {
                startNode = editNode.querySelector('.rte');
                setCursorPoint((startNode.childNodes[0] as Element), 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelectorAll('p').length === 1).toBe(true);
            });
        });

        describe('Bug 972655: List Structure Not Reverting Properly on Backspace with Heading Tag', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ul><li><h1 class="rte">Welcome to the Syncfusion Rich Text Editor</h1></li></ul></div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' Backspace key press at start of the list when blocknode is in list', () => {
                startNode = editNode.querySelector('.rte');
                setCursorPoint((startNode.childNodes[0] as Element), 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelectorAll('ul').length === 0).toBe(true);
            });
        });

        describe('Backspace key press at the start of the list when no content is previous to the list', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ol><li id="firstli">first</li><li>second</li><li>third﻿﻿<br></li></ol><div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' Backspace key press at start of the normal list', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint((startNode.childNodes[0] as Element), 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelectorAll('p').length === 1).toBe(true);
                (editorObj as any).editorKeyUp(keyBoardEvent);
                expect(editNode.querySelectorAll('.removeList').length === 0).toBe(true);
                innerValue = `<div id="content-edit"><ol><li id="firstli">sdvsdv<ol><li>sdvsdv<ol><li>svdsdvsd</li></ol></li></ol></li><li>vsdvsdv﻿﻿<br></li></ol><div>`;
            });

            it(' Backspace key press at start of the nested list', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint((startNode.childNodes[0] as Element), 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.querySelectorAll('p').length === 1).toBe(true);
                (editorObj as any).editorKeyUp(keyBoardEvent);
                expect(editNode.querySelectorAll('.removeList').length === 0).toBe(true);
                innerValue = `<div id="content-edit"><ul><li id="firstli"><br><ol><li id="sublist">sublist</li><li>sublist 2﻿﻿<br></li></ol></li></ul><div>`;
            });

            afterAll(() => {
                detach(elem);
            });
        });

        describe('Safari cursor positioning after list removal', () => {
            let editorObj: EditorManager;
            let editNode: HTMLElement;
            let elem: HTMLElement;
            let startNode: HTMLElement;
            let defaultUA: string = navigator.userAgent;
            let safari: string = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15";
            let keyBoardEvent: any = {
                callBack: function () { },
                event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 8 }
            };
            let innerValue: string = `<div id="content-edit" contenteditable="true"><p>Some text before the list</p><ol><li id="firstli">First item</li><li id="secondli">Second item</li><li id="thirdli">Third item</li></ol></div>`;
        
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node',
                    innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                Browser.userAgent = safari;
                editorObj.userAgentData = new CustomUserAgentData(Browser.userAgent, true);
                editNode = editorObj.editableElement as HTMLElement;
            });
        
            afterEach(() => {
                detach(elem);
                Browser.userAgent = defaultUA;
                editorObj.userAgentData = new CustomUserAgentData(Browser.userAgent, false);
            });
        
            it('cursor position testing when whole list is selected and press backspace in Safari', () => {
                startNode = editNode.querySelector('#firstli');
                endNode = editNode.querySelector('#thirdli');
                setCursorPoint(startNode.firstChild as Element, 0);
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 10);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(window.getSelection().getRangeAt(0).startOffset === 25).toBe(true);
            });

            it('cursor position testing when partial list is selected and press backspace in Safari', () => {
                innerValue = `<div id="content-edit" contenteditable="true"><p>Some text before the list</p><ol><li id="firstli">First item</li><li id="secondli">Second item</li><li id="thirdli">Third item</li></ol></div>`
                startNode = editNode.querySelector('#secondli');
                endNode = editNode.querySelector('#thirdli');
                setCursorPoint(startNode.firstChild as Element, 0);
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 10);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(window.getSelection().getRangeAt(0).startOffset === 10).toBe(true);
            });

            afterAll(() => {
                detach(elem);
            });
        })

        describe('Backspace key press testing in list', () => {
            let elem: HTMLElement;
            let innerValue: string = `<div id="content-edit"><ul><li id="firstli"><br><ul><li id="sublist">sublist</li><li>sublist 2﻿﻿<br></li></ul></li></ul><div>`;
            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });
            afterEach(() => {
                detach(elem);
            });

            it(' Backspace key press at empty ul with sun list as UL', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                let sublist = editNode.querySelector('#sublist');
                expect(sublist.parentElement.tagName === 'UL').toBe(true);
                expect(sublist.parentElement.parentElement.tagName !== 'UL').toBe(true);
                innerValue = `<div id="content-edit"><ul><li id="firstli"><br><ol><li id="sublist">sublist</li><li>sublist 2﻿﻿<br></li></ol></li></ul><div>`;
            });

            it(' Backspace key press at empty ul with sun list as OL', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                let sublist = editNode.querySelector('#sublist');
                expect(sublist.parentElement.tagName === 'OL').toBe(true);
                expect(sublist.parentElement.parentElement.tagName !== 'UL').toBe(true);
                innerValue = `<div id="content-edit"><ul><li id="firstli"><br></li><ul><li id="sublist">sublist</li><li>sublist2</li></ul><li>mainlist</li></ul><div>`;
            });

            it(' Type 2 lists Backspace key press at empty ul with sun list as UL', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                let sublist = editNode.querySelector('#sublist');
                expect(sublist.parentElement.tagName === 'UL').toBe(true);
                expect(sublist.parentElement.parentElement.tagName === 'UL').toBe(true);
                innerValue = `<div id="content-edit"><ul><li id="firstli"><br></li><ol><li id="sublist">sublist</li><li>sublist2</li></ol><li>mainlist</li></ul><div>`;
            });

            it(' Type 2 lists Backspace key press at empty ul with sun list as OL', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                let sublist = editNode.querySelector('#sublist');
                expect(sublist.parentElement.tagName === 'OL').toBe(true);
                expect(sublist.parentElement.parentElement.tagName === 'UL').toBe(true);
                innerValue = `<div id="content-edit"><ul><li id="firstli"><br></li><ol><li id="sublist">sublist</li><li>sublist2</li></ol><li>mainlist</li></ul><div>`;
            });

            it('content with non empty space', () => {
                startNode = editNode.querySelector('#firstli');
                setCursorPoint(startNode, 1);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'backspace';
                keyBoardEvent.event.which = 8;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                let sublist = editNode.querySelector('#sublist');
                expect(sublist.parentElement.tagName === 'OL').toBe(true);
                expect(sublist.parentElement.parentElement.tagName !== 'UL').toBe(true);
                innerValue = `<div id="content-edit"><ul><li id="firstli">﻿<br></li><ul><li id="sublist">sublist</li><li>sublist2</li></ul><li>mainlist</li></ul><div>`;
            });

            afterAll(() => {
                detach(elem);
            });
        });
        
        describe(' UL format apply with toolbar icon, when applying the new list with UL ', () => {
            let ulFrmtHTML: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><ul style="list-style-image: none; list-style-type: circle;">

            <li>
            <p class='revertPara-1'>Testing 1</p>
            
            </li>
            
            <li>
            <p>Testing 2</p>
            </li>
            
            <li><p class='revertPara-3'>Testing 3</p></li>
            
            </ul></div>`;
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: ulFrmtHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' apply the OL format to selected "p"and revert with content with space', () => {
                startNode = editNode.querySelector('.revertPara-1');
                endNode = editNode.querySelector('.revertPara-3');
                startNode = startNode.childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 9);
                editorObj.execCommand("Lists", 'UL', null);
                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);
                startNode = editNode.querySelector('.revertPara-1');
                expect(startNode.parentElement.parentElement.hasAttribute('style')).toBe(false);
                editorObj.nodeSelection.Clear(document);
            });
            afterAll(() => {
                detach(elem);
            });
        });
        
        describe('Enter key press testing in nested list with hr and text node', () => {
            let elem: HTMLElement;
            let innerValue = `<div id="content-edit"><ol><li>List<ol><li>item<hr><p class="focusNode">items</p></li></ol></li></ol></div>`;

            beforeEach(() => {
                elem = createElement('div', {
                    id: 'dom-node', innerHTML: innerValue
                });
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            afterEach(() => {
                detach(elem);
            });

            it('961384-Unintended List Item Created After Inserting Horizontal Line in Nested List and Typing Below It', () => {
                const startNode = editNode.querySelector('.focusNode');
                setCursorPoint(startNode, 0);
                keyBoardEvent.event.shiftKey = false;
                keyBoardEvent.action = 'enter';
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);
                expect(editNode.innerHTML).toBe(`<ol><li>List<ol><li>item<hr></li><li><p class="focusNode">items</p></li></ol></li></ol>`);
            });

            afterAll(() => {
                detach(elem);
            });
        });
    });

    describe(' EJ2-29800 - Reactive form validation not working properly', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let content: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p><br></p></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let elem: HTMLElement;
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });

        it(' shift+tab key navigation to focus out of editor', () => {
            startNode = editNode.querySelector('p');
            endNode = startNode.childNodes[0] as HTMLElement;
            setCursorPoint(endNode, 0);
            keyBoardEvent.event.key = "Tab";
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            editNode.focus();
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(/[^\u0000-\u00ff]/.test(editNode.innerHTML)).toBe(false);
        });
    });

    describe(' Sublist not created when created after the tab keyaction', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: NodeListOf<HTMLLIElement>;
        let endNode: HTMLElement;
        let content: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><ol><li>Content1</li><ol><li>Content2</li></ol><li>Content3</li></ol></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, which: 9 } };
        let elem: HTMLElement;
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });

        it(' Tab key navigation to create sublist with OL', () => {
            startNode = editNode.querySelectorAll('li');
            endNode = startNode[2].firstChild as HTMLElement;
            setCursorPoint(endNode, 0);
            keyBoardEvent.event.key = "Tab";
            editNode.focus();
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(startNode[2].parentElement.childElementCount).toBe(2);
        });
    });

    describe(' Sublist not created when created after the tab keyaction', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: NodeListOf<HTMLLIElement>;
        let endNode: HTMLElement;
        let content: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><ul><li>Content1</li><ul><li>Content2</li></ul><li>Content3</li></ul></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, which: 9 } };
        let elem: HTMLElement;
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });

        it(' Tab key navigation to create sublist with UL', () => {
            startNode = editNode.querySelectorAll('li');
            endNode = startNode[2].firstChild as HTMLElement;
            setCursorPoint(endNode, 0);
            keyBoardEvent.event.key = "Tab";
            editNode.focus();
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(startNode[2].parentElement.childElementCount).toBe(2);
        });
    });
    
    describe(' Shift+tab with the sublist checking', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: NodeListOf<HTMLLIElement>;
        let endNode: HTMLElement;
        let content: string = `<div style=\"color:red;\" id=\"content-edit\" contenteditable=\"true\" class=\"e-node-deletable e-node-inner\"><ol><li>content1</li><ol><li>content2</li></ol><li>content3</li></ol></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let elem: HTMLElement;
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });

        it(' shift+tab key to revert the list to main OL', () => {
            startNode = editNode.querySelectorAll('li');
            endNode = startNode[1].firstChild as HTMLElement;
            setCursorPoint(endNode, 0);
            keyBoardEvent.event.key = "Tab";
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            editNode.focus();
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(startNode[2].parentElement.childElementCount).toBe(3);
        });
    });

    describe(' Shift+tab with the sublist checking', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: NodeListOf<HTMLLIElement>;
        let endNode: HTMLElement;
        let content: string = `<div style=\"color:red;\" id=\"content-edit\" contenteditable=\"true\" class=\"e-node-deletable e-node-inner\"><ul><li>content1</li><ul><li>content2</li></ul><li>content3</li></ul></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let elem: HTMLElement;
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });

        it(' shift+tab key to revert the list to main UL', () => {
            startNode = editNode.querySelectorAll('li');
            endNode = startNode[1].firstChild as HTMLElement;
            setCursorPoint(endNode, 0);
            keyBoardEvent.event.key = "Tab";
            keyBoardEvent.event.which = 9;
            keyBoardEvent.event.shiftKey = true;
            editNode.focus();
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(startNode[2].parentElement.childElementCount).toBe(3);
        });

        afterAll(() => {
            detach(elem);
        });
    });

    describe('EJ2-45885 - Bold with list to Backspace key press testing', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><p><strong>&#8203;Test</strong><br></p><ul><li><strong id="strongEle">&#65279;&#65279;<br></strong></li></ul><div>`;
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: innerValue
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
            detach(elem);
        });

        it(' List next to paragraph tag', () => {
            startNode = editNode.querySelector('#strongEle');
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'backspace';
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let liNode: Element = editNode.querySelector('li');
            expect(isNullOrUndefined(liNode)).toBe(true);
            innerValue = `<div id="content-edit" contenteditable="true"><ul><li><strong id="strongEle">&#8203;</strong><br></li></ul><div>`;
        });

        it(' list tag alone', () => {
            startNode = editNode.querySelector('#strongEle');
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'backspace';
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let liNode: Element = editNode.querySelector('li');
            expect(isNullOrUndefined(liNode)).toBe(true);
            innerValue = `<div id="content-edit" contenteditable="true"><ol><li class="startNode">List Element 1</li><li class="endNode">List Element 2</li></ol><div>`;
        });
        
        it(' EJ2-60036 - List all selection', () => {
            startNode = editNode.querySelector('.startNode');
            endNode = editNode.querySelector('.endNode');
            editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 14);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'backspace';
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let liNode: Element = editNode.querySelector('li');
            expect(isNullOrUndefined(liNode)).toBe(true);
        });

        afterAll(() => {
            detach(elem);
        });
    });
    describe('934046: Nested list content is not cleaned up when backspace is pressed', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement;
        let keyBoardEvent: any = {
            callBack: function () { }, 
            event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: null }
        };
        beforeAll(() => {
            elem = createElement('div', { id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p><br></p></div>` });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });
        it('should handle nested list creation and cleanup correctly', () => {
            editNode.innerHTML = '<ol><li style="list-style-type: none;"><ol><li class="focusNode"> </li></ol></li></ol>';
            startNode = editNode.querySelector('.focusNode');
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.event.key = "Backspace";
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(editNode.querySelector('ol')).toBeNull();
        });
    });
    describe('940241: Backspace behaves like Shift+Tab at the start of an indented list', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement;
        let keyBoardEvent: any = {
            callBack: function () { }, 
            event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: null }
        };
        beforeAll(() => {
            elem = createElement('div', { id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><p><br></p></div>` });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });
        it('Backspace behaves like Shift+Tab at the start of an indented list', () => {
            editNode.innerHTML = '<ol><li style="list-style-type: none;"><ol><li style="list-style-type: none;"><ol><li class="focusNode">Test1</li><li>Test2</li><li>Test3</li></ol></li></ol></li></ol>';
            startNode = editNode.querySelector('.focusNode');
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.event.key = "Backspace";
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(editNode.querySelector('.focusNode').innerHTML).toBe('Test1<ol><li>Test2</li><li>Test3</li></ol>');
        });
    });
    describe('EJ2-58466 - list with font size Backspace key press testing', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><ol><li style="font-size: 24pt;" class="focusNode"><br></li><li style="font-size: 24pt;"><span style="font-size: 24pt;">RTE Content 2</span></li></ol><div>`;
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: innerValue
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });

        it(' backspace keypress after font size changed in the first list with empty content changes the font size', () => {
            startNode = editNode.querySelector('.focusNode');
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'backspace';
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(document.contains(startNode)).toBe(false);
            const liNodes: NodeListOf<HTMLElement> = editNode.querySelectorAll('li');
            expect(liNodes.length).toBe(1);

        });
    });
    
    describe(' BLAZ-26675 - Audio getting deleted after Inserting into a list and Pressing enter', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><ol> <li><span class="e-audio-wrap" contenteditable="false"><span class="e-clickelem"><audio controls="" class="e-rte-audio e-audio-inline"><source src="https://assets.mixkit.co/sfx/preview/mixkit-rain-and-thunder-storm-2390.mp3" type="audio/mp3"></audio></span></span> </li> </ol> <div>`;
        beforeAll( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterAll( () => {
            detach( elem );
        } );

        it( 'Checking Enter action for the Audio Element inside the list when cursor next to Audio Element', () => {
            startNode = editNode.querySelector( 'li' );
            editorObj.nodeSelection.setCursorPoint( document, startNode, 0 );
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            ( editorObj as any ).editorKeyDown( keyBoardEvent );
            let audioElem: Element = editNode.querySelectorAll( 'AUDIO' )[0];
            expect( audioElem != null ).toBe( true );
        } );
    });

    describe( 'Pressing enter with Web Video inside List Element', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><ol> <li><span class="e-video-wrap" contenteditable="false" title="movie.mp4"><video class="e-rte-video e-video-inline" controls="" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"><source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"></video></span></li> </ol> <div>`;
        beforeAll( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterAll( () => {
            detach( elem );
        } );

        it( 'Checking Enter action for the Web Video Element inside the list when cursor next to Video Element', () => {
            startNode = editNode.querySelector( 'li' );
            editorObj.nodeSelection.setCursorPoint( document, startNode, 0 );
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            ( editorObj as any ).editorKeyDown( keyBoardEvent );
            let videoElem: Element = editNode.querySelectorAll( 'VIDEO' )[0];
            expect( videoElem != null ).toBe( true );
        } );
    });

    describe( 'Pressing enter with Embed Video inside List Element', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><ol> <li><span class="e-embed-video-wrap" contenteditable="false"><span class="e-video-clickelem"><iframe width="auto" height="auto" src="https://www.youtube.com/embed/jrV-fJXAXwY?controls=0" title="YouTube video player" style="min-width: 0px; max-width: 1472px; min-height: 0px; outline: rgb(74, 144, 226) solid 2px;" class="e-resize e-video-focus"></iframe></span></span></li> </ol> <div>`;
        beforeAll( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterAll( () => {
            detach( elem );
        } );

        it( 'Checking Enter action for the Embed Video Element inside the list when cursor next to Video Element', () => {
            startNode = editNode.querySelector( 'li' );
            editorObj.nodeSelection.setCursorPoint( document, startNode, 0 );
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            ( editorObj as any ).editorKeyDown( keyBoardEvent );
            let iFrameElem: Element = editNode.querySelectorAll( 'IFRAME' )[0];
            expect( iFrameElem != null ).toBe( true );
        } );
    });

    describe( 'Pressing enter with Image inside List Element', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><ol> <li><img src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" class="e-rte-image e-imginline e-img-focus" alt="test.png" width="auto" height="auto" style="min-width: 0px; max-width: 1455px; min-height: 0px;"></li> </ol> <div>`;
        beforeAll( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterAll( () => {
            detach( elem );
        } );

        it( 'Checking Enter action for the Image Element inside the list when cursor next to Image Element', () => {
            startNode = editNode.querySelector( 'li' );
            editorObj.nodeSelection.setCursorPoint( document, startNode, 0 );
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            ( editorObj as any ).editorKeyDown( keyBoardEvent );
            let imgElem: Element = editNode.querySelectorAll( 'IMG' )[0];
            expect( imgElem != null ).toBe( true );
        } );
    });

    describe('874955 - List style type got changed when we try to remove a single list in RichTextEditor', () => {
        let elem: HTMLElement;
        let editorObj: RichTextEditor;
        let endNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8};
        beforeEach(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<ol style="list-style-image: none; list-style-type: upper-alpha;"><li>richtexteditor</li><li>richtexteditor</li><li>richtexteditor</li><li>richtexteditor</li><li>richtexteditor</li></ol>`
            });
        });
        afterEach( () => {
            destroy(editorObj);
        } );

        it( 'Check the list style type changing after revert the single list', () => {
            startNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[1];
            endNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[1];
            editorObj.formatter.editorManager.nodeSelection.setSelectionText( document, startNode,endNode,1,1 );
            let numberlist: HTMLElement = editorObj.getToolbar().querySelector('[title="Numbered List (Ctrl+Shift+O)"]');
            numberlist.click();
            let result: string = `<ol style="list-style-image: none; list-style-type: upper-alpha;"><li>richtexteditor</li></ol><p>richtexteditor</p><ol style="list-style-image: none; list-style-type: upper-alpha;"><li>richtexteditor</li><li>richtexteditor</li><li>richtexteditor</li></ol>`
            expect(editorObj.inputElement.innerHTML === result).toBe( true);
        } );
        it('Clear all content using backspace', () => {
            startNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[0];
            endNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[4];
            editorObj.formatter.editorManager.nodeSelection.setSelectionText( document, startNode.firstChild,endNode,0,1 );
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            expect(editorObj.inputElement.innerHTML === '').toBe( true);
        });
        it('Clear all content using delete', () => {
            startNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[0];
            endNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[4];
            editorObj.formatter.editorManager.nodeSelection.setSelectionText( document, startNode.firstChild,endNode,0,1 );
            keyBoardEvent.keyCode = 46;
            keyBoardEvent.code = 'delete';
            (editorObj as any).keyDown(keyBoardEvent);
            expect(editorObj.inputElement.innerHTML === '').toBe( true);
        });
        it('Clear all content using Cut', () => {
            startNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[0];
            endNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[4];
            editorObj.formatter.editorManager.nodeSelection.setSelectionText( document, startNode.firstChild,endNode,0,1 );
            keyBoardEvent.keyCode = 88;
            keyBoardEvent.code = 'cut';
            (editorObj as any).keyDown(keyBoardEvent);
            expect(editorObj.inputElement.innerHTML === '').toBe( true);
        });
        it('remove the single letter using backspace', () => {
            editorObj.value = `<ol><li>rte</li><li>rte</li></ol>`;
            editorObj.dataBind();
            startNode = editorObj.inputElement.querySelector( 'ol' ).querySelectorAll('li')[0];
            editorObj.formatter.editorManager.nodeSelection.setSelectionText( document, startNode.firstChild,startNode.firstChild,2,3);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            expect(startNode.textContent === 'rt').toBe( true);
        });
    });

    describe('883337 - List type got changed for Nested list while applying increase indents in RichTextEditor.', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<p><br></p><ol style="list-style-image: none; list-style-type: upper-alpha;">
                <li>Test 1</li>
                <ol style="list-style-image: none; list-style-type: upper-alpha;">
                  <li>test 2</li>
                  <li>test 3</li>
                  <li>test 4</li>
                </ol>
                <li>test 5</li>
                <li>test 6</li>
              </ol>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Select the entire list and apply the indent.', (done) => {
            let startNode = editorObj.inputElement.querySelector('ol');
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstElementChild, startNode.lastElementChild, 0, 1);
            editorObj.executeCommand('indent');
            setTimeout(() => {
                expect(startNode.firstElementChild.querySelector("ol").style.listStyleType === 'upper-alpha').toBe(true);
                done();
            }, 100);
        });
    });

    describe('Nested list while applying increase indents in RichTextEditor.', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Enter key at the end of the nested list', (done) => {
            editorObj.inputElement.innerHTML = `<ol style="list-style-image: none; list-style-type: upper-alpha;">
                <li>Test 1</li>
                <li>test 5</li>
                <li>test 6</li>
              </ol>`;
            let startNode = editorObj.inputElement.querySelector('ol');
            let listElement = document.createElement("ol");
            listElement.innerHTML = "<li>Rich Text Editor</li>";
            startNode.appendChild(listElement);
            let keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 13,
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                char: '',
                key: ':',
                charCode: 13,
                which: 13,
                code: 'Enter',
                action: 'Enter',
                type: 'Enter',
                target: listElement.querySelector("LI")
            };
            (editorObj as any).keyUp(keyboardEventArgs);
            setTimeout(() => {
                expect(listElement.parentElement.nodeName === 'LI').toBe(true);
                done();
            }, 100);
        });
    });  

    describe('962722 - Fails to retain bold style on specific list items when switching between bullet and number lists', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<p><strong>Insert Images:</strong> Upload images from local storage or provide an image URL.</p>
        <p><strong>Resize &amp; Drag:</strong> Easily adjust image dimensions and reposition them within the content.</p>
        <p><strong>Align Images:</strong> Set images to align <strong>left, center, or right</strong>.</p>
        <p><strong>Caption Support:</strong> Add captions to describe your images.</p>
        <p><strong>Replace &amp; Remove:</strong> Change or delete images as needed.</p>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Apply ordered list and check for the bold style', (done) => {
            const paragraphs = editorObj.inputElement.querySelectorAll('p');
            const firstParagraph = paragraphs[0];
            const lastParagraph = paragraphs[paragraphs.length - 1];
            // Select all <p> elements
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, firstParagraph, lastParagraph, 0, 1);
            (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(() => {
                expect(editorObj.inputElement.innerHTML === `<ol><li><strong>Insert Images:</strong> Upload images from local storage or provide an image URL.</li><li><strong>Resize &amp; Drag:</strong> Easily adjust image dimensions and reposition them within the content.</li><li><strong>Align Images:</strong> Set images to align <strong>left, center, or right</strong>.</li><li><strong>Caption Support:</strong> Add captions to describe your images.</li><li><strong>Replace &amp; Remove:</strong> Change or delete images as needed.</li></ol>`).toBe(true);
                done();
            }, 100);
        });
    });

    describe('926563 - Decrease Indent Format Applied to Paragraph Format, After Reverting a List for Selected Combination of Heading and Paragraph Format with Increase Indent Format.', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<ul style="margin-left: 80px;">
                <li class="list1">Rich Text Editor 1</li>
                <li style="">Rich Text Editor 2</li>
                <li class="list2">Rich Text Editor 3</li>
                </ul>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Press the unordered list toolbar item to revert the list.', (done) => {
            let startNode = editorObj.inputElement.querySelector('.list1');
            let endNode = editorObj.inputElement.querySelector('.list2');
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 5);
            (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
            setTimeout(() => {
                expect(editorObj.inputElement.innerHTML === `<p style="margin-left: 80px;" class="list1">Rich Text Editor 1</p><p style="margin-left: 80px;">Rich Text Editor 2</p><p style="margin-left: 80px;" class="list2">Rich Text Editor 3</p>`).toBe(true);
                done();
            }, 100);
        });
    });

    describe('914728 - Cut and pasting list not working properly in rich text editor', () => {
        let editorObj: RichTextEditor;
        let endNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'x', stopPropagation: () => { }, shiftKey: false, which: 88};
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<p><b>Key features:</b></p><ul><li><p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p></li><li><p>Capable of handling markdown editing.</p></li><li><p>Contains a modular library to load the necessary functionality on demand.</p></li><li><p>Provides a fully customizable toolbar.</p></li><li><p>Provides HTML view to edit the source directly for developers.</p></li><li><p>Supports third-party library integration.</p></li><li><p>Allows a preview of modified content before saving it.</p></li><li><p>Handles images, hyperlinks, video, hyperlinks, uploads, etc.</p></li><li><p>Contains undo/redo manager.</p></li><li><p>Creates bulleted and numbered lists.</p></li></ul>`
            });
        });
        afterAll( () => {
            destroy(editorObj);
        } );
        it('Cut and paste the first line', (done) => {
            startNode = editorObj.inputElement.querySelector( 'ul' ).querySelectorAll('li')[0];
            let textNode = startNode.firstChild;
            editorObj.formatter.editorManager.nodeSelection.setSelectionText( document, textNode, textNode, 0, 1);
            keyBoardEvent.keyCode = 88;
            keyBoardEvent.code = 'cut';
            (editorObj as any).keyDown(keyBoardEvent);
            keyBoardEvent.action = "paste";
            (editorObj as any).onPaste(keyBoardEvent);
            setTimeout(() => {
                expect(editorObj.inputElement.innerHTML === '<p><b>Key features:</b></p><ul><li>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</li><li>Capable of handling markdown editing.</li><li>Contains a modular library to load the necessary functionality on demand.</li><li>Provides a fully customizable toolbar.</li><li>Provides HTML view to edit the source directly for developers.</li><li>Supports third-party library integration.</li><li>Allows a preview of modified content before saving it.</li><li>Handles images, hyperlinks, video, hyperlinks, uploads, etc.</li><li>Contains undo/redo manager.</li><li>Creates bulleted and numbered lists.</li></ul>').toBe(true);
                done();
            }, 100);
        });
        
    });

    describe('939676 - Backspace is not working correctly in complex list structures.', () => {
        let editorObj: RichTextEditor;
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        beforeEach((done) => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<ol><li>list1<ol><li>list 2<ol><li class="listElem">list 3<ol><li>list 4</li><li>list 5</li></ol></li><li>list 3.1</li></ol></li><li>list 2.1</li></ol></li><li class="liSibilingElem">list 1.1<ol><li>list 1.1.1</li><li>list 1.1.2</li></ol></li></ol>`
            });
            done();
        });
        afterEach((done) => {
            destroy(editorObj);
            done();
        });
        it('should move nested list item content to parent when backspace is pressed at start', (done) => {
            let startNode = editorObj.inputElement.querySelector('.listElem');
            setCursorPoint(startNode.firstChild as Element, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            expect(window.getSelection().getRangeAt(0).startContainer.parentElement.innerHTML === 'list 2list 3<ol><li>list 4</li><li>list 5</li><li>list 3.1</li></ol>').toBe(true);
            setCursorPoint(window.getSelection().getRangeAt(0).startContainer.parentElement.firstChild as Element, 0);
            (editorObj as any).keyDown(keyBoardEvent);
            expect(window.getSelection().getRangeAt(0).startContainer.parentElement.innerHTML === 'list1list 2list 3<ol><li>list 4</li><li>list 5</li><li>list 3.1</li><li>list 2.1</li></ol>').toBe(true);
            done();
        });
        it('should merge list items when backspace is pressed at the start of a top-level item', (done) => {
            let startNode = editorObj.inputElement.querySelector('.liSibilingElem');
            setCursorPoint(startNode.firstChild as Element, 0);
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            expect(window.getSelection().getRangeAt(0).startContainer.parentElement.innerHTML === 'list 2.1list 1.1').toBe(true);
            expect(editorObj.inputElement.querySelector("OL").childNodes.length === 3).toBe(true);
            done();
        });
    });

    describe('939650 - List is created at the last cell of the table instead of the intended position in Mac Safari browser', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                enterKey: 'BR',
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><br>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('should create a list wrapping the entire table and then remove it when toggled', (done) => {
            let startNode = editorObj.inputElement;
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, 0);
            (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
            expect(editorObj.inputElement.querySelector("ul").firstChild.firstChild.nodeName === 'TABLE').toBe(true);
            let elements = editorObj.inputElement.querySelector("ul");
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, elements, elements, 0, 0);
            (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
            expect(editorObj.inputElement.querySelector("ul")).toBe(null);
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 1, 1);
            (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
            setTimeout(() => {
                expect(editorObj.inputElement.querySelector("ul").firstChild.firstChild.nodeName === 'TABLE').toBe(true);
                done();
            }, 100);
        });
    });

    describe('935455 - Empty List Deletion When Selecting Text and Pressing Delete Key', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<p><br></p><ol>
                  <li>test 2</li>
                  <li>test 3</li>
                  <li>test 4</li><li><br></li>
                </ol>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Press the Backspace key on the list and check that the empty <li> element is not removed.', (done) => {
            let startNode = editorObj.inputElement.querySelector('ol');
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstElementChild.firstChild, startNode.firstElementChild.firstChild, 3, 5);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            setTimeout(() => {
                expect(editorObj.inputElement.querySelector("ol").lastElementChild.nodeName === 'LI').toBe(true);
                expect(editorObj.inputElement.querySelector("ol").lastElementChild.textContent === '').toBe(true);
                done();
            }, 100);
        });
    });

    describe('941893 - After inserting the table in a list and pressing enter key leads to delete the whole list and table', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let elem: HTMLElement;
        let innerValue: string = `<div id=\"content-edit\"><ol><li><table class=\"e-rte-table\" style=\"width: 100%; min-width: 0px;\"><tbody><tr><td style=\"width: 50%;\"><br></td><td style=\"width: 50%;\"><br></td></tr><tr><td style=\"width: 50%;\"><br></td><td style=\"width: 50%;\"><br></td></tr></tbody></table></li></ol></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };
        beforeAll(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: innerValue
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterAll(() => {
            detach(elem);
        });
        it('Place cursor after the table, press Enter key, and ensure list structure is maintained.', (done) => {
            let table: HTMLElement = editNode.querySelector('table');
            setCursorPoint(table, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(editNode.querySelector('table')).not.toBeNull();
            done();
        });
    });

    describe('EJ2-939668 - Empty list is not reverted when pressing Enter key', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };
        let elem: HTMLElement;
        let innerValue: string = `<div id="content-edit"><p><b>Key features:</b></p><ul><li><p>Provides &lt;IFRAME&gt; and &lt;DIV&gt; modes</p><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li id="firstli"><p><br></p><ul><li><p>Capable of handling markdown editing.</p></li></ul></li></ul></li></ul></li></ul></li><li><p>Contains a modular library to load the necessary functionality on demand.</p></li><li><p>Provides a fully customizable toolbar.</p></li><li><p>Provides HTML view to edit the source directly for developers.</p></li><li><p>Supports third-party library integration.</p></li><li><p>Allows a preview of modified content before saving it.</p></li><li><p>Handles images, hyperlinks, video, hyperlinks, uploads, etc.</p></li><li><p>Contains undo/redo manager.</p></li><li><p>Creates bulleted and numbered lists.</p></li></ul></div>`;        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: innerValue
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
            detach(elem);
        });

        it(' Empty list is reverted after pressing the Enter key', () => {
            startNode = editNode.querySelector('#firstli');
            startNode = startNode.childNodes[0] as HTMLElement;
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(editNode.querySelectorAll('#firstli').length === 6).toBe(true);
        });

        afterAll(() => {
            detach(elem);
        });
    });

    describe('EJ2-949708 - Pressing the Enter key at the end of the list causes the list to revert.', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };
        let elem: HTMLElement;
        let innerValue: string = `<div id="content-edit"><p><br></p><p>Need to reconsider story points for the task. The task took more time than the planned estimate due to the following reasons.</p><ol><li id="firstli">Moved the editor application into the ej2-richtexteditor-third-party-test repository.<br></li><li>Set up Jenkins pipeline configuration with appropriate build stages. Getting PR status to success required checking with Core team and then found the solution of adding Starting Ci compile and then Finished Ci compile text.<br></li><li>Created a gulp task with latest AWS SDK. Since the older sdk is deprecated might cause security issues since its not maintained.</li><li>Resolved configuration related to region with Latest SDK.</li></ol><p><br></p></div>`;        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: innerValue
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
            detach(elem);
        });

        it(' Pressing the Enter key at the end of the list causes the list to revert', () => {
            startNode = editNode.querySelector('#firstli');
            startNode = startNode.childNodes[0] as HTMLElement;
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'enter';
            keyBoardEvent.event.which = 13;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(editNode.querySelector('#firstli').tagName).toBe('LI');
        });

        afterAll(() => {
            detach(elem);
        });
    });
    describe('942860 - Rich Text Editor - Inline Code Formatting Reverts in Nested Lists', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<ol>
                  <li>test 2</li>
                  <li>t<span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;">est 3</span></span></em></strong></span></span></li><li><span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;" class="targetElem"><br></span></span></em></strong></span></span></li>
                </ol>`
            });
        });
        afterAll((done) => {
            destroy(editorObj);
            done();
        });
        it('Should retain formatting when pressing enter key at the last list item', (done) => {
            let startNode = editorObj.inputElement.querySelector('.targetElem');
            editorObj.formatter.editorManager.nodeSelection.setCursorPoint(document, startNode, 0);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.code = 'Enter';
            keyBoardEvent.action = 'enter';
            keyBoardEvent.which = 13;
            (editorObj as any).keyDown(keyBoardEvent);
            expect(editorObj.inputElement.querySelector('OL').nextElementSibling != null).toBe(true);
            expect((editorObj as any).inputElement.querySelector('OL').nextElementSibling.innerHTML === `<span style="background-color: rgb(255, 255, 0);"><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><strong><em><span style="text-decoration: underline;"><span style="text-decoration: line-through;" class="targetElem"><br></span></span></em></strong></span></span>`).toBe(true);
            editorObj.enterKey = 'BR';
            editorObj.dataBind();
            editorObj.value = `<ol><li>Rich text Editor</li><li><br></li></ol>`;
            editorObj.dataBind();
            editorObj.formatter.editorManager.nodeSelection.setCursorPoint(document, editorObj.inputElement.querySelectorAll('OL LI')[1], 0);
            (editorObj as any).keyDown(keyBoardEvent);
            expect(editorObj.inputElement.innerHTML === '<ol><li>Rich text Editor</li></ol><br>').toBe(true);
            expect(editorObj.inputElement.querySelector('OL').nextElementSibling.nodeName === 'BR').toBe(true);
            done();
        });
    });
    describe('EJ2-941211 - Numbered List Not Applied Properly After Reverting Bullet List', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true"><h1 class="startFocus">Welcome to the Syncfusion Rich Text Editor</h1><p class="endFocus">The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</p></div>`
        });
        beforeAll(() => {
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        it(' Numbered List applied properly after reverting Bullet List', () => {
            startNode = editNode.querySelector('.startFocus');
            endNode = editNode.querySelector('.endFocus');
            startNode = editNode as HTMLElement;
            editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 0);
            let execValue: any = {listStyle: "disc", type : "BulletFormatList"};
            editorObj.execCommand("Lists", 'BulletFormatList', null, null, 'disc', execValue);
            editorObj.execCommand("Lists", 'UL', null);
            editorObj.execCommand("Lists", 'OL', null);
            expect(elem.innerHTML === '<div id="content-edit" contenteditable="true"><ol><li class="startFocus"><h1 class="startFocus">Welcome to the Syncfusion Rich Text Editor</h1></li><li class="endFocus">The Rich Text Editor, a WYSIWYG (what you see is what you get) editor, is a user interface that allows you to create, edit, and format rich text content. You can try out a demo of this editor here.</li></ol></div>').toBe(true);
        });
        afterAll(() => {
            detach(elem);
        });
    });

    describe('Tab key press testing in nested list', function () {
        let elem: HTMLElement;
        const innerValue: string = "<div id=\"content-edit\"><ul><li>Basic features&nbsp;&nbsp;&nbsp;&nbsp; include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li class=\"focusNode\">The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li></ul></div>";
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };
    
        beforeEach(function () {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: innerValue
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") as HTMLElement });
            editNode = editorObj.editableElement as HTMLElement;
        });
    
        afterEach(function () {
           detach(elem);
        });
    
        it('Tab key press sequence testing', function () {
            startNode = editNode.querySelector('.focusNode') as HTMLElement;
            setCursorPoint(startNode, 0);
            keyBoardEvent.action = 'tab';
            keyBoardEvent.event.which = 9;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            startNode = editNode.querySelector('li') as HTMLElement;
            setCursorPoint(startNode, 0);
            (editorObj as any).editorKeyDown(keyBoardEvent);
            expect(editNode.innerText).toEqual('Basic features     include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.\nThe toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.');
        });
    
        afterAll(function () {
           detach(elem);
        });
    });
    

    describe('945493 - Backspace on second line of first list reverts the list.', ()=> {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn)=> {
            editor = renderRTE({
                value: `<ul><li><span>Content</span><br><span>Second Content</span><br></li><li>Second list content</li></ul>`
            });
            done();
        });
        afterEach((done: DoneFn)=> {
            destroy(editor);
            done();
        });
        it('Should perform backspace action on first line of the first list item.', (done: DoneFn)=> {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.querySelector('li').firstChild.firstChild, 0);
            range.collapse(true);
            editor.selectRange(range);
            const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            expect(editor.inputElement.querySelectorAll('li').length).toBe(2);
            editor.inputElement.dispatchEvent(backspaceEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(1);
                done();
            }, 100);
        });

        it('Should not perform backspace action on second line of the first list item.', (done: DoneFn)=> {
            editor.focusIn();
            const range: Range = new Range();
            range.setStart(editor.inputElement.querySelector('li').childNodes[2].firstChild, 0);
            range.collapse(true);
            editor.selectRange(range);
            const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
            expect(editor.inputElement.querySelectorAll('li').length).toBe(2);
            editor.inputElement.dispatchEvent(backspaceEvent);
            setTimeout(() => {
                expect(editor.inputElement.querySelectorAll('li').length).toBe(2);
                done();
            }, 100);
        });
    });
    describe('List functionality in readonly mode', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: `Rich Text Editor`,
                toolbarSettings: {
                    items: ['NumberFormatList', 'UnorderedList']
                },
                readonly: true
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });
        it('should not show dropdown when list button is clicked in readonly mode', (done: DoneFn) => {
            editor.focusIn();
            const toolbar: Element = editor.element.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[0];
            //Modified rendering from dropdown to split button
            const button: Element = toolbar.querySelector('#' + editor.getID() + '_toolbar_NumberFormatList').parentElement;
            (button as HTMLElement).style.width = '50px';
            (button as HTMLElement).style.height = '50px';
            (button as HTMLElement).click();
            setTimeout(() => {
                expect(editor.element.querySelector('.e-popup-open')).toBe(null);
                done();
            }, 100);
        });
    });
    describe('List Split functionality', () => {
        let editor: RichTextEditor;
        beforeEach((done: DoneFn) => {
            editor = renderRTE({
                value: `<ul><li>Rich Text Editor 1</li><li>Rich Text Editor 2</li><li>Rich Text Editor 3</li><li>Rich Text Editor 4</li></ul>`,
                toolbarSettings: {
                    items: ['NumberFormatList', 'UnorderedList']
                }
            });
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(editor);
            done();
        });

        it('should split the unordered list to ordered list for the selected list items', (done: DoneFn) => {
            editor.focusIn();
            const editorEle: Element = editor.contentModule.getEditPanel();
            const start = editorEle.querySelectorAll('li')[0].firstChild;
            const end = editorEle.querySelectorAll('li')[2].firstChild;
            expect(editorEle.querySelectorAll('ol').length === 0).toBe(true);
            editor.formatter.editorManager.nodeSelection.setSelectionText(document, start, end, 0, 5);
            const toolbar: Element = editor.element.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[0];
            const button: Element = toolbar.querySelector('#' + editor.getID() + '_toolbar_NumberFormatList');
            (button as HTMLElement).click();
            setTimeout(() => {
                const lists = editorEle.querySelectorAll('ol');
                expect(lists.length).toBeGreaterThan(0);
                expect(editorEle.querySelectorAll('ul').length).toBe(1);
                expect(editorEle.querySelectorAll('ol')[0].nextElementSibling.nodeName === 'UL').toBe(true);
                done();
            }, 10);
        });
        it('should split the unordered list to ordered list when selection is within a single list item', (done: DoneFn) => {
            editor.focusIn();
            const editorEle: Element = editor.contentModule.getEditPanel();
            editorEle.innerHTML = `<ul><li>Rich Text Editor 1</li><li>Rich Text Editor 2</li><li>Rich Text Editor 3</li></ul>`;
            const start = editorEle.querySelectorAll('li')[1].firstChild;
            const end = editorEle.querySelectorAll('li')[1].firstChild;
            expect(editorEle.querySelectorAll('ol').length === 0).toBe(true);
            editor.formatter.editorManager.nodeSelection.setSelectionText(document, start, end, 2, 5);
            const toolbar: Element = editor.element.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[0];
            const button: Element = toolbar.querySelector('#' + editor.getID() + '_toolbar_NumberFormatList');
            (button as HTMLElement).click();
            setTimeout(() => {
                const unorderList = editorEle.querySelectorAll('ul')[0];
                expect(unorderList.nextElementSibling.nodeName === 'OL').toBe(true);
                expect(unorderList.nextElementSibling.nextElementSibling.nodeName === 'UL').toBe(true);
                const lists = editorEle.querySelectorAll('ol');
                expect(lists.length).toBeGreaterThan(0);
                done();
            }, 10);
        });
        it('should convert the entire list when the cursor is positioned within a list item', (done: DoneFn) => {
            editor.focusIn();
            const editorEle: Element = editor.contentModule.getEditPanel();
            editorEle.innerHTML = `<ul><li>Rich Text Editor 1</li><li>Rich Text Editor 2</li><li>Rich Text Editor 3</li></ul>`;
            const start = editorEle.querySelectorAll('li')[1].firstChild;
            expect(editorEle.querySelectorAll('ol').length === 0).toBe(true);
            setCursorPoint(start as Element, 4);
            const toolbar: Element = editor.element.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[0];
            const button: Element = toolbar.querySelector('#' + editor.getID() + '_toolbar_NumberFormatList');
            (button as HTMLElement).click();
            setTimeout(() => {
                expect(editorEle.querySelectorAll('ul').length === 0).toBe(true);
                const lists = editorEle.querySelectorAll('ol');
                expect(lists.length).toBe(1);
                done();
            }, 10);
        });
        it('should convert nested lists that are within the selection range', (done: DoneFn) => {
            editor.focusIn();
            const editorEle: Element = editor.contentModule.getEditPanel();
            editorEle.innerHTML = `<ul><li class="start">Rich Text Editor 1<ul><li>Rich&nbsp;<ul><li class="end">Text<ul><li>Editor 2</li></ul></li></ul></li></ul></li><li>Rich Text Editor 3</li></ul>`;
            expect(editorEle.querySelectorAll('ol').length === 0).toBe(true);
            const start = editorEle.querySelector('.start').firstChild;
            const end = editorEle.querySelector('.end').firstChild;
            editor.formatter.editorManager.nodeSelection.setSelectionText(document, start, end, 2, 4);
            const toolbar: Element = editor.element.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[0];
            const button: Element = toolbar.querySelector('#' + editor.getID() + '_toolbar_NumberFormatList');
            (button as HTMLElement).click();
            setTimeout(() => {
                expect(editorEle.querySelectorAll('ol').length === 3).toBe(true);
                const lists = editorEle.querySelector('ol');
                expect(lists.nextElementSibling.nodeName).toBe('UL');
                expect(editorEle.innerHTML === '<ol><li class="start">Rich Text Editor 1<ol><li>Rich&nbsp;<ol><li class="end">Text<ul><li>Editor 2</li></ul></li></ol></li></ol></li></ol><ul><li>Rich Text Editor 3</li></ul>');
                done();
            }, 10);
        });
        it('should convert only the selected nested list without affecting parent lists', (done: DoneFn) => {
            editor.focusIn();
            const editorEle: Element = editor.contentModule.getEditPanel();
            editorEle.innerHTML = `<ol><li>Rich 1<ol><li class="start">Rich 1.1</li><li class="end">Rich&nbsp; 1.2</li></ol></li><li>Rich 2</li></ol>`;
            expect(editorEle.querySelectorAll('ul').length === 0).toBe(true);
            const start = editorEle.querySelector('.start').firstChild;
            const end = editorEle.querySelector('.end').firstChild;
            editor.formatter.editorManager.nodeSelection.setSelectionText(document, start, end, 2, 4);
            const toolbar: Element = editor.element.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[1];
            const button: Element = toolbar.querySelector('#' + editor.getID() + '_toolbar_UnorderedList');
            (button as HTMLElement).click();
            setTimeout(() => {
                expect(editorEle.querySelectorAll('ol').length === 1).toBe(true);
                expect(editorEle.innerHTML === '<ol><li>Rich 1<ul><li class="start">Rich 1.1</li><li class="end">Rich&nbsp; 1.2</li></ul></li><li>Rich 2</li></ol>').toBe(true);
                done();
            }, 10);
        });
    });

      describe('956972 - Rich Text Editor Issues with Delete action When List Is at the End', () => {
        let editorObj: RichTextEditor;
        beforeAll(() => {
            editorObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<p>
                    <span>
                        <span class="start">dasdas sadsa s asdasdsa as dsad </span>
                        <br>
                    </span>
                </p>
                <ol>
                    <li style="font-style: normal;">
                        <span><i> </i>dasdsadasd</span>
                    </li>
                    <li style="font-style: normal;">
                        <span>
                            <span style="font-size: inherit;">dasdsadas</span>
                            <br>
                        </span>
                    </li>
                </ol>
                <p>
                    <span>dsadsadas d asdsadsad sadasd</span>
                </p>
                <p>
                    <span>
                        <span>
                            <span style="font-size: inherit;">dsadsadsadasasasdsa d sadas dasdas</span>
                        </span>
                    </span>
                </p>
                <p>
                    <span>
                        <span>
                            <span style="font-size: inherit;">
                                <span>dsa sad sadasd:</span>
                                <br>
                            </span>
                        </span>
                    </span>
                </p>
                <ol>
                    <li style="font-style: normal;">
                        <span>dsadassa</span>
                    </li>
                    <li style="font-style: normal;">
                        <span>
                            <span style="font-size: inherit;">dsadsadsa dsa as dasdsa</span>
                            <br>
                        </span>
                    </li>
                    <li style="font-style: normal;">
                        <span>
                            <span style="font-size: inherit;">
                                <span>dsa asdsa  ad as</span>
                                <br>
                            </span>
                        </span>
                    </li>
                    <li style="font-style: normal;">
                        <span>
                            <span style="font-size: inherit;">
                                <span>
                                    <span>
                                        <i>das das dasda dasda</i>
                                    </span>
                                    <br>
                                </span>
                            </span>
                        </span>
                    </li>
                    <li style="font-style: normal;">
                        <span>
                            <span style="font-size: inherit;">
                                <span>
                                    <span>
                                        <p style="margin:0cm;font-size:12.0pt;font-family:&quot;Aptos&quot;,sans-serif;">
                                            <b>
                                                <span style="font-size:10.0pt;font-family:&quot;Arial&quot;,sans-serif;color:black;">dsad ad sada sda asda</span>
                                            </b>
                                        </p>
                                        <p class="end" style="margin:0cm;font-size:12.0pt;font-family:&quot;Aptos&quot;,sans-serif;">&nbsp;</p>
                                    </span>
                                </span>
                            </span>
                        </span>
                    </li>
                </ol>`
            });
        });
        afterAll(() => {
            destroy(editorObj);
        });
        it('Select all content and then press the Backspace key now the all content in RTE should be removed.', (done) => {
            let startNode = editorObj.inputElement.querySelector('.start');
            let endNode = editorObj.inputElement.querySelector('.end');
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, endNode, 0, endNode.textContent.length);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            (editorObj as any).keyUp(keyBoardEvent);
            setTimeout(() => {
                expect(editorObj.inputElement.textContent === '').toBe(true);
                done();
            }, 100);
        });
        it('RTE content should not be removed when the Backspace key is pressed while the RTE contains an empty br.', (done) => {
            editorObj.inputElement.innerHTML = '<p><br></p><p><br></p><p><br></p><p class="start"><br></p>'
            let startNode = editorObj.inputElement.querySelector('.start');
            editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, startNode, 0, startNode.textContent.length);
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
            keyBoardEvent.keyCode = 8;
            keyBoardEvent.code = 'Backspace';
            (editorObj as any).keyDown(keyBoardEvent);
            (editorObj as any).keyUp(keyBoardEvent);
            setTimeout(() => {
                expect(editorObj.inputElement.innerHTML === '<p><br></p><p><br></p><p><br></p><p class="start"><br></p>').toBe(true);
                done();
            }, 100);
        });
    });

    describe('Applying bullet and ordered list styles on a selected table', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
    
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['BulletFormatList', 'NumberFormatList']
                },
                bulletFormatList: {
                    types: [
                        { text: 'None', value: 'none' },
                        { text: 'Disc', value: 'disc' },
                        { text: 'Circle', value: 'circle' },
                        { text: 'Square', value: 'square' }
                    ]
                },
                numberFormatList: {
                    types: [
                        { text: 'None', value: 'none' },
                        { text: 'Number', value: 'decimal' },
                        { text: 'UpperAlpha', value: 'upperAlpha' }
                    ]
                },
                value: `
                    <table>
                        <tbody>
                            <tr>
                                <td>Cell 1</td>
                                <td>Cell 2</td>
                            </tr>
                            <tr>
                                <td>Cell 3</td>
                                <td>Cell 4</td>
                            </tr>
                        </tbody>
                    </table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
    
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });
    
        it('Should apply bullet and ordered list styles using setSelectionText', () => {
            const table: HTMLTableElement = rteEle.querySelector('table')!;
            expect(table).not.toBeNull();
            const ul = table.closest('ul');
            // Selecting the first cell
            const firstCell = table.querySelectorAll('td');
            const nodeSelection = rteObj.formatter.editorManager.nodeSelection;
            // Using the setSelectionText method as per NodeSelection class logic
            nodeSelection.setSelectionText(document, firstCell[0], firstCell[3], 0, 0);
            // Simulate clicking 'Disc'
            let bulletDropdown = document.querySelector('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn');
            (bulletDropdown as HTMLElement).click();
            let bulletDropdownItems = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            (bulletDropdownItems[1] as HTMLElement).click();
            // Verify if the bullet style applied correctly
            let firstTd = table.querySelector('ul');
            expect(firstTd.style.listStyleType).toBe('disc');
            // apply an ordered list
            const numberButton: HTMLElement = rteObj.element.querySelector(`#${controlId}_toolbar_NumberFormatList_dropdownbtn`) as HTMLElement;
            numberButton.click();
            // clicking 'Number' (decimal)
            let numberDropdownItems = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            dispatchEvent(numberDropdownItems[1] as HTMLElement, 'mousedown');
            (numberDropdownItems[1] as HTMLElement).click();
            firstTd = table.querySelector('ol');
            expect(firstTd.style.listStyleType).toBe('decimal');
        });
    });
    describe('Lists applied to HR elements', () => {
        it('should apply a list to the first HR element with no text nodes', () => {
            const htmlContent = `<div id="content-edit" contenteditable="true">
                <hr/>
                <hr/>
                <hr/>
            </div>`;
            // Create a DOM element with the initial HTML content
            const elem = createElement('div', {
                id: 'dom-node', innerHTML: htmlContent
            });
            document.body.appendChild(elem);
            const editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
            const editNode = editorObj.editableElement as HTMLElement;
            // Select the first HR element to apply the list
            const hrElement = editNode.querySelector('hr');
            setCursorPoint(hrElement, 0);
            editorObj.execCommand("Lists", 'OL', null);
            
            // Assertions to verify the applied list around hr element
            const listElement = editNode.querySelector('ol');
            expect(listElement).not.toBeNull();
            expect(listElement.firstElementChild.tagName).toBe('LI');
            expect(listElement.querySelector('li').firstElementChild.tagName).toBe('HR');
            // Clean up DOM
            detach(elem);
        });
    });

});
describe('963590 - Blazor Server : List formatting fails when applying bullet list over numbered list with mixed content selection', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<ol><li>text1<ol><li class="start">text2</li></ol></li><li><br></li></ol><p>Rich Text Ediotr</p>`
        });
    });
    afterAll(() => {
        destroy(editorObj);
    });
    it('Should remove the empty list when delete key is pressed', (done) => {
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, startNode.firstChild.textContent.length);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        expect(editorObj.inputElement.querySelectorAll("li").length === 3).toBe(true);
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll("li").length === 2).toBe(true);
            expect(editorObj.inputElement.innerHTML == '<ol><li>text1<ol><li class="start">text2<br></li></ol></li></ol><p>Rich Text Ediotr</p>').toBe(true);
            done();
        }, 100);
    });
    it('Should list merge with the range li element when delete key is pressed', (done) => {
        editorObj.inputElement.innerHTML = '<ol><li>text1<ol><li class="start">text2</li></ol></li><li>sdfsdfsd<ol><li>asdfasdf</li></ol></li></ol><p>Rich Text Ediotr</p>';
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, startNode.firstChild.textContent.length);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.keyCode = 46;
        keyBoardEvent.code = 'Delete';
        expect(editorObj.inputElement.querySelectorAll("li").length === 4).toBe(true);
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll("li").length === 3).toBe(true);
            expect(editorObj.inputElement.innerHTML == `<ol><li>text1<ol><li class="start">text2sdfsdfsd<ol><li>asdfasdf</li></ol></li></ol></li></ol><p>Rich Text Ediotr</p>`).toBe(true);
            done();
        }, 100);
    });
});
describe('964856 - When selecting two list items and pressing the Backspace key, the entire list gets deleted unexpectedly', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<ul><li class="start">Basic features include headings, block quotes, numbered lists, bullet lists, and support to insert images, tables, audio, and video.</li><li class="end">Inline styles include <b>bold</b>, <em>italic</em>, <span style="text-decoration: underline">underline</span>, <span style="text-decoration: line-through">strikethrough</span>, <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" title="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/tools.html" aria-label="Open in new window">hyperlinks</a>,<code>InlineCode</code>, 😀 and more.</li> <li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li> <li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li> </ul><p><br/></p>`
        });
    });
    afterAll(() => {
        destroy(editorObj);
    });
    it('Do not remove the entire list while select two list then press the Backspace key.', (done) => {
        let startNode = editorObj.inputElement.querySelector('.start');
        let endNode = editorObj.inputElement.querySelector('.end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode, endNode.lastChild, 0, endNode.lastChild.textContent.length);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.keyCode = 8;
        keyBoardEvent.code = 'Backspace';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === '<ul><li>The toolbar has multi-row, expandable, and scrollable modes. The Editor supports an inline toolbar, a floating toolbar, and custom toolbar items.</li><li>Integration with Syncfusion<sup>®</sup> Mention control lets users tag other users. To learn more, check out the <a class="e-rte-anchor" href="https://ej2.syncfusion.com/documentation/rich-text-editor/mention-integration" title="Mention Documentation" aria-label="Open in new window">documentation</a> and <a class="e-rte-anchor" href="https://ej2.syncfusion.com/demos/#/material/rich-text-editor/mention-integration.html" title="Mention Demos" aria-label="Open in new window">demos</a>.</li></ul><p><br></p>').toBe(true);
            done();
        }, 100);
    });
});

describe('965805 - Incorrect Selection After Applying List to Multiple HR Tags and Text at last.', () => {
    let editorObj: EditorManager;
    let editNode: HTMLElement;
    let elem: HTMLElement;

    beforeAll(() => {
        elem = createElement('div', {
            id: 'dom-node', innerHTML: `<div id="content-edit" contenteditable="true">
                <hr/>
                <hr/>
                <hr/>
                <p>Some text here.</p>
            </div>`
        });
        document.body.appendChild(elem);
        editorObj = new EditorManager({ document: document, editableElement: document.getElementById('content-edit') });
        editNode = editorObj.editableElement as HTMLElement;
    });

    afterAll(() => {
        detach(elem);
    });

    it('should apply a list to hr elements and a paragraph', () => {
        const startNode = editNode.firstElementChild;
        const endNode = editNode.querySelector('p');
        // Select all elements
        editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 0);
        // Apply ordered list
        editorObj.execCommand("Lists", 'OL', null);
        // Assertions
        const listElement = editNode.querySelector('ol');
        expect(listElement).not.toBeNull();
        expect(listElement.querySelectorAll('li').length).toBe(4);
        expect(listElement.querySelector('li').contains(editNode.querySelector('hr'))).toBe(true);
        expect(listElement.querySelector('li').contains(editNode.querySelector('p'))).toBe(false);
    });
});
describe('983487 - Enter at list item creates extra line break.', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<ul><li><p>Rich Text Editor 1</p><p class='start'>Rich Text Editor 2</p><p>Rich Text Editor 3</p><p>Rich Text Editor 4</p></li></ul>`
        });
    });
    afterAll(() => {
        destroy(editorObj);
    });
    it('Should properly handle nested lists when splitting at parent list item', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li class="start">Rich Text Editor<ol><li>Text1</li><li>Text2</li></ol></li></ol>`;
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, 0);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ol><li class="start"><br></li><li class="start">Rich Text Editor<ol><li>Text1</li><li>Text2</li></ol></li></ol>`).toBe(true);
            done();
        }, 50);
    });
});
describe('956982 - List item merge and incorrect cursor behavior after removing code block formatting in Rich Text Editor', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<ul><li><p>Rich Text Editor 1</p><p class='start'>Rich Text Editor 2</p><p>Rich Text Editor 3</p><p>Rich Text Editor 4</p></li></ul>`
        });
    });
    afterAll(() => {
        destroy(editorObj);
    });
    it('Should split list item at cursor position when Enter is pressed within paragraph text', (done) => {
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, 5);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === '<ul><li><p>Rich Text Editor 1</p><p class="start">Rich </p></li><li><p class="start">Text Editor 2</p><p>Rich Text Editor 3</p><p>Rich Text Editor 4</p></li></ul>').toBe(true);
            done();
        }, 50);
    });
    it('Should split list item at selected text range when Enter is pressed', (done) => {
        editorObj.inputElement.innerHTML = `<ul><li><p>Rich Text Editor 1</p><p class='start'>Rich Text Editor 2</p><p>Rich Text Editor 3</p><p>Rich Text Editor 4</p></li></ul>`;
        let startNode = editorObj.inputElement.querySelector('.start');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.firstChild, 3, 10);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ul><li><p>Rich Text Editor 1</p><p class="start">Ric</p></li><li><p class="start">Editor 2</p><p>Rich Text Editor 3</p><p>Rich Text Editor 4</p></li></ul>`).toBe(true);
            done();
        }, 50);
    });
    it('Should create an empty list item when Enter is pressed at end of list item', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li>Rich Text Editor</li></ol>`;
        let startNode = editorObj.inputElement.querySelector('li');
        setCursorPoint(startNode.firstChild as Element, startNode.firstChild.textContent.length);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ol><li>Rich Text Editor</li><li><br></li></ol>`).toBe(true);
            done();
        }, 50);
    });
    it('Should properly handle nested lists when splitting at parent list item', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li class="start">Rich Text Editor<ol><li>Text1</li><li>Text2</li></ol></li></ol>`;
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, startNode.firstChild.textContent.length);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ol><li class="start">Rich Text Editor</li><li class="start"><br><ol><li>Text1</li><li>Text2</li></ol></li></ol>`).toBe(true);
            done();
        }, 50);
    });
    it('Should preserve self-closing tags when splitting list items', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li class="start">Rich T<hr>ext Editor</li></ol>`;
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, 3);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ol><li class="start">Ric</li><li class="start">h T<hr>ext Editor</li></ol>`).toBe(true);
            done();
        }, 50);
    });
    it('Should not created a new list when press the enterkey in side the table', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li><p>Rich T</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p>ext Editor</p></li></ol>`;
        let startNode = editorObj.inputElement.querySelector('tr td');
        setCursorPoint(startNode as Element, 0);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ol><li><p>Rich T</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><p>ext Editor</p></li></ol>`).toBe(true);
            done();
        }, 50);
    });
    it('969602 - Pressing Enter in a List Doesn’t Maintain Formatting', (done) => {
        editorObj.inputElement.innerHTML = `<ol>
   <li style="font-weight: bold;"><strong><span style="text-decoration: underline;"><span class='start' style="text-decoration: line-through;">rich</span></span></strong></li>
   <li>text</li>
</ol>`;
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, startNode.firstChild.textContent.length);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: false, key: 'enter', stopPropagation: () => { }, shiftKey: false, which: 13, action: 'enter' };
        keyBoardEvent.keyCode = 13;
        keyBoardEvent.code = 'Enter';
        (editorObj as any).keyDown(keyBoardEvent);
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ol>
   <li style="font-weight: bold;"><strong><span style="text-decoration: underline;"><span class="start" style="text-decoration: line-through;">rich</span></span></strong></li>
   <li style="font-weight: bold;"><strong><span style="text-decoration: underline;"><span class="start" style="text-decoration: line-through;"><br></span></span></strong></li><li>text</li>
</ol>`).toBe(true);
            done();
        }, 50);
    });
});

describe('968282 : Implement NumberFormatList and BulletFormatList in executeCommand Method Cursor based', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['BulletFormatList', 'NumberFormatList']
                },
                value: `<p id="pNode1">Sample</p>
                <p id="pNode2">Sample</p>
                <p id="pNode3">Sample</p>
                <p id="pNode4">Sample</p>
                <p id="createLink">CreateLinkSample</p>`
            });
            rteEle = rteObj.element;
            done();
        });
    
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });

        // case for checking number list for executeCommand method.
        it('Should check for list style number in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode1');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("numberFormatList", "decimal", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode1').parentElement.style.listStyleType === 'decimal').toBe(true);
        });
        // case for checking lower greek for executeCommand method.
        it('Should check for list style lower greek in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode2');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("numberFormatList", "lowerGreek", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode2').parentElement.style.listStyleType === 'lower-greek').toBe(true);
        });
        // case for checking lower roman for executeCommand method.
        it('Should check for list style lower roman in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode3');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("numberFormatList", "lowerRoman", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode3').parentElement.style.listStyleType === 'lower-roman').toBe(true);
        });
        // case for checking upper alpha for executeCommand method.
        it('Should check for list style upper alpha in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode4');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("numberFormatList", "upperAlpha", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode4').parentElement.style.listStyleType === 'upper-alpha').toBe(true);
        });
        // case for checking lower alpha for executeCommand method.
        it('Should check for list style lower alpha in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#createLink');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("numberFormatList", "lowerAlpha", {undo : true} );
            expect(rteObj.inputElement.querySelector('#createLink').parentElement.style.listStyleType === 'lower-alpha').toBe(true);
        });
        // case for checking upper roman for executeCommand method.
        it('Should check for list style upper roman in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#createLink');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("numberFormatList", "upperRoman", {undo : true} );
            expect(rteObj.inputElement.querySelector('#createLink').parentElement.style.listStyleType === 'upper-roman').toBe(true);
        });
        // case for checking dic list for executeCommand method.
        it('Should check for list style dic in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode1');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("bulletFormatList", "disc", {undo: true});
            expect(rteObj.inputElement.querySelector('#pNode1').parentElement.style.listStyleType === 'disc').toBe(true);
        });
        // case for checking  circle for executeCommand method.
        it('Should check for list style lower greek in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode2');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("bulletFormatList", "circle", {undo: true});
            expect(rteObj.inputElement.querySelector('#pNode2').parentElement.style.listStyleType === 'circle').toBe(true);
        });
        // case for checking square for executeCommand method.
        it('Should check for list style square in exexuteCommand', () => {
            let targetNode : HTMLElement = rteObj.inputElement.querySelector('#pNode3');
            setCursorPoint(targetNode, 1);
            rteObj.executeCommand("bulletFormatList", "Square", {undo: true});
            expect(rteObj.inputElement.querySelector('#pNode3').parentElement.style.listStyleType === 'square').toBe(true);
        });
});

describe('968282 : Implement NumberFormatList in executeCommand Method - Selection Based', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo']
                },
                value: `<p id="pNode1">Sample1</p>
                        <p id="pNode2">Sample2</p>
                        <p id="pNode3">Sample3</p>
                        <p id="pNode4">Sample4</p>
                        <p id="pNode5">Sample5</p>
                        <p id="pNode6">Sample6</p>
                        <p id="pNode7">Sample7</p>
                        <p id="pNode8">Sample8</p>
                        <p id="pNode9">Sample9</p>
                        <p id="pNode10">Sample10</p>
                        <p id="pNode11">Sample11</p>
                        <p id="pNode12">Sample12</p>
                        <p id="pNode13">Sample13</p>
                        <p id="pNode14">Sample14</p>
                        <p id="pNode15">Sample15</p>
                        <p id="pNode16">Sample16</p>
                        <p id="pNode17">Sample17</p>
                        <p id="pNode18">Sample18</p>
                        <p id="pNode19">Sample19</p>
                        <p id="pNode20">Sample20</p>`
            });
            rteEle = rteObj.element;
            done();
        });
    
        afterAll((done: Function) => {
            destroy(rteObj);
            done();
        });

        // case for checking number list for executeCommand method.
        it('Should check for list style number in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode1');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode2');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("numberFormatList", "decimal", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode2').parentElement.style.listStyleType === 'decimal').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
            
        });
        // case for checking lower greek for executeCommand method.
        it('Should check for list style lower greek in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode3');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode4');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("numberFormatList", "lowergreek", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode3').parentElement.style.listStyleType === 'lower-greek').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking lower roman for executeCommand method.
        it('Should check for list style lower roman in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode5');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode6');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("numberFormatList", "lowerRoman", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode5').parentElement.style.listStyleType === 'lower-roman').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking upper alpha for executeCommand method.
        it('Should check for list style upper alpha in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode7');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode8');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("numberFormatList", "upperAlpha", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode7').parentElement.style.listStyleType === 'upper-alpha').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking lower alpha for executeCommand method.
        it('Should check for list style lower alpha in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode9');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode10');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("numberFormatList", "lowerAlpha", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode9').parentElement.style.listStyleType === 'lower-alpha').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking upper roman for executeCommand method.
        it('Should check for list style upper roman in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode11');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode12');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("numberFormatList", "upperRoman", {undo : true} );
            expect(rteObj.inputElement.querySelector('#pNode11').parentElement.style.listStyleType === 'upper-roman').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking dic list for executeCommand method.
        it('Should check for list style dic in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode13');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode14');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("bulletFormatList", "disc", {undo: true});
            expect(rteObj.inputElement.querySelector('#pNode14').parentElement.style.listStyleType === 'disc').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking  circle for executeCommand method.
        it('Should check for list style lower greek in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode16');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode17');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("bulletFormatList", "circle", {undo: true});
            expect(rteObj.inputElement.querySelector('#pNode16').parentElement.style.listStyleType === 'circle').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        // case for checking square for executeCommand method.
        it('Should check for list style square in exexuteCommand', () => {
            let targetNodeOne : HTMLElement = rteObj.inputElement.querySelector('#pNode18');
            let targetNodeTwo : HTMLElement = rteObj.inputElement.querySelector('#pNode19');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, targetNodeOne, targetNodeTwo, 0, 0);
            rteObj.executeCommand("bulletFormatList", "Square", {undo: true});
            expect(rteObj.inputElement.querySelector('#pNode19').parentElement.style.listStyleType === 'square').toBe(true);
            expect(document.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toBe(false);
        });
        
});

describe('968282: Nested List Formatting with executeCommand', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;

    beforeAll((done: Function) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['Undo']
            },
            value: `
                <ul id="list1">
                    <li id="item1">Item 1
                        <ul>
                            <li id="item1-1">Subitem 1.1</li>
                            <li id="item1-2">Subitem 1.2</li>
                        </ul>
                    </li>
                    <li id="item2">Item 2</li>
                </ul>
                <ol id="list2">
                    <li id="item3">Item 3
                        <ol>
                            <li id="item3-1">Subitem 3.1</li>
                            <li id="item3-2">Subitem 3.2</li>
                        </ol>
                    </li>
                    <li id="item4">Item 4</li>
                </ol>`
        });
        rteEle = rteObj.element;
        done();
    });

    afterAll((done: Function) => {
        destroy(rteObj);
        done();
    });

    it('Should apply disc style to nested unordered list', () => {
        const targetNode: HTMLElement = rteObj.inputElement.querySelector('#item1-1');
        setSelection(targetNode, 0, 0);
        rteObj.executeCommand("bulletFormatList", "disc", {undo: true});
        expect(rteObj.inputElement.querySelector('#item1-1').parentElement.style.listStyleType).toBe('disc');
    });

    it('Should apply circle style to nested unordered list', () => {
        const targetNode: HTMLElement = rteObj.inputElement.querySelector('#item1-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("bulletFormatList", "circle", {undo: true});
        expect(rteObj.inputElement.querySelector('#item1-1').parentElement.style.listStyleType).toBe('circle');
    });
    it('Should apply square style to nested unordered list', () => {
        const targetNode: HTMLElement = rteObj.inputElement.querySelector('#item1-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("bulletFormatList", "Square", {undo: true});
        expect(rteObj.inputElement.querySelector('#item1-1').parentElement.style.listStyleType).toBe('square');
    });

    it('Should apply lower-roman style to nested ordered list', () => {
        const targetNode : HTMLElement = rteObj.inputElement.querySelector('#item3-1');
        setSelection(targetNode, 0, 0);
        rteObj.executeCommand("numberFormatList", "lowerRoman", {undo : true} );
        expect(rteObj.inputElement.querySelector('#item3-1').parentElement.style.listStyleType).toBe('lower-roman');
    });
    it('Should apply number style to nested ordered list', () => {
        const targetNode : HTMLElement = rteObj.inputElement.querySelector('#item3-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("numberFormatList", "decimal", {undo : true} );
        expect(rteObj.inputElement.querySelector('#item3-1').parentElement.style.listStyleType).toBe('decimal');
    });
    it('Should apply lower alpha style to nested ordered list', () => {
        const targetNode : HTMLElement = rteObj.inputElement.querySelector('#item3-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("numberFormatList", "lowerAlpha", {undo : true} );
        expect(rteObj.inputElement.querySelector('#item3-1').parentElement.style.listStyleType).toBe('lower-alpha');
    });
    it('Should apply upper alpha style to nested ordered list', () => {
        const targetNode : HTMLElement = rteObj.inputElement.querySelector('#item3-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("numberFormatList", "upperAlpha", {undo : true} );
        expect(rteObj.inputElement.querySelector('#item3-1').parentElement.style.listStyleType).toBe('upper-alpha');
    });
    it('Should apply upper roman style to nested ordered list', () => {
        const targetNode : HTMLElement = rteObj.inputElement.querySelector('#item3-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("numberFormatList", "upperRoman", {undo : true} );
        expect(rteObj.inputElement.querySelector('#item3-1').parentElement.style.listStyleType).toBe('upper-roman');
    });
    it('Should apply lower greek style to nested ordered list', () => {
        const targetNode : HTMLElement = rteObj.inputElement.querySelector('#item3-1');
        setCursorPoint(targetNode, 1);
        rteObj.executeCommand("numberFormatList", "lowerGreek", {undo : true} );
        expect(rteObj.inputElement.querySelector('#item3-1').parentElement.style.listStyleType).toBe('lower-greek');
    });
});

describe('971240 - Implement Checklist Structure Updates via Toolbar.', () => {
    let editorObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['Checklist']
            },
            value: `<p id="start">Line 1</p><p id="end">Line 2</p>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('should update the checklist when clicking the checklist icon', (done) => {
        const start = editorObj.inputElement.querySelector('#start');
        const end = editorObj.inputElement.querySelector('#end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, end.firstChild, 0, 2);
        editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelectorAll('button')[0].click();
        expect(editorObj.inputElement.querySelector('.e-rte-checklist') !== null).toBe(true);
        done();
    });
    it('should toggle the checklist checked state when clicking the checkbox area.', (done) => {
        editorObj.inputElement.innerHTML = `<ul class="e-rte-checklist"><li>Line 1</li></ul>`;
        editorObj.enableRtl = false;
        const li = document.querySelector('.e-rte-checklist li');
        const mockEvent = {
            clientX: 0,
            target: li,
            preventDefault: () => { },
            stopPropagation: () => { }
        };
        li.getBoundingClientRect = (): DOMRect => ({
            left: 50,
            right: 200,
            top: 0,
            bottom: 0,
            x: 50,
            y: 0,
            width: 150,
            height: 0,
            toJSON: () => { },
        });
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(true);
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(false);
        done();
    });
    it('should toggle checklist checked state properly when enableRtl is true', (done) => {
        editorObj.inputElement.innerHTML = `<ul class="e-rte-checklist"><li>Line 1</li></ul>`;
        editorObj.enableRtl = true;
        const li = document.querySelector('.e-rte-checklist li')!;
        li.getBoundingClientRect = (): DOMRect => ({
            left: 50,
            right: 200,
            top: 0,
            bottom: 0,
            x: 50,
            y: 0,
            width: 150,
            height: 0,
            toJSON: () => { },
        });
        let mockEvent = {
            clientX: 200,
            target: li,
            preventDefault: () => { },
            stopPropagation: () => { }
        } as unknown as MouseEvent;
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(false);
        mockEvent = {
            clientX: 201,
            target: li,
            preventDefault: () => { },
            stopPropagation: () => { }
        } as unknown as MouseEvent;
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(true);
        mockEvent = {
            clientX: 250,
            target: li,
            preventDefault: () => { },
            stopPropagation: () => { }
        } as unknown as MouseEvent;
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(false);
        done();
    });
    it('should convert the ordered list to a checklist.', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li>Line1</li><li>Line2</li><li>Line3</li><li>Line4</li></ol>`;
        const li = document.querySelector('li');
        setCursorPoint(li.firstChild as Element, 0);
        editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelectorAll('button')[0].click();
        expect(editorObj.inputElement.querySelectorAll('.e-rte-checklist').length === 1).toBe(true);
        done();
    });
    it('should convert the unordered list to a checklist.', (done) => {
        editorObj.inputElement.innerHTML = `<ul><li>Line1</li><li>Line2</li><li>Line3</li><li>Line4</li></ul>`;
        const li = document.querySelector('li');
        setCursorPoint(li.firstChild as Element, 0);
        editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelectorAll('button')[0].click();
        expect(editorObj.inputElement.querySelectorAll('.e-rte-checklist').length === 1).toBe(true);
        done();
    });
    it('should revert the checklist when a checklist range is selected and the checklist icon is clicked.', (done) => {
        editorObj.inputElement.innerHTML = `<ul class="e-rte-checklist e-checklist-strikethrough"><li id='start'>Line2</li><li>Line3</li><li id='end'>Line4</li></ul>`;
        const li = document.querySelector('li');
        const start = editorObj.inputElement.querySelector('#start');
        const end = editorObj.inputElement.querySelector('#end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, end.firstChild, 0, 2);
        editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelectorAll('button')[0].click();
        expect(editorObj.inputElement.querySelectorAll('.e-rte-checklist').length === 0).toBe(true);
        done();
    });
    it('should revert the checklist when applied to an existing checklist', (done) => {
        editorObj.inputElement.innerHTML = `<ul class="e-rte-checklist"><li id='start'>Line2</li><li>Line3</li><li id='end'>Line4</li></ul>`;
        const start = editorObj.inputElement.querySelector('#start');
        const end = editorObj.inputElement.querySelector('#end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, end.firstChild, 0, 2);
        editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelectorAll('button')[0].click();
        expect(editorObj.inputElement.querySelector('.e-rte-checklist') === null).toBe(true);
        done();
    });
    it('Should update the checklist when using shortcut key - Ctrl+Shift+9', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li id='start'>Line2</li><li>Line3</li><li id='end'>Line4</li></ol>`;
        const li = document.querySelector('li');
        setCursorPoint(li.firstChild as Element, 0);
        keyBoardEvent.code = 'Digit9';
        keyBoardEvent.action = 'checklist';
        keyBoardEvent.which = 57;
        (editorObj as any).keyDown(keyBoardEvent);
        expect(editorObj.inputElement.querySelector('.e-rte-checklist') !== null).toBe(true);
        done();
    });
    it('Should update the checklist using and executeCommand', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li id='start'>Line2</li><li>Line3</li><li id='end'>Line4</li></ol>`;
        const li = document.querySelector('li');
        setCursorPoint(li.firstChild as Element, 0);
        editorObj.executeCommand('checklist');
        expect(editorObj.inputElement.querySelector('.e-rte-checklist') !== null).toBe(true);
        done();
    });
});

describe('975222 - Undo redo is not working with Checking of the list items.', () => {
    let editorObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['Checklist']
            },
            value: `<p id="start">Line 1</p><p id="end">Line 2</p>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('Check that the list item maintains proper state after checking and unchecking', (done) => {
        editorObj.inputElement.innerHTML = `<ul class="e-rte-checklist"><li>Line 1</li></ul>`;
        const li = document.querySelector('.e-rte-checklist li');
        setCursorPoint(li.firstChild as Element, 0);
        const mockEvent = {
            clientX: 0,
            target: li,
            preventDefault: () => { },
            stopPropagation: () => { }
        };
        li.getBoundingClientRect = (): DOMRect => ({
            left: 50,
            right: 200,
            top: 0,
            bottom: 0,
            x: 50,
            y: 0,
            width: 150,
            height: 0,
            toJSON: () => { },
        });
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(editorObj.formatter.editorManager.undoRedoManager.undoRedoStack.length === 1).toBe(true);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(true);
        (editorObj as any).handleChecklistDocumentClick(mockEvent, li);
        expect(li.classList.contains('e-rte-checklist-checked')).toBe(false);
        done();
    });
});

describe('975503 - Unable to Create Table Inside List – Script Error Encountered', () => {
    let editorObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['Checklist']
            },
            value: `<p id="start">Line 1</p><p id="end">Line 2</p>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('should place the cursor at the start of the LI element when pressing backspace', (done) => {
        editorObj.inputElement.innerHTML = `<ul><li>Line 1</li></ul>`;
        const li = document.querySelector('li');
        setCursorPoint(li.firstChild as Element, li.firstChild.textContent.length);
        const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
        editorObj.inputElement.dispatchEvent(backspaceEvent);
        let range = window.getSelection().getRangeAt(0);
        expect(range.startContainer.nodeName === 'LI').toBe(true);
        expect(range.startOffset === 0 && range.endOffset === 0).toBe(true);
        editorObj.inputElement.dispatchEvent(backspaceEvent);
        range = window.getSelection().getRangeAt(0);
        expect(range.startContainer.nodeName === 'P').toBe(true);
        expect(range.startOffset === 0 && range.endOffset === 0).toBe(true);
        done();
    });
});

describe('980355 - Bullet List Fails to Apply After Switching from Numbered List with Lower Greek Format', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['BulletFormatList', 'NumberFormatList']
            },
            value: `<p class="start">Rich Text Editor</p>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('Should properly update the list style for UL and OL elements', (done) => {
        let startNode = editorObj.inputElement.querySelector('.start');
        setCursorPoint(startNode.firstChild as Element, 0);
        editorObj.executeCommand('numberFormatList', 'UpperAlpha');
        expect(editorObj.inputElement.innerHTML = `<ol style="list-style-image: none; list-style-type: upper-alpha;"><li class="start">Rich Text Editor</li></ol>`);
        editorObj.executeCommand('bulletFormatList', 'disc');
        expect(editorObj.inputElement.innerHTML = `<ul style="list-style-image: none; list-style-type: disc;"><li class="start">Rich Text Editor</li></ul>`);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelector('button.e-rte-bulletformatlist-dropdown') as HTMLElement).click();
        expect(editorObj.inputElement.innerHTML = `<p class="start">Rich Text Editor</p>`);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0].querySelector('button.e-rte-bulletformatlist-dropdown') as HTMLElement).click();
        expect(editorObj.inputElement.innerHTML = `<ul><li class="start">Rich Text Editor</li></ul>`);
        done();
    });
});

describe('975383: Shortcut to toggle Checklist is not working.', () => {
    let editorObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['Checklist']
            },
            value: `<p id="start">text</p><ul class="e-rte-checklist"><li>Text1<ul class="e-rte-checklist"><li>text2<ul class="e-rte-checklist"><li>text3</li></ul></li></ul></li><li>text4<ul class="e-rte-checklist"><li>text5</li></ul></li></ul><p id="end">text</p>`
        });
    });
    afterAll((done) => {
        ENTERKEY_EVENT_INIT.ctrlKey = false;
        ENTERKEY_EVENT_INIT.metaKey = false;
        destroy(editorObj);
        done();
    });
    it('Should toggle the checklist when press the Ctrl+Enter', (done) => {
        const start = editorObj.inputElement.querySelector('#start');
        const end = editorObj.inputElement.querySelector('#end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, start.firstChild, end.firstChild, 0, 2);
        ENTERKEY_EVENT_INIT.ctrlKey = true;
        ENTERKEY_EVENT_INIT.metaKey = true;
        const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
        editorObj.inputElement.dispatchEvent(backspaceEvent);
        expect(editorObj.inputElement.querySelectorAll(".e-rte-checklist-checked").length === 5).toBe(true);
        done();
    });
    it('Should not create a new list when press the ctrl+enter', (done) => {
        editorObj.inputElement.innerHTML = `<ol><li>RichText Editor</li></ol>`;
        const li = document.querySelector('li');
        setCursorPoint(li.firstChild as Element, 3);
        ENTERKEY_EVENT_INIT.ctrlKey = true;
        ENTERKEY_EVENT_INIT.metaKey = true;
        const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', ENTERKEY_EVENT_INIT);
        editorObj.inputElement.dispatchEvent(backspaceEvent);
        expect(editorObj.inputElement.innerHTML === `<ol><li>RichText Editor</li></ol>`).toBe(true);
        done();
    });
});

describe('978845 - List formatting fails when applied to indented checklist items in multi-selection', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            enterKey: 'DIV',
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<ul>
   <li>text1
      <ul>
         <li class="start">text2</li>
      </ul>
   </li>
   <li class="end">text3</li>
</ul>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('Should convert the nested list into an ordered list', (done) => {
        let startNode = editorObj.inputElement.querySelector('.start');
        let endNode = editorObj.inputElement.querySelector('.end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, endNode.lastChild, 0, 3);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0] as HTMLElement).click();
        expect(editorObj.inputElement.innerHTML === `<ul><li>text1<ol><li class="start">text2</li></ol></li></ul><ol><li class="end">text3</li></ol>`).toBe(true);
        done();
    });
    it('Should convert the UnorderedList into an ordered list', (done) => {
        editorObj.inputElement.innerHTML = `<ul><li class="start">Text1<ul><li>Text2</li></ul></li><li>Text3<ul><li>Text4</li></ul></li><li class="end">Text5</li></ul>`;
        let startNode = editorObj.inputElement.querySelector('.start');
        let endNode = editorObj.inputElement.querySelector('.end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, endNode.lastChild, 0, 3);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[0] as HTMLElement).click();
        expect(editorObj.inputElement.innerHTML === `<ol><li class="start">Text1<ol><li>Text2</li></ol></li><li>Text3<ol><li>Text4</li></ol></li><li class="end">Text5</li></ol>`).toBe(true);
        done();
    });
});

describe('977557 - When pressing enter key at start position of list affects the DOM structure', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            enterKey: 'DIV',
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<div class="startFocus">Line 1</div><div class="endFocus">Line 2</div>`
        });
    });
    afterAll(() => {
        destroy(editorObj);
    });
    it('configure enter key as DIV and pressing enter key at start and end position of list affects the DOM structure', (done) => {
        let startNode = editorObj.inputElement.querySelector('.startFocus');
        let endNode = editorObj.inputElement.querySelector('.endFocus');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, endNode.lastChild, 0, endNode.lastChild.textContent.length);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        expect(editorObj.inputElement.innerHTML === '<ul><li class="startFocus">Line 1</li><li class="endFocus">Line 2</li></ul>').toBe(true);
        const ul = document.querySelector('ul');
        setCursorPoint(ul.childNodes[0].firstChild as Element, 0);
        let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 8 };
        keyBoardEvent.code = 'Enter';
        keyBoardEvent.action = 'enter';
        keyBoardEvent.which = 13;
        (editorObj as any).keyDown(keyBoardEvent);
        expect(editorObj.inputElement.innerHTML === '<ul><li class="startFocus"><br></li><li class="startFocus">Line 1</li><li class="endFocus">Line 2</li></ul>').toBe(true);
        setCursorPoint(ul.childNodes[2].lastChild as Element, ul.childNodes[2].lastChild.textContent.length);
        (editorObj as any).keyDown(keyBoardEvent);
        expect(editorObj.inputElement.innerHTML === '<ul><li class="startFocus"><br></li><li class="startFocus">Line 1</li><li class="endFocus">Line 2</li><li class="endFocus"><br></li></ul>').toBe(true);
        done();
    });
});

describe('977409 - Deleting text breaks the nested bullet list with images in the RichTextEditor', () => {
    let editorObj: RichTextEditor;
    let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, ctrlKey: true, key: 'backspace', stopPropagation: () => { }, shiftKey: false, which: 8 };
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['BulletFormatList', 'NumberFormatList']
            },
            value: `<p><img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_20.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_20.png"></p><ol><li>&nbsp;a<ol><li><img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_36.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_36.png"><ol><li>&nbsp;<img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_43.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_43.png"></li></ol></li></ol></li><li>b&nbsp;<img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_52.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_52.png"></li><li>c<ol><li>&nbsp;<img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_68.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_68.png"></li></ol></li><li class="focusNode">dgsgsgsdgsd</li><li>sdgsdgsdgsdgsdgsdg<ol><li><img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_86.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_86.png"></li></ol></li><li>&nbsp;ssdgdsg</li><li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAniSURBVHgB5VtrUFTnGX7PcmlVhBWxCta6dIwkaie0GlJ/VBDTTtNEhWSmnTatmE4jyYyZUpuZmh9NSTuTtn+sqWTqJROpP9q0kwZj6GTaSEH/GAipOF5QnIQlBgNREWGRyGW/vM93zrfsrns5tw1k8sws5+xhz+X53uv3fu8h+pxCo08ZBxuEdzKTctT3tDG68WilNkifMlJGHAQn0qiUd8uCGvk0jYpJkC/BKR38GdSE3LakT9KxVA6Iq8RBdjydqni3gj9l6nhmOtHc2US52byfQfSFjMjzhm8SBUaJrt0gGpuI+FeLCFJ9Wjq1/OwBrYdchCvE9x8RpUKjGk0nLInesYQojxU6P1cnbRYYhGtDRP4+og+v6QMiIaie/9Zv26QdIxfgiDgI8xVqyZDu0kVEqwqJCuaTa7jM5LsuEV38IHSoxeOhrU41wBZxqPRYGv2G7bYG0l31VZ1wtAq7CWjCO11hA8Aa4EmjWrsDYJm4lLKH1Y4dVT5LtvRua6rsFOEDIAT5PUQ1j23SXiOLsER8/+vi57zZDSmvKyYqXETThgus/v/v0n2AIKqt3qg9a+V808T3HRF/gmpPh5TjAdI/dkp3glB9dnyPmj3XFPH9jeIgX3grbHntCppxgOpD+oyOjAlabyb+e5L9QJH+xvKZSRpYzc+G52MUcx7RbOachMSh3or06uU0oxFOnh3wwWS/j0t83+tChiuo90wnrYDnRFhlA96K50/025g2/pcG4eM0sTtrFtEPN9BnDo0nQg6vLF6mF5M423V31hfJ9+Ba9733ef8odXaP0tDIJA3zZ/GXMuXnLt8smjsnjdwAvD3I89afOUlfj+Xs0qMPSBXh5AT24hbptrMBamq9Qa82X5dk46FkVRZVrp/Hn1xyAjx3KecZ/z5BPmSYfOgX0b+JkLhSceTc31lDjgGSO/e8T01tQ/J7yco5tKEkR5dw4Sx5rPejMSn9prYb1HYmQL1XxuX/6n7lk79zAjMqL4HQxdmZGBoRjtF6ZliUV58TRZUdYuefe8RQYCLpOR/03xJ7/v6hPOeeH58WR1sHhROAR/0bQjCn+CEO0gbp5pPCMV5tuiYfvnzbWdF6elhYBQYA5+IauJYTtF+QxIWcY4QhFM7SMqQtOA5dDf8boKfrLtHiBRl06HfLpN1aBVQc5+IauBbMwC5keGOgXhB+XBLHNJPtoAJ5uBOHBnsNJ+3ERiPI77mU0CkmAqbK4MXOrEzyNCCJT2bQZt547/gyOcKWZ97lgfM4Jq2Aa/z+ya9I5/fcS71kF0ZGp8piEpJ4UOglo6IlZBtHWR0h8aqNC1whrQBTQTRAZLArdVSEMvXAXaGOKRsvW+pwbg3bBpzG4FjY/oNFUuoNzQNkFwa/YqXuHsPbefMd1snazozQfSXZrkpbAVKfOztNapVdFOTJjXc8je7GjodQ72bkZZNtIPEYvjkpk5NUobJ8nhxcu+qerxTR4OvRjCK/E4kj9wZUNpYKqGt3+kfJDhCtpJ0LgzjHt+L5DqQNnDce5s4UEi9ZqecD57vtEQdkqFYS5x1fpsOycO9H4ymx7XDg+rDzTgfEs0BckO7csOOEOGyu98oYZc9OWsVyBDmFXZgpJW7XzqWqa7pp42m9melkCwhh5Y93yvjd6f+YNvC+E1WMB0i54pdd8tq4D/ZV+LSC8AUP22LCHBvp6dxZHnr28SXyE+RMCNkbBsIt4Frb/+gnnt3RUz8poF07fPI+uDeewQoy3SD+3EuXOTZm0IFnltGm0lz5+e0Tenp5qPEKuYW6f/RJ8gd+vYwe+d4CWn9PDr3I94S9439WMDY+tQ/ilteg8SBQu9UrsqhgwZRTW8PfV981hzOs6+QWjrYOyWsW+aYiBu75o/vzZFy3Ylq3IohrNDgwRJagYimkHI31a3Kk1N1Qd9g2EiNIORpFS63HdbnkzOtt2IdX74hajE+KRF5VFQzh6Z1C3QdqHY1wDTALqDqXzP3YR+bmR1XylkXy8sFu3j4A6mGzZzuvmKrcINZ9LhsDa+U+aDgIGqbt4ZXGU9gZsJD/qyzqQgw1a+8MUDZL3Y0sTiUtzW/f/nDt5wKh35jBVcOcuSDRgq1nclLfuWrBznEzzJH/9sbV0MgD2G9pH+LJisMcOAyYnLzTORIiqu5z5Ph1WZ0xO8ADU8RPGVu57n2dJyleLCCYBWZkiNnwsE9tKZAqvvdf/RQYmaDDu4pcS2HhJCt2dEnfUf3wQrnd+0o/dfWM0gtcgt5wr7kZ4X/biXr6aHDbRm0evuvEjRXRLd/l7MZCFofsCfFc2SAkULez0PVZGrz79j90y5o7gPLWk1yc2MLVHjNAGDv0H9lAcLh6o1aJYzrNINVjoQ1NNl8rJNOoLM+VRQI1cbgXBQOXloHCgYFs2rdCpqrDAV2jrNynp9/YCdJhdUwSxyoDq/sgq4LXCnFArX1ZBdJNmAsAYsmKGCppwhKT1cGFQNEvU71Z+6s6FlJs1vndvNxSiyWXfBfbtaIh1ZZz7+gEB4MHm43nrNSk5D6LVZ7hUX0ZSXlzhdDamdGV2G3VyVkFZnCYcFQ/vCiUkcFj732lj0ZGg+wjfBG/h9NsZc041HhVRhKUrq0APTKQuMdDvvDWsIhFwwO8UooOIhBPhdRVJEAUeOT+SMeEWL1jlz/uuSD9AjtOK2oOab/cRDEbgyJ8ePoEPc9SrzlxjrwPfYtch/IFkHA0cRWnt39/oSw4hONOTk/tRApeJpZAI2D0/25rDFC9bKnqe6l7uY/q/tkv4z8mGpAgpI2QWPVgHj3908XkBk6/R/TWOUmw9rEYPXCxOyL0ZdWyh9YRzXcvCQsBjgqLA21nR+R3qDGcltm4nAxKxaUn36TFjFOJemBOclXSW7nOWlIz3cBkq+G4bAMZZIdWHK/XNWYF5olKzc+ztq2YtcFO7MzcpgvHO/QeGEbCBt+4pSc0xsI+0Dz/1ln6TAChC33ueG7OyZ9P9NukLZ0qxC3nldRvrpy5aq/idTxnFg1TvayK/HzON769hicJqVswsQyY4Ztvh7IzU6QB093LijyWYR5YOzPIo6LyZrtu01ZIA5b61Q8cEZuFh3arPrjpbPVEnD55UU45B0WQasInIGZg+Q0FI9ShSbYM0scALHfYQmIFUGnOLOUbS5h4aDbfT7H9Ms6LjaKKC3e16hUNSD+VszoQRl+6bNjTC4ZJPXci2CYOQPrp6VTFto9WKq/SANk95YIPgOO6eGnqVSzCC3mcTmNO4fRlPEfEFTAAGRlUqjQAx0AeUcC3kCg3x1wYBFEQhBpja5AFXCOs4ArxcLD3LxOabKsqC3+lEiuVWUZXAhbv1AotVjewoBG4GbnEw0/m11Aq0ug19tYt5DI+AWo/mAP2R+F7AAAAAElFTkSuQmCC" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 0.5;" alt="">&nbsp;</li></ol>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('Rich Text Editor works properly when deleting text from nested bullet lists that contain img elements', (done) => {
        let startNode = editorObj.inputElement.querySelector('.focusNode');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, startNode.lastChild.textContent.length);
        const deleteKeyEvent: KeyboardEvent = new KeyboardEvent('keydown', DELETE_EVENT_INIT);
        editorObj.inputElement.dispatchEvent(deleteKeyEvent);
        expect(editorObj.inputElement.innerHTML === '<p><img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_20.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_20.png"></p><ol><li>&nbsp;a<ol><li><img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_36.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_36.png"><ol><li>&nbsp;<img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_43.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_43.png"></li></ol></li></ol></li><li>b&nbsp;<img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_52.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_52.png"></li><li>c<ol><li>&nbsp;<img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_68.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_68.png"></li></ol></li><li>sdgsdgsdgsdgsdgsdg<ol><li><img src="https://services.syncfusion.com/angular/production/RichTextEditor/rte_image_86.png" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 1;" alt="rte_image_86.png"></li></ol></li><li>&nbsp;ssdgdsg</li><li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAniSURBVHgB5VtrUFTnGX7PcmlVhBWxCta6dIwkaie0GlJ/VBDTTtNEhWSmnTatmE4jyYyZUpuZmh9NSTuTtn+sqWTqJROpP9q0kwZj6GTaSEH/GAipOF5QnIQlBgNREWGRyGW/vM93zrfsrns5tw1k8sws5+xhz+X53uv3fu8h+pxCo08ZBxuEdzKTctT3tDG68WilNkifMlJGHAQn0qiUd8uCGvk0jYpJkC/BKR38GdSE3LakT9KxVA6Iq8RBdjydqni3gj9l6nhmOtHc2US52byfQfSFjMjzhm8SBUaJrt0gGpuI+FeLCFJ9Wjq1/OwBrYdchCvE9x8RpUKjGk0nLInesYQojxU6P1cnbRYYhGtDRP4+og+v6QMiIaie/9Zv26QdIxfgiDgI8xVqyZDu0kVEqwqJCuaTa7jM5LsuEV38IHSoxeOhrU41wBZxqPRYGv2G7bYG0l31VZ1wtAq7CWjCO11hA8Aa4EmjWrsDYJm4lLKH1Y4dVT5LtvRua6rsFOEDIAT5PUQ1j23SXiOLsER8/+vi57zZDSmvKyYqXETThgus/v/v0n2AIKqt3qg9a+V808T3HRF/gmpPh5TjAdI/dkp3glB9dnyPmj3XFPH9jeIgX3grbHntCppxgOpD+oyOjAlabyb+e5L9QJH+xvKZSRpYzc+G52MUcx7RbOachMSh3or06uU0oxFOnh3wwWS/j0t83+tChiuo90wnrYDnRFhlA96K50/025g2/pcG4eM0sTtrFtEPN9BnDo0nQg6vLF6mF5M423V31hfJ9+Ba9733ef8odXaP0tDIJA3zZ/GXMuXnLt8smjsnjdwAvD3I89afOUlfj+Xs0qMPSBXh5AT24hbptrMBamq9Qa82X5dk46FkVRZVrp/Hn1xyAjx3KecZ/z5BPmSYfOgX0b+JkLhSceTc31lDjgGSO/e8T01tQ/J7yco5tKEkR5dw4Sx5rPejMSn9prYb1HYmQL1XxuX/6n7lk79zAjMqL4HQxdmZGBoRjtF6ZliUV58TRZUdYuefe8RQYCLpOR/03xJ7/v6hPOeeH58WR1sHhROAR/0bQjCn+CEO0gbp5pPCMV5tuiYfvnzbWdF6elhYBQYA5+IauJYTtF+QxIWcY4QhFM7SMqQtOA5dDf8boKfrLtHiBRl06HfLpN1aBVQc5+IauBbMwC5keGOgXhB+XBLHNJPtoAJ5uBOHBnsNJ+3ERiPI77mU0CkmAqbK4MXOrEzyNCCJT2bQZt547/gyOcKWZ97lgfM4Jq2Aa/z+ya9I5/fcS71kF0ZGp8piEpJ4UOglo6IlZBtHWR0h8aqNC1whrQBTQTRAZLArdVSEMvXAXaGOKRsvW+pwbg3bBpzG4FjY/oNFUuoNzQNkFwa/YqXuHsPbefMd1snazozQfSXZrkpbAVKfOztNapVdFOTJjXc8je7GjodQ72bkZZNtIPEYvjkpk5NUobJ8nhxcu+qerxTR4OvRjCK/E4kj9wZUNpYKqGt3+kfJDhCtpJ0LgzjHt+L5DqQNnDce5s4UEi9ZqecD57vtEQdkqFYS5x1fpsOycO9H4ymx7XDg+rDzTgfEs0BckO7csOOEOGyu98oYZc9OWsVyBDmFXZgpJW7XzqWqa7pp42m9melkCwhh5Y93yvjd6f+YNvC+E1WMB0i54pdd8tq4D/ZV+LSC8AUP22LCHBvp6dxZHnr28SXyE+RMCNkbBsIt4Frb/+gnnt3RUz8poF07fPI+uDeewQoy3SD+3EuXOTZm0IFnltGm0lz5+e0Tenp5qPEKuYW6f/RJ8gd+vYwe+d4CWn9PDr3I94S9439WMDY+tQ/ilteg8SBQu9UrsqhgwZRTW8PfV981hzOs6+QWjrYOyWsW+aYiBu75o/vzZFy3Ylq3IohrNDgwRJagYimkHI31a3Kk1N1Qd9g2EiNIORpFS63HdbnkzOtt2IdX74hajE+KRF5VFQzh6Z1C3QdqHY1wDTALqDqXzP3YR+bmR1XylkXy8sFu3j4A6mGzZzuvmKrcINZ9LhsDa+U+aDgIGqbt4ZXGU9gZsJD/qyzqQgw1a+8MUDZL3Y0sTiUtzW/f/nDt5wKh35jBVcOcuSDRgq1nclLfuWrBznEzzJH/9sbV0MgD2G9pH+LJisMcOAyYnLzTORIiqu5z5Ph1WZ0xO8ADU8RPGVu57n2dJyleLCCYBWZkiNnwsE9tKZAqvvdf/RQYmaDDu4pcS2HhJCt2dEnfUf3wQrnd+0o/dfWM0gtcgt5wr7kZ4X/biXr6aHDbRm0evuvEjRXRLd/l7MZCFofsCfFc2SAkULez0PVZGrz79j90y5o7gPLWk1yc2MLVHjNAGDv0H9lAcLh6o1aJYzrNINVjoQ1NNl8rJNOoLM+VRQI1cbgXBQOXloHCgYFs2rdCpqrDAV2jrNynp9/YCdJhdUwSxyoDq/sgq4LXCnFArX1ZBdJNmAsAYsmKGCppwhKT1cGFQNEvU71Z+6s6FlJs1vndvNxSiyWXfBfbtaIh1ZZz7+gEB4MHm43nrNSk5D6LVZ7hUX0ZSXlzhdDamdGV2G3VyVkFZnCYcFQ/vCiUkcFj732lj0ZGg+wjfBG/h9NsZc041HhVRhKUrq0APTKQuMdDvvDWsIhFwwO8UooOIhBPhdRVJEAUeOT+SMeEWL1jlz/uuSD9AjtOK2oOab/cRDEbgyJ8ePoEPc9SrzlxjrwPfYtch/IFkHA0cRWnt39/oSw4hONOTk/tRApeJpZAI2D0/25rDFC9bKnqe6l7uY/q/tkv4z8mGpAgpI2QWPVgHj3908XkBk6/R/TWOUmw9rEYPXCxOyL0ZdWyh9YRzXcvCQsBjgqLA21nR+R3qDGcltm4nAxKxaUn36TFjFOJemBOclXSW7nOWlIz3cBkq+G4bAMZZIdWHK/XNWYF5olKzc+ztq2YtcFO7MzcpgvHO/QeGEbCBt+4pSc0xsI+0Dz/1ln6TAChC33ueG7OyZ9P9NukLZ0qxC3nldRvrpy5aq/idTxnFg1TvayK/HzON769hicJqVswsQyY4Ztvh7IzU6QB093LijyWYR5YOzPIo6LyZrtu01ZIA5b61Q8cEZuFh3arPrjpbPVEnD55UU45B0WQasInIGZg+Q0FI9ShSbYM0scALHfYQmIFUGnOLOUbS5h4aDbfT7H9Ms6LjaKKC3e16hUNSD+VszoQRl+6bNjTC4ZJPXci2CYOQPrp6VTFto9WKq/SANk95YIPgOO6eGnqVSzCC3mcTmNO4fRlPEfEFTAAGRlUqjQAx0AeUcC3kCg3x1wYBFEQhBpja5AFXCOs4ArxcLD3LxOabKsqC3+lEiuVWUZXAhbv1AotVjewoBG4GbnEw0/m11Aq0ug19tYt5DI+AWo/mAP2R+F7AAAAAElFTkSuQmCC" class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; max-width: 854px; min-height: 0px; opacity: 0.5;" alt="">&nbsp;</li></ol>').toBe(true);
        done();
    });
});

describe('979658 - The content overlaps when converting a table into a UL or OL element.', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<table class="e-rte-table" style="width: 100%; min-width: 0px; height: 50px">
   <colgroup>
      <col style="width: 50%;">
      <col style="width: 50%;">
   </colgroup>
   <tbody>
      <tr>
         <td><br/></td>
         <td><br/></td>
      </tr>
      <tr>
         <td><br/></td>
         <td><br/></td>
      </tr>
   </tbody>
</table>
<p><br/></p>`
        });
    });
    afterAll((done) => {
        destroy(editorObj);
        done();
    });
    it('Should not add the table style to the list LI element', (done) => {
        (editorObj as any).inputElement.focus();
        const selection = document.getSelection();
        const range = selection.getRangeAt(0);
        selection.removeAllRanges();
        const newRange = document.createRange();
        const table = (editorObj as any).inputElement.querySelector('table');
        newRange.setStartBefore(table);
        newRange.setEndBefore(table);
        selection.addRange(newRange);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        expect((editorObj.inputElement.querySelector('UL li') as HTMLElement).style.height !== table.style.height).toBe(true);
        done();
    });
});

describe('978392 - Image disappears when pressing backspace before image inside a list item.', ()=> {
    let editor: RichTextEditor;
    beforeAll(() => {
        editor = renderRTE({
            value: `<ul>
                    <li>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images.</li>
                    <li class='focusNode'><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"/></li>
                    </ul>`
        });
    });
    afterAll((done: DoneFn)=> {
        destroy(editor);
        done();
    });
    it('Now, the Rich Text Editor works properly when pressing backspace before an image in a list item, and the image no longer disappears.', (done: DoneFn)=> {
        editor.focusIn();
        const startNode: Element = editor.inputElement.querySelector('.focusNode');
        setCursorPoint(startNode, 0);
        const backspaceEvent: KeyboardEvent = new KeyboardEvent('keydown', BACKSPACE_EVENT_INIT);
        expect(editor.inputElement.querySelectorAll('li').length).toBe(2);
        editor.inputElement.dispatchEvent(backspaceEvent);
        expect(editor.inputElement.innerHTML === `<ul> <li>The Editor can integrate with the Syncfusion Image Editor to crop, rotate, annotate, and apply filters to images.</li> <li class="focusNode"><img alt="Sky with sun" src="https://cdn.syncfusion.com/ej2/richtexteditor-resources/RTE-Overview.png" style="width: 50%" class="e-rte-image e-imginline"></li> </ul`);
        done();
   });
});

describe('Tab key indentation with maxLength', () => {
    let editorObj: any;
    let editNode: HTMLElement;
    let startNode: Node;
    let keyBoardEvent: any;

    beforeAll((done: Function) => {
        editorObj = renderRTE({
            value: '<ul><li>1234567890</li></ul>',
            enableTabKey: true,
            maxLength: 10
        });
        editNode = editorObj.inputElement;
        done();
    });

    afterAll((done: Function) => {
        destroy(editorObj);
        done();
    });

    it('Should not indent list when maxLength is reached and enableTabKey is true', (done: Function) => {
        editorObj.focusIn();
        startNode = editNode.querySelector('li');
        editorObj.formatter.editorManager.nodeSelection.setCursorPoint(document, startNode, 0);
        keyBoardEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
            key: 'Tab',
            code: 'Tab',
            keyCode: 9,
            which: 9,
            shiftKey: false,
            action: 'tab'
        };
        editorObj.formatter.editorManager.editorKeyDown({ event: keyBoardEvent });
        setTimeout(() => {
            const updatedText: string = editNode.querySelector('li').textContent;
            expect(updatedText).toBe('1234567890');
            done();
        }, 50);
    });
});
describe('994950 - Complete Revert list for complex nested list with intendation', () => {
    let editorObj: RichTextEditor;
    beforeEach(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList', 'CheckList', 'Indent']
            }
        });
    });
    afterEach(() => {
        destroy(editorObj);
    });
    it('Should completely revert the selected complex list items', (done) => {
        editorObj.inputElement.innerHTML = `<ul style="list-style-image: none; list-style-type: circle;"> <li style="list-style-type: none;"> <ul style="list-style-type: circle;"> <li class="selection-start">list 1</li> <li>list 2 <ul style="list-style-type: circle;"> <li>sub list 1</li> <li>sub list 2</li> <li>sub list 3</li> </ul> </li> <li class="selection-end">list 3</li> </ul> </li> </ul>`;
        let startNode = editorObj.inputElement.querySelector('.selection-start');
        let endNode = editorObj.inputElement.querySelector('.selection-end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, endNode.firstChild.textContent.length);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll('li').length).toBe(0);
            expect(editorObj.inputElement.querySelectorAll('p').length).toBe(6);
            expect(editorObj.inputElement.querySelector('.selection-start').nodeName).toBe('P');
            done();
        }, 100);
    });
    it('Select the entire list and apply the indent, should properly create the nested list', (done) => {
        editorObj.inputElement.innerHTML = `<ul style="list-style-image: none; list-style-type: circle;"><li>list 1</li><li>list 2</li></ul>`;
        let startNode = editorObj.inputElement.querySelector('ul');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstElementChild.firstChild, startNode.lastElementChild.firstChild, 0, 2);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[3] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll('ul').length).toBe(2);
            done();
        }, 100);
    });
});
describe('994501 - Complete Revert list Testing', () => {
    let editorObj: RichTextEditor;
    beforeEach(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList', 'CheckList']
            }
        });
    });
    afterEach(() => {
        destroy(editorObj);
    });
    it('Reverting the list item with hr element', (done) => {
        editorObj.inputElement.innerHTML = `<ul><li class="selection-start">list 1</li><li>list 2</li><li><hr></li><li class="selection-end">list 3</li></ul>`;
        let startNode = editorObj.inputElement.querySelector('.selection-start');
        let endNode = editorObj.inputElement.querySelector('.selection-end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, endNode.firstChild, 0, endNode.firstChild.textContent.length);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll('li').length).toBe(0);
            expect(editorObj.inputElement.querySelectorAll('hr').length).toBe(1);
            done();
        }, 100);
    });
    it('Reverting the nested checkList', (done) => {
        editorObj.inputElement.innerHTML = `<ul class="e-rte-checklist"><li>list 1<ul class="e-rte-checklist"><li>sub list 1</li><li class="selection" >sub list 2</li><li>sub list 3</li></ul></li><li>list 2</li></ul>`;
        let startNode = editorObj.inputElement.querySelector('.selection');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[2] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll('.e-rte-checklist').length).toBe(4);
            expect(editorObj.inputElement.querySelectorAll('.e-rte-checklist-hidden').length).toBe(1);
            expect(editorObj.inputElement.querySelector('.selection').nodeName).toBe('P');
            done();
        }, 100);
    });
});

describe('983729 - Complete Revert list Testing', () => {
    let editorObj: RichTextEditor;
    beforeEach(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList', 'CheckList']
            }
        });
    });
    afterEach(() => {
        destroy(editorObj);
    });
    it('Reverting the indent applied list item', (done) => {
        editorObj.value = `<ul><li>list-1<ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li class="selection">list-2</li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></li></ul></li><li>list-3</li></ul>`;
        editorObj.dataBind();
        let startNode = editorObj.inputElement.querySelector('.selection');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === '<ul><li>list-1</li></ul><p class="selection">list-2</p><ul><li>list-3</li></ul>').toBe(true);
            done();
        }, 100);
    });
    it('Reverting the list of partial selection', (done) => {
        editorObj.value = `<ul><li>one<ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li class="start">two<ul><li class="end">four</li><li>five</li></ul></li></ul></li></ul></li></ul></li><li>three</li></ul>`;
        editorObj.dataBind();
        let startNode = editorObj.inputElement.querySelector('.start');
        let endNode = editorObj.inputElement.querySelector('.end');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, endNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === '<ul><li>one</li></ul><p class="start">two</p><p class="end">four</p><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li>five</li></ul></li></ul></li></ul></li></ul></li><li>three</li></ul>').toBe(true);
            done();
        }, 100);
    });
    it('Reverting the checkList', (done) => {
        editorObj.value = `<ul class="e-rte-checklist"><li>one</li><li class="e-rte-checklist-checked selection">two</li><li class="e-rte-checklist-checked">three</li></ul>`;
        editorObj.dataBind();
        let startNode = editorObj.inputElement.querySelector('.selection');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[2] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ul class="e-rte-checklist"><li>one</li></ul><p class="selection">two</p><ul class="e-rte-checklist"><li class="e-rte-checklist-checked">three</li></ul>`).toBe(true);
            done();
        }, 100);
    });
    it('Reverting the list with block elements', (done) => {
        editorObj.value = `<ul><li>one<ul><li style="list-style-type: none;"><ul><li><h3>two</h3></li><li><h3>four</h3></li></ul></li></ul></li><li>three</li></ul>`;
        editorObj.dataBind();
        let startNode = editorObj.inputElement.querySelector('h3');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.innerHTML === `<ul><li>one</li></ul><h3>two</h3><ul><li style="list-style-type: none;"><ul><li style="list-style-type: none;"><ul><li><h3>four</h3></li></ul></li></ul></li><li>three</li></ul>`).toBe(true);
            done();
        }, 100);
    });
    it('Reverting the list table element', (done) => {
        editorObj.value = `<ul><li>one<ul><li style="list-style-type: none;"><ul><li class="start">two</li><li><table class="e-rte-table" style="width: 100%; min-width: 0px;"><colgroup><col style="width: 33.3333%;"><col style="width: 33.3333%;"><col style="width: 33.3333%;"></colgroup><tbody><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table><br></li></ul></li></ul></li><li>three</li></ul>`;
        editorObj.dataBind();
        let startNode = editorObj.inputElement.querySelector('.start');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        setTimeout(() => {
            expect(editorObj.inputElement.querySelectorAll('.e-rte-table').length === 1).toBe(true);
            expect(editorObj.inputElement.querySelector('table').parentElement.nodeName === 'LI').toBe(true);
            done();
        }, 100);
    });
});

describe('979095 - Bullet list element comes with font color even after removing the font from the list content in RichTextEditor', () => {
    let editorObj: RichTextEditor;
    beforeAll(() => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['OrderedList', 'UnorderedList']
            },
            value: `<ul><li style="color: rgb(255, 0, 0); text-decoration: inherit;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">ppppppp</span><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><br></span><span style="color: rgb(255, 0, 0); text-decoration: inherit;">ffffffffffff</span></li></ul>`
        });
    });
    afterAll(() => {
        destroy(editorObj);
    });
    it('Now, the Rich Text Editor works properly by removing font color from bullet list elements when the font is cleared from the list content.', (done) => {
        let startNode = editorObj.inputElement.querySelector('li');
        editorObj.formatter.editorManager.nodeSelection.setSelectionText(document, startNode.firstChild, startNode.lastChild, 0, 1);
        (editorObj.element.querySelectorAll(".e-toolbar .e-toolbar-item")[1] as HTMLElement).click();
        expect(editorObj.inputElement.innerHTML === '<p style="text-decoration: inherit;"><span style="color: rgb(255, 0, 0); text-decoration: inherit;">ppppppp</span><span style="color: rgb(255, 0, 0); text-decoration: inherit;"><br></span><span style="color: rgb(255, 0, 0); text-decoration: inherit;">ffffffffffff</span></p>').toBe(true);
        done();
    });
});