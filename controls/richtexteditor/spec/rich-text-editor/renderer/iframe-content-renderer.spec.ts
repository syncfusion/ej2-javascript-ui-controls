/**
 * Content renderer spec
 */
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy } from './../render.spec';
import { MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

describe('Iframe Content renderer module', () => {

    describe('rte Iframe content element testing', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
            elem = rteObj.element;
        });


        it('Content iframe testing', () => {
            expect(rteObj.element.querySelectorAll('iframe.e-rte-content').length).toBe(1);
        });

        it('Content inner body as contenteditable  testing', () => {
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').getAttribute('contenteditable') === 'true').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Value property content without parent tag to render', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                value: 'RichTextEdit'
            });
        });

        it('InnerHtml testing', () => {
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').innerHTML).toBe('<p>RichTextEdit</p>');
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    
        describe('Click action on readonly mode with RTE editpanel focus testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true,
                    attributes: {
                        readonly: 'readonly'
                    }
                },
                value: 'RichTextEdit'
            });
        });

        it('click action to editpanel focus testing', () => {
            expect(document.activeElement.nodeName).toBe('BODY');
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            expect(document.activeElement.classList.contains('e-rte-content')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
});