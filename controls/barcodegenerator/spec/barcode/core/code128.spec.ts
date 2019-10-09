import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let barcode: BarcodeGenerator;
let ele: HTMLElement;
describe('Code128 - Barcode', () => {

    describe('checking Code128 barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '414px', height: '150px',
                type: 'Code128',
                value: '1122abcdEFGH11223344',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
                0: { width: "3.73", height: "116.50", x: 10, y: 10 },
                1: { width: "1.87", height: "116.50", x: 16, y: 10 },
                2: { width: "5.60", height: "116.50", x: 21, y: 10 },
                3: { width: "3.73", height: "116.50", x: 31, y: 10 },
                4: { width: "1.87", height: "116.50", x: 40, y: 10 },
                5: { width: "1.87", height: "116.50", x: 45, y: 10 },
                6: { width: "3.73", height: "116.50", x: 51, y: 10 },
                7: { width: "5.60", height: "116.50", x: 59, y: 10 },
                8: { width: "1.87", height: "116.50", x: 66, y: 10 },
                9: { width: "1.87", height: "116.50", x: 72, y: 10 },
                10: { width: "7.47", height: "116.50", x: 75, y: 10 },
                11: { width: "5.60", height: "116.50", x: 85, y: 10 },
                12: { width: "1.87", height: "116.50", x: 92, y: 10 },
                13: { width: "1.87", height: "116.50", x: 98, y: 10 },
                14: { width: "3.73", height: "116.50", x: 101, y: 10 },
                15: { width: "1.87", height: "116.50", x: 113, y: 10 },
                16: { width: "1.87", height: "116.50", x: 118, y: 10 },
                17: { width: "3.73", height: "116.50", x: 128, y: 10 },
                18: { width: "1.87", height: "116.50", x: 133, y: 10 },
                19: { width: "1.87", height: "116.50", x: 143, y: 10 },
                20: { width: "3.73", height: "116.50", x: 146, y: 10 },
                21: { width: "1.87", height: "116.50", x: 154, y: 10 },
                22: { width: "1.87", height: "116.50", x: 163, y: 10 },
                23: { width: "3.73", height: "116.50", x: 169, y: 10 },
                24: { width: "1.87", height: "116.50", x: 174, y: 10 },
                25: { width: "3.73", height: "116.50", x: 182, y: 10 },
                26: { width: "1.87", height: "116.50", x: 187, y: 10 },
                27: { width: "1.87", height: "116.50", x: 195, y: 10 },
                28: { width: "3.73", height: "116.50", x: 202, y: 10 },
                29: { width: "1.87", height: "116.50", x: 212, y: 10 },
                30: { width: "3.73", height: "116.50", x: 215, y: 10 },
                31: { width: "1.87", height: "116.50", x: 221, y: 10 },
                32: { width: "1.87", height: "116.50", x: 228, y: 10 },
                33: { width: "3.73", height: "116.50", x: 236, y: 10 },
                34: { width: "1.87", height: "116.50", x: 245, y: 10 },
                35: { width: "1.87", height: "116.50", x: 249, y: 10 },
                36: { width: "1.87", height: "116.50", x: 256, y: 10 },
                37: { width: "5.60", height: "116.50", x: 260, y: 10 },
                38: { width: "7.47", height: "116.50", x: 268, y: 10 },
                39: { width: "3.73", height: "116.50", x: 277, y: 10 },
                40: { width: "1.87", height: "116.50", x: 286, y: 10 },
                41: { width: "1.87", height: "116.50", x: 292, y: 10 },
                42: { width: "3.73", height: "116.50", x: 298, y: 10 },
                43: { width: "5.60", height: "116.50", x: 305, y: 10 },
                44: { width: "1.87", height: "116.50", x: 313, y: 10 },
                45: { width: "1.87", height: "116.50", x: 318, y: 10 },
                46: { width: "1.87", height: "116.50", x: 322, y: 10 },
                47: { width: "3.73", height: "116.50", x: 329, y: 10 },
                48: { width: "1.87", height: "116.50", x: 339, y: 10 },
                49: { width: "3.73", height: "116.50", x: 346, y: 10 },
                50: { width: "5.60", height: "116.50", x: 352, y: 10 },
                51: { width: "5.60", height: "116.50", x: 359, y: 10 },
                52: { width: "1.87", height: "116.50", x: 367, y: 10 },
                53: { width: "3.73", height: "116.50", x: 370, y: 10 },
                54: { width: "3.73", height: "116.50", x: 380, y: 10 },
                55: { width: "5.60", height: "116.50", x: 389, y: 10 },
                56: { width: "1.87", height: "116.50", x: 397, y: 10 },
                57: { width: "3.73", height: "116.50", x: 400, y: 10 },
            };
        it('checking Code128 barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 87)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128 barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '414px', height: '150px',
                type: 'Code128',
                value: '!@#$%^&*()aa1122BBcC',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "3.09", height: "116.50", x: 10, y: 10 },
            1: { width: "1.55", height: "116.50", x: 15, y: 10 },
            2: { width: "1.55", height: "116.50", x: 19, y: 10 },
            3: { width: "3.09", height: "116.50", x: 27, y: 10 },
            4: { width: "3.09", height: "116.50", x: 33, y: 10 },
            5: { width: "3.09", height: "116.50", x: 38, y: 10 },
            6: { width: "3.09", height: "116.50", x: 44, y: 10 },
            7: { width: "3.09", height: "116.50", x: 52, y: 10 },
            8: { width: "3.09", height: "116.50", x: 56, y: 10 },
            9: { width: "1.55", height: "116.50", x: 61, y: 10 },
            10: { width: "1.55", height: "116.50", x: 66, y: 10 },
            11: { width: "3.09", height: "116.50", x: 70, y: 10 },
            12: { width: "1.55", height: "116.50", x: 78, y: 10 },
            13: { width: "1.55", height: "116.50", x: 83, y: 10 },
            14: { width: "3.09", height: "116.50", x: 89, y: 10 },
            15: { width: "1.55", height: "116.50", x: 95, y: 10 },
            16: { width: "1.55", height: "116.50", x: 101, y: 10 },
            17: { width: "3.09", height: "116.50", x: 106, y: 10 },
            18: { width: "6.18", height: "116.50", x: 112, y: 10 },
            19: { width: "1.55", height: "116.50", x: 123, y: 10 },
            20: { width: "1.55", height: "116.50", x: 126, y: 10 },
            21: { width: "1.55", height: "116.50", x: 129, y: 10 },
            22: { width: "3.09", height: "116.50", x: 134, y: 10 },
            23: { width: "1.55", height: "116.50", x: 140, y: 10 },
            24: { width: "3.09", height: "116.50", x: 146, y: 10 },
            25: { width: "1.55", height: "116.50", x: 152, y: 10 },
            26: { width: "1.55", height: "116.50", x: 158, y: 10 },
            27: { width: "1.55", height: "116.50", x: 163, y: 10 },
            28: { width: "3.09", height: "116.50", x: 169, y: 10 },
            29: { width: "1.55", height: "116.50", x: 175, y: 10 },
            30: { width: "3.09", height: "116.50", x: 180, y: 10 },
            31: { width: "1.55", height: "116.50", x: 186, y: 10 },
            32: { width: "1.55", height: "116.50", x: 191, y: 10 },
            33: { width: "1.55", height: "116.50", x: 197, y: 10 },
            34: { width: "1.55", height: "116.50", x: 202, y: 10 },
            35: { width: "3.09", height: "116.50", x: 205, y: 10 },
            36: { width: "1.55", height: "116.50", x: 214, y: 10 },
            37: { width: "1.55", height: "116.50", x: 219, y: 10 },
            38: { width: "3.09", height: "116.50", x: 222, y: 10 },
            39: { width: "1.55", height: "116.50", x: 231, y: 10 },
            40: { width: "4.64", height: "116.50", x: 234, y: 10 },
            41: { width: "6.18", height: "116.50", x: 240, y: 10 },
            42: { width: "3.09", height: "116.50", x: 248, y: 10 },
            43: { width: "1.55", height: "116.50", x: 256, y: 10 },
            44: { width: "1.55", height: "116.50", x: 260, y: 10 },
            45: { width: "3.09", height: "116.50", x: 265, y: 10 },
            46: { width: "4.64", height: "116.50", x: 271, y: 10 },
            47: { width: "1.55", height: "116.50", x: 277, y: 10 },
            48: { width: "1.55", height: "116.50", x: 282, y: 10 },
            49: { width: "6.18", height: "116.50", x: 285, y: 10 },
            50: { width: "4.64", height: "116.50", x: 293, y: 10 },
            51: { width: "1.55", height: "116.50", x: 299, y: 10 },
            52: { width: "1.55", height: "116.50", x: 305, y: 10 },
            53: { width: "3.09", height: "116.50", x: 308, y: 10 },
            54: { width: "1.55", height: "116.50", x: 316, y: 10 },
            55: { width: "1.55", height: "116.50", x: 322, y: 10 },
            56: { width: "3.09", height: "116.50", x: 325, y: 10 },
            57: { width: "1.55", height: "116.50", x: 333, y: 10 },
            58: { width: "1.55", height: "116.50", x: 341, y: 10 },
            59: { width: "3.09", height: "116.50", x: 344, y: 10 },
            60: { width: "1.55", height: "116.50", x: 350, y: 10 },
            61: { width: "1.55", height: "116.50", x: 356, y: 10 },
            62: { width: "3.09", height: "116.50", x: 362, y: 10 },
            63: { width: "1.55", height: "116.50", x: 367, y: 10 },
            64: { width: "4.64", height: "116.50", x: 370, y: 10 },
            65: { width: "3.09", height: "116.50", x: 379, y: 10 },
            66: { width: "3.09", height: "116.50", x: 384, y: 10 },
            67: { width: "4.64", height: "116.50", x: 392, y: 10 },
            68: { width: "1.55", height: "116.50", x: 398, y: 10 },
            69: { width: "3.09", height: "116.50", x: 401, y: 10 },
        };
        it('checking Code128 barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode128')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 87)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128 barcode rendering all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1283' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '414px', height: '150px',
                type: 'Code128',
                value: '!@#$%^&*()aa1122BBcC',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode1283');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: {width: "3.09", height: "116.50", x: 10, y: 10},
            1: {width: "1.55", height: "116.50", x: 15, y: 10},
            2: {width: "1.55", height: "116.50", x: 19, y: 10},
            3: {width: "3.09", height: "116.50", x: 27, y: 10},
            4: {width: "3.09", height: "116.50", x: 33, y: 10},
            5: {width: "3.09", height: "116.50", x: 38, y: 10},
            6: {width: "3.09", height: "116.50", x: 44, y: 10},
            7: {width: "3.09", height: "116.50", x: 52, y: 10},
            8: {width: "3.09", height: "116.50", x: 56, y: 10},
            9: {width: "1.55", height: "116.50", x: 61, y: 10},
            10: {width: "1.55", height: "116.50", x: 66, y: 10},
            11: {width: "3.09", height: "116.50", x: 70, y: 10},
            12: {width: "1.55", height: "116.50", x: 78, y: 10},
            13: {width: "1.55", height: "116.50", x: 83, y: 10},
            14: {width: "3.09", height: "116.50", x: 89, y: 10},
            15: {width: "1.55", height: "116.50", x: 95, y: 10},
            16: {width: "1.55", height: "116.50", x: 101, y: 10},
            17: {width: "3.09", height: "116.50", x: 106, y: 10},
            18: {width: "6.18", height: "116.50", x: 112, y: 10},
            19: {width: "1.55", height: "116.50", x: 123, y: 10},
            20: {width: "1.55", height: "116.50", x: 126, y: 10},
            21: {width: "1.55", height: "116.50", x: 129, y: 10},
            22: {width: "3.09", height: "116.50", x: 134, y: 10},
            23: {width: "1.55", height: "116.50", x: 140, y: 10},
            24: {width: "3.09", height: "116.50", x: 146, y: 10},
            25: {width: "1.55", height: "116.50", x: 152, y: 10},
            26: {width: "1.55", height: "116.50", x: 158, y: 10},
            27: {width: "1.55", height: "116.50", x: 163, y: 10},
            28: {width: "3.09", height: "116.50", x: 169, y: 10},
            29: {width: "1.55", height: "116.50", x: 175, y: 10},
            30: {width: "3.09", height: "116.50", x: 180, y: 10},
            31: {width: "1.55", height: "116.50", x: 186, y: 10},
            32: {width: "1.55", height: "116.50", x: 191, y: 10},
            33: {width: "1.55", height: "116.50", x: 197, y: 10},
            34: {width: "1.55", height: "116.50", x: 202, y: 10},
            35: {width: "3.09", height: "116.50", x: 205, y: 10},
            36: {width: "1.55", height: "116.50", x: 214, y: 10},
            37: {width: "1.55", height: "116.50", x: 219, y: 10},
            38: {width: "3.09", height: "116.50", x: 222, y: 10},
            39: {width: "1.55", height: "116.50", x: 231, y: 10},
            40: {width: "4.64", height: "116.50", x: 234, y: 10},
            41: {width: "6.18", height: "116.50", x: 240, y: 10},
            42: {width: "3.09", height: "116.50", x: 248, y: 10},
            43: {width: "1.55", height: "116.50", x: 256, y: 10},
            44: {width: "1.55", height: "116.50", x: 260, y: 10},
            45: {width: "3.09", height: "116.50", x: 265, y: 10},
            46: {width: "4.64", height: "116.50", x: 271, y: 10},
            47: {width: "1.55", height: "116.50", x: 277, y: 10},
            48: {width: "1.55", height: "116.50", x: 282, y: 10},
            49: {width: "6.18", height: "116.50", x: 285, y: 10},
            50: {width: "4.64", height: "116.50", x: 293, y: 10},
            51: {width: "1.55", height: "116.50", x: 299, y: 10},
            52: {width: "1.55", height: "116.50", x: 305, y: 10},
            53: {width: "3.09", height: "116.50", x: 308, y: 10},
            54: {width: "1.55", height: "116.50", x: 316, y: 10},
            55: {width: "1.55", height: "116.50", x: 322, y: 10},
            56: {width: "3.09", height: "116.50", x: 325, y: 10},
            57: {width: "1.55", height: "116.50", x: 333, y: 10},
            58: {width: "1.55", height: "116.50", x: 341, y: 10},
            59: {width: "3.09", height: "116.50", x: 344, y: 10},
            60: {width: "1.55", height: "116.50", x: 350, y: 10},
            61: {width: "1.55", height: "116.50", x: 356, y: 10},
            62: {width: "3.09", height: "116.50", x: 362, y: 10},
            63: {width: "1.55", height: "116.50", x: 367, y: 10},
            64: {width: "4.64", height: "116.50", x: 370, y: 10},
            65: {width: "3.09", height: "116.50", x: 379, y: 10},
            66: {width: "3.09", height: "116.50", x: 384, y: 10},
            67: {width: "4.64", height: "116.50", x: 392, y: 10},
            68: {width: "1.55", height: "116.50", x: 398, y: 10},
            69: {width: "3.09", height: "116.50", x: 401, y: 10},
        };
        it('checking Code128 barcode rendering with display text margin and barcode margin', (done: Function) => {

            let barcode = document.getElementById('barcode1283')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 87)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
               expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128 barcode rendering invalid character', () => {
        //let barcode: BarcodeGenerator;
        //let barcode: BarcodeGenerator;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode1283' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '414px', height: '150px',
                type: 'Code128',
                value: 'ÃÃ',
                mode: 'SVG'
            });
            barcode.appendTo('#barcode1283');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        
        it('checking Code128 barcode rendering with display text margin and barcode margin', (done: Function) => {
   done();
        });
    });
   
});