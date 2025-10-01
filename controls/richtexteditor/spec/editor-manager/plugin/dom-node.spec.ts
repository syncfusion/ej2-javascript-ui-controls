/**
 * DOMNode plugin spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { DOMNode } from '../../../src/editor-manager/plugin/dom-node';
import { NodeSelection, } from '../../../src/selection/index';
import { RichTextEditor } from '../../../src/rich-text-editor';
import { renderRTE , destroy} from '../../rich-text-editor/render.spec';

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
          <ol onClick="alert(&quot; Let's change it &quot;)" style='color: rgb(92, 92, 92);font-family:"Times New Roman",
          Times, serif; font-size: medium;'>
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

    describe('850070 - Number list not applied properly to the paragraph content when the content is inside the table', () => {
        let editor: RichTextEditor;
        const content: string = '<table class="e-rte-table" style="width: 32.6738%; min-width: 0px; height: 26px;">\n            <tbody>\n                <tr>\n                    <td class="" style="width: 100%;">\n                        Item 1\n                        <br>\n                        Item 2\n                        <br>\n                        Item 3\n                        <br>\n                    </td>\n                </tr>\n            </tbody>\n        </table><p><br></p><table class="e-rte-table" style="width: 20.7487%; min-width: 0px; height: 97px;">\n            <tbody>\n                <tr>\n                    <td class="" style="width: 100%;"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The\n                            Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit\n                            content and return the valid<span>&nbsp;</span></span><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style=" background-color: rgb(255, 255, 255); color: rgb(46, 46, 241); text-decoration: none; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal;">HTML\n                            markup</a><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>or<span>&nbsp;</span></span><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style=" background-color: rgb(255, 255, 255); color: rgb(46, 46, 241); text-decoration: none; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal;">markdown</a><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>of\n                            the content</span><br></td>\n                </tr>\n            </tbody>\n        </table><p><br></p><table class="e-rte-table" style="width: 20.6952%; min-width: 0px; height: 64px;">\n            <tbody>\n                <tr>\n                    <td class="" style="width: 100%;">\n                        <strong>\n                            This ia&nbsp; a paragraph\n                        </strong>\n                        Which has two nodes.\n                    </td>\n                </tr>\n            </tbody>\n        </table><p><br></p><table class="e-rte-table" style="width: 20.7487%; min-width: 0px; height: 97px;">\n            <tbody>\n                <tr>\n                    <td class="" style="width: 100%;"><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The\n                            Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit\n                            content and return the valid<span>&nbsp;</span></span><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style=" background-color: rgb(255, 255, 255); color: rgb(46, 46, 241); text-decoration: none; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal;">HTML\n                            markup</a><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>or<span>&nbsp;</span></span><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style=" background-color: rgb(255, 255, 255); color: rgb(46, 46, 241); text-decoration: none; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal;">markdown</a><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>of\n                            the content</span><br>\n                            <p>\n                                <strong>\n                                    This ia&nbsp; a paragraph\n                                </strong>\n                                Which has two nodes.\n                            </p>\n                            <span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;">The\n                            Rich Text Editor is a WYSIWYG ("what you see is what you get") editor useful to create and edit\n                            content and return the valid<span>&nbsp;</span></span><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style=" background-color: rgb(255, 255, 255); color: rgb(46, 46, 241); text-decoration: none; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal;">HTML\n                            markup</a><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>or<span>&nbsp;</span></span><a href="https://ej2.syncfusion.com/home/" target="_blank" aria-label="Open in new window" style=" background-color: rgb(255, 255, 255); color: rgb(46, 46, 241); text-decoration: none; font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal;">markdown</a><span style="color: rgb(51, 51, 51); font-family: Roboto, &quot;Segoe UI&quot;, GeezaPro, &quot;DejaVu Serif&quot;, &quot;sans-serif&quot;, -apple-system, BlinkMacSystemFont; font-size: 14px; font-style: normal; font-weight: 400; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; background-color: rgb(255, 255, 255); display: inline !important; float: none;"><span>&nbsp;</span>of\n                            the content</span>\n                        </td>\n                </tr>\n            </tbody>\n        </table><p>\n            <strong>\n                This ia&nbsp; a paragraph\n            </strong>\n            Which has two nodes.\n        </p><p><br></p><span data-col="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 135px; width: 4px; top: 315px; left: 14px;"></span><span data-col="1" unselectable="on" contenteditable="false" class="e-rte-table-resize e-column-resize" style="height: 135px; width: 4px; top: 315px; left: 397px;"></span><span data-row="0" unselectable="on" contenteditable="false" class="e-rte-table-resize e-row-resize" style="width: 384px; height: 4px; top: 447px; left: 16px;"></span><span class="e-table-box" data-col="1" unselectable="on" contenteditable="false" style="top: 446px; left: 396px;"></span>';
        function applyFormat(): void {
            const wrapper: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
            (wrapper.childNodes[0] as HTMLElement).click();
            (document.body.querySelector('.e-h1') as HTMLElement).click();
        }

        function applyULList(): void {
            const wrapper: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[2] as HTMLElement;
            (wrapper.childNodes[0] as HTMLElement).click();
        }

        function applyOLList(): void {
            const wrapper: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
            (wrapper.childNodes[0] as HTMLElement).click();
        }

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'OrderedList', 'UnorderedList']
                },
                value: content
            });
        });

        afterEach(() => {
            destroy(editor);
        });

        it('Should apply the number list properly CASE 1 With Selection', () => {
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            let tdElem: HTMLElement = currentTable.querySelector('td');
            let range: Range = new Range();
            range.setStart(tdElem.childNodes[0], 1);
            range.setEnd(tdElem.childNodes[2], 3);
            const selectiOn: Selection = document.getSelection();
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            applyFormat();
            expect(tdElem.querySelectorAll('h1').length).toBe(2);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            editor.value = content;
            editor.dataBind();
            currentTable = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            tdElem = currentTable.querySelector('td');
            range = new Range();
            range.setStart(tdElem.childNodes[0], 1);
            range.setEnd(tdElem.childNodes[2], 3);
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            applyOLList();
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            expect(tdElem.querySelectorAll('li').length).toBe(2);
            editor.value = content;
            editor.dataBind();
            currentTable = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            tdElem = currentTable.querySelector('td');
            range = new Range();
            range.setStart(tdElem.childNodes[0], 1);
            range.setEnd(tdElem.childNodes[2], 3);
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            applyULList();
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            expect(tdElem.querySelectorAll('li').length).toBe(2);
        });

        it('Should apply the number list properly CASE 2 With Cursor', () => {
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            let tdElem: HTMLElement = currentTable.querySelector('td');
            let range: Range = new Range();
            range.setStart(tdElem.childNodes[0], 3);
            range.setEnd(tdElem.childNodes[0], 3);
            const selectiOn: Selection = document.getSelection();
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            applyFormat();
            expect(tdElem.querySelectorAll('h1').length).toBe(1);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            editor.value = content;
            editor.dataBind();
            currentTable = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            tdElem = currentTable.querySelector('td');
            range = new Range();
            range.setStart(tdElem.childNodes[0], 3);
            range.setEnd(tdElem.childNodes[0], 3);
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            applyOLList();
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            expect(tdElem.querySelectorAll('li').length).toBe(1);
            editor.value = content;
            editor.dataBind();
            currentTable = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            tdElem = currentTable.querySelector('td');
            range = new Range();
            range.setStart(tdElem.childNodes[0], 3);
            range.setEnd(tdElem.childNodes[0], 3);
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            applyULList();
            expect(tdElem.querySelectorAll('br').length).toBe(3);
            expect(tdElem.querySelectorAll('li').length).toBe(1);
        });

        it('Should apply the number list properly CASE 3 With Selection Combination inline and Block element', () => {
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('table')[3] as HTMLElement;
            let tdElem: HTMLElement = currentTable.querySelector('td');
            let range: Range = new Range();
            range.setStart(tdElem.childNodes[0].childNodes[3].firstChild, 0);
            range.setEnd(tdElem.childNodes[4].childNodes[1], 1);
            const selectiOn: Selection = document.getSelection();
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(1);
            applyFormat();
            expect(tdElem.querySelectorAll('h1').length).toBe(3);
            expect(tdElem.querySelectorAll('br').length).toBe(1);
        });
    });

    describe('850070 - Number list not applied properly to the paragraph content when the content is inside the table - Case 2', () => {
        let editor: RichTextEditor;
        const content: string = '<table class="e-rte-table" style="width: 18.7166%; min-width: 0px; height: 159px;"><tbody><tr style="height: 99.3711%;"><td class="" style="width: 99.7143%;">Item 1&nbsp;<br>Item 2<br>Item 3<br><br><br><br></td></tr></tbody></table><p><br></p>';
        function applyFormat(): void {
            const wrapper: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement;
            (wrapper.childNodes[0] as HTMLElement).click();
            (document.body.querySelector('.e-h1') as HTMLElement).click();
        }

        function applyULList(): void {
            const wrapper: HTMLElement = editor.element.querySelectorAll('.e-toolbar-item')[2] as HTMLElement;
            (wrapper.childNodes[0] as HTMLElement).click();
        }

        beforeEach(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['Formats', 'OrderedList', 'UnorderedList']
                },
                value: content
            });
        });
        afterEach(() => {
            destroy(editor);
        });

        it('Should not remove the BR element when applying format', () => {
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            let tdElem: HTMLElement = currentTable.querySelector('td');
            let range: Range = new Range();
            range.setStart(tdElem.childNodes[0], 3);
            range.setEnd(tdElem.childNodes[7], 0);
            const selectiOn: Selection = document.getSelection();
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(6);
            applyFormat();
            expect(tdElem.querySelectorAll('h1').length).toBe(5);
            expect(tdElem.querySelectorAll('br').length).toBe(6);
            expect(tdElem.querySelectorAll('br')[5].parentElement.nodeName === 'P').toBe(true); // Issue
        });

        it('Should apply Heading format properly on Empty TD', () => {
            editor.value = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 100%;"><br></td></tr></tbody></table>';
            editor.dataBind();
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            let tdElem: HTMLElement = currentTable.querySelector('td');
            let range: Range = new Range();
            range.setStart(tdElem.childNodes[0], 0);
            range.setEnd(tdElem.childNodes[0], 0);
            const selectiOn: Selection = document.getSelection();
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('br').length).toBe(1);
            applyFormat();
            expect(tdElem.querySelectorAll('h1').length).toBe(1);
            expect(tdElem.querySelectorAll('br').length).toBe(1);
            expect(tdElem.innerHTML === '<h1><br></h1>').toBe(true); // Issue
        });

        it('Should apply Unordered List properly on In between text', () => {
            editor.value = '<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 100%;">The Rich<strong> Text</strong> Editor.</td></tr></tbody></table><p><br></p>';
            editor.dataBind();
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('table')[0] as HTMLElement;
            let tdElem: HTMLElement = currentTable.querySelector('td');
            let range: Range = new Range();
            range.setStart(tdElem.querySelector('strong').firstChild, 1);
            range.setEnd(tdElem.querySelector('strong').firstChild, 1);
            const selectiOn: Selection = document.getSelection();
            selectiOn.removeAllRanges();
            selectiOn.addRange(range);
            expect(tdElem.querySelectorAll('li').length).toBe(0);
            applyULList();
            expect(tdElem.querySelectorAll('li').length).toBe(1);
            expect(tdElem.innerHTML === '<ul><li>The Rich<strong> Text</strong> Editor.</li></ul>').toBe(true);
        });
    });

    describe('875147 - Number or Bullet format list not applied properly and throws error on continuous click in RichTextEditor', () => {
        let editor: RichTextEditor;
        const content: string = '<ol><li class="textPtag"><p class="textPtag">Provides an option to customize the quick toolbar for an image </p></li></ol><p class="imgPtag"><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline"></p>';
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: content
            });
        });
        afterAll(() => {
            destroy(editor);
        });

        it('Check the unwanted empty elements maintain dom', () => { 
            let textPtag: HTMLElement = editor.element.querySelector('.textPtag');
            let imgPtag: HTMLElement =  editor.element.querySelector('img');
            domSelection.setSelectionText(document,textPtag.firstChild,imgPtag.parentElement,0,1);
            let numberlist: HTMLElement = editor.getToolbar().querySelector('[title="Numbered List (Ctrl+Shift+O)"]');
            numberlist.click();
            numberlist.click();
            numberlist.click();
            numberlist.click();
            expect(editor.inputElement.innerHTML === `<p class="textPtag">Provides an option to customize the quick toolbar for an image </p><p><img alt="Logo" src="https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png" style="width: 300px;" class="e-rte-image e-imginline"></p>`).toBe( true);
        });
    });

    describe('878974 - Unexpected deletion of table header cells when attempting to insert a list within the header.', () => {
        let editor: RichTextEditor;
        const content: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`;
        beforeAll(() => {
            editor = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: content
            });
        });
        afterAll(() => {
            destroy(editor);
        });
        it('Check table header reamains after list insertion', (done: DoneFn) => {
            let currentTable: HTMLElement = editor.inputElement.querySelectorAll('th')[0] as HTMLElement;
            domSelection.setSelectionNode(document, currentTable);
            let numberlist: HTMLElement = editor.getToolbar().querySelector('[title="Numbered List (Ctrl+Shift+O)"]');
            numberlist.click();
            setTimeout(() => {
                let innerHTML: string = `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><ol><li><br></li></ol></th><th><br></th></tr></thead><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`;
                expect(editor.inputElement.innerHTML === innerHTML).toBe( true);
                done();
            }, 100);
        });
    });
});