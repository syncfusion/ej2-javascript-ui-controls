import { DocumentEditor } from '../../src/document-editor/document-editor';
import { TextPosition, DocumentHelper } from '../../src/index';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { ParagraphWidget, LineWidget, BodyWidget, TableWidget, TableRowWidget, TableCellWidget, FieldElementBox } from '../../src/index';
import { WTableFormat, WRowFormat, WCellFormat, WParagraphFormat } from '../../src/document-editor/implementation/format/index';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';

let rtl_test_doc: object = { "sections": [{ "blocks": [{ "characterFormat": { "fontFamily": "Segoe UI", "fontColor": "#222222FF" }, "paragraphFormat": { "afterSpacing": 0.0, "styleName": "lf-text-block", "bidi": true }, "inlines": [{ "text": "Designing an app that looks good on such a wide variety of devices can be a big challenge. Fortunately, the Universal Windows Platform (UWP) provides a set of built-in features and universal building blocks that help you create a UX that works well with a variety of devices, screens, and input methods. ", "characterFormat": { "fontFamily": "Segoe UI", "fontColor": "#222222FF" } }, { "text": "This articles", "characterFormat": { "fontFamily": "Segoe UI", "fontColor": "#222222FF" } }, { "text": " describes the UI features and benefits of UWP apps and provides some high-level design guidance for creating your first UWP app.", "characterFormat": { "fontFamily": "Segoe UI", "fontColor": "#222222FF" } }] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "تصميم التطبيق الذي يبدو جيدا على مثل مجموعة واسعة من الأجهزة يمكن أن يكون تحديا كبيرا. لحسن الحظ، توفر منصة ويندوز العالمية (أوب) مجموعة من الميزات المضمنة وكتل البناء الشاملة التي تساعدك على إنشاء أوكس الذي يعمل بشكل جيد مع مجموعة متنوعة من الأجهزة والشاشات وطرق الإدخال. تصف هذه المقالة ميزات واجهة المستخدم وفوائد تطبيقات ووب وتوفر بعض إرشادات التصميم عالية المستوى لإنشاء أول تطبيق ووب الخاص بك", "characterFormat": { "bidi": true } }, { "text": "." }] }, { "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "Bidi true and " }, { "text": "Bdo" }, { "text": " None: sample " }, { "text": "sample" }, { "text": " " }, { "text": "sample" }, { "text": " " }, { "text": "sample" }, { "text": " " }, { "text": "sample" }, { "text": " " }, { "text": "sample" }, { "text": " " }, { "text": "sample" }, { "text": " " }, { "text": "سشةحمث سشةحمث سشةحمث سشةحمث ", "characterFormat": { "bidi": true } }, { "text": "דשצפךק דשצפךק דשצפךק דשצפלק", "characterFormat": { "bidi": true } }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "text": "تصميم التطبيق الذي يبدو جيدا على مثل مجموعة واسعة من الأجهزة يمكن أن يكون تحديا كبيرا. لحسن الحظ، توفر منصة ويندوز العالمية (أوب) مجموعة من الميزات المضمنة وكتل البناء الشاملة التي تساعدك على إنشاء أوكس الذي يعمل بشكل جيد مع مجموعة متنوعة من الأجهزة والشاشات وطرق الإدخال. تصف هذه المقالة ميزات واجهة المستخدم وفوائد تطبيقات ووب وتوفر بعض إرشادات التصميم عالية المستوى لإنشاء أول تطبيق ووب الخاص بك", "characterFormat": { "bidi": true } }, { "text": "." }] }, { "paragraphFormat": { "styleName": "Normal" }, "inlines": [{ "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }, { "type": "Paragraph", "name": "lf-text-block", "basedOn": "Normal", "next": "Normal", "characterFormat": { "fontSize": 12.0, "fontFamily": "Times New Roman" }, "paragraphFormat": { "beforeSpacing": 5.0, "afterSpacing": 5.0, "lineSpacing": 1.0, "lineSpacingType": "Multiple" } }] };
describe('Rtl Keyboard selection for Shift left key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only', () => {
console.log('Bidi for paragraph is true containing normal text only');
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(1);
    });
    it('Again Bidi for paragraph is true containing normal text only', () => {
console.log('Again Bidi for paragraph is true containing normal text only');
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(2);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget');
        editor.selection.handleDownKey();
        editor.selection.handleControlDownKey();
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(1);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at end of line widget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at end of line widget');
        editor.selection.handleEndKey();
        editor.selection.handleShiftLeftKey();
        // expect(editor.selection.start.offset).toBe(115);
        expect(editor.selection.end.offset).toBe(1);
    });
    it('Bidi for paragraph is false containing rtl text only', () => {
console.log('Bidi for paragraph is false containing rtl text only');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlDownKey();
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(41);
    });
    it('Bidi for paragraph is false containing rtl text only at middle of paragraph', () => {
console.log('Bidi for paragraph is false containing rtl text only at middle of paragraph');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.start.offset).not.toBe(0);
    });
});
describe('Rtl Keyboard selection for Shift Right key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only', () => {
console.log('Bidi for paragraph is true containing normal text only');
        editor.selection.handleEndKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.start.offset).not.toBe(0);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget');
        editor.selection.handleControlDownKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.start.offset).toBe(0);
        // expect(editor.selection.end.offset).toBe(14);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at end of line widget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at end of line widget');
        editor.selection.handleEndKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.start.offset).not.toBe(0);
        // expect(editor.selection.start.offset).toBe(115);
        // expect(editor.selection.end.offset).toBe(114);
    });
    it('Bidi for paragraph is false containing rtl text only', () => {
console.log('Bidi for paragraph is false containing rtl text only');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlDownKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(1);
    });
    it('Bidi for paragraph is false containing rtl text only at middle of paragraph', () => {
console.log('Bidi for paragraph is false containing rtl text only at middle of paragraph');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleShiftRightKey();
        // expect(editor.selection.start.offset).toBe(107);
        expect(editor.selection.end.offset).not.toBe(0);
    });
});

describe('Rtl Keyboard selection for Shift Home and End key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only- home key', () => {
console.log('Bidi for paragraph is true containing normal text only- home key');
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleShiftHomeKey();
        expect(editor.selection.start.offset).toBe(17);
        expect(editor.selection.end.offset).toBe(0);
    });
    it('Bidi for paragraph is true containing normal text only-end key', () => {
console.log('Bidi for paragraph is true containing normal text only-end key');
        editor.selection.handleShiftEndKey();
        expect(editor.selection.start.offset).toBe(17);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleShiftHomeKey();
        expect(editor.selection.start.offset).toBe(19);
        expect(editor.selection.end.offset).toBe(0);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget');
        editor.selection.handleShiftEndKey();
        expect(editor.selection.start.offset).toBe(19);
    });
    it('Bidi for paragraph is false containing rtl text only-shift home', () => {
console.log('Bidi for paragraph is false containing rtl text only-shift home');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlDownKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleShiftHomeKey();
        //TODO
        // expect(editor.selection.start.offset).toBe(6);
        // expect(editor.selection.end.offset).toBe(0);
    });
    it('Bidi for paragraph is false containing rtl text only- shift end', () => {
console.log('Bidi for paragraph is false containing rtl text only- shift end');
        editor.selection.handleShiftEndKey();
        //TODO
        // expect(editor.selection.start.offset).toBe(6);
    });
    it('Bidi for paragraph is false containing rtl text only at middle of paragraph', () => {
console.log('Bidi for paragraph is false containing rtl text only at middle of paragraph');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleShiftHomeKey();
        expect(editor.selection.end.offset).toBe(0);
    });
});

describe('Rtl Keyboard selection for Home and End key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only- home key', () => {
console.log('Bidi for paragraph is true containing normal text only- home key');
        editor.selection.handleDownKey();
        editor.selection.handleHomeKey();
        expect(editor.selection.end.offset).toBe(0);
    });
    it('Bidi for paragraph is true containing normal text only-end key', () => {
console.log('Bidi for paragraph is true containing normal text only-end key');
        editor.selection.handleEndKey();
        expect(editor.selection.end.offset).not.toBe(0);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget');
        editor.selection.handleControlDownKey();
        editor.selection.handleHomeKey();
        expect(editor.selection.end.offset).toBe(0);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget');
        editor.selection.handleEndKey();
        expect(editor.selection.end.offset).not.toBe(0);
    });
    it('Bidi for paragraph is false containing rtl text only-shift home', () => {
console.log('Bidi for paragraph is false containing rtl text only-shift home');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlDownKey();
        editor.selection.handleHomeKey();
        expect(editor.selection.end.offset).toBe(0);
    });
    it('Bidi for paragraph is false containing rtl text only- shift end', () => {
console.log('Bidi for paragraph is false containing rtl text only- shift end');
        editor.selection.handleEndKey();
        expect(editor.selection.end.offset).not.toBe(0);
    });
    it('Bidi for paragraph is false containing rtl text only at middle of paragraph', () => {
console.log('Bidi for paragraph is false containing rtl text only at middle of paragraph');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleHomeKey();
        expect(editor.selection.end.offset).toBe(0);
    });
});
describe('Rtl Keyboard selection for Left and Right key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only- Left', () => {
console.log('Bidi for paragraph is true containing normal text only- Left');
        editor.selection.handleLeftKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;0;0;1");
    });
    it('Bidi for paragraph is true containing normal text only- Right', () => {
console.log('Bidi for paragraph is true containing normal text only- Right');
        editor.selection.handleRightKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;0;0;0");
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Left', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Left');
        editor.selection.handleControlDownKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;1;0;1");
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Right', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Right');
        editor.selection.handleRightKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;1;0;0");
    });
    it('Bidi for paragraph is true containing rtl text only selection is at end of line widget-Left', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at end of line widget-Left');
        editor.selection.handleEndKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;1;1;0");
    });
    it('Bidi for paragraph is true containing rtl text only selection is at end of line widget-Right', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at end of line widget-Right');
        editor.selection.handleRightKey();
        expect(editor.selection.end.hierarchicalPosition).not.toBe("0;0;1;1;0");
    });
    it('Bidi for paragraph is false containing rtl text only-Left', () => {
console.log('Bidi for paragraph is false containing rtl text only-Left');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlDownKey();
        editor.selection.handleLeftKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;2;1;41");
    });
    it('Bidi for paragraph is false containing rtl text only-Right', () => {
console.log('Bidi for paragraph is false containing rtl text only-Right');
        editor.selection.handleRightKey();
        expect(editor.selection.end.hierarchicalPosition).toBe("0;0;2;1;40");
    });
});

describe('Rtl Keyboard selection for control shift left and right key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only- Left', () => {
console.log('Bidi for paragraph is true containing normal text only- Left');
        editor.selection.handleControlShiftLeftKey();
        expect(editor.selection.end.hierarchicalPosition).not.toBe(editor.selection.start.hierarchicalPosition);
    });
    it('Bidi for paragraph is true containing normal text only- Right', () => {
console.log('Bidi for paragraph is true containing normal text only- Right');
        editor.selection.handleDownKey();
        editor.selection.handleControlShiftRightKey();
        expect(editor.selection.end.hierarchicalPosition).not.toBe(editor.selection.start.hierarchicalPosition);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Left', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Left');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlShiftRightKey();
        expect(editor.selection.end.hierarchicalPosition).not.toBe(editor.selection.start.hierarchicalPosition);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Right', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Right');
        editor.selection.handleControlShiftLeftKey();
        expect(editor.selection.end.hierarchicalPosition).not.toBe(editor.selection.start.hierarchicalPosition);
    });
});

describe('Rtl Keyboard selection for Shift up and down key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtl_test_doc));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Bidi for paragraph is true containing normal text only- shiftUp', () => {
console.log('Bidi for paragraph is true containing normal text only- shiftUp');
        editor.selection.handleControlLeftKey();
        editor.selection.handleControlLeftKey();
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        expect(editor.selection.end.currentWidget).not.toBe(editor.selection.start.currentWidget);
    });
    it('Bidi for paragraph is true containing normal text only- Right', () => {
console.log('Bidi for paragraph is true containing normal text only- Right');
        editor.selection.handleShiftUpKey();
        expect(editor.selection.end.currentWidget).not.toBe(editor.selection.start.currentWidget);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Left', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Left');
        editor.selection.handleControlDownKey();
        editor.selection.handleControlLeftKey()
        editor.selection.handleControlLeftKey()
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        expect(editor.selection.end.currentWidget).not.toBe(editor.selection.start.currentWidget);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Right', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at start of linewidget-Right');
        editor.selection.handleShiftUpKey();
        expect(editor.selection.end.currentWidget).not.toBe(editor.selection.start.currentWidget);
    });
    it('Bidi for paragraph is true containing rtl text only selection is at end of line widget-Left', () => {
console.log('Bidi for paragraph is true containing rtl text only selection is at end of line widget-Left');
        editor.selection.handleEndKey();
        editor.selection.handleShiftUpKey();
        //expect(editor.selection.end.currentWidget).toBe(editor.selection.start.currentWidget);
    });
});

let rtlLtr: any = { "sections": [{ "blocks": [{ "paragraphFormat": { "styleName": "Normal", "bidi": true }, "inlines": [{ "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sam" }, { "name": "_GoBack", "bookmarkType": 0 }, { "name": "_GoBack", "bookmarkType": 1 }, { "text": "pe" }, { "text": " " }, { "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sampe" }, { "text": " " }, { "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sampe" }, { "text": " " }, { "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sampe" }, { "text": " " }, { "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sampe" }, { "text": " " }, { "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sampe" }, { "text": " " }, { "text": "Sample " }, { "text": "سشةحمث", "characterFormat": { "bidi": true } }, { "text": " سشةحمث", "characterFormat": { "bold": true, "italic": true, "fontSize": 12.0, "bidi": true, "boldBidi": true, "italicBidi": true, "fontSizeBidi": 12.0 } }, { "text": " ", "characterFormat": { "bidi": true } }, { "text": "Sampe" }] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false, "bidi": false } }], "characterFormat": { "fontSize": 11.0, "fontFamily": "Calibri", "fontSizeBidi": 11.0, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "afterSpacing": 8.0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple" }, "background": { "color": "#FFFFFFFF" }, "styles": [{ "type": "Paragraph", "name": "Normal", "next": "Normal" }, { "type": "Character", "name": "Default Paragraph Font" }] };


describe('Rtl and ltr text combinations validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.open(JSON.stringify(rtlLtr));
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('RTl text for paragraph with shift left validation', () => {
console.log('RTl text for paragraph with shift left validation');
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.end.currentWidget).toBe(editor.selection.start.currentWidget);
    });
    it('RTl text for paragraph with shift left validation-2', () => {
console.log('RTl text for paragraph with shift left validation-2');
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.end.currentWidget).toBe(editor.selection.start.currentWidget);
    });
    it('RTl and ltr text for paragraph with shift left validation', () => {
console.log('RTl and ltr text for paragraph with shift left validation');
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        expect(editor.selection.end.currentWidget).toBe(editor.selection.start.currentWidget);
    });
    it('RTl and ltr text for paragraph with shift right validation', () => {
console.log('RTl and ltr text for paragraph with shift right validation');
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        editor.selection.handleShiftRightKey();
        expect(editor.selection.end.currentWidget).toBe(editor.selection.start.currentWidget);
    });
});
