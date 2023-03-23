/**
 *  ImageEditor spec document
 */
 import { ImageEditor } from '../src/image-editor/index';
 import { createElement, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
 
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
         });
         afterEach(() => {
             imageEditor.destroy();
             remove(imageEditor.element);
         });
         it('Find Target', (done) => {
             imageEditor = new ImageEditor({ height: '400px', width: '700px'
             },'#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawRectangle(0, 0, 300, 200, 15, 'red', 'green');
                //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
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
                 imageEditor.drawRectangle(0, 0, 300, 200, 15, 'red', 'green');
                //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                //  expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.zoomAction(.1);
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
                 imageEditor.drawRectangle(0, 0, 300, 200, 15, 'red', 'green');
                //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                //  expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.zoomAction(.1);
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
                 imageEditor.drawRectangle(0, 0, 300, 200, 15, 'red', 'green');
                //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                //  expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.selectShape('shape_1');
                 let event: any = new KeyboardEvent('keydown', {key: 'Delete', code: 'delete'});
                 (imageEditor as any).keyDownEventHandler(event);
                 imageEditor.drawRectangle(0, 0, 300, 200, 15, 'red', 'green');
                //  expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                //  expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.selectShape('shape_2');
                 event = new KeyboardEvent('keydown', {key: 'Escape', code: 'escape'});
                 (imageEditor as any).keyDownEventHandler(event);
                 imageEditor.zoomAction(.1);
                 imageEditor.pan(true);
                 event = new KeyboardEvent('keydown', {key: 'Escape', code: 'escape'});
                 (imageEditor as any).keyDownEventHandler(event);
                 imageEditor.select('circle');
                 event = new KeyboardEvent('keydown', { key: 'Enter', code: 'enter' });
                 (imageEditor as any).keyDownEventHandler(event);
                 event = new KeyboardEvent('keydown', { key: 's', code: 's', ctrlKey: true });
                 (imageEditor as any).keyDownEventHandler(event);
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
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl.length).toEqual(6);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(180);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(270);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(180);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(0);
                 imageEditor.clearSelection();
                 imageEditor.reset();
                 expect(imageEditor.objColl.length).toEqual(0);
                 imageEditor.freeHandDraw(true);
                 expect(imageEditor.togglePen).toEqual(true);
                 imageEditor.applyPenDraw();
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
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.applyActObj();
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('');
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
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.applyActObj();
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.zoomAction(-.1);
                 expect(imageEditor.zoomFactor).toEqual(0);
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.zoomAction(-.1);
                 expect(imageEditor.zoomFactor).toEqual(0);
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
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
 
         it('onPropertyChanged', (done) => {
            imageEditor = new ImageEditor({
                cssClass : 'e-img-editor',
                height : '450px',
                width : '50%',
                theme : 'bootstrap5-dark',
                disabled : true,
            }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 expect(imageEditor.disabled).toEqual(true);
                 const imageUpload: HTMLElement = (document.querySelector('.e-image-upload') as HTMLButtonElement);
                 const btn: HTMLButtonElement = (imageUpload.children[0].children[0].children[0] as HTMLButtonElement);
                 btn.click();
                 imageEditor.toolbarTemplate = 'Zoom';
                 imageEditor.toolbarTemplateFn();
                 imageEditor.toolbar = ['ZoomIn', 'ZoomOut', 'RotateLeft', 'RotateRight'];
                 imageEditor.initToolbarItem();
                 imageEditor.createBottomToolbar ();
                 imageEditor.initShapesToolbarItem('Rectangle');
                 imageEditor.initTextToolbarItem('Rectangle');
                 imageEditor.initPenToolbarItem('Rectangle');
                 imageEditor.initZoomToolbarItem();
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
                 imageEditor.applyCurrActObj();
                 expect(imageEditor.objColl.length === 1);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18);
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.redrawActObj();
                 imageEditor.lowerCanvas.style.maxWidth = '800px';
                 imageEditor.lowerCanvas.style.maxHeight = '500px';
                 imageEditor.activeObj.activePoint.width = 100;
                 imageEditor.activeObj.activePoint.height = 100;
                 imageEditor.drawRectangle(300, 30, 300, 200, 15);
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'nw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'n-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'ne-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'w-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'e-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'sw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 's-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'se-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.currObjType.isCustomCrop = true;
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'nw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'n-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'ne-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'w-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'e-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'sw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 's-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'se-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.currObjType.isCustomCrop = false;
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'nw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'n-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'ne-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'w-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'e-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'sw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 's-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'se-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.currObjType.isCustomCrop = true;
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'nw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'n-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'ne-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'w-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'e-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'sw-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 's-resize';
                 imageEditor.updateActivePoint(500, 200);
                 imageEditor.dragElement = 'se-resize';
                 imageEditor.updateActivePoint(500, 200);
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {}, 10);
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {}, 10);
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {}, 10);
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
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {}, 10);
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
                 ul.children[0].children[4].click();
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 setTimeout(() => {});
                 let drpDownBtn: any = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 imageEditor.selectShape('shape_1');
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 imageEditor.selectShape('shape_1');
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
                 imageEditor.selectShape('shape_1');
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {}, 10);
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
                 width: '550px',
                 height: '350px',
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 let annotationBtn: any = document.querySelectorAll('#image-editor_annotationBtn')[0];
                 annotationBtn.click();
                 setTimeout(() => {});
                 let ul: any = document.querySelectorAll('#image-editor_annotationBtn-popup');
                 ul = document.querySelectorAll('#image-editor_annotationBtn-popup')[ul.length - 1];
                 ul.children[0].children[4].click();
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
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 drpDownBtn = document.getElementById('image-editor_fontStyleBtn');
                 drpDownBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('.e-font-style.e-popup-open')[0];
                 ul.children[0].children[3].click();
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
                 ul.children[0].children[4].click();
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
                 ul.children[0].children[4].click();
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
                 ul.children[0].children[4].click();
                 setTimeout(function () { });
                 imageEditor.selectShape('shape_1');
                 (document.querySelector('#image-editor_textArea') as HTMLElement).style.display = 'block';
                 (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontFamily = 'Calibri';
                 (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontWeight = 'bold';
                 (document.querySelector('#image-editor_textArea') as HTMLElement).style.fontStyle = 'italic';
                 (document.querySelector('#image-editor_textArea') as HTMLElement).dispatchEvent(mousedownEvent);
                 let event: any = new KeyboardEvent('keydown', { key: 's', code: 's', ctrlKey: false });
                 (imageEditor as any).textKeyDown(event);
                 done();
             });
         });
         it('Canvas double Click Hor Ver', (done) => {
             imageEditor = new ImageEditor({
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.rotate(90);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 50, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.rotate(90);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
                 x = (shape1.startX / ratio.width) + boundRect.left;
                 y = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 setTimeout(function () { });
                 shape1 = imageEditor.getShapeSetting('shape_1');
                 boundRect = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 ratio = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.zoomAction(.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 width: '550px',
                 height: '350px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.rotate(90);
                 imageEditor.flip('vertical');
                 imageEditor.flip('horizontal');
                 imageEditor.flip('vertical');
                 imageEditor.zoomAction(0.1);
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 imageEditor.zoomAction(0.1);
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
                 const cropBtn: any = document.querySelectorAll('#image-editor_cropBtn')[0];
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
                 let transformBtn: any = document.querySelectorAll('#image-editor_transformBtn')[0];
                 transformBtn.click();
                 setTimeout(() => {});
                 let ul: any = document.querySelectorAll('#image-editor_transformBtn-popup');
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup')[ul.length - 1];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 expect(imageEditor.degree).toEqual(90);
                 transformBtn = document.querySelectorAll('#image-editor_transformBtn')[0];
                 transformBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup');
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup')[ul.length - 1];
                 ul.children[0].children[1].click();
                 setTimeout(() => {});
                 expect(imageEditor.degree).toEqual(180);
                 transformBtn = document.querySelectorAll('#image-editor_transformBtn')[0];
                 transformBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup');
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup')[ul.length - 1];
                 ul.children[0].children[0].click();
                 setTimeout(() => {});
                 expect(imageEditor.degree).toEqual(90);
                 done();
             }, 100);
         });
 
         it('Transform Click for Flip', (done) => {
             imageEditor = new ImageEditor({
                height : '450px'
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 let transformBtn: any = document.querySelectorAll('#image-editor_transformBtn')[0];
                 transformBtn.click();
                 setTimeout(() => {});
                 let ul: any = document.querySelectorAll('#image-editor_transformBtn-popup');
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup')[ul.length - 1];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 transformBtn = document.querySelectorAll('#image-editor_transformBtn')[0];
                 transformBtn.click();
                 setTimeout(() => {});
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup');
                 ul = document.querySelectorAll('#image-editor_transformBtn-popup')[ul.length - 1];
                 ul.children[0].children[3].click();
                 setTimeout(() => {});
                 expect(imageEditor.currFlipState).toEqual('vertical');
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.drawRectangle(0, 0);
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
                 imageEditor.drawRectangle(0, 0);
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
                 imageEditor.drawRectangle(0, 0);
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
                 imageEditor.drawRectangle(0, 0);
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
                 imageEditor.drawText(200, 200, 'Syncfusion', 'Arial', 20, true, true);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 imageEditor.zoomAction(0.1);
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
                 ul.children[0].children[4].click();
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
                 let ratio: any = imageEditor.calcRatio();
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.drawText(753.6052631578948, 50, 'Syncfusion', 'Arial', 60, true, true, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(2);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.49999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.49999999999994);
                expect(imageEditor.objColl[1].shape).toEqual('text');
                expect(imageEditor.objColl[1].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[1].activePoint.startY).toEqual(17.932031249999977);
                expect(imageEditor.objColl[1].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[1].activePoint.endY).toEqual(286.49999999999994);
                done();
            }, 100);
        });
        // Need to change value from here
        it('180 Degree Combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.drawText(753.6052631578948, 50, 'Syncfusion', 'Arial', 60, true, true, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(2);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789474);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                expect(imageEditor.objColl[1].shape).toEqual('text');
                expect(imageEditor.objColl[1].activePoint.startX).toEqual(204.5526315789474);
                expect(imageEditor.objColl[1].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[1].activePoint.endX).toEqual(557.9315378289474);
                expect(imageEditor.objColl[1].activePoint.endY).toEqual(251);
                done();
            }, 100);
        });
        it('270 Degree Combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.drawText(753.6052631578948, 50, 'Syncfusion', 'Arial', 60, true, true, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(2);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000021);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000001);
                expect(imageEditor.objColl[1].shape).toEqual('text');
                expect(imageEditor.objColl[1].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[1].activePoint.startY).toEqual(14.500000000000021);
                expect(imageEditor.objColl[1].activePoint.endX).toEqual(364.12);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.drawText(753.6052631578948, 50, 'Syncfusion', 'Arial', 60, true, true, 'red');
                expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(2);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
                expect(imageEditor.objColl[1].shape).toEqual('text');
                expect(imageEditor.objColl[1].activePoint.startX).toEqual(209.06846217105254);
                expect(imageEditor.objColl[1].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[1].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[1].activePoint.endY).toEqual(125.00000000000003);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75.99999999999997);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(269.804);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(227.392);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(62.69999999999999);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(83.59999999999994);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.2);
                expect(imageEditor.destLeft).toEqual(259.468);
                expect(imageEditor.destTop).toEqual(-12.699999999999989);
                expect(imageEditor.destWidth).toEqual(248.064);
                expect(imageEditor.destHeight).toEqual(326.4);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(68.40000000000003);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(91.19999999999999);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(269.804);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(227.392);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(62.7000000000000459);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(83.59999999999994);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(57.00000000000006);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75.99999999999997);
                done();
            }, 100);
        });
        it('180 Degree Rotate With Zoom', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(186.6578947368421);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(393.6842105263158);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(82.49999999999994);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.2);
                expect(imageEditor.destLeft).toEqual(168.76315789473685);
                expect(imageEditor.destTop).toEqual(-12.699999999999989);
                expect(imageEditor.destWidth).toEqual(429.4736842105263);
                expect(imageEditor.destHeight).toEqual(326.4);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(120);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(89.99999999999997);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(186.6578947368421);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(393.6842105263158);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(82.49999999999994);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(74.99999999999997);
                done();
            }, 100);
        });
        it('270 Degree Rotate With Zoom', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', {x: 553.6052631578948, y: 50}, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(269.804);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(227.392);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(62.700000000000045);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(83.59999999999998);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.2);
                expect(imageEditor.destLeft).toEqual(259.468);
                expect(imageEditor.destTop).toEqual(-12.699999999999989);
                expect(imageEditor.destWidth).toEqual(248.064);
                expect(imageEditor.destHeight).toEqual(326.4);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(68.40000000000009);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(91.19999999999999);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(269.804);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(227.392);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(62.700000000000045);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(83.59999999999998);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(186.6578947368421);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(393.6842105263158);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(82.5);
                imageEditor.zoomAction(0.1);
                expect(imageEditor.zoomFactor).toEqual(0.2);
                expect(imageEditor.destLeft).toEqual(168.76315789473685);
                expect(imageEditor.destTop).toEqual(-12.699999999999989);
                expect(imageEditor.destWidth).toEqual(429.4736842105263);
                expect(imageEditor.destHeight).toEqual(326.4);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(120);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(90);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0.1);
                expect(imageEditor.destLeft).toEqual(186.6578947368421);
                expect(imageEditor.destTop).toEqual(0.9000000000000057);
                expect(imageEditor.destWidth).toEqual(393.6842105263158);
                expect(imageEditor.destHeight).toEqual(299.2);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(110);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(82.5);
                imageEditor.zoomAction(-0.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75.99999999999997);
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                expect(imageEditor.destLeft).toEqual(247.50000000000003);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(271.99999999999994);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(410.9950970164824);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(235.62413936991447);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(491.8630294179011);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(343.4480492384727);
                done();
            }, 100);
        });
        it('180 Degree Rotate With Crop', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                expect(imageEditor.destLeft).toEqual(247.5);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(272);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(194.10823264386647);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(177.48832684824902);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(300);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.8657587548638);
                done();
            }, 100);
        });
        it('270 Degree Rotate With Crop', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(57);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(76);
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                expect(imageEditor.destLeft).toEqual(247.5);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(272);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(275.1369705820989);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(-42.44804923847272);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(356.00490298351764);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(65.37586063008553);
                done();
            }, 100);
        });
        it('360 or 0 Degree Rotate With Crop', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.width).toEqual(100);
                expect(imageEditor.objColl[0].activePoint.height).toEqual(75);
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                expect(imageEditor.destLeft).toEqual(247.5);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(272);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(467.05519148064707);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(44.13424124513622);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(572.8917673561335);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(123.51167315175101);
                done();
            }, 100);
        });
    });
    // Changed till here
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88 );
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.49999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.49999999999994);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.49999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.49999999999994);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[2]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000057);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000003);
                done();
            }, 100);
        });
        it('90 Degree Rotate With Vertical and Horizontal Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.49999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.49999999999994);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000057);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000003);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
                expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000057);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000003);
                done();
            }, 100);
        });
        it('180 Degree Rotate With Horizontal and Vertical Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789474);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[3]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
                done();
            }, 100);
        });
        it('180 Degree Rotate With Vertical and Horizontal Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789474);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789474);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual('vertical');
                expect(imageEditor.rotateFlipColl[3]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
                done();
            }, 100);
        });
        it('270 Degree Rotate With Horizontal and Vertical Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000021);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000001);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual(90);
                expect(imageEditor.rotateFlipColl[3]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000021);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000001);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual(90);
                expect(imageEditor.rotateFlipColl[3]).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[4]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.5);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.5);
                done();
            }, 100);
        });
        it('270 Degree Rotate With Vertical and Horizontal Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000021);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000001);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual(90);
                expect(imageEditor.rotateFlipColl[3]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.5);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.5);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                expect(imageEditor.rotateFlipColl[2]).toEqual(90);
                expect(imageEditor.rotateFlipColl[3]).toEqual('vertical');
                expect(imageEditor.rotateFlipColl[4]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.5);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.5);
                done();
            }, 100);
        });
        it('360 or 0 Degree Rotate With Horizontal and Vertical Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789475);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789475);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789475);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(175.99999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789475);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(250.99999999999997);
                done();
            }, 100);
        });
        it('360 or 0 Degree Rotate With Vertical and Horizontal Flip', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526 );
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual('vertical');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(175.99999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(250.99999999999997);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual('vertical')
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.55263157894737);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(175.99999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(250.99999999999997);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.flip('Horizontal');
                expect(imageEditor.currFlipState).toEqual('horizontal');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(205);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(50);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789475);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(187);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(40);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(297);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(122);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.2);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(169);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(30);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(289);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(120);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(187);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(40);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(297);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(122);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(205);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(50);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(305);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(125);
                imageEditor.flip('Vertical');
                expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
                expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(205);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(176);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(305);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(251);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(187 );
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(179);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(297 );
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(261);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.2);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(169);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(181);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(289);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(271);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(187);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(179);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(297 );
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(261);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(205);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(176);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(305);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(251);
                done();
            }, 100);
        });
        it('Vertical and Horizontal Flip With Zoom', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.flip('Vertical');
                expect(imageEditor.currFlipState).toEqual('vertical');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(470.3421052631578);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(179);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(580.3421052631578);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(261.04999999999995);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.2);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(478.2368421052631);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(181.1);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(598.2368421052631);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(271.09999999999997);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(470.3421052631578);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(179);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(580.3421052631578);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(261.04999999999995);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(250.99999999999997);
                imageEditor.flip('Horizontal');
                expect(imageEditor.rotateFlipColl[0]).toEqual('vertical');
                expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.55263157894737);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474 );
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(250.99999999999997);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(187);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(179);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(297);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(261.04999999999995);
                imageEditor.zoomAction(.1);
                expect(imageEditor.zoomFactor).toEqual(.2);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(169);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(181);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(289);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(271);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(.1);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(187);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(179);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(297);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(261.04999999999995);
                imageEditor.zoomAction(-.1);
                expect(imageEditor.zoomFactor).toEqual(0);
                expect(Math.round(imageEditor.objColl[0].activePoint.startX)).toEqual(205);
                expect(Math.round(imageEditor.objColl[0].activePoint.startY)).toEqual(176);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(305);
                expect(Math.round(imageEditor.objColl[0].activePoint.endY)).toEqual(251);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.flip('Horizontal');
                expect(imageEditor.currFlipState).toEqual('horizontal');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789475);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789475);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                expect(imageEditor.destLeft).toEqual(247.5);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(272);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(194.1082326438666);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(44.13424124513619);
                expect(Math.round(imageEditor.objColl[0].activePoint.endX)).toEqual(300);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(123.51167315175098);
                done();
            }, 100);
        });
        it('Vertical Flip With Crop', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.flip('Vertical');
                expect(imageEditor.currFlipState).toEqual('vertical');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.select('square');
                expect(imageEditor.activeObj.shape).toEqual('crop-square');
                imageEditor.crop();
                expect(imageEditor.destLeft).toEqual(247.5);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(272);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(467.05519148064707);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(177.48832684824902);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(572.8917673561335);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(256.8657587548638);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.flip('Horizontal');
                expect(imageEditor.currFlipState).toEqual('horizontal');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789475);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789475);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000087);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000009);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210525);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210525);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.4999999999999);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.4999999999999);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789475);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789475);
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
                imageEditor.drawShape('rectangle', 15, 'red', 'white', { x: 553.6052631578948, y: 50 }, 100, 75);
                expect(imageEditor.activeObj.shape).toEqual('rectangle');
                imageEditor.applyActObj();
                expect(imageEditor.objColl.length).toEqual(1);
                imageEditor.flip('Vertical');
                expect(imageEditor.currFlipState).toEqual('vertical');
                expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(90);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(307.12);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(210.49999999999997);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(364.12);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(286.49999999999994);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(180);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(204.5526315789474);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(50.00000000000003);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(304.5526315789474);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(125.00000000000003);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(270);
                expect(imageEditor.destLeft).toEqual(280.14);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(206.72);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(402.88);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(14.500000000000021);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(459.88);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(90.50000000000001);
                imageEditor.rotate(90);
                expect(imageEditor.degree).toEqual(0);
                expect(imageEditor.destLeft).toEqual(204.55263157894737);
                expect(imageEditor.destTop).toEqual(14.5);
                expect(imageEditor.destWidth).toEqual(357.89473684210526);
                expect(imageEditor.destHeight).toEqual(272);
                expect(imageEditor.objColl[0].activePoint.startX).toEqual(462.4473684210526);
                expect(imageEditor.objColl[0].activePoint.startY).toEqual(176);
                expect(imageEditor.objColl[0].activePoint.endX).toEqual(562.4473684210526);
                expect(imageEditor.objColl[0].activePoint.endY).toEqual(251);
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
                 imageEditor.drawShape('ellipse')
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                 expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.select('3:2');
                 expect(imageEditor.activeObj.shape).toEqual('crop-3:2');
                 imageEditor.crop();
                 expect(imageEditor.currSelectionPoint.shape).toEqual('crop-3:2');
                 imageEditor.finetuneImage('Brightness', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.finetuneImage('Contrast', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
                done();
            }, 100);
        });
        it('Text Combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                 imageEditor.drawText(imageEditor.destLeft, imageEditor.destTop, 'Syncfusion', 'Arial', 20, true, false, 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startX).toEqual(imageEditor.destLeft);
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startY).toEqual(imageEditor.destTop);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                 expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.select('circle');
                 expect(imageEditor.activeObj.shape).toEqual('crop-circle');
                 imageEditor.crop();
                 expect(imageEditor.currSelectionPoint.shape).toEqual('crop-circle');
                 imageEditor.finetuneImage('Brightness', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.finetuneImage('Contrast', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
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
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(180);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(270);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(0);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-90);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-180);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-270);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(0);
                 expect(imageEditor.rotateFlipColl.length).toEqual(0);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(180);
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                 expect(imageEditor.rotateFlipColl[1]).toEqual(90);
                 expect(imageEditor.rotateFlipColl[2]).toEqual('horizontal');
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.2);
                 imageEditor.zoomAction(-.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.select('4:3');
                 expect(imageEditor.activeObj.shape).toEqual('crop-4:3');
                 imageEditor.crop();
                 expect(imageEditor.currSelectionPoint.shape).toEqual('crop-4:3');
                 imageEditor.drawText(imageEditor.destLeft, imageEditor.destTop, 'Syncfusion', 'Arial', 20, true, false, 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startX).toEqual(imageEditor.destLeft);
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startY).toEqual(imageEditor.destTop);
                 imageEditor.applyActObj();
                 imageEditor.drawShape('line')
                 expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl.length).toEqual(2);
                 expect(imageEditor.objColl[0].shape).toEqual('text');
                 expect(imageEditor.objColl[1].shape).toEqual('line');
                 imageEditor.finetuneImage('Brightness', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.finetuneImage('Contrast', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.flip('Horizontal');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
                 expect(imageEditor.rotateFlipColl[0]).toEqual('horizontal');
                 expect(imageEditor.rotateFlipColl[1]).toEqual('vertical');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(180);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(270);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(0);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-90);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-180);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-270);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(0);
                 expect(imageEditor.rotateFlipColl.length).toEqual(2);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(180);
                 expect(imageEditor.rotateFlipColl.length).toEqual(4);
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(0.2);
                 imageEditor.zoomAction(-.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.select('5:4');
                 expect(imageEditor.activeObj.shape).toEqual('crop-5:4');
                 imageEditor.crop();
                 expect(imageEditor.currSelectionPoint.shape).toEqual('crop-5:4');
                 imageEditor.drawText(imageEditor.destLeft, imageEditor.destTop, 'Syncfusion', 'Arial', 20, true, false, 'green');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].keyHistory).toEqual('Syncfusion');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startX).toEqual(imageEditor.destLeft);
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].activePoint.startY).toEqual(imageEditor.destTop);
                 imageEditor.applyActObj();
                 imageEditor.drawShape('line')
                 expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl.length).toEqual(2);
                 expect(imageEditor.objColl[0].shape).toEqual('text');
                 expect(imageEditor.objColl[1].shape).toEqual('line');
                 imageEditor.finetuneImage('Brightness', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.finetuneImage('Contrast', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
                done();
            }, 100);
        });
        it('Zoom Combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                 imageEditor.select('square');
                 expect(imageEditor.activeObj.shape).toEqual('crop-square');
                 imageEditor.zoomAction(0.1);
                 expect(imageEditor.zoomFactor).toEqual(0.1);
                 imageEditor.crop();
                 expect(imageEditor.currSelectionPoint.shape).toEqual('crop-square');
                 imageEditor.drawShape('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                 expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                 imageEditor.finetuneImage('Brightness', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.finetuneImage('Contrast', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
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
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 expect(imageEditor.rotateFlipColl[0]).toEqual(90);
                 expect(imageEditor.rotateFlipColl[1]).toEqual('horizontal');
                 imageEditor.drawShape('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                 imageEditor.finetuneImage('Brightness', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.finetuneImage('Contrast', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
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
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Hue', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Saturation', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Exposure', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Opacity', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Blur', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
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
                expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(140%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Cold');
                expect(imageEditor.canvasFilter).toEqual('brightness(90%) contrast(150%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Warm');
                expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(140%) opacity(1) blur(0px) sepia(25%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Grayscale');
                expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(100%) invert(0%)');
                imageEditor.applyImageFilter('Sepia');
                expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(100%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
                imageEditor.applyImageFilter('Default');
                expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
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
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Contrast', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Hue', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Saturation', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Exposure', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Opacity', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.finetuneImage('Blur', 50);
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Chrome');
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(210%) opacity(1) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Cold');
                expect(imageEditor.canvasFilter).toEqual('brightness(112.5%) contrast(187.5%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Warm');
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(210%) opacity(1) blur(3px) sepia(25%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Grayscale');
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(0%) grayscale(100%) invert(0%)');
                imageEditor.applyImageFilter('Sepia');
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(100%) grayscale(0%) invert(0%)');
                imageEditor.applyImageFilter('Invert');
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(0%) grayscale(0%) invert(100%)');
                imageEditor.applyImageFilter('Default');
                expect(imageEditor.canvasFilter).toEqual('brightness(1.25) contrast(125%) hue-rotate(150deg) saturate(150%) opacity(1) blur(3px) sepia(0%) grayscale(0%) invert(0%)');
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
                 imageEditor.zoomAction(0.5);
                 expect(imageEditor.zoomFactor).toEqual(0.5);
                 imageEditor.drawShape('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                 imageEditor.applyImageFilter('Grayscale');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(100%) invert(0%)');
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
                 expect(imageEditor.canvasFilter).toEqual('brightness(1.5) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('ellipse');
                 imageEditor.applyImageFilter('Invert');
                 expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(0deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(100%)');
                 done();
            }, 100);
        });
        it('Shape/crop combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                 imageEditor.drawShape('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                 imageEditor.select('square');
                 expect(imageEditor.activeObj.shape).toEqual('crop-square');
                 imageEditor.crop();
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-90);
                 imageEditor.select('3:2');
                 imageEditor.crop();
                 imageEditor.select('custom', 100, 100);
                 imageEditor.crop();
                 done();
            }, 100);
        });
        it('Rotate/shape combination', (done) => {
            imageEditor = new ImageEditor({
                height: '350px'
            }, '#image-editor');
            imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
            setTimeout(() => {
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('line');
                 imageEditor.select('square');
                 expect(imageEditor.activeObj.shape).toEqual('crop-square');
                 imageEditor.crop();
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(0);
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
                 expect(imageEditor.degree).toEqual(-90);
                 imageEditor.drawShape('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl[0].shape).toEqual('rectangle');
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.zoomAction(0.5);
                 expect(imageEditor.zoomFactor).toEqual(0.5);
                 imageEditor.finetuneImage('Hue', 50);
                 expect(imageEditor.canvasFilter).toEqual('brightness(1) contrast(100%) hue-rotate(150deg) saturate(100%) opacity(1) blur(0px) sepia(0%) grayscale(0%) invert(0%)');
                 imageEditor.zoomAction(-0.5);
                 expect(imageEditor.zoomFactor).toEqual(0);
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
                 expect(imageEditor.degree).toEqual(90);
                 const cropBtn: any = document.querySelectorAll('#image-editor_cropBtn')[0];
                 cropBtn.click();
                 setTimeout(() => {});
                 let ul: any = document.querySelectorAll('#image-editor_cropBtn-popup');
                 ul = document.querySelectorAll('#image-editor_cropBtn-popup')[ul.length - 1];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 expect(imageEditor.activeObj.shape).toEqual('crop-square');
                 imageEditor.crop();
                 imageEditor.zoomAction(0.3);
                 expect(imageEditor.zoomFactor).toEqual(0.3);
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
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(180);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(270);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(0);
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 setTimeout(function () { });
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
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
                 imageEditor.drawText(1, 1, 'Syncfusion');
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].shape).toEqual('text');
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-90);
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(-180);
                 expect(imageEditor.objColl[imageEditor.objColl.length - 1].textSettings.fontSize).toEqual(23.852007540755114);
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.zoomAction(0.3);
                 expect(imageEditor.zoomFactor).toEqual(0.3);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
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
                 imageEditor.zoomAction(.10);
                 expect(imageEditor.zoomFactor).toEqual(.10);
                 const okBtn: any = document.querySelectorAll('#image-editor_ok')[0];
                 if (!isNullOrUndefined(okBtn)) {okBtn.click(); }
                 const cropBtn: any = document.querySelectorAll('#image-editor_cropBtn')[0];
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.select('4:3');
                 imageEditor.crop();
                 expect(imageEditor.currSelectionPoint.shape).toEqual('crop-4:3');
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
                 imageEditor.currFlipState = "";
                 setTimeout(function () { });
                 (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                 imageEditor.freeHandDraw(true);
                 imageEditor.freehandRedraw(imageEditor.lowerContext, points);
                 imageEditor.flip('Horizontal');
                 imageEditor.zoomAction(.1);
                 expect(imageEditor.zoomFactor).toEqual(.1);
                 expect(imageEditor.pointColl[0].points[0].x).toEqual(24.29062769528099);
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
                 var withoutZoom = imageEditor.destLeft;
                 imageEditor.zoomAction(.10);
                 var firstZoom = imageEditor.destLeft;
                 imageEditor.zoomAction(-.10);
                 var secondZoom = imageEditor.destLeft;
                 imageEditor.zoomAction(.10);
                 imageEditor.zoomAction(-.10);
                 expect(withoutZoom).toEqual(imageEditor.destLeft);
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
                 imageEditor.refreshActiveObj()
                 imageEditor.activeObj.strokeSettings.strokeColor = "black";
                 imageEditor.penStrokeWidth = 5;
                 imageEditor.currFlipState = "";
                 setTimeout(function () { });
                 (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                 imageEditor.freeHandDraw(true);
                 imageEditor.freehandRedraw(imageEditor.lowerContext, points);
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.flip('horizontal');
                 imageEditor.rotate(-90);
                 expect(imageEditor.degree).toEqual(0);
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.flip('vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
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
                 imageEditor.currFlipState = "";
                 setTimeout(function () { });
                 (<HTMLCanvasElement>document.getElementById(imageEditor.element.id + '_upperCanvas')).dispatchEvent(mouseupEvent);
                 imageEditor.freeHandDraw(true);
                 imageEditor.freehandRedraw(imageEditor.lowerContext, points);
                 imageEditor.select("3:2");
                 imageEditor.destLeft += 20;
                 imageEditor.destTop -= 0;
                 imageEditor.drawPannImage({x: -10, y: 0});
                 expect(imageEditor.pointColl[0].points[0].x).toEqual(700.0539748224719);
                 /* resize the selection */
                 imageEditor.activeObj.activePoint.startX = 500;
                 imageEditor.activeObj.activePoint.startY = 50;
                 imageEditor.activeObj.activePoint.width = imageEditor.activeObj.activePoint.endX - imageEditor.activeObj.activePoint.startX;
                 imageEditor.activeObj.activePoint.height = imageEditor.activeObj.activePoint.endY - imageEditor.activeObj.activePoint.startY;
                 imageEditor.upperContext.clearRect(0,0,imageEditor.upperCanvas.width, imageEditor.upperCanvas.height);
                 imageEditor.drawObject("duplicate");
                 expect(imageEditor.currFlipState).toEqual("");
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
                 imageEditor.destLeft += 10;
                 imageEditor.destTop -= 0;
                 imageEditor.drawPannImage({x: -10, y: 0});
                 imageEditor.select('custom');
                 // right side pan
                 imageEditor.destLeft -= 50;
                 imageEditor.destTop -= 0;
                 imageEditor.drawPannImage({x: 50, y: 0});
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.zoomAction(.3);
                 expect(imageEditor.zoomFactor).toEqual(.3);
                 var destLeft = imageEditor.destLeft;
                 imageEditor.destLeft += 20;
                 imageEditor.destTop -= 0;
                 imageEditor.drawPannImage({x: -20, y: 0});
                 expect(imageEditor.destLeft).toBeGreaterThan(destLeft);
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
                 expect(imageEditor.currFlipState).toEqual('horizontal');
                 imageEditor.flip('vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
                 imageEditor.zoomAction(.3);
                 expect(imageEditor.zoomFactor).toEqual(.3);
                 var destLeft = imageEditor.destLeft;
                 imageEditor.destLeft += 20;
                 imageEditor.destTop -= 0;
                 imageEditor.drawPannImage({x: -20, y: 0});
                 expect(imageEditor.destLeft).toBeGreaterThan(destLeft);
                 done();
            }, 100);
        });
    });
});

 