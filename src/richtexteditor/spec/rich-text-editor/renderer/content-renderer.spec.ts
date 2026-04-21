/**
 * Content renderer spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from './../render.spec';

describe('Content renderer module', () => {

    describe('rte content element testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({});
        });

        it('Content div testing', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
        });

        it('Content inner div testing', () => {
            expect(rteObj.contentModule.getPanel().querySelectorAll('.e-content').length).toBe(1);
        });

        it('Content inner div contenteditable  testing', () => {
            expect(rteObj.contentModule.getPanel().querySelectorAll('.e-content')[0].getAttribute('contenteditable') === 'true').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Value property content without parent tag to render', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: 'RichTextEditor'
            });
        });

        it('InnerHtml testing', () => {
            expect(rteObj.element.querySelector('.e-rte-content .e-content').innerHTML).toBe('<p>RichTextEditor</p>');
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('Click action on readonly mode with RTE editpanel focus testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                readonly: true,
                value: 'RichTextEdit'
            });
        });

        it('click action to editpanel focus testing', () => {
            expect(document.activeElement.nodeName).toBe('BODY');
            (rteObj.element.querySelector('.e-toolbar-item button') as HTMLElement).click();
            expect(document.activeElement.classList.contains('e-content')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('913845 - Rich Text Editor Accessibility Attributes', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableRtl: false,
                locale: 'en'
            });
        });
        it('should have correct accessibility attributes', () => {
            const contentDiv = rteObj.contentModule.getPanel().querySelector('.e-content');
            expect(contentDiv.getAttribute('aria-label')).toBe('Rich Text Editor');
            expect(contentDiv.getAttribute('role')).toBe('textbox');
            expect(contentDiv.getAttribute('lang')).toBe('en');
            expect(contentDiv.getAttribute('dir')).toBe('ltr');
        });
        it('should update lang and dir attributes dynamically', () => {
            rteObj.locale = 'fr';
            rteObj.enableRtl = true;
            rteObj.dataBind();
    
            const contentDiv = rteObj.contentModule.getPanel().querySelector('.e-content');
            expect(contentDiv.getAttribute('lang')).toBe('fr');
            expect(contentDiv.getAttribute('dir')).toBe('rtl');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});