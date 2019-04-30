/**
 * Content renderer spec
 */
import { detach, createElement } from '@syncfusion/ej2-base';
import { RichTextEditor, Toolbar } from './../../../src/index';
import { dispatchEvent } from './../../../src/rich-text-editor/base/util';
import { QuickToolbar, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(QuickToolbar);

import { renderRTE, destroy, setCursorPoint } from "./../render.spec";


describe(' Markdown editor update toolbar ', () => {
    let rteObj: RichTextEditor;
    let curDocument: Document;
    let mouseEventArgs: { [key: string]: HTMLElement };
    let editNode: HTMLTextAreaElement;
    let rteEle: Element;
    let innerValue: string =
        `1. Lists are a piece of cake
They even auto continue as you type
A double enter will end them
- Tabs and shift-tabs work too`;

    let formatValue: string =
        `Lists are a piece of cake
> They even auto continue as you type
# A double enter will end them
## Tabs and shift-tabs work too
### Tabs and shift-tabs work too
#### Tabs and shift-tabs work too
##### Tabs and shift-tabs work too
###### Tabs and shift-tabs work too`;

    let formatPreValue: string = '```\n Lists are a piece of cake \n```';
    let eleValue: string = '';
    describe(' Lists ', () => {
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'formats', '|', 'orderedlist', 'unorderedlist']
                },
                editorMode: 'Markdown',
                value: innerValue,
                created: oncreate
            });
            function oncreate(args: any): void {
                eleValue = this.contentModule.getEditPanel().value;
            }
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            curDocument = rteObj.contentModule.getDocument();
            rteObj.cssClass = 'custom-class';
            rteObj.dataBind();
        });
        it("Lists - OL", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect(eleValue).not.toBeNull();
            expect(eleValue).not.toBeUndefined();
            expect(eleValue).not.toBe('');
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.orderedlist).toBe(true);
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.unorderedlist).toBe(false);

        });
        it("Lists - UL", () => {
            rteObj.formatter.editorManager.markdownSelection.save(editNode.value.length - 6, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.orderedlist).toBe(false);
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.unorderedlist).toBe(true);
        });

        it("formats - p", () => {
            editNode.value = formatValue;
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('p');

        });
        it("formats - blockquote", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[1].start as number, parents[1].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('blockquote');
        });
        it("formats - h1", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[2].start as number, parents[2].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h1');

        });
        it("formats - h2", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[3].start as number, parents[3].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h2');
        });
        it("formats - h3", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[4].start as number, parents[4].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h3');

        });
        it("formats - h4", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[5].start as number, parents[5].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h4');
        });
        it("formats - h5", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[6].start as number, parents[6].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h5');

        });
        it("formats - h6", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[7].start as number, parents[7].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h6');
        });
        it("formats - pre", () => {
            editNode.value = formatPreValue;
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[1].start as number, parents[1].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('pre');
        });
        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });

    describe(' EJ2-13502 - Toolbar active state on focusOut', () => {
        let controlId: string;
        let editNode: HTMLTextAreaElement;
        beforeAll(() => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                toolbarSettings: {
                    items: ['Bold']
                },
                value: 'RichTextEditor'
            });
            rteEle = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
            curDocument = rteObj.contentModule.getDocument();
            controlId = rteObj.element.id;
        });
        it(' Remove the active state of Bold toolbar item while click on document ', () => {
            rteObj.formatter.editorManager.markdownSelection.setSelection(editNode, 0, 6);
            document.getElementById(controlId + "_toolbar_Bold").click();
            document.body.focus();
            setCursorPoint(document.body, 0);
            (rteObj as any).onDocumentClick({ target: document.body });
            (rteObj as any).inputElement.blur();
            document.body.click();
            dispatchEvent(rteObj.contentModule.getEditPanel(), 'focusout');
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.bold).toEqual(false);
        });
        afterAll(() => {
            detach(rteEle);
            destroy(rteObj);
        });
    });
});