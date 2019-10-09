/**
 * Markdown renderer spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE } from './../render.spec';
import { MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

describe('Markdown renderer module', () => {

    describe('rte Markdown element testing', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        beforeAll(() => {
            rteObj = renderRTE({ editorMode: 'Markdown' });
            elem = rteObj.element;
        });

        it('Markdown div testing', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
        });

        it('Markdown inner textarea testing', () => {
            expect(rteObj.contentModule.getPanel().querySelectorAll('.e-content').length).toBe(1);
        });

        it('Markdown inner element as Textarea testing', () => {
            expect(rteObj.contentModule.getPanel().querySelectorAll('.e-content')[0].tagName.toLowerCase() === 'textarea').toBe(true);
        });

        afterAll(() => {
            rteObj.destroy();
            detach(elem);
        });
    });

});