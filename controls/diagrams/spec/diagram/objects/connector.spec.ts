import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { PathPortModel, PointPortModel } from '../../../src/diagram/objects/port-model';
import { Segments, accessibilityElement, ConnectorConstraints, NodeConstraints, PortVisibility, PortConstraints, ControlPointsVisibility, AnnotationConstraints, DiagramTools } from '../../../src/diagram/enum/enum';
import { Connector } from '../../../src/diagram/objects/connector';
import { StraightSegmentModel } from '../../../src/diagram/objects/connector-model';
import { PathElement } from '../../../src/diagram/core/elements/path-element';
import { MouseEvents } from '../../../spec/diagram/interaction/mouseevents.spec';
import { SnapConstraints, PointPort, Annotation, IconShapes, Decorator, TextElement, PathAnnotation, BezierSegment, Rect, cloneObject, IConnectionChangeEventArgs, Ej1Serialization } from '../../../src/diagram/index';
import { getDiagramLayerSvg } from '../../../src/diagram/utility/dom-util';
import { PortModel } from '../../../src/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';
Diagram.Inject(Ej1Serialization);
/**
 * Connector spec
 */
function getAccessibility(obj: ConnectorModel, diagram: Diagram): string {
    let value: string;
    if (obj instanceof Connector) {
        value = 'clicked on Connector';
    } else if (obj instanceof TextElement) {
        value = 'clicked on annotation';
    }
    else if (obj instanceof Decorator) {
        value = 'clicked on Decorator';
    } else if (obj instanceof PathAnnotation) {
        value = 'clicked on text';
    }
    else {
        value = undefined;
    }
    return value;
}
function getundefAccessibility(obj: ConnectorModel, diagram: Diagram): string {
    let value: string = undefined;
    if (obj instanceof Connector) {
        return value;
    } else if (obj instanceof TextElement) {
        return value;
    }
    else if (obj instanceof Decorator) {
        return value;
    } else if (obj instanceof PathAnnotation) {
        return value;
    }
    return value;
}
describe('Diagram Control', () => {

    describe('Simple Diagram based on Connector segments', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram57' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 }
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                targetPoint: { x: 350, y: 350 },
                sourcePoint: { x: 250, y: 250 }
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Straight',
                sourcePoint: { x: 400, y: 400 },
                targetPoint: { x: 500, y: 500 },
            };
            let connector4: ConnectorModel = {};
            connector4.id = 'connector4';
            connector4.type = 'Orthogonal';
            connector4.sourcePoint = { x: 700, y: 350 };
            connector4.targetPoint = { x: 700, y: 250 };

            let connector5: ConnectorModel = {};
            connector5.id = 'connector44';
            connector5.type = 'Orthogonal';
            connector5.sourcePoint = { x: 890, y: 350 };
            connector5.targetPoint = { x: 700, y: 250 };

            let connector6: ConnectorModel = {};
            connector6.id = 'connector45';
            connector6.type = 'Orthogonal';
            connector6.style = { fill: 'red' };
            connector6.sourceDecorator = {
                shape: 'Custom', pathData: 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z'
            }
            connector6.sourcePoint = { x: 900, y: 380 };
            connector6.targetPoint = { x: 730, y: 280 };
            let connector7: ConnectorModel = {
                id: 'connector7',
                type: 'Straight',
                sourcePoint: { x: 500, y: 500 },
                targetPoint: { x: 600, y: 600 }, sourceDecorator: {
                    style: {
                        fill: 'black'
                    },
                    shape: 'Square',
                    pivot: {
                        x: 0, y: 0.5
                    }
                },
            };

            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2, connector3, connector4, connector5, connector6, connector7],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram57');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking connector connector group elements in DOM', (done: Function) => {
            let value: HTMLElement = document.getElementById('connector1_groupElement')
            expect(value.childNodes.length === 4).toBe(true);
            done();
        });

        it('Checking connector segments', (done: Function) => {
            expect(((diagram.connectors[0]).wrapper.children[0] as PathElement).data == 'M100 100 L199.65 199.65' &&
                ((diagram.connectors[1]).wrapper.children[0] as PathElement).data == 'M250 250 L250 270 L350 270 L350 349.5' &&
                ((diagram.connectors[2]).wrapper.children[0] as PathElement).data == 'M400 400 L499.65 499.65').toBe(true);
            done();
        });

        it('Checking decorator shapes', (done: Function) => {
            diagram.connectors[0].sourceDecorator = { style: { fill: 'black' }, shape: 'Arrow', pivot: { x: 0, y: 0.5 } };
            diagram.connectors[0].targetDecorator = { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0, y: 0.5 } };
            diagram.connectors[1].type = 'Straight';
            diagram.connectors[1].sourceDecorator = { style: { fill: 'black' }, shape: 'Diamond', pivot: { x: 1, y: 0.5 } };
            diagram.connectors[1].targetDecorator = { shape: 'Arrow', style: { fill: 'blue' }, pivot: { x: 1, y: 0.5 } };
            diagram.connectors[2].sourceDecorator = {
                style: { fill: 'black' }, shape: 'Custom', pivot: { x: 0.5, y: 0.5 },
                pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z'
            };
            diagram.connectors[2].targetDecorator = { shape: 'Diamond', style: { fill: 'blue' }, pivot: { x: 0.5, y: 0.5 } };
            diagram.dataBind();
            expect(((diagram.connectors[0]).wrapper.children[1] as PathElement).data == 'M15,10 L15,22 L5,16Z' &&
                ((diagram.connectors[1]).wrapper.children[1] as PathElement).data == 'M12,23l-7-7l7-7l6.9,7L12,23z' &&
                ((diagram.connectors[2]).wrapper.children[1] as PathElement).data == 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z'
                && ((diagram.connectors[6]).wrapper.children[1] as PathElement).data == 'M0,0 L10,0 L10,10 L0,10 z').toBe(true);
            done();
        });

        it('Checking Orthogonal Segments with decorator shapes', (done: Function) => {
            diagram.connectors[0].type = 'Orthogonal';
            diagram.connectors[1].type = 'Orthogonal';
            diagram.connectors[2].type = 'Orthogonal';
            diagram.dataBind();
            expect(((diagram.connectors[0]).wrapper.children[1] as PathElement).id != null &&
                ((diagram.connectors[1]).wrapper.children[1] as PathElement).id != null &&
                ((diagram.connectors[2]).wrapper.children[1] as PathElement).id != null).toBe(true);
            done();
        });

        it('Checking segments with corner radius', (done: Function) => {
            diagram.connectors[0].cornerRadius = 10;
            diagram.connectors[1].cornerRadius = 20;
            diagram.connectors[2].cornerRadius = 30;
            diagram.dataBind();
            expect(((diagram.connectors[0]).wrapper.children[0] as PathElement).absolutePath ==
                'M 0 0.5 L 0 10.25 Q 0 20 10 20 L 90 20 Q 100 20 100 30 L 100 99.5' &&
                ((diagram.connectors[1]).wrapper.children[0] as PathElement).absolutePath ==
                'M 0 0.5 L 0 10.25 Q 0 20 20 20 L 80 20 Q 100 20 100 40 L 100 99.5' &&
                ((diagram.connectors[2]).wrapper.children[0] as PathElement).absolutePath ==
                'M 0 0.5 L 0 10.25 Q 0 20 30 20 L 70 20 Q 100 20 100 50 L 100 99.5').toBe(true);
            done();
        });

        it('Checking appearance', (done: Function) => {
            diagram.connectors[0].style = { strokeColor: 'red', strokeWidth: 3, opacity: 3 };
            diagram.dataBind();
            expect((diagram.connectors[0].wrapper.children[0] as PathElement).style.strokeColor === 'red' &&
                (diagram.connectors[0].wrapper.children[0] as PathElement).style.strokeWidth === 3 &&
                (diagram.connectors[0].wrapper.children[0] as PathElement).style.opacity === 3
            ).toBe(true);
            done();
        });

        it('Checking custom path for decorator', (done: Function) => {
            diagram.exportDiagram({ mode: 'Data' });
            expect(
                ((diagram.connectors[5]).wrapper.children[1] as PathElement).data === 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z' &&
                (diagram.connectors[0].wrapper.children[0] as PathElement).style.fill === 'transparent').toBe(true);
            done();
        });
    });
    describe('Conectors with hitpadding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }

            ele = createElement('div', { id: 'diagramhittesting' });
            document.body.appendChild(ele);
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                hitPadding: 40,
                sourcePoint: { x: 300, y: 100 },
                targetPoint: { x: 300, y: 200 },
                sourceDecorator: {
                    style: { fill: 'black' },
                    shape: 'Arrow',
                    pivot: { x: 0, y: 0.5 }
                },
                targetDecorator: {
                    shape: 'Diamond',
                    style: { fill: 'blue' },
                    pivot: { x: 0, y: 0.5 }
                }
            };
            diagram = new Diagram({
                width: '1000px', height: '500px',
                connectors: [connector2], snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramhittesting');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector hit padding ', (done: Function) => {
            let conn = diagram.connectors[0];
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 270, 150, 320, 160);
            expect(diagram.connectors[0].sourcePoint.x == 350 &&
                diagram.connectors[0].targetPoint.y == 210).toBe(true);
            done();
        });

        // it('Checking source hit padding ', (done: Function) => {
        //     let conn = diagram.connectors[0];
        //     var diagramCanvas = document.getElementById(diagram.element.id + 'content');
        //     mouseEvents.dragAndDropEvent(diagramCanvas, 335, 110, 350, 80);
        //     expect(diagram.connectors[0].sourcePoint.x == 342 &&
        //         diagram.connectors[0].sourcePoint.y == 80).toBe(true);
        //     done();

        // });
        // it('Checking target hit padding ', (done: Function) => {
        //     let conn = diagram.connectors[0];
        //     let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        //     mouseEvents.dragAndDropEvent(diagramCanvas, 330, 210, 400, 400);
        //     expect(diagram.connectors[0].targetPoint.x == 392 &&
        //         diagram.connectors[0].targetPoint.y == 400).toBe(true);
        //     done();
        // });
        it('Checking connector constraint lock ', (done: Function) => {
            diagram.connectors[0].constraints = ConnectorConstraints.Select | ConnectorConstraints.PointerEvents;
            diagram.dataBind();
            let value: HTMLElement = document.getElementById('diagramhittesting_SelectorElement')
            expect((value.childNodes[0] as HTMLElement).getAttribute('class') === 'e-diagram-endpoint-handle e-sourceend e-disabled')
            done();
        });
    });

    describe('Simple Diagram based on Connector segments', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram577' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Bezier',
                cornerRadius: 10,
                segments: [{
                    type: 'Bezier',
                }],
                sourcePoint: { x: 100, y: 400 },
                targetPoint: { x: 200, y: 500 },
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Bezier',
                sourcePoint: { x: 100, y: 200 },
                targetPoint: { x: 250, y: 200 },
                segments: [{
                    type: 'Bezier',
                    point1: { x: 125, y: 75 },
                    point2: { x: 225, y: 75 },
                }]
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Bezier',
                sourcePoint: { x: 700, y: 100 },
                targetPoint: { x: 800, y: 200 },
                segments: [{
                    type: 'Bezier',
                    vector1: { angle: 90, distance: 75 },
                    vector2: { angle: 90, distance: 75 }
                }]
            };
            let connector4: ConnectorModel = {
                id: 'connector4',
                type: 'Bezier',
                segments: [{
                    type: 'Bezier',
                }],
                sourcePoint: { x: 400, y: 100 },
                targetPoint: { x: 501, y: 200 },
            };

            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2, connector3, connector4],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram577');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking bezier curve ', (done: Function) => {
            expect(((diagram.connectors[0]).wrapper.children[0] as PathElement).data == 'M100 400C144.8425 400 154.8075 499.65 199.5 500'
                && ((diagram.connectors[1]).wrapper.children[0] as PathElement).data == 'M100 200C125 75 225 75 249.9 199.51'
                && ((diagram.connectors[2]).wrapper.children[0] as PathElement).data == 'M700 100C700 175 799.65 274.65 800 200.5').toBe(true);
            done();
        });

        it('Checking bezier curve highlighter ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 100 + diagram.element.offsetLeft, 200 - diagram.element.offsetTop);
            let element2 = document.getElementById('bezierLine_1_1');
            expect(element2.attributes['x1'].nodeValue == '100' && element2.attributes['x2'].nodeValue == '125').toBe(true)
            done();
        });

        it(' dragging source  point for bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 101, 402);
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 400, 130, 430);
            expect(diagram.connectors[0].sourcePoint.x == 100 || diagram.connectors[0].sourcePoint.x == 130).toBe(true);
            done();
        });


        it(' dragging target  point for bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 500, 220, 520);
            expect(diagram.connectors[0].targetPoint.x == 220).toBe(true);
            done();
        });
        it(' dragging sourcecontrol  point for bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 120, 470, 130, 480);
            expect(diagram.connectors[0].sourcePoint.x == 120 || diagram.connectors[0].sourcePoint.x == 130).toBe(true);
            done();
        });
        it(' dragging target control point  point for bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 215, 480, 240, 480);
            expect(diagram.connectors[0].targetPoint.x == 220).toBe(true);
            done();
        });
        it(' Dragging source point for bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 122, 423, 130, 400);
            expect(diagram.connectors[0].sourcePoint.x == 120 || diagram.connectors[0].sourcePoint.x == 130).toBe(true);
            done();
        });


        it(' Dragging target  point for bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 215, 520, 220, 540);
            expect(diagram.connectors[0].targetPoint.x == 225).toBe(true);
            done();
        });

        it(' Dragging bezier curve without points  ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[0];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 450, 150);
            mouseEvents.dragAndDropEvent(diagramCanvas, 450, 150, 470, 170);
            expect(diagram.connectors[3].sourcePoint.x == 420 && diagram.connectors[3].sourcePoint.y == 120).toBe(true);
            done();
        });


        it(' dragging source  point for bezier curve with points ', (done: Function) => {//'M 0 77.77 C 31.9 -2.22 124.61 -47.22 149.53 77.77'
            let conn: ConnectorModel = diagram.connectors[1];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 101, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 125, 75, 135, 85);
            expect(diagram.connectors[1].sourcePoint.x == 100 && diagram.connectors[1].sourcePoint.y == 200).toBe(true);
            done();
        });
        it(' dragging target  point for bezier curve with points ', (done: Function) => {//'M 0 46.18 C 31.96 -33.81 131.85 6.19 149.83 46.18'
            let conn: ConnectorModel = diagram.connectors[1];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 225, 75, 240, 80);
            expect(diagram.connectors[1].targetPoint.x == 250 && diagram.connectors[1].targetPoint.y == 200).toBe(true);
            done();
        });
        it(' dragging target  point for bezier curve with points coverage ', (done: Function) => {//'M 0 46.18 C 31.96 -33.81 131.85 6.19 149.83 46.18'
            let conn: ConnectorModel = diagram.connectors[1];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 118, 240, 80);
            expect(diagram.connectors[1].targetPoint.x == 290 && diagram.connectors[1].targetPoint.y == 162).toBe(true);
            done();
        });

        it('dragging source bezier  point for bezier curve for vector points ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[2];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 702, 104);
            mouseEvents.dragAndDropEvent(diagramCanvas, 701, 175, 720, 160);
            expect(diagram.connectors[2].sourcePoint.x == 700).toBe(true)
            done();
        });
        it('dragging target bezier point for bezier curve for vector points ', (done: Function) => {
            let conn: ConnectorModel = diagram.connectors[2];
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(diagramCanvas, 800, 275, 850, 250);
            expect(diagram.connectors[2].targetPoint.x == 800).toBe(true)
            done();
        });
        it('bezeir curve  data binding  ', (done: Function) => {
            diagram.connectors[0].sourcePoint = { x: 500, y: 500 };
            diagram.connectors[0].targetPoint = { x: 700, y: 700 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourcePoint.x == 500
                && diagram.connectors[0].sourcePoint.y == 500
                && diagram.connectors[0].targetPoint.x == 700
                && diagram.connectors[0].targetPoint.y == 700).toBe(true);
            done();
        });
        it('bezeir curve  data binding  ', (done: Function) => {
            diagram.connectors[0].sourcePoint = { x: 500, y: 500 };
            diagram.connectors[0].targetPoint = { x: 700, y: 700 };
            diagram.dataBind();
            expect(diagram.connectors[0].sourcePoint.x == 500
                && diagram.connectors[0].sourcePoint.y == 500
                && diagram.connectors[0].targetPoint.x == 700
                && diagram.connectors[0].targetPoint.y == 700).toBe(true);
            done();
        });

        it('Testing connected bezier curve', (done: Function) => {
            diagram.add({ id: 'node1', width: 50, height: 50, offsetX: 500, offsetY: 100 });
            diagram.add({ id: 'node2', width: 50, height: 50, offsetX: 500, offsetY: 300 });
            expect(diagram.nodes.length).toBe(2);
            diagram.connectors[0].sourceID = 'node1';
            diagram.connectors[0].targetID = 'node2';
            diagram.dataBind();
            let connector: Connector = diagram.connectors[0] as Connector;
            let segment: BezierSegment = connector.segments[0] as BezierSegment;
            expect(connector.sourceWrapper != undefined && connector.targetWrapper != undefined).toBe(true);
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.dragAndDropEvent(
                diagramCanvas, segment.bezierPoint1.x + 8, segment.bezierPoint1.y + 8,
                segment.bezierPoint1.x + 8 + 20, segment.bezierPoint1.y + 8 + 20);
            mouseEvents.dragAndDropEvent(
                diagramCanvas, segment.bezierPoint2.x + 8, segment.bezierPoint2.y + 8,
                segment.bezierPoint2.x + 8 + 20, segment.bezierPoint2.y + 8 + 20);
            console.log("wrapper");
            console.log(connector.sourceWrapper, connector.targetWrapper);
            expect(connector.sourceWrapper == undefined && connector.targetWrapper == undefined).toBe(true);
            done();
        });
        it('Connector copy and paste ctrl point issue fix ', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 170, 100);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            expect(((diagram.connectors[4].segments[0] as BezierSegment).point1.x === 175 || (diagram.connectors[4].segments[0] as BezierSegment).point1.x === 185) &&
                ((diagram.connectors[4].segments[0] as BezierSegment).point1.y === 47 || (diagram.connectors[4].segments[0] as BezierSegment).point1.y=== 57)&&
                ((diagram.connectors[4].segments[0] as BezierSegment).point2.x === 275 || (diagram.connectors[4].segments[0] as BezierSegment).point2.x === 290) &&
                ((diagram.connectors[4].segments[0] as BezierSegment).point2.y === 47 || (diagram.connectors[4].segments[0] as BezierSegment).point2.y === 52)).toBe(true);
            done();
        });
    });



    describe('Simple Diagram based on Connector segments', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram578' });
            document.body.appendChild(ele);

            var node2: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node2.id = 'textelement2';
            node2.width = 100;
            node2.height = 100;
            node2.offsetX = 100;
            node2.offsetY = 350;
            let nodeport2: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport2.offset = {
                x: 1, y: .5
            };
            nodeport2.id = 'port2';
            nodeport2.shape = 'Square'; node2.ports = [nodeport2];

            let node3: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node3.id = 'textelement3';
            node3.width = 100; node3.height = 100;
            node3.offsetX = 400; node3.offsetY = 350;
            let nodeport3: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport3.offset = {
                x: 0, y: 0.5
            };
            nodeport3.id = 'port3';
            nodeport3.shape = 'Square'; node3.ports = [nodeport3];

            let node6: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node6.id = 'textelement6';
            node6.width = 100; node6.height = 100;
            node6.offsetX = 400; node6.offsetY = 500;
            let nodeport6: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport6.offset = {
                x: 0, y: 0.5
            };
            nodeport6.id = 'port6';
            nodeport6.shape = 'Square'; node6.ports = [nodeport6];

            let node7: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node7.id = 'textelement7';
            node7.width = 100; node7.height = 100;
            node7.offsetX = 400; node7.offsetY = 200;
            let nodeport7: PointPortModel = { offset: {}, margin: {}, style: {} }; nodeport7.offset = {
                x: 0, y: 0.5
            };
            nodeport7.id = 'port7';
            nodeport7.shape = 'Square'; node7.ports = [nodeport7];



            let connectors: ConnectorModel[] = [
                {
                    id: 'connector7',
                    type: 'Bezier',
                    segments: [{ type: 'Bezier' }],
                    sourceID: node2.id,
                    targetID: node7.id,
                    sourcePortID: nodeport2.id,
                    targetPortID: nodeport7.id,
                },
                {
                    id: 'connector5',
                    type: 'Bezier',
                    segments: [{ type: 'Bezier' }],
                    sourceID: node2.id,
                    targetID: node3.id,
                    sourcePortID: nodeport2.id,

                },
                {
                    id: 'connector6',
                    type: 'Bezier',
                    segments: [{ type: 'Bezier' }],
                    sourceID: node2.id,
                    targetID: node6.id,
                    targetPortID: nodeport6.id,
                },
                {
                    id: 'connector8',
                    type: 'Bezier',
                    segments: [{
                        type: 'Bezier',
                        vector1: { angle: 260, distance: 80 },
                        vector2: { angle: 180, distance: 90 },
                    }],
                    sourceID: node2.id,
                    targetID: node6.id,
                },
            ];

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node2, node3, node6, node7], connectors: connectors,
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram578');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking bezier curve ', (done: Function) => {
            console.log("path data");
            console.log(((diagram.connectors[0]).wrapper.children[0] as PathElement).data,((diagram.connectors[1]).wrapper.children[0] as PathElement).data,
            ((diagram.connectors[2]).wrapper.children[0] as PathElement).data ,((diagram.connectors[3]).wrapper.children[0] as PathElement).data);
            expect(((diagram.connectors[0]).wrapper.children[0] as PathElement).data =='M150 350C210 350 289.6 200.3 349.5 200'
                && ((diagram.connectors[1]).wrapper.children[0] as PathElement).data == 'M150 350C210 350 289.5 350 349.5 350'
                && ((diagram.connectors[2]).wrapper.children[0] as PathElement).data ==  'M100 399.88C100 444.8485 289.54 499.81 349.5 500'
                && ((diagram.connectors[3]).wrapper.children[0] as PathElement).data =='M100 399.88C86.11 321.1 309.51 449.92 399.5 450').toBe(true);
            done();
        });
    });

    describe('save and load then check the connector path', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramConnectorPath' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 470, offsetY: 80, isExpanded: true,
                    annotations: [{ content: 'node1' }],
                },
                {
                    id: 'node2', width: 150, height: 100, offsetX: 570, offsetY: 80, style: { fill: 'none' },
                    annotations: [{ content: 'node2' }],
                },
                {
                    id: "Group1", children: ["node1", "node2"],
                    ports: [
                        {
                            id: 'port11', visibility: PortVisibility.Visible, offset: { x: 0.5, y: 0 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                        {
                            id: 'port12', visibility: PortVisibility.Visible, offset: { x: 0, y: 0.5 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                        {
                            id: 'port13', visibility: PortVisibility.Visible, offset: { x: 1, y: 0.5 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                        {
                            id: 'port14', visibility: PortVisibility.Visible, offset: { x: 0.5, y: 1 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                    ]
                },
                {
                    id: 'node3', width: 150, height: 100, offsetX: 100, offsetY: 400, style: { fill: 'none' },
                    annotations: [{ content: 'node3' }],
                },
                {
                    id: 'node4', width: 90,
                    height: 90,
                    offsetX: 300,
                    offsetY: 400,
                    shape: { type: 'Basic', shape: 'Rectangle', cornerRadius: 10 },
                    annotations: [{ id: 'text1', content: 'node4' }],
                },
                {
                    id: "Group2", children: ["node3", "node4"],
                    ports: [
                        {
                            id: 'port21', visibility: PortVisibility.Visible, offset: { x: 0.5, y: 0 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                        {
                            id: 'port22', visibility: PortVisibility.Visible, offset: { x: 0, y: 0.5 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                        {
                            id: 'port23', visibility: PortVisibility.Visible, offset: { x: 1, y: 0.5 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                        {
                            id: 'port24', visibility: PortVisibility.Visible, offset: { x: 0.5, y: 1 },
                            shape: 'Circle', constraints: PortConstraints.Default | PortConstraints.Draw
                        },
                    ]
                },
            ];
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1',
                    type: 'Orthogonal',
                    segments: [{
                        type: 'Orthogonal'
                    }],
                    sourcePortID: "port21",
                    targetPortID: "port14",
                    sourceID: "Group2",
                    targetID: "Group1"
                }
            ];
            diagram = new Diagram({
                width: '800px', height: '1000px', nodes: nodes, connectors: connectors,
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramConnectorPath');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Check before save and load ', (done: Function) => {
            expect(diagram.connectors.length === 1).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints.length === 4).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 185 &&
                (diagram.connectors[0] as Connector).intermediatePoints[0].y == 350).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[1].x == 185 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].y == 330).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 532.5 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].y == 330).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[3].x == 532.5 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].y == 130).toBe(true);
            diagram.loadDiagram(diagram.saveDiagram());
            done();
        });
        it('Check After save and load ', (done: Function) => {
            expect(diagram.connectors.length === 1).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints.length === 4).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 185 &&
                (diagram.connectors[0] as Connector).intermediatePoints[0].y == 350).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[1].x == 185 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].y == 330).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[2].x == 532.5 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].y == 330).toBe(true);
            expect((diagram.connectors[0] as Connector).intermediatePoints[3].x == 532.5 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].y == 130).toBe(true);
            done();
        });
    });

    describe('Check Accessibility for connector ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram57a' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
                annotations: [{ 'content': 'label', 'offset': 0, 'alignment': 'Center' }]
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Straight',
                sourcePoint: { x: 400, y: 400 },
                targetPoint: { x: 600, y: 600 },
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                getDescription: getAccessibility

            });
            diagram.appendTo('#diagram57a');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking accessibili', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200 + 8, 198 + 8);
            expect(diagram.connectors[0].sourcePoint.x == 100).toBe(true);
            done();
        });
    });
    describe('Check Accessibility for connector ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram57ab' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 100 },
                targetPoint: { x: 200, y: 200 },
            };

            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Orthogonal',
                sourcePoint: { x: 200, y: 100 },
                targetPoint: { x: 300, y: 200 },
            };

            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2],
                snapSettings: { constraints: SnapConstraints.ShowLines },
                getDescription: getundefAccessibility

            });
            diagram.appendTo('#diagram57ab');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking accessibilitys', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200 + 8, 198 + 8);
            expect(diagram.connectors[0].sourcePoint.x == 100).toBe(true);
            done();
        });

        it('Checking Fill On Runtime', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            diagram.connectors[1].style.fill = 'red';
            let diagramLayer: SVGSVGElement = getDiagramLayerSvg(diagram.element.id);
            let connectorPath: HTMLElement = diagramLayer.getElementById(diagram.connectors[1].id + '_path') as HTMLElement
            expect(connectorPath.getAttribute('fill') !== 'red').toBe(true);
            done();
        });
    });
    describe('Check decorator ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();



        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram57ab' });
            document.body.appendChild(ele);


            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' },
                style: { strokeWidth: 10 },
                annotations: [{
                    id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                }],
                constraints: NodeConstraints.Default | NodeConstraints.AspectRatio
            };

            let node2: NodeModel = {
                id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
                shape: { type: 'Flow', shape: 'Process' },
                style: { strokeWidth: 10 },
                annotations: [{
                    id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                }]
            };


            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting',
                targetDecorator: {
                    shape: 'Circle',
                    style: { fill: 'yellow' }
                }
            };

            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [node1, node2],

                connectors: [connector1]
            });
            diagram.appendTo('#diagram57ab');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking decorator position', (done: Function) => {
            expect(diagram.connectors[0].wrapper.children[2].offsetX == 300 && diagram.connectors[0].wrapper.children[2].offsetY == 111).toBe(true);
            diagram.selectAll();
            diagram.group();
            expect(diagram.nodes[2].children.length).toBe(3);
            done();
        });
    });

    describe('Connector type change issue ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();



        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'gramda' });
            document.body.appendChild(ele);


            var node2: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node2.id = 'textelement2';
            node2.width = 100;
            node2.height = 100;
            node2.offsetX = 100;
            node2.offsetY = 350;



            let node3: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node3.id = 'textelement3';
            node3.width = 100; node3.height = 100;
            node3.offsetX = 400; node3.offsetY = 350;


            let node6: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node6.id = 'textelement6';
            node6.width = 100; node6.height = 100;
            node6.offsetX = 400; node6.offsetY = 500;

            let node7: NodeModel = { shape: { shape: 'Ellipse' } as BasicShapeModel, style: {} };
            node7.id = 'textelement7';
            node7.width = 100; node7.height = 100;
            node7.offsetX = 400; node7.offsetY = 200;




            let connectors: ConnectorModel[] = [
                {
                    id: 'connector7',
                    type: 'Bezier',
                    segments: [{ type: 'Bezier' }],
                    sourceID: node2.id,
                    targetID: node7.id,

                },
                {
                    id: 'connector5',
                    type: 'Bezier',
                    segments: [{ type: 'Bezier' }],
                    sourceID: node2.id,
                    targetID: node3.id,


                },
                {
                    id: 'connector6',
                    type: 'Bezier',
                    segments: [{ type: 'Bezier' }],
                    sourceID: node2.id,
                    targetID: node6.id,

                },
                {
                    id: 'connector8',
                    type: 'Bezier',
                    segments: [{
                        type: 'Bezier',
                        vector1: { angle: 260, distance: 80 },
                        vector2: { angle: 180, distance: 90 },
                    }],
                    sourceID: node2.id,
                    targetID: node6.id,
                },
            ];

            diagram = new Diagram({
                width: 1000, height: 1000, nodes: [node2, node3, node6, node7], connectors: connectors,
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#gramda');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking type change with selection', (done: Function) => {
            diagram.select([diagram.connectors[1]]);
            diagram.connectors[0].type = 'Orthogonal';
            diagram.connectors[1].type = 'Orthogonal';
            expect(diagram.connectors[0].type === 'Orthogonal' && diagram.connectors[1].type === 'Orthogonal').toBe(true);
            done();
        });
    });

    describe('Connectors connect to rotate nodes - Straight', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthoChangeSourcePoint' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{
                    id: 'NewIdea', width: 150, height: 60, offsetX: 355, offsetY: 205, rotateAngle: 90,
                    shape: { type: 'Flow', shape: 'Terminator' },
                    annotations: [{
                        id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                    }],
                },
                {
                    id: 'Meeting', width: 150, height: 60, offsetX: 254, offsetY: 205, rotateAngle: 90,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                    }]
                },
                {
                    id: 'BoardDecision', width: 150, height: 60, offsetX: 646, offsetY: 150, rotateAngle: 335,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                        margin: { left: 25, right: 25 },
                        style: { whiteSpace: 'PreserveAll' }
                    }]
                },
                {
                    id: 'Project', width: 150, height: 60, offsetX: 709, offsetY: 285, rotateAngle: 335,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },
                    }]
                },
                {
                    id: 'End', width: 150, height: 60, offsetX: 377.46, offsetY: 457.94, rotateAngle: 255,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },
                    }]
                },
                {
                    id: 'Resources', width: 150, height: 60, offsetX: 261.53, offsetY: 489, rotateAngle: 255,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },
                    }]
                },
                {
                    id: 'node1', width: 150, height: 60, offsetX: 418.65, offsetY: 19.79, rotateAngle: 25,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },
                    }]
                },
                {
                    id: 'node2', width: 150, height: 60, offsetX: 378.5, offsetY: 105.89, rotateAngle: 25,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },
                    }]
                }
                ],
                connectors: [
                    { id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting' },
                    { id: 'connector2', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Project' },
                    { id: 'connector3', type: 'Straight', sourceID: 'Resources', targetID: 'End' },
                    { id: 'connector4', type: 'Straight', sourceID: 'node1', targetID: 'node2' },
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthoChangeSourcePoint');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated source and target nodes', function (done) {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 325 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 205 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 284 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 205).toBe(true);

            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 658.69 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 177.19 &&
                (diagram.connectors[1] as Connector).intermediatePoints[1].x == 696.31 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 257.81).toBe(true);

            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 290.5 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 481.24 &&
                (diagram.connectors[2] as Connector).intermediatePoints[1].x == 348.49 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 465.7).toBe(true);

            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 405.97 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 46.98 &&
                (diagram.connectors[3] as Connector).intermediatePoints[1].x == 391.18 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 78.7).toBe(true);

            done();
        });
    });

    describe('Connectors connect to rotate nodes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthoChangeSourcePoint' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{
                    id: 'NewIdea', width: 150, height: 60, offsetX: 355, offsetY: 205, rotateAngle: 90,
                    shape: { type: 'Flow', shape: 'Terminator' },
                    annotations: [{
                        id: 'label1', content: 'New idea identified', offset: { x: 0.5, y: 0.5 }
                    }],
                },
                {
                    id: 'Meeting', width: 150, height: 60, offsetX: 254, offsetY: 205, rotateAngle: 90,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label2', content: 'Meeting with board', offset: { x: 0.5, y: 0.5 }
                    }]
                },
                {
                    id: 'BoardDecision', width: 150, height: 60, offsetX: 646, offsetY: 150, rotateAngle: 335,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                        margin: { left: 25, right: 25 },
                        style: { whiteSpace: 'PreserveAll' }
                    }]
                },
                {
                    id: 'Project', width: 150, height: 60, offsetX: 709, offsetY: 285, rotateAngle: 335,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },
                    }]
                },
                {
                    id: 'End', width: 150, height: 60, offsetX: 377.46, offsetY: 457.94, rotateAngle: 255,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label5', content: 'Implement and Deliver', offset: { x: 0.5, y: 0.5 },
                    }]
                },
                {
                    id: 'Resources', width: 150, height: 60, offsetX: 261.53, offsetY: 489, rotateAngle: 255,
                    shape: { type: 'Flow', shape: 'Process' },
                    annotations: [{
                        id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },
                    }]
                }
                ],
                connectors: [
                    { id: 'connector1', type: 'Orthogonal', sourceID: 'NewIdea', targetID: 'Meeting' },
                    { id: 'connector2', type: 'Orthogonal', sourceID: 'BoardDecision', targetID: 'Project' },
                    { id: 'connector3', type: 'Orthogonal', sourceID: 'Resources', targetID: 'End' }
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthoChangeSourcePoint');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated source and target nodes', function (done) {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 325 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 205 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 284 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 205).toBe(true);

            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 658.68 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 177.19 &&
                (diagram.connectors[1] as Connector).intermediatePoints[1].x == 658.68 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 228.89 &&
                (diagram.connectors[1] as Connector).intermediatePoints[2].x == 696.32 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 228.89 &&
                (diagram.connectors[1] as Connector).intermediatePoints[3].x == 696.32 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 257.81).toBe(true);

            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 290.5 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 481.24 &&
                (diagram.connectors[2] as Connector).intermediatePoints[1].x == 310.5 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 481.24 &&
                (diagram.connectors[2] as Connector).intermediatePoints[2].x == 310.5 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 465.7 &&
                (diagram.connectors[2] as Connector).intermediatePoints[3].x == 348.49 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 465.7).toBe(true);

            done();
        });
    });

    describe('Connectors docking - decision shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthoDecisionShapes' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'BoardDecision', width: 100, height: 100, offsetX: 218.99000000000012, offsetY: 201.8299999999998, rotateAngle: 40,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                            margin: { left: 25, right: 25 },
                            style: { whiteSpace: 'PreserveAll' }
                        }]
                    },
                    {
                        id: 'Project', width: 100, height: 100, offsetX: 309.0100000000001, offsetY: 94.64999999999982, rotateAngle: 40,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },
                        }]
                    },
                    {
                        id: 'Meeting1', width: 100, height: 100, offsetX: 737.97, offsetY: 484.68, rotateAngle: 140,
                        shape: { type: 'Flow', shape: 'Process' },
                        annotations: [{
                            id: 'label2', content: 'Meeting with board1', offset: { x: 0.5, y: 0.5 }
                        }]
                    },
                    {
                        id: 'BoardDecision1', width: 100, height: 100, offsetX: 657.56, offsetY: 389.04, rotateAngle: 140,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label3', content: 'Board decides whether to proceed1', offset: { x: 0.5, y: 0.5 },
                            margin: { left: 25, right: 25 },
                            style: { whiteSpace: 'PreserveAll' }
                        }]
                    },
                    {
                        id: 'Project1', width: 100, height: 100, offsetX: 561.16, offsetY: 274.05, rotateAngle: 140,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label4', content: 'Find Project manager1', offset: { x: 0.5, y: 0.5 },
                        }]
                    },
                ],
                connectors: [
                    { id: 'connector1', type: 'Orthogonal', sourceID: 'Project', targetID: 'BoardDecision' },
                    {
                        id: 'connector2', type: 'Orthogonal', sourceID: 'Meeting1', targetID: 'BoardDecision1'
                    },
                    {
                        id: 'connector3', type: 'Orthogonal', sourceID: 'BoardDecision1', targetID: 'Project1'
                    },
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthoDecisionShapes');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated source and target nodes', function (done) {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 347.31 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 126.79 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 399.45 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 126.79 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 399.45 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 292.27 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].x == 128.55 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 292.27 &&
                (diagram.connectors[0] as Connector).intermediatePoints[4].x == 128.55 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 170.8 &&
                (diagram.connectors[0] as Connector).intermediatePoints[5].x == 182.01 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 170.8).toBe(true);

            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 776.27 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 452.54 &&
                (diagram.connectors[1] as Connector).intermediatePoints[1].x == 828.41 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 452.54 &&
                (diagram.connectors[1] as Connector).intermediatePoints[2].x == 828.41 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 298.6 &&
                (diagram.connectors[1] as Connector).intermediatePoints[3].x == 567.12 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 298.6 &&
                (diagram.connectors[1] as Connector).intermediatePoints[4].x == 567.12 && (diagram.connectors[1] as Connector).intermediatePoints[4].y == 421.18 &&
                (diagram.connectors[1] as Connector).intermediatePoints[5].x == 619.26 && (diagram.connectors[1] as Connector).intermediatePoints[5].y == 421.18).toBe(true);

            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 694.54 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 358.01 &&
                (diagram.connectors[2] as Connector).intermediatePoints[1].x == 748 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 358.01 &&
                (diagram.connectors[2] as Connector).intermediatePoints[2].x == 748 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 183.61 &&
                (diagram.connectors[2] as Connector).intermediatePoints[3].x == 470.72 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 183.61 &&
                (diagram.connectors[2] as Connector).intermediatePoints[4].x == 470.72 && (diagram.connectors[2] as Connector).intermediatePoints[4].y == 306.19 &&
                (diagram.connectors[2] as Connector).intermediatePoints[5].x == 522.86 && (diagram.connectors[2] as Connector).intermediatePoints[5].y == 306.19).toBe(true);
            done();
        });
    });

    describe('Connectors docking - decision shapes 2', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthoDecisionShapes' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'Project3', width: 150, height: 100, offsetX: 367.14, offsetY: 202.68, rotateAngle: 145,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label4', content: 'Find Project manager-3', offset: { x: 0.5, y: 0.5 },
                        }]
                    },
                    {
                        id: 'Resources3', width: 150, height: 60, offsetX: 285.75, offsetY: 86.45, rotateAngle: 145,
                        shape: { type: 'Flow', shape: 'Process' },
                        annotations: [{
                            id: 'label8', content: 'Hire new resources', offset: { x: 0.5, y: 0.5 },
                        }]
                    },

                    {
                        id: 'BoardDecision4', width: 150, height: 110, offsetX: 321.1, offsetY: 352.65, rotateAngle: 310,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label3', content: 'Board decides whether to proceed', offset: { x: 0.5, y: 0.5 },
                            margin: { left: 25, right: 25 },
                            style: { whiteSpace: 'PreserveAll' }
                        }]
                    }, {
                        id: 'Project4', width: 150, height: 100, offsetX: 435.98, offsetY: 448.99, rotateAngle: 310,
                        shape: { type: 'Flow', shape: 'Decision' },
                        annotations: [{
                            id: 'label4', content: 'Find Project manager4', offset: { x: 0.5, y: 0.5 },
                        }]
                    }, {
                        id: 'Reject4', width: 150, height: 60, offsetX: 481.8, offsetY: 161.08, rotateAngle: 310,
                        shape: { type: 'Flow', shape: 'Process' },
                        annotations: [{
                            id: 'label7', content: 'Reject and write report4', offset: { x: 0.5, y: 0.5 },
                        }]
                    },
                    {
                        id: 'Resources4', width: 150, height: 60, offsetX: 596.7, offsetY: 257.4,
                        shape: { type: 'Flow', shape: 'Process' },
                        annotations: [{
                            id: 'label8', content: 'Hire new resources4', offset: { x: 0.5, y: 0.5 },
                        }]
                    }
                ],
                connectors: [
                    {
                        id: 'connector6', type: 'Orthogonal', sourceID: 'Project3', targetID: 'Resources3'
                    },
                    {
                        id: 'connector7', type: 'Orthogonal', sourceID: 'BoardDecision4', targetID: 'Reject4'
                    },
                    {
                        id: 'connector8', type: 'Orthogonal', sourceID: 'Project4', targetID: 'Resources4'
                    }
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthoDecisionShapes');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated source and target nodes', function (done) {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 428.21 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 159.91 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 477.26 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 159.91 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 477.26 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == -1.14 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].x == 187.11 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == -1.14 &&
                (diagram.connectors[0] as Connector).intermediatePoints[4].x == 187.11 && (diagram.connectors[0] as Connector).intermediatePoints[4].y == 129.47 &&
                (diagram.connectors[0] as Connector).intermediatePoints[5].x == 224.31 && (diagram.connectors[0] as Connector).intermediatePoints[5].y == 129.47).toBe(true);

            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 369.31 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 295.2 &&
                (diagram.connectors[1] as Connector).intermediatePoints[1].x == 369.31 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 239.84 &&
                (diagram.connectors[1] as Connector).intermediatePoints[2].x == 433.59 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 239.84 &&
                (diagram.connectors[1] as Connector).intermediatePoints[3].x == 433.59 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 218.53).toBe(true);

            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 484.18 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 391.54 &&
                (diagram.connectors[2] as Connector).intermediatePoints[1].x == 484.18 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 339.4 &&
                (diagram.connectors[2] as Connector).intermediatePoints[2].x == 596.7 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 339.4 &&
                (diagram.connectors[2] as Connector).intermediatePoints[3].x == 596.7 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 287.4
            ).toBe(true);
            done();
        });
    });


    describe('Connectors docking - decision shapes(Connect to one end)', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthoDecisionShapes' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [{
                    id: 'Project10', width: 150, height: 100, offsetX: 493.4900000000005, offsetY: -9.589999999999634, rotateAngle: 50,
                    shape: { type: 'Flow', shape: 'Decision' },
                    annotations: [{
                        id: 'label4', content: 'Find Project manager', offset: { x: 0.5, y: 0.5 },
                    }]
                }], connectors: [
                    {
                        id: 'connector', type: 'Orthogonal', sourcePoint: { x: 660, y: 200 }, targetID: 'Project10'
                    },],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthoDecisionShapes');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated target node', function (done) {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 660 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 200 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 660 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 180 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 541.69 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 180 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].x == 541.69 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 47.86).toBe(true);
            done();
        });
    });

    describe('Connectors docking - Arrow shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramOrthoDecisionShapes' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 1000, height: 1000,
                nodes: [
                    {
                        id: 'ArrowUp', width: 100, height: 100, offsetX: 100, offsetY: 100, //rotateAngle: 50,
                        shape: { type: 'Path', data: 'M 91.01 64.56 C 84.28 26.83 67.13 0 47.03 0 C 21.06 0 0 44.77 0 100 L 9.41 100 C 9.41 55.81 26.25 20 47.03 20 C 61.82 20 74.62 38.15 80.77 64.56 L 73.43 64.56 L 80.07 82.27 L 86.71 100 L 93.36 82.27 L 100 64.56 L 91.01 64.56 z' },
                    },
                    {
                        id: 'ArrowDown', width: 150, height: 60, offsetX: 500, offsetY: 300,
                        shape: { type: 'Path', data: 'M 1.07 45.5 C 6.16 60.05 29.37 72.2 61.05 78.02 L 61.05 69.96 L 80.5 77.47 L 99.95 84.98 L 80.5 92.49 L 61.05 100 L 61.05 90.09 C 25.07 83.48 0 68.71 0 51.54 C 0 49.49 0.38 47.48 1.07 45.5 z M 100 0 L 100 11.39 C 49.62 11.39 7.97 26.25 1.03 45.58 C 0.36 43.72 0 41.82 0 39.88 C 0 17.85 44.77 0 100 0 z' },
                    },
                    {
                        id: 'ArrowUp2', width: 100, height: 100, offsetX: 550, offsetY: 100, //rotateAngle: 50,
                        shape: { type: 'Path', data: 'M 91.01 64.56 C 84.28 26.83 67.13 0 47.03 0 C 21.06 0 0 44.77 0 100 L 9.41 100 C 9.41 55.81 26.25 20 47.03 20 C 61.82 20 74.62 38.15 80.77 64.56 L 73.43 64.56 L 80.07 82.27 L 86.71 100 L 93.36 82.27 L 100 64.56 L 91.01 64.56 z' },
                    },
                    {
                        id: 'ArrowDown2', width: 150, height: 60, offsetX: 300, offsetY: 300,
                        shape: { type: 'Path', data: 'M 1.07 45.5 C 6.16 60.05 29.37 72.2 61.05 78.02 L 61.05 69.96 L 80.5 77.47 L 99.95 84.98 L 80.5 92.49 L 61.05 100 L 61.05 90.09 C 25.07 83.48 0 68.71 0 51.54 C 0 49.49 0.38 47.48 1.07 45.5 z M 100 0 L 100 11.39 C 49.62 11.39 7.97 26.25 1.03 45.58 C 0.36 43.72 0 41.82 0 39.88 C 0 17.85 44.77 0 100 0 z' },
                    },
                ],
                connectors: [
                    {
                        id: 'connector', type: 'Orthogonal', sourceID: 'ArrowUp', targetID: 'ArrowDown'
                    },
                    {
                        id: 'connector2', type: 'Orthogonal', sourcePoint: { x: 650, y: 190 }, targetID: 'ArrowUp2'
                    },
                    {
                        id: 'connector3', type: 'Orthogonal', targetPoint: { x: 50, y: 190 }, sourceID: 'ArrowDown2'
                    },
                    {
                        id: 'connector4', type: 'Orthogonal', targetPoint: { x: 530, y: 250 }, sourceID: 'ArrowUp2'
                    }
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramOrthoDecisionShapes');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated target node', function (done) {
            expect((diagram.connectors[0] as Connector).intermediatePoints[0].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[0].y == 70.43 &&
                (diagram.connectors[0] as Connector).intermediatePoints[1].x == 100 && (diagram.connectors[0] as Connector).intermediatePoints[1].y == 170 &&
                (diagram.connectors[0] as Connector).intermediatePoints[2].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[2].y == 170 &&
                (diagram.connectors[0] as Connector).intermediatePoints[3].x == 500 && (diagram.connectors[0] as Connector).intermediatePoints[3].y == 273.22).toBe(true);
            expect((diagram.connectors[1] as Connector).intermediatePoints[0].x == 650 && (diagram.connectors[1] as Connector).intermediatePoints[0].y == 190 &&
                (diagram.connectors[1] as Connector).intermediatePoints[1].x == 650 && (diagram.connectors[1] as Connector).intermediatePoints[1].y == 170 &&
                (diagram.connectors[1] as Connector).intermediatePoints[2].x == 550 && (diagram.connectors[1] as Connector).intermediatePoints[2].y == 170 &&
                (diagram.connectors[1] as Connector).intermediatePoints[3].x == 550 && (diagram.connectors[1] as Connector).intermediatePoints[3].y == 70.43).toBe(true);
            expect((diagram.connectors[2] as Connector).intermediatePoints[0].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[0].y == 273.22 &&
                (diagram.connectors[2] as Connector).intermediatePoints[1].x == 300 && (diagram.connectors[2] as Connector).intermediatePoints[1].y == 253.22 &&
                (diagram.connectors[2] as Connector).intermediatePoints[2].x == 50 && (diagram.connectors[2] as Connector).intermediatePoints[2].y == 253.22 &&
                (diagram.connectors[2] as Connector).intermediatePoints[3].x == 50 && (diagram.connectors[2] as Connector).intermediatePoints[3].y == 190).toBe(true);
            expect((diagram.connectors[3] as Connector).intermediatePoints[0].x == 550 && (diagram.connectors[3] as Connector).intermediatePoints[0].y == 70.43 &&
                (diagram.connectors[3] as Connector).intermediatePoints[1].x == 550 && (diagram.connectors[3] as Connector).intermediatePoints[1].y == 170 && (
                    diagram.connectors[3] as Connector).intermediatePoints[2].x == 530 && (diagram.connectors[3] as Connector).intermediatePoints[2].y == 170 &&
                (diagram.connectors[3] as Connector).intermediatePoints[3].x == 530 && (diagram.connectors[3] as Connector).intermediatePoints[3].y == 250).toBe(true);
            done();
        });
    });

    describe('Connectors docking - Arrow shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramDecoratorIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 500, height: 500,
                connectors: [
                    {
                        id: 'c1', targetPoint: { x: 400, y: 200 }, sourcePoint: { x: 100, y: 100 },
                        style: { strokeWidth: 2 }, type: 'Orthogonal',
                        sourceDecorator: { shape: 'OpenArrow', height: 10, width: 10 },
                    }
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramDecoratorIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector docking - rotated target node', function (done) {
            diagram.connectors[0].sourceDecorator.shape = 'Circle';
            diagram.dataBind();
            let decObj: HTMLElement = document.getElementById('c1_srcDec')
            let bounds: DOMRect = decObj.getBoundingClientRect() as DOMRect;
            expect(diagram.connectors[0].sourceDecorator.shape == 'Circle').toBe(true);
            done();
        });
    });
    describe('Connectors-', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramDecoratorIssue' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: 500, height: 500,
                connectors: [
                    {
                        id: 'connector1',
                        type: 'Straight',
                        sourcePoint: { x: 100, y: 100 },
                        targetPoint: { x: 500, y: 200 },
                        segments: [
                            { type: 'Straight', point: { x: 150, y: 150 } }
                        ],
                    },
                    {
                        id: 'connector2',
                        type: 'Straight',
                        sourcePoint: { x: 300, y: 100 },
                        targetPoint: { x: 400, y: 200 },
                        sourceDecorator: {
                            style: { fill: 'black' },
                            shape: 'Diamond',
                            pivot: { x: 0, y: 0.5 }
                        },
                        targetDecorator: {
                            shape: 'None',
                            style: { fill: 'blue' },
                            pivot: { x: 0, y: 0.5 }
                        }
                    },
                ],
                getConnectorDefaults: (obj: ConnectorModel) => {
                    let connector: ConnectorModel = {};
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                    return connector;
                },
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramDecoratorIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('checking connector path data', function (done) {
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === 'M100 100 L150 150 L499.51 199.93')
            done();
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === 'M15,10 L15,22 L5,16Z')
            done();
        });
    });
    describe('Connector padding', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramDecoratorIssue' });
            document.body.appendChild(ele);
            let nodeport2: PointPortModel = { offset: { x: 1 } };
            nodeport2.id = 'fff';

            nodeport2.shape = 'Circle';
            let nodeport21: PointPortModel = { offset: { y: 1 } };
            nodeport21.id = 'ggg';

            let node: NodeModel = {
                id: 'node1', width: 50, height: 50, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1', height: 50, width: 50 }], ports: [nodeport2]
            };
            let node2: NodeModel = {
                id: 'node2', width: 50, height: 50, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2', height: 50, width: 50 }], ports: [nodeport21]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 75, offsetX: 800, offsetY: 350, annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            diagram = new Diagram({
                width: 500, height: 500, nodes: [node, node2, node3, node4],
                connectors: [
                    {
                        id: 'connector1',
                        type: 'Straight', sourceID: 'node3', targetID: 'node4', targetPadding: 20, sourcePadding: 20,
                        annotations: [{ content: 'dddd', style: { color: 'red' } }]
                    }, {
                        id: 'connector2',
                        sourceID: 'node1', targetID: 'node2', type: 'Straight',
                        targetPortID: 'ggg', sourcePortID: 'fff',
                        targetPadding: 20, sourcePadding: 20
                    }, {
                        id: 'connector3',
                        sourceID: 'node1', targetID: 'node2', type: 'Straight',
                        targetPortID: 'ggg',
                        targetPadding: 20, sourcePadding: 20
                    }, {
                        id: 'connector4',
                        sourceID: 'node1', targetID: 'node2', type: 'Straight',
                        sourcePortID: 'fff',
                        targetPadding: 20, sourcePadding: 20
                    }],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramDecoratorIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('checking connector path data', function (done) {
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === 'M300 350 L300 349.5');
            done();
            expect((diagram.connectors[0].wrapper.children[3].style as any).color === 'red');
            done();
            expect((diagram.connectors[1].wrapper.children[0] as any).pathData === 'M140.6 126 L183.74 198.57');
            done();
            expect((diagram.connectors[2].wrapper.children[0] as any).pathData === "M136 145 L178.69 198.61");
            done();
            expect((diagram.connectors[3].wrapper.children[0] as any).pathData === "M143.97 126 L165.7 154.6");
            done();
            diagram.connectors[0].sourcePadding = 10;
            diagram.dataBind();
            expect((diagram.connectors[0].sourcePadding === 10));
            done();
        });
          it('checking connector path data on decorator change', function (done) {
              diagram.connectors[0].sourceDecorator.width +=10;
              diagram.connectors[0].sourceDecorator.height +=10;
              diagram.dataBind()
              debugger;
              console.log('checking connector path data on decorator change' +(diagram.connectors[0].wrapper.children[0] as any).pathData )
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === 'M300 350 L300 349.5');
            done();
            
        });
        it('checking connector style updation', function (done) {
            let path: string = (diagram.connectors[0].wrapper.children[0] as any).pathData;
            diagram.connectors[0].targetDecorator.style.fill = "green";
            diagram.dataBind;
            diagram.connectors[0].targetDecorator.style.fill = "black";
            diagram.dataBind;
            diagram.connectors[0].targetDecorator.style.fill = "green";
            diagram.dataBind;
            diagram.connectors[0].targetDecorator.style.fill = "black";
            diagram.dataBind;
            diagram.connectors[0].targetDecorator.style.fill = "green";
            diagram.dataBind;
            diagram.connectors[0].targetDecorator.style.fill = "black";
            diagram.dataBind;
            expect((diagram.connectors[0].wrapper.children[0] as any).pathData === path);
            done();
        });
        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        })
    });
    describe('Connector padding with constraints', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramDecoratorIssue' });
            document.body.appendChild(ele);
            let nodeport2: PointPortModel = { offset: { x: 1 } };
            nodeport2.id = 'fff';

            nodeport2.shape = 'Circle';
            let nodeport21: PointPortModel = { offset: { y: 1 } };
            nodeport21.id = 'ggg';

            let node: NodeModel = {
                id: 'node1', width: 50, height: 50, offsetX: 100, offsetY: 100, annotations: [{ content: 'Node1', height: 50, width: 50 }], ports: [nodeport2]
            };
            let node2: NodeModel = {
                id: 'node2', width: 50, height: 50, offsetX: 200, offsetY: 200, annotations: [{ content: 'Node2', height: 50, width: 50 }], ports: [nodeport21]
            };
            let node3: NodeModel = {
                id: 'node3', width: 100, height: 75, offsetX: 300, offsetY: 350, annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            let node4: NodeModel = {
                id: 'node4', width: 100, height: 75, offsetX: 800, offsetY: 350, annotations: [{ content: 'Node3', height: 50, width: 50 }]
            };
            diagram = new Diagram({
                width: 500, height: 500, nodes: [node, node2, node3, node4],
                connectors: [
                    {
                        id: 'connector1', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 200 },
                        type: 'Straight', connectionPadding : 50, constraints: ConnectorConstraints.Default,
                        annotations: [{ content: 'dddd', style: { color: 'red' } }]
                    }, {
                        id: 'connector2', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 200 }, sourcePortID: 'fff', connectionPadding : 50, constraints: (ConnectorConstraints.Default & ~ConnectorConstraints.ConnectToNearByElement),
                    }, {
                        id: 'connector3',
                        type: 'Straight', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 200 }, connectionPadding : 50, constraints: (ConnectorConstraints.Default & ~ConnectorConstraints.ConnectToNearByPort)
                    }, {
                        id: 'connector4',
                        type: 'Straight', sourcePoint: { x: 100, y: 200 }, targetPoint: { x: 200, y: 200 }, connectionPadding : 50, constraints: (ConnectorConstraints.Default & ~ConnectorConstraints.ConnectToNearByNode)
                    }],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagramDecoratorIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('checking connector with paddingToNode', function (done) {
            debugger
           
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 100, 160);
            expect((diagram.nameTable['connector4'].targetID === 'node1'));
            done();
        });
        it('checking connector with paddingToPort', function (done) {
            
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 205, 205);
            mouseEvents.dragAndDropEvent(diagramCanvas, 205, 205, 100, 160);
            expect((diagram.nameTable['connector3'].targetPortID === 'ggg'));
            done();

        });
        it('checking connector with none', function (done) {
            
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 100, 160);
            expect((diagram.nameTable['connector2'].targetPortID === '') );
            done();

        });
        it('checking connector with none', function (done) {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.select([diagram.nodes[1]]);
            diagram.copy();
            diagram.paste();
            mouseEvents.clickEvent(diagramCanvas, 200, 200);
            mouseEvents.dragAndDropEvent(diagramCanvas, 200, 200, 205, 205);
            expect((diagram.nameTable['connector2'].targetPortID === 'ggg'));
            done();
        });
    });


    describe('Connector segments not updating at the connection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramDecoratorIssue' });
            document.body.appendChild(ele);
            let nodeport2: PointPortModel = { offset: { x: 1 } };
            nodeport2.id = 'fff';

            nodeport2.shape = 'Circle';
            let nodeport21: PointPortModel = { offset: { y: 1 } };
            nodeport21.id = 'ggg';

            var nodes = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 300,
                },]
            var connector2: ConnectorModel = {};
            connector2.id = 'connector2';
            connector2.sourceID = "node1"
            //connector2.type = 'Str';
            connector2.sourcePoint = { x: 250, y: 250 };
            connector2.targetPoint = { x: 350, y: 350 };
            connector2.segments = [{ direction: "Right", length: 70 }, { direction: "Bottom", length: 20 }];
            diagram = new Diagram({
                width: '900px', height: '500px', nodes: nodes, connectors: [connector2],
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                }
            
            });
            diagram.appendTo('#diagramDecoratorIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Connector segments not updating at the connection', function (done) {
            debugger
            console.log("Connector segments not updating at the connection")
            diagram.selectAll();
            diagram.nudge("Right",100,100)
            
            expect((diagram.connectors[0].segments[0] as any).points[1].x===50);
            done();
        });
        
    });

    describe('Checking Bezier Curve', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram577' });
            document.body.appendChild(ele);
            let connector1: ConnectorModel = {
                id: 'connector1',
                type: 'Bezier',
                cornerRadius: 10,
                annotations: [{ content: 'connector1 Annotation' }],
                sourcePoint: { x: 100, y: 400 },
                targetPoint: { x: 200, y: 500 },
            };
            let connector2: ConnectorModel = {
                id: 'connector2',
                type: 'Bezier',
                sourcePoint: { x: 100, y: 200 },
                targetPoint: { x: 250, y: 200 },
                annotations: [{ content: 'connector2' }]
            };
            let connector3: ConnectorModel = {
                id: 'connector3',
                type: 'Bezier',
                sourcePoint: { x: 700, y: 100 },
                targetPoint: { x: 800, y: 200 },
                segments: [{
                    type: 'Bezier',
                    vector1: { angle: 90, distance: 75 },
                    vector2: { angle: 90, distance: 75 }
                }],
                annotations: [{ content: 'connector3' }]
            };
            diagram = new Diagram({
                width: 1000, height: 1000,
                connectors: [connector1, connector2, connector3],
                snapSettings: { constraints: SnapConstraints.ShowLines }
            });
            diagram.appendTo('#diagram577');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        
        it('Midpoint for Annotation', (done: Function) => {
            console.log("midpoint");
            console.log(diagram.connectors[0].wrapper.children[3].offsetX ,diagram.connectors[0].wrapper.children[3].offsetY );
            expect(diagram.connectors[0].wrapper.children[3].offsetX === 149.82 && diagram.connectors[0].wrapper.children[3].offsetY === 449.83).toBe(true);
            done();
        });

        it('Save and Load for Annotation', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 702, 104);
            mouseEvents.dragAndDropEvent(diagramCanvas, 701, 175, 720, 160);
            expect(diagram.connectors[1].annotations[0].content == 'connector2').toBe(true);
            done();
        });

        it('Dragging and Checking for Annotation Position', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 702, 104);
            mouseEvents.dragAndDropEvent(diagramCanvas, 701, 175, 720, 160);
            expect(diagram.connectors[2].annotations[0].content == 'connector3').toBe(true);
            done();
        });

        it('Lable After Changing the Content', (done: Function) => {
            diagram.connectors[0].annotations[0].content = 'Chnaged';
            diagram.dataBind();
            expect(diagram.connectors[0].annotations[0].content == 'Chnaged').toBe(true);
            done();
        });
    });
    describe('Connector not connected to the node after save and load', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramConnectorIssue' });
            document.body.appendChild(ele);
            var nodes = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200,
                }]
            var connector: ConnectorModel = {};
            connector.id = 'connector2';
            connector.sourceID = "node1"
            diagram = new Diagram({
                width: '900px', height: '500px', nodes: nodes, connectors: [connector]
            });
            diagram.appendTo('#diagramConnectorIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Adding node at runtime and checking for connection', function (done) {
            var addNode = {
                id: 'add1', width: 100, height: 100, offsetX: 500, offsetY: 100, annotations: [{ content: 'Add' }]
            };
            diagram.add(addNode);
            diagram.dataBind();
            diagram.connectors[0].targetID = 'add1';
            diagram.dataBind();
            localStorage.setItem('testSave1',diagram.saveDiagram());
            var obj = JSON.parse(localStorage.getItem('testSave1'));
            for (var i = 0; i < obj.nodes.length; i++) {
                if (i === 1) {
                    obj.nodes[i].offsetX += 30;
                }
            }
            diagram.loadDiagram(JSON.stringify(obj));
            diagram.dataBind();
            expect(diagram.connectors[0].targetID === 'add1' && diagram.nodes[1].offsetX === 530).toBe(true);
            console.log('Connector save and load');
            done();
        }); 
    });

    describe('Bezier control points are draggable in hidden condition', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramBezIssue' });
            document.body.appendChild(ele);
            var nodes:NodeModel[] = [
                {
                    id: 'node1', width: 100, height: 100, offsetX: 200, offsetY: 200,
                    ports:[{offset:{x:0.5,y:0},id:'top',visibility:PortVisibility.Visible},
                    {offset:{x:0.5,y:1},id:'bottom',visibility:PortVisibility.Visible},
                    {offset:{x:0,y:0.5},id:'right',visibility:PortVisibility.Visible},
                    {offset:{x:1,y:0.5},id:'left',visibility:PortVisibility.Visible}]
                },
                {
                    id: 'node2', width: 100, height: 100, offsetX: 400, offsetY: 400,
                    ports:[{offset:{x:0.5,y:0},id:'top',visibility:PortVisibility.Visible},
                    {offset:{x:0.5,y:1},id:'bottom',visibility:PortVisibility.Visible},
                    {offset:{x:0,y:0.5},id:'right',visibility:PortVisibility.Visible},
                    {offset:{x:1,y:0.5},id:'left',visibility:PortVisibility.Visible}]
                },
            ]
            var connectors: ConnectorModel[] = [{
                id : 'connector1',sourceID : "node1",targetID :'node2',type:'Bezier',
                sourcePortID:'right',targetPortID:'left',bezierSettings:{controlPointsVisibility:ControlPointsVisibility.None}
            }];
            diagram = new Diagram({
                width: '900px', height: '500px', nodes: nodes, connectors: connectors
            });
            diagram.appendTo('#diagramBezIssue');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking bezier control points dragging after hiding it', function (done) {
            diagram.select([diagram.connectors[0]]);
            let preSegment = cloneObject(diagram.connectors[0].segments);
            mouseEvents.mouseMoveEvent(diagramCanvas,138,200);
            mouseEvents.mouseDownEvent(diagramCanvas,138,200);
            mouseEvents.mouseMoveEvent(diagramCanvas,128,190);
            mouseEvents.mouseUpEvent(diagramCanvas,128,190);
            let curSegment = diagram.connectors[0].segments;
            console.log("segmemts");
            console.log(preSegment);
            console.log(curSegment);
            expect(preSegment === curSegment).toBe(false);
            done();
        });
        it('Checking bezier control points dragging after giving visibility', function (done) {
            diagram.connectors[0].bezierSettings.controlPointsVisibility = ControlPointsVisibility.All;
            diagram.dataBind();
            diagram.select([diagram.connectors[0]]);
            let preSegment = cloneObject(diagram.connectors[0].segments);
            mouseEvents.mouseMoveEvent(diagramCanvas,138,200);
            mouseEvents.mouseDownEvent(diagramCanvas,138,200);
            mouseEvents.mouseMoveEvent(diagramCanvas,128,190);
            mouseEvents.mouseUpEvent(diagramCanvas,128,190);
            let curSegment = diagram.connectors[0].segments;
            expect(preSegment !== curSegment).toBe(true);
            done();
        });  
    });

    describe('Support to add ports to connector', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents: MouseEvents = new MouseEvents();
        let diagramCanvas: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramconPort' });
            document.body.appendChild(ele);
            var newNodes:NodeModel[] = [
                { id: 'n1', offsetX: 100, offsetY: 100, width: 70, height: 70, ports: [{ id: 'n1p1', shape: 'Square', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Drag }],annotations:[{content:'node1'}] },
                { id: 'n2', offsetX: 500, offsetY: 150, width: 70, height: 70, ports: [{ id: 'n2p1', shape: 'Square', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.Draw }] },
            ];
            var newConnectors:ConnectorModel[] = [
                {id:'con1',sourcePoint:{x:200,y:300},targetPoint:{x:400,y:300}, ports: [{ id: 'con1p1', shape: 'Square', offset: 0.5, visibility: PortVisibility.Visible, constraints: (PortConstraints.Default | PortConstraints.Drag) &~ PortConstraints.OutConnect, }]},
                {id:'con2',sourcePoint:{x:450,y:300},targetPoint:{x:600,y:300}, ports: [{ id: 'con2p1', shape: 'Square', offset: 0.5, visibility: PortVisibility.Visible, constraints: (PortConstraints.Default | PortConstraints.Draw)}]},
                { id: 'c1', type: 'Straight', sourceID: 'n1', targetID: 'con1', sourcePortID: 'n1p1', targetPortID:'con1p1', ports: [{ id: 'c1p1', shape: 'Square', offset: 0.5, visibility: PortVisibility.Visible, constraints: PortConstraints.Default | PortConstraints.ToolTip, tooltip:{content:'port tooltip'} }] },
                { id: 'c2', type: 'Straight', sourceID: 'con2', targetID: 'n2', sourcePortID: 'con2p1', targetPortID:'n2p1', ports: [{ id: 'c2p1', shape: 'Square', offset: 0.5, visibility: PortVisibility.Visible, constraints: PortConstraints.Default }] },
                { id: 'bez1', type: 'Bezier', sourceID: 'n1', targetID: 'n2', sourcePortID: 'n1p1', targetPortID: 'n2p1', 
                ports: [{ id: 'bezp1', shape: 'Square', offset: 0.5, visibility: PortVisibility.Visible, constraints: PortConstraints.Default, },
                { id: 'bezp2', shape: 'Square', offset: 0.8, visibility: PortVisibility.Visible, constraints: PortConstraints.Default, width:15,height:15 },
                { id: 'bezp3', shape: 'Circle', offset: 0.2, visibility: PortVisibility.Visible, constraints: PortConstraints.Default, }]
             },
                { id: 'ortho1', type: 'Orthogonal', sourcePoint:{x:600,y:100},targetPoint:{x:550,y:300}, ports: [{ id: 'orthop1', shape: 'Square', offset: 0.5, visibility: PortVisibility.Visible, constraints: PortConstraints.Default| PortConstraints.Draw, }] },
            ];
            diagram = new Diagram({
                width: '900px', height: '500px', nodes: newNodes, connectors: newConnectors
            });
            diagram.appendTo('#diagramconPort');
            diagramCanvas = document.getElementById(diagram.element.id + 'content');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connector port rendering at initial rendering', (done: Function) => {
            let con1 = diagram.connectors[0];
            let portRender: boolean;
            if(con1.ports && con1.ports.length > 0){
                portRender = true;
            }
            expect(portRender).toBe(true);
            done();
        });
        it('Checking in connections of connector port', (done: Function) => {
           let con1: ConnectorModel = diagram.connectors[0];
           let inEdges = (con1 as Connector).inEdges;
           expect(inEdges.length === 1 && inEdges[0] === 'c1').toBe(true);
           done();
        });
        it('Checking out connections of connector port', (done: Function) => {
            let con2: ConnectorModel = diagram.connectors[1];
            let outEdges = (con2 as Connector).outEdges;
            expect(outEdges.length === 1 && outEdges[0] === 'c2').toBe(true);
            done();
        });
        it('Adding port to connector at runtime', (done: Function) => {
            let con1: ConnectorModel = diagram.connectors[0];
            let portCount = con1.ports.length;
            let ports: PathPortModel[] = [{id:'newPort1',visibility:PortVisibility.Visible,shape:"Square",offset:0.2},
            {id:'newPort2',visibility:PortVisibility.Visible,shape:"Square",offset:0.8,constraints:PortConstraints.Default| PortConstraints.Draw}]
            diagram.addPorts(con1,ports);
            let newPortCount = con1.ports.length;
            expect(newPortCount === portCount + 2).toBe(true);
            done();
        });
        it('Adding Bezier connector with port at runtime', (done: Function) => {
            let conCount = diagram.connectors.length;
            let con:ConnectorModel = {
                id:'newBez1',type:'Bezier',sourcePoint:{x:200,y:200},targetPoint:{x:300,y:300},
                annotations:[{content:'Bezier',alignment:'After',horizontalAlignment:'Center'}],
                ports:[{id:'newBez1p1',shape:'Square',offset:0.2,visibility:PortVisibility.Visible,alignment:'After'}]
            };
            diagram.add(con);
            expect(conCount < diagram.connectors.length).toBe(true);
            done();
        });
        it('Changing bezier annotation and port alignment at runtime', (done: Function) => {
            let connector:ConnectorModel = diagram.nameTable['newBez1'];
            connector.ports[0].alignment = 'Before';
            diagram.dataBind();
            connector.ports[0].alignment = 'Center';
            diagram.dataBind();
            connector.ports[0].alignment = 'After';
            diagram.dataBind();
            connector.annotations[0].alignment = 'Before';
            diagram.dataBind();
            connector.annotations[0].alignment = 'Center';
            diagram.dataBind();
            connector.annotations[0].alignment = 'After';
            diagram.dataBind();
            connector.ports[0].horizontalAlignment = 'Left';
            diagram.dataBind();
            connector.ports[0].horizontalAlignment = 'Center';
            diagram.dataBind();
            connector.ports[0].horizontalAlignment = 'Right';
            diagram.dataBind();
            connector.ports[0].horizontalAlignment = 'Auto';
            diagram.dataBind();
            connector.ports[0].horizontalAlignment = 'Stretch';
            diagram.dataBind();
            connector.annotations[0].horizontalAlignment = 'Left';
            diagram.dataBind();
            connector.annotations[0].horizontalAlignment = 'Center';
            diagram.dataBind();
            connector.annotations[0].horizontalAlignment = 'Right';
            diagram.dataBind();
            connector.annotations[0].horizontalAlignment = 'Auto';
            diagram.dataBind();
            connector.ports[0].verticalAlignment = 'Top';
            diagram.dataBind();
            connector.ports[0].verticalAlignment = 'Center';
            diagram.dataBind();
            connector.ports[0].verticalAlignment = 'Bottom';
            diagram.dataBind();
            connector.ports[0].verticalAlignment = 'Auto';
            diagram.dataBind();
            connector.ports[0].verticalAlignment = 'Stretch';
            diagram.dataBind();
            connector.annotations[0].verticalAlignment = 'Top';
            diagram.dataBind();
            connector.annotations[0].verticalAlignment = 'Center';
            diagram.dataBind();
            connector.annotations[0].verticalAlignment = 'Bottom';
            diagram.dataBind();
            connector.annotations[0].verticalAlignment = 'Auto';
            diagram.dataBind();
            connector.annotations[0].horizontalAlignment = 'Stretch';
            diagram.dataBind();
            connector.annotations[0].verticalAlignment = 'Stretch';
            diagram.dataBind();
            connector.annotations[0].style.textAlign = 'Justify';
            diagram.dataBind();
            expect(connector.ports[0].alignment === 'After').toBe(true);
            done();
        });
        it('Adding port to bezier connector at runtime', (done: Function) => {
            let con1: ConnectorModel = diagram.nameTable['newBez1'];
            let portCount = con1.ports.length;
            let ports: PathPortModel[] = [{id:'newBez1Port1',visibility:PortVisibility.Visible,shape:"Square",offset:0.2},
            {id:'newBez1Port2',visibility:PortVisibility.Visible,shape:"Square",offset:0.8,constraints:PortConstraints.Default| PortConstraints.Draw}]
            diagram.addPorts(con1,ports);
            let newPortCount = con1.ports.length;
            expect(newPortCount === portCount + 2).toBe(true);
            done();
        });
        it('Adding fixed userHandle to connector and update it runtime', (done: Function) => {
            let fixedUserHandles = [{ padding: { left: 2, right: 2, top: 2, bottom: 2 }, offset: 0.5, width: 20, alignment: 'Before', height: 20, id: 'usercon1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z' }];
            let con:ConnectorModel =  {id:'straightCon',type:'Straight',sourcePoint:{x:400,y:100},targetPoint:{x:600,y:200},fixedUserHandles:fixedUserHandles as any};
            let addCon = diagram.add(con);
            let updateHandle = [{ padding: { left: 2, right: 2, top: 2, bottom: 2 }, offset: 0.8, width: 25, alignment: 'After', height: 25, id: 'usercon1', pathData: 'M60.3,18H27.5c-3,0-5.5,2.4-5.5,5.5v38.2h5.5V23.5h32.7V18z M68.5,28.9h-30c-3,0-5.5,2.4-5.5,5.5v38.2c0,3,2.4,5.5,5.5,5.5h30c3,0,5.5-2.4,5.5-5.5V34.4C73.9,31.4,71.5,28.9,68.5,28.9z M68.5,72.5h-30V34.4h30V72.5z' }];
            diagram.updateConnectorfixedUserHandle(updateHandle[0] as any,addCon.fixedUserHandles[0] as any,addCon.wrapper,addCon);
            expect(addCon.fixedUserHandles.length === 1).toBe(true);
            done();
        });
        it('Drag connector with fixed user handle', (done: Function) => {
          let con = diagram.nameTable['straightCon'];
          let prePoint = con.sourcePoint.x;
          diagram.drag(con, 100, 100);
          let curPoint = con.sourcePoint.x;
          expect(prePoint !== curPoint).toBe(true);
          done();
        });
        it('Apply font style at runtime for connector annotation', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let connector:ConnectorModel = diagram.nameTable['newBez1'];
            diagram.select([connector]);
            mouseEvents.keyDownEvent(diagramCanvas, 'B', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'I', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'U', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'U', true);
            expect(connector.annotations[0].style.bold).toBe(true);
            done();
        });
        it('Dragging node connected with connector', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['n1'];
            diagram.select([node]);
            let preOffsetX = node.offsetX;
            diagram.drag(node,20,20);
            mouseEvents.keyDownEvent(diagramCanvas,'J',true,true);
            expect(preOffsetX !== node.offsetX).toBe(true);
            done();
        });
        it('Activate pointer tool', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 10, 10);
            mouseEvents.keyDownEvent(diagramCanvas,'1',true,false);
            expect(diagram.tool === DiagramTools.Default).toBe(true);
            done();
        });
        it('Load EJ1 diagram', (done: Function) => {
         let data = '{"width":"100%","height":"100%","nodes":[{"fillColor":"red","borderColor":"black","borderWidth":1,"borderDashArray":"","opacity":1,"gradient":null,"borderGradient":null,"type":"basic","flip":"none","isExpanded":true,"shadow":{"distance":5,"angle":45,"opacity":0.7},"cssClass":"","name":"task1","width":100,"height":40,"offsetX":200,"offsetY":200,"visible":true,"zOrder":0,"excludeFromLayout":false,"constraints":11026430,"parent":"","labels":[{"readOnly":false,"bold":false,"italic":false,"text":"Task 1","textDecoration":"none","fontSize":11,"fontFamily":"Arial","fontColor":"black","boundaryConstraints":true,"segmentOffset":0.5,"offset":{"x":0.5,"y":0.5},"textAlign":"center","alignment":"center","relativeMode":"segmentpath","horizontalAlignment":"center","verticalAlignment":"center","wrapping":"wrapwithoverflow","margin":{"top":0,"left":0,"right":0,"bottom":0},"padding":{"top":0,"left":0,"right":0,"bottom":0},"textOverflow":false,"overflowType":"ellipsis","mode":"edit","width":50,"rotateAngle":0,"opacity":1,"templateId":"","templateType":"html","name":"label_NrJF","visible":true,"borderColor":"transparent","borderWidth":0,"fillColor":"transparent","cssClass":"","hyperlink":"","dragLimit":{"top":10,"left":10,"right":10,"bottom":10},"height":0,"constraints":1,"_type":"label","_parent":"task1","_cssClass":""}],"expandIcon":{"shape":"none","width":13,"height":10,"margin":{"top":0,"left":0,"right":0,"bottom":0},"offset":{"x":0.5,"y":1},"borderColor":"#1a1a1a","borderWidth":1,"cornerRadius":0,"fillColor":"black","pathData":"","templateId":""},"collapseIcon":{"shape":"none","width":13,"height":10,"margin":{"top":0,"left":0,"right":0,"bottom":0},"offset":{"x":0.5,"y":1},"borderColor":"#1a1a1a","borderWidth":1,"cornerRadius":0,"fillColor":"black","pathData":"","templateId":""},"ports":[],"inEdges":[],"outEdges":["flow1"],"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"addInfo":{},"marginLeft":0,"marginTop":0,"marginRight":0,"marginBottom":0,"horizontalAlign":"left","verticalAlign":"top","minWidth":0,"maxWidth":0,"minHeight":0,"maxHeight":0,"connectorPadding":0,"cornerRadius":0,"paletteItem":{"enableScale":true,"wrapping":"nowrap","label":null,"margin":{"top":4,"left":4,"right":4,"bottom":4}},"_type":"node","_shape":"rectangle","shape":"rectangle","source":"","pathData":"","textBlock":null,"points":[],"templateId":null,"scale":"meet","contentAlignment":"xmidymid","_cssClass":""},{"fillColor":"red","borderColor":"black","borderWidth":1,"borderDashArray":"","opacity":1,"gradient":null,"borderGradient":null,"type":"basic","flip":"none","isExpanded":true,"shadow":{"distance":5,"angle":45,"opacity":0.7},"cssClass":"","name":"task2","width":100,"height":40,"offsetX":400,"offsetY":200,"visible":true,"zOrder":1,"excludeFromLayout":false,"constraints":11026430,"parent":"","labels":[{"readOnly":false,"bold":false,"italic":false,"text":"Task 2","textDecoration":"none","fontSize":11,"fontFamily":"Arial","fontColor":"black","boundaryConstraints":true,"segmentOffset":0.5,"offset":{"x":0.5,"y":0.5},"textAlign":"center","alignment":"center","relativeMode":"segmentpath","horizontalAlignment":"center","verticalAlignment":"center","wrapping":"wrapwithoverflow","margin":{"top":0,"left":0,"right":0,"bottom":0},"padding":{"top":0,"left":0,"right":0,"bottom":0},"textOverflow":false,"overflowType":"ellipsis","mode":"edit","width":50,"rotateAngle":0,"opacity":1,"templateId":"","templateType":"html","name":"label_AqDF","visible":true,"borderColor":"transparent","borderWidth":0,"fillColor":"transparent","cssClass":"","hyperlink":"","dragLimit":{"top":10,"left":10,"right":10,"bottom":10},"height":0,"constraints":1,"_type":"label","_parent":"task2","_cssClass":""}],"expandIcon":{"shape":"none","width":13,"height":10,"margin":{"top":0,"left":0,"right":0,"bottom":0},"offset":{"x":0.5,"y":1},"borderColor":"#1a1a1a","borderWidth":1,"cornerRadius":0,"fillColor":"black","pathData":"","templateId":""},"collapseIcon":{"shape":"none","width":13,"height":10,"margin":{"top":0,"left":0,"right":0,"bottom":0},"offset":{"x":0.5,"y":1},"borderColor":"#1a1a1a","borderWidth":1,"cornerRadius":0,"fillColor":"black","pathData":"","templateId":""},"ports":[],"inEdges":["flow1"],"outEdges":[],"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"addInfo":{},"marginLeft":0,"marginTop":0,"marginRight":0,"marginBottom":0,"horizontalAlign":"left","verticalAlign":"top","minWidth":0,"maxWidth":0,"minHeight":0,"maxHeight":0,"connectorPadding":0,"cornerRadius":0,"paletteItem":{"enableScale":true,"wrapping":"nowrap","label":null,"margin":{"top":4,"left":4,"right":4,"bottom":4}},"_type":"node","_shape":"rectangle","shape":"rectangle","source":"","pathData":"","textBlock":null,"points":[],"templateId":null,"scale":"meet","contentAlignment":"xmidymid","_cssClass":""}],"connectors":[{"name":"flow1","visible":true,"lineDashArray":"","targetDecorator":{"shape":"arrow","width":"10","height":"10","borderColor":"#606060","borderWidth":1,"fillColor":"black","pathData":"","cssClass":"","_cssClass":""},"sourceDecorator":{"shape":"none","width":8,"height":8,"borderColor":"black","borderWidth":1,"fillColor":"black","pathData":"","cssClass":""},"segments":[{"type":"straight","point":null,"point1":null,"point2":null,"vector1":null,"vector2":null,"_point1":{"x":0,"y":0},"_point2":{"x":0,"y":0},"length":null,"_length":null,"_bridges":[],"direction":null,"_direction":null,"points":[{"x":250,"y":200},{"x":350,"y":200}],"_point":{"x":350,"y":200},"_startPoint":{"x":250,"y":200},"_endPoint":{"x":350,"y":200}}],"sourcePoint":{"x":250,"y":200},"targetPoint":{"x":350,"y":200},"lineColor":"#606060","lineWidth":1,"flip":"none","constraints":350846,"opacity":1,"parent":"","labels":[{"readOnly":false,"bold":false,"italic":false,"text":"Label","textDecoration":"none","fontSize":12,"fontFamily":"Arial","fontColor":"black","boundaryConstraints":true,"segmentOffset":0.5,"offset":{"x":0.5,"y":0.5},"textAlign":"center","alignment":"center","relativeMode":"segmentpath","horizontalAlignment":"center","verticalAlignment":"center","wrapping":"wrapwithoverflow","margin":{"top":0,"left":0,"right":0,"bottom":0},"padding":{"top":0,"left":0,"right":0,"bottom":0},"textOverflow":false,"overflowType":"ellipsis","mode":"edit","width":50,"rotateAngle":0,"opacity":1,"templateId":"","templateType":"html","name":"label_pBBf","visible":true,"borderColor":"transparent","borderWidth":0,"fillColor":"white","cssClass":"","hyperlink":"","dragLimit":{"top":10,"left":10,"right":10,"bottom":10},"height":0,"constraints":1,"_type":"label","_parent":"flow1","_cssClass":""}],"zOrder":2,"lineHitPadding":10,"addInfo":{},"targetNode":"task2","targetPort":null,"sourceNode":"task1","sourcePort":null,"marginLeft":0,"marginTop":0,"marginRight":0,"marginBottom":0,"horizontalAlign":"left","verticalAlign":"top","cornerRadius":0,"bridgeSpace":10,"sourcePadding":0,"targetPadding":0,"type":"connector","cssClass":"","_endPointHitPadding":{"top":0,"left":0,"right":0,"bottom":0},"_srcDecoratorSize":13,"_tarDecoratorSize":15,"_inlineDecorators":[],"paletteItem":{"enableScale":true,"wrapping":"nowrap","label":null,"margin":{"top":4,"left":4,"right":4,"bottom":4}},"_intersects":[],"_cssClass":""}],"labelRenderingMode":"html","defaultSettings":{"connector":{"targetDecorator":{"shape":"arrow","borderColor":"#606060","width":"10","height":"10"},"lineColor":"#606060"},"node":{"width":100,"height":40,"fillColor":"red","labels":[{"fontSize":11}]},"group":null},"nodeTemplate":null,"connectorTemplate":null,"dataSourceSettings":{"dataSource":null,"query":null,"tableName":null,"id":"","parent":"","nodes":null,"connectors":null,"root":"","crudAction":{"create":"","update":"","destroy":"","read":""},"customFields":[],"connectionDataSource":{"dataSource":null,"id":"","sourceNode":"","targetNode":"","sourcePointX":"","sourcePointY":"","targetPointX":"","targetPointY":"","crudAction":{"create":"","update":"","destroy":"","read":""},"customFields":[]}},"serializationSettings":{"preventDefaultValues":false},"rulerSettings":{"showRulers":true,"horizontalRuler":{"interval":5,"segmentWidth":100,"arrangeTick":null,"tickAlignment":"rightorbottom","markerColor":"red","length":null,"thickness":25},"verticalRuler":{"interval":5,"segmentWidth":100,"arrangeTick":null,"tickAlignment":"rightorbottom","markerColor":"red","length":null,"thickness":25}},"snapSettings":{"horizontalGridLines":{"linesInterval":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapInterval":[20],"lineDashArray":"","lineColor":"lightgray"},"verticalGridLines":{"linesInterval":[1.25,18.75,0.25,19.75,0.25,19.75,0.25,19.75,0.25,19.75],"snapInterval":[20],"lineDashArray":"","lineColor":"lightgray"},"snapConstraints":15,"enableSnapToObject":true,"snapAngle":5,"snapObjectDistance":5},"scrollSettings":{"horizontalOffset":0,"verticalOffset":0,"currentZoom":1,"viewPortHeight":352.6000061035156,"viewPortWidth":1240,"minZoom":0.25,"maxZoom":30,"zoomFactor":0.2,"padding":{"left":0,"right":0,"top":0,"bottom":0}},"pageSettings":{"pageWidth":0,"pageHeight":0,"multiplePage":false,"pageBorderWidth":0,"pageBackgroundColor":"#ffffff","pageBorderColor":"#565656","pageMargin":24,"showPageBreak":false,"pageOrientation":"portrait","scrollLimit":"diagram","scrollableArea":{"x":0,"y":0,"width":0,"height":0},"autoScrollBorder":{"left":15,"top":15,"right":15,"bottom":15},"boundaryConstraints":"infinity"},"locale":"en-US","contextMenu":{"items":[],"showCustomMenuItemsOnly":false},"enableContextMenu":true,"enableAutoScroll":false,"tooltip":{"templateId":"","relativeMode":"object","alignment":{"horizontal":"center","vertical":"bottom"},"margin":{"top":5,"left":5,"right":5,"bottom":5},"offset":null,"delay":0},"showTooltip":true,"layout":{"avoidSegmentOverlapping":false,"bounds":null,"type":"none","horizontalAlignment":"center","verticalAlignment":"top","orientation":"toptobottom","horizontalSpacing":30,"verticalSpacing":30,"margin":{"left":0,"right":0,"top":0,"bottom":0},"marginX":0,"marginY":0,"fixedNode":"","getLayoutInfo":null,"getConnectorSegments":null,"root":"","springLength":100,"springFactor":0.442,"maxIteration":1000},"drawingTools":null,"backgroundImage":{"source":"","scale":"meet","alignment":"xmidymid"},"backgroundColor":"transparent","bridgeDirection":"top","version":"13.3.0.8","constraints":502,"tool":6,"drawType":{},"selectedItems":{"offsetX":0,"offsetY":0,"width":0,"height":0,"rotateAngle":0,"children":[],"constraints":30,"userHandles":[],"tooltip":{"templateId":"","relativeMode":"object","alignment":{"horizontal":"center","vertical":"bottom"},"margin":{"top":10,"left":5,"right":5,"bottom":5},"offset":null,"delay":0},"getConstraints":null},"commandManager":{"commands":{"copy":{"gesture":{"key":67,"keyModifiers":1},"_isDefault":true},"paste":{"gesture":{"key":86,"keyModifiers":1},"_isDefault":true},"cut":{"gesture":{"key":88,"keyModifiers":1},"_isDefault":true},"delete":{"gesture":{"key":46},"_isDefault":true},"undo":{"gesture":{"key":90,"keyModifiers":1},"_isDefault":true},"redo":{"gesture":{"key":89,"keyModifiers":1},"_isDefault":true},"selectAll":{"gesture":{"key":65,"keyModifiers":1},"_isDefault":true},"nudgeUp":{"parameter":"up","gesture":{"key":38},"_isDefault":true},"nudgeRight":{"parameter":"right","gesture":{"key":39},"_isDefault":true},"nudgeDown":{"parameter":"down","gesture":{"key":40},"_isDefault":true},"nudgeLeft":{"parameter":"left","gesture":{"key":37},"_isDefault":true},"startEdit":{"gesture":{"key":113},"_isDefault":true},"endEdit":{"gesture":{"key":27},"_isDefault":true},"focusToNextItem":{"gesture":{"key":9},"_isDefault":true},"focusToPreviousItem":{"gesture":{"key":9,"keyModifiers":1},"_isDefault":true},"selectFocusedItem":{"gesture":{"key":13},"_isDefault":true}}},"layers":[],"connectorType":"straightLine","editorFocusChange":null,"nodeCollectionChange":null,"templateNodeRendering":null,"historyChange":null,"autoScrollChange":null,"itemClick":null,"connectorCollectionChange":null,"selectionChange":null,"mouseLeave":null,"mouseEnter":null,"mouseOver":null,"click":null,"doubleClick":null,"dragEnter":null,"dragOver":null,"dragLeave":null,"drop":null,"drag":null,"textChange":null,"sizeChange":null,"connectionChange":null,"rotationChange":null,"contextMenuClick":null,"contextMenuBeforeOpen":null,"contextMenuClose":null,"connectorSourceChange":null,"connectorTargetChange":null,"scrollChange":null,"segmentChange":null,"propertyChange":null,"groupChange":null,"create":null,"destroy":null}';
         diagram.loadDiagram(data,true);
         expect(diagram.nodes.length === 2).toBe(true);
         done();
        });
    });

    //875655- ConnectionChange Event not triggered in Changed state for port change in same node
    describe('Connectionchange event not triggered for port change in same node', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let count: number = 0;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramConnectionEvent' });
            document.body.appendChild(ele);
            let ports: PointPortModel[] = [
                {
                    id: 'port1',
                    offset: {
                        x: 0,
                        y: 0.5,
                    },
                    visibility: PortVisibility.Visible,
                    constraints: PortConstraints.Default | PortConstraints.Draw,
                },
                {
                    id: 'port2',
                    offset: {
                        x: 1,
                        y: 0.5,
                    },
                    visibility: PortVisibility.Visible,
                    constraints: PortConstraints.Default | PortConstraints.Draw,
                },
                {
                    id: 'port3',
                    offset: {
                        x: 0.5,
                        y: 0,
                    },
                    visibility: PortVisibility.Visible,
                    constraints: PortConstraints.Default | PortConstraints.Draw,
                },
                {
                    id: 'port4',
                    offset: {
                        x: 0.5,
                        y: 1,
                    },
                    visibility: PortVisibility.Visible,
                    constraints: PortConstraints.Default | PortConstraints.Draw,
                },
            ];
            let node1: NodeModel = {
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 150, annotations: [{ content: 'Node1' }],
                shape: { type: 'Basic', shape: 'Rectangle' },

                ports: ports
            };

            let node2: NodeModel = {
                id: 'node2', width: 100, height: 100, offsetX: 500, offsetY: 150, annotations: [{ content: 'Node2' }],
                shape: { type: 'Basic', shape: 'Rectangle' },
                ports: ports
            };
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector7', sourceID: "node1", targetID: "node2",
                    sourcePortID: "port2", targetPortID: "port1",type:"Orthogonal"
                }
            ];

            function connectionChange(args: IConnectionChangeEventArgs) {
                if (args.state == "Changed") {
                    count++;
                }
            }
            diagram = new Diagram({

                width: '1000px', height: '500px', nodes: [node1, node2], connectors: connectors,
                connectionChange: connectionChange,

            });
            diagram.appendTo('#diagramConnectionEvent');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking connection Change event - port change in same node', function (done: Function) {
            var diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let connector: ConnectorModel  = diagram.connectors[0];
            diagram.select([connector]);
            let portObj1:HTMLElement = document.getElementById('node2_port1')
            let oldBounds: DOMRect = portObj1.getBoundingClientRect() as DOMRect;
            let portObj2:HTMLElement = document.getElementById('node2_port4')
            let newBounds: DOMRect = portObj2.getBoundingClientRect() as DOMRect;
            mouseEvents.mouseDownEvent(diagramCanvas, oldBounds.x, oldBounds.y, false, false);
            mouseEvents.mouseDownEvent(diagramCanvas, oldBounds.x, oldBounds.y, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, oldBounds.x, oldBounds.y, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, 475, 175, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, newBounds.x, newBounds.y, false, false);
            mouseEvents.mouseUpEvent(diagramCanvas, newBounds.x, newBounds.y, false, false);

            expect(diagram.connectors[0].targetID == "node2" &&
                diagram.connectors[0].targetPortID == "port4").toBe(true);
            expect(count > 0).toBe(true);
            done();
        });
    });

    describe('881512-Wrapping of the connector annotation at run time not working properly.', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let count: number = 0;
        let mouseEvents: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramConnectorWrap' });
            document.body.appendChild(ele);

            let connectors: ConnectorModel[] = [
                {
                id: 'connector1', sourcePoint: { x: 280, y: 300 }, targetPoint: { x: 400, y: 300 }, annotations: [ {content: 'This is very longlonglong text',style: {
                    textWrapping: 'Wrap',
                    fontSize: 8,
                    color: 'Black',
                  },
                  verticalAlignment: 'Top',
                  horizontalAlignment: 'Center',
                  constraints: AnnotationConstraints.ReadOnly,
                  type: 'Path',}]
                },
                {
                    id: 'connector2', sourceID:'node1', targetID:'node2', annotations: [ {content: 'This is very longlonglong text',style: {
                        textWrapping: 'Wrap',
                        fontSize: 8,
                        color: 'Black',
                      },
                      verticalAlignment: 'Top',
                      horizontalAlignment: 'Center',
                      constraints: AnnotationConstraints.ReadOnly,
                      type: 'Path',}]
                },
            ];
            let nodes: NodeModel[] = [
                {
                id: 'node1', width: 70, height: 50, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}]
                },
                {
                    id: 'node2', width: 70, height: 50, offsetX: 270, offsetY: 100, annotations: [ { content: 'Node2'}]
                },
            ];
            diagram = new Diagram({

                width: '1000px', height: '500px', nodes: nodes, connectors: connectors,

            });
            diagram.appendTo('#diagramConnectorWrap');

        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Changing node offset dynamically and checking connector annotation size', function (done: Function) {
            let connector = diagram.nameTable['connector2'];
            let preTextBounds = connector.wrapper.children[3].bounds;
            let node = diagram.nodes[0];
            node.offsetX = 130;
            diagram.dataBind();
            let curTextBounds = connector.wrapper.children[3].bounds;
            expect(preTextBounds.width !== curTextBounds.width && curTextBounds.width < preTextBounds.width).toBe(true);
            done();
        });
        it('Changing connector source point dynamically and checking connector annotation size', function (done: Function) {
            let connector = diagram.nameTable['connector1'];
            let preTextBounds = connector.wrapper.children[3].bounds;
            connector.sourcePoint= { x:320,y:300};
            diagram.dataBind();
            let curTextBounds = connector.wrapper.children[3].bounds;
            expect(preTextBounds.width !== curTextBounds.width && curTextBounds.width < preTextBounds.width).toBe(true);
            done();
        });
        it('Changing node offset using mouse events and checking connector annotation size', function (done: Function) {
            let connector = diagram.nameTable['connector2'];
            let preTextBounds = connector.wrapper.children[3].bounds;
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nodes[1];
            mouseEvents.clickEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + 30, node.offsetY);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + 80, node.offsetY);
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX + 120, node.offsetY);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX + 120, node.offsetY);
            let curTextBounds = connector.wrapper.children[3].bounds;
            expect(preTextBounds.width !== curTextBounds.width && curTextBounds.width > preTextBounds.width).toBe(true);
            done();
        });
    });

    describe('Code coverage - segment thumb shapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagramConnectorSegThumb' });
            document.body.appendChild(ele);
            let connectors: ConnectorModel[] = [
                {
                    id: 'connector1', type: 'Orthogonal', sourcePoint: { x: 100, y: 100 }, targetPoint: { x: 200, y: 200 },
                    segments: [{ type: 'Orthogonal', direction: "Right", length: 70 }, { type: 'Orthogonal', direction: "Bottom", length: 20 }]
                },
                {
                    id:'connector2',type:'Bezier',sourcePoint:{x:300,y:100},targetPoint:{x:400,y:200},
                    segments:[{type:'Bezier',point:{x:320,y:120}},{type:'Bezier',point:{x:350,y:150}}]
                }
            ];
            diagram = new Diagram({
                width: '900px', height: '500px', connectors: connectors,
                segmentThumbShape:'DoubleArrow',
                getConnectorDefaults: function (connector: ConnectorModel) {
                    connector.constraints = ConnectorConstraints.Default | ConnectorConstraints.DragSegmentThumb;
                }
            });
            diagram.appendTo('#diagramConnectorSegThumb');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Changing segment thumb shape at runtime for orthogonal connector', function (done) {
            let connector1 = diagram.nameTable['connector1'];
            diagram.select([connector1]);
            diagram.segmentThumbShape = 'Circle';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Arrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Diamond';
            diagram.dataBind();
            diagram.segmentThumbShape = 'DoubleArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Ellipse';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Fletch';
            diagram.dataBind();
            diagram.segmentThumbShape = 'IndentedArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'OpenArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'OpenFetch';
            diagram.dataBind();
            diagram.segmentThumbShape = 'OutdentedArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Rectangle';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Rhombus';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Square';
            diagram.dataBind();
            expect(diagram.segmentThumbShape === 'Square').toBe(true);
            done();
        });
        it('Changing segment thumb shape at runtime for bezier connector', function (done) {
            let connector2 = diagram.nameTable['connector2'];
            diagram.select([connector2]);
            diagram.segmentThumbShape = 'Circle';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Arrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Diamond';
            diagram.dataBind();
            diagram.segmentThumbShape = 'DoubleArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Ellipse';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Fletch';
            diagram.dataBind();
            diagram.segmentThumbShape = 'IndentedArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'OpenArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'OpenFetch';
            diagram.dataBind();
            diagram.segmentThumbShape = 'OutdentedArrow';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Rectangle';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Rhombus';
            diagram.dataBind();
            diagram.segmentThumbShape = 'Square';
            diagram.dataBind();
            expect(diagram.segmentThumbShape === 'Square').toBe(true);
            done();
        }); 
    });

});