/**
 *  ImageEditor spec document
 */
 import { ImageEditor } from '../src/image-editor/index';
 import { createElement, remove } from '@syncfusion/ej2-base';
 
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
     wrapper.style.width = '99vw';
     wrapper.style.height = '97vh';
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
                 // expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 // expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.zoom(.1);
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
                 // expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 // expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.zoom(.1);
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
                 // expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 // expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.selectShape('shape_1');
                 let event: any = new KeyboardEvent('keydown', {key: 'Delete', code: 'delete'});
                 (imageEditor as any).keyDownEventHandler(event);
                 imageEditor.drawRectangle(0, 0, 300, 200, 15, 'red', 'green');
                 // expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 // expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.selectShape('shape_2');
                 event = new KeyboardEvent('keydown', {key: 'Escape', code: 'escape'});
                 (imageEditor as any).keyDownEventHandler(event);
                 imageEditor.zoom(.1);
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
             },'#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 // expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 // expect(imageEditor.objColl.length).toEqual(1);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 // expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 // expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 // expect(imageEditor.activeObj.shape).toEqual('text');
                 // expect(imageEditor.activeObj.keyHistory).toEqual('Syncfusion');
                 imageEditor.rotate(90);
                 expect(imageEditor.degree).toEqual(90);
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 expect(imageEditor.activeObj.keyHistory).toEqual('Syncfusion');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl.length).toEqual(6);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
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
                 done();
             }, 100);
         });
  
         it('Flip with Annotation', (done) => {
             imageEditor = new ImageEditor({
             },'#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.activeObj.shape).toEqual('text');
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
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
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
             },'#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.applyActObj();
                 imageEditor.zoom(.1);
                 expect(imageEditor.factor).toEqual(1.4296264326950867);
                 imageEditor.zoom(-.1);
                 expect(imageEditor.factor).toEqual(1);
                 imageEditor.zoom(.1);
                 expect(imageEditor.factor).toEqual(1.4296264326950867);
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.zoom(-.1);
                 expect(imageEditor.factor).toEqual(1);
                 imageEditor.zoom(.1);
                 expect(imageEditor.factor).toEqual(1.4296264326950867);
                 imageEditor.pan(true);
                 expect(imageEditor.togglePan).toEqual(true);
                 imageEditor.reset();
                 done();
             }, 100);
         });
  
         it('Selection with Crop', (done) => {
             imageEditor = new ImageEditor({
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
                 height : '50%',
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyCurrActObj();
                 expect(imageEditor.objColl.length === 1);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18);
                 expect(imageEditor.activeObj.shape).toEqual('ellipse');
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
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.display = 'block';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontFamily = 'Calibri';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontWeight = 'bold';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontStyle = 'italic';
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
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.display = 'block';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontFamily = 'Calibri';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontWeight = 'bold';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontStyle = 'italic';
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
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.display = 'block';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontFamily = 'Calibri';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontWeight = 'bold';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontStyle = 'italic';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).dispatchEvent(mousedownEvent);
                 imageEditor.rotate(270);
                 imageEditor.flip('vertical');
                 imageEditor.selectShape('shape_1');
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.display = 'block';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontFamily = 'Calibri';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontWeight = 'bold';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontStyle = 'italic';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).dispatchEvent(mousedownEvent);
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
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.display = 'block';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontFamily = 'Calibri';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontWeight = 'bold';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).style.fontStyle = 'italic';
                 (document.querySelector('#image-editor_textBox') as HTMLElement).dispatchEvent(mousedownEvent);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 50, y + 50, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('horizontal');
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
                 let shape1: any = imageEditor.getShapeSetting('shape_1');
                 let boundRect: any = (document.querySelector('#image-editor_upperCanvas') as HTMLElement).getBoundingClientRect();
                 let ratio: any = imageEditor.calcRatio();
                 let x: any = (shape1.startX / ratio.width) + boundRect.left;
                 let y: any = (shape1.startY / ratio.height) + boundRect.top;
                 imageEditor.selectShape('shape_1');
                 dblClickEvent.initMouseEvent('dblclick', true, true, window, 0, 0, 0, x + 10, y + 10, false, false, false, false, 0, null);
                 (document.querySelector('#image-editor_upperCanvas') as HTMLElement).dispatchEvent(dblClickEvent);
                 imageEditor.flip('vertical');
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
                 imageEditor.zoom(0.1);
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.zoom(0.1);
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 const cropBtn: any = document.querySelectorAll('#image-editor_cropBtn')[0];
                 cropBtn.click();
                 setTimeout(() => {});
                 let ul: any = document.querySelectorAll('#image-editor_cropBtn-popup');
                 ul = document.querySelectorAll('#image-editor_cropBtn-popup')[ul.length - 1];
                 ul.children[0].children[2].click();
                 setTimeout(() => {});
                 expect(imageEditor.activeObj.shape).toEqual('crop-square');
                 const cancelBtn: any = document.querySelectorAll('#image-editor_cancel')[0];
                 cancelBtn.click();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
 
         it('Transform Click for Rotate', (done) => {
             imageEditor = new ImageEditor({
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('custom');
                 imageEditor.crop();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Rotate and Crop', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('custom');
                 setTimeout(() => {});
                 imageEditor.rotate(180);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip and Crop', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.flip('horizontal');
                 imageEditor.select('custom', 100, 100);
                 imageEditor.crop();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Crop Canvas', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.flip('horizontal');
                 imageEditor.select('canvas', 100, 100, 100, 100);
                 imageEditor.crop();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Crop Circle', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.flip('horizontal');
                 imageEditor.select('circle', 100, 100, 100, 100);
                 imageEditor.crop();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Zoom and Export', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.zoom(0.1);
                 imageEditor.export();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Rotate, Zoom and Crop', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.rotate(90);
                 imageEditor.zoom(0.1);
                 imageEditor.select('circle');
                 imageEditor.crop();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip, Zoom and Crop', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.flip('horizontal');
                 imageEditor.zoom(0.1);
                 imageEditor.select('circle');
                 imageEditor.crop();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Shape and Export', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle();
                 setTimeout(() => {});
                 imageEditor.export();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Shape, Zoom and Export', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle();
                 setTimeout(() => {});
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 imageEditor.export();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Freehand draw and Export', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.freeHandDraw(true);
                 setTimeout(() => {});
                 imageEditor.export();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Shape Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle(0, 0);
                 imageEditor.selectShape('shape_1');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Shape Delete', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle(0, 0);
                 imageEditor.drawRectangle(300, 300);
                 imageEditor.deleteShape('shape_1');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Get Shape Setting', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle(0, 0);
                 imageEditor.getShapeSetting('shape_1');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Get Shape Settings', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawText(200, 200, 'Syncfusion', 'Arial', 20, true, true);
                 setTimeout(() => {});
                 imageEditor.getShapeSettings();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Zoom after Rotate', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.rotate(90);
                 setTimeout(() => {});
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Zoom after custom Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('custom');
                 setTimeout(() => {});
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Zoom after circle Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('circle');
                 setTimeout(() => {});
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Rotate after zoom', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 imageEditor.rotate(360);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip after zoom', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 imageEditor.flip('horizontal');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Rotate after custom Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('custom');
                 setTimeout(() => {});
                 imageEditor.rotate(90);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Rotate after circle Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('circle');
                 setTimeout(() => {});
                 imageEditor.rotate(90);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip after custom Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('custom');
                 setTimeout(() => {});
                 imageEditor.flip('horizontal');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip after circle Select', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.select('circle');
                 setTimeout(() => {});
                 imageEditor.flip('horizontal');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip with Shape', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle();
                 setTimeout(() => {});
                 imageEditor.flip('horizontal');
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Flip, Zoom with Shape', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.drawRectangle();
                 setTimeout(() => {});
                 imageEditor.flip('horizontal');
                 setTimeout(() => {});
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 imageEditor.drawRectangle();
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Freehand Draw', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 imageEditor.freeHandDraw(false);
                 setTimeout(() => {});
                 imageEditor.zoom(0.1);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Open using ImageData', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
                 const imageData: any = imageEditor.getImageData();
                 setTimeout(() => {});
                 imageEditor.open(imageData);
                 setTimeout(() => {});
                 done();
             }, 100);
         });
         it('Methods for coverage', (done) => {
             imageEditor = new ImageEditor({
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.canUndo();
                 imageEditor.canRedo();
                 imageEditor.clear();
                 imageEditor.draw('hai', 'arial', 12);
                 imageEditor.getBlob();
                 imageEditor.isEmpty();
                 imageEditor.undo();
                 imageEditor.redo();
                 imageEditor.saveAsBlob();
                 imageEditor.save();
                 imageEditor.load();
                 imageEditor.getLocalData();
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
             }, '#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.lowerCanvas.style.maxWidth = '1000px';
                 imageEditor.lowerCanvas.style.maxHeight = '600px';
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
 });
 