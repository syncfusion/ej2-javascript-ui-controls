/**
 * FlowChart
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel, FlowShapeModel } from '../../../src/diagram/objects/node-model';
import { ConnectorModel } from '../../../src/diagram/objects/connector-model';
import { ShapeAnnotationModel } from '../../../src/diagram/objects/annotation-model';
import { Shapes, FlowShapes, Segments } from '../../../src/diagram/enum/enum';
import { ShapeStyleModel, TextStyleModel } from '../../../src/diagram/core/appearance-model';

describe('Diagram Control', () => {

    describe('Default Sample - FlowShapes', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            ele = createElement('div', { id: 'diagram95' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'NewIdea', width: 150, height: 60, offsetX: 300, offsetY: 60,
                shape: { type: 'Flow', shape: 'Terminator' } as FlowShapeModel
            };

            let node2: NodeModel = {
                id: 'Meeting', width: 150, height: 60, offsetX: 300, offsetY: 155,
                shape: { type: 'Flow', shape: 'Process' } as FlowShapeModel
            };
            let node3: NodeModel = {
                id: 'BoardDecision', width: 150, height: 110, offsetX: 300, offsetY: 280,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node4: NodeModel = {
                id: 'Project', width: 150, height: 100, offsetX: 300, offsetY: 430,
                shape: { type: 'Flow', shape: 'Decision' } as FlowShapeModel
            };
            let node5: NodeModel = {
                id: 'End', width: 150, height: 60, offsetX: 300, offsetY: 555,
                shape: { type: 'Flow', shape: 'Process' } as FlowShapeModel
            };
            let node6: NodeModel = {
                id: 'Decision', width: 250, height: 60, offsetX: 550, offsetY: 60,
                shape: { type: 'Flow', shape: 'Card' } as FlowShapeModel
            };
            let node7: NodeModel = {
                id: 'Reject', width: 150, height: 60, offsetX: 550, offsetY: 285,
                shape: { type: 'Flow', shape: 'Process' } as FlowShapeModel
            };
            let node8: NodeModel = {
                id: 'Resources', width: 150, height: 60, offsetX: 550, offsetY: 430,
                shape: { type: 'Flow', shape: 'Process' } as FlowShapeModel
            };

            let connector1: ConnectorModel = {
                id: 'connector1', type: 'Straight', sourceID: 'NewIdea', targetID: 'Meeting'
            };
            let connector2: ConnectorModel = {
                id: 'connector2', type: 'Straight', sourceID: 'Meeting', targetID: 'BoardDecision'
            };
            let connector3: ConnectorModel = {
                id: 'connector3', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Project'
            };
            let connector4: ConnectorModel = {
                id: 'connector4', type: 'Straight', sourceID: 'Project', targetID: 'End'
            };
            let connector5: ConnectorModel = {
                id: 'connector5', type: 'Straight', sourceID: 'BoardDecision', targetID: 'Reject'
            };
            let connector6: ConnectorModel = {
                id: 'connector6', type: 'Straight', sourceID: 'Project', targetID: 'Resources'
            };
            diagram = new Diagram({
                mode: 'Canvas',
                width: 1000, height: 1000, nodes: [node1, node2, node3, node4, node5, node6, node7, node8],
                connectors: [connector1, connector2, connector3, connector4, connector5, connector6]
            });
            diagram.appendTo('#diagram95');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking flow diagram in svg mode', (done: Function) => {
            done();
        });
    });
});