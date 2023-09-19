import { PageLayoutViewer, DocumentHelper, Editor, Selection, } from '../../src/index';
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
    let documentHelper: DocumentHelper;
    let print: Print;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enablePrint: true });
        DocumentEditor.Inject(Print);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        documentHelper=editor.documentHelper;
        print = new Print();
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('print in IE validation', (done) => {
console.log('print in IE validation');
        let win: any = {
            document: { write: () => { }, close: () => { } },
            close: () => { }, print: () => { }, focus: () => { }
        };
        win.ready = true;
        let browserUserAgent: string = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
        print.printWindow(documentHelper, browserUserAgent, win);
        spyOn(win, 'print');
        win.ready = true;
        setTimeout(() => {
            expect(win.print).toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('print in chrome validation', (done) => {
console.log('print in chrome validation');
        let win: any = {
            document: { write: () => { }, close: () => { } },
            close: () => { }, print: () => { }, focus: () => { }
        };
        win.ready = true;
        print.print(documentHelper, win);
        spyOn(win, 'print');
        win.ready = false;
        setTimeout(() => {
            expect(win.print).not.toHaveBeenCalled();
            done();
        }, 1000);
    });
    it('Get Print document Width validation', () => {
console.log('Get Print document Width validation');
        let pages: Page[] = [];
        let page1: Page = new Page(editor.documentHelper);
        page1.boundingRectangle = new Rect(96, 96, 816, 1056);
        let page2: Page = new Page(editor.documentHelper);
        page1.boundingRectangle = new Rect(96, 96, 816, 1056);
        pages.push(page1);
        pages.push(page2);
        expect(print.getPageWidth(pages)).toBe(816);
        expect(print.getPageHeight(pages)).toBe(1056);
    });
    it('Generate Print Content validation', () => {
console.log('Generate Print Content validation');
        editor.appendTo('#container');
        documentHelper=editor.documentHelper;
        let element: HTMLDivElement = document.createElement('div');
        print.generatePrintContent(documentHelper, element);
        expect(element.childNodes.length).not.toBe(0);
    });
    it('Print API testing', () => {
console.log('Print API testing');
        let win: any = {
            document: { write: () => { }, close: () => { } },
            close: () => { }, print: () => { }, focus: () => { }
        };
        expect(() => { editor.printModule.print(editor.documentHelper, win) }).not.toThrowError();
    });
});

describe('Validate the image printing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enablePrint: true, enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Print, Selection); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((): void => {
        if (editor) {
            editor.destroy();
        }
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('Validate the image printing', () => {
        console.log('Validate the image printing');
        editor.openBlank();
        editor.editor.insertImage('https://cdn.syncfusion.com/content/images/Logo/Logo_150dpi.png');
        expect(editor.exportAsImage(1, 'Png')).not.toThrowError;
    });
});

