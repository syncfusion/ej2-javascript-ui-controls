import { DOMMethods } from "../../../src/editor-manager/plugin/dom-tree";
import { RichTextEditor } from "../../../src/rich-text-editor/base/rich-text-editor";
import { destroy, renderRTE } from "../../rich-text-editor/render.spec";

describe('DOM Tree testing', ()=>{

    describe('Testing cursor at side of the Table.', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p><br></p>`
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Shouild return the table element.', ()=>{
            editor.focusIn();
            expect(editor.inputElement.firstElementChild.childNodes.length === 4);
            const range: Range = new Range();
            range.setStart(editor.inputElement, 0);
            range.setEnd(editor.inputElement, 0);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            const domTreeMethods: DOMMethods = new DOMMethods(editor.inputElement as HTMLDivElement);
            const blockNode: Node[] = domTreeMethods.getBlockNode();
            expect(blockNode[0].nodeName).toBe('TABLE');
        });
    });

    describe('Block node method testing for the List format.', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<ol><li>List 1<ol><li>List 2</li><li>List 3</li></ol></li><li>List 4</li></ol>`
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should not have nested li in the output of the method.', ()=>{
            editor.focusIn();
            expect(editor.inputElement.firstElementChild.childNodes.length === 4);
            const range: Range = new Range();
            range.setStart(editor.inputElement.querySelectorAll('li')[0].firstChild, 2);
            range.setEnd(editor.inputElement.querySelectorAll('li')[3].firstChild, 2);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            const domTreeMethods: DOMMethods = new DOMMethods(editor.inputElement as HTMLDivElement);
            const blockNode: Node[] = domTreeMethods.getBlockNode();
            expect(blockNode.length).toBe(2);
            expect(blockNode[0].nodeName).toBe('LI');
            expect(blockNode[1].nodeName).toBe('LI');
        });
    });

    describe('Block node method testing for the Nested List format.', ()=>{
        let editor: RichTextEditor;
        beforeAll(()=> {
            editor = renderRTE({
                value: `<ol><li>List 1<ol><li>List 2</li><li>List 3</li></ol></li><li>List 4</li></ol>`
            });
        });
        afterAll(()=> {
            destroy(editor);
        });
        it ('Should have nested li in the output of the method when only nested List is selected.', ()=>{
            editor.focusIn();
            expect(editor.inputElement.firstElementChild.childNodes.length === 4);
            const range: Range = new Range();
            range.setStart(editor.inputElement.querySelectorAll('li')[1].firstChild, 0);
            range.setEnd(editor.inputElement.querySelectorAll('li')[2].firstChild, 6);
            editor.inputElement.ownerDocument.getSelection().removeAllRanges();
            editor.inputElement.ownerDocument.getSelection().addRange(range);
            const domTreeMethods: DOMMethods = new DOMMethods(editor.inputElement as HTMLDivElement);
            const blockNode: Node[] = domTreeMethods.getBlockNode();
            expect(blockNode.length).toBe(2);
            expect(blockNode[0].nodeName).toBe('LI');
            expect(blockNode[1].nodeName).toBe('LI');
            expect(blockNode[0]).toBe(editor.inputElement.querySelectorAll('li')[1]);
            expect(blockNode[1]).toBe(editor.inputElement.querySelectorAll('li')[2]);
        });
    });
});