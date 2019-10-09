import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let barcode: BarcodeGenerator;
let ele: HTMLElement;
describe('Barcode Control ', () => {
    describe('EAN8 bar testing for all lines check  EAN8 barcode', () => {
        
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                displayText: { alignment: 'Right', position: 'Top' },
                type: 'Ean8',
                value: '11223344',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.47", height: "116.50", x: 10, y: 24 },
            1: { width: "2.47", height: "116.50", x: 15, y: 24 },
            2: { width: "4.93", height: "103.00", x: 25, y: 24 },
            3: { width: "2.47", height: "103.00", x: 35, y: 24 },
            4: { width: "4.93", height: "103.00", x: 42, y: 24 },
            5: { width: "2.47", height: "103.00", x: 52, y: 24 },
            6: { width: "2.47", height: "103.00", x: 59, y: 24 },
            7: { width: "4.93", height: "103.00", x: 67, y: 24 },
            8: { width: "2.47", height: "103.00", x: 77, y: 24 },
            9: { width: "4.93", height: "103.00", x: 84, y: 24 },
            10: { width: "2.47", height: "116.50", x: 94, y: 24 },
            11: { width: "2.47", height: "116.50", x: 99, y: 24 },
            12: { width: "2.47", height: "103.00", x: 106, y: 24 },
            13: { width: "2.47", height: "103.00", x: 118, y: 24 },
            14: { width: "2.47", height: "103.00", x: 123, y: 24 },
            15: { width: "2.47", height: "103.00", x: 136, y: 24 },
            16: { width: "2.47", height: "103.00", x: 141, y: 24 },
            17: { width: "7.40", height: "103.00", x: 146, y: 24 },
            18: { width: "2.47", height: "103.00", x: 158, y: 24 },
            19: { width: "7.40", height: "103.00", x: 163, y: 24 },
            20: { width: "2.47", height: "116.50", x: 178, y: 24 },
            21: { width: "2.47", height: "116.50", x: 183, y: 24 },
        };
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 41
                && Math.round(Number(children.children[1].getAttribute('x'))) === 127 &&
                (children.children[0] as HTMLElement).style.fontSize === '20px'
                && Math.round(Number(children.children[0].getAttribute('y'))) === 22
                && Math.round(Number(children.children[1].getAttribute('y'))) === 22).toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                expect(Math.round(Number(children.children[j + 2].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 2].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 2].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 2].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            
            done();
        });
    });
    describe('EAN8 bar testing for all lines check  EAN8 barcode invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Ean8',
                value: '11223344223r343',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {

            done();
        });
    });
    describe('EAN8 bar testing for all lines check  EAN8 barcode invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Ean8',
                value: '1',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {

            done();
        });
    });
    describe('EAN8 bar testing for all lines check  EAN8 barcode invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Ean8',
                value: '1',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {

            done();
        });
    });
    describe('EAN13 bar testing for all lines check  EAN13 barcode', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Ean13',
                margin: { left: 20 },
                displayText: { alignment: 'Right', position: 'Top' },
                value: '9735940564824',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "1.68", height: "116.50", x: 20, y: 24 },
            1: { width: "1.68", height: "116.50", x: 23, y: 24 },
            2: { width: "5.05", height: "103.00", x: 28, y: 24 },
            3: { width: "3.37", height: "103.00", x: 35, y: 24 },
            4: { width: "1.68", height: "103.00", x: 40, y: 24 },
            5: { width: "1.68", height: "103.00", x: 49, y: 24 },
            6: { width: "5.05", height: "103.00", x: 52, y: 24 },
            7: { width: "1.68", height: "103.00", x: 60, y: 24 },
            8: { width: "1.68", height: "103.00", x: 67, y: 24 },
            9: { width: "3.37", height: "103.00", x: 70, y: 24 },
            10: { width: "5.05", height: "103.00", x: 77, y: 24 },
            11: { width: "1.68", height: "103.00", x: 84, y: 24 },
            12: { width: "3.37", height: "103.00", x: 91, y: 24 },
            13: { width: "1.68", height: "103.00", x: 96, y: 24 },
            14: { width: "1.68", height: "116.50", x: 101, y: 24 },
            15: { width: "1.68", height: "116.50", x: 106, y: 24 },
            16: { width: "1.68", height: "103.00", x: 111, y: 24 },
            17: { width: "5.05", height: "103.00", x: 116, y: 24 },
            18: { width: "1.68", height: "103.00", x: 123, y: 24 },
            19: { width: "1.68", height: "103.00", x: 126, y: 24 },
            20: { width: "1.68", height: "103.00", x: 134, y: 24 },
            21: { width: "5.05", height: "103.00", x: 138, y: 24 },
            22: { width: "1.68", height: "103.00", x: 146, y: 24 },
            23: { width: "1.68", height: "103.00", x: 151, y: 24 },
            24: { width: "3.37", height: "103.00", x: 158, y: 24 },
            25: { width: "3.37", height: "103.00", x: 163, y: 24 },
            26: { width: "1.68", height: "103.00", x: 170, y: 24 },
            27: { width: "5.05", height: "103.00", x: 173, y: 24 },
            28: { width: "1.68", height: "116.50", x: 183, y: 24 },
            29: { width: "1.68", height: "116.50", x: 187, y: 24 },
        };
        it('EAN13 bar testing for all lines check  EAN13 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 0 && Math.round(Number(children.children[2].getAttribute('y'))) === 22
                && Math.round(Number(children.children[1].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('y'))) === 22 && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (var j = 0; j < children.children.length - 3; j++) {
                expect(Math.round(Number(children.children[j + 3].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 3].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 3].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 3].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            done();
        });
    });
    describe('EAN13 bar testing for all lines check  EAN13 barcode invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Ean13',
                margin: { left: 20 },
                value: '1',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('EAN13 bar testing for all lines check  EAN13 barcode', (done: Function) => {
            done();
        });
    });


    describe('upcA bar testing for all lines check  upcA barcode', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'UpcA',
                margin: { left: 20 },
                displayText: { position: 'Top', alignment: 'Right' },
                value: '72527273070',
                //value: '043100750246',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "1.43", height: "116.50", x: 31, y: 24 },
            1: { width: "1.43", height: "116.50", x: 34, y: 24 },
            2: { width: "4.29", height: "116.50", x: 37, y: 24 },
            3: { width: "2.86", height: "116.50", x: 43, y: 24 },
            4: { width: "1.43", height: "103.00", x: 49, y: 24 },
            5: { width: "2.86", height: "103.00", x: 53, y: 24 },
            6: { width: "2.86", height: "103.00", x: 57, y: 24 },
            7: { width: "1.43", height: "103.00", x: 64, y: 24 },
            8: { width: "1.43", height: "103.00", x: 69, y: 24 },
            9: { width: "2.86", height: "103.00", x: 73, y: 24 },
            10: { width: "4.29", height: "103.00", x: 77, y: 24 },
            11: { width: "2.86", height: "103.00", x: 83, y: 24 },
            12: { width: "1.43", height: "103.00", x: 89, y: 24 },
            13: { width: "2.86", height: "103.00", x: 93, y: 24 },
            14: { width: "1.43", height: "116.50", x: 97, y: 24 },
            15: { width: "1.43", height: "116.50", x: 100, y: 24 },
            16: { width: "1.43", height: "103.00", x: 103, y: 24 },
            17: { width: "1.43", height: "103.00", x: 109, y: 24 },
            18: { width: "1.43", height: "103.00", x: 113, y: 24 },
            19: { width: "1.43", height: "103.00", x: 120, y: 24 },
            20: { width: "4.29", height: "103.00", x: 123, y: 24 },
            21: { width: "1.43", height: "103.00", x: 130, y: 24 },
            22: { width: "1.43", height: "103.00", x: 133, y: 24 },
            23: { width: "1.43", height: "103.00", x: 139, y: 24 },
            24: { width: "4.29", height: "103.00", x: 143, y: 24 },
            25: { width: "1.43", height: "103.00", x: 150, y: 24 },
            26: { width: "1.43", height: "116.50", x: 153, y: 24 },
            27: { width: "1.43", height: "116.50", x: 156, y: 24 },
            28: { width: "1.43", height: "116.50", x: 163, y: 24 },
            29: { width: "1.43", height: "116.50", x: 166, y: 24 },
        };
        it('upcA bar testing for all lines check  upcA barcode', (done: Function) => {
            let barcode = document.getElementById('codabar3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(Math.round(Number(children.children[1].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('x'))) === 43
                && (children.children[0] as HTMLElement).style.fontSize === '14.6px').toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                expect(Math.round(Number(children.children[j + 2].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 2].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 2].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 2].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            done();
        });
    });
    describe('upcA bar testing for all lines check  upcA barcode invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'UpcA',
                margin: { left: 20 },
                value: '72527273070a3dd',
                //value: '043100750246',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('upcA bar testing for all lines check  upcA barcode', (done: Function) => {
            done();
        });
    });

    describe('upcE bar testing for all lines check  upcE barcode', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'UpcE',
                displayText: { alignment: 'Right', position: 'Top' },
                value: '123456',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.54", height: "116.50", x: 30, y: 24 },
            1: { width: "2.54", height: "116.50", x: 35, y: 24 },
            2: { width: "5.07", height: "103.00", x: 40, y: 24 },
            3: { width: "5.07", height: "103.00", x: 51, y: 24 },
            4: { width: "2.54", height: "103.00", x: 61, y: 24 },
            5: { width: "5.07", height: "103.00", x: 68, y: 24 },
            6: { width: "10.14", height: "103.00", x: 76, y: 24 },
            7: { width: "2.54", height: "103.00", x: 89, y: 24 },
            8: { width: "7.61", height: "103.00", x: 96, y: 24 },
            9: { width: "2.54", height: "103.00", x: 106, y: 24 },
            10: { width: "7.61", height: "103.00", x: 111, y: 24 },
            11: { width: "2.54", height: "103.00", x: 124, y: 24 },
            12: { width: "2.54", height: "103.00", x: 129, y: 24 },
            13: { width: "10.14", height: "103.00", x: 134, y: 24 },
            14: { width: "2.54", height: "116.50", x: 147, y: 24 },
            15: { width: "2.54", height: "116.50", x: 152, y: 24 },
            16: { width: "2.54", height: "116.50", x: 160, y: 24 },
        };
        it('upcE bar testing for all lines check  upcE barcode', (done: Function) => {
            let barcode = document.getElementById('codabar4')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            
            expect(Math.round(Number(children.children[0].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('x'))) === 51).toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j + 1].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });

    describe('upcE bar testing for all lines check  upcE barcode disable checksum', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'UpcE',
                enableCheckSum: false,
                displayText: { alignment: 'Right', position: 'Top' },
                value: '123456',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('upcE bar testing for all lines check  upcE barcode disable checksum', (done: Function) => {
            done();
        });
    });


});