import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let barcode: BarcodeGenerator;
let ele: HTMLElement;
describe('Code128A - Barcode', () => {

    describe('checking Code128A barcode rendering', () => {

        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '214px', height: '150px',
                type: 'Code128A',
                value: 'AB1234!@#$%',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering', (done: Function) => {

            let barcode = document.getElementById('barcode128A1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(children.childElementCount === 44 && Math.round(Number(children.children[0].getAttribute('x'))) === 40
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 202
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 2).toBe(true);
            done();
        });
    });
    describe('checking Code128A barcode rendering with width in %', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '50%',
                type: 'Code128A',
                value: 'AB1234!@#$%',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering', (done: Function) => {

            let barcode = document.getElementById('barcode128A2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('testcase1')
            console.log(children.childElementCount)
            console.log(Math.round(Number(children.children[0].getAttribute('x'))))
            console.log(Math.round(Number(children.children[1].getAttribute('x'))))
            console.log(Math.round(Number(children.children[1].getAttribute('width'))))
            console.log(Number(children.children[children.childElementCount - 1].getAttribute('x')))
            console.log(Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))))
            expect(children.childElementCount === 44
                && Math.round(Number(children.children[0].getAttribute('x'))) === 123 || Math.round(Number(children.children[0].getAttribute('x'))) === 126 || Math.round(Number(children.children[0].getAttribute('x'))) === 125
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[1].getAttribute('width'))) === 5
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 364 || Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 370 || Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 369
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 5).toBe(true);
            done();
        });
    });
    describe('checking Code128A barcode rendering with positive margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                margin: { left: 30, right: 30, top: 30, bottom: 30 },
                value: 'AB1234!@#$%',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering with positive margin', (done: Function) => {

            let barcode = document.getElementById('barcode128A3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(children.childElementCount === 44
                && Math.round(Number(children.children[0].getAttribute('x'))) === 33
                && Math.round(Number(children.children[1].getAttribute('x'))) === 30
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 168
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[1].getAttribute('height'))) === 27).toBe(true);

            done();
        });
    });
    describe('checking Code128A barcode rendering with negative margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                margin: {
                    left: -30, right: -30,
                    top: -30, bottom: -30
                },
                value: 'AB1234!@#$%',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering with negative margin', (done: Function) => {

            let barcode = document.getElementById('barcode128A3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(children.childElementCount === 44
                && Math.round(Number(children.children[0].getAttribute('x'))) === 33
                && Math.round(Number(children.children[1].getAttribute('x'))) === -30
                && Math.round(Number(children.children[1].getAttribute('width'))) === 3
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 227
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 3
                && Math.round(Number(children.children[1].getAttribute('height'))) === 147).toBe(true);

            done();
        });
    });
    describe('checking Code128A barcode rendering with display text margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A5' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                value: 'AB1234!@#$%',
                foreColor: 'yellow',
                displayText: { margin: { left: 50, right: 50, top: 20, bottom: 20 }, font: 'BOLD', size: 30, text: 'ABC' },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A5');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering with display text margin', (done: Function) => {

            let barcode = document.getElementById('barcode128A5')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(children.childElementCount === 44
                && children.children[0].getAttribute('fill') === 'yellow'
                && children.children[1].getAttribute('fill') === 'yellow'
                && Math.round(Number(children.children[0].getAttribute('x'))) === 69
                && (children.children[0] as HTMLElement).style.fontFamily === 'BOLD'
                && (children.children[0] as HTMLElement).style.fontSize === '30px'
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 188
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[1].getAttribute('height'))) === 22).toBe(true);
            done();
        });
    });
    describe('checking Code128A barcode rendering with display text margin and barcode margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                value: 'AB1234!@#$%',

                margin: {
                    left: 20,
                    right: -20,
                    bottom: -20
                },
                displayText: {
                    margin: {
                        left: 50, right: 50, top: 20,
                        bottom: 20
                    }, font: 'BOLD', size: 30, text: 'ABC'
                },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128A6')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(children.childElementCount === 44
                && children.children[0].getAttribute('fill')
                && children.children[1].getAttribute('fill')
                && Math.round(Number(children.children[0].getAttribute('x'))) === 89
                && (children.children[0] as HTMLElement).style.fontFamily === 'BOLD'
                && (children.children[0] as HTMLElement).style.fontSize === '30px'
                && Math.round(Number(children.children[1].getAttribute('x'))) === 20
                && Math.round(Number(children.children[1].getAttribute('width'))) === 3
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 217
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 3
                && Math.round(Number(children.children[1].getAttribute('height'))) === 52).toBe(true);
            done();
        });
    });
    describe('checking Code128A barcode rendering of invalid Character', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128Ainvalid' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                value: 'Ab1234!@#$%',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128Ainvalid');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking Code128A barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128Ainvalid')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(children.childElementCount === 0).toBe(true);
            done();
        });
    });
    describe('checking Code128A barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A7' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                value: 'AB1234!@#$%',

                margin: {
                    left: 20,
                    right: -20,
                    bottom: -20
                },
                displayText: {
                    margin: {
                        left: 50, right: 50, top: 20,
                        bottom: 20
                    }, font: 'BOLD', size: 30, text: 'ABC'
                },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A7');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.56", height: "51.50", x: 20, y: 10 },
            1: { width: "1.28", height: "51.50", x: 24, y: 10 },
            2: { width: "1.28", height: "51.50", x: 30, y: 10 },
            3: { width: "1.28", height: "51.50", x: 34, y: 10 },
            4: { width: "1.28", height: "51.50", x: 37, y: 10 },
            5: { width: "2.56", height: "51.50", x: 42, y: 10 },
            6: { width: "1.28", height: "51.50", x: 48, y: 10 },
            7: { width: "1.28", height: "51.50", x: 53, y: 10 },
            8: { width: "2.56", height: "51.50", x: 56, y: 10 },
            9: { width: "1.28", height: "51.50", x: 62, y: 10 },
            10: { width: "3.85", height: "51.50", x: 66, y: 10 },
            11: { width: "2.56", height: "51.50", x: 73, y: 10 },
            12: { width: "2.56", height: "51.50", x: 76, y: 10 },
            13: { width: "3.85", height: "51.50", x: 82, y: 10 },
            14: { width: "1.28", height: "51.50", x: 88, y: 10 },
            15: { width: "2.56", height: "51.50", x: 91, y: 10 },
            16: { width: "1.28", height: "51.50", x: 96, y: 10 },
            17: { width: "3.85", height: "51.50", x: 98, y: 10 },
            18: { width: "2.56", height: "51.50", x: 105, y: 10 },
            19: { width: "1.28", height: "51.50", x: 110, y: 10 },
            20: { width: "3.85", height: "51.50", x: 114, y: 10 },
            21: { width: "2.56", height: "51.50", x: 119, y: 10 },
            22: { width: "2.56", height: "51.50", x: 124, y: 10 },
            23: { width: "2.56", height: "51.50", x: 128, y: 10 },
            24: { width: "2.56", height: "51.50", x: 133, y: 10 },
            25: { width: "2.56", height: "51.50", x: 139, y: 10 },
            26: { width: "2.56", height: "51.50", x: 143, y: 10 },
            27: { width: "1.28", height: "51.50", x: 147, y: 10 },
            28: { width: "1.28", height: "51.50", x: 151, y: 10 },
            29: { width: "2.56", height: "51.50", x: 155, y: 10 },
            30: { width: "1.28", height: "51.50", x: 161, y: 10 },
            31: { width: "1.28", height: "51.50", x: 165, y: 10 },
            32: { width: "2.56", height: "51.50", x: 170, y: 10 },
            33: { width: "1.28", height: "51.50", x: 175, y: 10 },
            34: { width: "1.28", height: "51.50", x: 180, y: 10 },
            35: { width: "2.56", height: "51.50", x: 184, y: 10 },
            36: { width: "2.56", height: "51.50", x: 189, y: 10 },
            37: { width: "2.56", height: "51.50", x: 193, y: 10 },
            38: { width: "2.56", height: "51.50", x: 198, y: 10 },
            39: { width: "2.56", height: "51.50", x: 203, y: 10 },
            40: { width: "3.85", height: "51.50", x: 210, y: 10 },
            41: { width: "1.28", height: "51.50", x: 215, y: 10 },
            42: { width: "2.56", height: "51.50", x: 217, y: 10 },
        };
        it('checking Code128A barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128A7')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 89)
                && (children.children[0] as HTMLElement).style.fontSize === '30px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                 expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });

    describe('checking Code128A barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A8' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200',
                type: 'Code128A',
                value: 'AB1234!@#$%',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A8');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.31", height: "66.50", x: 10, y: 10 },
            1: { width: "1.15", height: "66.50", x: 13, y: 10 },
            2: { width: "1.15", height: "66.50", x: 19, y: 10 },
            3: { width: "1.15", height: "66.50", x: 23, y: 10 },
            4: { width: "1.15", height: "66.50", x: 25, y: 10 },
            5: { width: "2.31", height: "66.50", x: 30, y: 10 },
            6: { width: "1.15", height: "66.50", x: 35, y: 10 },
            7: { width: "1.15", height: "66.50", x: 40, y: 10 },
            8: { width: "2.31", height: "66.50", x: 42, y: 10 },
            9: { width: "1.15", height: "66.50", x: 48, y: 10 },
            10: { width: "3.46", height: "66.50", x: 52, y: 10 },
            11: { width: "2.31", height: "66.50", x: 57, y: 10 },
            12: { width: "2.31", height: "66.50", x: 61, y: 10 },
            13: { width: "3.46", height: "66.50", x: 65, y: 10 },
            14: { width: "1.15", height: "66.50", x: 71, y: 10 },
            15: { width: "2.31", height: "66.50", x: 73, y: 10 },
            16: { width: "1.15", height: "66.50", x: 78, y: 10 },
            17: { width: "3.46", height: "66.50", x: 80, y: 10 },
            18: { width: "2.31", height: "66.50", x: 86, y: 10 },
            19: { width: "1.15", height: "66.50", x: 91, y: 10 },
            20: { width: "3.46", height: "66.50", x: 94, y: 10 },
            21: { width: "2.31", height: "66.50", x: 99, y: 10 },
            22: { width: "2.31", height: "66.50", x: 103, y: 10 },
            23: { width: "2.31", height: "66.50", x: 107, y: 10 },
            24: { width: "2.31", height: "66.50", x: 112, y: 10 },
            25: { width: "2.31", height: "66.50", x: 117, y: 10 },
            26: { width: "2.31", height: "66.50", x: 121, y: 10 },
            27: { width: "1.15", height: "66.50", x: 124, y: 10 },
            28: { width: "1.15", height: "66.50", x: 128, y: 10 },
            29: { width: "2.31", height: "66.50", x: 131, y: 10 },
            30: { width: "1.15", height: "66.50", x: 137, y: 10 },
            31: { width: "1.15", height: "66.50", x: 140, y: 10 },
            32: { width: "2.31", height: "66.50", x: 145, y: 10 },
            33: { width: "1.15", height: "66.50", x: 150, y: 10 },
            34: { width: "1.15", height: "66.50", x: 154, y: 10 },
            35: { width: "2.31", height: "66.50", x: 158, y: 10 },
            36: { width: "2.31", height: "66.50", x: 162, y: 10 },
            37: { width: "2.31", height: "66.50", x: 166, y: 10 },
            38: { width: "2.31", height: "66.50", x: 170, y: 10 },
            39: { width: "2.31", height: "66.50", x: 175, y: 10 },
            40: { width: "3.46", height: "66.50", x: 181, y: 10 },
            41: { width: "1.15", height: "66.50", x: 185, y: 10 },
            42: { width: "2.31", height: "66.50", x: 188, y: 10 },
        };
        it('checking Code128A barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128A8')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 33)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128A barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128A8' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '500',
                type: 'Code128A',
                value: '!@#$%%^^&*(ABCD',
                margin: { left: 100, right: 100, top: -100 },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128A8');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "3.00", height: "176.50", x: 100, y: -100 },
            1: { width: "1.50", height: "176.50", x: 105, y: -100 },
            2: { width: "1.50", height: "176.50", x: 112, y: -100 },
            3: { width: "3.00", height: "176.50", x: 117, y: -100 },
            4: { width: "3.00", height: "176.50", x: 123, y: -100 },
            5: { width: "3.00", height: "176.50", x: 127, y: -100 },
            6: { width: "3.00", height: "176.50", x: 133, y: -100 },
            7: { width: "3.00", height: "176.50", x: 141, y: -100 },
            8: { width: "3.00", height: "176.50", x: 145, y: -100 },
            9: { width: "1.50", height: "176.50", x: 150, y: -100 },
            10: { width: "1.50", height: "176.50", x: 154, y: -100 },
            11: { width: "3.00", height: "176.50", x: 159, y: -100 },
            12: { width: "1.50", height: "176.50", x: 166, y: -100 },
            13: { width: "1.50", height: "176.50", x: 171, y: -100 },
            14: { width: "3.00", height: "176.50", x: 177, y: -100 },
            15: { width: "1.50", height: "176.50", x: 183, y: -100 },
            16: { width: "1.50", height: "176.50", x: 189, y: -100 },
            17: { width: "3.00", height: "176.50", x: 193, y: -100 },
            18: { width: "1.50", height: "176.50", x: 199, y: -100 },
            19: { width: "1.50", height: "176.50", x: 205, y: -100 },
            20: { width: "3.00", height: "176.50", x: 210, y: -100 },
            21: { width: "6.00", height: "176.50", x: 216, y: -100 },
            22: { width: "1.50", height: "176.50", x: 226, y: -100 },
            23: { width: "1.50", height: "176.50", x: 229, y: -100 },
            24: { width: "6.00", height: "176.50", x: 232, y: -100 },
            25: { width: "1.50", height: "176.50", x: 243, y: -100 },
            26: { width: "1.50", height: "176.50", x: 246, y: -100 },
            27: { width: "1.50", height: "176.50", x: 249, y: -100 },
            28: { width: "3.00", height: "176.50", x: 253, y: -100 },
            29: { width: "1.50", height: "176.50", x: 259, y: -100 },
            30: { width: "3.00", height: "176.50", x: 265, y: -100 },
            31: { width: "1.50", height: "176.50", x: 271, y: -100 },
            32: { width: "1.50", height: "176.50", x: 277, y: -100 },
            33: { width: "1.50", height: "176.50", x: 282, y: -100 },
            34: { width: "3.00", height: "176.50", x: 288, y: -100 },
            35: { width: "1.50", height: "176.50", x: 294, y: -100 },
            36: { width: "1.50", height: "176.50", x: 298, y: -100 },
            37: { width: "1.50", height: "176.50", x: 301, y: -100 },
            38: { width: "3.00", height: "176.50", x: 307, y: -100 },
            39: { width: "1.50", height: "176.50", x: 315, y: -100 },
            40: { width: "1.50", height: "176.50", x: 321, y: -100 },
            41: { width: "3.00", height: "176.50", x: 324, y: -100 },
            42: { width: "1.50", height: "176.50", x: 331, y: -100 },
            43: { width: "1.50", height: "176.50", x: 337, y: -100 },
            44: { width: "3.00", height: "176.50", x: 343, y: -100 },
            45: { width: "1.50", height: "176.50", x: 348, y: -100 },
            46: { width: "3.00", height: "176.50", x: 351, y: -100 },
            47: { width: "1.50", height: "176.50", x: 358, y: -100 },
            48: { width: "1.50", height: "176.50", x: 364, y: -100 },
            49: { width: "6.00", height: "176.50", x: 367, y: -100 },
            50: { width: "1.50", height: "176.50", x: 375, y: -100 },
            51: { width: "3.00", height: "176.50", x: 381, y: -100 },
            52: { width: "4.50", height: "176.50", x: 388, y: -100 },
            53: { width: "1.50", height: "176.50", x: 394, y: -100 },
            54: { width: "3.00", height: "176.50", x: 397, y: -100 },
        };
        it('checking Code128A barcode rendering with display text margin and barcode margin', (done: Function) => {
            let barcode = document.getElementById('barcode128A8')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 160)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                 expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
});