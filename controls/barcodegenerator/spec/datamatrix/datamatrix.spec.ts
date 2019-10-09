import { DataMatrixGenerator } from "../../src/datamatrix/datamatrix";
import { createElement } from "@syncfusion/ej2-base";
import { DataMatrixSize } from "../../src/barcode/enum/enum";
function output(children: Element): void {

    // let outuput = 'expect(Math.round(Number(children.children[10].getAttribute("x"))) ==' + Math.round(Number(children.children[10].getAttribute('x'))) + '&& ' +
    //     'Math.round(Number(children.children[10].getAttribute("y"))) ==' + Math.round(Number(children.children[10].getAttribute("y"))) + '&& ' +
    //     'Math.round(Number(children.children[100].getAttribute("x")))==' + Math.round(Number(children.children[100].getAttribute("x"))) + '&& ' +
    //     'Math.round(Number(children.children[100].getAttribute("y"))) ==' + Math.round(Number(children.children[100].getAttribute("y"))) + '&& ' +
    //     '((children.children[10].getAttribute("fill"))) =="' + ((children.children[10].getAttribute("fill"))) + '").toBe(true);';
    //console.log(outuput);
}
let barcode: DataMatrixGenerator;
let ele: HTMLElement;
describe('Barcode Control ', () => {
    describe('output(children);done();', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.com',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('output(children);done();output(children);done();', (done: Function) => {
            var children = document.getElementById('barcode').children[0]


            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 25 && Math.round(Number(children.children[10].getAttribute("y"))) == 27 && Math.round(Number(children.children[100].getAttribute("x"))) == 33 && Math.round(Number(children.children[100].getAttribute("y"))) == 102 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('output(children);done(); coverage', () => {

        ////let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: '2€WWW.Sy2ncfusion.com',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with ascii encoding value coverage', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==25&& Math.round(Number(children.children[10].getAttribute("y"))) ==27&& Math.round(Number(children.children[100].getAttribute("x")))==33&& Math.round(Number(children.children[100].getAttribute("y"))) ==102&& ((children.children[10].getAttribute("fill"))) =="black").toBe(true);

            // expect(Math.round(Number(children.children[123].getAttribute('x'))) === 107
            //     && Math.round(Number(children.children[123].getAttribute('y'))) === 46
            //     && Math.round(Number(children.children[123].getAttribute('width'))) === 7 &&
            //     Math.round(Number(children.children[123].getAttribute('height'))) === 7
            //     && (Math.round(Number(children.children[150].getAttribute('x')))) === 143 &&
            //     (Math.round(Number(children.children[150].getAttribute('y')))) === 53).toBe(true);
            //output(children);
            done();
        });
    });
    describe('Datamatrix barcode check with ascii Numberic encoding value', () => {
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                encoding: 'ASCIINumeric',
                value: '1234567890',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with ascii Numberic encoding value', (done: Function) => {
            var children = document.getElementById('barcode').children[0]


            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 112 && Math.round(Number(children.children[10].getAttribute("y"))) == 34 && Math.round(Number(children.children[50].getAttribute("x"))) == 76 && Math.round(Number(children.children[50].getAttribute("y"))) == 117 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });
    describe('Datamatrix barcode check with ascii Numberic encoding value for code coverage', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                encoding: 'ASCIINumeric',
                value: '123456789',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with ascii Numberic encoding value for code coverage', (done: Function) => {
            var children = document.getElementById('barcode').children[0]


            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 112 && Math.round(Number(children.children[10].getAttribute("y"))) == 34 && Math.round(Number(children.children[50].getAttribute("x"))) == 88 && Math.round(Number(children.children[50].getAttribute("y"))) == 117 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });
    describe('Datamatrix barcode check with Base256 encoding value', () => {
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                encoding: 'Base256',
                xDimension: 1,
                value: 'WWW.Syncfusion.com123456789',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with Base256 encoding value', (done: Function) => {
            var children = document.getElementById('barcode').children[0]


            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 149 && Math.round(Number(children.children[10].getAttribute("y"))) == 17 && Math.round(Number(children.children[100].getAttribute("x"))) == 79 && Math.round(Number(children.children[100].getAttribute("y"))) == 79 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check with Base256 encoding value greater value', () => {
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                encoding: 'Base256',
                xDimension: 1,
                value: 'WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789WWW.Syncfusion.com123456789',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with Base256 encoding value greater value', (done: Function) => {
            var children = document.getElementById('barcode').children[0]


            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 60 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 161 && Math.round(Number(children.children[100].getAttribute("y"))) == 17 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check with Base256 encoding value greater value placementcornerD coverage', () => {
        //let ele: HTMLElement;
        let errorMessage: string;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                invalid: invalid,
                xDimension: 1,
                value: 'WWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size8x18//code added "D"
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        it('Datamatrix barcode check with Base256 encoding value greater value placementcornerD coverage', (done: Function) => {
            expect(errorMessage === "Data too long for {0}x{1} barcode.").toBe(true);
            done();
            //output(children);done();
        });
    });
    describe('Datamatrix barcode check with Base256 encoding value greater value placementcornerC coverage', () => {
        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size16x48
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with Base256 encoding value greater value placementcornerC coverage', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            output(children); done();
        });
    });
    describe('Datamatrix barcode check with Base256 encoding value greater value placementcornerB coverage', () => {
        //let ele: HTMLElement;
        let errorMessage: any;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                invalid: invalid,
                value: 'WWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size16x16
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        function invalid(args: any) {
            errorMessage = args.message
        }
        it('Datamatrix barcode check with Base256 encoding value greater value placementcornerB coverage', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //let errorMessage

            expect(errorMessage === "Data too long for {0}x{1} barcode.").toBe(true);
            //output(children);
            done();
        });
    });
    describe('Datamatrix barcode check with margin values enabled', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                margin: {
                    left: 20,
                    right: 30,
                    top: 30,
                    bottom: 30
                },

                value: 'A',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check with margin values enabled', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 137 && Math.round(Number(children.children[10].getAttribute("y"))) == 51 && Math.round(Number(children.children[50].getAttribute("x"))) == 127 && Math.round(Number(children.children[50].getAttribute("y"))) == 135 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                foreColor: 'red',
                backgroundColor: 'blue',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('Datamatrix barcode check fore color and BG color', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 92 && Math.round(Number(children.children[10].getAttribute("y"))) == 14 && Math.round(Number(children.children[100].getAttribute("x"))) == 104 && Math.round(Number(children.children[100].getAttribute("y"))) == 30 && ((children.children[10].getAttribute("fill"))) == "red").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size104x104', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size104x104
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]

            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 47 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 161 && Math.round(Number(children.children[100].getAttribute("y"))) == 13 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size96x96', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size96x96
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 49 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 18 && Math.round(Number(children.children[100].getAttribute("y"))) == 15 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size88x88', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size88x88
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 52 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 43 && Math.round(Number(children.children[100].getAttribute("y"))) == 16 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size80x80', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size80x80
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 55 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 61 && Math.round(Number(children.children[100].getAttribute("y"))) == 16 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size72x72', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size72x72
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //debugger
            //ou/tput(children);
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 60 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 102 && Math.round(Number(children.children[100].getAttribute("y"))) == 17 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size64x64', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size64x64
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 65 && Math.round(Number(children.children[10].getAttribute("y"))) == 13 && Math.round(Number(children.children[100].getAttribute("x"))) == 145 && Math.round(Number(children.children[100].getAttribute("y"))) == 18 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size52x52', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size52x52
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 75 && Math.round(Number(children.children[10].getAttribute("y"))) == 13 && Math.round(Number(children.children[100].getAttribute("x"))) == 85 && Math.round(Number(children.children[100].getAttribute("y"))) == 22 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size48x48', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size48x48
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 80 && Math.round(Number(children.children[10].getAttribute("y"))) == 13 && Math.round(Number(children.children[100].getAttribute("x"))) == 153 && Math.round(Number(children.children[100].getAttribute("y"))) == 23 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size44x44', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size44x44
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 86 && Math.round(Number(children.children[10].getAttribute("y"))) == 14 && Math.round(Number(children.children[100].getAttribute("x"))) == 31 && Math.round(Number(children.children[100].getAttribute("y"))) == 28 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size40x40', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size40x40
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 92 && Math.round(Number(children.children[10].getAttribute("y"))) == 14 && Math.round(Number(children.children[100].getAttribute("x"))) == 104 && Math.round(Number(children.children[100].getAttribute("y"))) == 30 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size36x36', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW.Syncfusion.comWWW.Syncfusion',
                height: 200, width: 200,
                size: DataMatrixSize.Size36x36
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 100 && Math.round(Number(children.children[10].getAttribute("y"))) == 14 && Math.round(Number(children.children[100].getAttribute("x"))) == 47 && Math.round(Number(children.children[100].getAttribute("y"))) == 36 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);

            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size32x32', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW.Syncfusion.comWWW.Syncfusion',
                height: 200, width: 200,
                size: DataMatrixSize.Size32x32
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 110 && Math.round(Number(children.children[10].getAttribute("y"))) == 15 && Math.round(Number(children.children[100].getAttribute("x"))) == 115 && Math.round(Number(children.children[100].getAttribute("y"))) == 39 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size32x32', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW.Syncfusion.comWWW.Syncfusion',
                height: 200, width: 200,
                size: DataMatrixSize.Size32x32
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 110 && Math.round(Number(children.children[10].getAttribute("y"))) == 15 && Math.round(Number(children.children[100].getAttribute("x"))) == 115 && Math.round(Number(children.children[100].getAttribute("y"))) == 39 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size26x26', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW',
                height: 200, width: 200,
                size: DataMatrixSize.Size26x26
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 130 && Math.round(Number(children.children[10].getAttribute("y"))) == 16 && Math.round(Number(children.children[100].getAttribute("x"))) == 136 && Math.round(Number(children.children[100].getAttribute("y"))) == 58 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });


    describe('Datamatrix barcode check fore color and BG color with size Size24x24', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW',
                height: 200, width: 200,
                size: DataMatrixSize.Size24x24
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 138 && Math.round(Number(children.children[10].getAttribute("y"))) == 16 && Math.round(Number(children.children[100].getAttribute("x"))) == 74 && Math.round(Number(children.children[100].getAttribute("y"))) == 68 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size22x22', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW',
                height: 200, width: 200,
                size: DataMatrixSize.Size22x22
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 149 && Math.round(Number(children.children[10].getAttribute("y"))) == 17 && Math.round(Number(children.children[100].getAttribute("x"))) == 142 && Math.round(Number(children.children[100].getAttribute("y"))) == 72 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size20x20', () => {//error

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                invalid: invalid,
                xDimension: 1,
                value: 'WWW.Syncfusion.comWWW.a.comWWW',
                height: 200, width: 200,
                size: DataMatrixSize.Size20x20
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        it('renderin', (done: Function) => {
            expect(errorMessage === "Data too long for {0}x{1} barcode.").toBe(true);
            done()
            //output(children);done();
        });
    });









    //////////////// test case divide






    describe('Datamatrix barcode check fore color and BG color with size Size18x18', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syncfusion',
                height: 200, width: 200,
                size: DataMatrixSize.Size18x18
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 25 && Math.round(Number(children.children[10].getAttribute("y"))) == 27 && Math.round(Number(children.children[100].getAttribute("x"))) == 133 && Math.round(Number(children.children[100].getAttribute("y"))) == 102 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size14x14', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.Syns',
                height: 200, width: 200,
                size: DataMatrixSize.Size14x14
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 90 && Math.round(Number(children.children[10].getAttribute("y"))) == 31 && Math.round(Number(children.children[100].getAttribute("x"))) == 79 && Math.round(Number(children.children[100].getAttribute("y"))) == 156 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size12x12', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.',
                height: 200, width: 200,
                size: DataMatrixSize.Size12x12
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 124 && Math.round(Number(children.children[10].getAttribute("y"))) == 34 && Math.round(Number(children.children[15].getAttribute("x"))) == 64 && Math.round(Number(children.children[15].getAttribute("y"))) == 46 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size10x10', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WW',
                height: 200, width: 200,
                size: DataMatrixSize.Size10x10
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 31 && Math.round(Number(children.children[10].getAttribute("y"))) == 52 && Math.round(Number(children.children[15].getAttribute("x"))) == 100 && Math.round(Number(children.children[15].getAttribute("y"))) == 66 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Auto', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWwljkmjvekrnjvknfekmvkjfvbljhfvbljhfvbljhfvbklhfvhgfvbvbhfgWWwljkmjvekrnjvknfekmvkjfvbljhfvbljhfvbljhfvbklhfvhgfvbvbhfgWWwljkmjvekrnjvknfekmvkjfvbljhfvbljhfvbljhfvbklhfvhgfvbvbhfgWWwljkmjvekrnjvknfekmvkjfvbljhfvbljhfvbljhfvbklhfvhgfvbvbhfg',
                height: 200, width: 200,
                size: DataMatrixSize.Auto
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 65 && Math.round(Number(children.children[10].getAttribute("y"))) == 13 && Math.round(Number(children.children[100].getAttribute("x"))) == 148 && Math.round(Number(children.children[100].getAttribute("y"))) == 18 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size8x18', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjv',
                height: 200, width: 200,
                size: DataMatrixSize.Size8x18
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 25 && Math.round(Number(children.children[10].getAttribute("y"))) == 43 && Math.round(Number(children.children[15].getAttribute("x"))) == 83 && Math.round(Number(children.children[15].getAttribute("y"))) == 43 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size8x18', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjv',
                height: 200, width: 200,
                size: DataMatrixSize.Size8x18
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 25 && Math.round(Number(children.children[10].getAttribute("y"))) == 43 && Math.round(Number(children.children[15].getAttribute("x"))) == 83 && Math.round(Number(children.children[15].getAttribute("y"))) == 43 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size8x32', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjvdl',
                height: 200, width: 200,
                size: DataMatrixSize.Size8x32
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 110 && Math.round(Number(children.children[10].getAttribute("y"))) == 27 && Math.round(Number(children.children[100].getAttribute("x"))) == 149 && Math.round(Number(children.children[100].getAttribute("y"))) == 110 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size12x26', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjvdlfkbnjfkdn',
                height: 200, width: 200,
                size: DataMatrixSize.Size12x26
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 130 && Math.round(Number(children.children[10].getAttribute("y"))) == 22 && Math.round(Number(children.children[100].getAttribute("x"))) == 46 && Math.round(Number(children.children[100].getAttribute("y"))) == 93 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size12x36', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjvdlfkbnjfkdnijhjhbj',
                height: 200, width: 200,
                size: DataMatrixSize.Size12x36
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 100 && Math.round(Number(children.children[10].getAttribute("y"))) == 22 && Math.round(Number(children.children[100].getAttribute("x"))) == 52 && Math.round(Number(children.children[100].getAttribute("y"))) == 81 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size16x36', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjvdlfkbnjfkdnijhjhbjuhuhuhuh',
                height: 200, width: 200,
                size: DataMatrixSize.Size16x36
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 100 && Math.round(Number(children.children[10].getAttribute("y"))) == 19 && Math.round(Number(children.children[100].getAttribute("x"))) == 157 && Math.round(Number(children.children[100].getAttribute("y"))) == 56 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size16x48', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjvdlfkbnjfkdnijhjhbjuhuhuhuh',
                height: 200, width: 200,
                size: DataMatrixSize.Size16x48
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 80 && Math.round(Number(children.children[10].getAttribute("y"))) == 19 && Math.round(Number(children.children[100].getAttribute("x"))) == 127 && Math.round(Number(children.children[100].getAttribute("y"))) == 47 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });
    describe('Datamatrix barcode check fore color and BG color with size Size120x120', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'dfjvdlfkbnjfkdnijhjhbjuhuhuhuh',
                height: 200, width: 200,
                size: DataMatrixSize.Size120x120
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 43 && Math.round(Number(children.children[10].getAttribute("y"))) == 11 && Math.round(Number(children.children[100].getAttribute("x"))) == 118 && Math.round(Number(children.children[100].getAttribute("y"))) == 13 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('Datamatrix barcode check fore color and BG color with size Size132x132', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.com',
                height: 200, width: 200,
                size: DataMatrixSize.Size132x132
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 40 && Math.round(Number(children.children[10].getAttribute("y"))) == 11 && Math.round(Number(children.children[100].getAttribute("x"))) == 88 && Math.round(Number(children.children[100].getAttribute("y"))) == 12 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });


    describe('DataMatrix ascii encoding  Auto', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                value: 'dfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkkkdnvkjnddjkkkkkkdfjvdlfkbnjfkdnijhjhbjuhuhuhuhkdnvkjnddjkkkkkk',
                height: 200, width: 200,
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 40 && Math.round(Number(children.children[10].getAttribute("y"))) == 11 && Math.round(Number(children.children[100].getAttribute("x"))) == 80 && Math.round(Number(children.children[100].getAttribute("y"))) == 12 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix ascii encoding  Auto Size22x22', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                value: 'sdfv',
                height: 200, width: 200,
                size: DataMatrixSize.Size22x22
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 149 && Math.round(Number(children.children[10].getAttribute("y"))) == 17 && Math.round(Number(children.children[100].getAttribute("x"))) == 45 && Math.round(Number(children.children[100].getAttribute("y"))) == 79 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });



    /////////////////////////divide 2

    describe('DataMatrix ascii encoding  Auto Size88x88', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                value: 'sdfv',
                height: 200, width: 200,
                size: DataMatrixSize.Size88x88
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 52 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 48 && Math.round(Number(children.children[100].getAttribute("y"))) == 16 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });


    describe('DataMatrix ascii encoding  Auto Size132x132', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                mode: 'SVG',
                xDimension: 1,
                value: 'WWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.comWWW.syncfusion.com',
                height: 200, width: 200,
                encoding: 'ASCII',
                size: DataMatrixSize.Size132x132
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //outuput(children);
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 40 && Math.round(Number(children.children[10].getAttribute("y"))) == 11 && Math.round(Number(children.children[100].getAttribute("x"))) == 88 && Math.round(Number(children.children[100].getAttribute("y"))) == 12 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });



    describe('DataMatrix ascii encoding  Auto Size16x36', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                mode: 'SVG',
                xDimension: 1,
                value: 'aaaSize16x36Size16x36Size16x36',
                height: 200, width: 200,
                encoding: 'ASCII',
                size: DataMatrixSize.Size16x36
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 100 && Math.round(Number(children.children[10].getAttribute("y"))) == 19 && Math.round(Number(children.children[100].getAttribute("x"))) == 69 && Math.round(Number(children.children[100].getAttribute("y"))) == 66 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });


    describe('DataMatrix ascii Numeric encoding  Auto Size10x10', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                mode: 'SVG',
                xDimension: 1,
                value: 'aaaSize16x36Size16x36Size16x36',
                height: 200, width: 200,
                //encoding: 'ASCIINumeric',
                //size: DataMatrixSize.Size10x10
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 149 && Math.round(Number(children.children[10].getAttribute("y"))) == 17 && Math.round(Number(children.children[100].getAttribute("x"))) == 107 && Math.round(Number(children.children[100].getAttribute("y"))) == 72 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix ascii Numeric encoding  Auto Size24x24', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: '12234567345612234567345677',
                encoding: "ASCIINumeric",
                size: DataMatrixSize.Size24x24,
                width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            ///output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 138 && Math.round(Number(children.children[10].getAttribute("y"))) == 16 && Math.round(Number(children.children[5].getAttribute("x"))) == 74 && Math.round(Number(children.children[5].getAttribute("y"))) == 16 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children);
            done();
        });
    });
    describe('DataMatrix ascii Numeric encoding  Auto Size24x24 coverage', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'Canvas',
                value: '12234567345612234567345677',
                encoding: "ASCIINumeric",
                size: DataMatrixSize.Size24x24,
                width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            ///output(children)
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) == 76 && Math.round(Number(children.children[10].getAttribute("y"))) == 10 && Math.round(Number(children.children[100].getAttribute("x"))) == 148 && Math.round(Number(children.children[100].getAttribute("y"))) == 28 && ((children.children[10].getAttribute("fill"))) == "white").toBe(true);
            //output(children);
            done();
        });
    });

    describe('DataMatrix ascii Numeric encoding  Auto Size48x48', () => {

        //let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: '12345672345673456783456783456734567845678',
                encoding: "ASCIINumeric",
                size: DataMatrixSize.Size48x48,
                width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });


        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 80 && Math.round(Number(children.children[10].getAttribute("y"))) == 13 && Math.round(Number(children.children[100].getAttribute("x"))) == 80 && Math.round(Number(children.children[100].getAttribute("y"))) == 27 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix ascii Numeric encoding  Auto Size48x48 invalid', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: '**',
                encoding: "ASCIINumeric",
                size: DataMatrixSize.Size48x48,
                invalid: invalid,
                width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            expect(errorMessage === "Data contains invalid characters and cannot be encoded as ASCIINumeric.").toBe(true);
            //output(children);
            done();
        });
    });
    describe('DataMatrix ascii Numeric encoding  Auto Size16x48', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: '1234567233434',
                encoding: "ASCIINumeric",
                size: DataMatrixSize.Size16x48,
                invalid: invalid,
                width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 80 && Math.round(Number(children.children[10].getAttribute("y"))) == 19 && Math.round(Number(children.children[100].getAttribute("x"))) == 23 && Math.round(Number(children.children[100].getAttribute("y"))) == 56 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children)
            output(children); done();
        });
    });


    describe('DataMatrix base264 Numeric encoding  Auto', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.com',
                height: 200, width: 200,
                encoding: 'Base256',
                //width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 161 && Math.round(Number(children.children[10].getAttribute("y"))) == 18 && Math.round(Number(children.children[100].getAttribute("x"))) == 123 && Math.round(Number(children.children[100].getAttribute("y"))) == 86 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children)
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  Auto', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.comWWW.Syncfusion.comWWW.Syncfusion.com',
                height: 200, width: 200,
                encoding: 'Base256',
                //width: 200, height: 200
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 110 && Math.round(Number(children.children[10].getAttribute("y"))) == 15 && Math.round(Number(children.children[100].getAttribute("x"))) == 90 && Math.round(Number(children.children[100].getAttribute("y"))) == 44 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children)
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  Size104x104', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.syncfusion.com',
                height: 200, width: 200,
                encoding: 'Base256',
                size: DataMatrixSize.Size104x104
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 47 && Math.round(Number(children.children[10].getAttribute("y"))) == 12 && Math.round(Number(children.children[100].getAttribute("x"))) == 20 && Math.round(Number(children.children[100].getAttribute("y"))) == 15 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children)
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  Size12x12', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW',
                height: 200, width: 200,
                encoding: 'Base256',
                size: DataMatrixSize.Size12x12
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 136 && Math.round(Number(children.children[10].getAttribute("y"))) == 34 && Math.round(Number(children.children[5].getAttribute("x"))) == 124 && Math.round(Number(children.children[5].getAttribute("y"))) == 22 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            //output(children)
            //output(children);Size24x24
            done();
        });
    });


    describe('DataMatrix base264 Numeric encoding  Size12x26', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW',
                height: 200, width: 200,
                encoding: 'Base256',
                size: DataMatrixSize.Size12x26
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 130 && Math.round(Number(children.children[10].getAttribute("y"))) == 22 && Math.round(Number(children.children[100].getAttribute("x"))) == 88 && Math.round(Number(children.children[100].getAttribute("y"))) == 105 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  Size12x26', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.com',
                height: 200, width: 200,
                //foreColor: 'Red',
                encoding: 'Base256',
                displayText: { alignment: 'Left', position: 'Top', text: 'ABCD' },
            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            barcode.displayText.alignment === 'Right';
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 161 && Math.round(Number(children.children[10].getAttribute("y"))) == 24 && Math.round(Number(children.children[100].getAttribute("x"))) == 123 && Math.round(Number(children.children[100].getAttribute("y"))) == 92 && ((children.children[10].getAttribute("fill"))) == "black").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  coverage', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.com',
                height: 170, width: 150,
                foreColor: 'Red',
                //margin:{left:40},
                displayText: { alignment: 'Right', position: 'Top' },
                encoding: 'Base256',
                size: DataMatrixSize.Size104x104

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) == 33 && Math.round(Number(children.children[10].getAttribute("y"))) == 28 && Math.round(Number(children.children[100].getAttribute("x"))) == 12 && Math.round(Number(children.children[100].getAttribute("y"))) == 30 && ((children.children[10].getAttribute("fill"))) == "Red").toBe(true);
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==65&& Math.round(Number(children.children[10].getAttribute("y"))) ==36&& Math.round(Number(children.children[100].getAttribute("x")))==75&& Math.round(Number(children.children[100].getAttribute("y"))) ==56&& ((children.children[10].getAttribute("fill"))) =="white").toBe(true);
            output(children); done();
        });
    });




    ///////////////////////divide 3

    describe('DataMatrix base264 Numeric encoding  coverage', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.com',
                height: 170, width: 150,
                foreColor: 'Red',
                //margin:{left:40},
                displayText: { alignment: 'Left', position: 'Top' },
                encoding: 'Base256',
                size: DataMatrixSize.Size104x104

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) ==33&& Math.round(Number(children.children[10].getAttribute("y"))) ==28&& Math.round(Number(children.children[100].getAttribute("x")))==12&& Math.round(Number(children.children[100].getAttribute("y"))) ==30&& ((children.children[10].getAttribute("fill"))) =="Red").toBe(true);
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==65&& Math.round(Number(children.children[10].getAttribute("y"))) ==36&& Math.round(Number(children.children[100].getAttribute("x")))==75&& Math.round(Number(children.children[100].getAttribute("y"))) ==56&& ((children.children[10].getAttribute("fill"))) =="white").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  coverage', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'WWW.Syncfusion.com',
                height: 130, width: 150,
                foreColor: 'Red',
                displayText: { alignment: 'Left', position: 'Top' },
                encoding: 'Base256',
                size: DataMatrixSize.Size104x104

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) ==44&& Math.round(Number(children.children[10].getAttribute("y"))) ==18&& Math.round(Number(children.children[100].getAttribute("x")))==29&& Math.round(Number(children.children[100].getAttribute("y"))) ==19&& ((children.children[10].getAttribute("fill"))) =="Red").toBe(true);
            output(children); done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  coverage', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                invalid: invalid,
                displayText: { text: 'jv dgcv gdsvjgcvsjgdvcjhsdvjcvjdsvchjvsdhcvjdsvjh', visibility: false },
                value: 'sdfv',
                height: 150, width: 200,

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) ==92&& Math.round(Number(children.children[10].getAttribute("y"))) ==27&& Math.round(Number(children.children[5].getAttribute("x")))==133&& Math.round(Number(children.children[5].getAttribute("y"))) ==18&& ((children.children[10].getAttribute("fill"))) =="black").toBe(true);
            //output(children);
             done();
        });
    });
    // on property change
    describe('DataMatrix base264 Numeric encoding  coverage 1', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'Canvas',
                xDimension: 1,
                encoding: 'ASCII',
                invalid: invalid,
                displayText: { text: 'jv dgcv gdsvjgcvsjgdvcjhsdvjcvjdsvchjvsdhcvjdsvjh', visibility: false },
                value: 'sdfv',
                height: 150, width: 200,

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==123&& Math.round(Number(children.children[10].getAttribute("y"))) ==10&& Math.round(Number(children.children[100].getAttribute("x")))==62&& Math.round(Number(children.children[100].getAttribute("y"))) ==63&& ((children.children[10].getAttribute("fill"))) =="white").toBe(true);
            barcode.value = 'rrrrr';
            barcode.width = 300;
            barcode.height = 300;
            barcode.backgroundColor = 'red';
            barcode.dataBind();
            //output(children);
             done();
        });
    });
    describe('DataMatrix base264 Numeric encoding  coverage 2', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                value: 'rss ',
                height: 150, width: 200,

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            barcode.value = 'rrrrr';
            barcode.width = 300;
            barcode.height = 300;
            barcode.backgroundColor = 'red';
            barcode.dataBind();
            barcode.mode = 'Canvas';
            //output(children); 
            done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  coverage 3', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                invalid: invalid,
                displayText: { text: 'jv dgcv gdsvjgcvsjgdvcjhsdvjcvjdsvchjvsdhcvjdsvjh', visibility: false },
                value: 'ÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃÃ',
                height: 150, width: 200,

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==92&& Math.round(Number(children.children[10].getAttribute("y"))) ==27&& Math.round(Number(children.children[5].getAttribute("x")))==133&& Math.round(Number(children.children[5].getAttribute("y"))) ==18&& ((children.children[10].getAttribute("fill"))) =="black").toBe(true);
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==39&& Math.round(Number(children.children[10].getAttribute("y"))) ==29&& Math.round(Number(children.children[100].getAttribute("x")))==113&& Math.round(Number(children.children[100].getAttribute("y"))) ==29&& ((children.children[10].getAttribute("fill"))) =="white").toBe(true);
            //output(children);
             done();
        });
    });

    describe('DataMatrix base264 Numeric encoding  coverage 4', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                xDimension: 1,
                encoding: 'ASCII',
                invalid: invalid,
                displayText: { text: 'jv dgcv gdsvjgcvsjgdvcjhsdvjcvjdsvchjvsdhcvjdsvjh', visibility: false },
                value: 'rss ',
                height: 150, width: 200,
                size: DataMatrixSize.Size144x144

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            expect(Math.round(Number(children.children[10].getAttribute("x"))) ==59&& Math.round(Number(children.children[10].getAttribute("y"))) ==11&& Math.round(Number(children.children[100].getAttribute("x")))==92&& Math.round(Number(children.children[100].getAttribute("y"))) ==12&& ((children.children[10].getAttribute("fill"))) =="black").toBe(true);
            output(children); done();
        });

    });

    describe('other language character', () => {

        //let ele: HTMLElement;
        let errorMessage: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'barcode' });
            document.body.appendChild(ele);
            barcode = new DataMatrixGenerator({
                //type: 'DataMatrix',
                mode: 'SVG',
                value: 'Ä',
                //encoding: "ASCIINumeric",
                //size: enum_1.DataMatrixSize.Size24x24,
                //margin: { left: -40 },
                width: 200, height: 200

            });
            barcode.appendTo('#barcode');
        });
        function invalid(args: any) {
            errorMessage = args.message
        }

        afterAll((): void => {
            barcode.destroy();
            ele.remove();
        });

        it('renderin', (done: Function) => {
            var children = document.getElementById('barcode').children[0]
            //output(children)
            //expect(Math.round(Number(children.children[10].getAttribute("x"))) ==59&& Math.round(Number(children.children[10].getAttribute("y"))) ==11&& Math.round(Number(children.children[100].getAttribute("x")))==92&& Math.round(Number(children.children[100].getAttribute("y"))) ==12&& ((children.children[10].getAttribute("fill"))) =="black").toBe(true);
            //output(children);
             done();
        });

    });


});