/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { Scale, ImageAlignment } from '../../../src/diagram/enum/enum';
import { BackgroundModel } from '../../../src/diagram/diagram/page-settings-model';
/**
 * Path
 */
describe('Diagram Control', () => {
    describe('Background Test', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagrama' });
            document.body.appendChild(ele);
            diagram = new Diagram({ mode:'Canvas',
                width: 1000, height: 1000
            });
            diagram.appendTo('#diagrama');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking background in SVG rendering Mode', (done: Function) => {
            expect((diagram.pageSettings.background.source === '')).toBe(true);
            done();
        })
    });
    describe('background element style with width and image', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramb' });
            document.body.appendChild(ele);
            let background: BackgroundModel = { source: 'https://www.w3schools.com/images/w3schools_green.jpg', scale: 'Slice' };
            diagram = new Diagram({ mode:'Canvas',
                width: 1000, height: 1000, pageSettings: { background: background }
            });
            diagram.appendTo('#diagramb');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking diagram with background image in SVG rendering Mode', (done: Function) => {
            expect((diagram.pageSettings.background.source === 'https://www.w3schools.com/images/w3schools_green.jpg')).toBe(true);
            done();
        });
        it('Checking diagram with updated background image', (done: Function) => {
            diagram.pageSettings.background.source = 'https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png';
            diagram.dataBind();
            expect((diagram.pageSettings.background.source === 'https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png')).toBe(true);
            done();
        });
        it('Checking diagram with updated background color', (done: Function) => {
            diagram.backgroundColor = 'red';
            diagram.dataBind();
            expect((diagram.backgroundColor === 'red')).toBe(true);
            done();
        });
    });
    describe('background image with custom properties  XMidYMid', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let background: BackgroundModel = { source: 'https://www.w3schools.com/images/w3schools_green.jpg', };
            diagram = new Diagram({ mode:'Canvas',
                width: '1000px', height: '1000px', pageSettings: { background: background }
            });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('checking custom properties of image in SVG rendering Mode MeetXMinYMin', (done: Function) => {
            diagram.pageSettings.background.align = 'XMinYMin';
            diagram.pageSettings.background.scale = 'Meet'
            diagram.dataBind();
            let element = document.getElementById('diagram_image');
            let scale: string = diagram.pageSettings.background.scale;
            let imgAlign: string = diagram.pageSettings.background.align;
            let val: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1)
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();

        });
        it('checking custom properties of image in SVG rendering Mode MeetXMidYMin', function (done) {
            diagram.pageSettings.background.align = 'XMidYMin';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXMaXYMin', function (done) {
            diagram.pageSettings.background.align = 'XMaxYMin';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXMinYMid', function (done) {
            diagram.pageSettings.background.align = 'XMinYMid';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMidYMid', function (done) {
            diagram.pageSettings.background.align = 'XMidYMid';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMaxYMid', function (done) {
            diagram.pageSettings.background.align = 'XMaxYMid';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXMinxYMax', function (done) {
            diagram.pageSettings.background.align = 'XMinYMax';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMaxYMid', function (done) {
            diagram.pageSettings.background.align = 'XMidYMax';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMaxYMid', function (done) {
            diagram.pageSettings.background.align = 'XMaxYMax';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });

        it('checking custom properties of image in SVG rendering Mode MeetXMinYMin', (done: Function) => {
            diagram.pageSettings.background.align = 'XMinYMin';
            diagram.pageSettings.background.scale = 'Slice'
            diagram.dataBind();
            let element = document.getElementById('diagram_image');
            let scale: string = diagram.pageSettings.background.scale;
            let imgAlign: string = diagram.pageSettings.background.align;
            let val: string = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1)
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();

        });
        it('checking custom properties of image in SVG rendering Mode MeetXMidYMin', function (done) {
            diagram.pageSettings.background.align = 'XMidYMin';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXMaXYMin', function (done) {
            diagram.pageSettings.background.align = 'XMaxYMin';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXMinYMid', function (done) {
            diagram.pageSettings.background.align = 'XMinYMid';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMidYMid', function (done) {
            diagram.pageSettings.background.align = 'XMidYMid';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMaxYMid', function (done) {
            diagram.pageSettings.background.align = 'XMaxYMid';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXMinxYMax', function (done) {
            diagram.pageSettings.background.align = 'XMinYMax';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMaxYMid', function (done) {
            diagram.pageSettings.background.align = 'XMidYMax';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
        it('checking custom properties of image in SVG rendering Mode MeetXXMaxYMid', function (done) {
            diagram.pageSettings.background.align = 'XMaxYMax';
            diagram.dataBind();
            let scale = diagram.pageSettings.background.scale;
            let imgAlign = diagram.pageSettings.background.align;
            let val = imgAlign.charAt(0).toLowerCase() + imgAlign.slice(1) + ' ' + scale.charAt(0).toLowerCase() + scale.slice(1);
            let element = document.getElementById('diagram_image');
            expect(element.getAttribute('preserveAspectRatio').toString() === val).toBe(true);
            done();
        });
    });


});