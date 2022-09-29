/**
 *  ImageEditor spec document
 */
import { ImageEditor } from '../src/image-editor/index';
import { createElement } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';

describe('ImageEditor', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });
 
    let imageEditor: any;
    const wrapper: HTMLInputElement = createElement('div', { className: 'wrapper' }) as HTMLInputElement;
    wrapper.style.width = '99vw';
    wrapper.style.height = '97vh';
    const element: HTMLInputElement = wrapper.appendChild(createElement('div', { id: 'image-editor', className: 'e-image-editor' }) as HTMLInputElement);
 
     describe('Dom', () => {
         beforeEach((): void => {
             document.body.appendChild(element);
         });
         afterEach(() => {
             imageEditor.destroy();
         });
 
         it('Rotate with Annotation', (done) => {
             imageEditor = new ImageEditor({
             },'#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                 imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 expect(imageEditor.activeObj.keyHistory).toEqual('Syncfusion');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.applyActObj();
                 expect(imageEditor.objColl.length).toEqual(2);
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('circle');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
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
                 expect(imageEditor.activeObj.shape).toEqual('circle');
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
                 imageEditor.freeHandDraw(true);
                 expect(imageEditor.togglePen).toEqual(true);
                 imageEditor.applyPenDraw();
                 imageEditor.destroy();
                 done();
             }, 1000)
         });
 
         it('Flip with Annotation', (done) => {
             imageEditor = new ImageEditor({
             },'#image-editor');
             imageEditor.open('https://www.shutterstock.com/image-photo/linked-together-life-cropped-shot-600w-2149264221.jpg');
             setTimeout(() => {
                imageEditor.drawText(100, 100, 'Syncfusion', 'Arial', 70, true, true, '#40e040');
                 expect(imageEditor.activeObj.shape).toEqual('text');
                 imageEditor.drawRectangle(200, 250, 300, 200, 15, 'red', 'green');
                 expect(imageEditor.activeObj.shape).toEqual('rectangle');
                 imageEditor.drawEllipse(300, 150, 300, 150, 18, 'blue', 'white');
                 expect(imageEditor.activeObj.shape).toEqual('circle');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
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
                 expect(imageEditor.activeObj.shape).toEqual('circle');
                 imageEditor.drawLine(100, 300, 300, 100, 20, 'red');
                 expect(imageEditor.activeObj.shape).toEqual('line');
                 imageEditor.flip('Horizontal');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('vertical');
                 imageEditor.flip('Vertical');
                 expect(imageEditor.currFlipState).toEqual('');
                 imageEditor.theme = 'bootstrap5-dark'
                 done();
             }, 1000)
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
                 expect(imageEditor.activeObj.shape).toEqual('circle');
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
                 expect(imageEditor.activeObj.shape).toEqual('circle');
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
             }, 1000)
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
                 imageEditor.enabled = false;
                 done();
             }, 1000);
         });
     });
 });