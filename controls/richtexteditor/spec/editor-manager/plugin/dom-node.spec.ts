/**
 * DOMNode plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { DOMNode } from '../../../src/editor-manager/plugin/dom-node';
import { NodeSelection, } from '../../../src/selection/index';

describe('DOMNode plugin', () => {
    let domSelection: NodeSelection = new NodeSelection();
    describe('node public methods testing', () => {
        let domNode: DOMNode;
        let elem: HTMLElement = createElement('div', {
            id: 'dom-node', innerHTML: `
        <span style="color:red;" contenteditable="true" class="e-node-deletable e-node-inner">
          <p>dom node
           <a href="https://www.google.com" tabindex="1">Google</a>
           <img alt="todd's kitty"/>
           <label>Replace<label>
          </p>
          <div>
            <span> span node</span>
            <p> p node</p>
          </div>
          <ol onClick="alert(&quot; Let's change it &quot;)" style='color: rgb(92, 92, 92);font-family:"Times New Roman", Times, serif; font-size: medium;'>
            <li>one
                <ol>
                    <li><p>one-1</p></li>
                    <li><p>one-2</p></li>
                </ol>
            </li>
            <li>two</li>
          </ol>
          <span class='last-span-node'>
            <p>Last span node</p>
          </span>
         </span>
         <ol>
           <li>one</li>
           <li>two</li>
         </ol>
         <iframe id="iframe"></iframe>
         ` });
        let elem2: HTMLElement = createElement('div', { id: 'dom-node-iframe', innerHTML: '<iframe id="iframe"></iframe>' });
        beforeAll(() => {
            document.body.appendChild(elem);
            (Element.prototype as any).replaceWith = null;
            (CharacterData.prototype as any).replaceWith = null;
            (DocumentType.prototype as any).replaceWith = null;
            domNode = new DOMNode(document.body, document);
        });

        it('contents method', () => {
            expect(domNode.contents(elem).length === 7).toBe(true);
            let pEle: HTMLElement = elem.querySelector('p');
            expect(domNode.contents(pEle.childNodes[0] as Element).length === 0).toBe(true);
            let iframe: HTMLIFrameElement = <HTMLIFrameElement>document.getElementById('iframe');
            expect(domNode.contents(iframe).length === 0).toBe(true);
        });

        it('isBlockNode method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            let pEle: HTMLElement = elem.querySelector('p');
            expect(domNode.isBlockNode(spanEle)).toBe(false);
            expect(domNode.isBlockNode(pEle)).toBe(true);
        });

        it('isLink method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            let anchorEle: HTMLElement = elem.querySelector('a');
            expect(domNode.isLink(spanEle)).toBe(false);
            expect(domNode.isLink(anchorEle)).toBe(true);
        });

        it('blockParentNode method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            let anchorEle: HTMLElement = elem.querySelector('a');
            expect(domNode.blockParentNode(spanEle).id === 'dom-node').toBe(true);
            expect(domNode.blockParentNode(anchorEle).tagName === 'P').toBe(true);
            expect(domNode.blockParentNode(null) === null).toBe(true);
        });

        it('rawAttributes method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            let pEle: HTMLElement = elem.querySelector('p');
            expect(domNode.rawAttributes(spanEle).style === 'color:red;').toBe(true);
            expect(Object.keys(domNode.rawAttributes(pEle)).length === 0).toBe(true);
        });

        it('attributes method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            expect(domNode.attributes(spanEle) === ' class="e-node-deletable e-node-inner" contenteditable="true" style="color:red;"').toBe(true);
            expect(domNode.attributes() === '').toBe(true);
            let olEle: HTMLElement = elem.querySelector('ol');
            let attr: string = domNode.attributes(olEle);
            let newElement: Element = domNode.parseHTMLFragment("<span" + attr + "></span>");
            expect(Object.keys(domNode.rawAttributes(newElement.firstElementChild)).length == 2).toBe(true);
        });

        it('openTagString method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            spanEle.style.color = 'red';
            expect(domNode.openTagString(spanEle) === '<span class="e-node-deletable e-node-inner" contenteditable="true" style="color:red;">').toBe(true);
        });

        it('closeTagString method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            expect(domNode.closeTagString(spanEle) === '</span>').toBe(true);
        });

        it('createTagString method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            let matchStr: String = '<h4 class="e-node-deletable e-node-inner" contenteditable="true" style="color:red;">h4 format</h4>';
            expect(domNode.createTagString('h4', spanEle, 'h4 format') === matchStr).toBe(true);
        });

        it('isList method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            let olEle: HTMLElement = elem.querySelector('ol');
            expect(domNode.isList(spanEle)).toBe(false);
            expect(domNode.isList(olEle)).toBe(true);
        });

        it('isElement method', () => {
            let pEle: HTMLElement = elem.querySelector('p');
            expect(domNode.isElement(pEle)).toBe(false);
            expect(domNode.isElement(document.body)).toBe(true);
        });

        it('isEditable method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            expect(domNode.isEditable(spanEle)).toBe(true);
            expect(domNode.isEditable(elem)).toBe(false);
        });

        it('hasClass method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            expect(domNode.hasClass(spanEle, 'e-node-deletable')).toBe(true);
        });

        it('replaceWith method', () => {
            let labelEle: HTMLElement = elem.querySelector('label');
            let spanEle: HTMLElement = elem.querySelector('span');
            domNode.replaceWith(labelEle, '<span>replace content</span>');
            expect(spanEle.querySelector('span').textContent === 'replace content').toBe(true);
        });

        it('wrap method', () => {
            let newElement: Element = document.createElement('div');
            newElement.id = 'new-element';
            let spanEle: HTMLElement = elem.querySelector('span');
            let element: Element = domNode.wrap(spanEle, newElement as any);
            expect(spanEle.parentElement.id === 'new-element').toBe(true);
        });


        it('blockNodes method', () => {
            let edit: HTMLElement = elem.querySelector('[contenteditable="true"]');
            edit.focus();
            let start: Element = edit.querySelector('p');
            let end: Element = edit.querySelector('div');
            domSelection.setSelectionText(document, start.childNodes[0], end.childNodes[2], 1, 3);
            let nodes: Node[] = domNode.blockNodes();
            expect(nodes.length === 2).toBe(true);
            expect((nodes[0] as Element).tagName === 'P').toBe(true);
            expect((nodes[1] as Element).tagName === 'DIV').toBe(true);
            domSelection.Clear(document);

            start = edit.querySelector('p');
            end = edit.querySelector('ol');
            domSelection.setSelectionText(document, start.childNodes[1], end.childNodes[4], 1, 3);
            nodes = domNode.blockNodes();
            expect(nodes.length === 3).toBe(true);
            domSelection.Clear(document);

            start = edit.querySelector('p');
            end = edit.querySelector('.last-span-node');
            domSelection.setSelectionText(document, start.childNodes[1], end.childNodes[2], 1, 3);
            nodes = domNode.blockNodes();
            expect(nodes.length === 7).toBe(true);
            domSelection.Clear(document);

            start = edit.querySelector('p');
            end = edit.querySelector('ol');
            domSelection.setSelectionText(document, start.childNodes[1], end.childNodes[0], 1, 3);
            nodes = domNode.blockNodes();
            expect(nodes.length === 3).toBe(true);
            domSelection.Clear(document);

            start = edit.querySelector('p');
            end = edit.querySelector('ol');
            domSelection.setSelectionText(document, start, end.childNodes[0], 1, 3);
            nodes = domNode.blockNodes();
            expect(nodes.length === 3).toBe(true);
            domSelection.Clear(document);

        });

        it('getSelection method', () => {
            let edit: HTMLElement = elem.querySelector('[contenteditable="true"]');
            edit.focus();
            let start: Element = edit.querySelector('p');
            let end: Element = edit.querySelector('div');
            domSelection.setSelectionText(document, start.childNodes[0], end.childNodes[2], 1, 3);
            let selection: Selection = domNode.getSelection();
            expect(selection.rangeCount === 1).toBe(true);
            domSelection.Clear(document);

        });

        it('getRangePoint method', () => {
            let edit: HTMLElement = elem.querySelector('[contenteditable="true"]');
            let start: Element = edit.querySelector('p');
            let range: Range = <Range>domNode.getRangePoint(0);
            expect(range.startOffset == 0 && range.endOffset === 0).toBe(true);

            let ranges: Range[] = <Range[]>domNode.getRangePoint();
            expect(ranges[0].startOffset == 0 && ranges[0].endOffset === 0).toBe(true);

            domSelection.setSelectionNode(document, start.childNodes[0]);
            ranges = <Range[]>domNode.getRangePoint();
            expect(ranges[0].startOffset == 0 && ranges[0].endOffset === 20).toBe(true);
        });

        it('wrapInner method', () => {
            let edit: HTMLElement = elem.querySelector('[contenteditable="true"]');
            let start: Element = edit.querySelector('ol');
            let wrapper: Element = (start.childNodes[1] as Element).querySelector('li').childNodes[0] as Element;
            domNode.wrapInner(wrapper, domNode.parseHTMLFragment('<span class="e-rte-wrap-inner"></span>'));
            expect((wrapper.childNodes[0] as Element).tagName === 'SPAN').toBe(true);
        });

        it('insertAfter method', () => {
            let edit: HTMLElement = elem.querySelector('[contenteditable="true"]');
            let start: Element = edit.querySelector('ol');
            let reference: Element = (start.childNodes[1] as Element).querySelector('li').childNodes[0] as Element;
            domNode.insertAfter(domNode.parseHTMLFragment('<span class="insert-after-tag">Insert Tag</span>'), reference);
            expect((reference.nextSibling as Element).classList.contains('insert-after-tag')).toBe(true);
        });
        it('parseHTMLFragment method', () => {
            let element: Element = domNode.parseHTMLFragment('<span id="new-frag">replace content</span>');
            elem.appendChild(element)
            expect(elem.querySelector('#new-frag').textContent === 'replace content').toBe(true);
        });

        it('clearAttributes method', () => {
            let spanEle: HTMLElement = elem.querySelector('span');
            domNode.clearAttributes(spanEle);
            expect(spanEle.hasAttribute('style')).toBe(false);
        });
        afterAll(() => {
            detach(elem);
        });
    });

});