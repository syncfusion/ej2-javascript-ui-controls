
import { createElement } from "@syncfusion/ej2-base";
import { BarcodeGenerator } from "../../../src/barcode/barcode";
let barcode: BarcodeGenerator;
let ele: HTMLElement;
describe('Barcode Control ', () => {
    describe('rendering of basic coda bar rendering', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar1' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar1');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('rendering of basic coda bar rendering', (done: Function) => {

            let barcode = document.getElementById('codabar1');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('rendering of basic coda bar rendering');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[2].getAttribute('width')))" + Math.round(Number(children.children[2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 56
                || Math.round(Number(children.children[0].getAttribute('x'))) === 52
                && children.children[1].getAttribute('x') === '10'
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[2].getAttribute('width'))) === 4
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 188).toBe(true);
            done()
        });
    });
    describe('rendering of basic coda bar rendering', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'invalid' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: 'yyy',
                mode: 'SVG',
            });
            barcode.appendTo('#invalid');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('rendering of basic coda bar rendering', (done: Function) => {

            done()
        });
    });


});
describe('Barcode Control ', () => {
    describe('rendering of basic coda bar rendering', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar2' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '600px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
            });
            barcode.appendTo('#codabar2');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('rendering of basic coda bar rendering', (done: Function) => {

            let barcode = document.getElementById('codabar2');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('rendering of basic coda bar rendering');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[2].getAttribute('width')))" + Math.round(Number(children.children[2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 256
                || Math.round(Number(children.children[0].getAttribute('x'))) === 252
                && children.children[1].getAttribute('x') === '10'
                && Math.round(Number(children.children[1].getAttribute('width'))) === 6
                && Math.round(Number(children.children[2].getAttribute('width'))) === 11
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 584).toBe(true);
            done()
        });
    });


});
describe('Barcode Control ', () => {
    describe('Checking the general rendering of bar code - width testing using pixels', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar3' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                margin: { right: -10, left: 30, top: -10 }
                //margin:{left:20,right:-20,top:-30,bottom:10}
            });
            barcode.appendTo('#codabar3');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Checking the general rendering of bar code - width testing using pixels', (done: Function) => {

            let barcode = document.getElementById('codabar3');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('Checking the general rendering of bar code - width testing using pixels');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[2].getAttribute('width')))" + Math.round(Number(children.children[2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))));

            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 76
                || Math.round(Number(children.children[0].getAttribute('x'))) === 72
                && children.children[1].getAttribute('x') === '30'
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[2].getAttribute('width'))) === 4
                && Math.round(Number(children.children[1].getAttribute('x'))) === 30
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 208
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y'))) === -10
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))) === 136
                || Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))) === 137).toBe(true);
            done()
        });
    });


});
describe('Barcode Control ', () => {
    describe('coda bar testing for margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar4' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                margin: {
                    bottom: -20,
                    top: -20,
                    left: -20,
                    right: -20
                }
                //margin:{left:20,right:-20,top:-30,bottom:10}
            });
            barcode.appendTo('#codabar4');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('coda bar testing for margin', (done: Function) => {

            let barcode = document.getElementById('codabar4');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('coda bar testing for margin');
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[2].getAttribute('width')))" + Math.round(Number(children.children[2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))));

            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 56 && children.children[1].getAttribute('x') === '-20'
                && Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[2].getAttribute('width'))) === 5
                && Math.round(Number(children.children[1].getAttribute('x'))) === -20
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 218
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y'))) === -20
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))) === 176);
            done()
        });
    });


});
describe('Barcode Control ', () => {
    describe('coda bar testing for margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar5' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                margin: {
                    bottom: 20,
                    top: 20,
                    left: 20,
                    right: 20
                }
            });
            barcode.appendTo('#codabar5');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('coda bar testing for margin', (done: Function) => {

            let barcode = document.getElementById('codabar5');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('coda bar testing for margin');
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('height')))" + Math.round(Number(children.children[1].getAttribute('height'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('y')))" + Math.round(Number(children.children[1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))));
            console.log("Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width')))" + Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y')))" + Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[1].getAttribute('height'))) === 96
                && Math.round(Number(children.children[1].getAttribute('x'))) === 20
                && Math.round(Number(children.children[1].getAttribute('y'))) === 20
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('x'))) === 178
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('y'))) === 20
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('height'))) === 96
                && Math.round(Number(children.children[children.childElementCount - 1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[0].getAttribute('x'))) === 56
                && Math.round(Number(children.children[0].getAttribute('y'))) === 130
                && (children.children[0] as HTMLElement).style.fontSize === '20px');
            done()
        });
    });


});
describe('Barcode Control ', () => {
    describe('coda bar testing for displaytext margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar6' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                displayText: { text: 'codabar', margin: { left: 70, right: 70, top: 30, bottom: 30 } }
            });
            barcode.appendTo('#codabar6');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('coda bar testing for displaytext margin', (done: Function) => {

            let barcode = document.getElementById('codabar6');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('coda bar testing for displaytext margin');
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('height')))" + Math.round(Number(children.children[1].getAttribute('height'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('y')))" + Math.round(Number(children.children[1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[2].getAttribute('width')))" + Math.round(Number(children.children[2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y')))" + Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[1].getAttribute('height'))) === 56
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[1].getAttribute('y'))) === 10
                && Math.round(Number(children.children[2].getAttribute('width'))) === 4
                && Math.round(Number(children.children[0].getAttribute('x'))) === 80
                && Math.round(Number(children.children[0].getAttribute('y'))) === 110
                && (children.children[0] as HTMLElement).style.fontSize === '10.2px');
            done()
        });
    });


});
describe('Barcode Control ', () => {
    describe('coda bar testing for displaytext margin', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar7' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                displayText: { text: 'codabar', margin: { left: 70, right: 70, top: -40 } }
            });
            barcode.appendTo('#codabar7');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('coda bar testing for displaytext margin', (done: Function) => {

            let barcode = document.getElementById('codabar7');
            let children: HTMLElement = barcode.children[0] as HTMLElement;
            console.log('coda bar testing for displaytext margin');
            console.log("Math.round(Number(children.children[1].getAttribute('width')))" + Math.round(Number(children.children[1].getAttribute('width'))));
            console.log("Math.round(Number(children.children[1].getAttribute('height')))" + Math.round(Number(children.children[1].getAttribute('height'))));
            console.log("Math.round(Number(children.children[1].getAttribute('x')))" + Math.round(Number(children.children[1].getAttribute('x'))));
            console.log("Math.round(Number(children.children[1].getAttribute('y')))" + Math.round(Number(children.children[1].getAttribute('y'))));
            console.log("Math.round(Number(children.children[2].getAttribute('width')))" + Math.round(Number(children.children[2].getAttribute('width'))));
            console.log("Math.round(Number(children.children[0].getAttribute('x')))" + Math.round(Number(children.children[0].getAttribute('x'))));
            console.log("Math.round(Number(children.children[0].getAttribute('y')))" + Math.round(Number(children.children[0].getAttribute('y'))));
            console.log("(children.children[0] as HTMLElement).style.fontSize" + (children.children[0] as HTMLElement).style.fontSize);
            expect(Math.round(Number(children.children[1].getAttribute('width'))) === 2
                && Math.round(Number(children.children[1].getAttribute('height'))) === 116
                && Math.round(Number(children.children[1].getAttribute('x'))) === 10
                && Math.round(Number(children.children[1].getAttribute('y'))) === 10
                && Math.round(Number(children.children[2].getAttribute('width'))) === 4
                && Math.round(Number(children.children[0].getAttribute('x'))) === 80
                && Math.round(Number(children.children[0].getAttribute('y'))) === 100
                && (children.children[0] as HTMLElement).style.fontSize === '10.2px');
            done()
        });
    });


});
var output1 = {
    0: { width: "1.78", height: "86.00", x: 10, y: 10 },//code changed
    1: { width: "3.56", height: "86.00", x: 14, y: 10 },
    2: { width: "1.78", height: "86.00", x: 21, y: 10 },
    3: { width: "1.78", height: "86.00", x: 26, y: 10 },
    4: { width: "1.78", height: "86.00", x: 30, y: 10 },
    5: { width: "1.78", height: "86.00", x: 33, y: 10 },
    6: { width: "3.56", height: "86.00", x: 37, y: 10 },
    7: { width: "1.78", height: "86.00", x: 44, y: 10 },
    8: { width: "1.78", height: "86.00", x: 47, y: 10 },
    9: { width: "1.78", height: "86.00", x: 51, y: 10 },
    10: { width: "1.78", height: "86.00", x: 56, y: 10 },
    11: { width: "3.56", height: "86.00", x: 60, y: 10 },
    12: { width: "3.56", height: "86.00", x: 65, y: 10 },
    13: { width: "1.78", height: "86.00", x: 72, y: 10 },
    14: { width: "1.78", height: "86.00", x: 76, y: 10 },
    15: { width: "1.78", height: "86.00", x: 80, y: 10 },
    16: { width: "1.78", height: "86.00", x: 83, y: 10 },
    17: { width: "3.56", height: "86.00", x: 87, y: 10 },
    18: { width: "1.78", height: "86.00", x: 92, y: 10 },
    19: { width: "1.78", height: "86.00", x: 97, y: 10 },
    20: { width: "1.78", height: "86.00", x: 101, y: 10 },
    21: { width: "1.78", height: "86.00", x: 104, y: 10 },
    22: { width: "3.56", height: "86.00", x: 108, y: 10 },
    23: { width: "1.78", height: "86.00", x: 115, y: 10 },
    24: { width: "1.78", height: "86.00", x: 119, y: 10 },
    25: { width: "1.78", height: "86.00", x: 122, y: 10 },
    26: { width: "1.78", height: "86.00", x: 128, y: 10 },
    27: { width: "3.56", height: "86.00", x: 131, y: 10 },
    28: { width: "3.56", height: "86.00", x: 137, y: 10 },
    29: { width: "1.78", height: "86.00", x: 144, y: 10 },
    30: { width: "1.78", height: "86.00", x: 147, y: 10 },
    31: { width: "1.78", height: "86.00", x: 151, y: 10 },
    32: { width: "1.78", height: "86.00", x: 154, y: 10 },
    33: { width: "3.56", height: "86.00", x: 158, y: 10 },
    34: { width: "1.78", height: "86.00", x: 163, y: 10 },
    35: { width: "1.78", height: "86.00", x: 169, y: 10 },
    36: { width: "1.78", height: "86.00", x: 172, y: 10 },
    37: { width: "3.56", height: "86.00", x: 176, y: 10 },
    38: { width: "1.78", height: "86.00", x: 183, y: 10 },
    39: { width: "1.78", height: "86.00", x: 188, y: 10 },
};
describe('Barcode Control ', () => {
    describe('coda bar testing for all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar8' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '200px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                displayText: { text: 'codabar', margin: { left: 70, right: 70, top: -40, bottom: 30 } }
            });
            barcode.appendTo('#codabar8');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('checking the bar code all lines width height offset x offsety testcase4', (done: Function) => {
            let barcode = document.getElementById('codabar8')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('checking the bar code all lines width height offset x offsety testcase4 - ', 'x'+Math.round(Number(children.children[0].getAttribute('x'))) + 'fontSize' +(children.children[0] as HTMLElement).style.fontSize );
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 80 && (children.children[0] as HTMLElement).style.fontSize === '10.2px' ||
                (children.children[0] as HTMLElement).style.fontSize === '9.4px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                console.log(`${j}: { width: ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, height: ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)}, x: ${Math.round(Number(children.children[j + 1].getAttribute('x'))) }, y: ${Math.round(Number(children.children[j + 1].getAttribute('y')))} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output1[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output1[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output1[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output1[j].height).toBe(true);
            }
            // expect(false).toBe(true);
            done();
        });
    });


});
describe('Barcode Control ', () => {
    describe('coda bar testing for all lines check', () => {
        //let barcode: BarcodeGenerator;
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'codabar9' });
            document.body.appendChild(ele);
            barcode = new BarcodeGenerator({
                width: '700px', height: '150px',
                type: 'Codabar',
                value: '12341234',
                mode: 'SVG',
                margin: { left: 70, right: 70, top: -40, bottom: 30 },
                displayText: { text: 'codabarcodabarcodabarcodabarcodabarcodabarcodabarcodabarcodabar', margin: { left: 70, right: 70 } }
            });
            barcode.appendTo('#codabar9');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        var output2 = {
            0: { width: "5.54", height: "146.00", x: 70, y: -40 },
            1: { width: "11.09", height: "146.00", x: 81, y: -40 },
            2: { width: "5.54", height: "146.00", x: 103, y: -40 },
            3: { width: "5.54", height: "146.00", x: 120, y: -40 },
            4: { width: "5.54", height: "146.00", x: 131, y: -40 },
            5: { width: "5.54", height: "146.00", x: 142, y: -40 },
            6: { width: "11.09", height: "146.00", x: 153, y: -40 },
            7: { width: "5.54", height: "146.00", x: 175, y: -40 },
            8: { width: "5.54", height: "146.00", x: 186, y: -40 },
            9: { width: "5.54", height: "146.00", x: 198, y: -40 },
            10: { width: "5.54", height: "146.00", x: 214, y: -40 },
            11: { width: "11.09", height: "146.00", x: 225, y: -40 },
            12: { width: "11.09", height: "146.00", x: 242, y: -40 },
            13: { width: "5.54", height: "146.00", x: 264, y: -40 },
            14: { width: "5.54", height: "146.00", x: 275, y: -40 },
            15: { width: "5.54", height: "146.00", x: 286, y: -40 },
            16: { width: "5.54", height: "146.00", x: 297, y: -40 },
            17: { width: "11.09", height: "146.00", x: 308, y: -40 },
            18: { width: "5.54", height: "146.00", x: 325, y: -40 },
            19: { width: "5.54", height: "146.00", x: 342, y: -40 },
            20: { width: "5.54", height: "146.00", x: 353, y: -40 },
            21: { width: "5.54", height: "146.00", x: 364, y: -40 },
            22: { width: "11.09", height: "146.00", x: 375, y: -40 },
            23: { width: "5.54", height: "146.00", x: 397, y: -40 },
            24: { width: "5.54", height: "146.00", x: 408, y: -40 },
            25: { width: "5.54", height: "146.00", x: 419, y: -40 },
            26: { width: "5.54", height: "146.00", x: 436, y: -40 },
            27: { width: "11.09", height: "146.00", x: 447, y: -40 },
            28: { width: "11.09", height: "146.00", x: 464, y: -40 },
            29: { width: "5.54", height: "146.00", x: 486, y: -40 },
            30: { width: "5.54", height: "146.00", x: 497, y: -40 },
            31: { width: "5.54", height: "146.00", x: 508, y: -40 },
            32: { width: "5.54", height: "146.00", x: 519, y: -40 },
            33: { width: "11.09", height: "146.00", x: 530, y: -40 },
            34: { width: "5.54", height: "146.00", x: 547, y: -40 },
            35: { width: "5.54", height: "146.00", x: 563, y: -40 },
            36: { width: "5.54", height: "146.00", x: 575, y: -40 },
            37: { width: "11.09", height: "146.00", x: 586, y: -40 },
            38: { width: "5.54", height: "146.00", x: 608, y: -40 },
            39: { width: "5.54", height: "146.00", x: 624, y: -40 },
        };
        it('checking the bar code all lines width height offset x offsety testcase4', (done: Function) => {
            let barcode = document.getElementById('codabar9')
            let children: HTMLElement = barcode.children[0] as HTMLElement
            console.log('coda bar testing for all lines check - ','x'+Math.round(Number(children.children[0].getAttribute('x'))) + 'fontSize' +(children.children[0] as HTMLElement).style.fontSize );
            expect(Math.round(Number(children.children[0].getAttribute('x'))) === 140 && (children.children[0] as HTMLElement).style.fontSize === '12px'
                || (children.children[0] as HTMLElement).style.fontSize === '11px').toBe(true);
            for (let j: number = 1; j < children.children.length - 1; j++) {
                console.log(`${j}: { width: ${parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2)}, height: ${parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2)}, x: ${Math.round(Number(children.children[j + 1].getAttribute('x'))) }, y: ${Math.round(Number(children.children[j + 1].getAttribute('y')))} }`);
                expect(Math.round(Number(children.children[j + 1].getAttribute('x'))) === output2[j].x && Math.round(Number(children.children[j + 1].getAttribute('y'))) === output2[j].y
                    && parseFloat((children.children[j + 1].getAttribute('width'))).toFixed(2) === output2[j].width
                    && parseFloat((children.children[j + 1].getAttribute('height'))).toFixed(2) === output2[j].height).toBe(true);

            }
            // expect(false).toBe(true);
            done();
        });
    });


});

describe('barcode export - SVG mode', () => {
    beforeAll((): void => {
        ele = createElement('div', { id: 'codabar2' });
        document.body.appendChild(ele);
        barcode = new BarcodeGenerator({
            width: '200px', height: '150px',
            type: 'Code39',
            value: "ABCD",
            displayText: { visibility: true, size: 9,  text: "ABCD"},
        });
        barcode.appendTo('#codabar2');
    });

    afterAll((): void => {
        barcode.destroy();
        ele.remove();
    });
    
    it('barcode export - - return Base64 in JPG format', (done: Function) => {
        barcode.exportAsBase64Image('JPG');
        done()
        console.log('########################################################################');
    });
    it('barcode export - return Base64 in PNG format', (done: Function) => {
        barcode.exportAsBase64Image('PNG');
        done()
    });
    it('barcode export - Download the image in JPG format', (done: Function) => {
        let svg: any; 
        svg = barcode.exportImage('Export','JPG');
        expect(svg).not.toBeNull();
        done()
    });
});

describe('barcode export - Canvas mode', () => {
    beforeAll((): void => {
        ele = createElement('div', { id: 'codabar2' });
        document.body.appendChild(ele);
        barcode = new BarcodeGenerator({
            width: '200px', height: '150px',
            type: 'Code39',
            mode:'Canvas',
            value: "ABCD",
            displayText: { visibility: true, size: 9,  text: ""},
        });
        barcode.appendTo('#codabar2');
    });

    afterAll((): void => {
        barcode.destroy();
        ele.remove();
    });
    
    it('barcode export - return Base64 in JPG format', (done: Function) => {
        barcode.exportAsBase64Image('JPG') ;
        done()
    });
    it('barcode export - return Base64 in PNG format' ,(done: Function) => {
        barcode.exportAsBase64Image('PNG');
        done()
    });
    it('barcode export - Download the image in JPG format', (done: Function) => {
        let svg: any; 
        svg = barcode.exportImage('Export','JPG');
        expect(svg).not.toBeNull();
        done()
    });
});