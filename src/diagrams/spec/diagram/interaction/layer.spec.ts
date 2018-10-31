import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, BasicShapeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { Layer } from '../../../src/diagram/diagram/layer';
import { PortVisibility } from '../../../src/diagram/enum/enum';
import { LayerModel } from '../../../src/diagram/diagram/layer-model';
import { MouseEvents } from './mouseevents.spec';

/**
 * layer spec
 */
describe('Diagram Control', () => {

    describe('multiplelayer canvas', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
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
    });


    describe('group issue with layer', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        let selArray: any = [];

        beforeAll((): void => {
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


});    