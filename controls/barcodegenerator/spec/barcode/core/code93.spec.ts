import { BarcodeGenerator } from "../../../src/barcode/barcode";
import { createElement } from "@syncfusion/ej2-base";
let ele: HTMLElement;
let barcode1: BarcodeGenerator;
describe('Barcode Control ', () => {
    describe('EAN8 bar testing for all lines check  EAN8 barcode', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code93',
                value: 'BARCODE',
                width: '200px', height: '150px',
                //enableCheckSum: false,
                displayText: { position: 'Top', alignment: 'Left' },
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "1.80", height: "116.00", x: 10, y: 24 },
            1: { width: "1.80", height: "116.00", x: 14, y: 24 },
            2: { width: "7.20", height: "116.00", x: 17, y: 24 },
            3: { width: "3.60", height: "116.00", x: 26, y: 24 },
            4: { width: "1.80", height: "116.00", x: 32, y: 24 },
            5: { width: "1.80", height: "116.00", x: 37, y: 24 },
            6: { width: "3.60", height: "116.00", x: 42, y: 24 },
            7: { width: "1.80", height: "116.00", x: 48, y: 24 },
            8: { width: "1.80", height: "116.00", x: 51, y: 24 },
            9: { width: "3.60", height: "116.00", x: 59, y: 24 },
            10: { width: "3.60", height: "116.00", x: 64, y: 24 },
            11: { width: "1.80", height: "116.00", x: 71, y: 24 },
            12: { width: "3.60", height: "116.00", x: 75, y: 24 },
            13: { width: "1.80", height: "116.00", x: 80, y: 24 },
            14: { width: "1.80", height: "116.00", x: 87, y: 24 },
            15: { width: "1.80", height: "116.00", x: 91, y: 24 },
            16: { width: "1.80", height: "116.00", x: 96, y: 24 },
            17: { width: "3.60", height: "116.00", x: 100, y: 24 },
            18: { width: "3.60", height: "116.00", x: 107, y: 24 },
            19: { width: "1.80", height: "116.00", x: 114, y: 24 },
            20: { width: "1.80", height: "116.00", x: 118, y: 24 },
            21: { width: "3.60", height: "116.00", x: 123, y: 24 },
            22: { width: "1.80", height: "116.00", x: 131, y: 24 },
            23: { width: "1.80", height: "116.00", x: 136, y: 24 },
            24: { width: "1.80", height: "116.00", x: 140, y: 24 },
            25: { width: "1.80", height: "116.00", x: 149, y: 24 },
            26: { width: "1.80", height: "116.00", x: 152, y: 24 },
            27: { width: "1.80", height: "116.00", x: 156, y: 24 },
            28: { width: "5.40", height: "116.00", x: 161, y: 24 },
            29: { width: "1.80", height: "116.00", x: 168, y: 24 },
            30: { width: "1.80", height: "116.00", x: 172, y: 24 },
            31: { width: "1.80", height: "116.00", x: 176, y: 24 },
            32: { width: "7.20", height: "116.00", x: 179, y: 24 },
            33: { width: "1.80", height: "116.00", x: 188, y: 24 },
        };
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('EAN8 bar testing for all lines check  EAN8 barcode');
            console.log('x '+Math.round(Number(children.children[0].getAttribute('x'))) + 'y ' +  Math.round(Number(children.children[0].getAttribute('y'))) + 'fontSize ' + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 10 && Math.round(Number(children.children[0].getAttribute('y'))) === 22 && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                console.log(`${j}: { width: ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, height: ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)}, x: ${Math.round(Number(children.children[j + 1].getAttribute('x'))) }, y: ${Math.round(Number(children.children[j + 1].getAttribute('y')))} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x
                    && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            // expect(false).toBe(true);
            done();
        });
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let component = barcode1;
            component.mode = 'Canvas'
            component.dataBind();
            component.width = '201px'
            component.dataBind();
            component.backgroundColor = 'red'
            done()
        })

    });


    describe('code32 bar testing for all lines check  code32 barcode', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code32',
                value: '12345678',
                width: '200px', height: '150px',
                displayText: { position: 'Top', alignment: 'Left' },
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "1.40", height: "116.00", x: 10, y: 24 },
            1: { width: "1.40", height: "116.00", x: 14, y: 24 },
            2: { width: "2.79", height: "116.00", x: 17, y: 24 },
            3: { width: "2.79", height: "116.00", x: 21, y: 24 },
            4: { width: "1.40", height: "116.00", x: 25, y: 24 },
            5: { width: "2.79", height: "116.00", x: 28, y: 24 },
            6: { width: "1.40", height: "116.00", x: 32, y: 24 },
            7: { width: "1.40", height: "116.00", x: 37, y: 24 },
            8: { width: "1.40", height: "116.00", x: 39, y: 24 },
            9: { width: "2.79", height: "116.00", x: 42, y: 24 },
            10: { width: "1.40", height: "116.00", x: 46, y: 24 },
            11: { width: "2.79", height: "116.00", x: 49, y: 24 },
            12: { width: "1.40", height: "116.00", x: 55, y: 24 },
            13: { width: "1.40", height: "116.00", x: 57, y: 24 },
            14: { width: "2.79", height: "116.00", x: 60, y: 24 },
            15: { width: "2.79", height: "116.00", x: 64, y: 24 },
            16: { width: "2.79", height: "116.00", x: 69, y: 24 },
            17: { width: "1.40", height: "116.00", x: 74, y: 24 },
            18: { width: "1.40", height: "116.00", x: 77, y: 24 },
            19: { width: "1.40", height: "116.00", x: 80, y: 24 },
            20: { width: "1.40", height: "116.00", x: 83, y: 24 },
            21: { width: "1.40", height: "116.00", x: 85, y: 24 },
            22: { width: "2.79", height: "116.00", x: 90, y: 24 },
            23: { width: "1.40", height: "116.00", x: 94, y: 24 },
            24: { width: "2.79", height: "116.00", x: 97, y: 24 },
            25: { width: "2.79", height: "116.00", x: 101, y: 24 },
            26: { width: "1.40", height: "116.00", x: 105, y: 24 },
            27: { width: "2.79", height: "116.00", x: 109, y: 24 },
            28: { width: "1.40", height: "116.00", x: 113, y: 24 },
            29: { width: "1.40", height: "116.00", x: 116, y: 24 },
            30: { width: "1.40", height: "116.00", x: 119, y: 24 },
            31: { width: "2.79", height: "116.00", x: 122, y: 24 },
            32: { width: "2.79", height: "116.00", x: 127, y: 24 },
            33: { width: "1.40", height: "116.00", x: 131, y: 24 },
            34: { width: "1.40", height: "116.00", x: 134, y: 24 },
            35: { width: "1.40", height: "116.00", x: 137, y: 24 },
            36: { width: "1.40", height: "116.00", x: 140, y: 24 },
            37: { width: "1.40", height: "116.00", x: 144, y: 24 },
            38: { width: "2.79", height: "116.00", x: 147, y: 24 },
            39: { width: "2.79", height: "116.00", x: 151, y: 24 },
            40: { width: "2.79", height: "116.00", x: 155, y: 24 },
            41: { width: "1.40", height: "116.00", x: 159, y: 24 },
            42: { width: "1.40", height: "116.00", x: 163, y: 24 },
            43: { width: "2.79", height: "116.00", x: 166, y: 24 },
            44: { width: "1.40", height: "116.00", x: 170, y: 24 },
            45: { width: "1.40", height: "116.00", x: 173, y: 24 },
            46: { width: "1.40", height: "116.00", x: 177, y: 24 },
            47: { width: "2.79", height: "116.00", x: 180, y: 24 },
            48: { width: "2.79", height: "116.00", x: 184, y: 24 },
            49: { width: "1.40", height: "116.00", x: 189, y: 24 },
        };
        it('code32 bar testing for all lines check  code32 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('code32 bar testing for all lines check  code32 barcode');
             console.log('x '+Math.round(Number(children.children[0].getAttribute('x'))) + 'y ' +  Math.round(Number(children.children[0].getAttribute('y'))) + 'fontSize ' + (children.children[0] as HTMLElement).style.fontSize)
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 10 && Math.round(Number(children.children[0].getAttribute('y'))) === 22 && (children.children[0] as HTMLElement).style.fontSize === '20px').toBe(true);
            for (var j = 0; j < children.children.length - 2; j++) {
                 console.log(`${j}: { width: ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, height: ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)}, x: ${Math.round(Number(children.children[j + 1].getAttribute('x'))) }, y: ${Math.round(Number(children.children[j + 1].getAttribute('y')))} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x
                    && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            // expect(false).toBe(true);
            done();
        });
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let component = barcode1;
            component.mode = 'Canvas'
            component.dataBind();
            component.width = '201px'
            component.dataBind();
            component.backgroundColor = 'red'
            done()
        })

    });

    describe('code32 bar testing for all lines check  invalid character', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code32',
                value: '145678',
                width: '200px', height: '150px',
                displayText: { position: 'Top', alignment: 'Left' },
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });

        it('code32 bar testing for all lines check  invalid character', (done: Function) => {

            done();
        });
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let component = barcode1;
            component.mode = 'Canvas'
            component.dataBind();
            component.width = '201px'
            component.dataBind();
            component.backgroundColor = 'red'
            done()
        })

    });
    describe('code32 bar testing for all lines check  invalid character', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code32',
                value: '12345678',
                enableCheckSum: false,
                width: '200px', height: '150px',
                displayText: { position: 'Top', alignment: 'Left' },
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });

        it('code32 bar testing for all lines check  invalid character', (done: Function) => {

            done();
        });
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let component = barcode1;
            component.mode = 'Canvas'
            component.dataBind();
            component.width = '201px'
            component.dataBind();
            component.backgroundColor = 'red'
            done()
        })

    });


    describe('upcTestCase bar testing for all lines check  upcTestCase barcode', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'UpcA',
                value: '72527273070',
                displayText: { margin: { top: 10, bottom: 10 } },
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });
        var output1 = {
            0: { width: "1.51", height: "130.00", x: 22, y: 10 },
            1: { width: "1.51", height: "130.00", x: 25, y: 10 },
            2: { width: "4.54", height: "130.00", x: 28, y: 10 },
            3: { width: "3.03", height: "130.00", x: 34, y: 10 },
            4: { width: "1.51", height: "96.00", x: 40, y: 10 },
            5: { width: "3.03", height: "96.00", x: 45, y: 10 },
            6: { width: "3.03", height: "96.00", x: 49, y: 10 },
            7: { width: "1.51", height: "96.00", x: 57, y: 10 },
            8: { width: "1.51", height: "96.00", x: 61, y: 10 },
            9: { width: "3.03", height: "96.00", x: 66, y: 10 },
            10: { width: "4.54", height: "96.00", x: 71, y: 10 },
            11: { width: "3.03", height: "96.00", x: 77, y: 10 },
            12: { width: "1.51", height: "96.00", x: 83, y: 10 },
            13: { width: "3.03", height: "96.00", x: 87, y: 10 },
            14: { width: "1.51", height: "130.00", x: 92, y: 10 },
            15: { width: "1.51", height: "130.00", x: 95, y: 10 },
            16: { width: "1.51", height: "96.00", x: 98, y: 10 },
            17: { width: "1.51", height: "96.00", x: 104, y: 10 },
            18: { width: "1.51", height: "96.00", x: 108, y: 10 },
            19: { width: "1.51", height: "96.00", x: 116, y: 10 },
            20: { width: "4.54", height: "96.00", x: 119, y: 10 },
            21: { width: "1.51", height: "96.00", x: 126, y: 10 },
            22: { width: "1.51", height: "96.00", x: 129, y: 10 },
            23: { width: "1.51", height: "96.00", x: 136, y: 10 },
            24: { width: "4.54", height: "96.00", x: 140, y: 10 },
            25: { width: "1.51", height: "96.00", x: 148, y: 10 },
            26: { width: "1.51", height: "130.00", x: 151, y: 10 },
            27: { width: "1.51", height: "130.00", x: 154, y: 10 },
            28: { width: "1.51", height: "130.00", x: 161, y: 10 },
            29: { width: "1.51", height: "130.00", x: 164, y: 10 },
        };
        it('upcTestCase bar testing for all lines check  upcTestCase barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('upcTestCase bar testing for all lines check  upcTestCase barcode');
             console.log('x '+Math.round(Number(children.children[0].getAttribute('x'))) + 'y ' +  Math.round(Number(children.children[0].getAttribute('y'))) + 'fontSize ' + (children.children[0] as HTMLElement).style.fontSize)
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 11
                && Math.round(Number(children.children[0].getAttribute('y'))) === 132 && (children.children[0] as HTMLElement).style.fontSize === '15.4px').toBe(true);
            for (var j = 0; j < children.children.length - 4; j++) {
                 console.log(`${j}: { width: ${parseFloat((children.children[j + 4].getAttribute('width'))).toFixed(2)}, height: ${parseFloat((children.children[j + 4].getAttribute('height'))).toFixed(2)}, x: ${Math.round(Number(children.children[j + 4].getAttribute('x'))) }, y: ${Math.round(Number(children.children[j + 4].getAttribute('y')))} }`);
                expect(Math.round(Number(children.children[j + 4].getAttribute('x'))) === output1[j].x
                    && Math.round(Number(children.children[j + 4].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 4].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 4].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);

            }
            // expect(false).toBe(true);
            done();
        });
        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let component = barcode1;
            component.mode = 'Canvas'
            component.dataBind();
            component.width = '201px'
            component.dataBind();
            component.backgroundColor = 'red'
            done()
        })

    });








    describe('Code11 bar testing for all lines check  EAN8 barcode', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code11',
                value: '1234',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            done();
        })

    });


    describe('Code93Extension bar testing for all lines check  Code93Extension barcode', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code93Extension',
                value: '11223',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('EAN8 bar testing for all lines check  EAN8 barcode', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('x ' + Math.round(Number(children.children[12].getAttribute('x'))) + 'y ' + Math.round(Number(children.children[12].getAttribute('y'))));
            expect(Math.round(Number(children.children[12].getAttribute('x'))) === 82 && Math.round(Number(children.children[12].getAttribute('y'))) === 10).toBe(true);
            done();
        })

    });

    describe('UPCE invalid Caharacter', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'UpcE',
                value: '1234',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('UPCE invalid Caharacter', (done: Function) => {
            done();
        })

    });

    describe('code11 invalid Caharacter', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code11',
                value: 'BARCODE',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('UPCE invalid Caharacter', (done: Function) => {
            done();
        })

    });

    describe('code93 invalid Caharacter', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code93',
                value: 'BdARCODE',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('UPCE invalid Caharacter', (done: Function) => {
            done();
        })

    });
    describe('code93 disablechecksum', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code93',
                enableCheckSum: false,
                value: 'BARCODE',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('UPCE invalid Caharacter', (done: Function) => {
            done();
        })

    });

    describe('code93 extended invalid Caharacter', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code93Extension',
                value: 'syncfusion',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('code93 extended invalid Caharacter', (done: Function) => {
            let barcode = document.getElementById('codabar1')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('x ' + Math.round(Number(children.children[12].getAttribute('x'))) + 'y ' + Math.round(Number(children.children[12].getAttribute('y'))));
            expect(Math.round(Number(children.children[12].getAttribute('x'))) === 38 && Math.round(Number(children.children[12].getAttribute('y'))) === 10).toBe(true);
            done();
        })

    });

    describe('code39 extendedinvalid Caharacter', () => {
        //let barcode1: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode1 = new BarcodeGenerator({
                type: 'Code39Extension',
                value: 'BARC`ÃODE',
                width: '200px', height: '150px',
                mode: 'SVG'
            });
            barcode1.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode1.destroy();
            ele.remove();
        });


        it('UPCE invalid Caharacter', (done: Function) => {
            done();
        })

    });



});