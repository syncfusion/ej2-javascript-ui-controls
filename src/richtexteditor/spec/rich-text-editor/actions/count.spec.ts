/**
 * RTE - Count action spec
 */
import { RichTextEditor, Count , Toolbar} from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from "./../render.spec";
import { QuickToolbar, MarkdownEditor, HtmlEditor } from "../../../src/rich-text-editor/index";


RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Count, Toolbar);
RichTextEditor.Inject(QuickToolbar);

describe('Count module', () => {
    describe('showCharCount property and maxLenth default testing', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('showCharCount property default testing', () => {
            expect(rteObj.showCharCount).toBe(false);
        });
        it('maxLenth property default testing', () => {
            expect(rteObj.maxLength).toBe(-1);
        });
    });

    describe('showCharCount property and maxLenth visibility testing', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                showCharCount: true,
                maxLength: 200
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('showCharCount property testing', () => {
            expect(rteObj.showCharCount).toBe(true);
        });
        it('maxLenth property testing', () => {
            expect(rteObj.maxLength).toBe(200);
        });
        it('Initial rendering', () => {
            (<any>rteObj).countModule.refresh();
            expect(rteObj.element.querySelectorAll('.e-rte-character-count').length === 1).toBe(true);
        });
    });

    describe('Character count with showCharCount as true', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                showCharCount: true
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('default character count', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p>Rich Text Editor</p>";
            (<any>rteObj).countModule.refresh();
            let len: number = (rteObj.contentModule.getEditPanel() as HTMLElement).textContent.trim().length;
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(len).toBe( parseInt(charLen));
            expect(charLen.indexOf('/') < 0).toBe(true);
        });
        it('default character count with data bind', () => {
            rteObj.showCharCount = false;
            rteObj.dataBind();
            expect(rteObj.element.querySelectorAll('.e-rte-character-count').length === 0).toBe(true);
        }); 
        it('default character count with data bind', () => {
            rteObj.showCharCount = true;
            rteObj.dataBind();
            rteObj.contentModule.getEditPanel().innerHTML = "<p>Rich Text Editor</p>";
            (<any>rteObj).countModule.refresh();
            let len: number = (rteObj.contentModule.getEditPanel() as HTMLElement).textContent.trim().length;
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(len).toBe( parseInt(charLen));
            expect(charLen.indexOf('/') < 0).toBe(true);
        });   
    });
    describe('Character count with showCharCount as true and enabling maxLength', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                showCharCount: true,
                maxLength: 200
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('default character count with background', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p> <p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed. </p>";
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(charLen.indexOf('/') > 0).toBe(true);
            expect(rteObj.element.querySelectorAll('.e-rte-character-count')[0].classList.contains('e-warning')).toBe(false);
            expect(rteObj.element.querySelectorAll('.e-rte-character-count')[0].classList.contains('e-error')).toBe(false);
            
        });
        it('Warning character count with background', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p> <p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content. </p>";
            (<any>rteObj).countModule.refresh();
            expect(rteObj.element.querySelectorAll('.e-rte-character-count')[0].classList.contains('e-warning')).toBe(true);
        });
        it('error character count with background', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p> <p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content. Warning class. </p>";
            (<any>rteObj).countModule.refresh();
            expect(rteObj.element.querySelectorAll('.e-rte-character-count')[0].classList.contains('e-error')).toBe(true);
            expect(rteObj.element.querySelectorAll('.e-rte-character-count')[0].classList.contains('e-warning')).toBe(false);
        });
        it('error character count with background', () => {
           (<any>rteObj.countModule).toggle({member: 'viewSource'});
           expect((<any>rteObj.countModule).element.style.display === 'none').toBe(true);
           (<any>rteObj.countModule).toggle({member: 'updateSource'});
           expect((<any>rteObj.countModule).element.style.display === 'block').toBe(true);
        });
        it('keyboard restriction testing', () => {
            let flag: boolean = false;
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content.It renders the content the abc</p>";
            (<any>rteObj).countModule.refresh();
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).textContent.trim().length).toBe(200);
            let keyboardEventArgs = {
                preventDefault: function () { flag = true;},
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 22
            };
            (<any>rteObj).countModule.restrict({args: keyboardEventArgs});
            expect(flag).toBe(true);
            flag = false;
            keyboardEventArgs = {
                preventDefault: function () { flag = true;},
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 8
            };
            (<any>rteObj).countModule.restrict({args: keyboardEventArgs});
            expect(flag).toBe(false);    
            flag = false;
            let kArgs = {
                preventDefault: function () { flag = true;},
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 65,
                ctrlKey: true
            };
            (<any>rteObj).countModule.restrict({args: kArgs});
            expect(flag).toBe(false); 
            flag = false;
            keyboardEventArgs = {
                preventDefault: function () { flag = true;},
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 65
            };
            (<any>rteObj).countModule.restrict({args: keyboardEventArgs});
            expect(flag).toBe(true);            
        });
        it('maximum length exceeded', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content.It renders the content in the panel.abc </p>";
            (<any>rteObj).countModule.refresh();
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).textContent.length).toBe(210);
        });
    });
});