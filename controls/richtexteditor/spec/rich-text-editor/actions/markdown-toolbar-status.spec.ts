/**
 * Markdown toolbar status spec
 */
import { IToolbarStatus } from "../../../src";
import { RichTextEditor, MarkdownFormatter, dispatchEvent, ToolbarStatusEventArgs } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy, setCursorPoint } from "./../render.spec";

describe(' Markdown editor update toolbar ', () => {
    let rteObj: RichTextEditor;
    let editNode: HTMLTextAreaElement;
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

    let formatPreValue: string = '```\n Lists are a piece of cake \n ```\n';
    let eleValue: string = '';
    describe(' Lists ', () => {
        let status: IToolbarStatus;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['|', 'formats', '|', 'orderedlist', 'unorderedlist']
                },
                editorMode: 'Markdown',
                formatter: new MarkdownFormatter({
                    listTags: { 'OL': '1. ', 'UL': '- ' }, formatTags: {
                        'h1': '# ',
                        'h2': '## ',
                        'h3': '### ',
                        'h4': '#### ',
                        'h5': '##### ',
                        'h6': '###### ',
                        'blockquote': '> ',
                        'pre': '```\n',
                        'p': ''
                    }
                }),
                value: innerValue,
                created: oncreate,
                updatedToolbarStatus: (e: ToolbarStatusEventArgs) => {
                    status = e.markdown;
                }
            });
            function oncreate(args: any): void {
                eleValue = this.contentModule.getEditPanel().value;
            }
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
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
            expect(status.orderedlist).toEqual(true);
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.unorderedlist).toBe(false);
            expect(status.unorderedlist).toEqual(false);
        });
        it("Lists - UL", () => {
            rteObj.formatter.editorManager.markdownSelection.save(editNode.value.length - 6, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.orderedlist).toBe(false);
            expect(status.orderedlist).toEqual(false);
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.unorderedlist).toBe(true);
            expect(status.unorderedlist).toEqual(true);
        });

        it("formats - p", () => {
            editNode.value = formatValue;
            rteObj.formatter.editorManager.markdownSelection.save(0, 2);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('p');
            expect(status.formats).toEqual('p');
        });
        it("formats - blockquote", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[1].start as number, parents[1].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('blockquote');
            expect(status.formats).toEqual('blockquote');
        });
        it("formats - h1", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[2].start as number, parents[2].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h1');
            expect(status.formats).toEqual('h1');
        });
        it("formats - h2", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[3].start as number, parents[3].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h2');
            expect(status.formats).toEqual('h2');
        });
        it("formats - h3", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[4].start as number, parents[4].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h3');
            expect(status.formats).toEqual('h3');
        });
        it("formats - h4", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[5].start as number, parents[5].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h4');
            expect(status.formats).toEqual('h4');
        });
        it("formats - h5", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[6].start as number, parents[6].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h5');
            expect(status.formats).toEqual('h5');
        });
        it("formats - h6", () => {
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            let parents: { [key: string]: string | number }[] = rteObj.formatter.editorManager.markdownSelection.getSelectedParentPoints(editNode);
            rteObj.formatter.editorManager.markdownSelection.save(parents[7].start as number, parents[7].start as number);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('h6');
            expect(status.formats).toEqual('h6');
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
            expect(status.formats).toEqual('pre');
        });
        it("inline code - pre format", function () {
            editNode.value = '`Lists are a piece of cake `';
            rteObj.formatter.editorManager.markdownSelection.save(0, editNode.value.length);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            rteObj.formatter.editorManager.markdownSelection.save( 1, 3);
            rteObj.formatter.editorManager.markdownSelection.restore(editNode);
            (rteObj as any).mouseUp({ target: editNode });
            expect((rteObj.markdownEditorModule as any).toolbarUpdate.toolbarStatus.formats).toBe('pre');
            expect(status.formats).toEqual('pre');
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe(' EJ2-13502 - Toolbar active state on focusOut', () => {
        let controlId: string;
        let status: IToolbarStatus;
        let editNode: HTMLTextAreaElement;
        beforeAll(() => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                toolbarSettings: {
                    items: ['Bold']
                },
                value: 'RichTextEditor',
                updatedToolbarStatus: (e: ToolbarStatusEventArgs) => {
                    status = e.markdown;
                }
            });
            editNode = rteObj.contentModule.getEditPanel() as HTMLTextAreaElement;
            editNode.style.width = "200px;";
            editNode.style.height = "200px";
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
            expect(status.bold).toEqual(false);
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
});