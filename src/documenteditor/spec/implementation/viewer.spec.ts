import { DocumentEditor } from '../../src/document-editor/document-editor';
import { PageLayoutViewer } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from './../test-helper.spec';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { ParagraphWidget, BodyWidget, LineWidget, ImageElementBox } from '../../src/index';
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
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.destroy();
        //destroy validation
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Double tap validation', () => {
        editor.editorModule.insertText('Syncfusion Software', false);
        let event: any = getEventObject('MouseEvent', 'dblclick');
        event = setMouseCoordinates(event, 345, 130);
        editor.selection.moveToLineStart();
        viewer.onDoubleTap(event);
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(11);
    });
});

describe('Double tap touch testing', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Double tap touch', () => {
        editor.openBlank();
        let touchevent: any;
        let clientX_Y = { clientX: 297, clientY: 302, pageX: 297, pageY: 302 };
        let touches = [];
        let changedTouches = [];
        touches.push(clientX_Y);
        changedTouches.push(clientX_Y);
        touchevent = { touches, changedTouches, preventDefault: function () { } };
        viewer.isTouchInput = true;
        viewer.onTouchStartInternal(touchevent);
        viewer.onTouchMoveInternal(touchevent);
        viewer.onTouchUpInternal(touchevent);
        (viewer as any).tapCount = 1;
        viewer.onTouchStartInternal(touchevent);
        viewer.onTouchMoveInternal(touchevent);
        viewer.onTouchUpInternal(touchevent);
        expect((viewer as any).tapCount).toBe(2);
    });
    it('Double tap validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software', false);
        let event: any = getEventObject('MouseEvent', 'dblclick');
        event = setMouseCoordinates(event, 345, 160);
        editor.selection.moveToLineStart();
        viewer.onDoubleTap(event);
        expect(editor.selection.text).toBe('Syncfusion ');
    })
    it('Triple tap touch', () => {
        editor.openBlank();
        let touchevent: any;
        let clientX_Y = { clientX: 297, clientY: 302, pageX: 297, pageY: 302 };
        let touches = [];
        let changedTouches = [];
        touches.push(clientX_Y);
        changedTouches.push(clientX_Y);
        touchevent = { touches, changedTouches, preventDefault: function () { } };
        viewer.isTouchInput = true;
        viewer.onTouchStartInternal(touchevent);
        viewer.onTouchMoveInternal(touchevent);
        viewer.onTouchUpInternal(touchevent);
        (viewer as any).tapCount = 2;
        viewer.onTouchStartInternal(touchevent);
        viewer.onTouchMoveInternal(touchevent);
        viewer.onTouchUpInternal(touchevent);
        expect((viewer as any).tapCount).toBe(1);
    });
});

describe('update cursor position validation', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
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
        editor.editorModule.insertHyperlink('Syncfusion', 'https://syncfusion.com', true);
        editor.selection.movePreviousPosition();
        editor.selection.movePreviousPosition();

        let event: any = {
            preventDefault: () => { return true },
            offsetX: viewer.currentPage.boundingRectangle.x + editor.selection.start.location.x,
            offsetY: editor.selection.start.location.y - viewer.viewerContainer.scrollTop + viewer.currentPage.boundingRectangle.y,
            ctrlKey: true
        };
        viewer.onMouseMoveInternal(event);
        expect(viewer.viewerContainer.style.cursor).toBe('pointer');
    });
});

function getImageString(): string {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
}

describe('Branch validation', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableContextMenu: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Hide Context menu on window resize', () => {
        editor.editorModule.insertText('Syncfusion Software', false);
        editor.selection.selectAll();
        viewer.onDoubleTap({ offsetX: 10000, offsetY: 10000 } as any);
        expect(editor.selection.text).toBe('Syncfusion Software\r');
    });
    it('Fit full page validation', () => {
        viewer.onPageFitTypeChanged('FitOnePage');
        let zoomFactor: number = viewer.zoomFactor;
        viewer.onPageFitTypeChanged('FitOnePage');
        expect(zoomFactor).toBe(viewer.zoomFactor);
    });
    it('Get Current header footer validation', () => {
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
        viewer.onDocumentChanged(sections);

        expect(viewer.getHeaderFooterType(section, false)).not.toBe('FirstPageFooter');
        expect(viewer.getHeaderFooterType(section, true)).not.toBe('FirstPageHeader');

    });
    it('Cursor over image testing', () => {
        editor.viewer.zoomFactor = 1;
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
        viewer.onDocumentChanged(sections);
        let event: any = {
            offsetX: 110 + viewer.currentPage.boundingRectangle.x,
            offsetY: 110 + viewer.currentPage.boundingRectangle.y,
            ctrlKey: false
        };
        (viewer as any).updateCursor(event);
        // expect(viewer.viewerContainer.style.cursor).toBe('move');
    });
});
describe('Handle Key down', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, ImageResizer);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableImageResizer: true, isReadOnly: false, enableEditorHistory: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Mouse down on image resizer area', () => {
        editor.openBlank();
        viewer.editableDiv.innerHTML = 'S';
        editor.editorModule.onTextInputInternal({} as any);
        editor.selection.selectAll();
        expect(editor.selectionModule.text).toBe('S\r');
        editor.editorModule.onBackSpace();
        viewer.editableDiv.innerHTML = String.fromCharCode(160);
        editor.editorModule.onTextInputInternal({} as any);
        editor.selection.selectAll();
        expect(editor.selectionModule.text).not.toBe(String.fromCharCode(160) + '\r');
        expect(editor.selectionModule.text).toBe(' \r');
    });
});

describe('Key down validation', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, OptionsPane);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSearch: true, enableOptionsPane: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Open option pane validation', () => {
        let event: any = {
            which: 72,
            preventDefault: () => { return true; },
            ctrlKey: true
        }
        viewer.onKeyDownInternal(event);
        expect(editor.optionsPaneModule.optionsPane.style.display).not.toBe('none');
        event.which = 27;
        viewer.onKeyDownInternal(event);
        expect(editor.optionsPaneModule.optionsPane.style.display).toBe('none');
    });
    it('Create empty document', () => {
        let event: any = {
            keyCode: 78,
            preventDefault: () => { return true; },
            ctrlKey: true
        }
        let spy = jasmine.createSpy('documentchange');
        editor.documentChange = spy;
        viewer.onKeyDownInternal(event);
        expect(spy).toHaveBeenCalled();
    });
    it('shift end and home key validation', () => {
        let event: any = {
            keyCode: 35,
            preventDefault: () => { return true; },
            ctrlKey: true,
            shiftKey: true,
        }
        viewer.onKeyDownInternal(event);
        expect(editor.selection.end.offset).toBe(1);
        event.keyCode = 36;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
        event.keyCode = 40;
        viewer.onKeyDownInternal(event);
        event.keyCode = 77;
        viewer.onKeyDownInternal(event);
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Page Down  and page Up validation', () => {
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.editorModule.insertText('Adventure Work Cycles', false);
        let prevLocation = editor.selection.start.location.x;
        event = { keyCode: 33, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        expect(prevLocation).toBe(editor.selection.start.location.x);
        event = { keyCode: 34, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        expect(prevLocation).toBe(editor.selection.start.location.x);
    });
    it('tab key validation', () => {
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });
    it('Enter at empty list validation', () => {
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
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('Key up validation', () => {
        viewer.isControlPressed = true;
        let event: any = {
            preventDefault: () => { return true; },
            keyCode: 17,
        }
        viewer.onKeyUpInternal(event);
        expect(viewer.isControlPressed).toBe(false);
    });
    it('Pinch Zoom in validation', () => {
        (viewer as any).onPinchInInternal();
        expect(viewer.zoomFactor).toBe(0.99);
        (viewer as any).onPinchOutInternal();
        expect(viewer.zoomFactor).toBe(1);
    });
    it('Delete API validation', () => {
        editor.editorModule.insertText('Syncfusion Software', false);
        editor.selection.moveToLineStart();
        editor.editorModule.handleDelete();
        editor.editorModule.handleDelete();
        editor.selection.selectAll();
        expect(editor.selection.text).toBe('ncfusion Software\r')
    });
    it('Ctrl + Up Arrow validation', () => {
        editor.editorModule.insertText('Syncfusion Software', false);
        editor.selection.handleControlUpKey();
        expect(editor.selection.start.offset).toBe(0);
        editor.selection.handleControlDownKey();
        //expect(editor.selection.start.offset).toBe(editor.selection.getLength(editor.selection.start.paragraph) - 1);
    });
    it('Shift + Ctrl down key validation', () => {
        editor.editorModule.insertText('Syncfusion Software', false);
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('tab key validation', () => {
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });
    it('shift tab key validation with accept tab false', () => {
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: false, shiftKey: true, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });
    it('control tab key validation with accept tab false', () => {
        editor.openBlank();
        editor.editor.applyNumbering('%1.', 'Arabic');
        let prevlocation = editor.selection.start.location.x;
        event = { keyCode: 9, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        editor.viewer.onKeyDownInternal(event);
        expect(prevlocation).toBe(editor.selection.start.location.x);
    });

});
describe('Header footer maximum height validation', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Double Table on header footer region', () => {
        editor.openBlank();
        editor.editor.insertText('Synfusion', false);
        editor.editor.onEnter();
        editor.editor.insertText('Synfusion', false);
        editor.editor.onEnter();
        editor.editor.insertText('Synfusion', false);
        editor.editor.onEnter();
        let event: any = getEventObject('MouseEvent', 'dblclick');
        event = setMouseCoordinates(event, 345, 80);
        editor.viewer.onDoubleTap(event);
        for (let i = 0; i < 50; i++) {
            editor.editor.onEnter();
        }
        expect(editor.viewer.pages.length).toBe(1);
        expect((editor.viewer.pages[0].bodyWidgets[0].firstChild as ParagraphWidget).y).toBeLessThan(450);
    });
});