import { PageLayoutViewer, } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Page, Rect } from '../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { Print } from '../../src/document-editor/implementation/print';
import { TestHelper } from '../test-helper.spec';
import { EditorHistory } from '../../src/index';

/**
 * Print Module testing
 */
describe('Print testing', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    let print: Print;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enablePrint: true });
        DocumentEditor.Inject(Print);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        viewer = editor.viewer as PageLayoutViewer;
        print = new Print();
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        viewer = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('print in IE validation', (done) => {
        let win: any = {
            document: { write: () => { }, close: () => { } },
            close: () => { }, print: () => { }, focus: () => { }
        };
        win.ready = true;
        let browserUserAgent: string = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
        print.printWindow(viewer as PageLayoutViewer, browserUserAgent, win);
        spyOn(win, 'print');
        win.ready = true;
        setTimeout(() => {
            expect(win.print).toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('print in chrome validation', (done) => {
        let win: any = {
            document: { write: () => { }, close: () => { } },
            close: () => { }, print: () => { }, focus: () => { }
        };
        win.ready = true;
        print.print(viewer as PageLayoutViewer, win);
        spyOn(win, 'print');
        win.ready = false;
        setTimeout(() => {
            expect(win.print).not.toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('Get Print document Width validation', () => {
        let pages: Page[] = [];
        let page1: Page = new Page();
        page1.boundingRectangle = new Rect(96, 96, 816, 1056);
        let page2: Page = new Page();
        page1.boundingRectangle = new Rect(96, 96, 816, 1056);
        pages.push(page1);
        pages.push(page2);
        expect(print.getPageWidth(pages)).toBe(816);
        expect(print.getPageHeight(pages)).toBe(1056);
    });
    it('Generate Print Content validation', () => {
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        let element: HTMLDivElement = document.createElement('div');
        print.generatePrintContent(viewer, element);
        expect(element.childNodes.length).not.toBe(0);
    });
    it('Print API testing', () => {
        let win: any = {
            document: { write: () => { }, close: () => { } },
            close: () => { }, print: () => { }, focus: () => { }
        };
        expect(() => { editor.printModule.print(editor.viewer as PageLayoutViewer, win) }).not.toThrowError();
    });
});