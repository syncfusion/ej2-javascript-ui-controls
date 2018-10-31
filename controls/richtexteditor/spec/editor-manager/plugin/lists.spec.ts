/**
 * Lists plugin spec
 */
import { createElement, detach, isNullOrUndefined } from '@syncfusion/ej2-base';
import { EditorManager } from '../../../src/editor-manager/index';
import { NodeSelection, } from '../../../src/selection/index';

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

    describe(' OL testing', () => {
        let editorObj: EditorManager;
        let editNode: HTMLElement;
        let startNode: HTMLElement;
        let endNode: HTMLElement;
        let keyBoardEvent: any = { callBack: function () { }, event: { action: null, preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9 } };

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
                expect(startNode.childNodes.length === 1).toBe(true);
                expect(endNode.childNodes.length === 1).toBe(true);
                expect(startNode.tagName === 'OL').toBe(true);
                expect(startNode.tagName === 'OL').toBe(true);
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
                startNode = editNode.querySelector('ol').childNodes[0] as HTMLElement;
                endNode = editNode.querySelector('ol').childNodes[1] as HTMLElement;
                expect(startNode.textContent === 'First p node-0').toBe(true);
                expect(endNode.textContent === 'First p node-1').toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' apply the OL format to already applied "OL" format elements', () => {
                startNode = editNode.querySelector('.first-p-node');
                endNode = editNode.querySelector('.ol-first-node');
                editorObj.nodeSelection.setSelectionText(document, startNode.childNodes[0].childNodes[0], endNode.childNodes[1].childNodes[0].childNodes[0], 0, 4);
                editorObj.execCommand("Lists", 'OL', null);
                startNode = editNode.querySelector('.first-p-node');
                endNode = elem.querySelector('.second-p-node');
                expect(startNode).toBeNull();
                expect(endNode).toBeNull();

                startNode = editNode.querySelector('.first-label');
                endNode = editNode.querySelector('.second-label');
                expect((startNode.parentNode as Element).tagName === 'P').toBe(true);
                expect((endNode.parentNode as Element).tagName === 'P').toBe(true);

                let replaceNodes: Element[] = <Element[] & NodeListOf<Element>>editNode.querySelectorAll('p.ol-first-node');
                let olP3: Element = replaceNodes[0]
                let olP4: Element = replaceNodes[1];
                expect((olP3.parentNode as Element).tagName !== 'LI').toBe(true);
                expect((olP4.parentNode as Element).tagName !== 'LI').toBe(true);

                editorObj.nodeSelection.Clear(document);
            });

            it(' revert from parent LI node and nested LI selection point', () => {
                startNode = editNode.querySelector('.ol-second-node');
                endNode = startNode.childNodes[1].childNodes[1].childNodes[1] as HTMLElement;
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
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
                expect(startNode.tagName === 'OL').toBe(true);
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
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: olHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' tab key navigation from first li start point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node').querySelector('ol');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li and second point', () => {
                startNode = editNode.querySelector('.ol-third-node');
                expect(startNode.querySelector('ol')).toBeNull();
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
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
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

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
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "OL" first li node start point', () => {
                startNode = editNode.querySelector('.ol-third-node').querySelector('ol').childNodes[0] as HTMLElement;
                startNode = startNode.childNodes[0] as HTMLElement;
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

                startNode = editNode.querySelector('.ol-first-node').querySelector('ol');
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "OL" li "p" element start point', () => {
                startNode = editNode.querySelector('.ol-first-node').querySelector('ol').childNodes[0] as HTMLElement;
                startNode = startNode.childNodes[0] as HTMLElement;
                setCursorPoint(startNode.childNodes[0] as Element, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.childNodes[0].textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.childNodes[0].textContent).toBe(true);

                startNode = editNode.querySelector('.ol-third-node')
                expect(startNode.childNodes.length === 3).toBe(true);
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
                expect(startNode.childNodes.length == 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from second li start point of nested OL element', () => {
                startNode = editNode.querySelector('.ol-second-node');
                startNode = startNode.childNodes[0].childNodes[1].childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ol-second-node');
                expect(startNode.childNodes.length == 2).toBe(true);
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
                startNode = startNode.childNodes[0] as HTMLElement;
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
                expect(startNode.childNodes.length === 1).toBe(true);
                expect(endNode.childNodes.length === 1).toBe(true);
                expect(startNode.tagName === 'UL').toBe(true);
                expect(startNode.tagName === 'UL').toBe(true);
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
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                endNode = endNode.childNodes[1].childNodes[0].childNodes[0] as HTMLElement;
                editorObj.nodeSelection.setSelectionText(document, startNode, endNode, 0, 4);
                editorObj.execCommand("Lists", 'UL', null);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === endNode.textContent).toBe(true);

                startNode = editNode.querySelector('.first-p-node');
                endNode = elem.querySelector('.second-p-node');
                expect(startNode).toBeNull();
                expect(endNode).toBeNull();

                startNode = editNode.querySelector('.first-label');
                endNode = editNode.querySelector('.second-label');
                expect((startNode.parentNode as Element).tagName === 'P').toBe(true);
                expect((endNode.parentNode as Element).tagName === 'P').toBe(true);

                let replaceNodes: Element[] = <Element[] & NodeListOf<Element>>editNode.querySelectorAll('p.ul-first-node');
                let ulP3: Element = replaceNodes[0]
                let ulP4: Element = replaceNodes[1];
                expect((ulP3.parentNode as Element).tagName !== 'LI').toBe(true);
                expect((ulP4.parentNode as Element).tagName !== 'LI').toBe(true);

                editorObj.nodeSelection.Clear(document);
            });

            it(' revert from parent LI node and nested LI selection point', () => {
                startNode = editNode.querySelector('.ul-second-node');
                endNode = startNode.childNodes[1].childNodes[1].childNodes[1] as HTMLElement;
                startNode = startNode.childNodes[1].childNodes[0] as HTMLElement;
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

        describe(' ul format with tab and shift+tab key', () => {
            let elem: HTMLElement = createElement('div', {
                id: 'dom-node', innerHTML: ulHTML.trim()
            });
            beforeAll(() => {
                document.body.appendChild(elem);
                editorObj = new EditorManager({ document: document, editableElement: document.getElementById("content-edit") });
                editNode = editorObj.editableElement as HTMLElement;
            });

            it(' tab key navigation from first li start point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-third-node').querySelector('ul');
                expect(startNode).toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' tab key navigation from second li and second point', () => {
                startNode = editNode.querySelector('.ul-third-node');
                expect(startNode.querySelector('ul')).toBeNull();
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
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
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 2);
                editNode.focus();
                keyBoardEvent.event.which = 13;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

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
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "ul" first li node start point', () => {
                startNode = editNode.querySelector('.ul-third-node').querySelector('ul').childNodes[0] as HTMLElement;
                startNode = startNode.childNodes[0] as HTMLElement;
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

                startNode = editNode.querySelector('.ul-first-node').querySelector('ul');
                expect(startNode).not.toBeNull();
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from nested "ul" li "p" element start point', () => {
                startNode = editNode.querySelector('.ul-first-node').querySelector('ul').childNodes[0] as HTMLElement;
                startNode = startNode.childNodes[0].childNodes[0] as HTMLElement;
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
                expect(startNode.childNodes.length == 1).toBe(true);
                editorObj.nodeSelection.Clear(document);
            });

            it(' shift+tab key navigation from second li start point of nested ul element', () => {
                startNode = editNode.querySelector('.ul-second-node');
                startNode = startNode.childNodes[0].childNodes[1].childNodes[1].childNodes[0] as HTMLElement;
                setCursorPoint(startNode, 0);
                editNode.focus();
                keyBoardEvent.event.shiftKey = true;
                (editorObj as any).editorKeyDown(keyBoardEvent);

                expect((editorObj.listObj as any).saveSelection.range.startContainer.textContent === startNode.textContent).toBe(true);
                expect((editorObj.listObj as any).saveSelection.range.endContainer.textContent === startNode.textContent).toBe(true);

                startNode = editNode.querySelector('.ul-second-node');
                expect(startNode.childNodes.length == 2).toBe(true);
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

    });
});