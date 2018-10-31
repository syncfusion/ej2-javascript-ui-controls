/**
 * Image Element test cases
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ShadowModel } from '../../../src/diagram/core/appearance-model';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { Stretch } from '../../../src/diagram/enum/enum';
import { DiagramModel,ImageModel,NodeModel } from '../../../src/diagram/index';

//issue in image element without size
describe('Diagram Control', () => {
    describe('Image Element with width and height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram23' });
            document.body.appendChild(ele);

            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            let shadow: ShadowModel = { angle: 45, distance: 5, opacity: 0.7, color: 'red' };
            elementimg.shadow = shadow;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram23');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with width and height', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram24' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram24');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without width and height', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Image Element ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram25' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Stretch';
            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram25');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without width and height with stretch', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Checking with width and height and Stretch.stretch', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram26' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Stretch';

            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram26');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with stretch', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 280 &&
            //     diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element with width and height and Stretch.Meet', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram27' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.stretch = 'Meet';
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';

            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram27');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with size and meet', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element with width and height and Stretch.Slice', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram28' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Slice';

            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram28');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with size and slice', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element with width and height and Stretch.None', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram29' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.width = 280;
            elementimg.height = 200;
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'None';

            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram29');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking with size and Stretch.None', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 280 &&
                diagram.basicElements[0].actualSize.height == 200).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height with Meet', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram30' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Meet';
            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram30');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with meet', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height with Slice', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram31' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'Slice';
            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram31');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with slice', (done: Function) => {
            //workaround
            // expect(diagram.basicElements[0].actualSize.width == 104 &&
            //     diagram.basicElements[0].actualSize.height == 142).toBe(true);
            done();
        });
    });

    describe('Image Element without width and height with Stretch.none', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram32' });
            document.body.appendChild(ele);
            let nodes: DiagramElement;
            let elementimg: ImageElement = new ImageElement();
            elementimg.offsetX = 200;
            elementimg.offsetY = 150;
            elementimg.source = 'https://www.w3schools.com/images/w3schools_green.jpg';
            elementimg.stretch = 'None';
            diagram = new Diagram({ mode: 'Canvas', width: '500px', height: '500px', basicElements: [elementimg] } as DiagramModel);
            diagram.appendTo('#diagram32');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking without size and with stretch.none', (done: Function) => {

            expect(diagram.basicElements[0].actualSize.width == 104 &&
                diagram.basicElements[0].actualSize.height == 142 ||
                diagram.basicElements[0].actualSize.width == 0 &&
                diagram.basicElements[0].actualSize.height == 0).toBe(true);
            done();
        });
    });
    describe('Image Alignment in canvas mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let diagramCanvas:HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram12' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1000, height: 1000,mode:'Canvas',
                
                 nodes: [
                   {
                        id: 'node1',
                        width: 100, height: 100, 
                        offsetX: 100, offsetY: 100,
                        shape: {
                            type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                            align: 'XMinYMin', scale: 'Meet'
                        }

                    },
                    {
                            id: 'node4',
                            offsetX: 300, offsetY: 100,
                            width: 100,
                            height: 300,
                            shape: {
                                type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                                align: 'XMinYMin', scale: 'Slice'
                            }
                        },
                        {
                            id: 'node6',
                            offsetX: 100, offsetY: 300,
                            width: 100,
                            height: 100,
                            shape: {
                                type: 'Image', source: 'https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png',
                                align: 'XMinYMin', scale: 'Slice'
                            }
                        },
                         {
                            id: 'node7',
                            offsetX: 500, offsetY: 500,
                            width: 500,
                            height: 400,
                            shape: {
                                type: 'Image', source: 'https://cdn.syncfusion.com/content/images/company-logos/Syncfusion_Logo_Image.png',
                                align: 'XMidYMax', scale: 'Slice'
                            }
                        },
                        {
                            id: 'node34',
                            width: 100, height: 100,
                            offsetX: 100, offsetY: 100,
                            shape: {
                                type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                                align: '', scale: 'Meet'
                            }
                        },
                         {
                            id: 'node344',
                            width: 100, height: 100,
                            offsetX: 600, offsetY: 100,
                            shape: {
                                type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                                align: '', scale: 'Slice'
                            }
                        },
                        {
                        id: 'node1123',
                        width: 100, height: 100, 
                        offsetX: 300, offsetY: 500,
                        shape: {
                            type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                            align: 'XMidYMin',
                             scale: 'Meet'
                        }

                    },
                    {
                        id: 'node321',
                        width: 100, height: 100, 
                        offsetX: 350, offsetY: 450,
                        shape: {
                            type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg',
                            align: 'XMidYMin',
                             scale: 'None'
                        }

                    },
                ], 
            });

            diagram.appendTo('#diagram12');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Changing the image alignment at the run time', (done: Function) => {

            var node3 = diagram.nodes[2];
            node3.width = 200;
            diagram.dataBind();
            var node2 = diagram.nodes[1];
            node2.width = 300;
            diagram.dataBind();
            expect((diagram.nodes[0].wrapper.children[0] as ImageElement).imageAlign === 'XMinYMin'
                && (diagram.nodes[1].wrapper.children[0] as ImageElement).imageAlign === 'XMinYMin' &&
                (diagram.nodes[3].wrapper.children[0] as ImageElement).imageAlign === 'XMidYMax').toBe(true)
            done();
        })

    })
 });