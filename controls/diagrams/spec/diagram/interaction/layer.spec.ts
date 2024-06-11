import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Layer } from '../../../src/diagram/diagram/layer';
import { PortVisibility } from '../../../src/diagram/enum/enum';
import { LayerModel } from '../../../src/diagram/diagram/layer-model';
import { MouseEvents } from './mouseevents.spec';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

function getDSNodeHtmlContent(dsName: string, dsType: string): string {
    return `<div class="diagramNode diagramDSNode">
                 <div class="diagramNodeText diagramDSNodeTitle">${dsName}</div>
                 <div class="diagramNodeText diagramNodeSubTitle diagramDSNodeSubTitle">${dsType}</div>
                 <div class="diagramNodeFooter" ><button class="diagramNodeMenuIcon"/></div>
              </div>`;
}
function created(args: any) {
    let sfDiagram = (document.getElementById('diagram') as any).ej2_instances[0];
    installGlassLayer();

    let dsNode: NodeModel = {
        id: "dsnode1",
        width: 172,
        height: 76,
        offsetX: 100,
        offsetY: 80,
        shape: { type: 'HTML', content: getDSNodeHtmlContent("name", "type") },
        annotations: [{
            visibility: true,
            offset: { x: 0.96, y: 0.7 },
            width: 20,
            height: 20,
            template: '<button class="diagramConnectorDeleteIcon">button1</button>'
        }, {
            visibility: true,
            //content: 'Hello there; this somehow hides behind the node even with zIndex adjustment'
        }],
    };
    sfDiagram.setActiveLayer("default_layer");
    sfDiagram.add(dsNode);
    sfDiagram.bringLayerForward("glassLayerId")
}

function installGlassLayer() {
    let addButtonNode: NodeModel = {
        id: "addButtonId",
        width: 66,
        height: 66,
        offsetX: 33,
        offsetY: 33,
        shape: {
            type: 'HTML',
            content: '<div id="addButtonDiv"><button>name</button></div>'
        },
        //constraints: NodeConstraints.PointerEvents
    }
    let sfDiagram = (document.getElementById('diagram') as any).ej2_instances[0];
    const glassLayer: LayerModel = {
        id: "glassLayerId",
        objects: [],
        visible: true,
        lock: false,
    }

    sfDiagram.addLayer(glassLayer, [addButtonNode]);
}
/**
 * layer spec
 */
describe('Diagram Control', () => {

    describe('multiplelayer canvas', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Default Shape' }]
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                        '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                },
                annotations: [{ content: 'Path Element' }]
            }
            ];


            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 300 },
                targetPoint: { x: 200, y: 400 },
            }];

            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                layers: [{ id: 'layer1', visible: true, objects: ['node1'] },
                { id: 'layer2', visible: true, objects: ['node2'] },
                { id: 'layer3', visible: true, objects: ['connector1'] },
                ]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('layer property ', (done: Function) => {
            diagram.cloneLayer('layer1');
            expect(diagram.layers.length === 4).toBe(true);
            done();
            diagram.activeLayer = diagram.layers[2];
            diagram.add({
                width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Default Shape' }]
            })
            diagram.commandHandler.getLayer('layer2').visible = false;
            diagram.commandHandler.getLayer('layer2').lock = true;
            diagram.dataBind();
            expect(diagram.nameTable['node2'].wrapper.visible === false).toBe(true);
            done();

            diagram.add({
                type: 'Straight',
                sourcePoint: { x: 100, y: 300 },
                targetPoint: { x: 200, y: 400 },
            });
            diagram.clearSelection();
            diagram.selectAll();
            expect(diagram.selectedItems.nodes.length
                + diagram.selectedItems.connectors.length === diagram.activeLayer.objects.length).toBe(true);
            done();
            diagram.sendLayerBackward('layer1');
            diagram.sendLayerBackward('default_layer');
            diagram.bringLayerForward('default_layer');
            diagram.bringLayerForward('layer2');
            expect(diagram.layers[1].id === 'layer2').toBe(true);
            done();
            diagram.moveObjects(['connector1'], 'layer2');
            expect(diagram.activeLayer.objects.length !== 0).toBe(true);
            done();
            diagram.sendLayerBackward('layer2');
            expect(diagram.layers[1].id === 'layer2').toBe(true);
            done();
            let layer: LayerModel = diagram.layers[1];

            diagram.addLayer({ id: 'rr', objects: [], visible: true, lock: false, zIndex: -1 }, [{ type: 'Straight', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 } }])
            diagram.removeLayer('layer1');
            expect(diagram.layers.length === 4).toBe(true);
            done();
            diagram.addLayer({ id: 'new', objects: [], visible: true, lock: false, zIndex: -1 })
            diagram.commandHandler.getLayer('layer2').visible = false;
            diagram.commandHandler.getLayer('layer2').lock = false;
            diagram.dataBind();
            diagram.setActiveLayer('layer2');
            diagram.add({ id: 'uuu', type: 'Straight', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 } })
            expect(diagram.nameTable['uuu'].wrapper.visible === true).toBe(true);
            diagram.activeLayer.lock = true;
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            let mouseEvents: MouseEvents = new MouseEvents();
            mouseEvents.dragAndDropEvent(diagramCanvas, 100, 300, 300, 110);
            done();
        });
    });

    describe('multiplelayer svg ', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
                annotations: [{ content: 'Default Shape' }]
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
                shape: {
                    type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296L550.7723,171.9366L558.9053,194.9966L540.3643,' +
                        '179.4996L521.8223,194.9966L529.9553,171.9366L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z'
                },
                annotations: [{ content: 'Path Element' }]
            }
            ];


            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 300 },
                targetPoint: { x: 200, y: 400 },
            }];

            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                layers: [{ id: 'layer1', visible: true, objects: ['node1'] },
                { id: 'layer2', visible: true, objects: ['node2'] },
                { id: 'layer3', visible: true, objects: ['connector1'] },
                ]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('layer property ', (done: Function) => {
            diagram.commandHandler.getLayer('layer3').visible = false;
            diagram.dataBind();
            diagram.connectors[0].style.fill = 'red'
            diagram.dataBind();
            expect(diagram.connectors[0].wrapper.visible).toBe(false);
            done();
            diagram.commandHandler.getLayer('layer3').visible = true;
            diagram.dataBind();
            diagram.cloneLayer('layer1');
            expect(diagram.layers.length === 4).toBe(true);
            done();
            diagram.selectAll();
            expect(diagram.selectedItems.nodes.length +
                diagram.selectedItems.connectors.length === diagram.activeLayer.objects.length).toBe(true);
            done();

            diagram.bringLayerForward('layer2');
            expect(diagram.layerZIndexTable[2] === 'layer2').toBe(true);
            done();
            diagram.sendLayerBackward('layer2');
            expect(diagram.layerZIndexTable[1] === 'layer2').toBe(true);
            done();
            diagram.moveObjects(['connector1'], 'layer2');
            expect(diagram.commandHandler.getLayer('layer3').objects.length === 0).toBe(true);
            done();
            diagram.removeLayer('layer1');
            expect(diagram.layers.length === 3).toBe(true);
            done();
            diagram.commandHandler.getLayer('layer2').visible = false;
            diagram.commandHandler.getLayer('layer2').lock = true;
            diagram.dataBind();
            expect(diagram.nameTable['node2'].wrapper.visible === false).toBe(true);
            done();
            diagram.commandHandler.getLayer('layer2').visible = false;
            diagram.commandHandler.getLayer('layer2').lock = false;
            diagram.dataBind();
            diagram.setActiveLayer('layer2');
            diagram.add({ id: 'uuu', type: 'Straight', sourcePoint: { x: 100, y: 300 }, targetPoint: { x: 200, y: 400 } })
            expect(diagram.nameTable['uuu'].wrapper.visible === true).toBe(true);
            done();


        });
    });

    describe('clonelayer issue with connection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100
            }
            ];


            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourceID: 'node1',
                targetID: 'node2'
            }];

            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                layers: [{ id: 'layer1', visible: true, objects: ['node1', 'node2', 'connector1'] }]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('clone layer', (done: Function) => {
            diagram.cloneLayer('layer1');
            expect(diagram.layers.length === 2).toBe(true);
            done();
            expect(diagram.connectors.length === 2).toBe(true);
            expect(diagram.connectors[1].sourceID !== null).toBe(true);
            expect(diagram.connectors[1].targetID !== null).toBe(true);
            diagram.dataBind();
            done();
        });
    });

    describe('clonelayer issue without connection', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100
            },
            {
                id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100
            }
            ];


            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                type: 'Straight',
                sourcePoint: { x: 100, y: 300 },
                targetPoint: { x: 200, y: 400 },
            }];

            diagram = new Diagram({
                width: 1000, height: 600,
                connectors: connectors, nodes: nodes,
                layers: [{ id: 'layer1', visible: true, objects: ['node1', 'node2', 'connector1'] }]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('clone layer', (done: Function) => {
            diagram.cloneLayer('layer1');
            expect(diagram.layers.length === 2).toBe(true);
            done();
            expect(diagram.connectors.length === 2).toBe(true);
            diagram.dataBind();
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


    describe('group issue with layer', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100,
                offsetY: 200,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                { id: 'port2', shape: 'Square', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                { id: 'port3', shape: 'Square', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                { id: 'port4', shape: 'Square', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover }]
            }, {
                id: 'node2', width: 200, height: 100, offsetX: 400,
                offsetY: 400,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                { id: 'port2', shape: 'Square', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                { id: 'port3', shape: 'Square', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                { id: 'port4', shape: 'Square', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover }]
            },
            { id: 'group', children: ['node1', 'node2'] }
            ];

            diagram = new Diagram({
                width: 1000, height: 600,
                nodes: nodes,
                layers: [{ id: 'layer1', visible: true, objects: ['node1', 'node2', 'group'] }]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('hide/show layer on nodes ports', (done: Function) => {
            diagram.setActiveLayer('layer1');
            diagram.commandHandler.getLayer('layer1').visible = false;
            diagram.commandHandler.getLayer('layer1').visible = true;
            expect(diagram.nodes[0].ports[0].visibility === PortVisibility.Hover).toBe(true);
            diagram.dataBind();
            done();
        });
    });

    describe('group issue with layer', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [{
                id: 'node1', width: 100, height: 100, offsetX: 100,
                offsetY: 200,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                { id: 'port2', shape: 'Square', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                { id: 'port3', shape: 'Square', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                { id: 'port4', shape: 'Square', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover }]
            }, {
                id: 'node2', width: 200, height: 100, offsetX: 400,
                offsetY: 400,
                ports: [{ id: 'port1', shape: 'Square', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hover },
                { id: 'port2', shape: 'Square', offset: { x: 0.5, y: 0 }, visibility: PortVisibility.Hover },
                { id: 'port3', shape: 'Square', offset: { x: 0.5, y: 1 }, visibility: PortVisibility.Hover },
                { id: 'port4', shape: 'Square', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hover }]
            },
            { id: 'group', children: ['node1', 'node2'] }
            ];

            diagram = new Diagram({
                width: 1000, height: 600,
                nodes: nodes,
                layers: [{ id: 'layer1', visible: true, objects: ['node1', 'node2', 'group'] }]
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('hide/show layer on nodes ports', (done: Function) => {
            diagram.setActiveLayer('layer1');
            diagram.commandHandler.getLayer('layer1').visible = false;
            diagram.commandHandler.getLayer('layer1').visible = true;
            expect(diagram.nodes[0].ports[0].visibility === PortVisibility.Hover).toBe(true);
            diagram.dataBind();
            done();
        });
    });

    describe('zIndex Issue with Layer', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [

                {
                    id: 'node1', height: 75, width: 75, offsetX: 100, offsetY: 100, annotations: [{ content: 'Layer1' }]
                },
                {
                    id: 'node2', height: 75, width: 75, offsetX: 400, offsetY: 100, annotations: [{ content: 'Layer1' }]
                },
                {
                    id: 'node3', height: 75, width: 75, offsetX: 150, offsetY: 150, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node4', height: 75, width: 75, offsetX: 450, offsetY: 150, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node5', height: 75, width: 75, offsetX: 100, offsetY: 300, annotations: [{ content: 'Layer3' }]
                },
                {
                    id: 'node6', height: 75, width: 75, offsetX: 400, offsetY: 300, annotations: [{ content: 'Layer3' }]
                },
                {
                    id: 'node7', height: 75, width: 75, offsetX: 150, offsetY: 350, annotations: [{ content: 'Layer4' }]
                },
                {
                    id: 'node8', height: 75, width: 75, offsetX: 450, offsetY: 350, annotations: [{ content: 'Layer4' }]
                },
                {
                    id: 'node9', height: 75, width: 75, offsetX: 600, offsetY: 100, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node10', height: 75, width: 75, offsetX: 800, offsetY: 300, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node11', height: 75, width: 75, offsetX: 650, offsetY: 150, annotations: [{ content: 'Layer3' }]
                },
                {
                    id: 'node12', height: 75, width: 75, offsetX: 850, offsetY: 350, annotations: [{ content: 'Layer3' }]
                },

            ];
            let layers: LayerModel[] = [
                {
                    id: 'default_layer',
                    visible: true,
                    objects: ['node1', 'node2'],
                    lock: false,
                    zIndex: 1
                },
                {
                    id: 'Layer2',
                    visible: true,
                    objects: ['node3', 'node4', 'node9', 'node10'],
                    lock: false,
                    zIndex: 0
                },
                {
                    id: 'Layer3',
                    visible: true,
                    objects: ['node5', 'node6', 'node11', 'node12'],
                    lock: false,
                },
                {
                    id: 'Layer4',
                    visible: true,
                    objects: ['node7', 'node8'],
                    lock: false,
                }
            ];

            diagram = new Diagram({
                width: 1000, height: 600,
                nodes: nodes,
                layers: layers
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking zIndex of the layers', (done: Function) => {
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 1).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 0).toBe(true);
            done();
        });
        it('Checking object send forward', (done: Function) => {
            let node: NodeModel = diagram.getObject('node2');
            diagram.select([node]);
            diagram.moveForward();
            expect(node.zIndex === 1).toBe(true);
            done();
        });
        it('Checking the order commands', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            diagram.sendToBack();
            expect(diagram.selectedItems.nodes[0].id === (diagram.layers[1] as Layer).zIndexTable[0]).toBe(true);
            done();
            diagram.bringToFront();
            expect(diagram.selectedItems.nodes[0].id === (diagram.layers[1] as Layer).zIndexTable[2]).toBe(true);
            done();
        });
        it('Checking bringLayerForward Function', (done: Function) => {
            diagram.bringLayerForward('Layer2');
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 0).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 1).toBe(true);
            done();
        });
        it('Checking sendLayerBackward Function', (done: Function) => {
            diagram.sendLayerBackward('Layer2');
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 1).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 0).toBe(true);
            done();
        });
    });
    describe('Changing layer zindex in Canvas mode', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagramCanvas' });
            document.body.appendChild(ele);
            let nodes: NodeModel[] = [

                {
                    id: 'node1', height: 75, width: 75, offsetX: 100, offsetY: 100, annotations: [{ content: 'Layer1' }]
                },
                {
                    id: 'node2', height: 75, width: 75, offsetX: 400, offsetY: 100, annotations: [{ content: 'Layer1' }]
                },
                {
                    id: 'node3', height: 75, width: 75, offsetX: 150, offsetY: 150, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node4', height: 75, width: 75, offsetX: 450, offsetY: 150, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node5', height: 75, width: 75, offsetX: 100, offsetY: 300, annotations: [{ content: 'Layer3' }]
                },
                {
                    id: 'node6', height: 75, width: 75, offsetX: 400, offsetY: 300, annotations: [{ content: 'Layer3' }]
                },
                {
                    id: 'node7', height: 75, width: 75, offsetX: 150, offsetY: 350, annotations: [{ content: 'Layer4' }]
                },
                {
                    id: 'node8', height: 75, width: 75, offsetX: 450, offsetY: 350, annotations: [{ content: 'Layer4' }]
                },
                {
                    id: 'node9', height: 75, width: 75, offsetX: 600, offsetY: 100, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node10', height: 75, width: 75, offsetX: 800, offsetY: 300, annotations: [{ content: 'Layer2' }]
                },
                {
                    id: 'node11', height: 75, width: 75, offsetX: 650, offsetY: 150, annotations: [{ content: 'Layer3' }]
                },
                {
                    id: 'node12', height: 75, width: 75, offsetX: 850, offsetY: 350, annotations: [{ content: 'Layer3' }]
                },

            ];
            let layers: LayerModel[] = [
                {
                    id: 'default_layer',
                    visible: true,
                    objects: ['node1', 'node2'],
                    lock: false,
                    zIndex: 1
                },
                {
                    id: 'Layer2',
                    visible: true,
                    objects: ['node3', 'node4', 'node9', 'node10'],
                    lock: false,
                    zIndex: 0
                },
                {
                    id: 'Layer3',
                    visible: true,
                    objects: ['node5', 'node6', 'node11', 'node12'],
                    lock: false,
                },
                {
                    id: 'Layer4',
                    visible: true,
                    objects: ['node7', 'node8'],
                    lock: false,
                }
            ];

            diagram = new Diagram({
                width: 1000, height: 600,
                nodes: nodes,
                layers: layers,
                mode:'Canvas'
            });
            diagram.appendTo('#diagramCanvas');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking zIndex of the layers', (done: Function) => {
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 1).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 0).toBe(true);
            done();
        });
        it('Checking object send forward', (done: Function) => {
            let node: NodeModel = diagram.getObject('node2');
            diagram.select([node]);
            diagram.moveForward();
            expect(node.zIndex === 1).toBe(true);
            done();
        });
        it('Checking the order commands', (done: Function) => {
            diagram.select([diagram.nodes[0]]);
            diagram.sendToBack();
            expect(diagram.selectedItems.nodes[0].id === (diagram.layers[1] as Layer).zIndexTable[0]).toBe(true);
            done();
            diagram.bringToFront();
            expect(diagram.selectedItems.nodes[0].id === (diagram.layers[1] as Layer).zIndexTable[2]).toBe(true);
            done();
        });
        it('Checking bringLayerForward Function', (done: Function) => {
            diagram.bringLayerForward('Layer2');
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 0).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 1).toBe(true);
            done();
        });
        it('Checking sendLayerBackward Function', (done: Function) => {
            diagram.sendLayerBackward('Layer2');
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 1).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 0).toBe(true);
            done();
        });
    });
    describe('multiplelayer canvas', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            diagram = new Diagram({
                width: '100%', height: '700px', nodes: [],
                created: created,
            });
            diagram.appendTo('#diagram');

        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('layer - checking the node zindex ', (done: Function) => {
            let coll = document.getElementById("diagram_htmlLayer_div").childNodes;
            expect((coll[0] as HTMLElement).id === "dsnode1_html_element" &&
                (coll[1] as HTMLElement).id === "addButtonId_html_element").toBe(true);
            done();
        });
    });

    describe('zIndex Issue with Layer', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: 1000, height: 600,
            });
            diagram.appendTo('#diagram');
            diagram.addLayer({ id: 'Layer2' });
            diagram.addLayer({ id: 'Layer3' });
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking zIndex of the objects', (done: Function) => {
            let node: NodeModel = { id: 'Layer11', height: 100, width: 100, offsetX: 100, offsetY: 100 };
            diagram.setActiveLayer('default_layer');
            diagram.add(node);
            let node4: NodeModel = { id: 'Layer12', height: 100, width: 100, offsetX: 150, offsetY: 150 };
            diagram.setActiveLayer('default_layer');
            let node2: NodeModel = { id: 'Layer21', height: 100, width: 100, offsetX: 200, offsetY: 200 };
            diagram.setActiveLayer('Layer2');
            diagram.add(node2);
            let node3: NodeModel = { id: 'Layer31', height: 100, width: 100, offsetX: 250, offsetY: 250 };
            diagram.setActiveLayer('Layer3');
            diagram.add(node3);
            let node5: NodeModel = { id: 'Layer22', height: 100, width: 100, offsetX: 300, offsetY: 300 };
            diagram.setActiveLayer('default_layer');
            diagram.add(node4);
            diagram.select([diagram.nodes[3]]);
            expect(diagram.commandHandler.getLayer('default_layer').zIndex === 0).toBe(true);
            expect(diagram.commandHandler.getLayer('Layer2').zIndex === 1).toBe(true);
            expect(diagram.selectedItems.nodes[0].id === (diagram.layers[0] as Layer).zIndexTable[1]).toBe(true);
            done();
        });

    });

    describe('multiple layer - Hidden layer is visible', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);

            diagram = new Diagram({
                width: '100%',
                height: '600px',
                layers: [
                    {
                        id: "L1",
                        objects: ["N1", "N2"],
                        visible: false
                    },
                    {
                        id: "L2",
                        objects: ["N3", "N4"],
                        visible: true
                    },
                ],
                nodes: [
                {
                    id: "N1",
                    offsetX: 100,
                    offsetY: 100,
                    width: 200,
                    height: 200,
                    shape: {
                        type: "Basic",
                        shape: "Ellipse",
                    },
                },

                {
                    id: "N2",
                    offsetX: 400,
                    offsetY: 100,
                    width: 200,
                    height: 200,
                    shape: {
                        type: "Basic",
                        shape: "Ellipse",
                    },
                },

                {
                    id: "N3",
                    offsetX: 100,
                    offsetY: 400,
                    width: 200,
                    height: 200,
                    shape: {
                        type: "Basic",
                        shape: "Ellipse",
                    },
                },

                {
                    id: "N4",
                    offsetX: 400,
                    offsetY: 400,
                    width: 200,
                    height: 200,
                    shape: {
                        type: "Basic",
                        shape: "Ellipse",
                    },
                }
            ],
            });
            diagram.appendTo('#diagram');
        });

        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Node fill color change in hidden layer - checking the node element is render or not ', (done: Function) => {
            let node = diagram.nodes.find(i => i.id == "N1");
            node.style.fill = node.style.fill == "red" ? "white" : "red";
            diagram.dataBind();
            let ele = document.getElementById("N1_groupElement");
            console.log("ele"+ele);
            expect(ele === null).toBe(true);
            done();
        });

        it('Change the layer visibility from visible false to true', (done: Function) => {
            let layer = diagram.layers.find(i => i.id == "L1");
            layer.visible = !layer.visible;
            diagram.dataBind();
            let ele = document.getElementById("N1_groupElement");
            console.log("ele"+ele);
            expect(ele !== null).toBe(true);
            done();
        });

        it('Change the layer visibility from visible true to false', (done: Function) => {
            let layer = diagram.layers.find(i => i.id == "L1");
            layer.visible = !layer.visible;
            diagram.dataBind();
            let visible = document.getElementById("N1").getAttribute('visibility')
            console.log("visible"+visible);
            expect(visible === "hidden").toBe(true);
            done();
        });
    });
});    

describe('ZIndex value chnaged after calling refresh method', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let zIndexBeforeCall: number;
    let zIndexAfterCall : number;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram_div' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [
            {
                id: "rectangle1",
                offsetX: 100,
                offsetY: 100,
                width: 100,
                height: 100,
                annotations: [{
                    content: 'rectangle1'
                }]
            }, {
                id: "rectangle2",
                offsetX: 200,
                offsetY: 200,
                width: 100,
                height: 100,
                annotations: [{
                    content: 'rectangle2'
                }]
            },
            {
                id: 'group',
                children: ['rectangle1', 'rectangle2']
            },
            {
                id: "rectangle3",
                offsetX: 200,
                offsetY: 200,
                width: 100,
                height: 100,
                annotations: [{
                    content: 'rectangle2'
                }]
            }
        
        ];
        let connectors: ConnectorModel[] = [
            {
                id:'connector',
                sourcePoint: {
                x: 100,
                y: 100
              },
              targetPoint: {
                x: 350,
                y: 350
              },
            }
          ]
        
        diagram = new Diagram({
            width: '1500px',
            height: '600px',
            nodes: nodes, connectors: connectors
        });
        diagram.appendTo("#diagram_div");
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Exception occurs when sendToBack method is called', (done: Function) => {
       
        diagram.select([diagram.connectors[0]]);
        diagram.sendToBack();
        zIndexBeforeCall = diagram.connectors[0].zIndex;
        console.log(diagram.connectors[0].zIndex);
        diagram.refresh();
        console.log(diagram.connectors[0].zIndex);
        zIndexAfterCall = diagram.connectors[0].zIndex;
        expect(zIndexBeforeCall === zIndexAfterCall).toBe(true);
        done();
    });
});

describe('Diagram-Layers - sendToBack Not functioning correctly for single node Layer', function()
  {
    let diagram:Diagram;
    let ele:HTMLElement;

    beforeAll((): void => {
      const isDef = (o: any) => o !== undefined && o !== null;
      if (!isDef(window.performance)) {
          console.log("Unsupported environment, window.performance.memory is unavailable");
          this.skip(); //Skips test (in Chai)
          return;
      }
      ele = createElement('div', { id: 'diagram' });
      document.body.appendChild(ele);
      let nodes: NodeModel[] = [{
        id: 'node1',
        width: 100,
        height: 100,
        offsetX: 100,
        offsetY: 100,
        shape: {
          type: 'Basic',
          shape:'Ellipse',
      },
        annotations: [{
            content: 'Layer 1 - node 1'
        }]
    },
    {
        id: 'node2',
        width: 100,
        height: 100,
        offsetX: 150,
        offsetY: 150,
        style:{
          color: 'red'
        },
        shape: {
            type: 'Bpmn',
            shape:'Event',
            event: {
              event: 'End',
              trigger: 'None'
          }
        },
        annotations: [{
            content: 'Layer 2 - node2'
        }]
    },
    {
      id: 'node3',
      width: 100,
      height: 100,
      offsetX: 300,
      offsetY: 150,
      shape: {
          type: 'Basic',
          shape:'Triangle',
      },
      annotations: [{
          content: 'Layer 2 -node 3'
      }]
  }
    ];
    let layers:LayerModel[]=[{
        id: 'layer1',
        visible: true,
        objects: ['node1']
    },{
      id: 'layer2',
      visible: true,
      objects: ['node2', 'node3']
  }];
    // initialize diagram component
    diagram = new Diagram({
    width: '100%',
    height: '600px',
    nodes: nodes,
    layers: layers
    });
    // render initialized diagram
    diagram.appendTo('#diagram');
  });

  afterAll((): void => {
      diagram.destroy();
      ele.remove();
  });

  it('sendToBack Command for a single node in a layer',(done: Function)=>
  {
    diagram.select([diagram.nodes[0]]);
    expect(diagram.nodes[0].zIndex).toBe(0)
    diagram.layerZIndexTable
    diagram.sendToBack();
    expect(diagram.nodes[0].zIndex).toBe(0)
    done();
  });
  
  it('sendToBack Command for a Multiple node in a layer',(done: Function)=>
  {
    diagram.select([diagram.nodes[2]]);
    expect(diagram.nodes[1].zIndex).toBe(0)
    expect(diagram.nodes[2].zIndex).toBe(1)
    diagram.layerZIndexTable
    diagram.sendToBack();
    expect(diagram.nodes[2].zIndex).toBe(-1)
    expect(diagram.nodes[1].zIndex).toBe(0)
    done();
  });

  it('BringToFront Command for a single node in a layer',(done: Function)=>
  {
    diagram.select([diagram.nodes[0]]);
    expect(diagram.nodes[0].zIndex).toBe(0)
    diagram.layerZIndexTable
    diagram.bringToFront();
    expect(diagram.nodes[0].zIndex).toBe(0)
    done();
  });
  
  it('BringToFront Command for a Multiple node in a layer',(done: Function)=>
  {
    diagram.select([diagram.nodes[2]]);
    expect(diagram.nodes[1].zIndex).toBe(0)
    expect(diagram.nodes[2].zIndex).toBe(-1)
    diagram.layerZIndexTable
    diagram.bringToFront();
    expect(diagram.nodes[2].zIndex).toBe(1)
    expect(diagram.nodes[1].zIndex).toBe(0)
    done();
  });
  it('bringLayerForward Command for a single node in a layer',(done: Function)=>
  {
    let selectedDiagram=diagram.layers[0];
    expect(selectedDiagram.zIndex).toBe(0);
    let diagramLayer=diagram.layers[0].id;
    diagram.layerZIndexTable;
    diagram.bringLayerForward(diagramLayer);
    expect(selectedDiagram.zIndex).toBe(1)
    done();
  });
  
  it('bringLayerForward Command for a Multiple node in a layer',(done: Function)=>
  {
    let selectedDiagram=diagram.layers[1];
    expect(selectedDiagram.zIndex).toBe(0);
    let diagramLayer=diagram.layers[1].id;
    diagram.layerZIndexTable;
    diagram.bringLayerForward(diagramLayer);
    expect(selectedDiagram.zIndex).toBe(1);
    done();
  });

  it('sendLayerBackward Command for a Multiple node in a layer',(done: Function)=>
  {
    let selectedDiagram=diagram.layers[1];
    expect(selectedDiagram.zIndex).toBe(1);
    let diagramLayer=diagram.layers[1].id;
    diagram.layerZIndexTable;
    diagram.sendLayerBackward(diagramLayer);
    expect(selectedDiagram.zIndex).toBe(0);
    done();
  });
  it('sendLayerBackward Command for a Single node in a layer',(done: Function)=>
  {
    let selectedDiagram=diagram.layers[0];
    expect(selectedDiagram.zIndex).toBe(1);
    let diagramLayer=diagram.layers[0].id;
    diagram.layerZIndexTable;
    diagram.sendLayerBackward(diagramLayer);
    expect(selectedDiagram.zIndex).toBe(0);
    done();
  });

});

describe('872106: Layer object in diagram doesnot removed in clear method', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram_Layers' });
        document.body.appendChild(ele);
        let nodes: NodeModel[] = [

            {
                id: 'node1', height: 75, width: 75, offsetX: 100, offsetY: 100, annotations: [{ content: 'Layer1' }]
            },
            {
                id: 'node2', height: 75, width: 75, offsetX: 400, offsetY: 100, annotations: [{ content: 'Layer2' }]
            },
            {
                id: 'node3', height: 75, width: 75, offsetX: 150, offsetY: 150, annotations: [{ content: 'Layer3' }]
            },
            {
                id: 'node4', height: 75, width: 75, offsetX: 450, offsetY: 150, annotations: [{ content: 'Layer4' }]
            },
           
        ];
        let layers: LayerModel[] = [
            {
                id: 'Layer1',
                visible: true,
                objects: ['node1'],
                lock: false,
                zIndex: 0
            },
            {
                id: 'Layer2',
                visible: true,
                objects: ['node2'],
                lock: false,
                zIndex: 1
            },
            {
                id: 'Layer3',
                visible: true,
                objects: ['node3'],
                lock: false,
            },
            {
                id: 'Layer4',
                visible: true,
                objects: ['node4'],
                lock: false,
            }
        ];
        
        diagram = new Diagram({
            width: '1000px', height: '600px',
            nodes: nodes,
            layers: layers,
        });
        diagram.appendTo("#diagram_Layers");
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Checking layer length after clearing diagram', (done: Function) => {
        let prevLayerCount = diagram.layers.length;
        diagram.clear();
        let currLayerCount = diagram.layers.length;
        expect(prevLayerCount === 4 && currLayerCount === 1).toBe(true);
        done();
    });
    it('Checking layer length after adding node dynamically', (done: Function) => {
        let node:NodeModel = {id:'newNode',offsetX:100,offsetY:300,width:100,height:50,style:{fill:'green'}};
        diagram.add(node);
        let currLayerCount = diagram.layers.length;
        let nodeCount = diagram.nodes.length;
        expect(currLayerCount === 1 && nodeCount === 1).toBe(true);
        done();
    });
});

describe('875087: Connector disappears when moved to another layer with Node connected', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram_Layers_Con' });
        document.body.appendChild(ele);
        let connector: ConnectorModel = {
            id: 'connector1', sourceID:'node1',targetID:'node2',annotations: [ {content: 'Connector'}],type:'Orthogonal'
        };
        let node: NodeModel = {
            id: 'node1', width: 150, height: 100, offsetX: 100, offsetY: 100, annotations: [ { content: 'Node1'}]
        };
        let node2: NodeModel = {
            id: 'node2', width: 80, height: 130, offsetX: 400, offsetY: 200, annotations: [ { content: 'Node2'}]
        };
        let node3: NodeModel = {
            id: 'node3', width: 50, height: 50, offsetX: 600, offsetY: 200, annotations: [ { content: 'Node3'}]
        };
        let node4: NodeModel = {
            id: 'node4', width: 50, height: 50, offsetX: 700, offsetY: 200, annotations: [ { content: 'Node4'}]
        };
        let group: NodeModel = {
            id: 'group',children:['node3','node4'],padding:{left:10,right:10,top:10,bottom:10},style:{strokeColor:'black'}
        };

        diagram = new Diagram({
            width: '1000px', height: '600px',
            nodes: [node, node2,node3,node4,group], connectors: [connector],
        });
        diagram.appendTo("#diagram_Layers_Con");
    });
    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });
    it('Add node to new layer', (done: Function) => {
        let layer: any = {
            id: 'layer1',
            visible: false,
            objects: ['node13'],
            lock: false,
          };

          diagram.addLayer(layer);
          let node = {
            id: 'node13',
            height: 75,
            width: 75,
            offsetX: 250,
            offsetY: 350,
            annotations: [{ content: 'Node on Layer1' }],
          };
          diagram.add(node);
        expect(diagram.nodes.length === 6).toBe(true);
        done();
    });
    it('Move connected node to new layer', (done: Function) => {
        diagram.moveObjects(['node1', 'connector1'], 'layer1');
        expect(diagram.connectors.length === 1 && diagram.connectors[0].sourceID === 'node1').toBe(true);
        done();
    });
    it('Move group node to new layer', (done: Function) => {
        diagram.moveObjects(['group'], 'layer1');
        let group = diagram.nameTable['group'];
        expect(diagram.nodes.length === 6 && group.children.length === 2).toBe(true);
        done();
    });
});