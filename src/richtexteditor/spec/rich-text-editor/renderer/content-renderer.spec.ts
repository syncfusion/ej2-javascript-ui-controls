/**
 * Content renderer spec
 */
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy } from './../render.spec';
import {  MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

describe('Content renderer module', () => {

    describe('rte content element testing', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({});
            elem = rteObj.element;
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

});