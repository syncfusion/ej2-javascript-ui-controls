import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let barcode: BarcodeGenerator;
        let ele: HTMLElement;
describe('Code128C - Barcode', () => {

    describe('checking Code128C barcode rendering all lines check', () => {
        
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128C1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '114px', height: '150px',
                type: 'Code128C',
                value: '11223344',
                mode:'SVG'
            });
            barcode.appendTo('#barcode128C1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.38", height: "116.50", x: 10, y: 10 },
            1: { width: "1.19", height: "116.50", x: 14, y: 10 },
            2: { width: "3.57", height: "116.50", x: 17, y: 10 },
            3: { width: "2.38", height: "116.50", x: 23, y: 10 },
            4: { width: "1.19", height: "116.50", x: 29, y: 10 },
            5: { width: "1.19", height: "116.50", x: 33, y: 10 },
            6: { width: "2.38", height: "116.50", x: 36, y: 10 },
            7: { width: "3.57", height: "116.50", x: 41, y: 10 },
            8: { width: "1.19", height: "116.50", x: 46, y: 10 },
            9: { width: "1.19", height: "116.50", x: 49, y: 10 },
            10: { width: "1.19", height: "116.50", x: 52, y: 10 },
            11: { width: "2.38", height: "116.50", x: 56, y: 10 },
            12: { width: "1.19", height: "116.50", x: 62, y: 10 },
            13: { width: "2.38", height: "116.50", x: 67, y: 10 },
            14: { width: "3.57", height: "116.50", x: 71, y: 10 },
            15: { width: "3.57", height: "116.50", x: 75, y: 10 },
            16: { width: "2.38", height: "116.50", x: 80, y: 10 },
            17: { width: "3.57", height: "116.50", x: 84, y: 10 },
            18: { width: "2.38", height: "116.50", x: 89, y: 10 },
            19: { width: "3.57", height: "116.50", x: 94, y: 10 },
            20: { width: "1.19", height: "116.50", x: 99, y: 10 },
            21: { width: "2.38", height: "116.50", x: 102, y: 10 },
        };
        it('checking Code128C barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128C1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 9)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128C barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128C1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '214px', height: '150px',
                type: 'Code128C',
                margin:{left:30,right:30,top:30,bottom:30},
                value: '123456789198765432',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128C1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.30", height: "76.50", x: 30, y: 30 },
            1: { width: "1.15", height: "76.50", x: 33, y: 30 },
            2: { width: "3.45", height: "76.50", x: 37, y: 30 },
            3: { width: "1.15", height: "76.50", x: 43, y: 30 },
            4: { width: "2.30", height: "76.50", x: 45, y: 30 },
            5: { width: "3.45", height: "76.50", x: 50, y: 30 },
            6: { width: "1.15", height: "76.50", x: 55, y: 30 },
            7: { width: "1.15", height: "76.50", x: 60, y: 30 },
            8: { width: "2.30", height: "76.50", x: 62, y: 30 },
            9: { width: "3.45", height: "76.50", x: 68, y: 30 },
            10: { width: "1.15", height: "76.50", x: 75, y: 30 },
            11: { width: "2.30", height: "76.50", x: 77, y: 30 },
            12: { width: "2.30", height: "76.50", x: 81, y: 30 },
            13: { width: "1.15", height: "76.50", x: 87, y: 30 },
            14: { width: "1.15", height: "76.50", x: 90, y: 30 },
            15: { width: "4.60", height: "76.50", x: 93, y: 30 },
            16: { width: "2.30", height: "76.50", x: 99, y: 30 },
            17: { width: "2.30", height: "76.50", x: 102, y: 30 },
            18: { width: "4.60", height: "76.50", x: 106, y: 30 },
            19: { width: "1.15", height: "76.50", x: 112, y: 30 },
            20: { width: "1.15", height: "76.50", x: 116, y: 30 },
            21: { width: "2.30", height: "76.50", x: 118, y: 30 },
            22: { width: "1.15", height: "76.50", x: 123, y: 30 },
            23: { width: "1.15", height: "76.50", x: 125, y: 30 },
            24: { width: "3.45", height: "76.50", x: 131, y: 30 },
            25: { width: "1.15", height: "76.50", x: 136, y: 30 },
            26: { width: "2.30", height: "76.50", x: 138, y: 30 },
            27: { width: "2.30", height: "76.50", x: 144, y: 30 },
            28: { width: "2.30", height: "76.50", x: 150, y: 30 },
            29: { width: "2.30", height: "76.50", x: 153, y: 30 },
            30: { width: "2.30", height: "76.50", x: 156, y: 30 },
            31: { width: "1.15", height: "76.50", x: 161, y: 30 },
            32: { width: "1.15", height: "76.50", x: 163, y: 30 },
            33: { width: "2.30", height: "76.50", x: 169, y: 30 },
            34: { width: "3.45", height: "76.50", x: 175, y: 30 },
            35: { width: "1.15", height: "76.50", x: 179, y: 30 },
            36: { width: "2.30", height: "76.50", x: 182, y: 30 },
        };
        it('checking Code128C barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128C1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === -1)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            done();
        });
    });
    describe('checking Code128C barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128C1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '214px', height: '150px',
                type: 'Code128C',
                margin:{left:30,right:30,top:30,bottom:30},
                value: '123456789198765432',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128C1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: {width: "2.30", height: "76.50", x: 30, y: 30},
            1: {width: "1.15", height: "76.50", x: 33, y: 30},
            2: {width: "3.45", height: "76.50", x: 37, y: 30},
            3: {width: "1.15", height: "76.50", x: 43, y: 30},
            4: {width: "2.30", height: "76.50", x: 45, y: 30},
            5: {width: "3.45", height: "76.50", x: 50, y: 30},
            6: {width: "1.15", height: "76.50", x: 55, y: 30},
            7: {width: "1.15", height: "76.50", x: 60, y: 30},
            8: {width: "2.30", height: "76.50", x: 62, y: 30},
            9: {width: "3.45", height: "76.50", x: 68, y: 30},
            10: {width: "1.15", height: "76.50", x: 75, y: 30},
            11: {width: "2.30", height: "76.50", x: 77, y: 30},
            12: {width: "2.30", height: "76.50", x: 81, y: 30},
            13: {width: "1.15", height: "76.50", x: 87, y: 30},
            14: {width: "1.15", height: "76.50", x: 90, y: 30},
            15: {width: "4.60", height: "76.50", x: 93, y: 30},
            16: {width: "2.30", height: "76.50", x: 99, y: 30},
            17: {width: "2.30", height: "76.50", x: 102, y: 30},
            18: {width: "4.60", height: "76.50", x: 106, y: 30},
            19: {width: "1.15", height: "76.50", x: 112, y: 30},
            20: {width: "1.15", height: "76.50", x: 116, y: 30},
            21: {width: "2.30", height: "76.50", x: 118, y: 30},
            22: {width: "1.15", height: "76.50", x: 123, y: 30},
            23: {width: "1.15", height: "76.50", x: 125, y: 30},
            24: {width: "3.45", height: "76.50", x: 131, y: 30},
            25: {width: "1.15", height: "76.50", x: 136, y: 30},
            26: {width: "2.30", height: "76.50", x: 138, y: 30},
            27: {width: "2.30", height: "76.50", x: 144, y: 30},
            28: {width: "2.30", height: "76.50", x: 150, y: 30},
            29: {width: "2.30", height: "76.50", x: 153, y: 30},
            30: {width: "2.30", height: "76.50", x: 156, y: 30},
            31: {width: "1.15", height: "76.50", x: 161, y: 30},
            32: {width: "1.15", height: "76.50", x: 163, y: 30},
            33: {width: "2.30", height: "76.50", x: 169, y: 30},
            34: {width: "3.45", height: "76.50", x: 175, y: 30},
            35: {width: "1.15", height: "76.50", x: 179, y: 30},
            36: {width: "2.30", height: "76.50", x: 182, y: 30},
        };
        it('checking Code128C barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128C1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === -1)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);


            }
            done();
        });
    });
    describe('checking Code128C barcode rendering invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128invalid' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '214px', height: '150px',
                type: 'Code128C',
                value: '12345678919876543',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128invalid');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128C barcode rendering invalid character', (done: Function) => {

            let barcode = document.getElementById('barcode128invalid')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            //error
            expect(children.childElementCount===0).toBe(true);

            done();
        });
    });
});