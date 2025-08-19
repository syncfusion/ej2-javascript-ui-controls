/**
 * Table spec
 */
import { RichTextEditor } from './../../../../src/index';
import { renderRTE, destroy, dispatchEvent, setCursorPoint } from './../../render.spec';

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
                },
                format: {
                    types: [
                        { text: 'Paragraph', value: 'P' },
                        { text: 'Code', value: 'Pre'},
                        { text: 'Quotation', value: 'BlockQuote'},
                        { text: 'Heading 1', value: 'H1' },
                        { text: 'Heading 2', value: 'H2' },
                        { text: 'Heading 3', value: 'H3' },
                        { text: 'Heading 4', value: 'H4' }
                    ]
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
            let tag: HTMLElement = (rteObj as any).inputElement.querySelector('blockquote');
            expect((tag.parentNode as Element).tagName === 'TD').toBe(true);
        });
    });
});