import { LayoutViewer, PageLayoutViewer, } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Zoom } from '../../src/document-editor/implementation/viewer/zooming';
import { TestHelper } from '../test-helper.spec';
/**
 * Zoom Module Spec
 */
describe("Zoom constructor and Possible value checking - 1", () => {
    let editor: DocumentEditor;
    let zoomModule: Zoom;
    let viewer: LayoutViewer;
    beforeAll(function () {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor();
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll(function (done) {
        editor.viewer.zoomFactor = 1;
        editor.destroy();
        editor = undefined;
        zoomModule = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Zoomfactor with possible value As 1 checking', () => {
        editor.viewer.zoomFactor = 1;
        expect(editor.viewer.zoomFactor).toBe(1);
    });
    it('Zoomfactor with possible value as 0 checking', (done) => {
        editor.viewer.zoomFactor = 0;
        setTimeout(() => {
            expect(editor.viewer.zoomFactor).toBe(0.1);
            done();
        }, 100);

    });
    it('Zoomfactor with possible value greater than 5 checking', (done) => {
        editor.viewer.zoomFactor = 5.1;
        setTimeout(() => {
            expect(editor.viewer.zoomFactor).toBe(5);
            done();
        }, 100);

    });
    it('Zoomfactor with possible value as 3 checking', (done) => {
        editor.viewer.zoomFactor = 3;
        setTimeout(() => {
            expect(editor.viewer.zoomFactor).toBe(3);
            done();
        }, 100);
    });
});
describe("Zoom Module- Mouse wheel event testing-1", () => {
    let editor: DocumentEditor;
    let zoomModule: Zoom;
    let viewer: LayoutViewer;
    beforeEach(function () {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor();
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach(function (done) {
        editor.viewer.zoomFactor = 1;
        editor.destroy();
        editor = undefined;
        zoomModule = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Mouse Wheel Event with control pressed false', (done) => {
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, wheelDelta: 5 };
        editor.viewer.zoomModule.onMouseWheelInternal(event);
        setTimeout(() => {
            expect(editor.viewer.zoomFactor).toBe(1.1);
            done();
        }, 100);
    });
    it('Mouse Wheel Event with control pressed true with zoomactor negative', () => {
        editor.viewer.zoomFactor = -0.1;
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, wheelDelta: 0 };
        editor.viewer.zoomModule.onMouseWheelInternal(event);
        expect(editor.viewer.zoomFactor).toBe(0.1);
    });
    it('Mouse Wheel Event with control pressed true with zoom factor 1', () => {
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, wheelDelta: 0 };
        editor.viewer.zoomModule.onMouseWheelInternal(event);
        expect(editor.viewer.zoomFactor).toBe(0.9);

    });
});
describe("Zoom Module- Mouse wheel event testing-2", () => {
    let editor: DocumentEditor;
    let originalTimeout: number;
    let zoomModule: Zoom;
    let viewer: LayoutViewer;
    beforeEach(function () {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor();
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterEach(function (done) {
        editor.viewer.zoomFactor = 1;
        editor.destroy();
        editor = undefined;
        zoomModule = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Mouse Wheel Event with control pressed false', () => {
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: false, wheelDelta: 5 };
        editor.viewer.zoomModule.onMouseWheelInternal(event);
        expect(editor.viewer.zoomFactor).toBe(1);

    });
    it('Mouse Wheel Event with control pressed true with zoomfactor 6', () => {
        zoomModule = new Zoom(editor.viewer);
        editor.viewer.zoomFactor = 6;
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, wheelDelta: 5 };
        zoomModule.onMouseWheelInternal(event);
        expect(editor.viewer.zoomFactor).toBe(5);
    });
    it('Mouse Wheel Event with control pressed true with pageX large', () => {
        let event: any = { pageX: 5000, pageY: 120, preventDefault: function () { }, ctrlKey: true, wheelDelta: 5 };
        editor.viewer.zoomModule.onMouseWheelInternal(event);
        expect(editor.viewer.zoomFactor).toBe(1);
    });
});