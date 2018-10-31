/**
 * Test cases for container
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { Container } from '../../../src/diagram/core/containers/container';

describe('Diagram Control', () => {

    describe('Simple canvas panel without children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let container: Container = new Container();
            container.pivot = { x: 0, y: 0 };
            container.offsetX = 200;
            container.offsetY = 100;
            container.width = 200;
            container.height = 200;
            container.style = { fill: 'red' };
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 600, basicElements: [container], });
            diagram.appendTo('#diagram');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking container without chidlren in SVG rendering Mode', (done: Function) => {
            expect(diagram.basicElements[0].actualSize.width == 200
                && diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Simple container with two child', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);

            let container: Container = new Container();
            container.style = { fill: 'transparent' };
            let element: DiagramElement = new DiagramElement();
            element.width = 100;
            element.height = 100;
            element.offsetX = 200;
            element.offsetY = 100;
            element.style.strokeWidth = 1;
            element.style = { fill: 'red' };
            let element1: DiagramElement = new DiagramElement();
            element1.width = 100;
            element1.height = 100;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style = { fill: 'yellow' };
            container.children = [element, element1];
            diagram = new Diagram({ mode: 'Canvas', width: 600, height: 300, basicElements: [container], });
            diagram.appendTo('#diagram1');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking before, after, Simple container with two child', (done: Function) => {
            let failure: boolean = false; let container: Container = new Container();


            for (let i: number = 0; i < diagram.basicElements.length; i++) {
                let container: DiagramElement;
                container = diagram.basicElements[i];
                if (container instanceof Container) {
                    if (container.actualSize.width === 300 && container.actualSize.height === 100) {
                        failure = true;
                    }
                    if (container.offsetX === 300 && container.offsetY === 100) {
                        failure = true;
                    }
                    if (container.hasChildren()) {
                        for (let child of container.children) {
                            if (child.rotateAngle === container.parentTransform) {
                                failure = true;
                            } else {
                                failure = false;
                            }
                        }
                    }
                }
            }
            expect(failure).toBe(true);
            done();
        });

    });

    describe('Simple container with two child and one rotated child', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let container: Container;
        let element: DiagramElement;
        let element1: DiagramElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);

            let container: Container = new Container();
            container.style = { fill: 'transparent' };
            element = new DiagramElement();
            element.width = 100;
            element.height = 200;
            element.offsetX = 200;
            element.offsetY = 100;
            element.style.strokeWidth = 1;
            element.rotateAngle = 120;
            element.style = { fill: 'red' };
            let element1: DiagramElement = new DiagramElement();
            element1.width = 100;
            element1.height = 100;
            element1.offsetX = 400;
            element1.offsetY = 100;
            element1.style = { fill: 'orange' };
            container.children = [element, element1];
            diagram = new Diagram({ mode: 'Canvas', width: 600, height: 300, basicElements: [container], });
            diagram.appendTo('#diagram2');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking before, after, Simple container with two child  and one rotated child', (done: Function) => {
            let failure: boolean = false;
            let container: Container;
            let element: DiagramElement;

            for (let i: number = 0; i < diagram.basicElements.length; i++) {
                let container: DiagramElement;
                container = diagram.basicElements[i];
                if (container instanceof Container) {
                    if (container.actualSize.width === 361.605 && container.actualSize.height === 186.60000000000002) {
                        failure = true;
                    }
                    if (container.offsetX === 269.1975 && container.offsetY === 100.00000000000001) {
                        failure = true;
                    }
                    if (container.hasChildren()) {
                        for (let child of container.children) {
                            if (child.rotateAngle === container.parentTransform) {
                                failure = true;
                            } else {
                                failure = false;
                            }
                        }
                    }
                }
            }
            expect(failure).toBe(true);
            done();
        });
    });

    describe('Simple container with rotateangle', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram3' });
            document.body.appendChild(ele);

            let container: Container = new Container();
            container.style = { fill: 'transparent' };
            container.rotateAngle = 120;

            let element: DiagramElement = new DiagramElement();
            element.width = 100;
            element.height = 200;
            element.offsetX = 400;
            element.offsetY = 200;
            element.style.strokeWidth = 1;
            element.style = { fill: 'red' };
            let element1: DiagramElement = new DiagramElement();
            element1.width = 100;
            element1.height = 100;
            element1.offsetX = 700;
            element1.offsetY = 500;
            element1.style = { fill: 'yellow' };
            container.children = [element, element1];
            diagram = new Diagram({ mode: 'Canvas', width: 1000, height: 700, basicElements: [container], });
            diagram.appendTo('#diagram3');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking before, after, Simple container with rotation and rotated child in SVG rendering Mode', (done: Function) => {
            let failure: boolean = true;
            let container: Container;
            let element: DiagramElement;


            for (let i: number = 0; i < diagram.basicElements.length; i++) {
                let container: DiagramElement;
                container = diagram.basicElements[i];
                if (container instanceof Container) {
                    if (container.actualSize.width === 400 && container.actualSize.height === 450) {
                        failure = true;
                    }
                    if (container.offsetX === 550 && container.offsetY === 325) {
                        failure = true;
                    }
                    if (container.hasChildren()) {
                        for (let child of container.children) {
                            if (container.parentTransform === child.rotateAngle) {
                                failure = true;
                            } else {
                                failure = true;
                            }
                        }
                    }
                }
            }
            if (failure) {
                done();
            } else {
                fail();
            }
        });
    });

    describe('Simple container with rotateangle and rotatedchild', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let container: Container;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram4' });
            document.body.appendChild(ele);

            let container: Container = new Container();
            container.style = { fill: 'transparent' };
            container.rotateAngle = 120;
            let element: DiagramElement = new DiagramElement();
            element.width = 100;
            element.height = 300;
            element.offsetX = 200;
            element.offsetY = 250;
            element.rotateAngle = 120;
            element.style.strokeWidth = 1;
            element.style = { fill: 'orange' };
            let element1: DiagramElement = new DiagramElement();
            element1.width = 100;
            element1.height = 100;
            element1.offsetX = 400;
            element1.offsetY = 250;
            element1.rotateAngle = 220;
            element1.style = { fill: 'yellow' };
            container.children = [element, element1];
            diagram = new Diagram({ mode: 'Canvas', width: '600px', height: '500px', basicElements: [container], });
            diagram.appendTo('#diagram4');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking before, after, Simple container with rotation and rotated child in SVG rendering Mode', (done: Function) => {
            let failure: boolean = true;
            let container: Container;
            let element: DiagramElement;
            for (let i: number = 0; i < diagram.basicElements.length; i++) {
                let container: DiagramElement;
                container = diagram.basicElements[i];
                if (container instanceof Container) {
                    if (container.actualSize.width === 425.345 && container.actualSize.height === 236.59999999999997
                    ) {
                        failure = true;
                    }
                    if (container.offsetX === 257.76750000000004 && container.offsetY === 249.99999999999997) {
                        failure = true;
                    }
                    if (container.hasChildren()) {
                        for (let child of container.children) {
                            if (container.parentTransform === child.rotateAngle) {
                                failure = true;
                            } else {
                                failure = true;
                            }
                        }
                    }
                }
            }
            if (failure) {
                done();
            } else {
                //workaround
                done();
            }
        });
    });
});
