/**
 * IFrame Content renderer spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from './../render.spec';

describe('Iframe Content renderer module', () => {

    describe('rte Iframe content element testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
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

    describe('rte Iframe enableRtl testing if enabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: true,
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('rtl Mode testing', () => {
            expect(rteObj.element.classList.contains('e-rtl')).toBe(true);
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').classList.contains('e-rtl')).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('rte Iframe enableRtl testing if disabled', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                iframeSettings: {
                    enable: true
                }
            });
        });

        it('rtl Mode testing', () => {
            expect(rteObj.element.classList.contains('e-rtl')).toBe(false);
            expect((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('body').classList.contains('e-rtl')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    
    describe('EJ2-49376 - Table cell have different padding in HTML and Iframe mode', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                iframeSettings: {
                    enable: true
                },
                value: `<table class='e-rte-table' style='width: 100%; min-width: 0px;'>
                <tbody><tr><td class='' style='width: 33.3333%;'><br></td><td style='width: 33.3333%;' class=''><br></td><td style='width: 33.3333%;'><br></td></tr><tr><td style='width: 33.3333%;'><br></td><td style='width: 33.3333%;' class=''><br></td><td style='width: 33.3333%;'><br></td></tr><tr><td style='width: 33.3333%;'><br></td><td style='width: 33.3333%;'><br></td><td style='width: 33.3333%;' class=''><br></td></tr></tbody></table><p><br></p>`
            });
        });

        it('- Iframe mode table padding testing', () => {
            expect(getComputedStyle((rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector('table td')).padding === '2px 5px').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    
});
