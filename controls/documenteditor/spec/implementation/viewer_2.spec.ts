import { DocumentEditor } from '../../src/document-editor/document-editor';
import { PageLayoutViewer, LayoutViewer } from '../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Editor } from '../../src/index';
import { Page, Widget, BodyWidget, ParagraphWidget, LineWidget, TextElementBox } from '../../src/index';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { ContextMenu } from '../../src/document-editor/implementation/context-menu';
import { OptionsPane } from '../../src/document-editor/index';
import { ImageResizer } from '../../src/document-editor/implementation/editor/image-resizer';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { WParagraphFormat } from '../../src/document-editor/implementation/format/paragraph-format';
import { WCharacterFormat } from '../../src/document-editor/implementation/format/character-format';

function getImageString(): string {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADQSURBVFhH7ZbRDYQgDIYZ5UZhFEdxlBuFUUhY4N7vwWtTURJz5tem8GAbTYS0/eGjWsN7hJVSAuku3c2FuyF31BvqBNu90/mLmnSRjKDbMZULt2csz/kV8hRbVjSkSZkxRC0yKcbl+6FLhttSDIV5W6vYnKeZVWkR1WyFGbhIHrAbCzPhEcL1XCvqptYMd7xXExUXM4+pT3ENe53OP5yGqJ8kDDZGpIld6E730uFR/uuDs1J6OmolQDzcUeOslJ6OWgkQD3fUOCulJ6Ome4j9AGEu0k90WN54AAAAAElFTkSuQmCC';
}

describe('Show Tool tip validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, ContextMenu);
        editor = new DocumentEditor({
            enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true,
            enableContextMenu: true
        });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Show hyperlink validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ', false);
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: viewer.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: (editor.selection.start.location.y - viewer.viewerContainer.scrollTop + viewer.currentPage.boundingRectangle.y) + 5,
            ctrlKey: true
        };
        viewer.onMouseMoveInternal(event);
        expect((editor.selection as any).toolTipElement).toBeDefined();
        expect(((editor.selection as any).toolTipElement as HTMLElement).style.display).toBe('block');
        viewer.onMouseMoveInternal(event);
        editor.selection.showToolTip(0, 0);
        editor.selection.hideToolTip();
        expect(((editor.selection as any).toolTipElement as HTMLElement).style.display).toBe('none');
    });
    it('Update Position for tooltip element', () => {
        editor.openBlank();
        editor.editorModule.insertText('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ', false);
        editor.selection.moveToLineStart();
        let hyperlinkLocation = editor.selection.start.location;
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: viewer.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: (editor.selection.start.location.y - viewer.viewerContainer.scrollTop + viewer.currentPage.boundingRectangle.y) + 5,
            ctrlKey: true
        };
        viewer.viewerContainer.scrollTop = 100;
        viewer.onMouseMoveInternal(event);
        expect(((editor.selection as any).toolTipElement as HTMLElement).innerText.substring(0, 22)).toBe('https://syncfusion.com');
        event.offsetX = (viewer.currentPage.boundingRectangle.x + hyperlinkLocation.x) + 5;
        event.offsetY = (hyperlinkLocation.y - viewer.viewerContainer.scrollTop + viewer.currentPage.boundingRectangle.y) + 5;
        viewer.onMouseMoveInternal(event);
        expect(((editor.selection as any).toolTipElement as HTMLElement).innerText.substring(0, 26)).toBe('https://ej2-syncfusion.com');
        editor.selection.hideToolTip();
    });
    it('Prevent tooltip if context menu open', () => {
        editor.openBlank();
        editor.editorModule.insertText('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ', false);
        editor.selection.moveToLineStart();
        let hyperlinkLocation = editor.selection.start.location;
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: viewer.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: editor.selection.start.location.y - viewer.viewerContainer.scrollTop + viewer.currentPage.boundingRectangle.y + 5,
            ctrlKey: true
        };
        editor.contextMenuModule.contextMenuInstance.element.style.display = 'block';
        viewer.onMouseMoveInternal(event);
        expect((editor.selection as any).toolTipObject).toBeUndefined();
    });
    it('hyperlink navigate with out ctrl click', () => {
        editor.useCtrlClickToFollowHyperlink = false;
        editor.openBlank();
        editor.editorModule.insertText('https://syncfusion.com', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('https://ej2-syncfusion.com', true);
        editor.editorModule.insertText(' ', false);
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let event: any = {
            preventDefault: () => { return true; },
            offsetX: viewer.currentPage.boundingRectangle.x + editor.selection.start.location.x + 5,
            offsetY: editor.selection.start.location.y - viewer.viewerContainer.scrollTop + viewer.currentPage.boundingRectangle.y + 5,
            ctrlKey: false, which: 1
        };
        viewer.onMouseMoveInternal(event);
        viewer.onMouseMoveInternal(event);
        let spy = jasmine.createSpy('navigate');
        editor.requestNavigate = spy;
        viewer.onMouseDownInternal(event);
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        expect(spy).toHaveBeenCalled();
    });
});

describe('Viewer API Testing with out owner control', () => {
    let viewer = new PageLayoutViewer(undefined);
    it('Render Visible page testing', () => {
        expect(() => { viewer.renderVisiblePages(); }).not.toThrowError();
    });
});

//

describe('Viewer branches validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        editor.viewer.zoomFactor = 1;;
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Get Caret bottom on empty selection', () => {
        editor.openBlank();
        let caretBottom: number = editor.selection.getCaretBottom(editor.documentStart, true);
        expect(caretBottom).not.toBe(0);
        let bottom: number = editor.selection.getCaretBottom(editor.documentStart, false);
        expect(bottom).toBeGreaterThanOrEqual(caretBottom);
    });
    it('Pinch Zoom In API validation', () => {
        editor.openBlank();
        let currentZoomFactor = viewer.zoomFactor;
        (viewer as any).onPinchInInternal({} as any);
        expect(viewer.zoomFactor).toBe(currentZoomFactor - 0.01);
        editor.viewer.zoomFactor = 2.5;
        (viewer as any).onPinchInInternal({} as any);
        expect(viewer.zoomFactor).toBe(2.5 - 0.01 - 0.01);
        editor.viewer.zoomFactor = 0.1;
        (viewer as any).onPinchInInternal({} as any);
        expect(viewer.zoomFactor).toBe(0.1);
    });
    it('Pinch Zoom Out API validation', () => {
        editor.openBlank();
        editor.viewer.zoomFactor = 1;;
        let currentZoomFactor = viewer.zoomFactor;
        (viewer as any).onPinchOutInternal({} as any);
        expect(viewer.zoomFactor).toBe(currentZoomFactor + 0.01);
        editor.viewer.zoomFactor = 2.5;
        (viewer as any).onPinchOutInternal({} as any);
        expect(viewer.zoomFactor).toBe(2.5 + 0.01 + 0.01);
        editor.viewer.zoomFactor = 5;
        (viewer as any).onPinchOutInternal({} as any);
        expect(viewer.zoomFactor).toBe(5);
    });
    it('Pinch Zoom In after 0.1', () => {
        editor.viewer.zoomFactor = 0.1;
        (viewer as any).onPinchInInternal({} as any);
        expect(viewer.zoomFactor).toBe(0.1);
        editor.viewer.zoomFactor = 5;
        (viewer as any).onPinchOutInternal({} as any);
        expect(viewer.zoomFactor).toBe(5);
    });
});

describe('Viewer with out owner control validation', () => {
    let editor = new DocumentEditor();
    let viewer: PageLayoutViewer = new PageLayoutViewer(editor);
    it('Branch Validation', () => {
        expect(() => { viewer.initializeComponents() }).not.toThrowError();
        expect(viewer.currentRenderingPage).toBeUndefined();
        expect(() => { viewer.onDoubleTap({} as any) }).not.toThrowError();
        expect(() => { viewer.onTouchStartInternal({} as any) }).not.toThrowError();
        expect(() => { viewer.onTouchMoveInternal({ touches: [] } as any) }).not.toThrowError();
        expect(() => { viewer.onTouchUpInternal({} as any) }).not.toThrowError();
        expect(() => { viewer.onKeyDownInternal({} as any) }).not.toThrowError();
        // expect(() => { viewer.onKeyPressInternal({ preventDefault: () => { return true; } } as any) }).not.toThrowError();
        expect(() => { viewer.updateFocus() }).not.toThrowError();
        expect(() => { viewer.updateClientAreaTopOrLeft({} as any, false) }).not.toThrowError();
        expect(viewer.getLineWidgetInternal({ x: 0, y: 0 } as any, false)).toBeUndefined();
        expect(() => { viewer.onWindowResize(); }).not.toThrowError();
        expect(() => { viewer.onContextMenu({} as any); }).not.toThrowError();
    });
});


describe('Read only mode validation on viewer with selection', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ isReadOnly: true, enableSelection: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Mouse down validation', () => {
        editor.openBlank();
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0
        };
        let spy = jasmine.createSpy('Spy');
        editor.fireSelectionChange = spy;
        viewer.onMouseMoveInternal(event as any);
        expect(viewer.isMouseDown).toBe(false);
        viewer.onMouseDownInternal(event as any);
        viewer.onMouseUpInternal(event as any);
        expect(spy).toHaveBeenCalled();
    });
    it('Key board navigation', () => {
        let event: any = {
            keyCode: 221,
            preventDefault: () => { return true; },
            ctrlKey: true,
            shiftKey: true,
            altKey: false
        }
        viewer.onKeyDownInternal(event);
        let spy = jasmine.createSpy('Spy');
        editor.fireSelectionChange = spy;
        event.keyCode = 188;
        viewer.onKeyDownInternal(event);
        event.keyCode = 190;
        viewer.onKeyDownInternal(event);
        event.keyCode = 68;
        viewer.onKeyDownInternal(event);
        event.keyCode = 77;
        viewer.onKeyDownInternal(event);
        event.keyCode = 221;
        viewer.onKeyDownInternal(event);
        event.shiftKey = false;
        event.altKey = true;
        viewer.onKeyDownInternal(event);
        expect(spy).not.toHaveBeenCalled();
    });
});

describe('Viewer API validation for branches', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, isReadOnly: false, enableSelection: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Mouse Down trigger on content menu validation', () => {
        let event: any = {
            offsetX: 100, offsetY: 100,
            preventDefault: () => { return true; },
            which: 3,
            ctrlKey: false,
            detail: 1
        }
        editor.selection.selectAll();
        viewer.onMouseDownInternal(event);
        expect(viewer.isMouseDown).toBe(true);
    });
    it('Add selection range validation', () => {
        editor.openBlank();
        editor.selection.selectAll();
        let event: any = {
            offsetX: 100, offsetY: 100,
            preventDefault: () => { return true; },
            which: 1,
            ctrlKey: true,
            detail: 1
        }
        viewer.onMouseDownInternal(event);
        expect(viewer.isControlPressed).toBe(true);
        viewer.onMouseUpInternal(event);
    });

});

describe('Touch event validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:600px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Touch start validation', () => {
        let point = editor.selection.start.location;
        let pageX: number = point.x + viewer.currentPage.boundingRectangle.x;
        let pageY: number = point.y + viewer.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY
        }];
        let event: any = {
            type: "touchstart",
            target: viewer.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        viewer.onTouchStartInternal(event);
        viewer.onTouchUpInternal(event);
        let rect: ClientRect = viewer.viewerContainer.getBoundingClientRect();
        touches[0].pageX = pageX + rect.left;
        touches[0].pageY = pageY + rect.top + 28;
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(1);
        touches[0].pageX = pageX + rect.left + 10;
        touches[0].pageY = pageY + rect.top + 28; //widget height
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(1);
        viewer.onTouchUpInternal(event);
    });
    it('Selection using touch gripper', () => {
        editor.editorModule.insertText('Syncfusion', false);
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        let point = editor.selection.start.location;
        let pageX: number = point.x + viewer.currentPage.boundingRectangle.x;
        let pageY: number = point.y + viewer.currentPage.boundingRectangle.y;
        let touches: any[] = [{
            pageX: pageX,
            pageY: pageY
        }];
        let event: any = {
            type: "touchstart",
            target: viewer.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        viewer.onTouchStartInternal(event);
        viewer.onTouchUpInternal(event);
        let rect: ClientRect = viewer.viewerContainer.getBoundingClientRect();
        touches[0].pageX = pageX + rect.left;
        touches[0].pageY = pageY + rect.top + 28;
        viewer.onTouchStartInternal(event);
        touches[0].pageX = pageX + rect.left + 40;
        touches[0].pageY = pageY + rect.top + 28 + 40;
        viewer.onTouchMoveInternal(event);
        expect(editor.selection.isEmpty).toBe(false);
        viewer.onTouchUpInternal(event);
        touches[0].pageX = pageX + rect.left - 10;
        touches[0].pageY = pageY + rect.top + 28;
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(2);
        touches[0].pageX = pageX + rect.left + 10;
        touches[0].pageY = pageY + rect.top + 28 - 10;
        viewer.onTouchStartInternal(event);
        touches[0].pageX = pageX + rect.left + 20;
        touches[0].pageY = pageY + rect.top + 28;
        viewer.onTouchMoveInternal(event);
        viewer.onTouchUpInternal(event);
    });
    it('Touch zoom in and out at zoom factor 1', () => {
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + viewer.currentPage.boundingRectangle.x;
        let pageY: number = point.y + viewer.currentPage.boundingRectangle.y;
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
            target: viewer.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeGreaterThan(1);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeLessThan(1);
        viewer.onTouchUpInternal(event);
    });
    it('Touch zoom in and out zoom factor > 2 ', () => {
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + viewer.currentPage.boundingRectangle.x;
        let pageY: number = point.y + viewer.currentPage.boundingRectangle.y;
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
            target: viewer.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.viewer.zoomFactor = 2.5;
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeGreaterThan(2.5);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeLessThan(2.5);
        viewer.onTouchUpInternal(event);
    });
    it('Touch zoom in zoom factor > 2 ', () => {
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + viewer.currentPage.boundingRectangle.x;
        let pageY: number = point.y + viewer.currentPage.boundingRectangle.y;
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
            target: viewer.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.viewer.zoomFactor = 2;
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeGreaterThan(2);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeLessThan(2);
        viewer.onTouchUpInternal(event);
    });
    it('Touch zoom in zoom factor > 2 ', () => {
        editor.openBlank();
        let point = editor.selection.start.location;
        let pageX: number = point.x + viewer.currentPage.boundingRectangle.x;
        let pageY: number = point.y + viewer.currentPage.boundingRectangle.y;
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
            target: viewer.viewerContainer,
            preventDefault: () => { return true; },
            altKey: false,
            changedTouches: touches,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            targetTouches: touches,
            touches: touches
        }
        editor.viewer.zoomFactor = 2;
        viewer.onTouchStartInternal(event);
        expect(viewer.touchDownOnSelectionMark).toBe(0);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX - 10;
        event.touches[1].clientY = event.touches[1].clientY - 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeLessThan(2);
        viewer.onTouchUpInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        event.touches[1].clientX = event.touches[1].clientX + 10;
        event.touches[1].clientY = event.touches[1].clientY + 10;
        viewer.onTouchMoveInternal(event);
        expect(viewer.zoomFactor).toBeGreaterThanOrEqual(2);
    });
});


/**
 * Viewer Spec
 */
describe('Key down internal validation -1 tab key', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
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
    it('ctrl tab key validation with selection', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
    });
    it('shift tab key validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: true, which: 0 };
        viewer.onKeyDownInternal(event);
        editor.editor.insertTable(2, 2);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: true, which: 0 };
        viewer.onKeyDownInternal(event);
    });
    it('tab key validation with selection', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
    });
    it('tab key validation inside table', () => {
        editor.editor.insertTable(2, 1);
        let event: any;
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 9, preventDefault: function () { }, altKey: false, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
    });
});

describe('Key down internal validation -2 paragraph alignent', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
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
    it('BeforeSpacing', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 48, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(0);
    });
    it('Linespacing validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 36, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 49, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(1);
        event = { keyCode: 50, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
        event = { keyCode: 53, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(1.5);
    });
    it('copy and font dialog validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 67, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.editorModule.copiedData).not.toBeUndefined();
        event = { keyCode: 68, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: true, which: 0 };
        viewer.onKeyDownInternal(event);
    });
    it('Text Alignment validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any;
        event = { keyCode: 76, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Justify');
        event = { keyCode: 82, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
    });
    it('cut validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 88, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.editorModule.copiedData).not.toBeUndefined();
    });
});
describe('Key down internal validation -2 paragraph alignment', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
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
    it('Font size increment and decrement validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        let previousSize = editor.selection.characterFormat.fontSize;
        event = { keyCode: 188, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: true, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 190, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: true, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(previousSize).toBe(editor.selection.characterFormat.fontSize);
    });
    it('Left indent', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        let prevLeftIndent = editor.selection.paragraphFormat.leftIndent;
        event = { keyCode: 77, preventDefault: function () { }, altKey: false, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(prevLeftIndent).not.toBe(editor.selection.paragraphFormat.leftIndent);
    });
    it('Highlight Color validation', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 72, preventDefault: function () { }, altKey: true, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.characterFormat.highlightColor).toBe('Yellow');
    });
    it('backspace and delete key', () => {
        editor.editorModule.insertText('Adventure Works cycle', false);
        let event: any = { keyCode: 65, preventDefault: function () { }, ctrlKey: true, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        event = { keyCode: 8, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        editor.editorHistory.undo();
        event = { keyCode: 46, preventDefault: function () { }, ctrlKey: false, shiftKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
    });
    it('Viewer insert Page validation', () => {
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
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
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
    it('handle control up key', () => {
        editor.editorModule.insertText('Syncfusion Software', true);
        let event: any = { keyCode: 37, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.isEmpty).toBe(true);
        editor.selectionModule.selectCurrentWord();
        expect(editor.selectionModule.text).toBe('Software');
    });
    it('Handle Control up key', () => {
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion Software', true);
        let event: any = { keyCode: 38, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
    it('Handle Control down key', () => {
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion Software', true);
        let event: any = { keyCode: 40, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        editor.selectionModule.moveUp();
        viewer.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
});

describe('Key Board validation on Read only mode', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ isReadOnly: true, enableSelection: true });
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
    it('Key down on with ctrl press', () => {
        let lineSpacing = editor.selection.paragraphFormat.lineSpacing;
        let event: any = { keyCode: 49, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        event.keyCode = 68;
        viewer.onKeyDownInternal(event);
        event.keyCode = 50;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        event.keyCode = 53;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        let beforeSpacing = editor.selection.paragraphFormat.beforeSpacing;
        event.keyCode = 48;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(beforeSpacing);
    });
    it('Paragraph format key board validation in read only mode', () => {
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Center');
        event.keyCode = 70;
        viewer.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 72;
        viewer.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 74;
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Justify');
        event.keyCode = 75;
        viewer.onKeyDownInternal(event);
        expect(editor.hyperlinkDialogModule).toBe(undefined);
        event.keyCode = 76;
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Left');

    });
    it('Toggle alignment on read only', () => {
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        event.keyCode = 77;
        viewer.onKeyDownInternal(event);
    });

});
describe('Key Board shortcut Validation', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
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
    it('handle control up key', () => {
        editor.editorModule.insertText('Syncfusion Software', true);
        let event: any = { keyCode: 37, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.isEmpty).toBe(true);
        editor.selectionModule.selectCurrentWord();
        expect(editor.selectionModule.text).toBe('Software');
    });
    it('Handle Control up key', () => {
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion Software', true);
        let event: any = { keyCode: 38, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
    it('Handle Control down key', () => {
        editor.openBlank();
        editor.editorModule.insertText('Syncfusion Software', true);
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Syncfusion Software', true);
        let event: any = { keyCode: 40, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        editor.selectionModule.moveUp();
        viewer.onKeyDownInternal(event);
        expect(editor.selection.start.offset).toBe(0);
    });
});

describe('Key Board validation on Read only mode', () => {
    let editor: DocumentEditor;
    let viewer: PageLayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection);
        editor = new DocumentEditor({ isReadOnly: true, enableSelection: true });
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
    it('Key down on with ctrl press', () => {
        let lineSpacing = editor.selection.paragraphFormat.lineSpacing;
        let event: any = { keyCode: 49, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        viewer.onKeyDownInternal(event);
        event.keyCode = 219;
        viewer.onKeyDownInternal(event);
        event.keyCode = 221;
        event.keyCode = 68;
        viewer.onKeyDownInternal(event);
        event.keyCode = 50;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        event.keyCode = 53;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(lineSpacing);
        let beforeSpacing = editor.selection.paragraphFormat.beforeSpacing;
        event.keyCode = 48;
        viewer.onKeyDownInternal(event);
        expect(editor.selection.paragraphFormat.beforeSpacing).toBe(beforeSpacing);
    });
    it('Paragraph format key board validation in read only mode', () => {
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Center');
        event.keyCode = 70;
        viewer.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 72;
        viewer.onKeyDownInternal(event);
        expect(editor.optionsPaneModule).toBe(undefined);
        event.keyCode = 78;
        viewer.onKeyDownInternal(event);
        event.keyCode = 74;
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).not.toBe('Justify');
        event.keyCode = 75;
        viewer.onKeyDownInternal(event);
        expect(editor.hyperlinkDialogModule).toBe(undefined);
        event.keyCode = 76;
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.textAlignment).toBe('Left');
    });
    it('Toggle alignment onnread only', () => {
        let event: any = { keyCode: 69, preventDefault: () => { return true; }, ctrlKey: true, shiftKey: false, altKey: false, which: 0 };
        event.keyCode = 82;
        viewer.onKeyDownInternal(event);
        event.keyCode = 88;
        viewer.onKeyDownInternal(event);
        event.keyCode = 77;
        viewer.onKeyDownInternal(event);
        expect(editor.selectionModule.paragraphFormat.leftIndent).toBe(0);
    });
});

//#region Header footer
describe('Insert text in Header footer region', () => {
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
    it('enable header footer validation', () => {
        editor.openBlank();
        let event: any = {
            offsetX: 5, offsetY: + 5, preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event);
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
        event = {
            offsetX: viewer.currentPage.boundingRectangle.x + 5, offsetY: viewer.currentPage.boundingRectangle.y + 5,
            preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        viewer.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        event = {
            offsetX: 5, offsetY: 5, preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
    });
    it('Mouse move validation on header', () => {
        editor.openBlank();
        let event: any = {
            offsetX: viewer.currentPage.boundingRectangle.x + 96, offsetY: viewer.currentPage.boundingRectangle.y + 48,
            preventDefault: () => { return true }, which: 1
        }
        viewer.onDoubleTap(event)
        editor.dataBind();

        viewer.onMouseDownInternal(event);
        event.offsetX = event.offsetX + 30;
        viewer.onMouseMoveInternal(event);
        event.offsetX = event.offsetX + 30;
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        expect(editor.selection.start.paragraph.isInHeaderFooter).toBe(true);
        expect(editor.selection.isEmpty).toBe(false);
    });
    it('Double tap on footer region validation', () => {
        let y = viewer.currentPage.boundingRectangle.y + viewer.currentPage.boundingRectangle.height - 48;
        let event: any = {
            offsetX: viewer.currentPage.boundingRectangle.x + 5, offsetY: y,
            preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event);
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        event.offsetY = event.offsetY - viewer.containerTop;
        viewer.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(true);
        event = {
            offsetX: 5, offsetY: 5, preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event);
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
        event.offsetY = viewer.currentPage.boundingRectangle.y + viewer.currentPage.boundingRectangle.height - 200;
        viewer.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
    });
    it('Selection on footer content', () => {
        let y = viewer.currentPage.boundingRectangle.y + viewer.currentPage.boundingRectangle.height - 48;
        let event: any = {
            offsetX: viewer.currentPage.boundingRectangle.x + 96, offsetY: y,
            preventDefault: () => { return true }, which: 1
        }
        event.offsetY = event.offsetY - viewer.containerTop;
        viewer.onDoubleTap(event)
        editor.dataBind();
        event.offsetY = event.offsetY - (viewer.containerTop + 20);
        expect(editor.enableHeaderAndFooter).toBe(true);
        viewer.onMouseDownInternal(event);
        event.offsetX = event.offsetX + 30;
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        expect(editor.selection.start.paragraph.isInHeaderFooter).toBe(true);
    });
});
describe('First Page header odd and even page header validation', () => {
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
    it('Header footer validation', () => {
        editor.viewer.onDocumentChanged([createDocument()]);
        expect(editor.viewer.isBlockInHeader(editor.selection.start.paragraph)).toBe(false);
        editor.editorModule.insertText('S', true);
        editor.editorModule.onApplyCharacterFormat('fontSize', 56);
        for (let i = 0; i < 35; i++) {
            editor.editorModule.onEnter();
        }
        viewer.viewerContainer.scrollTop = viewer.pageContainer.scrollHeight;
        viewer.updateScrollBars();
        let y: number = viewer.viewerContainer.offsetHeight - 40;
        let event: any = {
            offsetX: viewer.currentPage.boundingRectangle.x + 20, offsetY: y,
            preventDefault: () => { return true }, which: 1
        }
        viewer.onDoubleTap(event);
        editor.dataBind();
        editor.editorModule.insertText('Syncfusion', true);
        viewer.viewerContainer.scrollTop = 0;
        viewer.updateVisiblePages();
    });
});
describe('Header footer enable validation', () => {
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
    it('enable header footer validation', () => {
        let event: any = {
            offsetX: viewer.currentPage.boundingRectangle.x + 5, offsetY: viewer.currentPage.boundingRectangle.y + 5,
            preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event);
        editor.dataBind();
        editor.editorModule.insertText('Syncfusion', true);
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        expect(viewer.currentPage.headerWidget.height + (viewer.currentPage.bodyWidgets[0].sectionFormat.headerDistance * 1.333333333)).toBeGreaterThan(96);
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
        viewer.onDoubleTap(event)
        editor.dataBind();
        expect(editor.enableHeaderAndFooter).toBe(false);
    });
    it('Double tap on footer region validation', () => {
        let y = viewer.currentPage.boundingRectangle.y + viewer.currentPage.boundingRectangle.height - 48;
        let event: any = {
            offsetX: viewer.currentPage.boundingRectangle.x + 5, offsetY: y,
            preventDefault: () => { return true }
        }
        viewer.onDoubleTap(event);
        editor.dataBind();
        viewer.onMouseDownInternal(event);
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        editor.editorModule.insertText('Syncfusion', true);
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editorModule.onEnter();
        editor.editor.insertTable(2, 2);
        expect(editor.viewer.isBlockInHeader(editor.selection.start.paragraph)).toBe(false);
        expect(viewer.currentPage.footerWidget.height + (viewer.currentPage.bodyWidgets[0].sectionFormat.footerDistance * 1.333333333)).toBeGreaterThan(96);
        expect(viewer.currentPage.footerWidget.y).toBeLessThan(viewer.currentPage.boundingRectangle.height - (viewer.currentPage.bodyWidgets[0].sectionFormat.footerDistance * 1.333333333) * 2);
        editor.selection.extendToNextLine();
        editor.selection.extendToNextLine();
        editor.selection.extendToNextLine();
        expect(editor.selection.isEmpty).toBe(false);
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        editor.selection.extendToPreviousLine();
        expect(editor.selection.isEmpty).toBe(true);
    });
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
    let viewer: LayoutViewer;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:1200px;height:100%' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('TextInput internal validation', () => {
        editor.isReadOnly = true;
        let spy = jasmine.createSpy('Spy');
        (editor.viewer as any).onTextInputInternal = spy;
        viewer.editableDiv.innerHTML = 'S';
        (editor.viewer as any).onTextInputInternal({} as any);
        expect(spy).toHaveBeenCalled();
    });
    it('Paste on read only mode', () => {
        let spy = jasmine.createSpy('spy');
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0
        };
        editor.contentChange = spy;
        viewer.onPaste(event);
        expect(spy).not.toHaveBeenCalled();
    });
    it('onKeyPress internal validation', () => {
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: true, shiftKey: false, which: 0
        };
        (editor.viewer as any).onKeyPressInternal(event);
    });
});

//#endregion