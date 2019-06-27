import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let barcode: BarcodeGenerator;
let ele: HTMLElement;   
describe('Barcode Control', () => {
    describe('Checking the general rendering of bar code', () => {
        
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('Checking background color of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                backgroundColor: 'red',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('rendering of bar code with widen width', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '500px', height: '150px',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('rendering of bar code with widen width', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking of invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '500px', height: '150px',
                type: 'Code39',
                value: 'BAR~CODE',
            });
            barcode.appendTo('#barcode4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking of invalid character', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the rendering of larger barcode value', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode5' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '300px', height: '150px',
                type: 'Code39',
                value: 'BARCODEBARCODE',
            });
            barcode.appendTo('#barcode5');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the rendering of larger barcode value', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the rendering of fore color of the display text', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '300px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                value: 'BARCODEBARCODE',
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the rendering of fore color of the display text', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the text property of the  display text of the bar code ', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode7' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '300px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD' },
                value: 'BARCODEBARCODE',
            });
            barcode.appendTo('#barcode7');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the text property of the  display text of the bar code ', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the visibility property of the  display text of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode8' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '300px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD', visibility: false },
                value: 'BARCODEBARCODE',
            });
            barcode.appendTo('#barcode8');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the visibility property of the  display text of the bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the font style property of the  display text of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode10' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD', font: 'Bold' },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode10');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the font style property of the  display text of the bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the left margin property of the  display text of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode11' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD', margin: { left: 100 } },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode11');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the left margin property of the  display text of the bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the right margin property of the  display text of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode12' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD', margin: { right: 100 } },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode12');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the right margin property of the  display text of the bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the top margin property of the  display text of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode13' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD', margin: { top: 50 } },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode13');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the top margin property of the  display text of the bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking the bottom margin property of the  display text of the bar code', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode14' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                foreColor: 'green',
                displayText: { text: 'ABCD', margin: { bottom: 50 } },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode14');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the bottom margin property of the  display text of the bar code', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking left margin of the barcode', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode15' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                margin: { left: 30 },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode15');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left margin of the barcode', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking right margin of the barcode', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode16' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                margin: { right: 30 },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode16');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left marging of the barcode', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking bottom margin of the barcode', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode17' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                margin: { bottom: 50 },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode17');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left marging of the barcode', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking bottom margin of the barcode', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode18' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                margin: { top: 50 },
                value: 'BARCODE',
            });
            barcode.appendTo('#barcode18');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left marging of the barcode', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking left , right , top , bottom margin', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode19' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                margin: { right: 20, left: 20, top: 20, bottom: 20 },
            });
            barcode.appendTo('#barcode19');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left , right , top , bottom margin', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking displaytext greater than available width', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode20' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                displayText: { text: 'ABCDABCDABCDABCDABCDABCDABCDABCDABCD' }
            });
            barcode.appendTo('#barcode20');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left , right , top , bottom margin', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking displaytext with all the display text margin', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode20' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                displayText: {
                    text: 'BARCODEBARCODE',
                    margin:{top:30,bottom:30,left:30,right:30}
                },
            });
            barcode.appendTo('#barcode20');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left , right , top , bottom margin', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
    describe('checking bar code when 100% width is given', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode20' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                displayText: {
                    text: 'BARCODEBARCODE',
                    margin:{top:30,bottom:30,left:30,right:30}
                },
            });
            barcode.appendTo('#barcode20');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking left , right , top , bottom margin', (done: Function) => {
            
            let value = barcode.value
            done();
        });
    });
});