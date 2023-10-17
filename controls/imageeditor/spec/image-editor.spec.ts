/**
 *  ImageEditor spec document
 */
import { CurrentObject, FrameType, ImageEditor, Point, SelectionPoint, StrokeSettings, TextSettings } from '../src/image-editor/index';
import { createElement, remove, isNullOrUndefined, extend } from '@syncfusion/ej2-base';

describe('ImageEditor', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            return;
        }
    });
 
    let imageEditor: any;
    const wrapper: HTMLInputElement = createElement('div', { className: 'wrapper' }) as HTMLInputElement;
    wrapper.style.width = '96vw';
    wrapper.style.height = '95vh';
    const element: HTMLInputElement = wrapper.appendChild(createElement('div', { id: 'image-editor', className: 'e-image-editor' }) as HTMLInputElement);
    const templateElem: HTMLElement = wrapper.appendChild(createElement('div', { id: 'toolbarTemplate' }) as HTMLElement);
    let mousemoveEvent: MouseEvent = document.createEvent('MouseEvents');
    mousemoveEvent.initEvent('mousemove', true, true);
    let mousedownEvent: MouseEvent = document.createEvent('MouseEvents');
    mousedownEvent.initEvent('mousedown', true, true);
    let mouseupEvent: MouseEvent = document.createEvent('MouseEvents');
    mouseupEvent.initEvent('mouseup', true, true);
    let dblClickEvent: MouseEvent = document.createEvent('MouseEvents');
    describe('Dom', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
            document.body.appendChild(templateElem);
        });
        afterEach(() => {
            imageEditor.destroy();
            remove(imageEditor.element);
            remove(templateElem);
        });
        it('Find Target', (done) => {
            imageEditor = new ImageEditor({ height: '400px', width: '700px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
               //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               //  expect(imageEditor.objColl.length).toEqual(1);
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                done();
            }, 100);
        });
        it('Find Target with freehand draw', (done) => {
            imageEditor = new ImageEditor({ height: '400px', width: '700px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.freeHandDraw(true);
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                done();
            }, 100);
        });

        it('Zoom Find Target with shapes', (done) => {
            imageEditor = new ImageEditor({ height: '400px', width: '700px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
               //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               //  expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.zoom(2);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                done();
            }, 100);
        });
        it('Canvas Mouse Down Events', (done) => {
            imageEditor = new ImageEditor({ height: '400px', width: '700px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
               //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               //  expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.zoom(2);
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.pan(true);
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (imageEditor as any).dragStart = true; (imageEditor as any).dragCanvas = true;
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_lowerCanvas')).dispatchEvent(mouseupEvent);
                done();
            }, 100);
        });
        it('Keydown Events', (done) => {
            imageEditor = new ImageEditor({ height: '400px', width: '700px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousemoveEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mousedownEvent);
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
               //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               //  expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.selectShape('shape_1');
                let event: any = new KeyboardEvent('keydown', {key: 'Delete', code: 'delete'});
                (imageEditor as any).keyDownEventHandler(event);
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
               //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               //  expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.selectShape('shape_2');
                event = new KeyboardEvent('keydown', {key: 'Escape', code: 'escape'});
                (imageEditor as any).keyDownEventHandler(event);
                imageEditor.zoom(2);
                imageEditor.pan(true);
                event = new KeyboardEvent('keydown', {key: 'Escape', code: 'escape'});
                (imageEditor as any).keyDownEventHandler(event);
               //  imageEditor.select('circle');
               //  event = new KeyboardEvent('keydown', { key: 'Enter', code: 'enter' });
               //  (imageEditor as any).keyDownEventHandler(event);
               //  event = new KeyboardEvent('keydown', { key: 's', code: 's', ctrlKey: true });
               //  (imageEditor as any).keyDownEventHandler(event);
                done();
            }, 100);
        });

        it('Rotate with Annotation', (done) => {
            imageEditor = new ImageEditor({
               height: '450px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                imageEditor.drawRectangle(350, 250, 450, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl.length).toEqual(6);
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(270);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(0);
                imageEditor.clearSelection();
                imageEditor.reset();
                expect(imageEditor.objColl.length).toEqual(0);
                imageEditor.freeHandDraw(true);
                expect(imageEditor.togglePen).toEqual(true);
                imageEditor.notify('freehand-draw', { prop: 'apply-pen-draw', onPropertyChange: false});
                done();
            }, 100);
        });
 
        it('Flip with Annotation', (done) => {
            imageEditor = new ImageEditor({
               height: '450px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('');
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('');
                imageEditor.theme = 'bootstrap5-dark';
                done();
            }, 100);
        });
 
        it('Zoom with Annotation', (done) => {
            imageEditor = new ImageEditor({
               height: '450px'
            },'#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.zoom(1);
                expect(imageEditor.transform.zoomFactor).toEqual(0);
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.zoom(1);
                expect(imageEditor.transform.zoomFactor).toEqual(0);
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.pan(true);
                expect(imageEditor.togglePan).toEqual(true);
                imageEditor.reset();
                done();
            }, 100);
        });
 
        it('Selection with Crop', (done) => {
            imageEditor = new ImageEditor({
               height: '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('circle', {x: 100, y: 100}, 500, 500);
                expect(imageEditor.activeObj.shape).toEqual('crop-circle');
                imageEditor.select('square', {x: 100, y: 100}, 500, 500);
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.select('3:2', {x: 100, y: 100}, 500, 500);
                imageEditor.select('4:3', {x: 100, y: 100}, 500, 500);
                imageEditor.select('5:4', {x: 100, y: 100}, 500, 500);
                expect(imageEditor.activeObj.shape).toEqual('crop-5:4');
                imageEditor.clearSelection();
                imageEditor.select('7:5', {x: 100, y: 100}, 500, 500);
                imageEditor.width = '90%';
                imageEditor.height = '90%';
                imageEditor.select('16:9');
                expect(imageEditor.activeObj.shape).toEqual('crop-16:9');
                done();
            }, 100);
        });

        it('resizing', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl.length === 1);
                imageEditor.drawEllipse(300, 150, 300, 150, 18);
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.notify('shape', { prop: 'redrawActObj', onPropertyChange: false,
                   value: {x: null, y: null, isMouseDown: null}});
                imageEditor.lowerCanvas.style.maxWidth = '800px';
                imageEditor.lowerCanvas.style.maxHeight = '500px';
                imageEditor.activeObj.activePoint.width = 100;
                imageEditor.activeObj.activePoint.height = 100;
                imageEditor.drawRectangle(300, 30, 300, 200, 15);
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'nw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'n-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'ne-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'w-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'e-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'sw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 's-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'se-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.currObjType.isCustomCrop = true;
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'nw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'n-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'ne-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'w-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'e-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'sw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 's-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'se-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.currObjType.isCustomCrop = false;
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'nw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'n-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'ne-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'w-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'e-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'sw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 's-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'se-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.currObjType.isCustomCrop = true;
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'nw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'n-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'ne-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'w-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'e-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'sw-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 's-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                imageEditor.dragElement = 'se-resize';
                imageEditor.notify('selection', { prop: 'updateActivePoint', onPropertyChange: false,
                   value: { x: 500, y: 200, isCropSelection: null } });
                done();
            }, 100);
        });

        it('Text Click', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 90 Rotate and Hor Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 90 Rotate and Ver Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 180 Rotate and Hor Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(180);
                imageEditor.flip('horizontal');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 180 Rotate and Ver Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(180);
                imageEditor.flip('vertical');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 270 Rotate and Hor Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(270);
                imageEditor.flip('horizontal');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 270 Rotate and Ver Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(270);
                imageEditor.flip('vertical');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 360 Rotate and Hor Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(360);
                imageEditor.flip('horizontal');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 360 Rotate and Ver Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(360);
                imageEditor.flip('vertical');
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 90 Rotate Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(90);
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 180 Rotate Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(180);
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 270 Rotate Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(270);
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with 360 Rotate Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                imageEditor.rotate(360);
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text with Font Style Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                setTimeout(() => {});
                let drpDownBtn: any = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Shape with border Size Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup.e-popup-open')[0];
                ul.children[0].children[2].click();
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                setTimeout(() => {});
                let drpDownBtn: any = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_borderWidthBtn-popup.e-popup-open')[0];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                imageEditor.selectShape('shape_1');
                drpDownBtn = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_borderWidthBtn-popup.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                imageEditor.selectShape('shape_1');
                drpDownBtn = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_borderWidthBtn-popup.e-popup-open')[0];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                imageEditor.selectShape('shape_1');
                drpDownBtn = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_borderWidthBtn-popup.e-popup-open')[0];
                ul.children[0].children[3].click();
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_borderWidthBtn-popup.e-popup-open')[0];
                ul.children[0].children[4].click();
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Text Area Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.display = 'block';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontFamily = 'Calibri';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontWeight = 'bold';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontStyle = 'italic';
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(() => {}, 20);
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                setTimeout(() => {});
                annotationBtn = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.display = 'block';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontFamily = 'Calibri';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontWeight = 'bold';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontStyle = 'italic';
                (document.querySelectorAll('#image-editor_cancel')[0] as HTMLElement).click();
                setTimeout(() => {});
                done();
            }, 100);
        });

        it('Text Area double Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                setTimeout(function () { });
                imageEditor.rotate(-90);
                imageEditor.flip('horizontal');
                imageEditor.selectShape('shape_1');
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.display = 'block';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontFamily = 'Calibri';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontWeight = 'bold';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontStyle = 'italic';
                (document.querySelector('#image-editor_textArea') as HTMLElement).dispatchEvent(mousedownEvent);
                imageEditor.rotate(270);
                imageEditor.flip('vertical');
                imageEditor.selectShape('shape_1');
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.display = 'block';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontFamily = 'Calibri';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontWeight = 'bold';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontStyle = 'italic';
                (document.querySelector('#image-editor_textArea') as HTMLElement).dispatchEvent(mousedownEvent);
                done();
            }, 100);
        });
        it('Text Area double Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                setTimeout(function () { });
                imageEditor.selectShape('shape_1');
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.display = 'block';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontFamily = 'Calibri';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontWeight = 'bold';
                (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontStyle = 'italic';
                (document.querySelector('#image-editor_textArea') as HTMLElement).dispatchEvent(mousedownEvent);
                let event: any = new KeyboardEvent('keydown', { key: 's', code: 's', ctrlKey: false });
                imageEditor.notify('selection', {prop: 'textKeyDown', value: {e: event }});
                done();
            });
        });
        it('Canvas double Click Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click - 90 Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click - 90 Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas Rotate 90 Text Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas Text Rotate 90', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click - 180 Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click - 180 Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas Rotate 180 Text Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click - 270 Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas double Click - 270 Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas Rotate 270 Text Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Canvas Text Rotate 270', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 90 Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 90 Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 90 Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 90 Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 180 Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 180 Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 180 Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 180 Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 270 Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 270 Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 270 Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Text 270 Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        // Zooming after Trnsformation
        it('Zoom Canvas double Click Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                imageEditor.zoom(1);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            }, 100);
        });
        it('Zoom Canvas double Click Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            }, 100);
        });
        it('Zoom Canvas double Click - 90 Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas double Click - 90 Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas Rotate 90 Text Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas Text Rotate 90', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas double Click - 180 Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas double Click - 180 Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas Rotate 180 Text Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas double Click - 270 Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('zoom Canvas double Click - 270 Ver Hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                imageEditor.zoom(3);
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Canvas Rotate 270 Text Hor Ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('horizontal');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                imageEditor.flip('vertical');
                setTimeout(function () { });
                shape1 = imageEditor.getShapeSetting('shape_1');
                boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                ratio = obj;
                x = (shape1.startX / ratio.width) + boundRect.left;
                y = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            }, 100);
        });
        it('Zoom Canvas Text Rotate 270', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 90 Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 90 Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 90 Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 90 Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 180 Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 180 Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 180 Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom - Text 180 Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom - Text 270 Flip hor ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom Text 270 Flip hor hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom - Text 270 Flip ver hor', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        it('Zoom - Text 270 Flip ver ver', (done) => {
            imageEditor = new ImageEditor({
                width: '700px',
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.flip('vertical');
                imageEditor.flip('horizontal');
                imageEditor.flip('vertical');
                imageEditor.zoom(2);
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
            });
        });
        // End zooming after transformation 
        it('Shape Click', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(function () { });
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                let drpDownBtn: any = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelector('#image-editor_borderWidthBtn-popup');
                ul.children[0].children[2].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fillColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_shape_fill') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fillColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click()
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_borderColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_shape_stroke') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_borderColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(function () { });
                done();
            }, 100);
        });
        it('Shape Click after zoom', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
               imageEditor.zoom(2);
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(function () { });
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                const drpDownBtn: any = document.getElementById('image-editor_borderWidthBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                done();
            }, 100);
        });

        it('Crop Select Click', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                setTimeout(() => {});
                cropBtn = document.querySelectorAll('#image-editor_cropBtn')[0];
                cropBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_cropBtn-popup');
                ul = document.querySelectorAll('#image-editor_cropBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                expect(imageEditor.activeObj.shape).toEqual('crop-circle');
                const cancelBtn: any = document.querySelectorAll('#image-editor_cancel')[0];
                cancelBtn.click();
                setTimeout(() => {});
                done();
            }, 100);
        });

        it('Transform Click for Rotate', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                setTimeout(() => {});
                let transformBtn: any = document.querySelectorAll('#image-editor_rotateRight')[0];
                transformBtn.click();
                setTimeout(() => {});
                expect(imageEditor.transform.degree).toEqual(90);
                transformBtn = document.querySelectorAll('#image-editor_rotateRight')[0];
                transformBtn.click();
                setTimeout(() => {});
                expect(imageEditor.transform.degree).toEqual(180);
                transformBtn = document.querySelectorAll('#image-editor_rotateLeft')[0];
                transformBtn.click();
                setTimeout(() => {});
                expect(imageEditor.transform.degree).toEqual(90);
                done();
            }, 100);
        });

        it('Transform Click for Flip', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                setTimeout(() => {});
                let transformBtn: any = document.querySelectorAll('#image-editor_horizontalFlip')[0];
                transformBtn.click();
                setTimeout(() => {});
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                transformBtn = document.querySelectorAll('#image-editor_verticalFlip')[0];
                transformBtn.click();
                setTimeout(() => {});
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                done();
            }, 100);
        });

        it('Reset and Save Click', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let btn: any = document.querySelectorAll('#image-editor_saveBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_saveBtn-popup');
                ul = document.querySelectorAll('#image-editor_saveBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                done();
            }, 100);
        });

        it('PNG Save', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let btn: any = document.querySelectorAll('#image-editor_saveBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_saveBtn-popup');
                ul = document.querySelectorAll('#image-editor_saveBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                done();
            }, 100);
        });

        it('SVG Save', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let btn: any = document.querySelectorAll('#image-editor_saveBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_saveBtn-popup');
                ul = document.querySelectorAll('#image-editor_saveBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                done();
            }, 100);
        });
    });
    describe('Pen Click Event', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            imageEditor.destroy();
            remove(imageEditor.element);
        });
        it('Pen Click', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let annotationBtn: any = imageEditor.element.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(function () { });
               //  expect(imageEditor.togglePen).toEqual(true);
                const drpDownBtn: any = document.getElementById('image-editor_penColorBtn');
                drpDownBtn.click();
                setTimeout(function () { });
                (document.getElementById('image-editor_pen_stroke') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_penColorBtn-popup');
                ul.querySelectorAll('.e-tile')[5].click();
                setTimeout(() => {});
                document.getElementById('image-editor_ok').click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                document.getElementById('image-editor_zoomIn').click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                document.getElementById('image-editor_zoomOut').click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                document.getElementById('image-editor_ok').click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_penStrokeWidth')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup');
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_penStrokeWidth')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup');
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_penStrokeWidth')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup');
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_penStrokeWidth')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup');
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup')[ul.length - 1];
                ul.children[0].children[3].click();
                setTimeout(() => {});
                annotationBtn = imageEditor.element.querySelectorAll('#image-editor_penStrokeWidth')[0];
                annotationBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup');
                ul = document.querySelectorAll('#image-editor_penStrokeWidth-popup')[ul.length - 1];
                ul.children[0].children[4].click();
                document.getElementById('image-editor_cancel').click();
                setTimeout(() => {});
                done();
            }, 100);
        });
    });

    describe('Public', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            imageEditor.destroy();
            remove(imageEditor.element);
        });
 
        it('Selection and Crop', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('custom');
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Rotate and Crop', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                setTimeout(() => {});
                imageEditor.select('custom');
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Select Rotate and Crop', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('custom');
                setTimeout(() => {});
                imageEditor.rotate(180);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip and Crop', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.flip('horizontal');
                imageEditor.select('custom', 100, 100);
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Crop Canvas', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.flip('horizontal');
                imageEditor.select('canvas', 100, 100, 100, 100);
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Crop Circle', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.flip('horizontal');
                imageEditor.select('circle', 100, 100, 100, 100);
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Zoom and Export', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
               imageEditor.zoom(2);
                imageEditor.export();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Rotate, Zoom and Crop', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.zoom(2);
                imageEditor.select('circle');
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip, Zoom and Crop', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.flip('horizontal');
                imageEditor.zoom(2);
                imageEditor.select('circle');
                imageEditor.crop();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Shape and Export', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle();
                setTimeout(() => {});
                imageEditor.export();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Shape, Zoom and Export', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle();
                setTimeout(() => {});
                imageEditor.zoom(2);
                setTimeout(() => {});
                imageEditor.export();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Freehand draw and Export', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.freeHandDraw(true);
                setTimeout(() => {});
                imageEditor.export();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Shape Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(350, 200);
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Shape Delete', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(350, 200);
                imageEditor.drawRectangle(300, 300);
                imageEditor.deleteShape('shape_1');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Get Shape Setting', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(350, 200);
                imageEditor.getShapeSetting('shape_1');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Get Shape Settings', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(350, 200);
                setTimeout(() => {});
                imageEditor.drawEllipse(200, 200);
                setTimeout(() => {});
                imageEditor.drawLine(400, 400);
                setTimeout(() => {});
                imageEditor.getShapeSettings();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Get Shape Settings with Text', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 200, 'Syncfusion', 'Arial', 20, true, true);
                setTimeout(() => {});
                imageEditor.getShapeSettings();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Zoom after Rotate', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.rotate(90);
                setTimeout(() => {});
                imageEditor.zoom(2);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Zoom after custom Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('custom');
                setTimeout(() => {});
                imageEditor.zoom(2);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Zoom after circle Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('circle');
                setTimeout(() => {});
                imageEditor.zoom(2);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Rotate after zoom', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
               imageEditor.zoom(2);
                setTimeout(() => {});
                imageEditor.rotate(360);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip after zoom', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
               imageEditor.zoom(2);
                setTimeout(() => {});
                imageEditor.flip('horizontal');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Rotate after custom Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('custom');
                setTimeout(() => {});
                imageEditor.rotate(90);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Rotate after circle Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('circle');
                setTimeout(() => {});
                imageEditor.rotate(90);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip after custom Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('custom');
                setTimeout(() => {});
                imageEditor.flip('horizontal');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip after circle Select', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.select('circle');
                setTimeout(() => {});
                imageEditor.flip('horizontal');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip with Shape', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle();
                setTimeout(() => {});
                imageEditor.flip('horizontal');
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Flip, Zoom with Shape', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle();
                setTimeout(() => {});
                imageEditor.flip('horizontal');
                setTimeout(() => {});
                imageEditor.zoom(2);
                setTimeout(() => {});
                imageEditor.drawRectangle();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Freehand Draw', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.freeHandDraw(false);
                setTimeout(() => {});
                imageEditor.zoom(2);
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Open using ImageData', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const imageData: any = imageEditor.getImageData();
                setTimeout(() => {});
                imageEditor.open(imageData);
                setTimeout(() => {});
                done();
            }, 100);
        });
    });
    describe('Screen', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            imageEditor.destroy();
            remove(imageEditor.element);
        });
        it('Adjust to screen', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                setTimeout(function () { });
                imageEditor.selectShape('shape_1');
                (imageEditor as any).adjustToScreen();
                done();
            });
        });
    });
    describe('On Property Change', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            imageEditor.destroy();
            remove(imageEditor.element);
        });
 
        it('CSS Class', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.cssClass = 'e-custom';
                imageEditor.dataBind();
                setTimeout(() => {});
                imageEditor.cssClass = 'e-custom-2';
                imageEditor.dataBind();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Disabled', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.disabled = true;
                imageEditor.dataBind();
                setTimeout(() => {});
                imageEditor.disabled = false;
                imageEditor.dataBind();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Height and Width', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.height = '600px';
                imageEditor.dataBind();
                setTimeout(() => {});
                imageEditor.width = '600px';
                imageEditor.dataBind();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Theme', (done) => {
            imageEditor = new ImageEditor({
               height : '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.theme = 'tailwind';
                imageEditor.dataBind();
                setTimeout(() => {});
                done();
            }, 100);
        });
    });
    describe('Mouse Right Click on Selection', () => {
        beforeEach((): void => {
            document.body.appendChild(element);
        });
        afterEach(() => {
            imageEditor.destroy();
            remove(imageEditor.element);
        });
        it('NW Point Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (imageEditor.activeObj.activePoint.startX / ratio.width) + boundRect.left;
                let y: any = (imageEditor.activeObj.activePoint.startY / ratio.height) + boundRect.top;
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(dblClickEvent);
                done();
            }, 100);
        });
    });
   describe('Rotate With Annotations', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('90 Degree Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.drawText(350, 200, 'Syncfusion', 'Arial', 60, true, true, 'red');
               expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(2);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.49999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.49999999999994);
               expect(imageEditor.objColl[1].shape).toEqual('text');
               expect(imageEditor.objColl[1].activePoint.startX).toEqual(291.15999999999997);
               expect(imageEditor.objColl[1].activePoint.startY).toEqual(23.93203124999995);
               expect(imageEditor.objColl[1].activePoint.endX).toEqual(348.15999999999997);
               expect(imageEditor.objColl[1].activePoint.endY).toEqual(292.49999999999994);
               done();
           }, 100);
       });
       it('180 Degree Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.drawText(350, 200, 'Syncfusion', 'Arial', 60, true, true, 'red');
               expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(2);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(181.99999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.99999999999994);
               expect(imageEditor.objColl[1].shape).toEqual('text');
               expect(imageEditor.objColl[1].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[1].activePoint.startY).toEqual(31.99999999999994);
               expect(imageEditor.objColl[1].activePoint.endX).toEqual(553.9841694078948);
               expect(imageEditor.objColl[1].activePoint.endY).toEqual(106.99999999999993);
               done();
           }, 100);
       });
       it('270 Degree Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.drawText(350, 200, 'Syncfusion', 'Arial', 60, true, true, 'red');
               expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(2);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.5);
               expect(imageEditor.objColl[1].shape).toEqual('text');
               expect(imageEditor.objColl[1].activePoint.startX).toEqual(418.84000000000003);
               expect(imageEditor.objColl[1].activePoint.startY).toEqual(14.5);
               expect(imageEditor.objColl[1].activePoint.endX).toEqual(475.84000000000003);
               expect(imageEditor.objColl[1].activePoint.endY).toEqual(283.06796875000003);
               done();
           }, 100);
       });
       it('360 or 0 Degree Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.drawText(350, 200, 'Syncfusion', 'Arial', 60, true, true, 'red');
               expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(2);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
               expect(imageEditor.objColl[1].shape).toEqual('text');
               expect(imageEditor.objColl[1].activePoint.startX).toEqual(213.0158305921052);
               expect(imageEditor.objColl[1].activePoint.startY).toEqual(200.00000000000003);
               expect(imageEditor.objColl[1].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[1].activePoint.endY).toEqual(275);
               done();
           }, 100);
       });
   });
   describe('Rotate With Zoom', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('90 Degree Rotate With Zoom', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(267.296);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(232.40800000000002);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(62.69999999999999);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(83.60000000000002);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(0.2);
               expect(imageEditor.img.destLeft).toEqual(256.73199999999997);
               expect(imageEditor.img.destTop).toEqual(-13.300000000000011);
               expect(imageEditor.img.destWidth).toEqual(253.536);
               expect(imageEditor.img.destHeight).toEqual(333.6);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(68.39999999999998);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(91.20000000000002);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(267.296);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(232.40800000000002);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(62.69999999999993);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(83.60000000000002);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(56.99999999999994);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
               done();
           }, 100);
       });
       it('180 Degree Rotate With Zoom', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(182.31578947368422);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(402.36842105263156);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(82.49999999999997);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(0.2);
               expect(imageEditor.img.destLeft).toEqual(164.0263157894737);
               expect(imageEditor.img.destTop).toEqual(-13.300000000000011);
               expect(imageEditor.img.destWidth).toEqual(438.9473684210526);
               expect(imageEditor.img.destHeight).toEqual(333.6);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(120);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(89.99999999999994);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(182.31578947368422);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(402.36842105263156);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(82.49999999999997);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(74.99999999999994);
               done();
           }, 100);
       });
       it('270 Degree Rotate With Zoom', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(267.296);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(232.40800000000002);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(62.700000000000045);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(83.60000000000001);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(0.2);
               expect(imageEditor.img.destLeft).toEqual(256.73199999999997);
               expect(imageEditor.img.destTop).toEqual(-13.300000000000011);
               expect(imageEditor.img.destWidth).toEqual(253.536);
               expect(imageEditor.img.destHeight).toEqual(333.6);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(68.40000000000009);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(91.20000000000002);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(267.296);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(232.40800000000002);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(62.700000000000045);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(83.60000000000001);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
               done();
           }, 100);
       });
       it('360 or 0 Degree Rotate With Zoom', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(182.31578947368422);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(402.36842105263156);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(82.5);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(0.2);
               expect(imageEditor.img.destLeft).toEqual(164.0263157894737);
               expect(imageEditor.img.destTop).toEqual(-13.300000000000011);
               expect(imageEditor.img.destWidth).toEqual(438.9473684210526);
               expect(imageEditor.img.destHeight).toEqual(333.6);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(120);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(89.99999999999999);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               expect(imageEditor.img.destLeft).toEqual(182.31578947368422);
               expect(imageEditor.img.destTop).toEqual(0.5999999999999943);
               expect(imageEditor.img.destWidth).toEqual(402.36842105263156);
               expect(imageEditor.img.destHeight).toEqual(305.8);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(82.49999999999997);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(74.99999999999999);
               done();
           }, 100);
       });
   });
   describe('Rotate With Crop', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('90 Degree Rotate With Crop', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
               imageEditor.select('square');
               expect(imageEditor.activeObj.shape).toEqual('crop-square');
               imageEditor.crop();
               expect(imageEditor.img.destLeft).toEqual(244.5);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(278);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(414.17801100468716);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(242.7296718972896);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(494.90961891175874);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(350.37181577338504);
               done();
           }, 100);
       });
       it('180 Degree Rotate With Crop', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
               imageEditor.select('square');
               expect(imageEditor.activeObj.shape).toEqual('crop-square');
               imageEditor.crop();
               expect(imageEditor.img.destLeft).toEqual(244.50000000000009);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(277.99999999999983);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(190.17400440264157);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(183.62547528517112);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(296);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(262.9030418250951);
               done();
           }, 100);
       });
       it('270 Degree Rotate With Crop', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
               imageEditor.select('square');
               expect(imageEditor.activeObj.shape).toEqual('crop-square');
               imageEditor.crop();
               expect(imageEditor.img.destLeft).toEqual(244.50000000000003);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(277.99999999999994);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(272.09038108824126);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(-43.37181577338504);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(352.82198899531284);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(64.27032810271032);
               done();
           }, 100);
       });
       it('360 or 0 Degree Rotate With Crop', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
               expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
               imageEditor.select('square');
               expect(imageEditor.activeObj.shape).toEqual('crop-square');
               imageEditor.crop();
               expect(imageEditor.img.destLeft).toEqual(244.5);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(278);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(471.12257354412645);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(44.09695817490497);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(576.8259955973583);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(123.37452471482894);
               done();
           }, 100);
       });
   });
   describe('Rotate With Flip', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('90 Degree Rotate With Horizontal and Vertical Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.49999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.49999999999994);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.49999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.49999999999994);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
               expect(imageEditor.rotateFlipColl[2]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000057);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000006);
               done();
           }, 100);
       });
       it('90 Degree Rotate With Vertical and Horizontal Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.49999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.49999999999994);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000057);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000006);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
               expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000057);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000006);
               done();
           }, 100);
       });
       it('180 Degree Rotate With Horizontal and Vertical Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(181.99999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.99999999999994);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(181.99999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.99999999999994);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
               expect(imageEditor.rotateFlipColl[3]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000006);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000006);
               done();
           }, 100);
       });
       it('180 Degree Rotate With Vertical and Horizontal Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(181.99999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.99999999999994);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000006);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000006);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual('vertical');
               expect(imageEditor.rotateFlipColl[3]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000006);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000006);
               done();
           }, 100);
       });
       it('270 Degree Rotate With Horizontal and Vertical Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.5);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual(90);
               expect(imageEditor.rotateFlipColl[3]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.5);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual(90);
               expect(imageEditor.rotateFlipColl[3]).toEqual('horizontal');
               expect(imageEditor.rotateFlipColl[4]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.5);
               done();
           }, 100);
       });
       it('270 Degree Rotate With Vertical and Horizontal Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.5);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual(90);
               expect(imageEditor.rotateFlipColl[3]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.5);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual(90);
               expect(imageEditor.rotateFlipColl[1]).toEqual(90);
               expect(imageEditor.rotateFlipColl[2]).toEqual(90);
               expect(imageEditor.rotateFlipColl[3]).toEqual('vertical');
               expect(imageEditor.rotateFlipColl[4]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.5);
               done();
           }, 100);
       });
       it('360 or 0 Degree Rotate With Horizontal and Vertical Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.6052631578949);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.6052631578949);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
               expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.6052631578949);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.6052631578949);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               done();
           }, 100);
       });
       it('360 or 0 Degree Rotate With Vertical and Horizontal Flip', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual('vertical');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual('vertical')
               expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               done();
           }, 100);
       });
   });
   describe('Flip With Zoom', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('Horizontal and Vertical Flip With Zoom', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.flip('Horizontal');
               expect(imageEditor.transform.currFlipState).toEqual('horizontal');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(201);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(50);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.6052631578949);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(40);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(292);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(122);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(.2);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(164);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(29);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(284);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(119);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(40);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(292);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(122);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(201);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(50);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(301);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(125);
               imageEditor.flip('Vertical');
               expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
               expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(201);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(301);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(257);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(185);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(292);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(267);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(.2);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(164);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(188);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(284);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(278);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(185);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(292);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(267);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(201);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(301);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(257);
               done();
           }, 100);
       });
       it('Vertical and Horizontal Flip With Zoom', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.flip('Vertical');
               expect(imageEditor.transform.currFlipState).toEqual('vertical');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(474.6842105263157);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(185);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(584.6842105263157);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(267.35);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(.2);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(482.97368421052624);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(187.70000000000002);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(602.9736842105262);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(277.7);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(474.6842105263157);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(185);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(584.6842105263157);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(267.35);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               imageEditor.flip('Horizontal');
               expect(imageEditor.rotateFlipColl[0]).toEqual('vertical');
               expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(185);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(292);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(267.35);
               imageEditor.zoom(3);
               expect(imageEditor.transform.zoomFactor).toEqual(.2);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(164);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(188);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(284);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(278);
               imageEditor.zoom(2);
               expect(imageEditor.transform.zoomFactor).toEqual(.1);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(185);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(292);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(267.35);
               imageEditor.zoom(1);
               expect(imageEditor.transform.zoomFactor).toEqual(0);
               expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(201);
               expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(182);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(301);
               expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(257);
               done();
           }, 100);
       });
   });
   describe('Flip With Crop', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('Horizontal Flip With Crop', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.flip('Horizontal');
               expect(imageEditor.transform.currFlipState).toEqual('horizontal');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.6052631578949);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.6052631578949);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
               imageEditor.select('square');
               expect(imageEditor.activeObj.shape).toEqual('crop-square');
               imageEditor.crop();
               expect(imageEditor.img.destLeft).toEqual(244.50000000000003);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(277.99999999999994);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(190.1740044026417);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(44.09695817490494);
               expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(296);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(123.37452471482891);
               done();
           }, 100);
       });
       it('Vertical Flip With Crop', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.flip('Vertical');
               expect(imageEditor.transform.currFlipState).toEqual('vertical');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               imageEditor.select('square');
               expect(imageEditor.activeObj.shape).toEqual('crop-square');
               imageEditor.crop();
               expect(imageEditor.img.destLeft).toEqual(244.5);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(278);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(471.12257354412645);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(183.6254752851711);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(576.8259955973583);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(262.90304182509504);
               done();
           }, 100);
       });
   });
   describe('Flip With Rotate', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('Horizontal Flip With Rotate', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.flip('Horizontal');
               expect(imageEditor.transform.currFlipState).toEqual('horizontal');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.6052631578949);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.6052631578949);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.15999999999997);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000087);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.15999999999997);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000009);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421051);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(181.99999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421051);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.99999999999994);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84000000000003);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.49999999999986);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84000000000003);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.4999999999999 );
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789485);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789485);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
               done();
           }, 100);
       });
       it('Vertical Flip With Rotate', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle', strokeWidth: 15, strokeColor: 'red', fillColor: 'white', start: {x: 553.6052631578948, y: 50}, width: 100, height: 75};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('rectangle');
               imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
               expect(imageEditor.objColl.length).toEqual(1);
               imageEditor.flip('Vertical');
               expect(imageEditor.transform.currFlipState).toEqual('vertical');
               expect(imageEditor.objColl[0].shape).toEqual('rectangle');
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(90);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(304.84);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(216.49999999999994);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(361.84);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(292.49999999999994);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(180);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(200.60526315789474);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(49.99999999999995);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(300.60526315789474);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(124.99999999999994);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(270);
               expect(imageEditor.img.destLeft).toEqual(277.86);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(211.28);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(405.16);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.5);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(462.16);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.5);
               imageEditor.rotate(90);
               expect(imageEditor.transform.degree).toEqual(0);
               expect(imageEditor.img.destLeft).toEqual(200.60526315789474);
               expect(imageEditor.img.destTop).toEqual(14.5);
               expect(imageEditor.img.destWidth).toEqual(365.7894736842105);
               expect(imageEditor.img.destHeight).toEqual(278);
               expect(imageEditor.objColl[0].activePoint.startX).toEqual(466.3947368421052);
               expect(imageEditor.objColl[0].activePoint.startY).toEqual(182);
               expect(imageEditor.objColl[0].activePoint.endX).toEqual(566.3947368421052);
               expect(imageEditor.objColl[0].activePoint.endY).toEqual(257);
               done();
           }, 100);
       });
   });
   describe('Random Combination', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('Shape Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                const value: any = {obj: 'ellipse'};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                expect(imageEditor.activeObj.shape).toEqual('ellipse');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.select('3:2');
                expect(imageEditor.activeObj.shape).toEqual('crop-3:2');
                imageEditor.crop();
                expect(imageEditor.currSelectionPoint.shape).toEqual('crop-3:2');
                imageEditor.finetuneImage('Brightness', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               done();
           }, 100);
       });
       it('Text Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(imageEditor.img.destLeft, imageEditor.img.destTop, 'Syncfusion', 'Arial', 20, true, false, 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startX).toEqual(imageEditor.img.destLeft);
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startY).toEqual(imageEditor.img.destTop);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.select('circle');
                expect(imageEditor.activeObj.shape).toEqual('crop-circle');
                imageEditor.crop();
                expect(imageEditor.currSelectionPoint.shape).toEqual('crop-circle');
                imageEditor.finetuneImage('Brightness', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               done();
           }, 100);
       });
       it('Rotate Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(270);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(0);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-90);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-180);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-270);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(0);
                expect(imageEditor.rotateFlipColl.length).toEqual(0);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.zoom(3);
                expect(imageEditor.transform.zoomFactor).toEqual(0.2);
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.select('4:3');
                expect(imageEditor.activeObj.shape).toEqual('crop-4:3');
                imageEditor.crop();
                expect(imageEditor.currSelectionPoint.shape).toEqual('crop-4:3');
                imageEditor.drawText(imageEditor.img.destLeft, imageEditor.img.destTop, 'Syncfusion', 'Arial', 20, true, false, 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startX).toEqual(imageEditor.img.destLeft);
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startY).toEqual(imageEditor.img.destTop);
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                const value: any = {obj: 'line'};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                expect(imageEditor.activeObj.shape).toEqual('line');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl.length).toEqual(2);
                expect(imageEditor.objColl[0].shape).toEqual('text');
                expect(imageEditor.objColl[1].shape).toEqual('line');
                imageEditor.finetuneImage('Brightness', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               done();
           }, 100);
       });
       it('Flip Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('');
                imageEditor.flip('Horizontal');
                imageEditor.flip('Vertical');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(270);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(0);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-90);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-180);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-270);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(0);
                expect(imageEditor.rotateFlipColl.length).toEqual(2);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                expect(imageEditor.rotateFlipColl.length).toEqual(4);
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.zoom(3);
                expect(imageEditor.transform.zoomFactor).toEqual(0.2);
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(0.1);
                imageEditor.select('5:4');
                expect(imageEditor.activeObj.shape).toEqual('crop-5:4');
                imageEditor.crop();
                expect(imageEditor.currSelectionPoint.shape).toEqual('crop-5:4');
                imageEditor.drawText(imageEditor.img.destLeft, imageEditor.img.destTop, 'Syncfusion', 'Arial', 20, true, false, 'green');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startX).toEqual(imageEditor.img.destLeft);
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startY).toEqual(imageEditor.img.destTop);
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                const value: any = {obj: 'line'};
                imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                expect(imageEditor.activeObj.shape).toEqual('line');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl.length).toEqual(2);
                expect(imageEditor.objColl[0].shape).toEqual('text');
                expect(imageEditor.objColl[1].shape).toEqual('line');
                imageEditor.finetuneImage('Brightness', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               done();
           }, 100);
       });
       it('Zoom Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               //  imageEditor.select('square');
               //  expect(imageEditor.activeObj.shape).toEqual('crop-square');
               //  imageEditor.zoom(2);
               //  expect(imageEditor.transform.zoomFactor).toEqual(0.1);
               //  imageEditor.crop();
               //  expect(imageEditor.currSelectionPoint.shape).toEqual('crop-square');
                const value: any = {obj: 'rectangle'};
                imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                imageEditor.finetuneImage('Brightness', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               done();
           }, 100);
       });
       it('Crop Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.select('16:9');
                expect(imageEditor.activeObj.shape).toEqual('crop-16:9');
                imageEditor.crop();
                expect(imageEditor.currSelectionPoint.shape).toEqual('crop-16:9');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                const value: any = {obj: 'rectangle'};
                imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                imageEditor.finetuneImage('Brightness', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               done();
           }, 100);
       });
       it('Finetune Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               imageEditor.finetuneImage('Brightness', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Contrast', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Hue', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Saturation', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Exposure', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Opacity', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Blur', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
               done();
           }, 100);
       });
       it('Filter Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               imageEditor.applyImageFilter('Chrome');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(140%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Cold');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(0.9) contrast(150%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Warm');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(140%) opacity(1) blur(0px) sepia(25%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Grayscale');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(100%) invert(0%)');
               imageEditor.applyImageFilter('Sepia');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(100%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Invert');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
               imageEditor.applyImageFilter('Default');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               done();
           }, 100);
       });
       it('Finetune and Filter Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               imageEditor.finetuneImage('Brightness', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Contrast', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Hue', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Saturation', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Exposure', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Opacity', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.finetuneImage('Blur', 50);
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Chrome');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(210%) opacity(0.3) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Cold');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.125) contrast(187.5%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Warm');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(210%) opacity(0.3) blur(3px) sepia(25%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Grayscale');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(0%) grayscale(100%) invert(0%)');
               imageEditor.applyImageFilter('Sepia');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(100%) grayscale(0%) invert(0%)');
               imageEditor.applyImageFilter('Invert');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(0%) grayscale(0%) invert(100%)');
               imageEditor.applyImageFilter('Default');
               expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(0.3) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
               imageEditor.undo(); imageEditor.undo(); imageEditor.undo(); imageEditor.undo();
               imageEditor.undo(); imageEditor.undo(); imageEditor.undo();
               imageEditor.redo(); imageEditor.redo(); imageEditor.redo(); imageEditor.redo();
               imageEditor.redo(); imageEditor.redo(); imageEditor.redo();
               done();
           }, 100);
       });
   });

   describe('Combination testing', () => {
       beforeEach((): void => {
           document.body.appendChild(element);
       });
       afterEach(() => {
           imageEditor.destroy();
           remove(imageEditor.element);
       });
       it('ok cancel button', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               imageEditor.zoom(6);
                expect(imageEditor.transform.zoomFactor).toEqual(0.5);
                const value: any = {obj: 'rectangle'};
                imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                imageEditor.applyImageFilter('Grayscale');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(100%) invert(0%)');
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
           }, 100);
       });
       it('To adjust brightness', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.finetuneImage('Brightness', 100);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1.5) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(0.7) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                done();
           }, 100);
       });
       it('Crop/shape combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.select('custom');
                imageEditor.crop();
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
                done();
           }, 100);
       });
       it('Shape/crop combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const value: any = {obj: 'rectangle'};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-90);
                imageEditor.select('3:2');
                imageEditor.crop();
                imageEditor.select('custom', 100, 100);
                imageEditor.crop();
                done();
           }, 100);
       });
       it('Rotate/shape combination', (done) => {
           imageEditor = new ImageEditor({
               height: '450px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(0);
                imageEditor.select('square');
                imageEditor.crop();
                done();
           }, 100);
       });
       it('Text misalignment', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-90);
                const value: any = {obj: 'rectangle'};
                imageEditor.notify('shape', {prop: 'draw-shape', value: value});
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                imageEditor.drawText(350, 100, 'Syncfusion');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.zoom(6);
                expect(imageEditor.transform.zoomFactor).toEqual(0.5);
                imageEditor.finetuneImage('Hue', 50);
                expect(imageEditor.lowerCanvas.getContext('2d').filter).toEqual('brightness(1) contrast(100%) hue-rotate(150deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.zoom(1);
                expect(imageEditor.transform.zoomFactor).toEqual(0);
                done();
           }, 100);
       });
       it('Cancel button click', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                let cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                setTimeout(() => {});
                cropBtn = document.querySelectorAll('#image-editor_cropBtn')[0];
                cropBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_cropBtn-popup');
                ul = document.querySelectorAll('#image-editor_cropBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                imageEditor.zoom(4);
                expect(imageEditor.transform.zoomFactor).toEqual(0.30000000000000004);
                done();
           }, 100);
       });
       it('Text area misalignment', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(270);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(0);
                imageEditor.drawText(350, 100, 'Syncfusion');
                setTimeout(function () { });
                let shape1: any = imageEditor.getShapeSetting('shape_1');
                let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                const obj: Object = {width: 0, height: 0 };
                imageEditor.notify('crop', { prop: 'calcRatio', onPropertyChange: false, value: {obj: obj }});
                let ratio: any = obj;
                let x: any = (shape1.startX / ratio.width) + boundRect.left;
                let y: any = (shape1.startY / ratio.height) + boundRect.top;
                imageEditor.selectShape('shape_1');
                dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                done();
           }, 100);
       });
       it('Text size improper', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-90);
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(-180);
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].textSettings.fontSize).toEqual(20.99999999999999);
                done();
           }, 100);
       });
       it('flip and rotate combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.zoom(4);
                expect(imageEditor.transform.zoomFactor).toEqual(0.30000000000000004);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                done();
           }, 100);
       });
       it('Crop combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.select('circle');
                expect(imageEditor.activeObj.shape).toEqual('crop-circle');
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(.10);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                if (!isNullOrUndefined(okBtn)) {okBtn.click(); }
                let cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                setTimeout(() => {});
                cropBtn = document.querySelectorAll('#image-editor_cropBtn')[0];
                if (!isNullOrUndefined(cropBtn)) {cropBtn.click(); }
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_cropBtn-popup');
                ul = document.querySelectorAll('#image-editor_cropBtn-popup')[ul.length - 1];
                if (!isNullOrUndefined(ul.children[0].children[2])) {ul.children[0].children[2].click(); }
                setTimeout(() => {});
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                const cancelBtn: any = document.querySelectorAll('#image-editor_cancel')[0];
                if (!isNullOrUndefined(cancelBtn)) {cancelBtn.click(); }
               done();
           }, 100);
       });
       it('Freehanddraw and flip combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
               //  imageEditor.select('4:3');
               //  imageEditor.crop();
               //  expect(imageEditor.currSelectionPoint.shape).toEqual('crop-4:3');
                let points = [
                    {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                    {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                    {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                    {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                    {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                    {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.activeObj.strokeSettings.strokeColor = "black";
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.flip('Horizontal');
                let obj: Object = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.zoom(2);
                expect(imageEditor.transform.zoomFactor).toEqual(.1);
                expect(imageEditor.pointColl[0].points[0].x).toEqual(24.290627695280847);
               //  imageEditor.select('square');
               //  imageEditor.crop();
                done();
           }, 100);
       });
       it('Zoom and crop combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                var withoutZoom = imageEditor.img.destLeft;
                imageEditor.zoom(2);
                var firstZoom = imageEditor.img.destLeft;
                imageEditor.zoom(1);
                var secondZoom = imageEditor.img.destLeft;
                imageEditor.zoom(2);
                imageEditor.zoom(1);
                expect(withoutZoom).toEqual(imageEditor.img.destLeft);
                done();
           }, 100);
       });
       it('Multiple freehand draw', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                imageEditor.activeObj.strokeSettings.strokeColor = "black";
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.flip('horizontal');
                imageEditor.rotate(-90);
                expect(imageEditor.transform.degree).toEqual(0);
                expect(imageEditor.freehandCounter).toEqual(1);
                done();
           }, 100);
       });
       it('crop and flip combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.flip('horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.flip('vertical');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
               ];
                imageEditor.activeObj.strokeSettings.strokeColor = "black";
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.select("3:2");
                imageEditor.img.destLeft += 20;
                imageEditor.img.destTop -= 0;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: -10, y: 0}}});
                expect(imageEditor.pointColl[0].points[0].x).toEqual(700.0539748224719);
                /* resize the selection */
                imageEditor.activeObj.activePoint.startX = 500;
                imageEditor.activeObj.activePoint.startY = 50;
                imageEditor.activeObj.activePoint.width = imageEditor.activeObj.activePoint.endX - imageEditor.activeObj.activePoint.startX;
                imageEditor.activeObj.activePoint.height = imageEditor.activeObj.activePoint.endY - imageEditor.activeObj.activePoint.startY;
                imageEditor.upperContext.clearRect(0,0,imageEditor.upperCanvas.width, imageEditor.upperCanvas.height);
                imageEditor.notify('draw', { prop: 'drawObject', onPropertyChange: false, value: {canvas: 'duplicate'}});
                expect(imageEditor.transform.currFlipState).toEqual("");
                done();
           }, 100);
       });
       it('Pan combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.select('3:2');
                expect(imageEditor.activeObj.shape).toEqual('crop-3:2');
                // left side pan
                imageEditor.img.destLeft += 10;
                imageEditor.img.destTop -= 0;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: -10, y: 0}}});
                imageEditor.select('custom');
                // right side pan
                imageEditor.img.destLeft -= 50;
                imageEditor.img.destTop -= 0;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: 50, y: 0}}});
                expect(imageEditor.activeObj.activePoint.startX).toBeGreaterThanOrEqual(0);
                done();
           }, 100);
       });
       it('Pan and zoom combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.flip('horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.rotate(90);
                imageEditor.undo();
                imageEditor.redo();
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.zoom(4);
                expect(imageEditor.transform.zoomFactor).toEqual(0.30000000000000004);
                var destLeft = imageEditor.img.destLeft;
                imageEditor.img.destLeft += 20;
                imageEditor.img.destTop -= 0;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: -20, y: 0}}});
                expect(imageEditor.img.destLeft).toBeGreaterThan(destLeft);
                done();
           }, 100);
       });
       it('Pan and flip combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.flip('horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.flip('vertical');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.zoom(4);
                expect(imageEditor.transform.zoomFactor).toEqual(0.30000000000000004);
                var destLeft = imageEditor.img.destLeft;
                imageEditor.img.destLeft += 20;
                imageEditor.img.destTop -= 0;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: -20, y: 0}}});
                expect(imageEditor.img.destLeft).toBeGreaterThan(destLeft);
                done();
           }, 100);
       });
       it('Render Image with cancel combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.notify('draw', {prop: 'render-image', value: {isMouseWheel: null }});
                imageEditor.notify('draw', {prop: 'render-image', value: {true: null }});
                imageEditor.notify('selection', {prop: 'setFreehandDrawEditing', value: {bool: true }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.textArea.style.display === 'block';
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.finetuneImage('Brightness', 50);
                imageEditor.currObjType.isFiltered = true;
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.selectShape(imageEditor.objColl[imageEditor.objColl.length - 1].currIndex);
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.drawEllipse(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.flip('Horizontal');
                imageEditor.notify('draw', {prop: 'updateFlipPan', value: {isContextualToolbar: null }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.select('custom', 100, 100, 200, 200);
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.notify('draw', {prop: 'performPointZoom', value: {x: 150, y: 150, type: 'zoomIn' }});
                imageEditor.notify('draw', {prop: 'performPointZoom', value: {x: 150, y: 150, type: 'zoomIn' }});
                imageEditor.notify('draw', {prop: 'performPointZoom', value: {x: 150, y: 150, type: 'zoomOut' }});
                done();
           }, 100);
       });
       it('Exporting with annotation combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                imageEditor.activeObj.strokeSettings.strokeColor = "black";
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.rotate(90);
                imageEditor.flip('Horizontal');
                imageEditor.flip('Vertical');
                imageEditor.undo();
                imageEditor.redo();
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.select('custom', 100, 100, 200, 200);
                imageEditor.crop();
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.export();
                done();
           }, 100);
       });
       it('Filter combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px',
               finetuneSettings: {brightness: {min: 0, max: 100, defaultValue: 50}, contrast: {min: 0, max: 100, defaultValue: 50}, hue: {min: 0, max: 100, defaultValue: 50},
                   saturation: {min: 0, max: 100, defaultValue: 50}, exposure: {min: 0, max: 100, defaultValue: 50}, opacity: {min: 0, max: 100, defaultValue: 50},
                   blur: {min: 0, max: 100, defaultValue: 50 }}
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'brightness', value: 70 }});
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'contrast', value: 70 }});
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'hue', value: 70 }});
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'saturation', value: 70 }});
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'exposure', value: 70 }});
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'opacity', value: 70 }});
                imageEditor.notify('filter', {prop:'set-current-adjustment', value: {type: 'blur', value: 70 }});
                done();
           }, 100);
       });
       it('FreehandDraw combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                imageEditor.activeObj.strokeSettings = {strokeColor: 'black', fillColor: '', strokeWidth: null};
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.notify('freehand-draw', {prop:'setFreehandDrawHoveredIndex', value: {index: 0 }});
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                let obj: Object = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.notify('freehand-draw', {prop:'hoverFreehandraw', value: {strokeColor: null, strokeWidth: null } });
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.notify('freehand-draw', {prop:'hoverFreehandraw', value: {strokeColor: '#fff', strokeWidth: 4 }});
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.notify('freehand-draw', {prop:'hoverFreehandraw', value: {strokeColor: '#fff', strokeWidth: null }});
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.notify('freehand-draw', {prop:'hoverFreehandraw', value: {strokeColor: null, strokeWidth: 4 }});
                imageEditor.notify('freehand-draw', {prop:'setFreehandSelectedIndex', value: {index: 0 }});
                imageEditor.notify('freehand-draw', {prop:'apply-freehand-draw' });
                imageEditor.zoom(2);
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.pointColl[imageEditor.freehandCounter - 1].id = 'pen_1';
                imageEditor.activeObj.strokeSettings = {strokeColor: 'red'};
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.selectShape('pen_1');
                let penColor: HTMLCanvasElement = document.querySelector('#image-editor_penColorBtn');
                penColor.click();
                setTimeout(function () { });
                (document.getElementById('image-editor_pen_stroke') as any).ej2_instances[0].dataBind();
                let ul: any = document.querySelector('#image-editor_penColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                let okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.selectShape('pen_1');
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.rotate(90);
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.flip('Horizontal');
                obj = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.flip('Vertical');
                imageEditor.select('square');
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                if (!isNullOrUndefined(okBtn)) {okBtn.click(); setTimeout(function () { }); }
                imageEditor.deleteShape('pen_1');
                done();
           }, 100);
       });
       it('Selection combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.notify('selection', {prop:'setCursor', value: {x: 100, y: 100 }});
                let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                imageEditor.activeObj.strokeSettings.strokeColor = "black";
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.notify('freehand-draw', {prop:'setFreehandDrawHoveredIndex', value: {index: 0 }});
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.getShapeSettings();
                imageEditor.notify('selection', {prop:'setCursor', value: {x: 713.9229403397133, y: 25.105363438047213 }});
                imageEditor.notify('freehand-draw', {prop:'setFreehandSelectedIndex', value: {index: 0 }});
                imageEditor.notify('freehand-draw', {prop:'apply-freehand-draw' });
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                imageEditor.notify('selection', {prop:'setCursor', value: {x: 100, y: 300 }});
                imageEditor.notify('selection', {prop:'updateActivePoint ', value: {x: 300, y: 100, isCropSelection: false }});
                done();
           }, 100);
       });
       it('Shape combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                imageEditor.flip('Horizontal');
                imageEditor.flip('Vertical');
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: 100, y: 100, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'applyFontStyle', value: {item: 'default' }});
                imageEditor.notify('shape', { prop: 'applyFontStyle', value: {item: 'bold' }});
                imageEditor.notify('shape', { prop: 'applyFontStyle', value: {item: 'italic' }});
                imageEditor.notify('shape', { prop: 'applyFontStyle', value: {item: 'bolditalic' }});
                done();
           }, 100);
       });
       it('Transform combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.notify('transform', { prop: 'drawPannedImage', value: {xDiff: 5, yDiff: 5 }});
                imageEditor.zoom(5);
                imageEditor.notify('transform', { prop: 'setPanMove', value: {point: {x: 100, y: 50 }}});
                imageEditor.notify('transform', { prop: 'setTempPanMove', value: {point: {x: 120, y: 110 }}});
                imageEditor.notify('transform', { prop: 'drawPannedImage', value: {xDiff: null, yDiff: null } });
                imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'horizontal', obj: null } });
                imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'vertical', obj: null } });
                imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'horizontalVertical', obj: null } });
                imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'verticalHorizontal', obj: null } });
                imageEditor.notify('transform', { prop: 'resetZoom' });
               //  imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: ''} });
               //  imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'horizontal'} });
               //  imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'vertical'} });
               //  imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'horizontalVertical'} });
               //  imageEditor.notify('transform', { prop: 'updatePanPoints', value: {panRegion: 'verticalHorizontal'} });
                done();
           }, 100);
       });
       it('Undo-Redo combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.rotate(90);
                imageEditor.flip('Horizontal');
                imageEditor.notify('undo-redo', { prop: 'call-undo' });
                imageEditor.notify('undo-redo', { prop: 'call-redo' });
                imageEditor.notify('draw', { prop: 'iterateRotateFlipColl',
                   value: {context: imageEditor.lowerCanvas.getContext('2d'), type: 'initial' }});
                imageEditor.notify('draw', { prop: 'iterateRotateFlipColl',
                   value: {context: imageEditor.lowerCanvas.getContext('2d'), type: 'reverse' }});
                imageEditor.notify('draw', { prop: 'setTransform',
                   value: {context: imageEditor.lowerCanvas.getContext('2d'), value: 90, isReverse: null }});
                imageEditor.notify('draw', { prop: 'setTransform',
                   value: {context: imageEditor.lowerCanvas.getContext('2d'), value: -90, isReverse: null }});
                imageEditor.notify('undo-redo', { prop: 'refresh-undo-redo' , value: {bool: null }});
                const tempStrokeSettings: StrokeSettings = extend({}, imageEditor.activeObj.strokeSettings, {}, true) as StrokeSettings;
                imageEditor.notify('draw', { prop: 'setTempStrokeSettings', onPropertyChange: false,
                   value: {tempStrokeSettings: tempStrokeSettings }});
                const tempTextSettings: TextSettings = extend({}, imageEditor.activeObj.textSettings, {}, true) as TextSettings;
                imageEditor.notify('draw', { prop: 'setTempTextSettings', onPropertyChange: false, value: {tempTextSettings: tempTextSettings}});
                imageEditor.notify('draw', {prop: 'setTempAdjustmentValue',
                   value: {tempAdjustmentValue: imageEditor.lowerCanvas.getContext('2d').filter }});
                imageEditor.notify('draw', {prop: 'setTempFilter', value: {tempFilter: imageEditor.lowerCanvas.getContext('2d').filter }});
                imageEditor.notify('draw', {prop: 'setTempUndoRedoStep', value: {tempUndoRedoStep: 0 }});
                done();
           }, 100);
       });
       it('Draw module Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: 100, y: 100, actObj: imageEditor.activeObj }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.select('circle');
                var destLeft = imageEditor.img.destLeft;
                imageEditor.img.destLeft += 20;
                imageEditor.img.destTop -= 0;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: -20, y: 0}}});
                expect(imageEditor.img.destLeft).toBeGreaterThan(destLeft);
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.rotate(90);
                imageEditor.select('circle');
                var destTop = imageEditor.img.destTop;
                imageEditor.img.destLeft -= 0;
                imageEditor.img.destTop += 20;
                imageEditor.notify('transform', {prop: 'drawPannImage', value: {point: {x: 0, y: -20}}});
                expect(imageEditor.img.destTop).toBeGreaterThan(destTop);
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.select('circle');
                imageEditor.crop();
                imageEditor.select('circle');
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.select('custom');
                destLeft = imageEditor.img.destLeft;
                imageEditor.img.destLeft = -1;
                imageEditor.select('custom');
                imageEditor.img.destLeft = destLeft;
                destTop = imageEditor.img.destTop;
                imageEditor.img.destTop = -1;
                imageEditor.select('custom');
                imageEditor.img.destTop = destTop;
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.zoom(5);
                imageEditor.select('custom');
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.notify('draw', {prop: 'performPointZoom', value: {x: 150, y: 150, type: 'zoomIn' }});
                imageEditor.select('custom');
                imageEditor.notify('draw', {prop: 'performPointZoom', value: {x: 150, y: 150, type: 'zoomIn' }});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'brightness'}});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'contrast'}});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'hue'}});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'saturation'}});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'opacity'}});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'exposure'}});
                imageEditor.notify('filter', { prop: 'set-adjustment', value: {operation: 'blur'}});
                done();
           }, 100);
       });
       it('Draw module Combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.activeObj.shapeDegree = imageEditor.transform.degree;
                imageEditor.activeObj.textFlip = imageEditor.transform.currFlipState;
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: 100, y: 100, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'alignTextAreaIntoCanvas' });
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: 100, y: 100 }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: 100, y: 100 }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Horizontal');
                imageEditor.activeObj.flipObjColl.push('horizontal');
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Horizontal');
                imageEditor.activeObj.flipObjColl.pop();
                imageEditor.rotate(90);
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Vertical');
                imageEditor.activeObj.flipObjColl.push('vertical');
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Vertical');
                imageEditor.activeObj.flipObjColl.pop();
                imageEditor.rotate(90);
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Horizontal');
                imageEditor.activeObj.flipObjColl.push('horizontal');
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Horizontal');
                imageEditor.activeObj.flipObjColl.pop();
                imageEditor.rotate(90);
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Vertical');
                imageEditor.activeObj.flipObjColl.push('vertical');
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, actObj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'setTextBoxPos', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('shape', { prop: 'setTextBoxPoints', value: {actObj: imageEditor.activeObj, degree: imageEditor.transform.degree, flip: imageEditor.transform.currFlipState, x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('draw', {prop: 'performCancel', value: {isContextualToolbar: null }});
                imageEditor.flip('Vertical');
                imageEditor.activeObj.flipObjColl.pop();
                imageEditor.reset();
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.rotatedAngle = 1.2;
                imageEditor.notify('shape', { prop: 'setPointCollForShapeRotation', value: {obj: imageEditor.activeObj }});
                done();
           }, 100);
       });
       it('FreehandDraw combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               const prevCropObj: CurrentObject = extend({}, imageEditor.cropObj, {}, true) as CurrentObject;
               const object: Object = {currObj: {} as CurrentObject };
               imageEditor.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
               const prevObj: CurrentObject = object['currObj'];
               prevObj.objColl = extend([], imageEditor.objColl, [], true) as SelectionPoint[];
               prevObj.pointColl = extend([], imageEditor.pointColl, [], true) as Point[];
               prevObj.afterCropActions = extend([], imageEditor.afterCropActions, [], true) as string[];
               let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                imageEditor.activeObj.strokeSettings = {strokeColor: 'black', fillColor: '', strokeWidth: null};
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.notify('freehand-draw', {prop:'setFreehandDrawHoveredIndex', value: {index: 0 }});
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                   value: {operation: 'freehanddraw', previousObj: prevObj, previousObjColl: prevObj.objColl,
                   previousPointColl: prevObj.pointColl, previousCropObj: prevCropObj, previousText: null,
                   currentText: null, previousFilter: null, isCircleCrop: null}});
                imageEditor.notify('undo-redo', {prop: 'update-current-undo-redo-coll', value: {type: 'ok' }});
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                   value: {operation: 'freehanddrawCustomized', previousObj: prevObj, previousObjColl: prevObj.objColl,
                   previousPointColl: prevObj.pointColl, previousCropObj: prevCropObj, previousText: null,
                   currentText: null, previousFilter: null, isCircleCrop: null}});
                imageEditor.notify('undo-redo', {prop: 'update-current-undo-redo-coll', value: {type: 'ok' }});
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                   value: {operation: 'deleteFreehandDrawing', previousObj: prevObj, previousObjColl: prevObj.objColl,
                   previousPointColl: prevObj.pointColl, previousCropObj: prevCropObj, previousText: null,
                   currentText: null, previousFilter: null, isCircleCrop: null}});
                imageEditor.notify('undo-redo', {prop: 'update-current-undo-redo-coll', value: {type: 'ok' }});
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.reset();
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                   value: {operation: 'textAreaCustomization', previousObj: prevObj, previousObjColl: prevObj.objColl,
                   previousPointColl: prevObj.pointColl, previousCropObj: prevCropObj, previousText: null,
                   currentText: null, previousFilter: null, isCircleCrop: null}});
                imageEditor.notify('undo-redo', {prop: 'update-current-undo-redo-coll', value: {type: 'ok' }});
                imageEditor.undo();
                imageEditor.redo();
                imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                   value: {operation: 'text', previousObj: prevObj, previousObjColl: prevObj.objColl,
                   previousPointColl: prevObj.pointColl, previousCropObj: prevCropObj, previousText: null,
                   currentText: null, previousFilter: null, isCircleCrop: null}});
                imageEditor.notify('undo-redo', {prop: 'update-current-undo-redo-coll', value: {type: 'ok' }});
                imageEditor.undo();
                imageEditor.redo();
                done();
           }, 100);
       });
       it('Toolbar combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                let eventargs: object = { type: 'main', isApplyBtn: null, isCropping: null, isZooming: null};
                imageEditor.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
                eventargs = { type: 'filter', isApplyBtn: null, isCropping: null, isZooming: null};
                imageEditor.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
                eventargs = { type: 'adjustment', isApplyBtn: null, isCropping: null, isZooming: null};
                imageEditor.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
               //  eventargs = { type: 'color', isApplyBtn: null, isCropping: null, isZooming: null};
               //  imageEditor.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
                imageEditor.notify('toolbar', { prop: 'getPenStroke', onPropertyChange: false, value: {value: 1 }});
                imageEditor.notify('toolbar', { prop: 'getPenStroke', onPropertyChange: false, value: {value: 2 }});
                imageEditor.notify('toolbar', { prop: 'getPenStroke', onPropertyChange: false, value: {value: 3 }});
                imageEditor.notify('toolbar', { prop: 'getPenStroke', onPropertyChange: false, value: {value: 4 }});
                imageEditor.notify('toolbar', { prop: 'getPenStroke', onPropertyChange: false, value: {value: 5 }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'pan', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'crop', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'reset', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'undo', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'redo', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'adjustment', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'brightness', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'filter', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'default', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
               imageEditor.reset(); 
               imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'duplicate', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'remove', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'edittext', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'performDefToolbarClickAction', onPropertyChange: false,
                   value: {type: 'upload', isContextualToolbar: false, isDisabledAdjustment: false, isDisabledFilter: false,
                   isFilterFinetune: false }});
                imageEditor.notify('toolbar', { prop: 'create-bottom-toolbar', onPropertyChange: false});
                imageEditor.notify('toolbar', {prop: 'destroy-bottom-toolbar', onPropertyChange: false});
                imageEditor.toolbarTemplate = '#toolbarTemplate';
                imageEditor.quickAccessToolbarTemplate = '#toolbarTemplate';
                imageEditor.notify('toolbar', {prop: 'toolbarTemplateFn', onPropertyChange: false});
                imageEditor.notify('toolbar', {prop: 'quickAccessToolbarTemplateFn', onPropertyChange: false});
                imageEditor.toolbarTemplate = null; imageEditor.quickAccessToolbarTemplate = null;
                imageEditor.reset();
                eventargs = { type: 'filter', isApplyBtn: null, isCropping: null, isZooming: null};
                //imageEditor.notify('toolbar', { prop: 'refresh-toolbar', onPropertyChange: false, value: eventargs});
                imageEditor.notify('toolbar', {prop: 'setTempFilterProperties', onPropertyChange: false});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'brightness' }});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'contrast' }});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'hue' }});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'saturation' }});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'opacity' }});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'blur' }});
                imageEditor.notify('toolbar', {prop: 'getCurrAdjustmentValue', onPropertyChange: false, value: {type: 'exposure' }});
                imageEditor.notify('toolbar', {prop: 'setCurrAdjustmentValue', onPropertyChange: false, value: {type: 'brightness', value: 50 }});
                imageEditor.notify('toolbar', {prop: 'setCurrAdjustmentValue', onPropertyChange: false, value: {type: 'contrast', value: 50 }});
                imageEditor.notify('toolbar', {prop: 'setCurrAdjustmentValue', onPropertyChange: false, value: {type: 'hue', value: 50 }});
                imageEditor.notify('toolbar', {prop: 'setCurrAdjustmentValue', onPropertyChange: false, value: {type: 'saturation', value: 50 }});
                imageEditor.notify('toolbar', {prop: 'setCurrAdjustmentValue', onPropertyChange: false, value: {type: 'blur', value: 50 }});
                imageEditor.notify('toolbar', {prop: 'setCurrAdjustmentValue', onPropertyChange: false, value: {type: 'exposure', value: 50 }});
                done();
           }, 100);
       });
       it('Selection module combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.notify('selection', { prop: 'setTempActObj', value: {obj: imageEditor.activeObj }});
                imageEditor.notify('shape', { prop: 'renderTextArea', value: {x: 100, y: 100, actObj: imageEditor.activeObj }});
                imageEditor.notify('selection', {prop: 'tab', onPropertyChange: false});
                imageEditor.reset();
                imageEditor.drawRectangle(300, 150, 600, 350, 15, 'red', 'green');
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.objColl[0].activePoint.startX, y: imageEditor.objColl[0].activePoint.startY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.objColl[0].activePoint.endX, y: imageEditor.objColl[0].activePoint.startY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.objColl[0].activePoint.startX, y: imageEditor.objColl[0].activePoint.endY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.objColl[0].activePoint.endX, y: imageEditor.objColl[0].activePoint.endY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.objColl[0].activePoint.startX + 100, y: imageEditor.objColl[0].activePoint.startY + 100 }});
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.endX, y: imageEditor.activeObj.activePoint.startY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.endY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.endX, y: imageEditor.activeObj.activePoint.endY }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX + 100, y: imageEditor.activeObj.activePoint.startY + 100 }});
                imageEditor.reset();
                let points = [
                   {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                   {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                   {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                   {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                   {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                   {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                ];
                imageEditor.notify('shape', { prop: 'refreshActiveObj', onPropertyChange: false});
                imageEditor.activeObj.strokeSettings = {strokeColor: 'black', fillColor: '', strokeWidth: null};
                imageEditor.penStrokeWidth = 5;
                imageEditor.transform.currFlipState = "";
                setTimeout(function () { });
                (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                imageEditor.notify('freehand-draw', {prop:'setFreehandDrawHoveredIndex', value: {index: 0 }});
                imageEditor.freehandDraw(true);
                imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                imageEditor.togglePen = false;
                const obj: Object = {selPointColl: imageEditor.pointColl };
                imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: 710.0539748224719, y: 25.105363438047213 }});
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: 710.0539748224719, y: 25.105363438047213, z1: 0, z2: 0, z3: 0, z4: 0 }});
                imageEditor.reset();
                done();
           }, 100);
       });
       it('Toolbar combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'move' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'nw-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'n-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'w-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'e-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'sw-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 's-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'se-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'grabbing' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                done();
           }, 100);
       });
       it('Toolbar combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                //imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'move' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.objColl[0].activePoint.startX, y: imageEditor.objColl[0].activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'nw-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'n-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                   imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'ne-resize' }});
                   imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'w-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'e-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'sw-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 's-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'se-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'grabbing' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.reset();
                done();
           }, 100);
       });
       it('Toolbar combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'move' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'nw-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'n-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                   imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'ne-resize' }});
                   imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'w-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'e-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'sw-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 's-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'se-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'grabbing' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragWidth', onPropertyChange: false,
                   value: {width: 10 }});
                imageEditor.notify('selection', {prop: 'setDragWidth', onPropertyChange: false,
                   value: {width: -10 }});
                imageEditor.notify('selection', {prop: 'setDragHeight', onPropertyChange: false,
                   value: {height: 10 }});
                imageEditor.notify('selection', {prop: 'setDragHeight', onPropertyChange: false,
                   value: {height: -10 }});
                imageEditor.reset();
                done();
           }, 100);
       });
       it('Toolbar combination', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
                imageEditor.select('square');
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'move' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'nw-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'n-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'w-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'e-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'sw-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 's-resize' }});
                imageEditor.notify('selection', {prop: 'findTarget', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'mousedown' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'se-resize' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'grabbing' }});
                imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                   value: {x: 0, y: 0, isCropSelection: false }});
                imageEditor.reset();
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setObjSelected', onPropertyChange: false, value: {bool: true }});
                imageEditor.notify('selection', {prop: 'updateCursorStyles', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'move' }});
                imageEditor.reset();
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setObjSelected', onPropertyChange: false, value: {bool: true }});
                imageEditor.notify('selection', {prop: 'updateCursorStyles', onPropertyChange: false,
                   value: {x: imageEditor.activeObj.activePoint.startX, y: imageEditor.activeObj.activePoint.startY, type: 'move' }});
                imageEditor.notify('selection', {prop: 'adjustActObjForLineArrow', onPropertyChange: false, value: {obj: imageEditor.activeObj }});
                imageEditor.activeObj.rotatedAngle = 1.2;
                imageEditor.notify('selection', {prop: 'updatePointCollForShapeRotation', onPropertyChange: false, value: {obj: imageEditor.activeObj }});
                imageEditor.rotateFlipColl.push(90);
                imageEditor.notify('selection', {prop: 'getCurrentFlipState', onPropertyChange: false });
                imageEditor.reset();
                done();
           }, 100);
       });
       it('Coverage improvement for all modules', (done) => {
           imageEditor = new ImageEditor({
               height: '350px'
           }, '#image-editor');
           imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
           setTimeout(() => {
               imageEditor.rotate(90);
               imageEditor.export();
               imageEditor.select('circle');
               imageEditor.crop();
               imageEditor.flip('Horizontal');
               expect(imageEditor.transform.currFlipState).toEqual('horizontal');
               const value: any = {obj: 'ellipse'};
               imageEditor.notify('shape', {prop: 'draw-shape', value: value});
               expect(imageEditor.activeObj.shape).toEqual('ellipse');
               imageEditor.zoom(2);
               imageEditor.rotate(180);
               imageEditor.zoom(4, {x: 100, y: 100, type: 'zoomIn'});
               imageEditor.notify('transform', { prop: 'performTransformation', value: { text: "rotateleft" } });
               imageEditor.reset();
               done();
           }, 100);
       });
       it('Coverage improvement for new features', (done) => {
            imageEditor = new ImageEditor({
                height: '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawArrow(350, 300, 300, 100, 20, 'red', 'Arrow', 'SolidArrow');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('arrow');
                imageEditor.selectShape('shape_1');
                let btn: any = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                let qatBtn: any = document.querySelectorAll('#image-editor_duplicate')[0];
                qatBtn.click();
                setTimeout(() => {});
                qatBtn = document.querySelectorAll('#image-editor_remove')[0];
                qatBtn.click();
                setTimeout(() => {});
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.drawPath([{x: 400, y: 300}, {x: 600, y: 400}, {x: 700, y: 300}], 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('path');
                imageEditor.notify('shape', { prop: 'applyActObj', value: {isMouseDown: null }});
                imageEditor.zoom(2);
                imageEditor.zoom(3);
                imageEditor.zoom(2);
                imageEditor.zoom(1);
                imageEditor.select('square');
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.rotate(90);
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.reset();
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.selectShape('shape_1');
                qatBtn = document.querySelectorAll('#image-editor_editText')[0];
                qatBtn.click();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Coverage improvement for filter finetune toolbar', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
                quickAccessToolbarTemplate: '#toolbarTemplate',
                finetuneSettings: {brightness: {min: 0, max: 200, defaultValue: 10}, contrast: {min: 0, max: 200, defaultValue: 10},
                    hue: {min: 0, max: 200, defaultValue: 10}, saturation: {min: 0, max: 200, defaultValue: 10},
                    exposure: {min: 0, max: 200, defaultValue: 10}, opacity: {min: 0, max: 200, defaultValue: 10},
                    blur: {min: 0, max: 200, defaultValue: 10} }
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let finetuneBtn: any = document.querySelectorAll('#image-editor_adjustment')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_contrast')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_hue')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_saturation')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_exposure')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_opacity')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_blur')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_ok')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                imageEditor.reset();
                finetuneBtn = document.querySelectorAll('#image-editor_filter')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_chromeCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_coldCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_warmCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_grayscaleCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_sepiaCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_invertCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                finetuneBtn = document.querySelectorAll('#image-editor_defaultCanvas')[0];
                finetuneBtn.click();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Coverage improvement for base module', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
                toolbarTemplate: '#toolbarTemplate',
                allowUndoRedo: false,
                showQuickAccessToolbar: false
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.getImageDimension();
                imageEditor.select('square', {x: 100, y: 100}, 500, 500);
                imageEditor.zoom(5);
                imageEditor.rotate(90);
                imageEditor.reset();
                imageEditor.currObjType.shape = 'freehanddraw';
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                imageEditor.reset();
                imageEditor.drawPath([{x: 400, y: 300}, {x: 600, y: 400}, {x: 700, y: 300}], 20, 'red');
                imageEditor.notify('selection', { prop: 'setCurrentDrawingShape', onPropertyChange: false, value: {value: 'path' }});
                imageEditor.notify('shape', { prop: 'stopPathDrawing', onPropertyChange: false, value: {e: null }});
                imageEditor.reset();
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.activeObj.rotatedAngle = 0.25;
                imageEditor.selectShape('shape_1');
                done();
            }, 100);
        });
        it('Coverage improvement for error loading', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-214926422.jpg');
            setTimeout(() => {
                done();
            }, 100);
        });
        it('Arrow shape Combination', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawArrow(350, 300, 300, 100, 20, 'red', 'Arrow', 'SolidArrow');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('arrow');
                imageEditor.selectShape('shape_1');
                let btn: any = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[3].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[4].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[5].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_startBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_startBtn-popup');
                ul = document.querySelectorAll('#image-editor_startBtn-popup')[ul.length - 1];
                ul.children[0].children[7].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[2].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[3].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[4].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[5].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_endBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_endBtn-popup');
                ul = document.querySelectorAll('#image-editor_endBtn-popup')[ul.length - 1];
                ul.children[0].children[7].click();
                setTimeout(() => {});
                done();
            }, 100);
        });
        it('Coverage improvement for draw module', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.selectShape('shape_1');
                const cancelBtn: any = document.querySelectorAll('#image-editor_cancel')[0];
                cancelBtn.click();
                setTimeout(() => {});
                imageEditor.undo();
                imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                done();
            }, 100);
        });
        it('Coverage improvement for draw module', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.selectShape('shape_1');
                let btn: any = document.querySelectorAll('#image-editor_editText')[0];
                btn.click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_fontFamilyBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_fontFamilyBtn-popup');
                ul = document.querySelectorAll('#image-editor_fontFamilyBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(() => {});
                btn = document.querySelectorAll('#image-editor_ok')[0];
                btn.click();
                setTimeout(() => {});
                imageEditor.undo();
                imageEditor.redo();
                done();
            }, 100);
        });
        it('Undoredo combination', (done) => {
            imageEditor = new ImageEditor({
                height: '450px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const prevCropObj: CurrentObject = extend({}, imageEditor.cropObj, {}, true) as CurrentObject;
                const object: Object = {currObj: {} as CurrentObject };
                imageEditor.notify('filter', { prop: 'getCurrentObj', onPropertyChange: false, value: {object: object }});
                const prevObj: CurrentObject = object['currObj'];
                prevObj.objColl = extend([], imageEditor.objColl, [], true) as SelectionPoint[];
                prevObj.pointColl = extend([], imageEditor.pointColl, [], true) as Point[];
                prevObj.afterCropActions = extend([], imageEditor.afterCropActions, [], true) as string[];
                 let points = [
                    {x: 710.0539748224719, y: 25.105363438047213, ratioX: 0.8839387453519381, ratioY: 0.05938697025693696, time: 1674043575063},
                    {x: 713.9229403397133, y: 25.105363438047213, ratioX: 0.8993233607365535, ratioY: 0.05938697025693696, time: 1674043575090},
                    {x: 719.0815610293685, y: 25.105363438047213, ratioX: 0.919836181249374, ratioY: 0.05938697025693696, time: 1674043575106},
                    {x: 723.380411604081, y: 25.105363438047213, ratioX: 0.9369301983433911, ratioY: 0.05938697025693696, time: 1674043575123},
                    {x: 729.3988024086788, y: 24.675478380575946, ratioX: 0.960861822275015, ratioY: 0.05708811968222432, time: 1674043575139},
                    {x: 733.6976529833914, y: 24.675478380575946, ratioX: 0.9779558393690321, ratioY: 0.05708811968222432, time: 1674043575156}
                 ];
                 imageEditor.activeObj.strokeSettings.strokeColor = "black";
                 imageEditor.penStrokeWidth = 5;
                 imageEditor.transform.currFlipState = "";
                 setTimeout(function () { });
                 (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                 imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                    value: {operation: 'freehand-draw', previousObj: prevObj, previousObjColl: prevObj.objColl,
                        previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                        previousCropObj: prevCropObj, previousText: null,
                        currentText: null, previousFilter: null, isCircleCrop: null}});
                 imageEditor.notify('freehand-draw', {prop:'setFreehandDrawHoveredIndex', value: {index: 0 }});
                 imageEditor.freehandDraw(true);
                 imageEditor.notify('freehand-draw', {prop:'freehandRedraw', value: {context: imageEditor.lowerCanvas.getContext('2d'), points: points }});
                 imageEditor.okBtn();
                 imageEditor.undo();
                 imageEditor.redo();
                 imageEditor.pointColl[imageEditor.pointColl.length - 1].id = 'pen_1';
                 const obj: Object = {selPointColl: imageEditor.pointColl };
                 imageEditor.notify('freehand-draw', {prop:'setSelPointColl', value: {obj: obj }});
                 imageEditor.selectShape('pen_1');
                 let btn: any = document.querySelectorAll('#image-editor_remove')[0];
                 btn.click();
                 setTimeout(() => {});
                 imageEditor.undo();
                 imageEditor.redo();
                 imageEditor.reset();
                 imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.selectShape('shape_1');
                 imageEditor.activeObj.keyHistory = 'Syncfusion123';
                 imageEditor.okBtn();
                 imageEditor.notify('undo-redo', { prop: 'updateUndoRedoColl', onPropertyChange: false,
                    value: {operation: 'text', previousObj: prevObj, previousObjColl: prevObj.objColl,
                        previousPointColl: prevObj.pointColl, previousSelPointColl: prevObj.selPointColl,
                        previousCropObj: prevCropObj, previousText: null,
                        currentText: null, previousFilter: null, isCircleCrop: null}});
                 imageEditor.undo();
                 imageEditor.redo();
                 done();
            }, 100);
        });
        it('Coverage improvement for selection module', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawPath([{x: 400, y: 300}, {x: 600, y: 400}, {x: 700, y: 300}], 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('path');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: 400, y: 300 }});
                imageEditor.reset();
                imageEditor.drawLine(350, 300, 300, 100, 20, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'setCursor', onPropertyChange: false,
                   value: {x: 350, y: 300 }});
                imageEditor.reset();
                imageEditor.drawRectangle(350, 200, 650, 400, 15, 'red', 'green');
                imageEditor.selectShape('shape_1');
                imageEditor.notify('selection', {prop: 'adjustNEPoints', onPropertyChange: false,
                    value: {rectangle: imageEditor.activeObj.activePoint, x: 400, y: 300, angle: 1.25 }});
                imageEditor.notify('selection', {prop: 'adjustRotationPoints', onPropertyChange: false,
                    value: {rectangle: imageEditor.activeObj.activePoint, x: 400, y: 300, angle: 1.25 }});
                imageEditor.notify('selection', {prop: 'setResizedElement', onPropertyChange: false, value: {value: 'e-resize' }});
                imageEditor.notify('selection', {prop: 'getResizeDirection', onPropertyChange: false,
                    value: {rectangle: imageEditor.activeObj.activePoint, x: 400, y: 300, angle: 1.25 }});
                imageEditor.notify('selection', {prop: 'setResizedElement', onPropertyChange: false, value: {value: 'n-resize' }});
                imageEditor.notify('selection', {prop: 'getResizeDirection', onPropertyChange: false,
                    value: {rectangle: imageEditor.activeObj.activePoint, x: 400, y: 300, angle: 1.25 }});
                imageEditor.notify('selection', {prop: 'setResizedElement', onPropertyChange: false, value: {value: 'w-resize' }});
                imageEditor.notify('selection', {prop: 'getResizeDirection', onPropertyChange: false,
                    value: {rectangle: imageEditor.activeObj.activePoint, x: 400, y: 300, angle: 1.25 }});
                imageEditor.notify('selection', {prop: 'setResizedElement', onPropertyChange: false, value: {value: 's-resize' }});
                imageEditor.notify('selection', {prop: 'getResizeDirection', onPropertyChange: false,
                    value: {rectangle: imageEditor.activeObj.activePoint, x: 400, y: 300, angle: 1.25 }});
                done();
            }, 100);
        });
        it('resize Image aspectratio', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.resize(450, 342, true);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(497);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                imageEditor.reset();
                imageEditor.resize(890, 593, true);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(497);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                done();
            }, 100);
        });
        it('resize Image nonaspectratio', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.resize(248, 293);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(320);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                imageEditor.reset();
                imageEditor.resize(50, 34);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(497);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                imageEditor.reset();
                imageEditor.resize(415, 902);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(174);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                imageEditor.reset();
                imageEditor.resize(967, 129);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(497);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                imageEditor.flip('Horizontal');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.reset();
                done();
            }, 100);
        });
        it('resize image using toolbar', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                setTimeout(function () { });
                    let resizeBtn: any = document.querySelectorAll('#image-editor_resize')[0];
                    resizeBtn.click();
                    setTimeout(function () { });
                    imageEditor.notify('transform', {prop: 'resize', value: {width: 400, height: 300, isAspectRatio: true }});
                    expect(Math.round(imageEditor.img.destWidth)).toEqual(404);
                    expect(Math.round(imageEditor.img.destHeight)).toEqual(307);
                    let okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                    okBtn.click();
                    expect(Math.round(imageEditor.img.destWidth)).toEqual(497);
                    expect(Math.round(imageEditor.img.destHeight)).toEqual(378);
                    resizeBtn = document.querySelectorAll('#image-editor_resize')[0];
                    resizeBtn.click();
                    setTimeout(function () { });
                    let aspectratiobtn: any = document.querySelectorAll('#image-editor_aspectratio')[0];
                    aspectratiobtn.click();
                    setTimeout(function () { });
                    let cancelBtn: any = document.querySelectorAll('#image-editor_cancel')[0];
                    cancelBtn.click();
                    setTimeout(() => {});
                    done();
            }, 100);
        });
        it('resized Image rotation', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                setTimeout(() => {});
                let transformBtn: any = document.querySelectorAll('#image-editor_rotateRight')[0];
                transformBtn.click();
                setTimeout(() => {});
                expect(imageEditor.transform.degree).toEqual(90);
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                setTimeout(() => {});
                const resizeBtn: any = document.querySelectorAll('#image-editor_resize')[0];
                resizeBtn.click();
                setTimeout(function () { });
                imageEditor.notify('transform', {prop: 'resize', value: {width: 400, height: 300, isAspectRatio: true }});
                expect(imageEditor.transform.degree).toEqual(90);
                expect(Math.round(imageEditor.img.destWidth)).toEqual(399);
                expect(Math.round(imageEditor.img.destHeight)).toEqual(524);
                done();
            }, 100);
        });
        it('Image Annotation', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                setTimeout(function () {
                    expect(Math.round(imageEditor.objColl[0].activePoint.width)).toEqual(200);
                    expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(500);
                    expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(100);
                    expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(700);
                    expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(252);
                    expect(Math.round(imageEditor.objColl[0].shapeDegree)).toEqual(0);
                    imageEditor.selectShape('shape_1');
                    setTimeout(function () { });
                    let transformBtn: any = document.querySelectorAll('#image-editor_hFlip')[0];
                    transformBtn.click();
                    let okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                    okBtn.click();
                    imageEditor.undo();
                    setTimeout(function () { });
                    imageEditor.redo();
                    setTimeout(function () { });
                    imageEditor.selectShape('shape_1');
                    setTimeout(function () { });
                    transformBtn = document.querySelectorAll('#image-editor_vFlip')[0];
                    transformBtn.click();
                    okBtn = document.querySelectorAll('#image-editor_ok')[0];
                    okBtn.click();
                    setTimeout(function () { });
                    imageEditor.selectShape('shape_1');
                    setTimeout(function () { });
                    transformBtn = document.querySelectorAll('#image-editor_vFlip')[0];
                    transformBtn.click();
                    setTimeout(function () { });
                    okBtn = document.querySelectorAll('#image-editor_ok')[0];
                    okBtn.click();
                    imageEditor.undo();
                    setTimeout(function () { });
                    imageEditor.redo();
                    setTimeout(function () { });
                    imageEditor.selectShape('shape_1');
                    transformBtn = document.querySelectorAll('#image-editor_rotLeft')[0];
                    transformBtn.click();
                    done();
                }, 500);
                imageEditor.drawImage('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg', 500, 100, 200, 80, true, 90);
            }, 100);
        });
        it('frame using Toolbar', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const filterBtn: any = document.querySelectorAll('#image-editor_frame')[0];
                filterBtn.click();
                const matFrame: HTMLCanvasElement = document.querySelector('#image-editor_mat');
                matFrame.click();
                expect(imageEditor.frameObj.amount).toEqual(1);
                expect(imageEditor.frameObj.type).toEqual('mat');
                expect(imageEditor.frameObj.inset).toEqual(20);
                expect(imageEditor.frameObj.offset).toEqual(20);
                filterBtn.click();
                const bevelFrame: HTMLCanvasElement = document.querySelector('#image-editor_bevel');
                bevelFrame.click();
                expect(imageEditor.frameObj.amount).toEqual(1);
                expect(imageEditor.frameObj.type).toEqual('bevel');
                expect(imageEditor.frameObj.inset).toEqual(20);
                expect(imageEditor.frameObj.offset).toEqual(20);
                const lineFrame: HTMLCanvasElement = document.querySelector('#image-editor_line');
                lineFrame.click();
                expect(imageEditor.frameObj.amount).toEqual(1);
                expect(imageEditor.frameObj.type).toEqual('line');
                expect(imageEditor.frameObj.inset).toEqual(20);
                expect(imageEditor.frameObj.offset).toEqual(20);
                const insetFrame: HTMLCanvasElement = document.querySelector('#image-editor_inset');
                insetFrame.click();
                expect(imageEditor.frameObj.amount).toEqual(1);
                expect(imageEditor.frameObj.type).toEqual('inset');
                expect(imageEditor.frameObj.inset).toEqual(20);
                expect(imageEditor.frameObj.offset).toEqual(60);
                const hookFrame: HTMLCanvasElement = document.querySelector('#image-editor_hook');
                hookFrame.click();
                expect(imageEditor.frameObj.amount).toEqual(1);
                expect(imageEditor.frameObj.type).toEqual('hook');
                expect(imageEditor.frameObj.inset).toEqual(20);
                expect(imageEditor.frameObj.offset).toEqual(20);
                imageEditor.reset();
                imageEditor.drawFrame(FrameType.Mat, 'red', 'blue', 20, 20, 20, 20, 'solid', 1);
                expect(imageEditor.frameObj.amount).toEqual(1);
                expect(imageEditor.frameObj.type).toEqual('mat');
                expect(imageEditor.frameObj.inset).toEqual(20);
                expect(imageEditor.frameObj.offset).toEqual(20);
                expect(imageEditor.frameObj.border).toEqual('solid');
                expect(imageEditor.frameObj.radius).toEqual(20);
                done();
            }, 100);
        });
        it('rectangle rotate', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let dimension: any = imageEditor.getImageDimension();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                imageEditor.rotate(180);
                imageEditor.flip('Vertical');
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(180);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.reset();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                setTimeout(() => {});
                imageEditor.rotate(180);
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(180);
                imageEditor.reset();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                setTimeout(() => {});
                imageEditor.rotate(270);
                setTimeout(() => {});
                imageEditor.flip('Horizontal');
                setTimeout(() => {});
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(270);
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.reset();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                setTimeout(() => {});
                imageEditor.rotate(270);
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(270);
                imageEditor.reset();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                setTimeout(() => {});
                imageEditor.rotate(90);
                imageEditor.flip('Horizontal');
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(90);
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.reset();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                setTimeout(() => {});
                imageEditor.rotate(90);
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(90);
                imageEditor.reset();
                imageEditor.drawRectangle(dimension.x, dimension.y);
                setTimeout(() => {});
                imageEditor.rotate(0);
                imageEditor.flip('Vertical');
                imageEditor.selectShape('shape_1');
                expect(imageEditor.transform.degree).toEqual(0);
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                done();
            }, 100);
        });
        it('image rotate', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                setTimeout(function () {
                    imageEditor.rotate(90);
                    imageEditor.rotate(180);
                    imageEditor.rotate(270);
                    imageEditor.rotate(0);
                    expect(imageEditor.currObjType.shape).toEqual('image');
                    done();
                }, 600);
                imageEditor.drawImage('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg', 500, 100, 200, 80, true, 90);
            }, 200);
        });
        it('frameLine using toolbar', (done) => {
            imageEditor = new ImageEditor({
                height: '350px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let frameBtn: any = document.querySelectorAll('#image-editor_frame')[0];
                frameBtn.click();
                setTimeout(function () { });
                const lineFrame: HTMLCanvasElement = document.querySelector('#image-editor_line');
                lineFrame.click();
                setTimeout(function () { });
                const frameColor: HTMLCanvasElement = document.querySelector('#image-editor_frameColorBtn');
                frameColor.click();
                setTimeout(function () { });
                (document.getElementById('image-editor_frame_fill') as any).ej2_instances[0].dataBind();
                let ul: any = document.querySelector('#image-editor_frameColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const frameGradient: HTMLCanvasElement = document.querySelector('#image-editor_frameGradientColorBtn');
                frameGradient.click();
                setTimeout(function () { });
                (document.getElementById('image-editor_frame_gradient_fill') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_frameGradientColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[4] as HTMLElement).click();
                setTimeout(() => {}, 10);
                const frameAmount: HTMLCanvasElement = document.querySelector('#image-editor_frameAmountBtn');
                frameAmount.click();
                setTimeout(function () { });
                ul = document.querySelectorAll('#image-editor_frameAmountBtn-popup');
                ul = document.querySelectorAll('#image-editor_frameAmountBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                const frameBorder: HTMLCanvasElement = document.querySelector('#image-editor_frameBorderBtn');
                frameBorder.click();
                setTimeout(function () { });
                ul = document.querySelectorAll('#image-editor_frameBorderBtn-popup');
                ul = document.querySelectorAll('#image-editor_frameBorderBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                const frameInset: HTMLCanvasElement = document.querySelector('#image-editor_frameInsetBtn');
                frameInset.click();
                setTimeout(function () { });
                ul = document.querySelectorAll('#image-editor_frameInsetBtn-popup');
                ul = document.querySelectorAll('#image-editor_frameInsetBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                const frameOffset: HTMLCanvasElement = document.querySelector('#image-editor_frameOffsetBtn');
                frameOffset.click();
                setTimeout(function () { });
                ul = document.querySelectorAll('#image-editor_frameOffsetBtn-popup');
                ul = document.querySelectorAll('#image-editor_frameOffsetBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                const frameSize: HTMLCanvasElement = document.querySelector('#image-editor_frameSizeBtn');
                frameSize.click();
                setTimeout(function () { });
                ul = document.querySelectorAll('#image-editor_frameSizeBtn-popup');
                ul = document.querySelectorAll('#image-editor_frameSizeBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                const frameRadius: HTMLCanvasElement = document.querySelector('#image-editor_frameRadiusBtn');
                frameRadius.click();
                setTimeout(function () { });
                ul = document.querySelectorAll('#image-editor_frameRadiusBtn-popup');
                ul = document.querySelectorAll('#image-editor_frameRadiusBtn-popup')[ul.length - 1];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                imageEditor.undo();
                imageEditor.redo();
                expect(imageEditor.frameObj.amount).toEqual(2);
                expect(imageEditor.frameObj.size).toEqual(40);
                expect(imageEditor.frameObj.type).toEqual('line');
                expect(imageEditor.frameObj.inset).toEqual(40);
                expect(imageEditor.frameObj.offset).toEqual(40);
                expect(imageEditor.frameObj.radius).toEqual(20);
                expect(imageEditor.frameObj.border).toEqual('dashed');
                let btn: any = document.querySelectorAll('#image-editor_saveBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_saveBtn-popup');
                ul = document.querySelectorAll('#image-editor_saveBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                done();
            }, 100);
        });
        it('line arrow vertical flip', (done) => {	
            imageEditor = new ImageEditor({
            height:'450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
            let dimension: any = imageEditor.getImageDimension();
            imageEditor.drawArrow(dimension.x, dimension.y+10, dimension.x+50, dimension.y+10, 10, 'red', 'Arrow', 'SolidArrow');
            setTimeout(function () { });
            imageEditor.rotate(90);
            imageEditor.flip('Vertical');
            setTimeout(function () { });
            expect(imageEditor.currObjType.shape).toEqual('arrow');
            done();
            }, 100);
        });       
        it('text rotation', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 30, true, true, '#40e040');
                imageEditor.rotate(90);
                imageEditor.selectShape('shape_1');
                let qatBtn: any = document.querySelectorAll('#image-editor_editText')[0];
                qatBtn.click();
                setTimeout(() => {});
                let okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                imageEditor.flip('Vertical');
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                qatBtn = document.querySelectorAll('#image-editor_editText')[0];
                qatBtn.click();
                setTimeout(() => {});
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                expect(imageEditor.currObjType.shape).toEqual('text');
                expect(imageEditor.activeObj.strokeSettings.strokeColor).toEqual('#40e040');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.reset();
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 30, true, true, '#40e040');
                imageEditor.rotate(180);
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                qatBtn = document.querySelectorAll('#image-editor_editText')[0];
                setTimeout(() => {});
                qatBtn.click();
                setTimeout(() => {});
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                imageEditor.flip('Horizontal');
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                qatBtn = document.querySelectorAll('#image-editor_editText')[0];
                setTimeout(() => {});
                qatBtn.click();
                setTimeout(() => {});
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                expect(imageEditor.currObjType.shape).toEqual('text');
                expect(imageEditor.activeObj.strokeSettings.strokeColor).toEqual('#40e040');
                expect(imageEditor.transform.currFlipState).toEqual('horizontal');
                imageEditor.reset();
                imageEditor.drawText(350, 100, 'Syncfusion', 'Arial', 30, true, true, '#40e040');
                imageEditor.rotate(270);
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                qatBtn = document.querySelectorAll('#image-editor_editText')[0];
                qatBtn.click();
                setTimeout(() => {});
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                imageEditor.flip('Vertical');
                imageEditor.selectShape('shape_1');
                setTimeout(() => {});
                qatBtn = document.querySelectorAll('#image-editor_editText')[0];
                qatBtn.click();
                setTimeout(() => {});
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                expect(imageEditor.currObjType.shape).toEqual('text');
                expect(imageEditor.activeObj.strokeSettings.strokeColor).toEqual('#40e040');
                expect(imageEditor.transform.currFlipState).toEqual('vertical');
                imageEditor.reset();
                done();
            }, 100);
        });
        it('resize image download', (done) => {
            imageEditor = new ImageEditor({
                height: '450px',
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                let resizeBtn: any = document.querySelectorAll('#image-editor_resize')[0];
                resizeBtn.click();
                setTimeout(function () { });
                imageEditor.notify('transform', {prop: 'resize', value: {width: 400, height: 300, isAspectRatio: true }});
                setTimeout(function () { });
                let btn: any = document.querySelectorAll('#image-editor_saveBtn')[0];
                btn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_saveBtn-popup');
                ul = document.querySelectorAll('#image-editor_saveBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                imageEditor.reset();
                resizeBtn = document.querySelectorAll('#image-editor_resize')[0];
                resizeBtn.click();
                setTimeout(function () { });
                imageEditor.notify('transform', {prop: 'resize', value: {width: 400, height: 300, isAspectRatio: true }});
                setTimeout(function () { });
                imageEditor.rotate(90);
                btn = document.querySelectorAll('#image-editor_saveBtn')[0];
                btn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('#image-editor_saveBtn-popup');
                ul = document.querySelectorAll('#image-editor_saveBtn-popup')[ul.length - 1];
                ul.children[0].children[0].click();
                setTimeout(() => {});
                imageEditor.reset();
                done();
            }, 100);
        });
        it('Text with 360 Rotate and Ver Hor Flip Click', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                const annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                annotationBtn.click();
                setTimeout(() => {});
                let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                ul.children[0].children[6].click();
                expect(imageEditor.activeObj.shape).toEqual('text');
                let okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                const cropBtn: any = document.querySelectorAll('#image-editor_cropTransform')[0];
                cropBtn.click();
                let transformBtn: any = document.querySelectorAll('#image-editor_horizontalFlip')[0];
                transformBtn.click();
                transformBtn = document.querySelectorAll('#image-editor_verticalFlip')[0];
                transformBtn.click();
                transformBtn = document.querySelectorAll('#image-editor_horizontalFlip')[0];
                transformBtn.click();
                imageEditor.selectShape('shape_1');
                let drpDownBtn: any = document.getElementById('image-editor_fontFamilyBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-family.e-popup-open')[0];
                const elem: string = ul.children[0].children[1].textContent;
                ul.children[0].children[1].click();
                setTimeout(() => {}, 50);
                expect(imageEditor.activeObj.textSettings.fontFamily).toEqual(elem);
                setTimeout(() => {});
               drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_bold');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_italic');
                drpDownBtn.click();
                setTimeout(() => {});
                drpDownBtn = document.getElementById('image-editor_fontSizeBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                ul = document.querySelectorAll('.e-font-size.e-popup-open')[0];
                ul.children[0].children[1].click();
                setTimeout(function () { });
                drpDownBtn = document.getElementById('image-editor_fontColorBtn');
                drpDownBtn.click();
                setTimeout(() => {});
                (document.getElementById('image-editor_text_font') as any).ej2_instances[0].dataBind();
                ul = document.querySelector('#image-editor_fontColorBtn-popup');
                (ul.querySelectorAll('.e-tile')[5] as HTMLElement).click();
                setTimeout(() => {}, 10);
                okBtn = document.querySelectorAll('#image-editor_ok')[0];
                okBtn.click();
                done();
            }, 100);
        });
        it('Image Selection combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                setTimeout(() => {
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'move' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                    value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'nw-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                    value: {x: 1, y: 1, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'nw-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'n-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                          value: {x: -1, y: 1, isCropSelection: false }});
                    imageEditor.selectShape('shape_1');
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'n-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    let okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                    okBtn.click();
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'w-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 1, y: -1, isCropSelection: false }});
                    imageEditor.selectShape('shape_1');
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'w-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    okBtn = document.querySelectorAll('#image-editor_ok')[0];
                    okBtn.click();
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'e-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 1, y: -1, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'e-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'sw-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                        value: {x: 1, y: -1, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'sw-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 's-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                        value: {x: -1, y: -1, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 's-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'se-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                      value: {x: -1, y: -1, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'se-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'ne-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                        value: {x: -1, y: 1, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'ne-resize' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                        value: {x: 0, y: 0, isCropSelection: false }});
                    imageEditor.notify('selection', {prop: 'setDragElement', onPropertyChange: false, value: {value: 'grabbing' }});
                    imageEditor.notify('selection', {prop: 'updateActivePoint', onPropertyChange: false,
                       value: {x: 0, y: 0, isCropSelection: false }});
                    done();
                }, 600);
                imageEditor.drawImage('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg', 500, 100, 200, 80, true, 90);
            }, 200);
        });
    });
});