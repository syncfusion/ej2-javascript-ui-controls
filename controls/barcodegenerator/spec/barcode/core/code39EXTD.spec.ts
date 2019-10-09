import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";

describe('Barcode Control ', () => {
    describe('EAN8 bar testing for all lines check  EAN8 barcode', () => {
        let barcode: BarcodeGenerator;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                type: 'Code39Extension',
    value: 'www..com',
    width: '200px', height: '150px',
    //enableCheckSum:false,
    displayText:{position:'Top',alignment:'Left'},
    mode:'SVG'
            });
            barcode.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output1 = {
            0: {width: "0.82", height: "116.50", x: 10, y: 24},
            1: {width: "0.82", height: "116.50", x: 12, y: 24},
            2: {width: "1.64", height: "116.50", x: 14, y: 24},
            3: {width: "1.64", height: "116.50", x: 17, y: 24},
            4: {width: "0.82", height: "116.50", x: 19, y: 24},
            5: {width: "0.82", height: "89.50", x: 21, y: 24},
            6: {width: "0.82", height: "89.50", x: 23, y: 24},
            7: {width: "0.82", height: "89.50", x: 25, y: 24},
            8: {width: "0.82", height: "89.50", x: 27, y: 24},
            9: {width: "0.82", height: "89.50", x: 30, y: 24},
            10: {width: "1.64", height: "89.50", x: 31, y: 24},
            11: {width: "1.64", height: "89.50", x: 35, y: 24},
            12: {width: "0.82", height: "89.50", x: 37, y: 24},
            13: {width: "0.82", height: "89.50", x: 39, y: 24},
            14: {width: "0.82", height: "89.50", x: 40, y: 24},
            15: {width: "0.82", height: "89.50", x: 42, y: 24},
            16: {width: "0.82", height: "89.50", x: 44, y: 24},
            17: {width: "0.82", height: "89.50", x: 46, y: 24},
            18: {width: "0.82", height: "89.50", x: 48, y: 24},
            19: {width: "0.82", height: "89.50", x: 51, y: 24},
            20: {width: "1.64", height: "89.50", x: 53, y: 24},
            21: {width: "1.64", height: "89.50", x: 56, y: 24},
            22: {width: "0.82", height: "89.50", x: 58, y: 24},
            23: {width: "0.82", height: "89.50", x: 60, y: 24},
            24: {width: "0.82", height: "89.50", x: 62, y: 24},
            25: {width: "0.82", height: "89.50", x: 63, y: 24},
            26: {width: "0.82", height: "89.50", x: 66, y: 24},
            27: {width: "0.82", height: "89.50", x: 67, y: 24},
            28: {width: "0.82", height: "89.50", x: 70, y: 24},
            29: {width: "0.82", height: "89.50", x: 72, y: 24},
            30: {width: "1.64", height: "89.50", x: 74, y: 24},
            31: {width: "1.64", height: "89.50", x: 77, y: 24},
            32: {width: "0.82", height: "89.50", x: 80, y: 24},
            33: {width: "0.82", height: "89.50", x: 81, y: 24},
            34: {width: "0.82", height: "89.50", x: 83, y: 24},
            35: {width: "1.64", height: "89.50", x: 84, y: 24},
            36: {width: "0.82", height: "89.50", x: 88, y: 24},
            37: {width: "0.82", height: "89.50", x: 89, y: 24},
            38: {width: "1.64", height: "89.50", x: 91, y: 24},
            39: {width: "0.82", height: "89.50", x: 93, y: 24},
            40: {width: "1.64", height: "89.50", x: 95, y: 24},
            41: {width: "0.82", height: "89.50", x: 98, y: 24},
            42: {width: "0.82", height: "89.50", x: 100, y: 24},
            43: {width: "1.64", height: "89.50", x: 102, y: 24},
            44: {width: "0.82", height: "89.50", x: 104, y: 24},
            45: {width: "0.82", height: "89.50", x: 106, y: 24},
            46: {width: "0.82", height: "89.50", x: 108, y: 24},
            47: {width: "0.82", height: "89.50", x: 110, y: 24},
            48: {width: "0.82", height: "89.50", x: 112, y: 24},
            49: {width: "0.82", height: "89.50", x: 115, y: 24},
            50: {width: "1.64", height: "89.50", x: 116, y: 24},
            51: {width: "1.64", height: "89.50", x: 119, y: 24},
            52: {width: "0.82", height: "89.50", x: 121, y: 24},
            53: {width: "0.82", height: "89.50", x: 124, y: 24},
            54: {width: "0.82", height: "89.50", x: 125, y: 24},
            55: {width: "0.82", height: "89.50", x: 127, y: 24},
            56: {width: "0.82", height: "89.50", x: 129, y: 24},
            57: {width: "0.82", height: "89.50", x: 131, y: 24},
            58: {width: "0.82", height: "89.50", x: 134, y: 24},
            59: {width: "0.82", height: "89.50", x: 136, y: 24},
            60: {width: "1.64", height: "89.50", x: 138, y: 24},
            61: {width: "0.82", height: "89.50", x: 140, y: 24},
            62: {width: "1.64", height: "89.50", x: 142, y: 24},
            63: {width: "0.82", height: "89.50", x: 144, y: 24},
            64: {width: "0.82", height: "89.50", x: 147, y: 24},
            65: {width: "0.82", height: "89.50", x: 148, y: 24},
            66: {width: "0.82", height: "89.50", x: 151, y: 24},
            67: {width: "0.82", height: "89.50", x: 152, y: 24},
            68: {width: "0.82", height: "89.50", x: 155, y: 24},
            69: {width: "0.82", height: "89.50", x: 157, y: 24},
            70: {width: "1.64", height: "89.50", x: 159, y: 24},
            71: {width: "1.64", height: "89.50", x: 161, y: 24},
            72: {width: "0.82", height: "89.50", x: 164, y: 24},
            73: {width: "0.82", height: "89.50", x: 165, y: 24},
            74: {width: "0.82", height: "89.50", x: 168, y: 24},
            75: {width: "0.82", height: "89.50", x: 170, y: 24},
            76: {width: "0.82", height: "89.50", x: 171, y: 24},
            77: {width: "0.82", height: "89.50", x: 174, y: 24},
            78: {width: "1.64", height: "89.50", x: 175, y: 24},
            79: {width: "1.64", height: "89.50", x: 178, y: 24},
            80: {width: "0.82", height: "116.50", x: 180, y: 24},
            81: {width: "0.82", height: "116.50", x: 183, y: 24},
            82: {width: "1.64", height: "116.50", x: 184, y: 24},
            83: {width: "1.64", height: "116.50", x: 187, y: 24},
            84: {width: "0.82", height: "116.50", x: 189, y: 24},
        };
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 21
            && Math.round(Number(children.children[0].getAttribute('y'))) === 22
            && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x
                && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                && parseFloat((children.children[j+1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            done();
        });
    });
    

});