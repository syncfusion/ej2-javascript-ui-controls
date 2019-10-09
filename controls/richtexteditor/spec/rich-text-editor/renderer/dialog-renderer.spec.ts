/**
 * Dialog renderer spec 
 */
import { RichTextEditor, Toolbar, Image, IRenderer, ResizeArgs } from './../../../src/index';
import { renderRTE, destroy, setCursorPoint } from "./../render.spec";
import { PasteCleanup } from "../../../src/rich-text-editor/actions/paste-clean-up";
import { dispatchEvent } from '../../../src/rich-text-editor/base/util';

import { QuickToolbar, MarkdownEditor, HtmlEditor, Link, Table } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(MarkdownEditor);
RichTextEditor.Inject(HtmlEditor);

RichTextEditor.Inject(Toolbar);
RichTextEditor.Inject(Link);
RichTextEditor.Inject(Image);
RichTextEditor.Inject(QuickToolbar);
RichTextEditor.Inject(Table);
RichTextEditor.Inject(PasteCleanup);

describe('Image Dialog', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let clickEvent: any;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    beforeAll(() => {
        rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
                items: ['Image']
            },
            value: `<img src='https://ej2.syncfusion.com/demos/src/rte/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>`,
            insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
            beforeDialogOpen: beforeDialogOpen,
            dialogOpen: dialogOpen,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function dialogClose(args: any): void {
            dialogCloseEvent = true;
        }
        rteEle = rteObj.element;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Image Dialog Event Trigger', (done) => {
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(beforeDialogOpenEvent).toBe(true);
        beforeDialogOpenEvent = false;
        expect(dialogOpenEvent).toBe(true);
        dialogOpenEvent = false;
        (<HTMLElement>rteEle.querySelectorAll(".e-cancel")[0] as HTMLElement).click();
        expect(dialogCloseEvent).toBe(true);
        dialogCloseEvent = false;
        let target = <HTMLElement>rteEle.querySelectorAll(".e-content")[0]
        let clickEvent: any = document.createEvent("MouseEvents");
        let eventsArg: any = { pageX: 50, pageY: 300, target: target };
        clickEvent.initEvent("mousedown", false, true);
        target.dispatchEvent(clickEvent);
        target = (rteObj.contentModule.getEditPanel() as HTMLElement).querySelector('img');
        (rteObj as any).formatter.editorManager.nodeSelection.setSelectionNode(rteObj.contentModule.getDocument(), target);
        eventsArg = { pageX: 50, pageY: 300, target: target };
        clickEvent.initEvent("mousedown", false, true);
        target.dispatchEvent(clickEvent);
        (<any>rteObj).imageModule.editAreaClickHandler({ args: eventsArg });
        setTimeout(function () {
            let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
            let quickTBItem: any = quickPop.querySelectorAll('.e-toolbar-item');
            quickTBItem.item(5).click();
            expect(beforeDialogOpenEvent).toBe(true);
            expect(dialogOpenEvent).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-dlg-closeicon-btn")[0] as HTMLElement).click();
            expect(dialogCloseEvent).toBe(true);
            done();
        }, 200);
    });
});

describe('Link Dialog', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let clickEvent: any;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    beforeAll(() => {
        rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
                items: ['CreateLink']
            },
            insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
            beforeDialogOpen: beforeDialogOpen,
            dialogOpen: dialogOpen,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function dialogClose(args: any): void {
            dialogCloseEvent = true;
        }
        rteEle = rteObj.element;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Link Dialog Event Trigger', () => {
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(beforeDialogOpenEvent).toBe(true);
        expect(dialogOpenEvent).toBe(true);
        (<HTMLElement>rteEle.querySelectorAll(".e-footer-content")[0].childNodes[1] as HTMLElement).click();
        expect(dialogCloseEvent).toBe(true);
    });
});

describe('Table Dialog QuickToolbar', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let clickEvent: any;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    beforeAll(() => {
        rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
                items: ['CreateTable']
            },
            quickToolbarSettings: {
                table: ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles', 'TableEditProperties']
            },
            insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
            beforeDialogOpen: beforeDialogOpen,
            dialogOpen: dialogOpen,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function dialogClose(args: any): void {
            dialogCloseEvent = true;
        }
        rteEle = rteObj.element;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Table quicktoolbar dialog event trigger', (done) => {
        (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        let event: any = {
            target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
            preventDefault: function () { }
        };
        (rteObj as any).tableModule.tableCellSelect(event);
        (rteObj as any).tableModule.tableCellLeave(event);
        let clickEvent: any = document.createEvent("MouseEvents");
        clickEvent.initEvent("mouseup", false, true);
        event.target.dispatchEvent(clickEvent);
        let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
        clickEvent = document.createEvent("MouseEvents");
        clickEvent.initEvent('mousedown', false, true);
        (rteObj as any).inputElement.dispatchEvent(clickEvent);
        let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
        beforeDialogOpenEvent = false;
        dialogOpenEvent = false;
        dialogCloseEvent = false;
        (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
        setTimeout(function () {
            (<HTMLElement>document.querySelectorAll('.e-toolbar-item')[10].childNodes[0] as HTMLElement).click();
            expect(beforeDialogOpenEvent).toBe(true);
            expect(dialogOpenEvent).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-cancel")[0] as HTMLElement).click();
            expect(dialogCloseEvent).toBe(true);
            done();
        }, 200);
    });
});

describe('Table Dialog', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let clickEvent: any;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    beforeAll(() => {
        rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
                items: ['CreateTable']
            },
            quickToolbarSettings: {
                table: ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles', 'TableEditProperties']
            },
            insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
            beforeDialogOpen: beforeDialogOpen,
            dialogOpen: dialogOpen,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function dialogClose(args: any): void {
            dialogCloseEvent = true;
        }
        rteEle = rteObj.element;
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('Table Dialog Event Trigger', () => {
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        (<HTMLElement>rteEle.querySelector(".e-insert-table-btn") as HTMLElement).click();
        expect(beforeDialogOpenEvent).toBe(true);
        expect(dialogOpenEvent).toBe(true);
        (<HTMLElement>rteEle.querySelectorAll(".e-insert-table")[0] as HTMLElement).click();
        expect(dialogCloseEvent).toBe(true);
    });
});