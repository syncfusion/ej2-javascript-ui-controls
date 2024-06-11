/**
 * Simple ruler
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { Ruler, TickAlignment } from '../../src/ruler/index';
import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { IArrangeTickOptions } from '../../src/ruler/objects/interface/interfaces';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { NodeModel } from '../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../src/diagram/objects/connector-model';
import { DiagramTools } from '../../src/diagram/enum/enum';


let mouseEvents: MouseEvents = new MouseEvents();
describe('Ruler component', () => {
    describe('Testing Ruler Component', () => {
        let ruler: Ruler;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'ruler_1' });
            document.body.appendChild(ele);
            ruler = new Ruler({
                thickness: 30,
                interval: 5,
                segmentWidth: 50,
                orientation: 'Horizontal'

            });
            ruler.appendTo('#ruler_1');
        });

        afterAll((): void => {
            ruler.destroy();
            ele.remove();
        });

        it('Checking default Ruler component', (done: Function) => {
            let rulerObj: HTMLElement = document.getElementById(ruler.element.id + '_ruler_space');
            ruler.getPersistData();
            expect(rulerObj !== undefined).toBe(true);
            done();
        });

        it('Checking default Ruler component', (done: Function) => {
            let rulerObj: HTMLElement = document.getElementById(ruler.element.id + '_ruler_space');
            ruler.orientation = 'Vertical';
            ruler.offset = 10;
            ruler.dataBind();
            expect(rulerObj !== undefined).toBe(true);
            done();
        });

        it('Checking default Ruler component', (done: Function) => {
            let rulerObj: HTMLElement = document.getElementById(ruler.element.id + '_ruler_space');
            ruler.length = 400;
            ruler.dataBind();
            expect(rulerObj !== undefined).toBe(true);
            done();
        });
    });
});


describe('Ruler component', () => {
    describe('Testing Ruler Component', () => {
        let ruler: Ruler;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'ruler_2' });
            document.body.appendChild(ele);
            ruler = new Ruler({
                thickness: 30,
                interval: 5,
                segmentWidth: 50,
                tickAlignment: 'LeftOrTop',
                orientation: 'Vertical'

            });
            ruler.appendTo('#ruler_2');
        });

        afterAll((): void => {
            ruler.destroy();
            ele.remove();
        });

        it('Checking default Ruler component', (done: Function) => {
            let rulerObj: HTMLElement = document.getElementById(ruler.element.id + '_ruler_space');
            ruler.getPersistData();
            expect(rulerObj !== undefined).toBe(true);
            done();
        });
    });
});


describe('Ruler component', () => {
    describe('Testing Ruler Component', () => {
        let ruler: Ruler;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'ruler_3' });
            document.body.appendChild(ele);
            ruler = new Ruler({
                thickness: 30,
                interval: 5,
                segmentWidth: 50,
                tickAlignment: 'LeftOrTop',
                orientation: 'Horizontal',
                length: 400

            });
            ruler.appendTo('#ruler_3');
        });

        afterAll((): void => {
            ruler.destroy();
            ele.remove();
        });

        it('Checking default Ruler component', (done: Function) => {
            let rulerObj: HTMLElement = document.getElementById(ruler.element.id + '_ruler_space');
            ruler.getPersistData();
            expect(rulerObj !== undefined).toBe(true);
            done();
        });
    });
});

describe('Ruler', () => {
    describe('Testing Ruler', () => {
        let diagram: Diagram;
        let ruler: Ruler;
        let ele: HTMLElement;
        let arrange: Function = (args: IArrangeTickOptions) => {
            if (args.tickInterval % 10 == 0) {
                args.tickLength = 25;
            }
            else if (args.tickInterval % 50 == 0) {
                args.tickLength = 20;
            }
            else if (args.tickInterval % 20 == 0) {
                args.tickLength = 14;
            }
        }
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_ruler_1' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1200px', height: '1000px',
                rulerSettings: {
                    showRulers: true,
                    horizontalRuler: {
                        arrangeTick: arrange
                    }
                }
            });
            diagram.appendTo('#diagram_ruler_1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking default Ruler', (done: Function) => {
            let overlapRuler = document.getElementById(diagram.element.id + '_overlapRuler');
            let hRuler = document.getElementById(diagram.element.id + '_hRuler');
            let vRuler = document.getElementById(diagram.element.id + '_vRuler');
            expect(overlapRuler !== undefined && hRuler !== undefined && vRuler !== undefined
                && hRuler.clientHeight === diagram.rulerSettings.horizontalRuler.thickness
                && vRuler.clientWidth === diagram.rulerSettings.verticalRuler.thickness
                && overlapRuler.clientWidth === diagram.rulerSettings.verticalRuler.thickness
                && overlapRuler.clientHeight === diagram.rulerSettings.horizontalRuler.thickness).toBe(true);
            done();
        });

        it('Checking custome Ruler', (done: Function) => {
            diagram.rulerSettings = {
                horizontalRuler: {
                    thickness: 30,
                    tickAlignment: 'RightOrBottom',
                    segmentWidth: 50,
                    markerColor: 'blue',
                },
                verticalRuler: {
                    thickness: 20,
                    tickAlignment: 'LeftOrTop',
                    segmentWidth: 50,
                    markerColor: 'red',
                }
            }
            diagram.dataBind();
            let overlapRuler = document.getElementById(diagram.element.id + '_overlapRuler');
            let hRulerobj = document.getElementById(diagram.element.id + '_hRuler');
            let vRulerobj = document.getElementById(diagram.element.id + '_vRuler');
            let hruler = diagram.rulerSettings.horizontalRuler;
            let vRuler = diagram.rulerSettings.verticalRuler;
            expect(overlapRuler !== undefined && hRulerobj !== undefined && vRulerobj !== undefined &&
                hruler.thickness === 30 && vRuler.thickness === 20 && hruler.tickAlignment === 'RightOrBottom' &&
                vRuler.tickAlignment === 'LeftOrTop' && hruler.segmentWidth === 50 && vRuler.segmentWidth === 50 &&
                vRuler.markerColor === 'red' && hruler.markerColor === 'blue').toBe(true);
            done();
        });

        it('Checking Ruler zoom', (done: Function) => {
            let hRuler = document.getElementById(diagram.element.id + '_hRuler');
            let vRuler = document.getElementById(diagram.element.id + '_vRuler');
            let arrangeTick: Function = (args: IArrangeTickOptions) => {
                if (args.tickInterval % 100 == 0) {
                    args.tickLength = 25;
                }
                else if (args.tickInterval % 50 == 0) {
                    args.tickLength = 20;
                }
                else if (args.tickInterval % 20 == 0) {
                    args.tickLength = 14;
                }
            }
            diagram.rulerSettings = {
                horizontalRuler: {
                    segmentWidth: 100,
                    arrangeTick: arrangeTick
                },
                verticalRuler: {
                    segmentWidth: 100,
                    arrangeTick: arrangeTick
                }
            }
            diagram.dataBind();
            diagram.zoom(1.2);
            expect((diagram.scroller.horizontalOffset === -117.5 || diagram.scroller.horizontalOffset === -120) && (diagram.scroller.verticalOffset === -97.5 || diagram.scroller.verticalOffset === -100)).toBe(true);
            diagram.zoom(0.8);
            expect((diagram.scroller.horizontalOffset === 23.5 || diagram.scroller.horizontalOffset === 24) && (diagram.scroller.verticalOffset == 19.5 || diagram.scroller.verticalOffset === 20)).toBe(true);
            diagram.zoom(0.7);
            diagram.zoom(0.33);
            diagram.zoom(6.9);
            diagram.zoom(1);
            done();
        });

        it('Checking without Ruler', (done: Function) => {
            diagram.rulerSettings = {
                showRulers: false
            }
            diagram.dataBind();
            let overlapRuler = document.getElementById(diagram.element.id + '_overlapRuler');
            let hRuler = document.getElementById(diagram.element.id + '_hRuler');
            let vRuler = document.getElementById(diagram.element.id + '_vRuler');
            expect(overlapRuler === null && hRuler === null && vRuler === null).toBe(true);
            done();
        });

        it('Adding Ruler On runTime', (done: Function) => {
            diagram.rulerSettings = {
                showRulers: true
            }
            diagram.dataBind();
            let overlapRuler = document.getElementById(diagram.element.id + '_overlapRuler');
            let hRuler = document.getElementById(diagram.element.id + '_hRuler');
            let vRuler = document.getElementById(diagram.element.id + '_vRuler');
            expect(overlapRuler !== null && hRuler !== null && vRuler !== null).toBe(true);
            done();
        });
    });
});

describe('Ruler', () => {
    describe('Testing Ruler', () => {
        let diagram: Diagram;
        let ruler: Ruler;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_ruler_2' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '1200px', height: '1000px',
                rulerSettings: {
                    showRulers: true,
                }
            });
            diagram.appendTo('#diagram_ruler_2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('checking the ruler marker', (done: Function) => {
            let overlapRuler = document.getElementById(diagram.element.id + '_overlapRuler');
            let hRuler = document.getElementById(diagram.element.id + '_hRuler');
            let vRuler = document.getElementById(diagram.element.id + '_vRuler');
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 100, false, false);
            let hMarker = document.getElementById(diagram.element.id + '_hRuler_marker');
            let vMarker = document.getElementById(diagram.element.id + '_vRuler_marker');
            expect(hMarker !== null && vMarker !== null).toBe(true);
            mouseEvents.mouseLeaveEvent(diagramCanvas);
            hMarker = document.getElementById(diagram.element.id + '_hRuler_marker');
            vMarker = document.getElementById(diagram.element.id + '_vRuler_marker');
            expect(hMarker === null && vMarker === null).toBe(true);
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

    describe('Code coverage Ruler update at runtime', () => {
        let diagram: Diagram;
        let ruler: Ruler;
        let ele: HTMLElement;
        let connectors2:ConnectorModel[];
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_rulerRuntime' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: "node1",
                    height: 100,
                    width: 100,
                    offsetX: 100,
                    offsetY: 100,
                },
                {
                    id: "node2",
                    height: 100,
                    width: 100,
                    offsetX: 300,
                    offsetY: 100,
                },
                {
                    id: "node3",
                    height: 100,
                    width: 100,
                    offsetX: 500,
                    offsetY: 100,
                }
            ];
            connectors2 = [
                {
                    id: "connector11",
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 200, y: 200 },
                },
                {
                    id: "connector21",
                    sourcePoint: { x: 200, y: 200 },
                    targetPoint: { x: 300, y: 300 },
                }
            ]
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: nodes,
                rulerSettings:{showRulers:true,verticalRuler:{markerColor:'red',thickness:50,segmentWidth:200},horizontalRuler:{markerColor:'red',thickness:50,segmentWidth:200}},
            });
            diagram.appendTo('#diagram_rulerRuntime');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Updating ruler at runtime', (done: Function) => {
            diagram.rulerSettings.verticalRuler.markerColor = 'yellow';
            diagram.rulerSettings.horizontalRuler.thickness = 20;
            diagram.rulerSettings.verticalRuler.thickness = 20;
            diagram.dataBind();
            expect(diagram.rulerSettings.verticalRuler.markerColor === 'yellow').toBe(true);
            done();
        });
        it('Updating connectors collection at runtime', (done: Function) => {
            diagram.connectors = connectors2;
            expect(diagram.connectors.length > 0).toBe(true);
            done();
        });
        it('Nudge connector at runtime', (done: Function) => {
            let connector = diagram.connectors[0];
            let prePoint = connector.sourcePoint.y;
            diagram.select([connector]);
            diagram.nudge('Down');
            let curPoint = connector.sourcePoint.y;
            expect(prePoint < curPoint).toBe(true);
            done();
        });
        it('Applying padding to node at runtime', (done: Function) => {
            let node = diagram.nodes[0];
            let prePadding = node.padding.left;
            node.padding = {left:10,right:0,top:0,bottom:0};
            diagram.dataBind();
            let curPadding = node.padding.left;
            expect(prePadding !== curPadding).toBe(true);
            let topPadding = node.padding.top;
            node.padding = {left:10,right:0,top:10,bottom:0};
            let curTopPadding = node.padding.top;
            diagram.dataBind();
            expect(topPadding !== curTopPadding).toBe(true);
            done();
        });
        it('Add text node at runtime', (done: Function) => {
            let textNode:NodeModel = {id:'text',width:300,height:200,offsetX:300,offsetY:200,shape:{type:'Text',content:''}};
            diagram.add(textNode);
            let node = diagram.nameTable['text'];
            diagram.startTextEdit(node);
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas,10,10);
            expect(diagram.selectedItems.nodes.length === 0).toBe(true);
            done();
        });
        it('Apply font style at runtime for connector annotation', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let textNode2:NodeModel = {id:'text2',width:100,height:50,offsetX:300,offsetY:400,shape:{type:'Text',content:'textNode2'}};
            diagram.add(textNode2);
            let node = diagram.nameTable['text2'];
            diagram.select([node]);
            mouseEvents.keyDownEvent(diagramCanvas, 'B', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'I', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'U', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'U', true);
            expect(node.style.bold).toBe(true);
            done();
        });
    });

    describe('Code coverage update at runtime', () => {
        let diagram: Diagram;
        let ruler: Ruler;
        let ele: HTMLElement;
        let connectors2:ConnectorModel[];
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_UpdateRuntime' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: "node1",
                    height: 100,
                    width: 100,
                    offsetX: 100,
                    offsetY: 100,
                },
                {
                    id: "node2",
                    height: 100,
                    width: 100,
                    offsetX: 300,
                    offsetY: 100,
                },
                {
                    id: "node3",
                    height: 100,
                    width: 100,
                    offsetX: 500,
                    offsetY: 100,
                }
            ];
            connectors2 = [
                {
                    id: "connector11",
                    sourcePoint: { x: 100, y: 100 },
                    targetPoint: { x: 200, y: 200 },
                },
                {
                    id: "connector21",
                    sourcePoint: { x: 200, y: 200 },
                    targetPoint: { x: 300, y: 300 },
                }
            ]
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: nodes,
                collectionChange: function (args) {
                    if(args.state === 'Changing' && args.type === 'Addition'){
                        args.cancel = true;
                    }
                },
                drawingObject: {type:'Orthogonal'},
                rulerSettings:{dynamicGrid:true,showRulers:true,verticalRuler:{markerColor:'red',thickness:50,segmentWidth:200},horizontalRuler:{markerColor:'red',thickness:50,segmentWidth:200}},
            });
            diagram.appendTo('#diagram_UpdateRuntime');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Update ruler at runtime', (done: Function) => {
             diagram.rulerSettings.verticalRuler.thickness = 100;
             diagram.rulerSettings.horizontalRuler.thickness = 100;
             diagram.rulerSettings.verticalRuler.markerColor = 'yellow';
             diagram.rulerSettings.dynamicGrid = false;
             diagram.dataBind();
             expect(diagram.rulerSettings.verticalRuler.markerColor === 'yellow').toBe(true);
             done();
         });
        it('Draw and connect nodes', (done: Function) => {
           diagram.tool = DiagramTools.DrawOnce;
           diagram.dataBind();
           let node1 = diagram.nodes[0];
           let node2 = diagram.nodes[1];
           let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            mouseEvents.mouseMoveEvent(diagramCanvas, node1.offsetX, node1.offsetY, false, false);
            mouseEvents.mouseDownEvent(diagramCanvas, node1.offsetX, node1.offsetY, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, node1.offsetX + 20, node1.offsetY, false, false);
            mouseEvents.mouseMoveEvent(diagramCanvas, node2.offsetX, node2.offsetY, false, false);
            mouseEvents.mouseUpEvent(diagramCanvas, node2.offsetX, node2.offsetY, false, false);
            expect(diagram.connectors.length === 0).toBe(true);
            done();
        });
       
    });

    describe('Code coverage Canvas mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let mouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram_canvas' });
            document.body.appendChild(ele);
            let nodes:NodeModel[] = [
                {
                    id: 'node1', width: 50, height: 50,offsetX:100,offsetY:100,
                    annotations:[{content:'node1'}]
                }, {
                    id: 'node2', width: 50, height: 50, offsetX:300,offsetY:100
                },
            ];
            let connectors:ConnectorModel[] = [{
                id: 'connector1', sourceID: 'node1', targetID: 'node2',type:'Bezier'
            }];
            diagram = new Diagram({
                width: '1000px', height: '500px', nodes: nodes,
                connectors:connectors,
                mode:'Canvas'
             });
            diagram.appendTo('#diagram_canvas');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('end edit for node', (done: Function) => {
            let diagramCanvas = document.getElementById(diagram.element.id + 'content');
            diagram.zoomTo({type:'ZoomOut', zoomFactor:0.2});
            let node = diagram.nameTable['node1'];
            mouseEvents.clickEvent(diagramCanvas,10,10);
            diagram.startTextEdit(node);
            mouseEvents.keyDownEvent(diagramCanvas,'Escape');
             expect(node.annotations[0].content === 'node1').toBe(true);
             done();
         });
        
       
    });
});
