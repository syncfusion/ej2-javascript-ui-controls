import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let barcode: BarcodeGenerator;
        let ele: HTMLElement;
describe('Code128B - Barcode', () => {

    describe('checking Code128B barcode rendering all lines check', () => {
       // let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128B1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '314px', height: '150px',
                type: 'Code128B',
                value: '!aAs1234!@#$%',
                margin: { left: 20, right: 20, top: 20, bottom: 20 },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128B1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "3.08", height: "96.50", x: 20, y: 20 },
            1: { width: "1.54", height: "96.50", x: 25, y: 20 },
            2: { width: "1.54", height: "96.50", x: 29, y: 20 },
            3: { width: "3.08", height: "96.50", x: 37, y: 20 },
            4: { width: "3.08", height: "96.50", x: 43, y: 20 },
            5: { width: "3.08", height: "96.50", x: 48, y: 20 },
            6: { width: "1.54", height: "96.50", x: 54, y: 20 },
            7: { width: "1.54", height: "96.50", x: 58, y: 20 },
            8: { width: "3.08", height: "96.50", x: 62, y: 20 },
            9: { width: "1.54", height: "96.50", x: 71, y: 20 },
            10: { width: "1.54", height: "96.50", x: 74, y: 20 },
            11: { width: "3.08", height: "96.50", x: 80, y: 20 },
            12: { width: "1.54", height: "96.50", x: 88, y: 20 },
            13: { width: "6.16", height: "96.50", x: 91, y: 20 },
            14: { width: "1.54", height: "96.50", x: 100, y: 20 },
            15: { width: "1.54", height: "96.50", x: 105, y: 20 },
            16: { width: "4.62", height: "96.50", x: 109, y: 20 },
            17: { width: "3.08", height: "96.50", x: 117, y: 20 },
            18: { width: "3.08", height: "96.50", x: 122, y: 20 },
            19: { width: "4.62", height: "96.50", x: 128, y: 20 },
            20: { width: "1.54", height: "96.50", x: 135, y: 20 },
            21: { width: "3.08", height: "96.50", x: 139, y: 20 },
            22: { width: "1.54", height: "96.50", x: 145, y: 20 },
            23: { width: "4.62", height: "96.50", x: 148, y: 20 },
            24: { width: "3.08", height: "96.50", x: 155, y: 20 },
            25: { width: "1.54", height: "96.50", x: 162, y: 20 },
            26: { width: "4.62", height: "96.50", x: 166, y: 20 },
            27: { width: "3.08", height: "96.50", x: 172, y: 20 },
            28: { width: "3.08", height: "96.50", x: 179, y: 20 },
            29: { width: "3.08", height: "96.50", x: 183, y: 20 },
            30: { width: "3.08", height: "96.50", x: 189, y: 20 },
            31: { width: "3.08", height: "96.50", x: 197, y: 20 },
            32: { width: "3.08", height: "96.50", x: 202, y: 20 },
            33: { width: "1.54", height: "96.50", x: 206, y: 20 },
            34: { width: "1.54", height: "96.50", x: 211, y: 20 },
            35: { width: "3.08", height: "96.50", x: 215, y: 20 },
            36: { width: "1.54", height: "96.50", x: 223, y: 20 },
            37: { width: "1.54", height: "96.50", x: 228, y: 20 },
            38: { width: "3.08", height: "96.50", x: 234, y: 20 },
            39: { width: "1.54", height: "96.50", x: 240, y: 20 },
            40: { width: "1.54", height: "96.50", x: 246, y: 20 },
            41: { width: "3.08", height: "96.50", x: 251, y: 20 },
            42: { width: "1.54", height: "96.50", x: 257, y: 20 },
            43: { width: "1.54", height: "96.50", x: 262, y: 20 },
            44: { width: "6.16", height: "96.50", x: 266, y: 20 },
            45: { width: "3.08", height: "96.50", x: 274, y: 20 },
            46: { width: "4.62", height: "96.50", x: 282, y: 20 },
            47: { width: "1.54", height: "96.50", x: 288, y: 20 },
            48: { width: "3.08", height: "96.50", x: 291, y: 20 },
        };
        it('checking Code128A barcode rendering with display text margin and barcode margin', (done: Function) => {


            let barcode = document.getElementById('barcode128B1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('testcase2')
            console.log((Math.round(Number(children.children[0].getAttribute('x')))))
            console.log((children.children[0] as HTMLElement).style.fontSize)
            console.log('testcaseFailure');
            console.log((Math.round(Number(children.children[0].getAttribute('x')))));
            console.log((children.children[0] as HTMLElement).style.fontSize === '20px')

            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 79)||(Math.round(Number(children.children[0].getAttribute('x'))) === 78)
                && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128B barcode rendering all lines check', () => {
       // let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128B2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '514px', height: '150px',
                type: 'Code128B',
                value: 'abcdABCD!@#$%^&*()_-+={[}]|/.,<>?""/',
                margin: { left: 20, right: 20, top: 20, bottom: 20 },
                displayText: { margin: { left: 90, right: 90, top: 50 } },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128B2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.20", height: "46.50", x: 20, y: 20 },
            1: { width: "1.10", height: "46.50", x: 23, y: 20 },
            2: { width: "1.10", height: "46.50", x: 27, y: 20 },
            3: { width: "1.10", height: "46.50", x: 32, y: 20 },
            4: { width: "1.10", height: "46.50", x: 35, y: 20 },
            5: { width: "2.20", height: "46.50", x: 38, y: 20 },
            6: { width: "1.10", height: "46.50", x: 44, y: 20 },
            7: { width: "1.10", height: "46.50", x: 47, y: 20 },
            8: { width: "2.20", height: "46.50", x: 53, y: 20 },
            9: { width: "1.10", height: "46.50", x: 56, y: 20 },
            10: { width: "1.10", height: "46.50", x: 62, y: 20 },
            11: { width: "2.20", height: "46.50", x: 64, y: 20 },
            12: { width: "1.10", height: "46.50", x: 68, y: 20 },
            13: { width: "1.10", height: "46.50", x: 74, y: 20 },
            14: { width: "2.20", height: "46.50", x: 77, y: 20 },
            15: { width: "1.10", height: "46.50", x: 80, y: 20 },
            16: { width: "1.10", height: "46.50", x: 83, y: 20 },
            17: { width: "2.20", height: "46.50", x: 87, y: 20 },
            18: { width: "1.10", height: "46.50", x: 93, y: 20 },
            19: { width: "1.10", height: "46.50", x: 97, y: 20 },
            20: { width: "2.20", height: "46.50", x: 99, y: 20 },
            21: { width: "1.10", height: "46.50", x: 105, y: 20 },
            22: { width: "1.10", height: "46.50", x: 109, y: 20 },
            23: { width: "2.20", height: "46.50", x: 113, y: 20 },
            24: { width: "1.10", height: "46.50", x: 117, y: 20 },
            25: { width: "2.20", height: "46.50", x: 119, y: 20 },
            26: { width: "1.10", height: "46.50", x: 124, y: 20 },
            27: { width: "2.20", height: "46.50", x: 129, y: 20 },
            28: { width: "2.20", height: "46.50", x: 133, y: 20 },
            29: { width: "2.20", height: "46.50", x: 137, y: 20 },
            30: { width: "2.20", height: "46.50", x: 141, y: 20 },
            31: { width: "2.20", height: "46.50", x: 146, y: 20 },
            32: { width: "2.20", height: "46.50", x: 150, y: 20 },
            33: { width: "1.10", height: "46.50", x: 153, y: 20 },
            34: { width: "1.10", height: "46.50", x: 156, y: 20 },
            35: { width: "2.20", height: "46.50", x: 160, y: 20 },
            36: { width: "1.10", height: "46.50", x: 165, y: 20 },
            37: { width: "1.10", height: "46.50", x: 168, y: 20 },
            38: { width: "2.20", height: "46.50", x: 173, y: 20 },
            39: { width: "1.10", height: "46.50", x: 177, y: 20 },
            40: { width: "1.10", height: "46.50", x: 182, y: 20 },
            41: { width: "2.20", height: "46.50", x: 185, y: 20 },
            42: { width: "4.40", height: "46.50", x: 189, y: 20 },
            43: { width: "1.10", height: "46.50", x: 197, y: 20 },
            44: { width: "1.10", height: "46.50", x: 199, y: 20 },
            45: { width: "1.10", height: "46.50", x: 201, y: 20 },
            46: { width: "2.20", height: "46.50", x: 205, y: 20 },
            47: { width: "1.10", height: "46.50", x: 209, y: 20 },
            48: { width: "2.20", height: "46.50", x: 214, y: 20 },
            49: { width: "1.10", height: "46.50", x: 218, y: 20 },
            50: { width: "1.10", height: "46.50", x: 222, y: 20 },
            51: { width: "1.10", height: "46.50", x: 226, y: 20 },
            52: { width: "2.20", height: "46.50", x: 230, y: 20 },
            53: { width: "1.10", height: "46.50", x: 234, y: 20 },
            54: { width: "2.20", height: "46.50", x: 238, y: 20 },
            55: { width: "1.10", height: "46.50", x: 242, y: 20 },
            56: { width: "1.10", height: "46.50", x: 245, y: 20 },
            57: { width: "1.10", height: "46.50", x: 250, y: 20 },
            58: { width: "1.10", height: "46.50", x: 252, y: 20 },
            59: { width: "2.20", height: "46.50", x: 255, y: 20 },
            60: { width: "1.10", height: "46.50", x: 262, y: 20 },
            61: { width: "2.20", height: "46.50", x: 265, y: 20 },
            62: { width: "3.30", height: "46.50", x: 269, y: 20 },
            63: { width: "2.20", height: "46.50", x: 274, y: 20 },
            64: { width: "1.10", height: "46.50", x: 280, y: 20 },
            65: { width: "1.10", height: "46.50", x: 283, y: 20 },
            66: { width: "3.30", height: "46.50", x: 286, y: 20 },
            67: { width: "2.20", height: "46.50", x: 292, y: 20 },
            68: { width: "1.10", height: "46.50", x: 296, y: 20 },
            69: { width: "4.40", height: "46.50", x: 298, y: 20 },
            70: { width: "2.20", height: "46.50", x: 304, y: 20 },
            71: { width: "2.20", height: "46.50", x: 307, y: 20 },
            72: { width: "3.30", height: "46.50", x: 310, y: 20 },
            73: { width: "2.20", height: "46.50", x: 317, y: 20 },
            74: { width: "1.10", height: "46.50", x: 320, y: 20 },
            75: { width: "1.10", height: "46.50", x: 322, y: 20 },
            76: { width: "1.10", height: "46.50", x: 325, y: 20 },
            77: { width: "4.40", height: "46.50", x: 329, y: 20 },
            78: { width: "2.20", height: "46.50", x: 335, y: 20 },
            79: { width: "1.10", height: "46.50", x: 339, y: 20 },
            80: { width: "1.10", height: "46.50", x: 344, y: 20 },
            81: { width: "1.10", height: "46.50", x: 347, y: 20 },
            82: { width: "1.10", height: "46.50", x: 349, y: 20 },
            83: { width: "4.40", height: "46.50", x: 351, y: 20 },
            84: { width: "1.10", height: "46.50", x: 359, y: 20 },
            85: { width: "3.30", height: "46.50", x: 361, y: 20 },
            86: { width: "2.20", height: "46.50", x: 366, y: 20 },
            87: { width: "1.10", height: "46.50", x: 371, y: 20 },
            88: { width: "2.20", height: "46.50", x: 374, y: 20 },
            89: { width: "3.30", height: "46.50", x: 379, y: 20 },
            90: { width: "1.10", height: "46.50", x: 383, y: 20 },
            91: { width: "2.20", height: "46.50", x: 385, y: 20 },
            92: { width: "3.30", height: "46.50", x: 390, y: 20 },
            93: { width: "3.30", height: "46.50", x: 395, y: 20 },
            94: { width: "2.20", height: "46.50", x: 401, y: 20 },
            95: { width: "1.10", height: "46.50", x: 404, y: 20 },
            96: { width: "2.20", height: "46.50", x: 407, y: 20 },
            97: { width: "2.20", height: "46.50", x: 410, y: 20 },
            98: { width: "2.20", height: "46.50", x: 414, y: 20 },
            99: { width: "2.20", height: "46.50", x: 419, y: 20 },
            100: { width: "2.20", height: "46.50", x: 423, y: 20 },
            101: { width: "2.20", height: "46.50", x: 428, y: 20 },
            102: { width: "2.20", height: "46.50", x: 431, y: 20 },
            103: { width: "2.20", height: "46.50", x: 436, y: 20 },
            104: { width: "2.20", height: "46.50", x: 440, y: 20 },
            105: { width: "2.20", height: "46.50", x: 443, y: 20 },
            106: { width: "2.20", height: "46.50", x: 448, y: 20 },
            107: { width: "2.20", height: "46.50", x: 452, y: 20 },
            108: { width: "1.10", height: "46.50", x: 456, y: 20 },
            109: { width: "3.30", height: "46.50", x: 458, y: 20 },
            110: { width: "2.20", height: "46.50", x: 463, y: 20 },
            111: { width: "1.10", height: "46.50", x: 468, y: 20 },
            112: { width: "3.30", height: "46.50", x: 470, y: 20 },
            113: { width: "2.20", height: "46.50", x: 475, y: 20 },
            114: { width: "2.20", height: "46.50", x: 480, y: 20 },
            115: { width: "3.30", height: "46.50", x: 485, y: 20 },
            116: { width: "1.10", height: "46.50", x: 490, y: 20 },
            117: { width: "2.20", height: "46.50", x: 492, y: 20 },
        };
        it('checking Code128B barcode rendering all lines check', (done: Function) => {

            let barcode = document.getElementById('barcode128B2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 110) && (children.children[0] as HTMLElement).style.fontSize === '13.6px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    describe('checking Code128B barcode rendering all lines check', () => {
       // let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128B3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '514px', height: '150px',
                type: 'Code128B',
                value: 'abcdABCD!@#$%^&*()_-+={[}]|/.,<>?""/',
                margin: { left: -20, right: -20, top: -20, bottom: -20 },
                displayText: { margin: { left: 10, right: 10, top: 10 } },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128B3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "2.57", height: "166.50", x: -20, y: -20 },
            1: { width: "1.29", height: "166.50", x: -16, y: -20 },
            2: { width: "1.29", height: "166.50", x: -12, y: -20 },
            3: { width: "1.29", height: "166.50", x: -6, y: -20 },
            4: { width: "1.29", height: "166.50", x: -2, y: -20 },
            5: { width: "2.57", height: "166.50", x: 1, y: -20 },
            6: { width: "1.29", height: "166.50", x: 8, y: -20 },
            7: { width: "1.29", height: "166.50", x: 12, y: -20 },
            8: { width: "2.57", height: "166.50", x: 19, y: -20 },
            9: { width: "1.29", height: "166.50", x: 22, y: -20 },
            10: { width: "1.29", height: "166.50", x: 29, y: -20 },
            11: { width: "2.57", height: "166.50", x: 31, y: -20 },
            12: { width: "1.29", height: "166.50", x: 37, y: -20 },
            13: { width: "1.29", height: "166.50", x: 43, y: -20 },
            14: { width: "2.57", height: "166.50", x: 47, y: -20 },
            15: { width: "1.29", height: "166.50", x: 51, y: -20 },
            16: { width: "1.29", height: "166.50", x: 53, y: -20 },
            17: { width: "2.57", height: "166.50", x: 58, y: -20 },
            18: { width: "1.29", height: "166.50", x: 65, y: -20 },
            19: { width: "1.29", height: "166.50", x: 70, y: -20 },
            20: { width: "2.57", height: "166.50", x: 73, y: -20 },
            21: { width: "1.29", height: "166.50", x: 79, y: -20 },
            22: { width: "1.29", height: "166.50", x: 84, y: -20 },
            23: { width: "2.57", height: "166.50", x: 89, y: -20 },
            24: { width: "1.29", height: "166.50", x: 93, y: -20 },
            25: { width: "2.57", height: "166.50", x: 96, y: -20 },
            26: { width: "1.29", height: "166.50", x: 102, y: -20 },
            27: { width: "2.57", height: "166.50", x: 107, y: -20 },
            28: { width: "2.57", height: "166.50", x: 112, y: -20 },
            29: { width: "2.57", height: "166.50", x: 116, y: -20 },
            30: { width: "2.57", height: "166.50", x: 121, y: -20 },
            31: { width: "2.57", height: "166.50", x: 128, y: -20 },
            32: { width: "2.57", height: "166.50", x: 132, y: -20 },
            33: { width: "1.29", height: "166.50", x: 136, y: -20 },
            34: { width: "1.29", height: "166.50", x: 139, y: -20 },
            35: { width: "2.57", height: "166.50", x: 143, y: -20 },
            36: { width: "1.29", height: "166.50", x: 150, y: -20 },
            37: { width: "1.29", height: "166.50", x: 154, y: -20 },
            38: { width: "2.57", height: "166.50", x: 159, y: -20 },
            39: { width: "1.29", height: "166.50", x: 164, y: -20 },
            40: { width: "1.29", height: "166.50", x: 169, y: -20 },
            41: { width: "2.57", height: "166.50", x: 173, y: -20 },
            42: { width: "5.14", height: "166.50", x: 178, y: -20 },
            43: { width: "1.29", height: "166.50", x: 187, y: -20 },
            44: { width: "1.29", height: "166.50", x: 190, y: -20 },
            45: { width: "1.29", height: "166.50", x: 192, y: -20 },
            46: { width: "2.57", height: "166.50", x: 196, y: -20 },
            47: { width: "1.29", height: "166.50", x: 201, y: -20 },
            48: { width: "2.57", height: "166.50", x: 206, y: -20 },
            49: { width: "1.29", height: "166.50", x: 211, y: -20 },
            50: { width: "1.29", height: "166.50", x: 217, y: -20 },
            51: { width: "1.29", height: "166.50", x: 220, y: -20 },
            52: { width: "2.57", height: "166.50", x: 226, y: -20 },
            53: { width: "1.29", height: "166.50", x: 231, y: -20 },
            54: { width: "2.57", height: "166.50", x: 235, y: -20 },
            55: { width: "1.29", height: "166.50", x: 240, y: -20 },
            56: { width: "1.29", height: "166.50", x: 244, y: -20 },
            57: { width: "1.29", height: "166.50", x: 249, y: -20 },
            58: { width: "1.29", height: "166.50", x: 251, y: -20 },
            59: { width: "2.57", height: "166.50", x: 255, y: -20 },
            60: { width: "1.29", height: "166.50", x: 263, y: -20 },
            61: { width: "2.57", height: "166.50", x: 267, y: -20 },
            62: { width: "3.86", height: "166.50", x: 270, y: -20 },
            63: { width: "2.57", height: "166.50", x: 277, y: -20 },
            64: { width: "1.29", height: "166.50", x: 283, y: -20 },
            65: { width: "1.29", height: "166.50", x: 287, y: -20 },
            66: { width: "3.86", height: "166.50", x: 291, y: -20 },
            67: { width: "2.57", height: "166.50", x: 297, y: -20 },
            68: { width: "1.29", height: "166.50", x: 303, y: -20 },
            69: { width: "5.14", height: "166.50", x: 305, y: -20 },
            70: { width: "2.57", height: "166.50", x: 312, y: -20 },
            71: { width: "2.57", height: "166.50", x: 315, y: -20 },
            72: { width: "3.86", height: "166.50", x: 319, y: -20 },
            73: { width: "2.57", height: "166.50", x: 327, y: -20 },
            74: { width: "1.29", height: "166.50", x: 331, y: -20 },
            75: { width: "1.29", height: "166.50", x: 333, y: -20 },
            76: { width: "1.29", height: "166.50", x: 336, y: -20 },
            77: { width: "5.14", height: "166.50", x: 341, y: -20 },
            78: { width: "2.57", height: "166.50", x: 348, y: -20 },
            79: { width: "1.29", height: "166.50", x: 353, y: -20 },
            80: { width: "1.29", height: "166.50", x: 359, y: -20 },
            81: { width: "1.29", height: "166.50", x: 362, y: -20 },
            82: { width: "1.29", height: "166.50", x: 364, y: -20 },
            83: { width: "5.14", height: "166.50", x: 367, y: -20 },
            84: { width: "1.29", height: "166.50", x: 376, y: -20 },
            85: { width: "3.86", height: "166.50", x: 378, y: -20 },
            86: { width: "2.57", height: "166.50", x: 385, y: -20 },
            87: { width: "1.29", height: "166.50", x: 390, y: -20 },
            88: { width: "2.57", height: "166.50", x: 394, y: -20 },
            89: { width: "3.86", height: "166.50", x: 399, y: -20 },
            90: { width: "1.29", height: "166.50", x: 404, y: -20 },
            91: { width: "2.57", height: "166.50", x: 407, y: -20 },
            92: { width: "3.86", height: "166.50", x: 412, y: -20 },
            93: { width: "3.86", height: "166.50", x: 418, y: -20 },
            94: { width: "2.57", height: "166.50", x: 425, y: -20 },
            95: { width: "1.29", height: "166.50", x: 429, y: -20 },
            96: { width: "2.57", height: "166.50", x: 432, y: -20 },
            97: { width: "2.57", height: "166.50", x: 436, y: -20 },
            98: { width: "2.57", height: "166.50", x: 440, y: -20 },
            99: { width: "2.57", height: "166.50", x: 447, y: -20 },
            100: { width: "2.57", height: "166.50", x: 450, y: -20 },
            101: { width: "2.57", height: "166.50", x: 457, y: -20 },
            102: { width: "2.57", height: "166.50", x: 461, y: -20 },
            103: { width: "2.57", height: "166.50", x: 466, y: -20 },
            104: { width: "2.57", height: "166.50", x: 471, y: -20 },
            105: { width: "2.57", height: "166.50", x: 475, y: -20 },
            106: { width: "2.57", height: "166.50", x: 480, y: -20 },
            107: { width: "2.57", height: "166.50", x: 485, y: -20 },
            108: { width: "1.29", height: "166.50", x: 489, y: -20 },
            109: { width: "3.86", height: "166.50", x: 492, y: -20 },
            110: { width: "2.57", height: "166.50", x: 498, y: -20 },
            111: { width: "1.29", height: "166.50", x: 503, y: -20 },
            112: { width: "3.86", height: "166.50", x: 506, y: -20 },
            113: { width: "2.57", height: "166.50", x: 512, y: -20 },
            114: { width: "2.57", height: "166.50", x: 517, y: -20 },
            115: { width: "3.86", height: "166.50", x: 524, y: -20 },
            116: { width: "1.29", height: "166.50", x: 529, y: -20 },
            117: { width: "2.57", height: "166.50", x: 531, y: -20 },
        };
        it('checking Code128B barcode rendering all lines check', (done: Function) => {

            let barcode = document.getElementById('barcode128B3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect((Math.round(Number(children.children[0].getAttribute('x'))) === 41) && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });
    

    describe('checking Code128B invalid character', () => {
       // let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode128B3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '514px', height: '150px',
                type: 'Code128B',
                value: 'Å',
                margin: { left: -20, right: -20, top: -20, bottom: -20 },
                displayText: { margin: { left: 10, right: 10, top: 10 } },
                mode: 'SVG'
            });
            barcode.appendTo('#barcode128B3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        
        it('checking Code128B barcode rendering all lines check', (done: Function) => {

            done();
        });
    });
    


});