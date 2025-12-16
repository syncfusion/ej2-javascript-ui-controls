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
            0: { width: "2.47", height: "116.00", x: 10, y: 24 },
            1: { width: "2.47", height: "116.00", x: 15, y: 24 },
            2: { width: "4.93", height: "102.00", x: 25, y: 24 },
            3: { width: "2.47", height: "102.00", x: 35, y: 24 },
            4: { width: "4.93", height: "102.00", x: 42, y: 24 },
            5: { width: "2.47", height: "102.00", x: 52, y: 24 },
            6: { width: "2.47", height: "102.00", x: 59, y: 24 },
            7: { width: "4.93", height: "102.00", x: 67, y: 24 },
            8: { width: "2.47", height: "102.00", x: 77, y: 24 },
            9: { width: "4.93", height: "102.00", x: 84, y: 24 },
            10: { width: "2.47", height: "116.00", x: 94, y: 24 },
            11: { width: "2.47", height: "116.00", x: 99, y: 24 },
            12: { width: "2.47", height: "102.00", x: 106, y: 24 },
            13: { width: "2.47", height: "102.00", x: 118, y: 24 },
            14: { width: "2.47", height: "102.00", x: 123, y: 24 },
            15: { width: "2.47", height: "102.00", x: 136, y: 24 },
            16: { width: "2.47", height: "102.00", x: 141, y: 24 },
            17: { width: "7.40", height: "102.00", x: 146, y: 24 },
            18: { width: "2.47", height: "102.00", x: 158, y: 24 },
            19: { width: "7.40", height: "102.00", x: 163, y: 24 },
            20: { width: "2.47", height: "116.00", x: 178, y: 24 },
            21: { width: "2.47", height: "116.00", x: 183, y: 24 },
        };
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('--------------------------------------------------------------------------------');
            console.log('EAN8 bar testing for all lines check  EAN8 barcode');
            console.log('Math.round(Number(children.children[0].getAttribute("x"))): '+Math.round(Number(children.children[0].getAttribute('x'))));
            console.log('Math.round(Number(children.children[1].getAttribute("x"))): '+Math.round(Number(children.children[1].getAttribute('x'))));
            console.log('(children.children[0] as HTMLElement).style.fontSize: '+(children.children[0] as HTMLElement).style.fontSize);
            console.log('Math.round(Number(children.children[0].getAttribute("y"))): '+Math.round(Number(children.children[0].getAttribute('y'))));
            console.log('Math.round(Number(children.children[1].getAttribute("y"))): '+Math.round(Number(children.children[1].getAttribute('y'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 41
            && Math.round(Number(children.children[1].getAttribute('x'))) === 127 &&
            (children.children[0] as HTMLElement).style.fontSize === '20px'
            && Math.round(Number(children.children[0].getAttribute('y'))) === 22
            && Math.round(Number(children.children[1].getAttribute('y'))) === 22).toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
            console.log('Math.round(Number(children.children[j + 2].getAttribute("x"))): '+Math.round(Number(children.children[j + 2].getAttribute('x'))), 'output1[j].x: '+output1[j].x);
            console.log('Math.round(Number(children.children[j + 2].getAttribute("y"))): '+Math.round(Number(children.children[j + 2].getAttribute('y'))), 'output1[j].y: '+output1[j].y);
            console.log('parseFloat((children.children[j + 2].getAttribute("width"))).toFixed(2): '+parseFloat((children.children[j + 2].getAttribute('width'))).toFixed(2), 'output1[j].width: '+output1[j].width);
            console.log('parseFloat((children.children[j + 2].getAttribute("height"))).toFixed(2): '+parseFloat((children.children[j + 2].getAttribute('height'))).toFixed(2), 'output1[j].height: '+output1[j].height);
            console.log('--------------------------------------------------------------------------------');
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
            0: { width: "1.68", height: "116.00", x: 20, y: 24 },
            1: { width: "1.68", height: "116.00", x: 23, y: 24 },
            2: { width: "5.05", height: "102.00", x: 28, y: 24 },
            3: { width: "3.37", height: "102.00", x: 35, y: 24 },
            4: { width: "1.68", height: "102.00", x: 40, y: 24 },
            5: { width: "1.68", height: "102.00", x: 49, y: 24 },
            6: { width: "5.05", height: "102.00", x: 52, y: 24 },
            7: { width: "1.68", height: "102.00", x: 60, y: 24 },
            8: { width: "1.68", height: "102.00", x: 67, y: 24 },
            9: { width: "3.37", height: "102.00", x: 70, y: 24 },
            10: { width: "5.05", height: "102.00", x: 77, y: 24 },
            11: { width: "1.68", height: "102.00", x: 84, y: 24 },
            12: { width: "3.37", height: "102.00", x: 91, y: 24 },
            13: { width: "1.68", height: "102.00", x: 96, y: 24 },
            14: { width: "1.68", height: "116.00", x: 101, y: 24 },
            15: { width: "1.68", height: "116.00", x: 106, y: 24 },
            16: { width: "1.68", height: "102.00", x: 111, y: 24 },
            17: { width: "5.05", height: "102.00", x: 116, y: 24 },
            18: { width: "1.68", height: "102.00", x: 123, y: 24 },
            19: { width: "1.68", height: "102.00", x: 126, y: 24 },
            20: { width: "1.68", height: "102.00", x: 134, y: 24 },
            21: { width: "5.05", height: "102.00", x: 138, y: 24 },
            22: { width: "1.68", height: "102.00", x: 146, y: 24 },
            23: { width: "1.68", height: "102.00", x: 151, y: 24 },
            24: { width: "3.37", height: "102.00", x: 158, y: 24 },
            25: { width: "3.37", height: "102.00", x: 163, y: 24 },
            26: { width: "1.68", height: "102.00", x: 170, y: 24 },
            27: { width: "5.05", height: "102.00", x: 173, y: 24 },
            28: { width: "1.68", height: "116.00", x: 183, y: 24 },
            29: { width: "1.68", height: "116.00", x: 187, y: 24 },
        };
        it('EAN13 bar testing for all lines check  EAN13 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar2')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('--------------------------------------------------------------------------------');
            console.log('EAN13 bar testing for all lines check  EAN13 barcode');
            console.log("Math.round(Number(children.children[0].getAttribute('x'))): "+Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[2].getAttribute('y'))): "+Math.round(Number(children.children[2].getAttribute('y'))));
            console.log("Math.round(Number(children.children[1].getAttribute('y'))): "+Math.round(Number(children.children[1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y'))): "+Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize: "+(children.children[0] as HTMLElement).style.fontSize);

            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 0 && Math.round(Number(children.children[2].getAttribute('y'))) === 22
                && Math.round(Number(children.children[1].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('y'))) === 22 && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (var j = 0; j < children.children.length - 3; j++) {
                console.log("Math.round(Number(children.children[j + 3].getAttribute('x'))): "+Math.round(Number(children.children[j + 3].getAttribute('x'))), "output1[j].x: "+output1[j].x);
                console.log("Math.round(Number(children.children[j + 3].getAttribute('y'))): "+Math.round(Number(children.children[j + 3].getAttribute('y'))), "output1[j].y: "+output1[j].y);
                console.log("parseFloat((children.children[j + 3].getAttribute('width'))).toFixed(2): "+parseFloat((children.children[j + 3].getAttribute('width'))).toFixed(2), "output1[j].width: "+output1[j].width);
                console.log("parseFloat((children.children[j + 3].getAttribute('height'))).toFixed(2): "+parseFloat((children.children[j + 3].getAttribute('height'))).toFixed(2), "output1[j].height: "+output1[j].height);
                console.log('--------------------------------------------------------------------------------');

                expect(Math.round(Number(children.children[j + 3].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 3].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 3].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 3].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            done();
        });
    });
    describe('EAN13 bar testing CR issue test case', () => {

        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Ean13',
                margin: { left: 20 },
                displayText: { alignment: 'Right', position: 'Top' },
                value: '8020834736939',
                mode: 'SVG',
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('EAN13 bar testing CR issue test case', (done: Function) => {
            console.log('--------------------------------------------------------------------------------');
            console.log('EAN13 bar testing CR issue test case');
            var barocodeDiv = document.getElementById("barcodecontent")
            console.log('--------------------------------------------------------------------------------');
            console.log("barocodeDiv.childElementCount: "+barocodeDiv.childElementCount);
            expect(barocodeDiv.childElementCount === 33).toBe(true);
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
            0: { width: "1.43", height: "116.00", x: 31, y: 24 },
            1: { width: "1.43", height: "116.00", x: 34, y: 24 },
            2: { width: "4.29", height: "116.00", x: 37, y: 24 },
            3: { width: "2.86", height: "116.00", x: 43, y: 24 },
            4: { width: "1.43", height: "102.00", x: 49, y: 24 },
            5: { width: "2.86", height: "102.00", x: 53, y: 24 },
            6: { width: "2.86", height: "102.00", x: 57, y: 24 },
            7: { width: "1.43", height: "102.00", x: 64, y: 24 },
            8: { width: "1.43", height: "102.00", x: 69, y: 24 },
            9: { width: "2.86", height: "102.00", x: 73, y: 24 },
            10: { width: "4.29", height: "102.00", x: 77, y: 24 },
            11: { width: "2.86", height: "102.00", x: 83, y: 24 },
            12: { width: "1.43", height: "102.00", x: 89, y: 24 },
            13: { width: "2.86", height: "102.00", x: 93, y: 24 },
            14: { width: "1.43", height: "116.00", x: 97, y: 24 },
            15: { width: "1.43", height: "116.00", x: 100, y: 24 },
            16: { width: "1.43", height: "102.00", x: 103, y: 24 },
            17: { width: "1.43", height: "102.00", x: 109, y: 24 },
            18: { width: "1.43", height: "102.00", x: 113, y: 24 },
            19: { width: "1.43", height: "102.00", x: 120, y: 24 },
            20: { width: "4.29", height: "102.00", x: 123, y: 24 },
            21: { width: "1.43", height: "102.00", x: 130, y: 24 },
            22: { width: "1.43", height: "102.00", x: 133, y: 24 },
            23: { width: "1.43", height: "102.00", x: 139, y: 24 },
            24: { width: "4.29", height: "102.00", x: 143, y: 24 },
            25: { width: "1.43", height: "102.00", x: 150, y: 24 },
            26: { width: "1.43", height: "116.00", x: 153, y: 24 },
            27: { width: "1.43", height: "116.00", x: 156, y: 24 },
            28: { width: "1.43", height: "116.00", x: 163, y: 24 },
            29: { width: "1.43", height: "116.00", x: 166, y: 24 },
        };
        it('upcA bar testing for all lines check  upcA barcode', (done: Function) => {
            let barcode = document.getElementById('codabar3')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('--------------------------------------------------------------------------------');
            console.log('upcA bar testing for all lines check  upcA barcode');            
            console.log("Math.round(Number(children.children[1].getAttribute('y'))): "+Math.round(Number(children.children[1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y'))): "+Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("Math.round(Number(children.children[0].getAttribute('x'))): "+Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize: "+(children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[1].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('x'))) === 16
                && (children.children[0] as HTMLElement).style.fontSize === '14.6px').toBe(true);
            for (var j = 0; j < children.children.length - 4; j++) {
                console.log("Math.round(Number(children.children[j + 4].getAttribute('x'))): "+Math.round(Number(children.children[j + 4].getAttribute('x'))), "output1[j].x: "+output1[j].x);
                console.log("Math.round(Number(children.children[j + 4].getAttribute('y'))): "+Math.round(Number(children.children[j + 4].getAttribute('y'))), "output1[j].x: "+output1[j].y);
                console.log("parseFloat((children.children[j + 4].getAttribute('width'))).toFixed(2): "+parseFloat((children.children[j + 4].getAttribute('width'))).toFixed(2), "output1[j].width: "+output1[j].width);
                console.log("parseFloat((children.children[j + 4].getAttribute('height'))).toFixed(2): "+parseFloat((children.children[j + 4].getAttribute('height'))).toFixed(2), "output1[j].height: "+output1[j].height);
                console.log('--------------------------------------------------------------------------------');
                expect(Math.round(Number(children.children[j + 4].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 4].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 4].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 4].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
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

    describe('upcA character rendering issue ', () => {

        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '300px', height: '150px',
                type: 'UpcA',
                value: '024100106851',
                displayText: {

                },
            });
            barcode.appendTo('#codabar3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('upcA character rendering issue', (done: Function) => {
            var barcode = document.getElementById("codabar3");
            var value = barcode.children[0].children[0].getAttribute("style")
            console.log('--------------------------------------------------------------------------------');
            console.log('upcA character rendering issue');
            console.log('value: '+ value);
            console.log('--------------------------------------------------------------------------------');
            expect(value === "font-size: 20px; font-family: monospace;").toBe(true);
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
            0: { width: "2.54", height: "116.00", x: 30, y: 24 },
            1: { width: "2.54", height: "116.00", x: 35, y: 24 },
            2: { width: "5.07", height: "102.00", x: 40, y: 24 },
            3: { width: "5.07", height: "102.00", x: 51, y: 24 },
            4: { width: "2.54", height: "102.00", x: 61, y: 24 },
            5: { width: "5.07", height: "102.00", x: 68, y: 24 },
            6: { width: "10.14", height: "102.00", x: 76, y: 24 },
            7: { width: "2.54", height: "102.00", x: 89, y: 24 },
            8: { width: "7.61", height: "102.00", x: 96, y: 24 },
            9: { width: "2.54", height: "102.00", x: 106, y: 24 },
            10: { width: "7.61", height: "102.00", x: 111, y: 24 },
            11: { width: "2.54", height: "102.00", x: 124, y: 24 },
            12: { width: "2.54", height: "102.00", x: 129, y: 24 },
            13: { width: "10.14", height: "102.00", x: 134, y: 24 },
            14: { width: "2.54", height: "116.00", x: 147, y: 24 },
            15: { width: "2.54", height: "116.00", x: 152, y: 24 },
            16: { width: "2.54", height: "116.00", x: 160, y: 24 },
        };
        it('upcE bar testing for all lines check  upcE barcode', (done: Function) => {
            let barcode = document.getElementById('codabar4')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('--------------------------------------------------------------------------------');
            console.log('upcA character rendering issue');
            console.log("Math.round(Number(children.children[0].getAttribute('y'))): "+Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("Math.round(Number(children.children[0].getAttribute('x'))): "+Math.round(Number(children.children[0].getAttribute('x'))));
            expect(Math.round(Number(children.children[0].getAttribute('y'))) === 22
                && Math.round(Number(children.children[0].getAttribute('x'))) === 51).toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                console.log("Math.round(Number(children.children[j + 1].getAttribute('x'))): "+Math.round(Number(children.children[j + 1].getAttribute('x'))), "output1[j].x: "+output1[j].x);
                console.log("Math.round(Number(children.children[j + 1].getAttribute('y'))): "+Math.round(Number(children.children[j + 1].getAttribute('y'))), "output1[j].y: "+output1[j].y);
                console.log("parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2): "+parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2), "output1[j].width: "+output1[j].width);
                console.log("parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2): "+parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2), "output1[j].height: "+output1[j].height);
                console.log('--------------------------------------------------------------------------------');
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            done();
        });
    });

    describe('upcE bar testing for all lines check  upcE barcode disable checksum', () => {

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

    describe('upcA text not rendering properly in Canvas mode', () => {

        beforeAll((): void => {
            ele = createElement('div', { id: 'upca' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                type: 'UpcA',
                value: '72527273070',
                displayText: { margin: { top: 10, bottom: 10 } },
                width: '200px', height: '150px',
                mode: 'Canvas'
            });
            barcode.appendTo('#upca');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Check upca text in canvas mode', (done: Function) => {
            var base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhCAYAAAByfIirAAAAAXNSR0IArs4c6QAAF9ZJREFUeF7t3HvwVdP/x/G3EoMu5FaZKMNUQ9GkEIPiK5dIKQqplBQpRRd0URQRIiO3FBKmVIhukmoouXZxS9PFNWNoqokR6jev/Zvzmc9lf85anz6f/Wmd2c8z448+573Pea/3Wvux1157Hfvt2bNnj/GiAlSACuRABfYDrBzoJVKkAlQgqgBgMRCoABXImQoAVs50FYlSASoAWIwBKkAFcqYCgJUzXUWiVIAKABZjgApQgZypAGDlTFeRKBWgAoDFGKACVCBnKgBYOdNVJEoFqABgMQaoABXImQoAVs50FYlSASoAWIwBKkAFcqYCgJUzXUWiVIAKABZjgApQgZypQBBg1atXz9atW2cTJkywPn362OzZs61t27Z28MEH286dO6NiNm/e3JYvXx5b2D///NMOOuggu+yyy2zOnDl5MfXr17evv/66wDHdunWzKVOmWKdOnWzatGkF3jvllFNs9erVeX+78MILbf78+bZ7926rWLFigdjBgwfbAw88EJvPVVddZdOnT7cePXrYs88+WyDmxBNPtPXr19uTTz5pvXv3zntvx44dVrVq1QKxo0aNsmHDhtnSpUvt3HPPjf2ufv362fjx4+3LL7+0k08+uUCM2tmlS5e8v23ZssVq1qwZ/VvtbNiwYd57c+fOtUsuuaTA8e+99561aNHCRo8ebUOHDrWmTZvaypUro5hq1arZ9u3bo3a2b9/enn76aevVq5fVrVvXNmzYEJvrjBkzrEOHDlE7t23bViDm7rvvtjFjxth5551nixcvznoCrVmzxho1ahTF/PLLL1ajRg3r3LmzTZ06Nfa4tWvX2kknnZT33ttvv22tW7e2SpUq2a5du6K/n3POObZs2bKonffee2/s57Rr185mzZoVtXPixIkFYurUqWObN28uctyhhx5qW7duLfD3IUOG2NixY61ly5a2aNGi6L0KFSqY/k9P8+bNs1atWtm4ceNs4MCBUTtXrVqVtR4//vij1a5dO4r56quvrEGDBta3b9/ofFI733rrrazH59KbgJWvtwALsAArbL4AC7CiCjDDYoYVNlX/nx1gARZgcUuYC1YBFmtYrGGxhpUzVgEWYAEWYAFWiSvAU0IznhLylJCnhG46WMNiDYs1LNaw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40AAuwAAuw3FIEEgFYgAVYgBUIR+40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";
            var base64Image2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhCAYAAAByfIirAAAAAXNSR0IArs4c6QAAGx5JREFUeF7t3QnUlVPfx/G/6EEos1iizIkIZaaIZJYMRUhJFsoUUWYiQkSZIlNYGaIoY5QxLIoyRUXmuZC5d/32u657nXPuc87eN/d1t8+6vnutZ73vc5//OWdf/72vz7Wn87TEokWLFhmFDJABMlABGVgCsCqglagiGSADLgOARUcgA2SgYjIAWBXTVFSUDJABwKIPkAEyUDEZAKyKaSoqSgbIAGDRB8gAGaiYDABWxTQVFSUDZACw6ANkgAxUTAYAq2KaioqSATIAWPQBMkAGKiYDgFUxTUVFyQAZACz6ABkgAxWTAcCqmKaiomSADAAWfYAMkIGKyUAUYG288cb2wQcf2LBhw+ykk06ysWPH2kEHHWQNGjSwX375xSVzhx12sJdffrloYn/99Vdbdtllbb/99rPx48dXxWyyySb27rvv5r2ne/fuNmrUKOvSpYuNHj0677UtttjCpk+fXvW3Pffc05544gn7559/bMkll8yLPeuss+zyyy8vWp9DDz3UxowZYz179rRbbrklL2bDDTe0WbNm2fDhw+2EE06oem3BggXWsGHDvNiLLrrIzj33XJs8ebLtuuuuRb+rb9++NnToUJsxY4ZtttlmeTG6zqOPPrrqb19++aWtueaa7r/rOjfffPOq1yZMmGB777133vufffZZa9eunV166aU2cOBAa926tU2dOtXFNGrUyObPn++us3PnznbTTTdZ7969rVmzZvbxxx8XresDDzxghxxyiLvOn376KS9mwIABNmjQIGvbtq1NmjSp7A309ttvW8uWLV3MF198YY0bN7Zu3brZ3XffXfR977zzjrVo0aLqtccee8z23Xdfq1+/vv3xxx/u77vssotNmTLFXefFF19c9HM6depkDz/8sLvOESNG5MU0bdrU5s6dW+19K664ov3www95f+/fv78NHjzYdtttN3vmmWfca/Xq1TP9Lz1NnDjROnToYEOGDLF+/fq565w2bVrZfMybN8+aNGniYmbOnGnNmze3Pn36uPtJ1zlu3Liy76+kFwErp7UAC7AAK26+AAuwXAYYYTHCipuq/68dYAEWYDElrASrAIs1LNawWMOqGKsAC7AAC7AAq8YZYJfQjF1CdgnZJfTTwRoWa1isYbGG5ZcikgjAAizAAqxIOPJXA7AAC7AAyy9FJBGABViABViRcOSvBmABFmABll+KSCIAC7AAC7Ai4chfDcACLMACLL8UkUQAFmABFmBFwpG/GoAFWIAFWH4pIokALMACLMCKhCN/NQALsAALsPxSRBIBWIAFWIAVCUf+agAWYAEWYPmliCQCsAALsAArEo781QAswAIswPJLEUkEYAEWYAFWJBz5qwFYgAVYgOWXIpIIwAIswAKsSDjyVwOwAAuwAMsvRSQRgAVYgAVYkXDkrwZgARZgAZZfikgiAAuwAAuwIuHIXw3AAizAAiy/FJFEABZgARZgRcKRvxqABViABVh+KSKJACzAAizAioQjfzUAC7AAC7D8UkQSAViABViAFQlH/moAFmABFmD5pYgkArAAC7AAKxKO/NUALMACLMDySxFJBGABFmABViQc+asBWIAFWIDllyKSCMACLMACrEg48lcDsAALsADLL0UkEYAFWIAFWJFw5K8GYAEWYAGWX4pIIgALsAALsCLhyF8NwAIswAIsvxSRRAAWYAEWYEXCkb8agAVYgAVYfikiiQAswAIswIqEI381AAuwAAuw/FJEEgFYgAVYgBUJR/5qABZgARZg+aWIJAKwAAuwACsSjvzVACzAAizA8ksRSQRgARZgAVYkHPmrAViABViA5ZcikgjAAizAAqxIOPJXA7AAC7AAyy9FJBGABViABViRcOSvBmABFmABll+KSCIAC7AAC7Ai4chfDcACLMACLL8UkUQAFmABFmBFwpG/GoAFWIAFWH4pIokALMACLMCKhCN/NQALsAALsPxSRBIBWIAFWIAVCUf+agAWYAEWYPmliCQCsAALsAArEo781QAswAIswPJLEUkEYAEWYAFWJBz5qwFYgAVYgOWXIpIIwAIswAKsSDjyVwOwAAuwAMsvRSQRgAVYgAVYkXDkrwZgARZgAZZfikgiAAuwAAuwIuHIXw3AAizAAiy/FJFEABZgARZgRcKRvxqABViABVh+KSKJACzAAizAioQjfzUAC7AAC7D8UkQSAViABViAFQlH/moAFmABFmD5pYgkArAAC7AAKxKO/NUALMACLMDySxFJBGABFmABViQc+asBWIAFWIDllyKSCMACLMACrEg48lcDsAALsADLL0UkEYAFWIAFWJFw5K8GYAEWYAGWX4pIIgALsAALsCLhyF8NwAIswAIsvxSRRAAWYAEWYEXCkb8agAVYgAVYfikiiQAswAIswIqEI381AAuwAAuw/FJEEgFYgAVYgBUJR/5qABZgARZg+aWIJAKwAAuwACsSjvzVACzAAizA8ksRSQRgARZgAVYkHPmrAViABViA5ZcikgjAAizAAqxIOPJXA7AAC7AAyy9FJBGABViABViRcOSvBmABFmABll+KSCIAC7AAC7Ai4chfDcACLMACLL8UkUQAFmABFmBFwpG/GoAFWIAFWH4pIokALMACLMCKhCN/NQALsAALsPxSRBIBWIAFWIAVCUf+agAWYAEWYPmliCQCsAALsAArEo781QAswAIswPJLEUkEYAEWYAFWJBz5qwFYgAVYgOWXIpIIwAIswAKsSDjyVwOwAAuwAMsvRSQRgAVYgAVYkXDkrwZgARZgAZZfikgiAAuwAAuwIuHIXw3AAizAAiy/FJFEABZgARZgRcKRvxqABViABVh+KSKJACzAAizAioQjfzUAC7AAC7D8UkQSAViABViAFQlH/moAFmABFmD5pYgkArAAC7AAKxKO/NUALMACLMDySxFJBGABFmABViQc+asBWIAFWIDllyKSCMACLMACrEg48lcDsAALsADLL0UkEYAFWIAFWJFw5K8GYAEWYAGWX4pIIgALsAALsCLhyF8NwAIswAIsvxSRRAAWYAEWYEXCkb8agAVYgAVYfikiicgcWIMHD7YJEyZY+/btbeDAgXnN0LNnT5s1a1bV39q0aWNXXHGFLVq0yNq1a5cX27VrV+vVq1fRZrzwwgtt0qRJtu+++9oZZ5yRF3PkkUfavHnz7LTTTrP999+/6rWFCxdax44d82J79Ohh3bp1s+nTp1ufPn2Kflfnzp3tpJNOsjlz5tgxxxyTF3P22Wdbhw4dqv72/fffW6dOndx/v/32261Zs2ZVr02dOtXOPPPMvPcPHTrUttxyS7v00ktdrlq3bm2KU2nUqJHNnz/fxowZY6rDuHHj7KqrrrK11lrLRo8eXbSuzz//vJ1//vm2/PLL2/jx4/NiRo4caXfddZe1atXKrrnmmrK3x+zZs6179+4u5qGHHrKVV17ZBg0aZE8++WTR940aNcqaNm1a9dorr7xi/fv3t/r169tTTz3l/t63b1+bNm2aHXXUUXbssccW/ZzzzjvPJk+ebAcccICdeuqpeTGHH364ffnll9Xet8IKK7jc5Jabb77Z5Wjrrbd2OVOpV6+e62cTJ050bTZkyBDr16+ftWzZ0tWrXFF/atKkiQuZOXOmNW/e3PWXYcOGuT5Y+P1lPyzyFzMHVuTtEWX1QsCKsuIVVCnACmsswArLU6ajACv95gessBwDVlieMh0FWOk3P2CF5RiwwvKU6SjASr/5ASssx4AVlqdMRwFW+s0PWGE5BqywPGU6CrDSb37ACssxYIXlKdNRgJV+8wNWWI4BKyxPmY4CrPSbH7DCcgxYYXnKdBRgpd/8gBWWY8AKy1OmowAr/eYHrLAcA1ZYnjIdBVjpNz9gheUYsMLylOkowEq/+QErLMeAFZanTEcBVvrND1hhOQassDxlOgqw0m9+wArLMWCF5SnTUYCVfvMDVliOASssT5mOAqz0mx+wwnIMWGF5ynQUYKXf/IAVlmPACstTpqMAK/3mB6ywHANWWJ4yHQVY6Tc/YIXlGLDC8pTpKMBKv/kBKyzHgBWWp0xHAVb6zQ9YYTkGrLA8ZToKsNJvfsAKyzFgheUp01GAlX7zA1ZYjgErLE+ZjgKs9JsfsMJyDFhhecp0FGCl3/yAFZZjwArLU6ajACv95gessBzXGlh77bWXPfHEE95vPf30090/w51bNt54Y/vggw/cP62tf3Z97NixdtBBB1mDBg3sl19+caE77LCDvfzyy0U//9dff7Vll13W9ttvv7x/An2TTTaxd99911snAspn4L+ApX8q/bHHHvOmeJ999qn2z9frTc8995xde+219tJLL9n3339vDRs2tC222ML9c/JHHnlkyc9988037fLLL7cpU6bYt99+6/45+1122cXOPvtsa9WqVbX3/dd66p+p1/fpWj/99FNbZpll3PeoPx988MHe669rsJSXK6+80t1TusfWWWcdV8/TTjvNVlllFW99F1dArYE1cOBAe/3110tex0cffWSzZs2y8847zy688MIowBozZozddNNN9sYbb9jPP/9sq666qoOxb9++rnMXlttvv93dKOXKiSeeaNdff321EOVGUD///PPuBlp++eXdjXfMMcfY0UcfbUsssUTee9q3b2/PPPOMt1+MGDHCevfunRf3+++/u5v8vvvus/fff9/+/vtvW3vttU2fedZZZ1mzZs28n5sb8F/AOv/88+3VV18t+X2ff/65vf3223booYfa/fffnxc3ePBg69+/v/vbmmuuaU2aNLHPPvvM/UdFYN11113VPnvcuHHWuXNn++OPP2zddde19dZbz+bMmWOzZ8+2//3vf/bQQw+ZgMwt/6WeH3/8sesvqtdKK61kLVu2tJ9++smmTZtmixYtsgEDBtgll1xSNud1CZb6jCD9559/bLPNNrMVV1zR3nrrLXcPbLjhhjZ16lT3txhLrYFV7uIWLlzoEqMnpG6g1VdffbGDpRv3iiuusCWXXNJ23XVXW2ONNWzmzJmuk6nceOONdvzxx+fV85prrnFPoG233da22WabopeszzrkkEPyXtMNpBGj4NBTt3nz5qYbdfLkya7TdO3a1e6555689wi99957r2RaJ06caHoICF3dnEn5888/rV27dvbiiy9ao0aN3I209NJLOzT05F9hhRVs0qRJtvXWWwf3x/8CVrkv0c280047uboJ9C233LIqXH/bfvvtTTeyHhTdunWrek2wKWfKnUb1e+65Z9Vr6mMbbbSRfffdd3bdddfZySefXPWa2vSEE06w1VZbzfVD4RJSytVT799tt91cTo844gi79dZb3ehKRTf+HnvsYQsWLHAPqp133rnk19UVWBp5qu8ut9xybiajuqv88MMPplGmRrL9+vVz90aMpU7ASnBIpnyFiajrKaGgECy6edWRcqcII0eOtJ49e7rp6BdffOGmIEnR6PDiiy+2oUOHulFYSNGTViMadQh15h49elS9TU81dWI92Z566ik3Agop77zzjgOndevWbsqTOzpT/VRPjd40QkuG93/99Zf16tXL3fw77rijvfDCCyFf5WLSAmv48OGmEekpp5xiehjkFtX1lltucSMB9ZvCohGZsD7jjDPc1CYpQkpto5tPD4rCsv/++7u/F2JWLhnl6jl9+nSXaz2ENYrT0kRuufrqq03LIJ06dbIHH3xwsYN1wAEH2KOPPmrq54WzBSH++OOPuweyZhoxltTBUoPq5tp8883ttddecyOaxQ2WbhJ1Qq1nDBo0qFp9NthgAzd6efLJJ90TMil6Wmvkc8cdd9hRRx0V1J66qXRzabSgp1dhEY7qPOecc46DwVcEz3bbbeemUQJPo7Xc0qJFCzdSLBx5KGbevHluWiXgfvvtNzc9CilpgKXp06abbuqmxhpJ6uGRW1555RX78MMP3bVqmlJYkofgmWeeaZo6JqVDhw6u3e699147/PDDq71PI1lNJTUqC1lz9dXzsssuc22n0bhGcIVF79d0XJBppFWs/+s9dTHC+vHHHx2seghrzW2ppZYKaf6oYlIHSzf8008/XfQGSjJR1yMsjWg0etLoQ4uxhaVNmzYO10Kw1NHV4fWE1hM8pGgdRd+lDiksCotuOI0QQsESsFoT0ZrLBRdcUO3zNBVSZ9S0qH79+nmva3FVQAgsTdM1VQwpaYDVvXt3GzVqlN1888123HHHhVSjKkabLGqjGTNmVOtXWuvS9QtB9avCovdoeULTwq+//tr7vb56dunSxa0VFltCSD5c36V1S323kC5W6gIs3Ye6HzXKfOSRR9yywfjx410e1lprLTvwwANrtFTgTV4KAamCpR0IDS01wiq3IF/XYJXLozYGtLuo0Yeg0TpQUrRQqyGzplO6aZ599lm3uKqnlp7YNR1Ga71JHVjfWYhjsTqq02t6qTUSLSALn5qUZNNA9VRnDS21DZZGr8px48aN3Ug2dKSnEYJGXsJa60ParBB6SdGalkYNWnOaP3++G7XpWjXiFOB6j9orWVBW/suNMkLqqaUFLTFomqVdaj2AhLCKdr7VN7TkoNGwwNh9990XG1iaHWiWoP+o/2pkX1g0UtTsQ4DGWFIFKznq8MADD5Td2o0FLI28tGAtXLUWpJ3P3JIcrRAaAqOwaA1KT9vQbWEtAOvJrE6szuwrWq+56qqr3Pa5pkQ1KRpxaFqqG1kLxMV2QUt9Xm2DlYxaQteRtGanJYWk6AHYp0+fatNyXVvygEkw0mhKIxv1MeVAf0+A1AJ9uYX3kHputdVWpoXsZA1Sa2433HCDq6oeeEJZa4ZaDtDupDZfipW6GGFpp/Lcc891oynlQQvrmiloJD569Gi3HijINMUWvDGW1MDSUQHtRujJprNQ5cSOAaxvvvnGtCCpUaGGxlogLayzRkO6Ft34esoLMK0FabSinRWNlLTr4juOoN1CdWxhpfUyvb9w57Sws6jzr7/++m53p6ajKwGsp7+mSloEPvXUU2vUF2sTrLlz57pr1ijnk08+qbZIXaxiyqvaRGtA2l3VlFZtoHpplzEpIWBpDTCZKmsjpNT2fWg9awLWww8/7K5jcYGlB7Bypn6tWYJymFtuu+02tymk4z3qK6XW22rUeWo5ODWwktGDEqT1mXJlcYOlJ6+mezpPo50Tnc0qNlVQBxc2WvcqxEwdXE9zjdIEUKnpoW4qLcJrwVeg66ChDyvlLulspTYKSuVXN4nW3nQ2S+dvarpepM+tTbAE/UUXXeSmJRph1bRoSnf33Xe70YDWB7UG07FjR/cxmgrqJtP/1fQxdzqffI/+noyqhFepmzK0nm3btnU7zToioAdesaLjGjous7inhMkGgfqd1mgLi/q2dseVV23qqD/HVlIBSx1BN6FucCHgO6i4OMFSJ9K5KUGiGzM5qPhvGio5aa8tem3VFxZte2sIrimKvlNrShox+YrWZnQSWTtO2nrWqDWkaMiv69EoQrtm2kH7N6U2wdIhTo0QNUUqfMLXpG46i6VdQE0VtROdFO3IKU+lbjjBIUC0OK/RWqkSWs9kI6bUkR19voAUlOXari6mhHfeeadb99POa6lfjWgUr3tWvzDQ+lxsJRWwdDZIayTJuoHvohcXWDpyoAOIQkP/f+4RBl+di72unzZonaIYWJpKarr41VdfmZ50NVmDSjYvdIRBC8ghRdM+nRfTMQctCOsG/LeltsBKdug0QtUUvNwygRZ+BY+mzsKlsGg6qVPs+gyNHpMRcfITGz0M9CuCwqKzXTrjVeqnQIqvST316wUtBxRuACTfq6MZesBoA0BolbrmugArOTNWLv+6F7SOpdjcdcN/23dq+32pgKUhv4bU6hiaXvnK4gArwUon3CdMmOBtHO0YaRqj9ZNiv43TWpbWZnSTaQ0rOUGsaxdWWszXiFNnuIqdDyqXo2R6ooVm/eTGVxSnJ74eGtq+/q8/s6gtsJJDncm2ernrSNaGSh3S1dESfY6uTXlNSgKSHj7aeS0sya5esYOTSWxN6pmApFGUEC3cuU3aTif1NcIpVeoCLH13csZQm0OHHXZYXnW0660NIJ3T0vGYGM9ppQKWTvVq7SR0F6iuwdIWs6YjahBtdRcevizWqTS/19RWP29RJ9Rp8uRpqTNNGglo0VLb9drVStZGtKalbW0tHOt3b+V+sFuqMyfHKUqNGnLfl/z8RL9n07QrZMrpA7C2wNL6oK4h5MxZMnIRAJrO5p57U/upj2lqqUVi/YIgKcq3+pOme5oSa61LDxmta+k6tEumkZlGqlqvKVZqUk+9Pzk9rp9I6YGUfK7A1GtaItHGh07EL26wlCutY2rJRg/e5CdmgldLGpq26udn2o2OsaQCVrLImJxN8V14XYOl0Y7m6DpBnTsSKqynnja5vwvU1EzxGk1piiWItD2sBUzt4mm0pu3t3KG0fuitA56CoxxWOlSqA6HFiuop8LSzoy3yUkXrcFrr0sK0RhLCs1TRpki5Gyj3fbUFVrJAHXJYVDe5cq/FbBUdDxA0mkoKKgGkB40WvHUwM7fo2IaQ14NEa1p60GhdRqNfAajfYZbLY03qqe/V52o0q+/QQr/aXyOU5H8ppNSaZm6d62qEpbxpqqzRnh6qWs/Sd+vBram1fpajGUJtPOh89/2/eT0VsJo2bWraNQtduKtrsJKFWV/C9Js0TUlyi3YU9fTX8FkdVaM03RAaAeg3Y4U3T7Io6/su4aGRQ7GibWbdABq5aU2qVBFqxX7GUiy+3BZ7YXxtgZU8yIpNR4rVUTeXzgdp1KKzTloD0uhFUGm9UD+xKjVK0ghK9RZeOnCrdtE5OT0UfJsWNa2n6q720fk4AZtMDXXza7QS8hvRugIrybNyqgeH+pQeulps16l9rX0W/h7S13fr8vVUwKrpBdQ1WDWtX9bjawusrOex3PXXNViV2haAVaktV4f1Bqz0kw1YYTkGrLA8ZToKsNJvfsAKyzFgheUp01GAlX7zA1ZYjgErLE+ZjgKs9JsfsMJyDFhhecp0FGCl3/yAFZZjwArLU6ajACv95gessBwDVlieMh0FWOk3P2CF5TgKsMKqShQZIANZzwBgZb0HcP1koIIyAFgV1FhUlQxkPQOAlfUewPWTgQrKAGBVUGNRVTKQ9QwAVtZ7ANdPBiooA4BVQY1FVclA1jMAWFnvAVw/GaigDABWBTUWVSUDWc8AYGW9B3D9ZKCCMgBYFdRYVJUMZD0DgJX1HsD1k4EKygBgVVBjUVUykPUMAFbWewDXTwYqKAOAVUGNRVXJQNYz8H9wWn6iK6DEewAAAABJRU5ErkJggg==";
            var base64Image3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADhCAYAAAByfIirAAAQAElEQVR4AeydCdgVUwPHz2Tf933Lvu+EkBKSZElCpEIqS+LhEQmPRA8h5ElCEiFJlhBSsu+ShEgIWSshQn39Ts773ffeues7c+/M3H/Pe2Y5+/mdmf9Z51Zvkf6JgAiIQEwI1DP6JwIiIAIxISDBiklFKZsiIALGSLCq6ClQUUUg7gQkWHGvQeVfBKqIgASriipbRRWBuBOQYMW9BpV/EfAjkFA7CVZCK1bFEoEkEpBgJbFWVSYRSCgBCVZCK1bFEoEkEpBg+dWq7ERABCJJQIIVyWpRpkRABPwISLD8qMhOBEQgkgQkWJGsFmWqfASUUpwISLDiVFvKqwhUOYFICNa2225rPM8zAwYMsNUxevRoe7/SSivZew4NGza0dp7nZZznz5+PF9OyZctabttvv721Tz107NjR+mnbtm2qtb3eddddrZvnLUmjWbNm1n7hwoW17D3PMz169LBufoc2bdpY/506dcpw3nrrra3bwIEDa7nNmzfP2nvekrQ9zzO9e/e2fiZOnJjh5nlL/HXv3t36mTJlSoafoUOHWjd3mDVrVo2fyZMnO2t7fvrpp2vcPG9J3OPHj7duffr0sW4NGjSw9xxWW201azdy5EhuzaBBg+z9FltsYe/9Dvj1PM8QNt29Z8+eNnyTJk3SnTLuybvnLckjZcJDu3btbHjPW2Lvef8/wwY/zowZM8b6XXbZZZ2VadSokbXr1atXjV36RatWrayfrl27pjuZ+vXrWzfP+3+6nueZNdZYI8Mvz47neaZp06Y1bvXq1bPhx44da+369etn73kmrUWOw8yZM61fz/PM1KlTrc9u3bpZO94Ja5GQQ72ElEPFEAERqAICdRSsKiCkIoqACESGgAQrMlWhjIiACOQjIMHKR0juIiACkSEgwYpMVUQ+I8qgCFScgASr4lWgDIiACBRKQIJVKCn5EwERqDgBCVbFq0AZEIHoEYhqjiRYUa0Z5UsERCCDgAQrA4ksREAEokpAghXVmlG+REAEMghIsDKQ1N1CMYiACIRDQIIVDlfFKgIiEAIBCVYIUBWlCIhAOAQkWOFwVazVQkDlLCsBCVZZcSsxERCBuhCQYNWFnsKKgAiUlYAEq6y4lZgIiEBdCFRWsOqSc4UVARGoOgISrKqrchVYBOJLQIIV37pTzkWg6ghIsKquyitVYKUrAnUnIMGqO0PFIAIiUCYCEqwygVYyIiACdScgwao7Q8UgAiJQm0BodxKs0NAqYhEQgaAJSLCCJqr4REAEQiMgwQoNrSIWAREImoAEK2iidY9PMYiACGQhIMHKAkbWIiAC0SMgwYpenShHIiACWQhIsLKAkbUIlIOA0iiOgASrOF7yLQIiUEECEqwKwlfSIiACxRGQYBXHS75FQAQqSCDWglVBbkpaBESgAgQkWBWAriRFQARKIyDBKo2bQomACFSAgASrAtCVZAkEFEQEFhOQYC2GoD8REIF4EJBgxaOelEsREIHFBCRYiyHoTwREIEoEsudFgpWdjVxEQAQiRkCCFbEKUXZEQASyE5BgZWcjFxEQgYgRkGBFrELqnh3FIALJJSDBSm7dqmQikDgCEqzEVakKJALJJSDBSm7dqmTJJ1B1JZRgVV2Vq8AiEF8CEqz41p1yLgJVR0CCVXVVrgKLQHwJVLNgxbfWlHMRqFICEqwqrXgVWwTiSECCFcdaU55FoEoJSLCqtOKrrdgqbzIISLCSUY8qhQhUBQEJVlVUswopAskgIMFKRj2qFCJQFQQKEqyqIKFCioAIRJ6ABCvyVaQMioAIOAISLEdCZxEQgcgTkGBFvorKnEElJwIRJiDBinDlKGsiIAK1CUiwavPQnQiIQIQJSLAiXDnKmgiESyB+sUuw4ldnyrEIVC0BCVbVVr0KLgLxIyDBil+dKcciULUEJFglV70CioAIlJuABKvcxJWeCIhAyQQkWCWjU0AREIFyE5BglZu40osjAeU5IgQkWBGpCGVDBEQgPwEJVn5G8iECIhARAhKsiFSEsiECIpCfQDkEK38u5EMEREAECiAgwSoAkryIgAhEg4AEKxr1oFyIgAgUQECCVQAkeSmcgHyKQJgEJFhh0lXcIiACgRKQYAWKU5GJgAiESUCCFSZdxS0CSSZQgbJJsCoAXUmKgAiURkCCVRo3hRIBEagAAQlWBaArSREQgdIISLBK41b3UIpBBESgaAISrKKRKYAIiEClCEiwKkVe6YqACBRNQIJVNDIFEIFiCch/UAQkWEGRVDwiIAKhE5BghY5YCYiACARFQIIVFEnFIwIiEDqBGAhW6AyUgAiIQEwISLBiUlHKpgiIgDESLD0FIiACsSEgwYpNVVVFRlVIEchJQIKVE48cRUAEokRAghWl2lBeREAEchKQYOXEI0cREIGwCJQSrwSrFGoKIwIiUBECEqyKYFeiIiACpRCQYJVCTWFEQAQqQkCCVRHsdU9UMYhANRKQYFVjravMIhBTAhKsmFacsi0C1UhAglWNta4yx4uAcltDQIJVg0IXIiACUScgwYp6DSl/IiACNQQkWDUodCECIhB1AskXrKjXgPInAiJQMAEJVsGo5FEERKDSBCRYla4BpS8CIlAwAQlWwajkMfoElMOkE5BgJb2GVT4RSBABCVaCKlNFEYGkE5BgJb2GVT4RSBCBFMFKUKlUFBEQgUQSkGAlslpVKBFIJgEJVjLrVaUSgUQSkGAlslrzFkoeRCCWBCRYsaw2ZVoEqpOABKs6612lFoFYEpBgxbLalGkRKJxAknxKsJJUmyqLCCScgAQr4RWs4olAkghIsJJUmyqLCCScgAQrTwXLWQREIDoEJFjRqQvlRAREIA8BCVYeQHIWARGIDgEJVnTqQjmpNAGlH3kCEqzIV5EyKAIi4AhIsBwJnUVABCJPQIIV+SpSBkVABByB4ATLxaizCIiACIREQIIVElhFKwIiEDwBCVbwTBWjCIhASAQkWCGBTXa0Kp0IVIaABKsy3JWqCIhACQQkWCVAUxAREIHKEJBgVYa7UhWBuBCIVD4lWJGqDmVGBEQgFwEJVi46chMBEYgUgaoTrCFDhphFixaZ4cOHZ1TEpEmTrBvumLFjx1o/9erVq2WPW9++fa2b32HEiBHW/+DBgzOcp02bZt26du1ay22VVVax9sTtTK9evayfRo0aZbg5P/3797d+dtxxxww/7du3t27usP7669f42XnnnZ21PTdv3rzGzcXdpEkT61bIoXPnzjb89OnTs3pv3bq19TN37twMP3369LFu48ePz3BLtyDvLo+UCfdhw4bZ8M4+9Qwb/DjTokUL63fBggXOykycONHa9e7du8Yu/WLUqFHWz8CBA9OdzIwZM6xbarpcz549O8Mvzw5u48aNy3CTRW4CVSdYuXEE7qoIRUAEAiQgwQoQpqISAREIl4AEK1y+il0ERCBAAhKsAGEqquomoNKHT0CCFT5jpSACIhAQAQlWQCAVjQiIQPgEJFjhM1YKIiACARGIjGAFVB5FIwIikGACEqwEV66KJgJJIyDBSlqNqjwikGACEqwEV25ki6aMiUCJBCRYJYJTMBEQgfITkGCVn7lSFAERKJGABKtEcAomAiJQCIFg/UiwguWp2ERABEIkIMEKEa6iFgERCJaABCtYnopNBEQgRAISrBDh1j1qxSACIpBKQIKVSkPXIiACkSYgwYp09ShzIiACqQQkWKk0dC0ClSOglAsgIMEqAJK8iIAIRIOABCsa9aBciIAIFEBAglUAJHkRARGIBoGkCFY0aCoXIiACoRIITLDWWWcd43leXnPSSSeFWqBCIv/+++/NhRdeaJo2bWq23HJLs8IKK5gtttjCHHrooeaJJ54w2f4de+yxOcvXsmVL36DDhw83J5xwgtljjz3M2muvbdZcc02z++67mwsuuMD88ssvvmFWX331nGl53hLWV1xxRa3wb775pjnjjDPMgQceaDbaaCOz0kormR122MHA/eOPP67lN+wb0vO8Jfn0vNzn7t2718rOW2+9Zfr27WuOO+44s8suu5hVVlnFlueAAw4wAwcONP/++6/J9W/u3Lm2juEAy/3228+cf/755scff/QNtskmmxTEmzr0i6DY9PziKKfdRx99ZM466yzTpEkTAx+ef57fAQMGmH/++aecWSkqrcAEq9BUefgK9RuWPx7iG264wbzwwgtm+vTp5s8//zRffPGFef75581RRx1lunXrFljSQ4cONSeffLIZMWKEee+998zPP/9sZs+ebd5//31z0003me23397wYpeaYCrPzz//3PBi3nXXXebll1823377rfnjjz/M1KlTzYMPPmh23nln88ADD5SaVKjhUstBQjfeeKO55JJLzKhRo8zkyZPNb7/9Zsvzyiuv2BetUaNGtt7wm24Qj+bNmxvqGA6bb765Qcj79+9vG6VsopUej9/9rrvummEdZnoZiQVgMX78eLP//vtb4Z8wYYIh/zz/Tz75pDn33HMt6wCSCSWKwASLh2DRokXGz+C2/PLLm3r16pn27duHUpBiIp03b5458cQTzXPPPVcjWO+884457bTTbDS33nqrefjhh+213+G+++7zLadf7+z333+3vTdaLgSLHtUPP/xghYNWjWt6P+mt2pw5c3zTgO+7775rs0WvFoG1N4sP8+fPN3Cm5/baa6/ZF5yyjhs3zhx00EG25ezSpYsV58XeQ//bbrvtspaBcsCcTKy88sq2B8q1M/Rkrr76ajN27Fjz6aefmr/++st88sknVniJ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";
            var element = document.getElementById('upcacontent');
            var image = (element as any).toDataURL();
            console.log("Image: " + image);
            expect(image === base64Image || image === base64Image2 || image === base64Image3).toBe(true);
            done();
        });
    });


});