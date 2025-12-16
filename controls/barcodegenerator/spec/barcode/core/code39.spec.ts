
import { createElement } from "@syncfusion/ej2-base";
import { BarcodeGenerator } from "../../../src/barcode/barcode";
let barcode: BarcodeGenerator;
let ele: HTMLElement;

function output(){
    // console.log(j + ': { width: ' + parseFloat((children.children[j + 3].getAttribute('width'))).toFixed(2) + ', height: '
    //                     + parseFloat((children.children[j + 3].getAttribute('height'))).toFixed(2) + ', x: ' +
    //                     Math.round(Number(children.children[j + 3].getAttribute('x')))
    //                     + ', y:' + Math.round(Number(children.children[j + 3].getAttribute('y')))+'}')
}
describe('Barcode Control -width', () => {
    describe('Checking the general rendering of bar code - width testing using pixels', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing using pixels', (done: Function) => {

            let barcode = document.getElementById('barcode1');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('Checking the general rendering of bar code - width testing using pixels');
            console.log("children.getAttribute('width') " + children.getAttribute('width'), "barcode.children[0].getAttribute('id') " + barcode.children[0].getAttribute("id"));
            expect(children.getAttribute('width') === '200'&& barcode.children[0].getAttribute("id") ==="barcode1content").toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - width testing using numbers', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing using pixels', (done: Function) => {

            let barcode = document.getElementById('barcode2')
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('Checking the general rendering of bar code - width testing using pixels');
            console.log("children.getAttribute('width') " + children.getAttribute('width'));
            expect(children.getAttribute('width') === '200').toBe(true);
            done();
        });
    });

    describe('Checking the general rendering of bar code - width testing using percentange', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '50%',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing using percentange', (done: Function) => {

            let barcode = document.getElementById('barcode3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - width testing using percentange');
            console.log("children.getAttribute('width')" +children.getAttribute('width'));
            //error
            expect(children.getAttribute('width') === '632' || children.getAttribute('width') === '379'|| children.getAttribute('width') === '385' || children.getAttribute('width') === '384' || children.getAttribute('width') === '375').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - width testing with no width given', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing with no width given', (done: Function) => {

            let barcode = document.getElementById('barcode4')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log('Checking the general rendering of bar code - width testing with no width given');
            console.log("children.getAttribute('width')"+children.getAttribute('width'));
            expect(children.getAttribute('width') === '1264' || children.getAttribute('width') === '758'|| children.getAttribute('width') === '769' || children.getAttribute('width') === '767' || children.getAttribute('width') === '749').toBe(true);
            done();
        });
    });

});
describe('Barcode Control -height', () => {
    describe('Checking the general rendering of bar code - height testing using pixels', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing using pixels', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - width testing using pixels');
            console.log("children.getAttribute('height')" +children.getAttribute('height'));
            expect(children.getAttribute('height') === '150').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - height testing using numbers', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing using pixels', (done: Function) => {

            let barcode = document.getElementById('barcode2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - width testing using pixels');
            console.log("children.getAttribute('height')" +children.getAttribute('height'));
            expect(children.getAttribute('height') === '150').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - height testing without giving height', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - height testing without giving number', (done: Function) => {

            let barcode = document.getElementById('barcode3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - height testing without giving number');
            console.log("children.getAttribute('height')" +children.getAttribute('height'));
            expect(children.getAttribute('height') === '100').toBe(true);
            done();
        });
    });
});
describe('Barcode Control -fore color', () => {
    describe('Checking the general rendering of bar code - fore color string value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                foreColor: 'blue',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - fore color string value', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - fore color string value');
            console.log("children.children[0].getAttribute('fill')" +children.children[0].getAttribute('fill'));
            expect(children.children[0].getAttribute('fill') === 'blue').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - fore color hex value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                foreColor: '#FF33E9',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - fore color hex value', (done: Function) => {

            let barcode = document.getElementById('barcode2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - fore color hex value');
            console.log("children.children[0].getAttribute('fill')" +children.children[0].getAttribute('fill'));
            expect(children.children[0].getAttribute('fill') === '#FF33E9').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - fore color invalid string value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                foreColor: 'blued',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - fore color string value', (done: Function) => {

            let value = document.getElementById('barcode');
            done();
        });
    });
    describe('Checking the general rendering of bar code - fore color  invalid hex value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                foreColor: '#FF33Edcv9',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - fore color hex value', (done: Function) => {

            let value = document.getElementById('barcode');
            done();
        });
    });
});
describe('Barcode Control -BG color', () => {
    describe('Checking the general rendering of bar code - BG color string value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                mode: 'SVG',
                height: '150px',
                backgroundColor: 'blue',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - BG color string value', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - BG color string value');
            console.log("children.children[3].getAttribute('width')" +children.children[3].getAttribute('width'));
            console.log("children.children[2].getAttribute('width')" +children.children[2].getAttribute('width'));
            console.log("children.getAttribute('height')" +children.getAttribute('height'));
            console.log("children.getAttribute('width')" +children.getAttribute('width'));
            console.log("children.style.background" +children.style.background);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" +Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y')))" +Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("children.children[1].getAttribute('y')" +children.children[1].getAttribute('y'));
            console.log("Math.round(Number(children.children[children.children.length - 1].getAttribute('x')))" +Math.round(Number(children.children[children.children.length - 1].getAttribute('x'))));
            expect(children.children[3].getAttribute('width') === '2.535211267605634' &&
                children.children[2].getAttribute('width') === '1.267605633802817' &&
                children.getAttribute('height') === '150' &&
                children.getAttribute('width') === '200' && children.style.background === 'blue' &&
                Math.round(Number(children.children[0].getAttribute('x'))) === 62
                //error
                || Math.round(Number(children.children[0].getAttribute('x'))) === 58
                && Math.round(Number(children.children[0].getAttribute('y'))) === 142
                && children.children[1].getAttribute('x') === '10' && children.children[1].getAttribute('y') === '10' && Math.round(Number(children.children[children.children.length - 1].getAttribute('x'))) === 189).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - BG color Invalid string value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                backgroundColor: 'bdlue',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - BG color Invalid string value', (done: Function) => {

            //let value = document.getElementById('barcode');
            let barcode = document.getElementById('barcode2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - BG color Invalid string value');
            console.log("children.style.background" +children.style.background);
            expect(children.style.background === "").toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - BG color hex value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                backgroundColor: '#FF33E9',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - BG color hex value', (done: Function) => {

            let barcode = document.getElementById('barcode3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - BG color hex value');
            console.log("children.style.background" +children.style.background);
            expect(children.style.background === ('rgb(255, 51, 233)')).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - right align', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcoder' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                mode: 'SVG',
                //backgroundColor: 'red',
                displayText: { text: 'ABCDABCDABCD', margin: { left: 60, right: 30 } },
            });
            barcode.appendTo('#barcoder');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - right align', (done: Function) => {

            let barcode = document.getElementById('barcoder')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - right align');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" +Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" +(children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 86

                && (children.children[0] as HTMLElement).style.fontSize === '8.4px' || (children.children[0] as HTMLElement).style.fontSize === '7.8px').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code - BG color invalid hex value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                backgroundColor: '#FF33Es9',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE'
            });
            barcode.appendTo('#barcode4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - BG color invalid hex value', (done: Function) => {

            let barcode = document.getElementById('barcode4')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code - BG color invalid hex value');
            console.log("children.style.background" +children.style.background);
            expect(children.style.background === "").toBe(true);
            done();
        });
    });
});

describe('Barcode Control - Margin', () => {
    describe('Checking the general rendering of bar code -Margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 50, right: 50, top: 50, bottom: 50 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -Margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -Margin');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" +Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("children.children[0].getAttribute('y')" +children.children[0].getAttribute('y'));
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("children.children[1].getAttribute('y')" +children.children[1].getAttribute('y'));
            console.log("children.children[1].getAttribute('height')" +children.children[1].getAttribute('height'));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" +Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.children.length - 1].getAttribute('x')))" +Math.round(Number(children.children[children.children.length - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[4].getAttribute('x')))" +Math.round(Number(children.children[4].getAttribute('x'))));
            console.log("Math.round(Number(children.children[4].getAttribute('width')))" +Math.round(Number(children.children[4].getAttribute('width'))));
            
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 62
                || Math.round(Number(children.children[0].getAttribute('x'))) === 58
                && children.children[0].getAttribute('y') === '102'
                && children.children[1].getAttribute('x') === '50'
                && children.children[1].getAttribute('y') === '50'
                && children.children[1].getAttribute('height') === '50'
                && Math.round(Number(children.children[1].getAttribute('width'))) === 1
                && Math.round(Number(children.children[children.children.length - 1].getAttribute('x'))) === 149
                && Math.round(Number(children.children[4].getAttribute('x'))) === 56
                && Math.round(Number(children.children[4].getAttribute('width'))) === 1
            ).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme Margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 90, right: 90, top: 60, bottom: 60 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme Margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme Margin');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("parseFloat((children.children[1].getAttribute('width'))).toFixed(2)" +parseFloat((children.children[1].getAttribute('width'))).toFixed(2));
            console.log("Math.round(Number(children.children[3].getAttribute('x')))" +Math.round(Number(children.children[3].getAttribute('x'))));
            console.log("parseFloat((children.children[3].getAttribute('width'))).toFixed(2)" +parseFloat((children.children[3].getAttribute('width'))).toFixed(2));
            
            expect(children.children[1].getAttribute('x') === '90'
                && parseFloat((children.children[1].getAttribute('width'))).toFixed(2) === '0.14'
                && Math.round(Number(children.children[3].getAttribute('x'))) === 91
                && parseFloat((children.children[3].getAttribute('width'))).toFixed(2) === '0.28').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme Margin 2', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 90, right: 90, top: 70, bottom: 70 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme Margin 2', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme Margin 2');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("children.children[1].getAttribute('height')" +children.children[1].getAttribute('height'));
            console.log("Math.round(Number(children.children[11].getAttribute('x')))" +Math.round(Number(children.children[11].getAttribute('x'))));
            console.log("Math.round(Number(children.children[11].getAttribute('height')))" +Math.round(Number(children.children[11].getAttribute('height'))));
            
            expect(children.children[1].getAttribute('x') === '90'
                && parseFloat((children.children[1].getAttribute('width'))).toFixed(2) === '0.14'
                && (children.children[1].getAttribute('height')) === '10'
                && Math.round(Number(children.children[11].getAttribute('x'))) === 94
                && Math.round(Number(children.children[11].getAttribute('height'))) === 0).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme left - right margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 90, right: 90 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme left - right margin', (done: Function) => {

            let value = document.getElementById('barcode');
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme top - bottom margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 90, right: 90 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme left - right margin', (done: Function) => {
            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme left - right margin');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("parseFloat((children.children[1].getAttribute('width'))).toFixed(2)" +parseFloat((children.children[1].getAttribute('width'))).toFixed(2));
            console.log("parseFloat((children.children[3].getAttribute('width'))).toFixed(2)" +parseFloat((children.children[3].getAttribute('width'))).toFixed(2));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(children.children[1].getAttribute('x') === '90'
                && parseFloat((children.children[1].getAttribute('width'))).toFixed(2) === "0.14"
                && parseFloat((children.children[3].getAttribute('width'))).toFixed(2) === "0.28"
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 110).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme top bottom error margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { top: 90, bottom: 90 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme left - right margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children = barcode.children[0]
            console.log('Checking the general rendering of bar code -extreme left - right margin');
            console.log("children.childElementCount" +children.childElementCount);
            expect(children.childElementCount === 0).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme left right error margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode111' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 100, right: 120 }
            });
            barcode.appendTo('#barcode111');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme left - right margin', (done: Function) => {

            let barcode = document.getElementById('barcode111')
            let children = barcode.children[0]
            console.log('Checking the general rendering of bar code -extreme left - right margin');
            console.log("children.childElementCount" +children.childElementCount);
            expect(children.childElementCount === 0).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme left negative margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: -40, }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme left negative margin', (done: Function) => {
            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            // expect(Math.round(Number(children.children[0].getAttribute('x'))) === 7//error 3
            //     || Math.round(Number(children.children[0].getAttribute('x'))) === 3
            //     && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 129
            //     && children.children[1].getAttribute('x') === '-40').toBe(true);
            console.log('Checking the general rendering of bar code -extreme left negative margin');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" +Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 37
                || Math.round(Number(children.children[0].getAttribute('x'))) === 33
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 188
                && children.children[1].getAttribute('x') === '-40').toBe(true)
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme right negative margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { right: -40, }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme right negative margin', (done: Function) => {
            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme right negative margin');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" +Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));

            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 87//error 83
                || Math.round(Number(children.children[0].getAttribute('x'))) === 83
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 238).toBe(true);
            done();
        });
    });

    describe('Checking the general rendering of bar code -extreme right negative left positive margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE',
                margin: { right: -40, left: 40 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme right negative margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme right negative margin');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(children.children[1].getAttribute('x') === '40' && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 239).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme right positive left negative margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { right: 40, left: -40 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme right negative margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme right negative margin');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(children.children[1].getAttribute('x') === '-40' && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 159).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme right negative left negative margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE',
                margin: { right: -40, left: -40 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme right negative margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme right negative margin');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(children.children[1].getAttribute('x') === '-40' && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 238).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -extreme zero values on all the sides', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE',
                margin: { right: 0, left: 0, top: 0, bottom: 0 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -extreme right negative margin', (done: Function) => {

            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('Checking the general rendering of bar code -extreme right negative margin');
            console.log("children.children[1].getAttribute('x')" +children.children[1].getAttribute('x'));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(children.children[1].getAttribute('x') === '0' && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 199).toBe(true);
            done();
        });
    });

});
describe('Barcode Control - text size', () => {
    describe('Checking the general rendering of bar code - larger text size', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                displayText: { size: 80 }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - BG color string value', (done: Function) => {

            let value = document.getElementById('barcode');
            done();
        });
    });
    describe('Checking the general rendering of bar code - larger display text', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                displayText: { text: 'sdlkdjnv clsjdnf jvknfdknv kjfn kv' }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - BG color string value', (done: Function) => {

            let value = document.getElementById('barcode');
            done();
        });
    });

});
describe('Barcode Control - text size', () => {
    describe('Checking the general rendering of bar code -  text margin left', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { left: 60 } }
            });
            barcode.appendTo('#barcode1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin left', (done: Function) => {
            let barcode = document.getElementById('barcode1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  text margin left");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 86).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin right', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { right: 60 } }
            });
            barcode.appendTo('#barcode2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin left', (done: Function) => {

            let barcode = document.getElementById('barcode2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin left");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 37
                || Math.round(Number(children.children[0].getAttribute('x'))) === 30
                || Math.round(Number(children.children[0].getAttribute('x'))) === 29
            ).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin top', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { top: 20 } }
            });
            barcode.appendTo('#barcode3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin left', (done: Function) => {

            let barcode = document.getElementById('barcode3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  text margin left");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            console.log("Math.round(Number(children.children[12].getAttribute('height')))" + Math.round(Number(children.children[12].getAttribute('height'))));
            //error
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 62 || Math.round(Number(children.children[0].getAttribute('x'))) === 58)
                && (children.children[0].getAttribute('y') === '140' || children.children[0].getAttribute('y') === '142')
                && (Math.round(Number(children.children[12].getAttribute('height'))) === 96 ||
                Math.round(Number(children.children[12].getAttribute('height'))) === 97)).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin bottom', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { bottom: 20 } }
            });
            barcode.appendTo('#barcode4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin bottom', (done: Function) => {

            let barcode = document.getElementById('barcode4')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin bottom");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y')))" + Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("children.children[14].getAttribute('height')" + children.children[14].getAttribute('height'));
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 62
                || Math.round(Number(children.children[0].getAttribute('x'))) === 58)
                && (Math.round(Number(children.children[0].getAttribute('y'))) === 120
                || Math.round(Number(children.children[0].getAttribute('y'))) === 122)
                && (children.children[14].getAttribute('height') === '96'
                || children.children[14].getAttribute('height') === '96.5')).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin left and right', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode5' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { left: 50, right: 50 } }
            });
            barcode.appendTo('#barcode5');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin left and right', (done: Function) => {

            let barcode = document.getElementById('barcode5')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin left and right");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 76
                && (children.children[0] as HTMLElement).style.fontSize === '12.2px'
                || (children.children[0] as HTMLElement).style.fontSize === '11px'
            ).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin top and bottom', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE',
                displayText: { margin: { top: 50, bottom: 50 } }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin left and right', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin left and right");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            console.log("(children.children[14].getAttribute('height')" + children.children[14].getAttribute('height'));
            expect((children.children[0].getAttribute('y') === '90' || children.children[0].getAttribute('y') === '92')
                && children.children[14].getAttribute('height') === '16' || children.children[14].getAttribute('height') === '16.5').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin bottom and to', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                displayText: {
                    text: 'ABCDABCD',
                    margin: {
                        bottom: 10,
                        top: 5,
                    }
                },
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin left and right', (done: Function) => {
            let value = document.getElementById('barcode');
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin top  bottom left right', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { left: 50, right: 50, top: 50, bottom: 50 } }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin top  bottom left right', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin top  bottom left right");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            console.log("Math.round(Number(children.children[13].getAttribute('height')))" + Math.round(Number(children.children[13].getAttribute('height'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 76
                && (children.children[0] as HTMLElement).style.fontSize === '12.2px' ||
                (children.children[0] as HTMLElement).style.fontSize === '11px'
                && Math.round(Number(children.children[13].getAttribute('height'))) === 16 ||
                Math.round(Number(children.children[13].getAttribute('height'))) === 17).toBe(true);

            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin negative top value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { top: -10 } }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin negative top value', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin negative top value");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            console.log("Math.round(Number(children.children[18].getAttribute('height')))" + Math.round(Number(children.children[18].getAttribute('height'))));
            expect(children.children[0].getAttribute('y') === '120' || children.children[0].getAttribute('y') === '130' || children.children[0].getAttribute('y') === '132'
                && Math.round(Number(children.children[18].getAttribute('height'))) === 116 || Math.round(Number(children.children[18].getAttribute('height'))) === 117).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  text margin negative bottom value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: { margin: { bottom: -10 } }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin negative top value', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  text margin negative top value");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            console.log("children.children[17].getAttribute('height')" + children.children[17].getAttribute('height'));
            expect((children.children[0].getAttribute('y') === '150' || children.children[0].getAttribute('y') === '152')
                && children.children[17].getAttribute('height') === '116' || children.children[17].getAttribute('height') === '116.5').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  both barcode margin and text margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                mode: 'SVG',
                margin: { left: 40, right: 40 },
                displayText: { margin: { left: 40, right: 40, top: 20, bottom: 20 } }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  text margin negative top value', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  text margin negative top value");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            console.log("(children.children[1].getAttribute('x')" + children.children[1].getAttribute('x'));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" +  Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("children.children[18].getAttribute('height')" + children.children[18].getAttribute('height'));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 91
                && (children.children[0] as HTMLElement).style.fontSize === '4.6px' ||
                (children.children[0] as HTMLElement).style.fontSize === '4px'
                && children.children[1].getAttribute('x') === '40'
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 159
                && children.children[18].getAttribute('height') === '76' ||
                children.children[18].getAttribute('height') === '76.5').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  both barcode margin and text margin(invalid)', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 40, right: 40 },
                displayText: { margin: { left: 50, right: 50 } }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  both barcode margin and text margin(invalid)', (done: Function) => {
            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  both barcode margin and text margin(invalid)");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 101).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  negative bottom value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: {
                    margin: {
                        bottom: -100,
                    }
                }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  negative bottom value', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  negative bottom value");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            expect(children.children[0].getAttribute('y') === '242').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  negative top value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE',
                displayText: {
                    margin: {
                        top: -100,
                    }
                }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  negative top value', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            console.log("Checking the general rendering of bar code -  negative top value");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            expect(children.children[0].getAttribute('y') === '140' || children.children[0].getAttribute('y') === '42').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  with greater bottom and top value', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                displayText: {
                    margin: {
                        bottom: 80,
                        top: 50
                    }
                }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  negative bottom value', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  negative bottom value");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            expect(children.children[0].getAttribute('y') === '142').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  margin and text margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                type: 'Code39',
                value: 'BARCODE',
                mode: 'SVG',
                margin: { top: 40, bottom: 40 },
                displayText: {
                    margin: {
                        bottom: 40,
                    }
                }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  margin and text margin', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  margin and text margin");
            console.log("children.children[0].getAttribute('y')" + children.children[0].getAttribute('y'));
            console.log("children.children[1].getAttribute('y')" + children.children[1].getAttribute('y'));
            console.log("children.children[1].getAttribute('height')" + children.children[1].getAttribute('height'));
            console.log("children.children[10].getAttribute('height')" + children.children[10].getAttribute('height'));
            console.log("children.children[10].getAttribute('y')" + children.children[10].getAttribute('y'));
            console.log("children.children[54].getAttribute('height')" + children.children[54].getAttribute('height'));
            expect((children.children[0].getAttribute('y') === '79'
                || children.children[0].getAttribute('y') === '70'
                || children.children[0].getAttribute('y') === '72')
                && children.children[1].getAttribute('y') === '40'
                && children.children[1].getAttribute('height') === '70'
                && (children.children[10].getAttribute('height') === '16'
                || children.children[10].getAttribute('height') === '16.5')
                && children.children[10].getAttribute('y') === '40'
                && children.children[54].getAttribute('height') === '70').toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  all four text margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px',
                height: '150px',
                mode: 'SVG',
                type: 'Code39',
                value: 'BARCODE',
                displayText: {
                    margin: {
                        top: 50,
                        bottom: 50,
                        left: 70,
                        right: 70
                    }
                }
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  all four text margin', (done: Function) => {

            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("Checking the general rendering of bar code -  all four text margin");
            console.log("(Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            console.log("children.children[11].getAttribute('height')" + children.children[11].getAttribute('height'));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 96 && ((children.children[0] as HTMLElement).style.fontSize === '1.8px'
                || (children.children[0] as HTMLElement).style.fontSize === '1.2px' || (children.children[0] as HTMLElement).style.fontSize === '1.4px')
                && (children.children[11].getAttribute('height') === '16' || children.children[11].getAttribute('height') === '16.5')).toBe(true);
            done();
        });
    });
    describe('Checking the general rendering of bar code -  propertychange', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcodeprop' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: '12341',
            });
            barcode.appendTo('#barcodeprop');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code -  propertychange code39', (done: Function) => {

            let barcodeelement = document.getElementById('barcodeprop')
            let children = barcodeelement.children[0]
            console.log("Checking the general rendering of bar code -  propertychange code39");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 46 && Math.round(Number(children.children[0].getAttribute('x'))) === 70
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 188
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 3
                && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 184).toBe(true);
            barcode.width = '400px';
            barcode.height = '400px';
            barcode.value = '111'
            barcode.margin.left = 30;
            barcode.margin.right = 30;
            barcode.margin.top = 30;
            barcode.margin.bottom = 30;
            barcode.displayText.margin.left = 60
            barcode.displayText.margin.right = 60
            barcode.displayText.text = '12223'
            barcode.displayText.visibility = false
            barcode.dataBind()
            console.log("Checking the general rendering of bar code -  propertychange code39");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 30 && Math.round(Number(children.children[0].getAttribute('x'))) === 30
                && Math.round(Number(children.children[1].getAttribute('x'))) === 43
                && Math.round(Number(children.children[1].getAttribute('width'))) === 4
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 366
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 4
                && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 9
                && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 352).toBe(true);
            barcode.mode = 'Canvas';
            barcode.dataBind();
            var element = document.getElementById('barcodeprop');
            console.log("Checking the general rendering of bar code -  propertychange code39");
            console.log("element.childElementCount" + element.childElementCount);
            expect(element.childElementCount===1).toBe(true)
            done();
        });

        it('Checking the general rendering of bar code -  propertychange codabar', (done: Function) => {
            barcode.type = 'Codabar';
            barcode.mode= 'SVG'
            barcode.displayText.visibility = true
    barcode.displayText.margin.left = 10
        barcode.displayText.margin.right=10
        barcode.margin.left = 10;
        barcode.margin.right = 10;
        barcode.margin.bottom = 10;
        barcode.width = 200
        barcode.height = 150
        barcode.margin.top = 10;
        barcode.mode = 'SVG';
        barcode.displayText.text = undefined
            barcode.value = '1111';
            barcode.height = 200;
            barcode.width = 150;
            barcode.dataBind()
            let barcodeelement = document.getElementById('barcodeprop')
            let children = barcodeelement.children[0]
            console.log("Checking the general rendering of bar code -  propertychange codabar");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 25 && Math.round(Number(children.children[0].getAttribute('x'))) === 51
            && Math.round(Number(children.children[1].getAttribute('x'))) === 10
            && Math.round(Number(children.children[1].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 138
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 131).toBe(true);
            barcode.width = '400px';
    barcode.height = '400px';
    barcode.value = '111'
    barcode.margin.left = 30;
    barcode.margin.right = 30;
    barcode.margin.top = 30;
    barcode.margin.bottom = 30;
    barcode.displayText.margin.left = 60
    barcode.displayText.margin.right = 60
    barcode.displayText.text = '12223'
    barcode.displayText.visibility = false
    barcode.dataBind()
            console.log("Checking the general rendering of bar code -  propertychange codabar");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 20 && Math.round(Number(children.children[0].getAttribute('x'))) === 30
            && Math.round(Number(children.children[1].getAttribute('x'))) === 43
            && Math.round(Number(children.children[1].getAttribute('width'))) === 13
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 363
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 7
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 7
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 343).toBe(true);
            barcode.mode = 'Canvas';
            barcode.dataBind();
            var element = document.getElementById('barcodeprop');
            console.log("Checking the general rendering of bar code -  propertychange codabar");
            console.log("element.childElementCount" + element.childElementCount);
            expect(element.childElementCount===1).toBe(true)
            done();
        });

        it('Checking the general rendering of bar code -  propertychange code128', (done: Function) => {
            barcode.type = 'Code128';
            barcode.mode= 'SVG'
            barcode.displayText.visibility = true
    barcode.displayText.margin.left = 10
        barcode.displayText.margin.right=10
        barcode.margin.left = 10;
        barcode.margin.right = 10;
        barcode.margin.bottom = 10;
        barcode.width = 200
        barcode.height = 150
        barcode.margin.top = 10;
        barcode.mode = 'SVG';
        barcode.displayText.text = undefined
            barcode.value = '1111';
            barcode.height = 200;
            barcode.width = 150;
            barcode.dataBind()
            let barcodeelement = document.getElementById('barcodeprop')
            let children = barcodeelement.children[0]
            console.log("Checking the general rendering of bar code -  propertychange code128");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 17 && Math.round(Number(children.children[0].getAttribute('x'))) === 51
            && Math.round(Number(children.children[1].getAttribute('x'))) === 10
            && Math.round(Number(children.children[1].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 135
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 131).toBe(true);
            barcode.width = '400px';
    barcode.height = '400px';
    barcode.value = '111'
    barcode.margin.left = 30;
    barcode.margin.right = 30;
    barcode.margin.top = 30;
    barcode.margin.bottom = 30;
    barcode.displayText.margin.left = 60
    barcode.displayText.margin.right = 60
    barcode.displayText.text = '12223'
    barcode.displayText.visibility = false
    barcode.dataBind()
            console.log("Checking the general rendering of bar code -  propertychange code128");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 19 && Math.round(Number(children.children[0].getAttribute('x'))) === 30
            && Math.round(Number(children.children[1].getAttribute('x'))) === 45
            && Math.round(Number(children.children[1].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 360
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 10
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 350).toBe(true);
            barcode.mode = 'Canvas';
            barcode.dataBind();
            var element = document.getElementById('barcodeprop');
            console.log("Checking the general rendering of bar code -  propertychange code128");
            console.log("element.childElementCount" + element.childElementCount);
            expect(element.childElementCount===1).toBe(true)
            done();
        });

        it('Checking the general rendering of bar code -  propertychange code128a', (done: Function) => {
            barcode.type = 'Code128A';
            barcode.mode= 'SVG'
            barcode.displayText.visibility = true
    barcode.displayText.margin.left = 10
        barcode.displayText.margin.right=10
        barcode.margin.left = 10;
        barcode.margin.right = 10;
        barcode.margin.bottom = 10;
        barcode.width = 200
        barcode.height = 150
        barcode.margin.top = 10;
        barcode.mode = 'SVG';
        barcode.displayText.text = undefined
            barcode.value = '1111';
            barcode.height = 200;
            barcode.width = 150;
            barcode.dataBind()
            let barcodeelement = document.getElementById('barcodeprop')
            let children = barcodeelement.children[0]
            console.log("Checking the general rendering of bar code -  propertychange code128a");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[3].getAttribute('x')))" + Math.round(Number(children.children[3].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 23 && Math.round(Number(children.children[0].getAttribute('x'))) === 51
            && Math.round(Number(children.children[1].getAttribute('x'))) === 10
            &&Math.round(Number(children.children[3].getAttribute('x')))===23
            && Math.round(Number(children.children[1].getAttribute('width'))) === 3
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 137
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 3
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 133).toBe(true);
            barcode.width = '400px';
            barcode.height = '400px';
            barcode.value = '111'
            barcode.margin.left = 30;
            barcode.margin.right = 30;
            barcode.margin.top = 30;
            barcode.margin.bottom = 30;
            barcode.displayText.margin.left = 60
            barcode.displayText.margin.right = 60
            barcode.displayText.text = '12223'
            barcode.displayText.visibility = false
            barcode.dataBind()
            console.log("Checking the general rendering of bar code -  propertychange code128a");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 19 && Math.round(Number(children.children[0].getAttribute('x'))) === 30
            && Math.round(Number(children.children[1].getAttribute('x'))) === 45
            && Math.round(Number(children.children[1].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 360
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 10
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 350).toBe(true);
            barcode.mode = 'Canvas';
            barcode.dataBind();
            var element = document.getElementById('barcodeprop');
            console.log("Checking the general rendering of bar code -  propertychange code128a");
            console.log("element.childElementCount" + element.childElementCount);
            expect(element.childElementCount===1).toBe(true)
            done();
        });


        it('Checking the general rendering of bar code -  propertychange code128b', (done: Function) => {
            barcode.type = 'Code128B';
            barcode.mode= 'SVG'
            barcode.displayText.visibility = true
    barcode.displayText.margin.left = 10
        barcode.displayText.margin.right=10
        barcode.margin.left = 10;
        barcode.margin.right = 10;
        barcode.margin.bottom = 10;
        barcode.width = 200
        barcode.height = 150
        barcode.margin.top = 10;
        barcode.mode = 'SVG';
        barcode.displayText.text = undefined
            barcode.value = '1111';
            barcode.height = 200;
            barcode.width = 150;
            barcode.dataBind()
            let barcodeelement = document.getElementById('barcodeprop')
            let children = barcodeelement.children[0]
            console.log("Checking the general rendering of bar code -  propertychange code128b");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[3].getAttribute('x')))" + Math.round(Number(children.children[3].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 23 && Math.round(Number(children.children[0].getAttribute('x'))) === 51
            && Math.round(Number(children.children[1].getAttribute('x'))) === 10
            &&Math.round(Number(children.children[3].getAttribute('x')))===20
            && Math.round(Number(children.children[1].getAttribute('width'))) === 3
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 137
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 3
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 133).toBe(true);
            barcode.width = '400px';
            barcode.height = '400px';
            barcode.value = '111'
            barcode.margin.left = 30;
            barcode.margin.right = 30;
            barcode.margin.top = 30;
            barcode.margin.bottom = 30;
            barcode.displayText.margin.left = 60
            barcode.displayText.margin.right = 60
            barcode.displayText.text = '12223'
            barcode.displayText.visibility = false
            barcode.dataBind()
            console.log("Checking the general rendering of bar code -  propertychange code128b");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[3].getAttribute('x')))" + Math.round(Number(children.children[3].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 19 && Math.round(Number(children.children[0].getAttribute('x'))) === 30
            && Math.round(Number(children.children[1].getAttribute('x'))) === 45
            && Math.round(Number(children.children[1].getAttribute('width'))) === 5
            &&Math.round(Number(children.children[3].getAttribute('x')))===85
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 360
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 10
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 350).toBe(true);
            barcode.mode = 'Canvas';
            barcode.dataBind();
            var element = document.getElementById('barcodeprop');
            console.log("Checking the general rendering of bar code -  propertychange code128b");
            console.log("element.childElementCount" + element.childElementCount);
            expect(element.childElementCount===1).toBe(true)
            done();
        });


        it('Checking the general rendering of bar code -  propertychange code128c', (done: Function) => {
            barcode.type = 'Code128C';
            barcode.mode= 'SVG'
            barcode.displayText.visibility = true
    barcode.displayText.margin.left = 10
        barcode.displayText.margin.right=10
        barcode.margin.left = 10;
        barcode.margin.right = 10;
        barcode.margin.bottom = 10;
        barcode.width = 200
        barcode.height = 150
        barcode.margin.top = 10;
        barcode.mode = 'SVG';
        barcode.displayText.text = undefined
            barcode.value = '1111';
            barcode.height = 200;
            barcode.width = 150;
            barcode.dataBind()
            let barcodeelement = document.getElementById('barcodeprop')
            let children = barcodeelement.children[0]
            console.log("Checking the general rendering of bar code -  propertychange code128c");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[3].getAttribute('x')))" + Math.round(Number(children.children[3].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 17 && Math.round(Number(children.children[0].getAttribute('x'))) === 51
            && Math.round(Number(children.children[1].getAttribute('x'))) === 10
            &&Math.round(Number(children.children[3].getAttribute('x')))===24
            && Math.round(Number(children.children[1].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 135
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 5
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 2
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 131).toBe(true);
            barcode.width = '400px';
            barcode.height = '400px';
            barcode.value = '11111111'
            barcode.margin.left = 30;
            barcode.margin.right = 30;
            barcode.margin.top = 30;
            barcode.margin.bottom = 30;
            barcode.displayText.margin.left = 60
            barcode.displayText.margin.right = 60
            barcode.displayText.text = '12223'
            barcode.displayText.visibility = false
            barcode.dataBind()
            console.log("Checking the general rendering of bar code -  propertychange code128c");
            console.log("children.childElementCount" + children.childElementCount);
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[3].getAttribute('x')))" + Math.round(Number(children.children[3].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))));
            expect(children.childElementCount === 22 && Math.round(Number(children.children[0].getAttribute('x'))) === 30
            && Math.round(Number(children.children[1].getAttribute('x'))) === 43
            && Math.round(Number(children.children[1].getAttribute('width'))) === 4
            &&Math.round(Number(children.children[3].getAttribute('x')))===77
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 361
            && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 9
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('width'))) === 4
            && Math.round(Number(children.children[children.childElementCount - 2].getAttribute('x'))) === 353).toBe(true);
            barcode.mode = 'Canvas';
            barcode.dataBind();
            var element = document.getElementById('barcodeprop');
            console.log("Checking the general rendering of bar code -  propertychange code128c");
            console.log("element.childElementCount" + element.childElementCount);
            expect(element.childElementCount===1).toBe(true)
            done();
        });
    });


    var a = {
        0: { width: "1.13", height: "110.00", x: 20, y: 20 },
        1: { width: "1.13", height: "110.00", x: 23, y: 20 },
        2: { width: "2.25", height: "110.00", x: 26, y: 20 },
        3: { width: "2.25", height: "110.00", x: 29, y: 20 },
        4: { width: "1.13", height: "110.00", x: 32, y: 20 },
        5: { width: "1.13", height: "56.00", x: 35, y: 20 },
        6: { width: "2.25", height: "56.00", x: 37, y: 20 },
        7: { width: "1.13", height: "56.00", x: 40, y: 20 },
        8: { width: "1.13", height: "56.00", x: 44, y: 20 },
        9: { width: "2.25", height: "56.00", x: 46, y: 20 },
        10: { width: "2.25", height: "56.00", x: 49, y: 20 },
        11: { width: "1.13", height: "56.00", x: 53, y: 20 },
        12: { width: "1.13", height: "56.00", x: 55, y: 20 },
        13: { width: "1.13", height: "56.00", x: 58, y: 20 },
        14: { width: "2.25", height: "56.00", x: 61, y: 20 },
        15: { width: "2.25", height: "56.00", x: 64, y: 20 },
        16: { width: "1.13", height: "56.00", x: 67, y: 20 },
        17: { width: "1.13", height: "56.00", x: 70, y: 20 },
        18: { width: "2.25", height: "56.00", x: 72, y: 20 },
        19: { width: "1.13", height: "56.00", x: 76, y: 20 },
        20: { width: "2.25", height: "56.00", x: 79, y: 20 },
        21: { width: "2.25", height: "56.00", x: 82, y: 20 },
        22: { width: "1.13", height: "56.00", x: 85, y: 20 },
        23: { width: "1.13", height: "56.00", x: 89, y: 20 },
        24: { width: "1.13", height: "56.00", x: 91, y: 20 },
        25: { width: "2.25", height: "56.00", x: 93, y: 20 },
        26: { width: "1.13", height: "56.00", x: 97, y: 20 },
        27: { width: "2.25", height: "56.00", x: 99, y: 20 },
        28: { width: "1.13", height: "56.00", x: 102, y: 20 },
        29: { width: "1.13", height: "56.00", x: 106, y: 20 },
        30: { width: "1.13", height: "56.00", x: 108, y: 20 },
        31: { width: "1.13", height: "56.00", x: 110, y: 20 },
        32: { width: "2.25", height: "56.00", x: 112, y: 20 },
        33: { width: "1.13", height: "56.00", x: 117, y: 20 },
        34: { width: "2.25", height: "56.00", x: 119, y: 20 },
        35: { width: "2.25", height: "56.00", x: 123, y: 20 },
        36: { width: "1.13", height: "56.00", x: 126, y: 20 },
        37: { width: "2.25", height: "56.00", x: 128, y: 20 },
        38: { width: "1.13", height: "56.00", x: 133, y: 20 },
        39: { width: "1.13", height: "56.00", x: 135, y: 20 },
        40: { width: "1.13", height: "56.00", x: 137, y: 20 },
        41: { width: "2.25", height: "56.00", x: 139, y: 20 },
        42: { width: "1.13", height: "56.00", x: 144, y: 20 },
        43: { width: "1.13", height: "56.00", x: 146, y: 20 },
        44: { width: "2.25", height: "56.00", x: 148, y: 20 },
        45: { width: "2.25", height: "56.00", x: 152, y: 20 },
        46: { width: "1.13", height: "56.00", x: 155, y: 20 },
        47: { width: "2.25", height: "56.00", x: 159, y: 20 },
        48: { width: "1.13", height: "56.00", x: 162, y: 20 },
        49: { width: "1.13", height: "56.00", x: 164, y: 20 },
        50: { width: "1.13", height: "110.00", x: 166, y: 20 },
        51: { width: "1.13", height: "110.00", x: 170, y: 20 },
        52: { width: "2.25", height: "110.00", x: 172, y: 20 },
        53: { width: "2.25", height: "110.00", x: 175, y: 20 },
        54: { width: "1.13", height: "110.00", x: 179, y: 20 },
    };
    describe('checking the bar code all lines width height offset x offsety testcase1', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 20, right: 20, top: 20, bottom: 20 },
                displayText: { text: 'ABCDABCDABCD', margin: { left: 20, right: 20, top: 20, bottom: 20 } },
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the bar code all lines width height offset x offsety testcase1', (done: Function) => {
            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("checking the bar code all lines width height offset x offsety testcase1");
            for (let j: number = 1; j < children.children.length - 1; j++) {
                console.log(`${j}: { Math.round(Number(children.children[j + 1].getAttribute('x'))): ${Math.round(Number(children.children[j + 1].getAttribute('x')))}, Math.round(Number(children.children[j + 1].getAttribute('y'))): ${Math.round(Number(children.children[j + 1].getAttribute('y')))}, parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === a[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === a[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === parseFloat(a[j].width).toFixed(2)
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === parseFloat(a[j].height).toFixed(2)).toBe(true);

            }
            done();
        });
    });

    let output1 = {
        0: { width: "3.52", height: "260.00", x: 100, y: 120 },
        1: { width: "3.52", height: "260.00", x: 111, y: 120 },
        2: { width: "7.04", height: "260.00", x: 118, y: 120 },
        3: { width: "7.04", height: "260.00", x: 128, y: 120 },
        4: { width: "3.52", height: "260.00", x: 139, y: 120 },
        5: { width: "3.52", height: "26.00", x: 146, y: 120 },
        6: { width: "7.04", height: "26.00", x: 153, y: 120 },
        7: { width: "3.52", height: "26.00", x: 163, y: 120 },
        8: { width: "3.52", height: "26.00", x: 174, y: 120 },
        9: { width: "7.04", height: "26.00", x: 181, y: 120 },
        10: { width: "7.04", height: "26.00", x: 192, y: 120 },
        11: { width: "3.52", height: "26.00", x: 202, y: 120 },
        12: { width: "3.52", height: "26.00", x: 209, y: 120 },
        13: { width: "3.52", height: "26.00", x: 220, y: 120 },
        14: { width: "7.04", height: "26.00", x: 227, y: 120 },
        15: { width: "7.04", height: "26.00", x: 237, y: 120 },
        16: { width: "3.52", height: "26.00", x: 248, y: 120 },
        17: { width: "3.52", height: "26.00", x: 255, y: 120 },
        18: { width: "7.04", height: "26.00", x: 262, y: 120 },
        19: { width: "3.52", height: "26.00", x: 276, y: 120 },
        20: { width: "7.04", height: "26.00", x: 283, y: 120 },
        21: { width: "7.04", height: "26.00", x: 294, y: 120 },
        22: { width: "3.52", height: "26.00", x: 304, y: 120 },
        23: { width: "3.52", height: "26.00", x: 315, y: 120 },
        24: { width: "3.52", height: "26.00", x: 322, y: 120 },
        25: { width: "7.04", height: "26.00", x: 329, y: 120 },
        26: { width: "3.52", height: "26.00", x: 339, y: 120 },
        27: { width: "7.04", height: "26.00", x: 346, y: 120 },
        28: { width: "3.52", height: "26.00", x: 357, y: 120 },
        29: { width: "3.52", height: "26.00", x: 368, y: 120 },
        30: { width: "3.52", height: "26.00", x: 375, y: 120 },
        31: { width: "3.52", height: "26.00", x: 382, y: 120 },
        32: { width: "7.04", height: "26.00", x: 389, y: 120 },
        33: { width: "3.52", height: "26.00", x: 403, y: 120 },
        34: { width: "7.04", height: "26.00", x: 410, y: 120 },
        35: { width: "7.04", height: "26.00", x: 420, y: 120 },
        36: { width: "3.52", height: "26.00", x: 431, y: 120 },
        37: { width: "7.04", height: "26.00", x: 438, y: 120 },
        38: { width: "3.52", height: "26.00", x: 452, y: 120 },
        39: { width: "3.52", height: "26.00", x: 459, y: 120 },
        40: { width: "3.52", height: "26.00", x: 466, y: 120 },
        41: { width: "7.04", height: "26.00", x: 473, y: 120 },
        42: { width: "3.52", height: "26.00", x: 487, y: 120 },
        43: { width: "3.52", height: "26.00", x: 494, y: 120 },
        44: { width: "7.04", height: "26.00", x: 501, y: 120 },
        45: { width: "7.04", height: "26.00", x: 512, y: 120 },
        46: { width: "3.52", height: "26.00", x: 523, y: 120 },
        47: { width: "7.04", height: "26.00", x: 533, y: 120 },
        48: { width: "3.52", height: "26.00", x: 544, y: 120 },
        49: { width: "3.52", height: "26.00", x: 551, y: 120 },
        50: { width: "3.52", height: "260.00", x: 558, y: 120 },
        51: { width: "3.52", height: "260.00", x: 568, y: 120 },
        52: { width: "7.04", height: "260.00", x: 575, y: 120 },
        53: { width: "7.04", height: "260.00", x: 586, y: 120 },
        54: { width: "3.52", height: "260.00", x: 596, y: 120 },
    }
    describe('checking the bar code all lines width height offset x offsety testcase2', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '700px', height: '500px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 100, right: 100, top: 120, bottom: 120 },
                displayText: { text: 'ABCDABCDABCD', margin: { left: 180, right: 180, top: 100, bottom: 120 } },
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the bar code all lines width height offset x offsety testcase2', (done: Function) => {
            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("checking the bar code all lines width height offset x offsety testcase2");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 326 && (children.children[0] as HTMLElement).style.fontSize === '6.6px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                console.log(`${j}: { Math.round(Number(children.children[j + 1].getAttribute('x'))): ${Math.round(Number(children.children[j + 1].getAttribute('x')))}, Math.round(Number(children.children[j + 1].getAttribute('y'))): ${Math.round(Number(children.children[j + 1].getAttribute('y')))}, parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    var output2 = {
        0: { width: "6.34", height: "740.00", x: -100, y: -120 },
        1: { width: "6.34", height: "740.00", x: -81, y: -120 },
        2: { width: "12.68", height: "740.00", x: -68, y: -120 },
        3: { width: "12.68", height: "740.00", x: -49, y: -120 },
        4: { width: "6.34", height: "740.00", x: -30, y: -120 },
        5: { width: "6.34", height: "726.00", x: -18, y: -120 },
        6: { width: "12.68", height: "726.00", x: -5, y: -120 },
        7: { width: "6.34", height: "726.00", x: 14, y: -120 },
        8: { width: "6.34", height: "726.00", x: 33, y: -120 },
        9: { width: "12.68", height: "726.00", x: 46, y: -120 },
        10: { width: "12.68", height: "726.00", x: 65, y: -120 },
        11: { width: "6.34", height: "726.00", x: 84, y: -120 },
        12: { width: "6.34", height: "726.00", x: 96, y: -120 },
        13: { width: "6.34", height: "726.00", x: 115, y: -120 },
        14: { width: "12.68", height: "726.00", x: 128, y: -120 },
        15: { width: "12.68", height: "726.00", x: 147, y: -120 },
        16: { width: "6.34", height: "726.00", x: 166, y: -120 },
        17: { width: "6.34", height: "726.00", x: 179, y: -120 },
        18: { width: "12.68", height: "726.00", x: 192, y: -120 },
        19: { width: "6.34", height: "726.00", x: 217, y: -120 },
        20: { width: "12.68", height: "726.00", x: 230, y: -120 },
        21: { width: "12.68", height: "726.00", x: 249, y: -120 },
        22: { width: "6.34", height: "726.00", x: 268, y: -120 },
        23: { width: "6.34", height: "726.00", x: 287, y: -120 },
        24: { width: "6.34", height: "726.00", x: 299, y: -120 },
        25: { width: "12.68", height: "726.00", x: 312, y: -120 },
        26: { width: "6.34", height: "726.00", x: 331, y: -120 },
        27: { width: "12.68", height: "726.00", x: 344, y: -120 },
        28: { width: "6.34", height: "726.00", x: 363, y: -120 },
        29: { width: "6.34", height: "726.00", x: 382, y: -120 },
        30: { width: "6.34", height: "726.00", x: 394, y: -120 },
        31: { width: "6.34", height: "726.00", x: 407, y: -120 },
        32: { width: "12.68", height: "726.00", x: 420, y: -120 },
        33: { width: "6.34", height: "726.00", x: 445, y: -120 },
        34: { width: "12.68", height: "726.00", x: 458, y: -120 },
        35: { width: "12.68", height: "726.00", x: 477, y: -120 },
        36: { width: "6.34", height: "726.00", x: 496, y: -120 },
        37: { width: "12.68", height: "726.00", x: 508, y: -120 },
        38: { width: "6.34", height: "726.00", x: 534, y: -120 },
        39: { width: "6.34", height: "726.00", x: 546, y: -120 },
        40: { width: "6.34", height: "726.00", x: 559, y: -120 },
        41: { width: "12.68", height: "726.00", x: 572, y: -120 },
        42: { width: "6.34", height: "726.00", x: 597, y: -120 },
        43: { width: "6.34", height: "726.00", x: 610, y: -120 },
        44: { width: "12.68", height: "726.00", x: 623, y: -120 },
        45: { width: "12.68", height: "726.00", x: 642, y: -120 },
        46: { width: "6.34", height: "726.00", x: 661, y: -120 },
        47: { width: "12.68", height: "726.00", x: 680, y: -120 },
        48: { width: "6.34", height: "726.00", x: 699, y: -120 },
        49: { width: "6.34", height: "726.00", x: 711, y: -120 },
        50: { width: "6.34", height: "740.00", x: 724, y: -120 },
        51: { width: "6.34", height: "740.00", x: 743, y: -120 },
        52: { width: "12.68", height: "740.00", x: 756, y: -120 },
        53: { width: "12.68", height: "740.00", x: 775, y: -120 },
        54: { width: "6.34", height: "740.00", x: 794, y: -120 },
    };
    describe('checking the bar code all lines width height offset x offsety testcase3', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '700px', height: '500px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: -100, right: -100, top: -120, bottom: -120 },
                displayText: { text: 'ABCDABCDABCD', margin: { top: -200, right: 350, left: 350 } },
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the bar code all lines width height offset x offsety testcase3', (done: Function) => {
            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("checking the bar code all lines width height offset x offsety testcase3");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 332 && (children.children[0] as HTMLElement).style.fontSize === '4.8px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                console.log(`${j}: { Math.round(Number(children.children[j + 1].getAttribute('x'))): ${Math.round(Number(children.children[j + 1].getAttribute('x')))}, Math.round(Number(children.children[j + 1].getAttribute('y'))): ${Math.round(Number(children.children[j + 1].getAttribute('y')))}, parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output2[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output2[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output2[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output2[j].height).toBe(true);
            }
            done();
        });
    });
    var output3 = {
        0: { width: "0.28", height: "40.00", x: 30, y: 30 },
        1: { width: "0.28", height: "40.00", x: 31, y: 30 },
        2: { width: "0.56", height: "40.00", x: 31, y: 30 },
        3: { width: "0.56", height: "40.00", x: 32, y: 30 },
        4: { width: "0.28", height: "40.00", x: 33, y: 30 },
        5: { width: "0.28", height: "26.00", x: 34, y: 30 },
        6: { width: "0.56", height: "26.00", x: 34, y: 30 },
        7: { width: "0.28", height: "26.00", x: 35, y: 30 },
        8: { width: "0.28", height: "26.00", x: 36, y: 30 },
        9: { width: "0.56", height: "26.00", x: 36, y: 30 },
        10: { width: "0.56", height: "26.00", x: 37, y: 30 },
        11: { width: "0.28", height: "26.00", x: 38, y: 30 },
        12: { width: "0.28", height: "26.00", x: 39, y: 30 },
        13: { width: "0.28", height: "26.00", x: 40, y: 30 },
        14: { width: "0.56", height: "26.00", x: 40, y: 30 },
        15: { width: "0.56", height: "26.00", x: 41, y: 30 },
        16: { width: "0.28", height: "26.00", x: 42, y: 30 },
        17: { width: "0.28", height: "26.00", x: 42, y: 30 },
        18: { width: "0.56", height: "26.00", x: 43, y: 30 },
        19: { width: "0.28", height: "26.00", x: 44, y: 30 },
        20: { width: "0.56", height: "26.00", x: 45, y: 30 },
        21: { width: "0.56", height: "26.00", x: 45, y: 30 },
        22: { width: "0.28", height: "26.00", x: 46, y: 30 },
        23: { width: "0.28", height: "26.00", x: 47, y: 30 },
        24: { width: "0.28", height: "26.00", x: 48, y: 30 },
        25: { width: "0.56", height: "26.00", x: 48, y: 30 },
        26: { width: "0.28", height: "26.00", x: 49, y: 30 },
        27: { width: "0.56", height: "26.00", x: 50, y: 30 },
        28: { width: "0.28", height: "26.00", x: 51, y: 30 },
        29: { width: "0.28", height: "26.00", x: 51, y: 30 },
        30: { width: "0.28", height: "26.00", x: 52, y: 30 },
        31: { width: "0.28", height: "26.00", x: 53, y: 30 },
        32: { width: "0.56", height: "26.00", x: 53, y: 30 },
        33: { width: "0.28", height: "26.00", x: 54, y: 30 },
        34: { width: "0.56", height: "26.00", x: 55, y: 30 },
        35: { width: "0.56", height: "26.00", x: 56, y: 30 },
        36: { width: "0.28", height: "26.00", x: 56, y: 30 },
        37: { width: "0.56", height: "26.00", x: 57, y: 30 },
        38: { width: "0.28", height: "26.00", x: 58, y: 30 },
        39: { width: "0.28", height: "26.00", x: 59, y: 30 },
        40: { width: "0.28", height: "26.00", x: 59, y: 30 },
        41: { width: "0.56", height: "26.00", x: 60, y: 30 },
        42: { width: "0.28", height: "26.00", x: 61, y: 30 },
        43: { width: "0.28", height: "26.00", x: 62, y: 30 },
        44: { width: "0.56", height: "26.00", x: 62, y: 30 },
        45: { width: "0.56", height: "26.00", x: 63, y: 30 },
        46: { width: "0.28", height: "26.00", x: 64, y: 30 },
        47: { width: "0.56", height: "26.00", x: 65, y: 30 },
        48: { width: "0.28", height: "26.00", x: 65, y: 30 },
        49: { width: "0.28", height: "26.00", x: 66, y: 30 },
        50: { width: "0.28", height: "40.00", x: 67, y: 30 },
        51: { width: "0.28", height: "40.00", x: 67, y: 30 },
        52: { width: "0.56", height: "40.00", x: 68, y: 30 },
        53: { width: "0.56", height: "40.00", x: 69, y: 30 },
        54: { width: "0.28", height: "40.00", x: 70, y: 30 },
    };
    describe('checking the bar code all lines width height offset x offsety testcase4', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '100px', height: '100px',
                type: 'Code39',
                mode: 'SVG',
                value: 'BARCODE',
                margin: { left: 30, right: 30, top: 30, bottom: 30 },
                displayText: { text: 'ABCDABCDABCD', },
            });
            barcode.appendTo('#barcode6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the bar code all lines width height offset x offsety testcase4', (done: Function) => {
            let barcode = document.getElementById('barcode6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log("checking the bar code all lines width height offset x offsety testcase4");
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 34 && (children.children[0] as HTMLElement).style.fontSize === '4.4px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                console.log(`${j}: { Math.round(Number(children.children[j + 1].getAttribute('x'))): ${Math.round(Number(children.children[j + 1].getAttribute('x')))}, Math.round(Number(children.children[j + 1].getAttribute('y'))): ${Math.round(Number(children.children[j + 1].getAttribute('y')))}, parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2): ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output3[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output3[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output3[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output3[j].height).toBe(true);

            }
            done();
        });
    });


});