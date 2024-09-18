/**
 * Dialog renderer spec 
 */
import { RichTextEditor } from './../../../src/index';
import { renderRTE, destroy } from "./../render.spec";

describe('Image Dialog', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    let beforeDialogCloseEvent: boolean = false;
    beforeAll(() => {
        rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
                items: ['Image']
            },
            value: `<img src='https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png' style="width:200px; height: 300px"/>`,
            insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
            beforeDialogOpen: beforeDialogOpen,
            dialogOpen: dialogOpen,
            beforeDialogClose: beforeDialogClose,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function beforeDialogClose (args: any): void {
            beforeDialogCloseEvent = true;
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
        (<any>rteObj).isDestroyed = true;
        (<any>rteObj).imageModule.dialogRenderObj.addEventListener();
        (<any>rteObj).imageModule.dialogRenderObj.removeEventListener();
        (<any>rteObj).isDestroyed = false;
        (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
        expect(beforeDialogOpenEvent).toBe(true);
        beforeDialogOpenEvent = false;
        expect(dialogOpenEvent).toBe(true);
        dialogOpenEvent = false;
        (<HTMLElement>rteEle.querySelectorAll(".e-cancel")[0] as HTMLElement).click();
        expect(beforeDialogCloseEvent).toBe(true);
        beforeDialogCloseEvent = false;
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
            expect(beforeDialogCloseEvent).toBe(true);
            expect(dialogCloseEvent).toBe(true);
            done();
        }, 200);
    });
});

describe('Link Dialog', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    let beforeDialogCloseEvent: boolean = false;
    beforeAll(() => {
        rteObj = renderRTE({
            height: 400,
            toolbarSettings: {
                items: ['CreateLink']
            },
            insertImageSettings: { resize: true, minHeight: 80, minWidth: 80 },
            beforeDialogOpen: beforeDialogOpen,
            dialogOpen: dialogOpen,
            beforeDialogClose: beforeDialogClose,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function beforeDialogClose (args: any): void {
            beforeDialogCloseEvent = true;
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
        expect(beforeDialogCloseEvent).toBe(true);
        expect(dialogCloseEvent).toBe(true);
    });
});

describe('Table Dialog QuickToolbar', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    let beforeDialogCloseEvent: boolean = false;
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
            beforeDialogClose: beforeDialogClose,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function beforeDialogClose (args: any): void {
            beforeDialogCloseEvent = true;
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
        beforeDialogCloseEvent = false;
        dialogCloseEvent = false;
        (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
        setTimeout(function () {
            (<HTMLElement>document.querySelectorAll('.e-toolbar-item')[10].childNodes[0] as HTMLElement).click();
            expect(beforeDialogOpenEvent).toBe(true);
            expect(dialogOpenEvent).toBe(true);
            (<HTMLElement>rteEle.querySelectorAll(".e-cancel")[0] as HTMLElement).click();
            expect(beforeDialogCloseEvent).toBe(true);
            expect(dialogCloseEvent).toBe(true);
            done();
        }, 200);
    });
});

describe('Table Dialog', () => {
    let rteEle: HTMLElement;
    let rteObj: RichTextEditor;
    let beforeDialogOpenEvent: boolean = false;
    let dialogOpenEvent: boolean = false;
    let dialogCloseEvent: boolean = false;
    let beforeDialogCloseEvent: boolean = false;
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
            beforeDialogClose: beforeDialogClose,
            dialogClose: dialogClose
        });
        function beforeDialogOpen(args: any): void {
            beforeDialogOpenEvent = true;
        }
        function dialogOpen(args: any): void {
            dialogOpenEvent = true;
        }
        function beforeDialogClose (args: any): void {
            beforeDialogCloseEvent = true;
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
        expect(beforeDialogCloseEvent).toBe(true);
        expect(dialogCloseEvent).toBe(true);
    });
});

describe('Dialog Position Testing', () => {
    let editorObj: RichTextEditor;
    let dummy: HTMLDivElement;
    beforeAll((done: DoneFn) => {
        let link = document.createElement('link');
        link.href = 'https://cdn.syncfusion.com/ej2/material.css';
        link.rel = 'stylesheet';
        link.id = 'materialTheme';
        document.head.appendChild(link);
        done();
    });
    beforeEach((done: DoneFn) => {
        editorObj = renderRTE({
            toolbarSettings: {
                items: ['Image']
            },
            height: 400,
            value: '<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in the\nclient side. Customer easy to edit the contents and get the HTML content for\nthe displayed content. A rich text editor control provides users with a toolbar\nthat helps them to apply rich text formats to the text entered in the text\narea. </p><p><b>Functional\nSpecifications/Requirements:</b></p><ol><li><p>Provide\nthe tool bar support, it’s also customizable.</p></li><li><p>Options\nto get the HTML elements with styles.</p></li><li><p>Support\nto insert image from a defined path.</p></li><li><p>Footer\nelements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size\nthe editor support.</p></li><li><p>Provide\nefficient public methods and client side events.</p></li><li><p>Keyboard\nnavigation support.</p></li></ol><p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in\nclient side. Customer easy to edit the contents and get the HTML content for\nthe displayed content. A rich text editor control provides users with a toolbar\nthat helps them to apply rich text formats to the text entered in the text\narea. </p><p><b>Functional\nSpecifications/Requirements:</b></p><ol><li><p>Provide\nthe tool bar support, it’s also customizable.</p></li><li><p>Options\nto get the HTML elements with styles.</p></li><li><p>Support\nto insert image from a defined path.</p></li><li><p>Footer\nelements and styles(tag / Element information , Action button (Upload, Cancel))</p></li><li><p>Re-size\nthe editor support.</p></li><li><p>Provide\nefficient public methods and client side events.</p></li><li><p>Keyboard\nnavigation support.</p></li></ol><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>'
        });
        setTimeout(() => {
            editorObj.refreshUI();
            dummy = document.createElement('div');
            dummy.style.height = '1000px';
            document.body.appendChild(dummy);
            done();
        }, 200);
    });
    afterAll((done: DoneFn) => {
        document.getElementById('materialTheme').remove();
        dummy.remove();
        destroy(editorObj);
        done();
    });
    it('Dialog Position Testing', (done: DoneFn) => {
        editorObj.focusIn();
        editorObj.formatter.editorManager.nodeSelection.setCursorPoint(document, editorObj.inputElement.lastElementChild, 1);
        editorObj.inputElement.lastElementChild.scrollIntoView();
        const eventInit: KeyboardEventInit =  {
            keyCode: 73,
            key: 'I',
            which: 73,
            code: 'KeyI',
            location: 0,
            altKey: false,
            ctrlKey: true,
            metaKey: false,
            shiftKey: true,
            repeat: false
        } as EventInit;
        const imageDialogOpenDown = new KeyboardEvent('keydown', eventInit as EventInit);
        editorObj.inputElement.dispatchEvent(imageDialogOpenDown);
        const imageDialogOpenUp = new KeyboardEvent('keyup', eventInit as EventInit);
        editorObj.inputElement.dispatchEvent(imageDialogOpenUp);
        setTimeout(() => {
            const dialog: HTMLElement = document.querySelector('.e-rte-img-dialog');
            expect(parseInt(dialog.style.top)).toBeGreaterThan(120);
            done();
        }, 400);
    });
});