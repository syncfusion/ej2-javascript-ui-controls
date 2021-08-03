/**
 * RTE - Count action spec
 */
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { renderRTE, destroy } from "./../render.spec";
import { detach } from "@syncfusion/ej2-base";

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
            expect(len).toBe(parseInt(charLen));
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
            expect(len).toBe(parseInt(charLen));
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
            (<any>rteObj.countModule).toggle({ member: 'viewSource' });
            expect((<any>rteObj.countModule).element.style.display === 'none').toBe(true);
            (<any>rteObj.countModule).toggle({ member: 'updateSource' });
            expect((<any>rteObj.countModule).element.style.display === 'block').toBe(true);
        });
        it('keyboard restriction testing', () => {
            let flag: boolean = false;
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content.It renders the content the abc</p>";
            (<any>rteObj).countModule.refresh();
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).textContent.trim().length).toBe(200);
            let keyboardEventArgs = {
                preventDefault: function () { flag = true; },
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 22
            };
            (<any>rteObj).restrict(keyboardEventArgs);
            expect(flag).toBe(true);
            flag = false;
            keyboardEventArgs = {
                preventDefault: function () { flag = true; },
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 8
            };
            (<any>rteObj).restrict(keyboardEventArgs);
            expect(flag).toBe(false);
            flag = false;
            let kArgs = {
                preventDefault: function () { flag = true; },
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 65,
                ctrlKey: true
            };
            (<any>rteObj).restrict(kArgs);
            expect(flag).toBe(false);
            flag = false;
            keyboardEventArgs = {
                preventDefault: function () { flag = true; },
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 65
            };
            (<any>rteObj).restrict(keyboardEventArgs);
            expect(flag).toBe(true);
            flag = false;
            keyboardEventArgs = {
                preventDefault: function () { flag = true; },
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 46
            };
            (<any>rteObj).restrict(keyboardEventArgs);
            expect(flag).toBe(false);
        });
        it('maximum length exceeded', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in client side. Customer easy to edit the contents and get the HTML content for the displayed content.It renders the content in the panel.abc </p>";
            (<any>rteObj).countModule.refresh();
            expect((rteObj.contentModule.getEditPanel() as HTMLElement).textContent.length).toBe(210);
        });

        it(' EJ2-17460 - change the maxLength value dynamically', () => {
            rteObj.maxLength = 500;
            rteObj.dataBind();
            expect(rteObj.element.querySelector('.e-rte-character-count').innerHTML.split('/ ')[1] === '500').toBe(true);
        });
    });

    describe('Character count restiction testing in Markdown ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                showCharCount: true,
                maxLength: 100,
                value: 'The sample is added to showcase **markdown editing**. The sample is added to showcase markdown edit.'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });

        it('keyboard restriction testing in markdown', () => {
            let flag: boolean = false;
            (<any>rteObj).countModule.refresh();
            expect(rteObj.contentModule.getText().length).toBe(100);
            let keyboardEventArgs = {
                preventDefault: function () { flag = true; },
                currentTarget: rteObj.contentModule.getEditPanel(),
                which: 22
            };
            (<any>rteObj).restrict(keyboardEventArgs);
            expect(flag).toBe(true);
        });
    });

    describe('EJ2-51592-Character count testing when bold, italic, underline format applied for -', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                showCharCount: true,
                value: '<p><strong>&ZeroWidthSpace;<em>&ZeroWidthSpace;<span style="text-decoration: underline;">&ZeroWidthSpace;</span></em></strong></p>'
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('default count value with no text - bold, italic and underline enabled', () => { 
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(parseInt(charLen) === 0).toBe(true);
        });
        it('character value alone', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p>Test</p>";
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(parseInt(charLen) === 4).toBe(true);
        });
        it('character value with bold enabled', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><strong>&ZeroWidthSpace;Test</strong></p>";
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(parseInt(charLen) === 4).toBe(true);
        });
        it('character value with italic enabled', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><em>&ZeroWidthSpace;Test</em></p>";
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(parseInt(charLen) === 4).toBe(true);
        });
        it('character value with underline enabled', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<p><span style='text-decoration: underline;'>&ZeroWidthSpace;Test</span></p>";
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(parseInt(charLen) === 4).toBe(true);
        });
        it('character value with strikethrough enabled', () => {
            rteObj.contentModule.getEditPanel().innerHTML = "<span style='text-decoration: line-through;'>&ZeroWidthSpace;Test</span>";
            (<any>rteObj).countModule.refresh();
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(parseInt(charLen) === 4).toBe(true);
        });
    });
    describe('Dynamic showCharCount property value change as true/false', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                value: '<p>Rich Text Editor</p>',
                showCharCount: true
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('default character count', () => {
            let len: number = (rteObj.contentModule.getEditPanel() as HTMLElement).textContent.trim().length;
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(len).toBe(parseInt(charLen));
            expect(charLen.indexOf('/') < 0).toBe(true);
        });
        it('showCharCount as false', () => {
            rteObj.showCharCount = false;
            rteObj.dataBind();
            expect(rteObj.element.querySelectorAll('.e-rte-character-count').length === 0).toBe(true);
        });
        it('showCharCount as true', () => {
            rteObj.showCharCount = true;
            rteObj.dataBind();
            let len: number = (rteObj.contentModule.getEditPanel() as HTMLElement).textContent.trim().length;
            let charLen: string = (rteObj.element.querySelectorAll('.e-rte-character-count')[0] as HTMLElement).textContent;
            expect(len).toBe(parseInt(charLen));
            expect(charLen.indexOf('/') < 0).toBe(true);
        });
    });

    describe('showCharCount as false without element testing', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Undo', 'Redo']
                },
                value: '<p>Rich Text Editor</p>',
                showCharCount: true
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('detach char count element', () => {
            detach(rteObj.element.querySelector('.e-rte-character-count'));
            expect(rteObj.element.querySelectorAll('.e-rte-character-count').length === 0).toBe(true);
            rteObj.showCharCount = false;
            rteObj.dataBind();
            expect(rteObj.element.querySelectorAll('.e-rte-character-count').length === 0).toBe(true);
        });
    });
});