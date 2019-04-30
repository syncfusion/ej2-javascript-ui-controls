import { Toolbar, HtmlEditor, Table, RichTextEditor, Count, Link, Image, QuickToolbar, HTMLFormatter } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';
import { detach, isNullOrUndefined } from '@syncfusion/ej2-base';

RichTextEditor.Inject(HtmlEditor);
RichTextEditor.Inject(Table);
RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Count);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);

describe('RTE Table - ', () => {

    describe(' Apply BLOCKQUOTE after select the table node - ', () => {
        let rteObj: RichTextEditor;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `,
                toolbarSettings: {
                    items: ['Formats']
                }
            });
            controlId = rteObj.element.id;
            done();
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });

        it(' Test - apply the "Quotation" format to selected node', () => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            item.click();
            let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
            dispatchEvent((popup.querySelectorAll('.e-item')[2] as HTMLElement), 'mousedown');
            (popup.querySelectorAll('.e-item')[2] as HTMLElement).click()
            let tag: HTMLElement = (rteObj as any).inputElement.querySelector('table');
            expect((tag.parentNode as Element).tagName === 'BLOCKQUOTE').toBe(true);
        });
    });
});