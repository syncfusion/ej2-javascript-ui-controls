import { DocumentEditor } from '../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer, WebLayoutViewer } from '../../src/index';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Page, Widget, BodyWidget, ParagraphWidget, LineWidget, TextElementBox } from '../../src/index';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { OptionsPane, DocumentHelper } from '../../src/document-editor/index';
import { ImageResizer } from '../../src/document-editor/implementation/editor/image-resizer';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';

function getImageString(): string {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
}

describe('Show Tool tip validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, ContextMenu);
        editor = new DocumentEditor({
            enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true,
            enableContextMenu: true
        });
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
    it('Show hyperlink validation', () => {
console.log('Show hyperlink validation');
        editor.openBlank();
        editor.editorModule.insertTextInternal('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ');
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: documentHelper.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: (editor.selection.start.location.y - documentHelper.viewerContainer.scrollTop + documentHelper.currentPage.boundingRectangle.y) + 5,
            ctrlKey: true
        };
        documentHelper.onMouseMoveInternal(event);
        expect((editor.selection as any).toolTipElement).toBeDefined();
        expect(((editor.selection as any).toolTipElement as HTMLElement).style.display).toBe('block');
        documentHelper.onMouseMoveInternal(event);
        editor.selection.showToolTip(0, 0);
        editor.selection.hideToolTip();
        expect(((editor.selection as any).toolTipElement as HTMLElement).style.display).toBe('none');
    });
    it('Update Position for tooltip element', () => {
console.log('Update Position for tooltip element');
        editor.openBlank();
        editor.editorModule.insertTextInternal('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ');
        editor.selection.moveToLineStart();
        let hyperlinkLocation = editor.selection.start.location;
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: documentHelper.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: (editor.selection.start.location.y - documentHelper.viewerContainer.scrollTop + documentHelper.currentPage.boundingRectangle.y) + 5,
            ctrlKey: true
        };
        documentHelper.viewerContainer.scrollTop = 100;
        documentHelper.onMouseMoveInternal(event);
        expect(((editor.selection as any).toolTipElement as HTMLElement).innerText.substring(0, 22)).toBe('https://syncfusion.com');
        event.offsetX = (documentHelper.currentPage.boundingRectangle.x + hyperlinkLocation.x) + 5;
        event.offsetY = (hyperlinkLocation.y - documentHelper.viewerContainer.scrollTop + documentHelper.currentPage.boundingRectangle.y) + 5;
        documentHelper.onMouseMoveInternal(event);
        expect(((editor.selection as any).toolTipElement as HTMLElement).innerText.substring(0, 26)).toBe('https://ej2-syncfusion.com');
        editor.selection.hideToolTip();
    });
    it('Prevent tooltip if context menu open', () => {
console.log('Prevent tooltip if context menu open');
        editor.openBlank();
        editor.editorModule.insertTextInternal('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ');
        editor.selection.moveToLineStart();
        let hyperlinkLocation = editor.selection.start.location;
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: documentHelper.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: editor.selection.start.location.y - documentHelper.viewerContainer.scrollTop + documentHelper.currentPage.boundingRectangle.y + 5,
            ctrlKey: true
        };
        editor.contextMenuModule.contextMenuInstance.element.style.display = 'block';
        documentHelper.onMouseMoveInternal(event);
        expect((editor.selection as any).toolTipObject).toBeUndefined();
    });
    it('hyperlink navigate with out ctrl click', () => {
console.log('hyperlink navigate with out ctrl click');
        editor.useCtrlClickToFollowHyperlink = false;
        editor.openBlank();
        editor.editorModule.insertTextInternal('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ');
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: documentHelper.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: editor.selection.start.location.y - documentHelper.viewerContainer.scrollTop + documentHelper.currentPage.boundingRectangle.y + 5,
            ctrlKey: false, which: 1
        };
        documentHelper.onMouseMoveInternal(event);
        documentHelper.onMouseMoveInternal(event);
        let spy = jasmine.createSpy('navigate');
        editor.requestNavigate = spy;
        documentHelper.onMouseDownInternal(event);
        documentHelper.onMouseMoveInternal(event);
        documentHelper.onMouseUpInternal(event);
        expect(spy).toHaveBeenCalled();
    });
});

describe('Viewer API Testing with out owner control', () => {
    let viewer = new PageLayoutViewer(undefined);
    it('Render Visible page testing', () => {
console.log('Render Visible page testing');
        expect(() => { viewer.renderVisiblePages(); }).not.toThrowError();
    });
});

//

describe('Viewer branches validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;

    });
    afterAll((done) => {
        editor.documentHelper.zoomFactor = 1;;
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Get Caret bottom on empty selection', () => {
console.log('Get Caret bottom on empty selection');
        editor.openBlank();
        let caretBottom: number = editor.selection.getCaretBottom(editor.documentStart, true);
        expect(caretBottom).not.toBe(0);
        let bottom: number = editor.selection.getCaretBottom(editor.documentStart, false);
        expect(bottom).toBeGreaterThanOrEqual(caretBottom);
    });
    it('Pinch Zoom In API validation', () => {
console.log('Pinch Zoom In API validation');
        editor.openBlank();
        let currentZoomFactor = documentHelper.zoomFactor;
        (editor.documentHelper as any).onPinchInInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(currentZoomFactor - 0.01);
        editor.documentHelper.zoomFactor = 2.5;
        (editor.documentHelper as any).onPinchInInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(2.5 - 0.01 - 0.01);
        editor.documentHelper.zoomFactor = 0.1;
        (editor.documentHelper as any).onPinchInInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(0.1);
    });
    it('Pinch Zoom Out API validation', () => {
console.log('Pinch Zoom Out API validation');
        editor.openBlank();
        editor.documentHelper.zoomFactor = 1;;
        let currentZoomFactor = documentHelper.zoomFactor;
        (editor.documentHelper as any).onPinchOutInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(currentZoomFactor + 0.01);
        editor.documentHelper.zoomFactor = 2.5;
        (editor.documentHelper as any).onPinchOutInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(2.5 + 0.01 + 0.01);
        editor.documentHelper.zoomFactor = 5;
        (editor.documentHelper as any).onPinchOutInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(5);
    });
    it('Pinch Zoom In after 0.1', () => {
console.log('Pinch Zoom In after 0.1');
        editor.documentHelper.zoomFactor = 0.1;
        (editor.documentHelper as any).onPinchInInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(0.1);
        editor.documentHelper.zoomFactor = 5;
        (editor.documentHelper as any).onPinchOutInternal({} as any);
        expect(documentHelper.zoomFactor).toBe(5);
    });
});

describe('Viewer with out owner control validation', () => {
    let editor = new DocumentEditor();
    let viewer: PageLayoutViewer = new PageLayoutViewer(editor);
    let documentHelper: DocumentHelper;
    documentHelper = editor.documentHelper;

    it('Branch Validation', () => {
console.log('Branch Validation');
        expect(() => { documentHelper.initializeComponents() }).not.toThrowError();
        expect(documentHelper.currentRenderingPage).toBeUndefined();
        expect(() => { documentHelper.onDoubleTap({} as any) }).not.toThrowError();
        expect(() => { documentHelper.onTouchStartInternal({} as any) }).not.toThrowError();
        expect(() => { documentHelper.onTouchMoveInternal({ touches: [] } as any) }).not.toThrowError();
        expect(() => { documentHelper.onTouchUpInternal({} as any) }).not.toThrowError();
        expect(() => { documentHelper.onKeyDownInternal({} as any) }).not.toThrowError();
        expect(() => { documentHelper.onKeyPressInternal({ preventDefault: () => { return true; } } as any) }).not.toThrowError();
        expect(() => { documentHelper.updateFocus() }).not.toThrowError();
        expect(() => { viewer.updateClientAreaTopOrLeft({} as any, false) }).not.toThrowError();
        expect(documentHelper.getLineWidgetInternal({ x: 0, y: 0 } as any, false)).toBeUndefined();
        expect(() => { documentHelper.onWindowResize(); }).not.toThrowError();
        expect(() => { documentHelper.onContextMenu({} as any); }).not.toThrowError();
    });
});


describe('Read only mode validation on viewer with selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ isReadOnly: true, enableSelection: true });
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
    it('Mouse down validation', () => {
console.log('Mouse down validation');
        editor.openBlank();
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0
        };
        let spy = jasmine.createSpy('Spy');
        editor.fireSelectionChange = spy;
        documentHelper.onMouseMoveInternal(event as any);
        expect(documentHelper.isMouseDown).toBe(false);
        documentHelper.onMouseDownInternal(event as any);
        documentHelper.onMouseUpInternal(event as any);
        expect(spy).toHaveBeenCalled();
    });
    it('Key board navigation', () => {
console.log('Key board navigation');
        let event: any = {
            keyCode: 221,
            preventDefault: () => { return true; },
            ctrlKey: true,
            shiftKey: true,
            altKey: false
        }
        documentHelper.onKeyDownInternal(event);
        let spy = jasmine.createSpy('Spy');
        editor.fireSelectionChange = spy;
        event.keyCode = 188;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 190;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 68;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 77;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 221;
        documentHelper.onKeyDownInternal(event);
        event.shiftKey = false;
        event.altKey = true;
        documentHelper.onKeyDownInternal(event);
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('Viewer API validation for branches', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableSelection: true });
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
    it('Mouse Down trigger on content menu validation', () => {
console.log('Mouse Down trigger on content menu validation');
        let event: any = {
            offsetX: 100, offsetY: 100,
            preventDefault: () => { return true; },
            which: 3,
            ctrlKey: false,
            detail: 1
        }
        editor.selection.selectAll();
        documentHelper.onMouseDownInternal(event);
        expect(documentHelper.isMouseDown).toBe(true);
    });
    it('Add selection range validation', () => {
console.log('Add selection range validation');
        editor.openBlank();
        editor.selection.selectAll();
        let event: any = {
            offsetX: 100, offsetY: 100,
            preventDefault: () => { return true; },
            which: 1,
            ctrlKey: true,
            detail: 1
        }
        documentHelper.onMouseDownInternal(event);
        expect(documentHelper.isControlPressed).toBe(true);
        documentHelper.onMouseUpInternal(event);
    });

});

describe('Touch event validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false });
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
    it('Touch start validation', () => {
console.log('Touch start validation');
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        documentHelper.onTouchStartInternal(event);
        documentHelper.onTouchUpInternal(event);
        let rect: ClientRect = documentHelper.viewerContainer.getBoundingClientRect();
        touches[0].pageX = pageX + rect.left;
        touches[0].pageY = pageY + rect.top + 28;
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(1);
        documentHelper.onTouchUpInternal(event);
        touches[0].pageX = pageX + rect.left + 10;
        touches[0].pageY = pageY + rect.top + 28; //widget height
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(1);
        documentHelper.onTouchUpInternal(event);
    });
    it('Selection using touch gripper', () => {
console.log('Selection using touch gripper');
        editor.editorModule.insertText('Syncfusion');
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        documentHelper.onTouchStartInternal(event);
        documentHelper.onTouchUpInternal(event);
        let rect: ClientRect = documentHelper.viewerContainer.getBoundingClientRect();
        touches[0].pageX = pageX + rect.left;
        touches[0].pageY = pageY + rect.top + 28;
        documentHelper.onTouchStartInternal(event);
        touches[0].pageX = pageX + rect.left + 40;
        touches[0].pageY = pageY + rect.top + 28 + 40;
        documentHelper.onTouchMoveInternal(event);
        expect(editor.selection.isEmpty).toBe(false);
        documentHelper.onTouchUpInternal(event);
        touches[0].pageX = pageX + rect.left - 10;
        touches[0].pageY = pageY + rect.top + 28;
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(2);
        documentHelper.onTouchUpInternal(event);
        touches[0].pageX = pageX + rect.left + 10;
        touches[0].pageY = pageY + rect.top + 28 - 10;
        documentHelper.onTouchStartInternal(event);
        touches[0].pageX = pageX + rect.left + 20;
        touches[0].pageY = pageY + rect.top + 28;
        documentHelper.onTouchMoveInternal(event);
        documentHelper.onTouchUpInternal(event);
    });
    it('Touch zoom in and out at zoom factor 1', () => {
console.log('Touch zoom in and out at zoom factor 1');
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY,
            clientX: point.x,
            clientY: point.y
        }, {
            pageX: pageX,
            pageY: pageY,
            clientX: point.x + 50,
            clientY: point.y + 10
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeGreaterThan(1);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeLessThan(1);
        documentHelper.onTouchUpInternal(event);
    });
    it('Touch zoom in and out zoom factor > 2 ', () => {
console.log('Touch zoom in and out zoom factor > 2 ');
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY,
            clientX: point.x,
            clientY: point.y
        }, {
            pageX: pageX,
            pageY: pageY,
            clientX: point.x + 50,
            clientY: point.y + 10
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.documentHelper.zoomFactor = 2.5;
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeGreaterThan(2.5);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeLessThan(2.5);
        documentHelper.onTouchUpInternal(event);
    });
    it('Touch zoom in zoom factor > 2 ', () => {
console.log('Touch zoom in zoom factor > 2 ');
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY,
            clientX: point.x,
            clientY: point.y
        }, {
            pageX: pageX,
            pageY: pageY,
            clientX: point.x + 50,
            clientY: point.y + 10
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.documentHelper.zoomFactor = 2;
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeGreaterThan(2);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeLessThan(2);
        documentHelper.onTouchUpInternal(event);
    });
    it('Touch zoom in zoom factor > 2 ', () => {
console.log('Touch zoom in zoom factor > 2 ');
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY,
            clientX: point.x,
            clientY: point.y
        }, {
            pageX: pageX,
            pageY: pageY,
            clientX: point.x + 50,
            clientY: point.y + 10
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.documentHelper.zoomFactor = 2;
        documentHelper.onTouchStartInternal(event);
        expect(documentHelper.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeLessThan(2);
        documentHelper.onTouchUpInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        documentHelper.onTouchMoveInternal(event);
        expect(documentHelper.zoomFactor).toBeGreaterThanOrEqual(2);
    });
});

describe('Touch event Zoom validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, ContextMenu);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true,
            enableContextMenu: true });
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
    it('on zoom context menu prevention', () => {
console.log('on zoom context menu prevention');
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + documentHelper.currentPage.boundingRectangle.x;
        let pageY: number = point.y + documentHelper.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY,
            clientX: point.x,
            clientY: point.y
        }, {
            pageX: pageX,
            pageY: pageY,
            clientX: point.x + 50,
            clientY: point.y + 50
        }];
        let event: any = {
            type: "touchstart",
            target: documentHelper.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.documentHelper.zoomFactor = 2;
        documentHelper.onTouchStartInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        documentHelper.onTouchMoveInternal(event);
        documentHelper.onTouchUpInternal(event);
        expect(editor.contextMenuModule.contextMenuInstance.element.style.display).toBe('none');
    });
});

/**
 * Viewer Spec
 */
describe('Key down internal validation -1 tab key', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
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
    it('ctrl tab key validation with selection', () => {
console.log('ctrl tab key validation with selection');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
    });
    it('shift tab key validation', () => {
console.log('shift tab key validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: true, which: 0 };
        documentHelper.onKeyDownInternal(event);
        editor.editor.insertTable(2, 2);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: true, which: 0 };
        documentHelper.onKeyDownInternal(event);
    });
    it('tab key validation with selection', () => {
console.log('tab key validation with selection');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
    });
    it('tab key validation inside table', () => {
console.log('tab key validation inside table');
        editor.editor.insertTable(2, 1);
        let event: any;
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
    });
});

describe('Key down internal validation -2 paragraph alignent', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
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
    it('BeforeSpacing', () => {
console.log('BeforeSpacing');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 48, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(0);
    });
    it('Linespacing validation', () => {
console.log('Linespacing validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 49, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(1);
        event = { keyCode: 50, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
        event = { keyCode: 53, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(1.5);
    });
    it('copy and font dialog validation', () => {
console.log('copy and font dialog validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 67, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.editorModule.copiedData).not.toBeUndefined();
        event = { keyCode: 68, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: true, which: 0 };
        documentHelper.onKeyDownInternal(event);
    });
    it('Text Alignment validation', () => {
console.log('Text Alignment validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any;
        event = { keyCode: 76, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Justify');
        event = { keyCode: 82, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
    });
    it('cut validation', () => {
console.log('cut validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 88, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.editorModule.copiedData).not.toBeUndefined();
    });
});
describe('Key down internal validation -2 paragraph alignment', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
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
    it('Font size increment and decrement validation', () => {
console.log('Font size increment and decrement validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        let previousSize = editor.selection.characterFormat.fontSize;
        event = { keyCode: 188, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: true, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 190, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: true, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(previousSize).toBe(editor.selection.characterFormat.fontSize);
    });
    it('Left indent', () => {
console.log('Left indent');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        let prevLeftIndent = editor.selection.paragraphFormat.leftIndent;
        event = { keyCode: 77, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(prevLeftIndent).not.toBe(editor.selection.paragraphFormat.leftIndent);
    });
    it('Highlight Color validation', () => {
console.log('Highlight Color validation');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 72, preventDefault: function () { }, altKey: true, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.characterFormat.highlightColor).toBe('Yellow');
    });
    it('backspace and delete key', () => {
console.log('backspace and delete key');
        editor.editorModule.insertText('Adventure Works cycle');
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        event = { keyCode: 8, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        editor.editorHistory.undo();
        event = { keyCode: 46, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
    });
    it('Viewer insert Page validation', () => {
console.log('Viewer insert Page validation');
        // let word: WordDocument = new WordDocument();
        // let section1: WSection = new WSection();
        // let paragraph: WParagraph = new WParagraph();
        // section1.blocks.push(paragraph);
        // let section2: WSection = new WSection();
        // let paragraph2: WParagraph = new WParagraph();
        // section2.blocks.push(paragraph2);
        // word.sections.push(section1);
        // word.sections.push(section2);
        // viewer.document = word;
        // for (let i: number = 0; i < 60; i++) {
        //     editor.editorModule.onEnter();
        // }
        // expect(viewer.pages.length).toBe(3);
    });

});
describe('Key Board shortcut Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
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
    it('handle control up key', () => {
console.log('handle control up key');
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        let event: any = { keyCode: 37, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.isEmpty).toBe(true);
        editor.selectionModule.selectCurrentWord();
        expect(editor.selectionModule.text).toBe('Software');
    });
    it('Handle Control up key', () => {
console.log('Handle Control up key');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        let event: any = { keyCode: 38, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
    it('Handle Control down key', () => {
console.log('Handle Control down key');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        let event: any = { keyCode: 40, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        editor.selectionModule.moveUp();
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
});

describe('Key Board validation on Read only mode', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ isReadOnly: true, enableSelection: true });
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
    it('Key down on with ctrl press', () => {
console.log('Key down on with ctrl press');
        let lineSpacing = editor.selection.paragraphFormat.lineSpacing;
        let event: any = { keyCode: 49, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        event.keyCode = 68;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 50;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        event.keyCode = 53;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        let beforeSpacing = editor.selection.paragraphFormat.beforeSpacing;
        event.keyCode = 48;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(beforeSpacing);
    });
    it('Paragraph format key board validation in read only mode', () => {
console.log('Paragraph format key board validation in read only mode');
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Center');
        event.keyCode = 70;
        documentHelper.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 72;
        documentHelper.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 74;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Justify');
        event.keyCode = 75;
        documentHelper.onKeyDownInternal(event);
        expect(editor.hyperlinkDialogModule).toBe(undefined);
        event.keyCode = 76;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Left');

    });
    it('Toggle alignment on read only', () => {
console.log('Toggle alignment on read only');
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        event.keyCode = 77;
        documentHelper.onKeyDownInternal(event);
    });

});
describe('Key Board shortcut Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('handle control up key', () => {
console.log('handle control up key');
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        let event: any = { keyCode: 37, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.isEmpty).toBe(true);
        editor.selectionModule.selectCurrentWord();
        expect(editor.selectionModule.text).toBe('Software');
    });
    it('Handle Control up key', () => {
console.log('Handle Control up key');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        let event: any = { keyCode: 38, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
    it('Handle Control down key', () => {
console.log('Handle Control down key');
        editor.openBlank();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertTextInternal('Syncfusion Software', true);
        let event: any = { keyCode: 40, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        editor.selectionModule.moveUp();
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
});

describe('Key Board validation on Read only mode', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ isReadOnly: true, enableSelection: true });
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
    it('Key down on with ctrl press', () => {
console.log('Key down on with ctrl press');
        let lineSpacing = editor.selection.paragraphFormat.lineSpacing;
        let event: any = { keyCode: 49, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 219;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 221;
        event.keyCode = 68;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 50;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        event.keyCode = 53;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        let beforeSpacing = editor.selection.paragraphFormat.beforeSpacing;
        event.keyCode = 48;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(beforeSpacing);
    });
    it('Paragraph format key board validation in read only mode', () => {
console.log('Paragraph format key board validation in read only mode');
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Center');
        event.keyCode = 70;
        documentHelper.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 72;
        documentHelper.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 78;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 74;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Justify');
        event.keyCode = 75;
        documentHelper.onKeyDownInternal(event);
        expect(editor.hyperlinkDialogModule).toBe(undefined);
        event.keyCode = 76;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Left');
    });
    it('Toggle alignment onnread only', () => {
console.log('Toggle alignment onnread only');
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        event.keyCode = 82;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 88;
        documentHelper.onKeyDownInternal(event);
        event.keyCode = 77;
        documentHelper.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.leftIndent).toBe(0);
    });
});

//#region Header footer
describe('Insert text in Header footer region', () => {
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
    it('enable header footer validation', () => {
console.log('enable header footer validation');
        editor.openBlank();
        let event: any = {
            offsetX: 5, offsetY: + 5, preventDefault: () => { return true }
        }
        documentHelper.onDoubleTap(event);
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
        event = {
            offsetX: documentHelper.currentPage.boundingRectangle.x + 5, offsetY: documentHelper.currentPage.boundingRectangle.y + 5,
            preventDefault: () => { return true }
        }
        documentHelper.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        documentHelper.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        event = {
            offsetX: 5, offsetY: 5, preventDefault: () => { return true }
        }
        documentHelper.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
    });
    it('Mouse move validation on header', () => {
console.log('Mouse move validation on header');
        editor.openBlank();
        let event: any = {
            offsetX: documentHelper.currentPage.boundingRectangle.x + 96, offsetY: documentHelper.currentPage.boundingRectangle.y + 48,
            preventDefault: () => { return true }, which: 1
        }
        documentHelper.onDoubleTap(event)
        editor.dataBind();

        documentHelper.onMouseDownInternal(event);
        event.offsetX = event.offsetX + 30;
        documentHelper.onMouseMoveInternal(event);
        event.offsetX = event.offsetX + 30;
        documentHelper.onMouseMoveInternal(event);
        documentHelper.onMouseUpInternal(event);
        expect(editor.selection.start.paragraph.isInHeaderFooter).toBe(true);
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Double tap on footer region validation', () => {
console.log('Double tap on footer region validation');
        let y = documentHelper.currentPage.boundingRectangle.y + documentHelper.currentPage.boundingRectangle.height - 48;
        let event: any = {
            offsetX: documentHelper.currentPage.boundingRectangle.x + 5, offsetY: y,
            preventDefault: () => { return true }
        }
        documentHelper.onDoubleTap(event);
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        event.offsetY = event.offsetY - viewer.containerTop;
        documentHelper.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        event = {
            offsetX: 5, offsetY: 5, preventDefault: () => { return true }
        }
        documentHelper.onDoubleTap(event);
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
        event.offsetY = documentHelper.currentPage.boundingRectangle.y + documentHelper.currentPage.boundingRectangle.height - 200;
        documentHelper.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
    });
//     it('Selection on footer content', () => {
// console.log('Selection on footer content');
//         let y = documentHelper.currentPage.boundingRectangle.y + documentHelper.currentPage.boundingRectangle.height - 48;
//         let event: any = {
//             offsetX: documentHelper.currentPage.boundingRectangle.x + 96, offsetY: y,
//             preventDefault: () => { return true }, which: 1
//         }
//         event.offsetY = event.offsetY - viewer.containerTop;
//         documentHelper.onDoubleTap(event)
//         editor.dataBind();
//         event.offsetY = event.offsetY - (viewer.containerTop + 20);
//         expect(editor.enableHeaderAndFooter).toBe(true);
//         documentHelper.onMouseDownInternal(event);
//         event.offsetX = event.offsetX + 30;
//         documentHelper.onMouseMoveInternal(event);
//         documentHelper.onMouseUpInternal(event);
//         expect(editor.selection.start.paragraph.isInHeaderFooter).toBe(true);
//     });
});
describe('First Page header odd and even page header validation', () => {
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
    it('Header footer validation', () => {
console.log('Header footer validation');
        editor.documentHelper.onDocumentChanged([createDocument()]);
        expect(editor.documentHelper.isBlockInHeader(editor.selection.start.paragraph)).toBe(false);
        editor.editorModule.insertTextInternal('S', true);
        editor.editorModule.onApplyCharacterFormat('fontSize', 56);
        for (let i = 0; i < 35; i++) {
            editor.editorModule.onEnter();
        }
        documentHelper.viewerContainer.scrollTop = documentHelper.pageContainer.scrollHeight;
        viewer = editor.viewer as PageLayoutViewer;
        viewer.updateScrollBars();
        let y: number = documentHelper.viewerContainer.offsetHeight - 40;
        let event: any = {
            offsetX: documentHelper.currentPage.boundingRectangle.x + 20, offsetY: y,
            preventDefault: () => { return true }, which: 1
        }
        documentHelper.onDoubleTap(event);
        editor.dataBind();
        editor.editorModule.insertTextInternal('Syncfusion', true);
        documentHelper.viewerContainer.scrollTop = 0;
        viewer = editor.viewer as PageLayoutViewer;
        viewer.updateVisiblePages();
    });
});
describe('Header footer enable validation', () => {
    let editor: DocumentEditor;
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
    it('enable header footer validation', () => {
console.log('enable header footer validation');
        documentHelper = editor.documentHelper;
        let event: any = {
            offsetX: documentHelper.currentPage.boundingRectangle.x + 5, offsetY: documentHelper.currentPage.boundingRectangle.y + 5,
            preventDefault: () => { return true }
        }
        documentHelper.onDoubleTap(event);
        editor.dataBind();
        editor.editorModule.insertTextInternal('Syncfusion', true);
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        expect(documentHelper.currentPage.headerWidget.height + (documentHelper.currentPage.bodyWidgets[0].sectionFormat.headerDistance * 1.333333333)).toBeGreaterThan(96);
        event.offsetX = 5;
        event.offsetY = 5;
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        expect(editor.selection.isEmpty).toBe(false);
        editor.selection.extendToNextLine();
        editor.selection.extendToNextLine();
        editor.selection.extendToNextLine();
        expect(editor.selection.isEmpty).toBe(false);
        event.offsetX = 5;
        event.offsetY = 5;
        documentHelper.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
    });
//     it('Double tap on footer region validation', () => {
// console.log('Double tap on footer region validation');
//         documentHelper = editor.documentHelper;
//         let y = documentHelper.currentPage.boundingRectangle.y + documentHelper.currentPage.boundingRectangle.height - 48;
//         let event: any = {
//             offsetX: documentHelper.currentPage.boundingRectangle.x + 5, offsetY: y,
//             preventDefault: () => { return true }
//         }
//         documentHelper.onDoubleTap(event);
//         editor.dataBind();
//         documentHelper.onMouseDownInternal(event);
//         documentHelper.onMouseMoveInternal(event);
//         documentHelper.onMouseUpInternal(event);
//         editor.editorModule.insertTextInternal('Syncfusion', true);
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editorModule.onEnter();
//         editor.editor.insertTable(2, 2);
//         expect(editor.documentHelper.isBlockInHeader(editor.selection.start.paragraph)).toBe(false);
//         expect(documentHelper.currentPage.footerWidget.height + (documentHelper.currentPage.bodyWidgets[0].sectionFormat.footerDistance * 1.333333333)).toBeGreaterThan(96);
//         expect(documentHelper.currentPage.footerWidget.y).toBeLessThan(documentHelper.currentPage.boundingRectangle.height - (documentHelper.currentPage.bodyWidgets[0].sectionFormat.footerDistance * 1.333333333) * 2);
//         editor.selection.extendToNextLine();
//         editor.selection.extendToNextLine();
//         editor.selection.extendToNextLine();
//         expect(editor.selection.isEmpty).toBe(false);
//         editor.selection.extendToPreviousLine();
//         editor.selection.extendToPreviousLine();
//         editor.selection.extendToPreviousLine();
//         expect(editor.selection.isEmpty).toBe(true);
//     });
});
function createDocument(): BodyWidget {
    let section: BodyWidget = new BodyWidget();
    section.index = 0;
    section.sectionFormat = new WSectionFormat(section);
    section.sectionFormat.differentFirstPage = true;
    section.sectionFormat.differentOddAndEvenPages = true;
    let paragraph: ParagraphWidget = new ParagraphWidget();
    paragraph.index = 0;
    paragraph.paragraphFormat = new WParagraphFormat(paragraph);
    paragraph.characterFormat = new WCharacterFormat(paragraph);
    paragraph.characterFormat.fontSize = 56;
    let line: LineWidget = new LineWidget(paragraph);
    let element: TextElementBox = new TextElementBox();
    element.text = 'Syncfusion Software';
    element.characterFormat.fontSize = 56;
    line.children.push(element);
    element.line = line;
    section.childWidgets.push(paragraph);
    paragraph.containerWidget = section;
    paragraph.childWidgets.push(line);
    return section;
}



describe('Read only mode validation on viewer with selection', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('TextInput internal validation', () => {
console.log('TextInput internal validation');
        editor.isReadOnly = true;
        let spy = jasmine.createSpy('Spy');
        (editor.documentHelper as any).onTextInputInternal = spy;
        documentHelper.editableDiv.innerHTML = 'S';
        (editor.documentHelper as any).onTextInputInternal();
        expect(spy).toHaveBeenCalled();
    });
    it('Paste on read only mode', () => {
console.log('Paste on read only mode');
        let spy = jasmine.createSpy('spy');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0
        };
        editor.contentChange = spy;
        documentHelper.onPaste(event);
        expect(spy).not.toHaveBeenCalled();
    });
    it('onKeyPress internal validation', () => {
console.log('onKeyPress internal validation');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0
        };
        (editor.documentHelper as any).onKeyPressInternal(event);
    });
});

describe('Safari Paste Event Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('Paste Event Key Press Validation', () => {
console.log('Paste Event Key Press Validation');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0, key: "v"
        };
        let keyPress: any = (editor.documentHelper as any).onKeyPressInternal(event);
        expect(keyPress).toBe(undefined);
    });
    it('Select All Event Key Press Validation', () => {
console.log('Select All Event Key Press Validation');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0, key: "a"
        };
        let keyPress: any = (editor.documentHelper as any).onKeyPressInternal(event);
        expect(keyPress).toBe(undefined);
    });
});

describe('Mouse enter and leave validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('Mouse Leave Internal', () => {
console.log('Mouse Leave Internal');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; }
        };

        expect(() => { editor.documentHelper.onMouseLeaveInternal(event) }).not.toThrowError();
    });
    it('Mouse Enter internal', () => {
console.log('Mouse Enter internal');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; }
        };

        expect(() => { editor.documentHelper.onMouseEnterInternal() }).not.toThrowError();
    });
});
describe('Bounding rectangle height validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
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
        viewer = editor.documentHelper as any;
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
    it('Bounding rectangle height', () => {
console.log('Bounding rectangle height');
        editor.viewer.updateScrollBars();
        let pageHeight: number = editor.documentHelper.pages[0].boundingRectangle.height;
        let height: number = editor.documentHelper.pages[0].bodyWidgets[0].height;
        expect(pageHeight).toBeGreaterThanOrEqual(height);
    });
});
let pageField: any = {"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{"fontColor":"empty"},"text":"welcome"}]}],"headersFooters":{}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"second section"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"third section"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"3"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"fourth section"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"4"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Firft"},{"characterFormat":{"fontColor":"empty"},"text":" section"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"5"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Sixth section"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"6"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}},{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{}},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Sent section"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{"footer":{"blocks":[{"paragraphFormat":{"styleName":"Normal","listFormat":{},"tabs":[{"position":523,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{"fontColor":"empty"},"inlines":[{"characterFormat":{"fontColor":"empty"},"text":"Page "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"PAGE 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"7"},{"characterFormat":{},"fieldType":1},{"characterFormat":{"fontColor":"empty"},"text":" of "},{"characterFormat":{"fontColor":"empty"},"fieldType":0,"hasFieldEnd":true},{"characterFormat":{"fontColor":"empty"},"text":"NUMPAGES 1"},{"characterFormat":{},"fieldType":2},{"characterFormat":{"fontColor":"empty"},"text":"1"},{"characterFormat":{},"fieldType":1}]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"empty","fontSizeBidi":11,"fontFamilyBidi":"Arial","allCaps":false},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":36,"trackChanges":false,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"formFieldShading":true,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{"fontColor":"empty"},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{"fontColor":"empty"}},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[],"abstractLists":[],"comments":[],"revisions":[],"customXml":[]};
describe('Layout on resize', () => {
    let editor: DocumentEditor = undefined;
    let viewer: WebLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor)
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, layoutType: 'Continuous' });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Layout on resize', () => {
console.log('Layout on resize');
        editor.documentHelper.updateViewerSize();
        let currentwidth: number = editor.documentHelper.visibleBounds.width;
        let previouswidth: number = 0;
        if (currentwidth !== previouswidth) {
            previouswidth = currentwidth;
        }
        expect(previouswidth).toEqual(currentwidth);
    });
    it('Page field validation', () => {
console.log('Page field validation');
        editor.open(pageField);
        expect(editor.documentHelper.pages[1].currentPageNum).toBe(1);
    });
});
