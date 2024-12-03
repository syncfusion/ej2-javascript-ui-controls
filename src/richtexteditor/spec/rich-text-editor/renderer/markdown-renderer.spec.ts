/**
 * Markdown renderer spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from './../render.spec';

describe('Markdown renderer module', () => {

    describe('rte Markdown element testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({ editorMode: 'Markdown' });
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

        it('Markdown coverage', () => {
            (rteObj as any).markdownEditorModule.parent.isDestroyed = true;
            (rteObj as any).markdownEditorModule.parent.addEventListener();
            (rteObj as any).markdownEditorModule.parent.isDestroyed = false;
            (rteObj as any).markdownEditorModule.destroy();
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });
});