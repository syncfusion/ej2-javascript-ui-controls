import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BpmnShapeModel, BpmnAnnotationModel, SwimLaneModel } from '../../../src/diagram/objects/node-model';
import { ShapeStyleModel } from '../../../src/diagram/core/appearance-model';
import { ShadowModel, RadialGradientModel, StopModel } from '../../../src/diagram/core/appearance-model';
import { Canvas } from '../../../src/diagram/core/containers/canvas';
import { BpmnDiagrams } from '../../../src/diagram/objects/bpmn';
import { BpmnShape, IElement, PathElement, PointModel, UndoRedo } from '../../../src/diagram/index';
import { MouseEvents } from './../interaction/mouseevents.spec';
import { NodeConstraints } from '../../../src/diagram/enum/enum';
import { Container } from '../../../src/diagram/core/containers/container';
import  {profile , inMB, getMemoryProfile} from '../../../spec/common.spec';
import {
    SymbolPalette, SymbolInfo
} from '../../../src/symbol-palette/index';


Diagram.Inject(BpmnDiagrams,UndoRedo);
SymbolPalette.Inject(BpmnDiagrams);

/**
 * BPMN Text Annotations
 */
describe('Diagram Control', () => {
    let mouseEvents: MouseEvents = new MouseEvents();

    describe('BPMN Text Annotations', () => {
        let diagram: Diagram;
        let shadow: ShadowModel = { angle: 135, distance: 10, opacity: 0.9 };
        let stops: StopModel[] = [{ color: 'white', offset: 0 }, { color: 'red', offset: 50 }];
        let gradient: RadialGradientModel = { cx: 50, cy: 50, fx: 50, fy: 50, stops: stops, type: 'Radial' };

        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram1' });
            document.body.appendChild(ele);
            let shadow1: ShadowModel = { angle: 135 };

            let node: NodeModel[] = [
                {
                    id: 'node', width: 100, height: 100, offsetX: 300, offsetY: 450,
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
                    shadow: shadow1, constraints: NodeConstraints.Default | NodeConstraints.Shadow,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                        annotations: [
                            { id: 'annot1',angle: 30, length: 150, text: 'textAnnotation1' },
                            { angle: 90, width: 100, height: 100, length: 150, text: 'textAnnotation2' },
                            { id: 'annot3', angle: 180, width: 100, height: 100, length: 150, text: 'textAnnotation3' },
                            { id: 'annot4', angle: 280, width: 100, height: 100, length: 150, text: 'textAnnotation4' }
                        ]
                    } as BpmnShapeModel,
                },
                {
                    id: 'bpmn2', width: 100, height: 100, offsetX: 750, offsetY: 240,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                        annotations: [{ id: 'left', angle: 170, length: 150, text: 'Left', },
                        { id: 'right', angle: 30, length: 150, text: 'Right', },
                        { id: 'top', angle: 270, length: 150, text: 'Top' },
                        { id: 'bottom', angle: 120, length: 150, text: 'Bottom' }
                        ]
                    } as BpmnShapeModel,
                }, {
                    id: 'annot_uni', width: 100, height: 100,
                    shape: { type: 'Bpmn', shape: 'TextAnnotation', annotation: { angle: 280, length: 150, text: 'textAnnotation node' } }
                }
            ];
            diagram = new Diagram({
                width: 900, height: 550, nodes: node
            });
            diagram.appendTo('#diagram1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking annotation dragging in the same direction', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node: HTMLElement = document.getElementById('node');
            mouseEvents.clickEvent(diagramCanvas, 308, 258);
            mouseEvents.dragAndDropEvent(diagramCanvas, 308, 258, 240, 200);
            let node2 = diagram.selectedItems.nodes[0];
            console.log('offsetX',Math.round(node2.offsetX));
            console.log('offsetY',Math.round(node2.offsetY));
            expect(Math.round(node2.offsetX)=== 270 && Math.round(node2.offsetY) === 140).toBe(true);
            done();
        });
        it('Checking annotation dragging in the oppsite direction', (done: Function) => {

            diagram.clearSelection();
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 270, 140);
            mouseEvents.dragAndDropEvent(diagramCanvas, 270, 140, 250, 350);
            let node2 = diagram.selectedItems.nodes[0];
            console.log('offsetX',Math.round(node2.offsetX));
            console.log('offsetY',Math.round(node2.offsetY));
            expect(Math.round(node2.offsetX)=== 250 && Math.round(node2.offsetY) > 250).toBe(true);
            done();
        });
        it('Checking dragging a BPMN Shape with annotations', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['node'];
            diagram.select([node]);
            let oldTextNodeOffsetX = diagram.nameTable[(diagram.selectedItems.nodes[0].shape as BpmnShape).annotations[0].id].offsetX;
            let oldTextNodeOffsetY = diagram.nameTable[(diagram.selectedItems.nodes[0].shape as BpmnShape).annotations[0].id].offsetY;
            diagram.select([node]);
            diagram.drag(node,100,-200);
            console.log('offsetX', (diagram.nameTable[(diagram.selectedItems.nodes[0].shape as BpmnShape).annotations[0].id].offsetX));
            console.log('offsetY', (diagram.nameTable[(diagram.selectedItems.nodes[0].shape as BpmnShape).annotations[0].id].offsetY));
            let newTextNodeOffsetX = diagram.nameTable[(diagram.selectedItems.nodes[0].shape as BpmnShape).annotations[0].id].offsetX;
            let newTextNodeOffsety = diagram.nameTable[(diagram.selectedItems.nodes[0].shape as BpmnShape).annotations[0].id].offsetY;
            expect(oldTextNodeOffsetX !== newTextNodeOffsetX && oldTextNodeOffsetY > newTextNodeOffsety).toBe(true);
            done();
        });

        it('Clicking at connector to select annotation', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let oldNodeLength = diagram.nodes.length;
            diagram.select([diagram.nameTable['annot4']]);
            expect(diagram.selectedItems.nodes.length == 1
                && diagram.selectedItems.nodes[0].id == 'annot4').toBe(true);
            mouseEvents.keyDownEvent(diagramCanvas, 'C', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'V', true);
            mouseEvents.keyDownEvent(diagramCanvas, 'Z', true);
            expect(diagram.nodes.length === oldNodeLength).toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 225 + 8, 300);
            done();
        });


        it('Deleting an annotation', (done: Function) => {

            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let oldNodeLength = diagram.nodes.length;
            diagram.select([diagram.nameTable['annot4']]);
            mouseEvents.keyDownEvent(diagramCanvas, 'Delete');
            console.log('oldNode length',oldNodeLength);
            console.log('newNode length',diagram.nodes.length);
            expect(diagram.nodes.length ===oldNodeLength-1).toBe(true);
            done();
        });


        it('Adding an annotation', (done: Function) => {

            let oldLength = diagram.nodes.length;
            diagram.addTextAnnotation({ id: 'newAnnotation', text: 'New Annotation', length: 100, angle: 270 }, diagram.nodes[0]);
            expect(diagram.nodes.length === oldLength+1).toBe(true);
            done();
        });

       });

       describe('BPMN Text Annotations test2', () => {
        let diagram: Diagram;

        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramBpmnTextAn' });
            document.body.appendChild(ele);

            let node: NodeModel[] = [
                {
                    id: 'start', width: 100, height: 100, offsetX: 300, offsetY: 450,
                    annotations:[{content:'start'}],
                    style: { fill: 'red', strokeColor: 'blue', strokeWidth: 5 } as ShapeStyleModel,
                    shape: {
                        type: 'Bpmn', shape: 'Event',
                    } as BpmnShapeModel,
                },
                {
                    id: 'textAn1', width: 100, height: 100, offsetX: 450, offsetY: 450,
                    shape: {
                        type: 'Bpmn', shape: 'TextAnnotation',
                        textAnnotation:{textAnnotationDirection:'Left',textAnnotationTarget:'start'}
                    } as BpmnShapeModel,
                },
                {
                    id: 'textAn2', width: 100, height: 100, offsetX: 150, offsetY: 450,
                    shape: {
                        type: 'Bpmn', shape: 'TextAnnotation',
                        textAnnotation:{textAnnotationDirection:'Right',textAnnotationTarget:'start'}
                    } as BpmnShapeModel,
                },
                {
                    id: 'textAn3', width: 100, height: 100, offsetX: 450, offsetY: 150,
                    shape: {
                        type: 'Bpmn', shape: 'TextAnnotation',
                        textAnnotation:{textAnnotationDirection:'Top',textAnnotationTarget:'start'}
                    } as BpmnShapeModel,
                },
                {
                    id: 'textAn4', width: 100, height: 100, offsetX: 450, offsetY: 500,
                    shape: {
                        type: 'Bpmn', shape: 'TextAnnotation',
                        textAnnotation:{textAnnotationDirection:'Bottom',textAnnotationTarget:'start'}
                    } as BpmnShapeModel,
                },
            ];
            diagram = new Diagram({
                width: 900, height: 550, nodes: node
            });
            diagram.appendTo('#diagramBpmnTextAn');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
            it('Checking nodes and connectors render', (done: Function) => {
                let nodeCount = diagram.nodes.length;
                let connectorCount = diagram.connectors.length;
                expect(nodeCount === 5 && connectorCount === 4).toBe(true);
                done();
            });
            it('Apply font style at runtime using keyboard', (done: Function) => {
                let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
                let start:NodeModel = diagram.nameTable['start'];
                diagram.select([start]);
                mouseEvents.keyDownEvent(diagramCanvas, 'B', true);
                mouseEvents.keyDownEvent(diagramCanvas, 'I', true);
                mouseEvents.keyDownEvent(diagramCanvas, 'U', true);
                mouseEvents.keyDownEvent(diagramCanvas, 'U', true);
                expect(start.annotations[0].style.bold).toBe(true);
                done();
            });
            it('Checking nodes opacity', (done: Function) => {
                let start:NodeModel = diagram.nameTable['start'];
                diagram.updateNodeProperty(start.wrapper,true,0.5);
                expect(start.wrapper.style.opacity === 0.5).toBe(true);
                done();
            });
       });
   
       describe('Testing Bpmn text annotation in symbol palette ',()=>{
            let diagram: Diagram;
            let palette: SymbolPalette;
            let ele: HTMLElement;
            let mouseEvents: MouseEvents = new MouseEvents();
            beforeAll((): void => {
                ele = createElement('div', { styles: 'width:100%;height:500px;' });
                ele.appendChild(createElement('div', { id: 'textAnnotationPalette', styles: 'width:25%;float:left;' }));
                ele.appendChild(createElement('div', { id: 'diagramBpmnIssue', styles: 'width:50%;height:500px;float:left;' }));
                document.body.appendChild(ele);
                diagram = new Diagram({
                    width: '70%', height: 500
                });
                diagram.appendTo('#diagramBpmnIssue');
                var BpmnShape : NodeModel[] =[  {
                    id: 'BPMNnode1',
                    annotations:[{content:'Text'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{textAnnotationDirection:'Auto',textAnnotationTarget:'',},
                            annotation:{}
                        }
                },
                {
                    id: 'BPMNnode2',
                    annotations:[{content:'Text'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{textAnnotationDirection:'Right',textAnnotationTarget:'',},
                            annotation:{}
                        }
                },
                {
                    id: 'BPMNnode3',
                    annotations:[{content:'Text'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{textAnnotationDirection:'Bottom',textAnnotationTarget:'',},
                            annotation:{}
                        }
                },
                {
                    id: 'BPMNnode4',
                    annotations:[{content:'Text'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{textAnnotationDirection:'Left',textAnnotationTarget:'',},
                            annotation:{}
                        }
                },
                {
                    id: 'BPMNnode5',
                    annotations:[{content:'Text'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{textAnnotationDirection:'Top',textAnnotationTarget:'',},
                            annotation:{}
                        }
                },
                ]
                var palettes = [
                    {
                        id: 'BpmnShapes', expanded: true, symbols: BpmnShape
                        , title: 'Bpmn'
                    }
                ];
                palette = new SymbolPalette({
                    width: '25%', height: '500px',
                    palettes: palettes,
                    symbolHeight: 50, symbolWidth: 50,
                    symbolPreview: { height: 100, width: 100 },
                    enableSearch: true,
                    symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
                    getSymbolInfo: (symbol: NodeModel): SymbolInfo => {
                        return { fit: true };
                    }
                });
                palette.appendTo('#textAnnotationPalette');
            });
            afterAll((): void => {
                diagram.destroy();
                palette.destroy();
                ele.remove();
            });
            it('Dragging text annotation from palette to diagram ', (done: Function) => {
                setTimeout(function () {
                    palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
                        let clonedElement: HTMLElement; let diagramElement: any;
                        let position: PointModel = palette['getMousePosition'](e.sender);
                        let target = document.elementFromPoint(position.x, position.y).childNodes[0];
                        let symbols: IElement = palette.symbolTable[target['id']];
                        palette['selectedSymbols'] = symbols;
                        if (symbols !== undefined) {
                            clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                            clonedElement.setAttribute('paletteId', palette.element.id);
                        }
                        return clonedElement;
                    };
                    palette.getPersistData();
                    let events = new MouseEvents();
                    let element = (document.getElementById('BPMNnode1_container').getBoundingClientRect());;
                    events.mouseDownEvent(palette.element, element.left + palette.element.offsetLeft, element.top + palette.element.offsetTop, false, false);
                    events.mouseMoveEvent(palette.element, element.left + 40 + palette.element.offsetLeft, element.top + palette.element.offsetLeft, false, false);
                    events.mouseMoveEvent(palette.element, element.left + 60, element.top, false, false);
                    events.mouseMoveEvent(diagram.element, 600, 100, false, false);
                    events.mouseMoveEvent(diagram.element, 600, 100 - diagram.element.offsetTop, false, false);
                    events.mouseMoveEvent(diagram.element, 600, 100 - 5 - diagram.element.offsetTop, false, false);
                    events.mouseUpEvent(diagram.element, 600, 100 - 10 - diagram.element.offsetTop, false, false);
                    events.clickEvent(diagram.element, 600, 100 - 10 - diagram.element.offsetTop, false, false);
                    expect(diagram.nodes.length === 1).toBe(true);
                    diagram.undo();
                    expect(diagram.nodes.length === 0).toBe(true);
                    diagram.redo();
                    expect(diagram.nodes.length === 1).toBe(true);
                    done();
                }, 1000);
            });
        });        

    // describe('BPMN Text Annotations inside swimlane', () => {

    //     let diagram: Diagram;
    //     let ele: HTMLElement;

    //     beforeAll((): void => {
    //         const isDef = (o: any) => o !== undefined && o !== null;
    //             if (!isDef(window.performance)) {
    //                 console.log("Unsupported environment, window.performance.memory is unavailable");
    //                 this.skip(); //Skips test (in Chai)
    //                 return;
    //             }
    //         ele = createElement('div', { id: 'diagram' });
    //         document.body.appendChild(ele);


    //         let nodes: NodeModel[] = [
    //             {
    //                 id: 'swimlane',
    //                 shape: {
    //                     type: 'SwimLane',
    //                     orientation: 'Horizontal',
    //                     header: {
    //                         annotation: { content: 'SALES PROCESS FLOW CHART', style: { fill: 'transparent' } },
    //                         height: 50, style: { fontSize: 11 },
    //                     },
    //                     lanes: [
    //                         {
    //                             id: 'stackCanvas1',
    //                             header: {
    //                                 annotation: { content: 'Consumer' }, width: 50,
    //                                 style: { fontSize: 11 }
    //                             },
    //                             height: 100,
    //                             children: [

    //                             ],
    //                         },

    //                     ],
    //                     phases: [
    //                         {
    //                             id: 'phase1', offset: 170,
    //                             header: { annotation: { content: 'Phase' } }
    //                         },
    //                     ],
    //                     phaseSize: 20,
    //                 },
    //                 offsetX: 500, offsetY: 300,
    //                 height: 500,
    //                 width: 650
    //             },
    //         ];
    //         diagram = new Diagram({
    //             width: 1500, height: 1000, nodes: nodes
    //         });
    //         diagram.appendTo('#diagram');
    //     });

    //     afterAll((): void => {
    //         diagram.destroy();
    //         ele.remove();
    //     });
    //     it('Checking dragging of annotation node inside the swimlane, while dragging swimlane', (done: Function) => {
    //         let newNode:NodeModel = {
    //             id:'bpmnNode1',width:60,height:60,margin:{left:100,top:100},shape:{type:'Bpmn',shape:'Event'}
    //         }
    //         diagram.addNodeToLane(newNode,'swimlane','stackCanvas1');
    //         diagram.select([diagram.nameTable['bpmnNode1']]);
    //         diagram.addTextAnnotation({ id: 'newAnnotation', text: 'New Annotation', length: 300, angle: 180 }, diagram.selectedItems.nodes[0]);
    //         let annotOffsetX = (diagram.selectedItems.nodes[0].wrapper.children[0] as Canvas).children[4].offsetX;
    //         diagram.select([diagram.nameTable['swimlane']]);
    //         diagram.drag(diagram.selectedItems.nodes[0],20,0);
    //         diagram.select([diagram.nameTable['bpmnNode1']]);
    //         expect(annotOffsetX !== (diagram.selectedItems.nodes[0].wrapper.children[0] as Canvas).children[4].offsetX).toBe(true);
    //         done();
    //     });
    //     it('Checking Lane children after drag and drop text annotation node inside swimlane',(done: Function)=>{
    //         diagram.select([diagram.nameTable['bpmnNode1_textannotation_newAnnotation']]);
    //         diagram.drag(diagram.selectedItems.nodes[0],400,-50);
    //         diagram.commandHandler.dropChildToContainer(diagram.nameTable['swimlanestackCanvas10'],diagram.nameTable['bpmnNode1_textannotation_newAnnotation']);
    //         diagram.select([diagram.nameTable['swimlanestackCanvas10']]);
    //         expect(diagram.selectedItems.nodes[0].children.length === 1).toBe(true);
    //         done();
    //     })
    // });

    describe('BPMN Text Annotations Interactions', () => {

        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagram2' });
            document.body.appendChild(ele);


            let nodes: NodeModel[] = [
                {
                    id: 'swimlane',
                    shape: {
                        type: 'SwimLane',
                        orientation: 'Horizontal',
                        header: {
                            annotation: { content: 'SALES PROCESS FLOW CHART', style: { fill: 'transparent' } },
                            height: 50, style: { fontSize: 11 },
                        },
                        lanes: [
                            {
                                id: 'stackCanvas1',
                                header: {
                                    annotation: { content: 'Consumer' }, width: 50,
                                    style: { fontSize: 11 }
                                },
                                height: 100,
                                children: [

                                ],
                            },

                        ],
                        phases: [
                            {
                                id: 'phase1', offset: 170,
                                header: { annotation: { content: 'Phase' } }
                            },
                        ],
                        phaseSize: 20,
                    },
                    offsetX: 1000, offsetY: 300,
                    height: 500,
                    width: 650
                },
                {
                    id: 'event1', style: { strokeWidth: 2 },
                    height:70,width:70,offsetX:400,offsetY:200,
                    shape: { type: 'Bpmn', shape: 'Event',
                        event: { event: 'Start', trigger: 'None' },
                     },
                },
                {
                    id: 'textNode1', width: 70, height: 70,
                    offsetX:400,offsetY:400,
                    annotations:[{content:'textNode1'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{ textAnnotationDirection:'Auto',textAnnotationTarget:'event1'}
                            // annotation:{}
                        }
                },
                {
                    id: 'textNode2', width: 70, height: 70,
                    offsetX:600,offsetY:400,
                    annotations:[{content:'textNode1'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{ textAnnotationDirection:'Auto',textAnnotationTarget:''}
                            // annotation:{}
                        }
                },
                {
                    id: 'event2', style: { strokeWidth: 2 },
                    height:70,width:70,offsetX:100,offsetY:100,
                    shape: { type: 'Bpmn', shape: 'Event',
                        event: { event: 'Start', trigger: 'None' },
                     },
                },
                {
                    id: 'textNode3', width: 70, height: 70,
                    offsetX:100,offsetY:200,
                    annotations:[{content:'textNode3'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{ textAnnotationDirection:'Auto',textAnnotationTarget:'event2'}
                            // annotation:{}
                        }
                },
            ];
            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes
            });
            diagram.appendTo('#diagram2');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking drag of text annotation and drop into swimlane',(done: Function)=>{
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['textNode3'];
            let oldOffset = node.offsetX;
            mouseEvents.mouseDownEvent(diagramCanvas,100,100);
            mouseEvents.mouseMoveEvent(diagramCanvas,1000,300);
            mouseEvents.mouseUpEvent(diagramCanvas,1000,300);
            let newOffset = node.offsetX;
            expect(oldOffset !== newOffset).toBe(true);
            done();
        });
        it('Checking Text Annotation rendering and considered in nodes collection', (done: Function) => {
            let nodeIndex1 = diagram.nodes.indexOf(diagram.getObject('textNode1'));
            let nodeIndex2 = diagram.nodes.indexOf(diagram.getObject('textNode2'));
            expect(nodeIndex1 !== -1 && nodeIndex2 !== -1).toBe(true);
            done();
        });
        it('Checking drag of text annotation with parent node drag',(done: Function)=>{
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['textNode1'];
            let eventNode = diagram.nameTable['event1']
            let oldOffset = node.offsetX;
            mouseEvents.mouseDownEvent(diagramCanvas,400,200);
            mouseEvents.mouseMoveEvent(diagramCanvas,425,200);
            mouseEvents.mouseMoveEvent(diagramCanvas,450,200);
            mouseEvents.mouseUpEvent(diagramCanvas,450,200);
            let newOffset = node.offsetX;
            expect(oldOffset !== newOffset && oldOffset === 400 && newOffset === eventNode.offsetX ).toBe(true);
            done();
        });
        it('Checking drag of text annotation without parent node',(done: Function)=>{
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['textNode2'];
            let con = diagram.nameTable['textNode2_connector'];
            let oldSourcePointX = con.sourcePoint.x;
            let oldOffset = node.offsetX;
            diagram.select([node]);
            mouseEvents.mouseDownEvent(diagramCanvas,600,400);
            mouseEvents.mouseMoveEvent(diagramCanvas,575,400);
            mouseEvents.mouseMoveEvent(diagramCanvas,550,400);
            mouseEvents.mouseUpEvent(diagramCanvas,550,400);
            let newSourcePointX = con.sourcePoint.x;
            let newOffset = node.offsetX;
            expect(oldOffset !== newOffset && oldOffset === 600 &&  oldSourcePointX > newSourcePointX ).toBe(true);
            done();
        });
        it('Checking dragging of text annotation node',(done: Function)=>{
            let event = diagram.nameTable['event1'];
            let oldEventOffset = event.offsetX;
            let node = diagram.nameTable['textNode1'];
            let oldOffsetX = node.offsetX;
            let oldOffsetY = node.offsetY;
            diagram.drag(node,100,100);
            let newOffsetX = node.offsetX;
            let newOffsetY = node.offsetY;
            let newEventOffset = event.offsetX;
            expect(oldOffsetX !== newOffsetX && oldOffsetY !== newOffsetY && newOffsetX > oldOffsetX && newOffsetY > oldOffsetY && oldEventOffset === newEventOffset).toBe(true);
            done();
        })
        it('Checking resizing of text annotation node with parent',(done: Function)=>{
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let textNode = diagram.nameTable['textNode1'];
            let oldWidth = textNode.width;
            let bounds = textNode.wrapper.bounds;
            diagram.select([diagram.nameTable['textNode1']]);
            mouseEvents.mouseDownEvent(diagramCanvas,bounds.middleLeft.x + 2,bounds.middleLeft.y + 2);
            mouseEvents.mouseMoveEvent(diagramCanvas,bounds.middleLeft.x -10,bounds.middleLeft.y);
            mouseEvents.mouseMoveEvent(diagramCanvas,bounds.middleLeft.x -20,bounds.middleLeft.y);
            mouseEvents.mouseUpEvent(diagramCanvas,bounds.middleLeft.x -20,bounds.middleLeft.y);
            let newWidth = textNode.width;
            expect(oldWidth !== newWidth).toBe(true);
            done();
        });
        it('Editing text annotation node content dynamically',(done: Function)=>{
            let textNode = diagram.nameTable['textNode1'];
            let oldTextContent = textNode.wrapper.children[1].content;
            textNode.annotations[0].content = 'updated';
            diagram.dataBind();
            let newTextContent= textNode.wrapper.children[1].content;
            expect(newTextContent === 'updated' && oldTextContent !== newTextContent).toBe(true);
            done();
        });
        it('Checking rotation of text annotation node with parent',(done: Function)=>{
            let textNode = diagram.nameTable['textNode1'];
            diagram.select([textNode]);
            diagram.rotate(diagram.selectedItems,45);
            expect(textNode.rotateAngle === 45).toBe(true);
            done();
        });
        it('Checking rotation of text annotation node without parent',(done: Function)=>{
            let textNode = diagram.nameTable['textNode2'];
            diagram.select([textNode]);
            diagram.rotate(diagram.selectedItems,45);
            expect(textNode.rotateAngle === 45).toBe(true);
            done();
        });
        it('Adding text annotation node dynamically and checking node and connector collections',(done: Function)=>{
            let newNode:NodeModel = {id:'newTextNode',width:100,height:100,offsetX:100,offsetY:100,annotations:[{content:'newNodeText'}],shape:{type:'Bpmn',shape:'TextAnnotation',textAnnotation:{textAnnotationDirection:'Auto',textAnnotationTarget:'event1'}}}
            let oldNodesLength = diagram.nodes.length;
            let oldConLength  = diagram.connectors.length;
            diagram.add(newNode);
            let newNodesLength = diagram.nodes.length;
            let newConLength = diagram.connectors.length;
            expect(oldNodesLength !== newNodesLength && oldConLength !== newConLength && (newNodesLength === oldNodesLength+1) && (newConLength === oldConLength+1) ).toBe(true);
            diagram.undo();
            expect(oldNodesLength === diagram.nodes.length && oldConLength === diagram.connectors.length).toBe(true);
            done();
        });
        it('Copy paste of text annotation node and undo redo',(done: Function)=>{
            let textNode2 = diagram.nameTable['textNode2'];
            diagram.select([textNode2]);
            let oldNodesLength = diagram.nodes.length;
            let oldConLength  = diagram.connectors.length;
            diagram.copy();
            diagram.paste();
            let newNodesLength = diagram.nodes.length;
            let newConLength = diagram.connectors.length;
            expect(oldNodesLength !== newNodesLength && oldConLength !== newConLength && (newNodesLength === oldNodesLength+1) && (newConLength === oldConLength+1) ).toBe(true);
            diagram.undo();
            expect(oldNodesLength === diagram.nodes.length && oldConLength === diagram.connectors.length).toBe(true);
            diagram.redo();
            expect(oldNodesLength !== diagram.nodes.length && oldConLength !== diagram.connectors.length).toBe(true);
            done();
        });
        it('Deleting text annotation node and undo redo',(done: Function)=>{
            let textNode2 = diagram.nameTable['textNode2'];
            diagram.select([textNode2]);
            let oldNodesLength = diagram.nodes.length;
            let oldConLength  = diagram.connectors.length;
            diagram.remove();
            let newNodesLength = diagram.nodes.length;
            let newConLength = diagram.connectors.length;
            expect(oldNodesLength !== newNodesLength && oldConLength !== newConLength && (newNodesLength === oldNodesLength-1) && (newConLength === oldConLength-1) ).toBe(true);
            diagram.undo();
            expect(oldNodesLength === diagram.nodes.length && oldConLength === diagram.connectors.length).toBe(true);
            diagram.redo();
            expect(oldNodesLength !== diagram.nodes.length && oldConLength !== diagram.connectors.length).toBe(true);
            done();
        });
        it('Adding text annotation node dynamically using add annotation method',(done: Function)=>{
            let parent = diagram.nameTable['event1'];
            let oldNodesLength = diagram.nodes.length;
            let annotation = {id:'newAnnNode',text:'NewAnnNodeText',angle:0,length:100}
            diagram.addTextAnnotation(annotation as BpmnAnnotationModel,parent);
            expect(oldNodesLength !== diagram.nodes.length).toBe(true);
            done();
        });
        it('Copy, paste text annotation node',(done: Function)=>{
            diagram.select([diagram.connectors[0]]);
            let oldNodeLength = diagram.nodes.length;
            let oldConnectorLength = diagram.connectors.length;
            diagram.copy();
            diagram.paste();
            expect(oldNodeLength !== diagram.nodes.length && oldConnectorLength !== diagram.connectors.length).toBe(true);
            done();
        });
       
    });
    describe('BPMN Text Annotations Interactions with subprocess', () => {
        let diagram: Diagram;
        let ele: HTMLElement;

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    console.log("Unsupported environment, window.performance.memory is unavailable");
                    this.skip(); //Skips test (in Chai)
                    return;
                }
            ele = createElement('div', { id: 'diagramtext1' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [
                {
                    id: 'sub', maxHeight: 600, maxWidth: 600, minWidth: 300, minHeight: 300,
                    constraints: NodeConstraints.Default | NodeConstraints.AllowDrop,
                    offsetX: 1000, offsetY: 200,
                    shape: {
                        type: 'Bpmn', shape: 'Activity', activity: {
                            activity: 'SubProcess',
                            subProcess: {
                                collapsed: false, type: 'Transaction',
                            }
                        },
                    },
                },
                {
                    id: 'event1', style: { strokeWidth: 2 },
                    height:70,width:70,offsetX:300,offsetY:200,
                    shape: { type: 'Bpmn', shape: 'Event',
                        event: { event: 'Start', trigger: 'None' },
                     },
                },
                {
                    id: 'textNode1', width: 70, height: 70,
                    offsetX:400,offsetY:200,
                    annotations:[{content:'textNode1'}],
                        shape: {
                            type: 'Bpmn', shape: 'TextAnnotation',
                            textAnnotation:{ textAnnotationDirection:'Auto',textAnnotationTarget:'event1'}
                            // annotation:{}
                        }
                },
            ];
            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes
            });
            diagram.appendTo('#diagramtext1');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking drag of text annotation and drop into subprocess',(done: Function)=>{
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['textNode1'];
            let oldOffset = node.offsetX;
            mouseEvents.mouseDownEvent(diagramCanvas,400,200);
            mouseEvents.mouseMoveEvent(diagramCanvas,1000,200);
            mouseEvents.mouseUpEvent(diagramCanvas,1000,200);
            let newOffset = node.offsetX;
            expect(oldOffset !== newOffset && oldOffset === 400).toBe(true);
            done();
        });
    });

    describe('BPMN Text Annotation throws error when start Text Edit', () => {

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
            ele = createElement('div', { id: 'diagramBpmnTextEdit' });
            document.body.appendChild(ele);


            let nodes: NodeModel[] = [
                {
                    id: 'textAnnotationNode',
                    width: 100,
                    height: 100,
                    offsetX:300,
                    offsetY:100,
                    shape: {
                      type: 'Bpmn',
                      shape: 'TextAnnotation',
                    },
                  },
            ]
            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes
            });
            diagram.appendTo('#diagramBpmnTextEdit');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking Text Annotation node textBox by double clicking the node', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let node = diagram.nameTable['textAnnotationNode'];
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.dblclickEvent(diagramCanvas, node.offsetX, node.offsetY);
            expect(node.annotations.length > 0 && node.annotations[0].content === '').toBe(true);
            mouseEvents.clickEvent(diagramCanvas, 100, 100);
            node.annotations[0].content = 'Text Annotation';
            diagram.dataBind();
            mouseEvents.mouseMoveEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseDownEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.mouseUpEvent(diagramCanvas, node.offsetX, node.offsetY);
            mouseEvents.dblclickEvent(diagramCanvas, node.offsetX, node.offsetY);
            expect(node.annotations.length > 0&& node.annotations[0].content === 'Text Annotation').toBe(true);
            done();
        });
    });
    describe('Bug 892767-Unable to update BPMN text annotation direction dynamically', () => {

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
            ele = createElement('div', { id: 'diagramBpmnTextDirection' });
            document.body.appendChild(ele);

            let nodes: NodeModel[] = [
                {
                    id: 'bpmn1', width: 100, height: 100, offsetX: 450, offsetY: 240,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                    } as BpmnShapeModel,
                },

                {
                    id: 'bpmn2', width: 100, height: 100, offsetX: 750, offsetY: 240,
                    shape: {
                        type: 'Bpmn', shape: 'DataObject',
                        dataObject: { collection: false, type: 'Input' },
                    },
                },
                {
                    id:'node1',
                    offsetX: 300,
                    offsetY: 300,
                    width: 100,
                    height: 100,
                    annotations:[{content:'Node1'}],
                    shape:{type:'Bpmn',shape:'TextAnnotation',textAnnotation:{textAnnotationDirection:'Left'}}
                }
            ];
            diagram = new Diagram({
                width: 1500, height: 1000, nodes: nodes
            });
            diagram.appendTo('#diagramBpmnTextDirection');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Changing text annotation direction at runtime', (done: Function) => {
            let textAnnotation = diagram.nameTable['node1'];
            (textAnnotation.shape as BpmnShape).textAnnotation.textAnnotationDirection = 'Right';
            diagram.dataBind();
            let path = document.getElementById('node1_textannotation_path_groupElement').getBoundingClientRect() as DOMRect;
            expect(path.x > 340 && path.x < 360).toBe(true);
            diagram.undo();
            let path2 = document.getElementById('node1_textannotation_path_groupElement').getBoundingClientRect() as DOMRect;
            expect(path2.x > 250 && path2.x < 270).toBe(true);
            diagram.redo();
            let path3 = document.getElementById('node1_textannotation_path_groupElement').getBoundingClientRect() as DOMRect;
            expect(path3.x > 340 && path3.x < 360).toBe(true);
            done();
        });
        it('Changing text annotation target at runtime', (done: Function) => {
            let textAnnotation = diagram.nameTable['node1'];
            (textAnnotation.shape as BpmnShape).textAnnotation.textAnnotationTarget = 'bpmn1';
            diagram.dataBind();
            let connector = diagram.connectors[0];
            expect(connector.sourceID === 'bpmn1').toBe(true);
            done();
        });
        it('removing text annotation target at runtime',(done: Function) => {
            let textAnnotation = diagram.nameTable['node1'];
            (textAnnotation.shape as BpmnShape).textAnnotation.textAnnotationTarget = '';
            diagram.dataBind();
            let connector = diagram.connectors[0];
            expect(connector.sourceID === '').toBe(true);
            done();
        });
    });  
});