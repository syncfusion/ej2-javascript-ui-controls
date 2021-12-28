import { DocumentEditor } from '../../src/document-editor/document-editor';
import { PageLayoutViewer, DocumentHelper } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from './../test-helper.spec';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { ParagraphWidget, BodyWidget, LineWidget, ImageElementBox, TextElementBox, TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { ImageResizer } from '../../src/index';
import { OptionsPane } from '../../src/index';
/**
 * Double and triple tap
 */
export function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}
function setMouseCoordinates(eventarg: any, x: number, y: number): Object {
    eventarg.offsetX = x;
    eventarg.offsetY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}


describe('double tap and trible tap testing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        //destroy validation
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Double tap validation', () => {
console.log('Double tap validation');
        editor.editorModule.insertText('Syncfusion Software');
        let event: any = getEventObject('MouseEvent', 'dblclick');
        event = setMouseCoordinates(event, 345, 130);
        editor.selection.moveToLineStart();
        documentHelper.onDoubleTap(event);
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(11);
    });
});

describe('Double tap touch testing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Double tap touch', () => {
console.log('Double tap touch');
        editor.openBlank();
        let touchevent: any;
        let clientX_Y = { clientX: 297, clientY: 302, pageX: 297, pageY: 302 };
        let touches = [];
        let changedTouches = [];
        touches.push(clientX_Y);
        changedTouches.push(clientX_Y);
        touchevent = { touches, changedTouches, preventDefault: function () { } };
        documentHelper.isTouchInput = true;
        documentHelper.onTouchStartInternal(touchevent);
        documentHelper.onTouchMoveInternal(touchevent);
        documentHelper.onTouchUpInternal(touchevent);
        (editor.documentHelper).tapCount = 1;
        documentHelper.onTouchStartInternal(touchevent);
        documentHelper.onTouchMoveInternal(touchevent);
        documentHelper.onTouchUpInternal(touchevent);
        expect((editor.documentHelper).tapCount).toBe(2);
    });
    it('Double tap validation', () => {
console.log('Double tap validation');
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software');
        let event: any = getEventObject('MouseEvent', 'dblclick');
        event = setMouseCoordinates(event, 345, 160);
        editor.selection.moveToLineStart();
        documentHelper.onDoubleTap(event);
        expect(editor.selection.text).toBe('Syncfusion ');
    })
    it('Triple tap touch', () => {
console.log('Triple tap touch');
        editor.openBlank();
        let touchevent: any;
        let clientX_Y = { clientX: 297, clientY: 302, pageX: 297, pageY: 302 };
        let touches = [];
        let changedTouches = [];
        touches.push(clientX_Y);
        changedTouches.push(clientX_Y);
        touchevent = { touches, changedTouches, preventDefault: function () { } };
        documentHelper.isTouchInput = true;
        documentHelper.onTouchStartInternal(touchevent);
        documentHelper.onTouchMoveInternal(touchevent);
        documentHelper.onTouchUpInternal(touchevent);
        (editor.documentHelper).tapCount = 2;
        documentHelper.onTouchStartInternal(touchevent);
        documentHelper.onTouchMoveInternal(touchevent);
        documentHelper.onTouchUpInternal(touchevent);
        expect((editor.documentHelper).tapCount).toBe(1);
    });
});

describe('update cursor position validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));        
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Update Cursor on hyperlink validation', () => {
console.log('Update Cursor on hyperlink validation');
        editor.editorModule.insertHyperlinkInternal('Syncfusion', 'https://syncfusion.com', true);
        editor.selection.movePreviousPosition();
        editor.selection.movePreviousPosition();

        let event: any = {
            preventDefault: () => { return true },
            offsetX: documentHelper.currentPage.boundingRectangle.x + editor.selection.start.location.x,
            offsetY: editor.selection.start.location.y - documentHelper.viewerContainer.scrollTop + documentHelper.currentPage.boundingRectangle.y,
            ctrlKey: true
        };
        documentHelper.onMouseMoveInternal(event);
        expect(documentHelper.viewerContainer.style.cursor).toBe('pointer');
    });
});

function getImageString(): string {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
}

describe('Branch validation', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Hide Context menu on window resize', () => {
console.log('Hide Context menu on window resize');
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.selectAll();
        documentHelper.onDoubleTap({ offsetX: 10000, offsetY: 10000 } as any);
        expect(editor.selection.text).toBe('Syncfusion Software\r');
    });
    it('Fit full page validation', () => {
console.log('Fit full page validation');
        viewer.onPageFitTypeChanged('FitOnePage');
        let zoomFactor: number = documentHelper.zoomFactor;
        viewer.onPageFitTypeChanged('FitOnePage');
        expect(zoomFactor).toBe(documentHelper.zoomFactor);
    });
    it('Get Current header footer validation', () => {
console.log('Get Current header footer validation');
        let paragraph: ParagraphWidget = new ParagraphWidget();

        let paragraph2: ParagraphWidget = new ParagraphWidget();

        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        section.childWidgets.push(paragraph);
        paragraph.containerWidget = section;
        let section2: BodyWidget = new BodyWidget();
        section2.sectionFormat = new WSectionFormat();
        section.sectionFormat.differentFirstPage = true;
        section2.childWidgets.push(paragraph2);
        paragraph2.containerWidget = section2;
        let sections: BodyWidget[] = [];
        sections.push(section);
        sections.push(section2);
        documentHelper.onDocumentChanged(sections);

        expect(viewer.getHeaderFooterType(section, false)).toBe('FirstPageFooter');
        expect(viewer.getHeaderFooterType(section, true)).toBe('FirstPageHeader');
        expect(viewer.getHeaderFooterType(section2, false)).not.toBe('FirstPageFooter');
        expect(viewer.getHeaderFooterType(section2, true)).not.toBe('FirstPageHeader');

    });
    it('Cursor over image testing', () => {
console.log('Cursor over image testing');
        editor.documentHelper.zoomFactor = 1;
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.index = 0;
        let line: LineWidget = new LineWidget(paragraph);
        paragraph.childWidgets.push(line);
        let image: ImageElementBox = new ImageElementBox();
        image.imageString = getImageString();
        image.line = line;
        image.width = 150;
        image.height = 150;
        line.children.push(image);
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        section.index = 0;
        paragraph.containerWidget = section;

        section.childWidgets.push(paragraph);
        let sections: BodyWidget[] = [];
        sections.push(section);
        documentHelper.onDocumentChanged(sections);
        let event: any = {
            offsetX: 110 + documentHelper.currentPage.boundingRectangle.x,
            offsetY: 110 + documentHelper.currentPage.boundingRectangle.y,
            ctrlKey: false
        };
        (editor.documentHelper).updateCursor(event);
        // expect(viewer.viewerContainer.style.cursor).toBe('move');
    });
});
describe('Handle Key down', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, ImageResizer);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Mouse down on image resizer area', () => {
console.log('Mouse down on image resizer area');
        editor.openBlank();
        documentHelper.editableDiv.innerHTML = 'S';
        editor.editorModule.onTextInputInternal();
        editor.selection.selectAll();
        expect(editor.selectionModule.text).toBe('S\r');
        editor.editorModule.onBackSpace();
        documentHelper.editableDiv.innerHTML = String.fromCharCode(160);
        editor.editorModule.onTextInputInternal();
        editor.selection.selectAll();
        expect(editor.selectionModule.text).not.toBe(String.fromCharCode(160) + '\r');
        expect(editor.selectionModule.text).toBe(' \r');
    });
});

describe('Key down validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, OptionsPane);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSearch: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Open option pane validation', () => {
console.log('Open option pane validation');
        let event: any = {
            which: 72,
            preventDefault: () => { return true; },
            ctrlKey: true
        }
        documentHelper.onKeyDownInternal(event);
        expect(editor.optionsPaneModule.optionsPane.style.display).not.toBe('none');
        event.which = 27;
        documentHelper.onKeyDownInternal(event);
        expect(editor.optionsPaneModule.optionsPane.style.display).toBe('none');
    });
    it('Create empty document', () => {
console.log('Create empty document');
        let event: any = {
            keyCode: 78,
            preventDefault: () => { return true; },
            ctrlKey: true
        }
        let spy = jasmine.createSpy('documentchange');
        editor.documentChange = spy;
        documentHelper.onKeyDownInternal(event);
        expect(spy).toHaveBeenCalled();
    });
    it('shift end and home key validation', () => {
console.log('shift end and home key validation');
        let event: any = {
            keyCode: 35,
            preventDefault: () => { return true; },
            ctrlKey: true,
            shiftKey: true,
        }
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.end.offset).toBe(1);
        event.keyCode = 36;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
        event.keyCode = 40;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 77;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.leftIndent).toBe(0);
    });
});

describe('Tab key validation list level', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Page Down  and page Up validation', () => {
console.log('Page Down  and page Up validation');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Work Cycles');
        let prevLocation = editor.selection.start.location.x;
        event = { keyCode: 33, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(prevLocation).toBe(editor.selection.start.location.x);
        event = { keyCode: 34, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(prevLocation).toBe(editor.selection.start.location.x);
    });
    it('tab key validation', () => {
console.log('tab key validation');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });
    it('Enter at empty list validation', () => {
console.log('Enter at empty list validation');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        expect(prevlocation).not.toBe(editor.selection.start.location.x);
    });
});

describe('Viewer API validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Key up validation', () => {
console.log('Key up validation');
        documentHelper.isControlPressed = true;
        let event: any = {
            preventDefault: () => { return true; },
            keyCode: 17,
        }
        documentHelper.onKeyUpInternal(event);
        expect(documentHelper.isControlPressed).toBe(false);
    });
    it('Pinch Zoom in validation', () => {
console.log('Pinch Zoom in validation');
        (editor.documentHelper as any).onPinchInInternal();
        expect(documentHelper.zoomFactor).toBe(0.99);
        (editor.documentHelper as any).onPinchOutInternal();
        expect(documentHelper.zoomFactor).toBe(1);
    });
    it('Delete API validation', () => {
console.log('Delete API validation');
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.moveToLineStart();
        editor.editorModule.handleDelete();
        editor.editorModule.handleDelete();
        editor.selection.selectAll();
        expect(editor.selection.text).toBe('ncfusion Software\r')
    });
    it('Ctrl + Up Arrow validation', () => {
console.log('Ctrl + Up Arrow validation');
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.handleControlUpKey();
        expect(editor.selection.start.offset).toBe(0);
        editor.selection.handleControlDownKey();
        //expect(editor.selection.start.offset).toBe(editor.selection.getLength(editor.selection.start.paragraph) - 1);
    });
    it('Shift + Ctrl down key validation', () => {
console.log('Shift + Ctrl down key validation');
        editor.editorModule.insertText('Syncfusion Software');
        editor.selection.moveToLineStart();
        editor.selection.handleControlShiftDownKey();
        expect(editor.selection.text).toBe('Syncfusion Software\r');
        editor.selection.handleControlDownKey();
        //expect(editor.selection.start.offset).toBe(editor.selection.getLength(editor.selection.start.paragraph) - 1);
    });
});

describe('Tab key validation with accept tab false', () => {
    let editor: DocumentEditor;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('tab key validation', () => {
console.log('tab key validation');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });
    it('shift tab key validation with accept tab false', () => {
console.log('shift tab key validation with accept tab false');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });
    it('control tab key validation with accept tab false', () => {
console.log('control tab key validation with accept tab false');
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.documentHelper.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });

});
describe('Header footer maximum height validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Double Table on header footer region', () => {
console.log('Double Table on header footer region');
        editor.openBlank();
        editor.editor.insertText('Synfusion');
        editor.editor.onEnter();
        editor.editor.insertText('Synfusion');
        editor.editor.onEnter();
        editor.editor.insertText('Synfusion');
        editor.editor.onEnter();
        let event: any = getEventObject('MouseEvent', 'dblclick');
        event = setMouseCoordinates(event, 345, 80);
        editor.documentHelper.onDoubleTap(event);
        for (let i = 0; i < 50; i++) {
            editor.editor.onEnter();
        }
        expect(editor.documentHelper.pages.length).toBe(1);
        expect((editor.documentHelper.pages[0].bodyWidgets[0].firstChild as ParagraphWidget).y).toBeLessThan(450);
    });
});
describe('Long Touch Testing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableContextMenu: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        //destroy validation
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Select current word on long touch in empty selection', () => {
console.log('Select current word on long touch in empty selection');
        let touchevent: any;
        let clientX_Y = { clientX: 297, clientY: 302, pageX: 297, pageY: 302 };
        let touches = [];
        let changedTouches = [];
        touches.push(clientX_Y);
        changedTouches.push(clientX_Y);
        touchevent = { touches, changedTouches, preventDefault: function () { } };
        documentHelper.isTouchInput = true;
        documentHelper.onTouchStartInternal(touchevent);
        documentHelper.onLongTouch(touchevent);
        let selStart: string = documentHelper.selection.start.hierarchicalPosition;
        let selEnd: string = documentHelper.selection.end.hierarchicalPosition;
        expect(selStart).not.toBe(selEnd);
    });
    it('Restrict editing in drop down form field', () => {
console.log('Restrict editing in drop down form field');
        editor.openBlank();
        editor.editor.insertFormField('DropDown');
        editor.selection.handleHomeKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        editor.editor.insertText('HELLO');
        let text: string = (((editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as ParagraphWidget).childWidgets[0] as LineWidget).children[0] as TextElementBox).text;
        expect(text).toBe('HELLO');
    });
});

let shapeWithRect: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{},"shapeId":3,"name":"Rectangle: Rounded Corners 3","visible":true,"width":416,"height":38.5,"widthScale":100,"heightScale":100,"verticalPosition":1,"verticalOrigin":"Paragraph","verticalAlignment":"None","horizontalPosition":16,"horizontalOrigin":"Column","horizontalAlignment":"None","zOrderPosition":251659264,"allowOverlap":true,"textWrappingStyle":"InFrontOfText","textWrappingType":"Both","distanceBottom":0,"distanceLeft":9,"distanceRight":9,"distanceTop":0,"layoutInCell":true,"lockAnchor":false,"autoShapeType":"RoundedRectangle","fillFormat":{"color":"#FFFFFFFF"},"lineFormat":{"color":"#00000000","weight":3,"lineStyle":"Solid","line":true},"textFrame":{"textVerticalAlignment":"Middle","leftMargin":5.4,"rightMargin":5.4,"topMargin":2.7,"bottomMargin":2.7,"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","boldBidi":false,"italicBidi":false,"fontSizeBidi":11,"fontFamilyBidi":"Calibri","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":16,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496","fontSizeBidi":13,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763","fontSizeBidi":12,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496","italicBidi":true,"fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763","fontFamilyBidi":"Calibri Light"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[],"footnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]},"endnotes":{"separator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0003"}]}],"continuationSeparator":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"\u0004"}]}],"continuationNotice":[{"paragraphFormat":{"listFormat":{}},"characterFormat":{},"inlines":[]}]}};
describe('Rectangle shape render validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        //destroy validation
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Rectangle shape render validation', () => {
        editor.open(shapeWithRect);
        (documentHelper.render as any).renderFloatingItems(documentHelper.currentPage, (documentHelper.currentPage.bodyWidgets[0].childWidgets[0] as ParagraphWidget).floatingElements, 'InfrontOfText');
        let width = documentHelper.render.pageCanvas.getContext("2d").lineWidth;
        documentHelper.render.pageCanvas.getContext("2d").restore();
        expect(width).toBe(3);
    });
});