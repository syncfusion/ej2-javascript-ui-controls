import { LayoutViewer, PageLayoutViewer, DocumentHelper, } from '../../src/index';
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
    let documentHelper: DocumentHelper;
      beforeAll(function () {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
          (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper=editor.documentHelper;
    });
    afterAll(function (done) {
        editor.documentHelper.zoomFactor = 1;
        editor.destroy();
        editor = undefined;
        zoomModule = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Zoomfactor with possible value As 1 checking', () => {
console.log('Zoomfactor with possible value As 1 checking');
        editor.documentHelper.zoomFactor = 1;
        expect(editor.documentHelper.zoomFactor).toBe(1);
    });
    it('Zoomfactor with possible value as 0 checking', (done) => {
console.log('Zoomfactor with possible value as 0 checking');
        editor.documentHelper.zoomFactor = 0;
        setTimeout(() => {
            expect(editor.documentHelper.zoomFactor).toBe(0.1);
            done();
        }, 100);

    });
    it('Zoomfactor with possible value greater than 5 checking', (done) => {
console.log('Zoomfactor with possible value greater than 5 checking');
        editor.documentHelper.zoomFactor = 5.1;
        setTimeout(() => {
            expect(editor.documentHelper.zoomFactor).toBe(5);
            done();
        }, 100);

    });
    it('Zoomfactor with possible value as 3 checking', (done) => {
console.log('Zoomfactor with possible value as 3 checking');
        editor.documentHelper.zoomFactor = 3;
        setTimeout(() => {
            expect(editor.documentHelper.zoomFactor).toBe(3);
            done();
        }, 100);
    });
});
describe("Zoom Module- Mouse wheel event testing-1", () => {
    let editor: DocumentEditor;
    let zoomModule: Zoom;
    beforeEach(function () {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
          (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach(function (done) {
        editor.documentHelper.zoomFactor = 1;
        editor.destroy();
        editor = undefined;
        zoomModule = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Mouse Wheel Event with control pressed false', (done) => {
console.log('Mouse Wheel Event with control pressed false');
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, deltaY: -1 };
        editor.documentHelper.zoomModule.onMouseWheelInternal(event);
        setTimeout(() => {
            expect(editor.documentHelper.zoomFactor).toBe(1.1);
            done();
        }, 100);
    });
    it('Mouse Wheel Event with control pressed true with zoomactor negative', () => {
console.log('Mouse Wheel Event with control pressed true with zoomactor negative');
        editor.documentHelper.zoomFactor = -0.1;
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, deltaY: 0 };
        editor.documentHelper.zoomModule.onMouseWheelInternal(event);
        expect(editor.documentHelper.zoomFactor).toBe(0.1);
    });
    it('Mouse Wheel Event with control pressed true with zoom factor 1', () => {
console.log('Mouse Wheel Event with control pressed true with zoom factor 1');
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, deltaY: 0 };
        editor.documentHelper.zoomModule.onMouseWheelInternal(event);
        expect(editor.documentHelper.zoomFactor).toBe(0.9);

    });
});
describe("Zoom Module- Mouse wheel event testing-2", () => {
    let editor: DocumentEditor;
    let originalTimeout: number;
    let documentHelper: DocumentHelper;
    let zoomModule: Zoom;
    beforeEach(function () {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor();
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
          (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper=editor.documentHelper;
    });
    afterEach(function (done) {
        editor.documentHelper.zoomFactor = 1;
        editor.destroy();
        editor = undefined;
        zoomModule = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Mouse Wheel Event with control pressed false', () => {
console.log('Mouse Wheel Event with control pressed false');
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: false, deltaY: 5 };
        editor.documentHelper.zoomModule.onMouseWheelInternal(event);
        expect(editor.documentHelper.zoomFactor).toBe(1);

    });
    it('Mouse Wheel Event with control pressed true with zoomfactor 6', () => {
console.log('Mouse Wheel Event with control pressed true with zoomfactor 6');
        zoomModule = new Zoom(editor.documentHelper);
        editor.documentHelper.zoomFactor = 6;
        let event: any = { pageX: 250, pageY: 120, preventDefault: function () { }, ctrlKey: true, deltaY: -1 };
        zoomModule.onMouseWheelInternal(event);
        expect(editor.documentHelper.zoomFactor).toBe(5);
    });
    it('Mouse Wheel Event with control pressed true with pageX large', () => {
console.log('Mouse Wheel Event with control pressed true with pageX large');
        let event: any = { pageX: 5000, pageY: 120, preventDefault: function () { }, ctrlKey: true, deltaY: 5 };
        editor.documentHelper.zoomModule.onMouseWheelInternal(event);
        expect(editor.documentHelper.zoomFactor).toBe(1);
    });
});
