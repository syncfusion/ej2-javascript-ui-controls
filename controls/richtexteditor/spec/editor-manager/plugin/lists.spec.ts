/**
 * Lists plugin spec
 */
import { createElement, detach, isNullOrUndefined, selectAll, Browser } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';

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
                expect((editorObj.nodeSelection.range.startContainer as HTMLElement).classList.contains('startfocus')).toBe(true);
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
                editorObj.execCommand("Lists", 'OL', null);
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
                expect(editNode.querySelectorAll('.ol-second-node').length === 3).toBe(true);
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
                expect(editNode.querySelectorAll('p.ol-second-node').length === 2).toBe(true);
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
                expect(startNode).toBeNull();
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

        describe(' ul format with tab and shift+tab key', () => {
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
                expect(startNode).toBeNull();
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
                expect(startNode.tagName === 'UL').toBe(true);
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
    });

    describe(' UL testing', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };

        describe(' basic ul format apply and revert', () => {
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
                expect(startNode.tagName === 'OL').toBe(true);
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
                expect(editNode.querySelector('.selectnode').parentElement.tagName).toBe('OL');
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
                expect(sublist.parentElement.parentElement.tagName !== 'UL').toBe(true);
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
                expect(sublist.parentElement.parentElement.tagName !== 'UL').toBe(true);
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
        
    });

    describe(' EJ2-29800 - Reactive form validation not working properly', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let content: string = `<div style="color:red;" id="content-edit" contenteditable="true" class="e-node-deletable e-node-inner"><p><br></p></div>`;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let elem: HTMLElement;
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
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

        afterAll(() => {
            detach(elem);
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
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
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

        afterAll(() => {
            detach(elem);
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
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
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

        afterAll(() => {
            detach(elem);
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
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
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

        afterAll(() => {
            detach(elem);
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
        beforeEach(() => {
            elem = createElement('div', {
                id: 'dom-node', innerHTML: content.trim()
            });
            document.body.appendChild(elem);
            editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
            editNode = editorObj.editableElement as HTMLElement;
        });
        afterEach(() => {
            detach(elem);
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
    
    describe('EJ2-58466 - list with font size Backspace key press testing', () => {
        let elem: HTMLElement;
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: true, which: 9 } };
        let innerValue: string = `<div id="content-edit" contenteditable="true"><ol><li style="font-size: 24pt;" class="focusNode"><br></li><li style="font-size: 24pt;"><span style="font-size: 24pt;">RTE Content 2</span></li></ol><div>`;
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

        it(' backspace keypress after font size changed in the first list with empty content changes the font size', () => {
            startNode = editNode.querySelector('.focusNode');
            setCursorPoint(startNode, 0);
            keyBoardEvent.event.shiftKey = false;
            keyBoardEvent.action = 'backspace';
            keyBoardEvent.event.which = 8;
            (editorObj as any).editorKeyDown(keyBoardEvent);
            let liNode: Element = editNode.querySelector('li');
            expect(liNode.getAttribute('style')).toBe(null);
        });

        afterAll(() => {
            detach(elem);
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
        beforeEach( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterEach( () => {
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
        beforeEach( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterEach( () => {
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
        beforeEach( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterEach( () => {
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
        beforeEach( () => {
            elem = createElement( 'div', {
                id: 'dom-node', innerHTML: innerValue
            } );
            document.body.appendChild( elem );
            editorObj = new EditorManager( { document: document, editableElement: document.getElementById( "content-edit" ) } );
            editNode = editorObj.editableElement as HTMLElement;
        } );
        afterEach( () => {
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
});
