/**
 * Diagram spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node,
    DataBinding, HierarchicalTree, NodeModel, Rect, TreeInfo
} from '../../../src/diagram/index';
Diagram.Inject(DataBinding, HierarchicalTree);

import { DataManager, Query } from '@syncfusion/ej2-data';
/**
 * Organizational Chart
 */


let data: object[] = [
    { id: 1, Label: 'StackPanel' },
    { id: 2, Label: 'Label', parentId: 1 },
    { id: 3, Label: 'ListBox', parentId: 1 },
    { id: 4, Label: 'StackPanel', parentId: 1 },
    { id: 5, Label: 'Border', parentId: 2 },
    { id: 6, Label: 'Border', parentId: 3 },
    { id: 7, Label: 'Button', parentId: 4 },
    { id: 8, Label: 'ContentPresenter', parentId: 5 },
    { id: 9, Label: 'Text Block', parentId: 8 },
    { id: 10, Label: 'ScrollViewer', parentId: 6 },
    { id: 11, Label: 'Grid', parentId: 10 },
    { id: 12, Label: 'Rectangle', parentId: 11 },
    { id: 13, Label: 'ScrollContentPresenter', parentId: 11 },
    { id: 14, Label: 'ScrollBar', parentId: 11 },
    { id: 15, Label: 'ScrollBar' },
    { id: 16, Label: 'ItemsPresenter', parentId: 13 },
    { id: 17, Label: 'AdornerLayer', parentId: 13 },
    { id: 18, Label: 'VirtualizingStackPanel', parentId: 15 },
    { id: 19, Label: 'ListBoxItem', parentId: 18 },
    { id: 20, Label: 'ListBoxItem', parentId: 18 },
    { id: 21, Label: 'Border', parentId: 19 },
    { id: 22, Label: 'ContentPresenter', parentId: 19 },
    { id: 23, Label: 'TextBlock', parentId: 19 },
    { id: 24, Label: 'Border', parentId: 20 },
    { id: 25, Label: 'ContentPresenter', parentId: 20 },
    { id: 26, Label: 'TextBlock', parentId: 20 },
    { id: 27, Label: 'ButtonChrome', parentId: 7 },
    { id: 28, Label: 'ContentPresenter', parentId: 27 },
    { id: 29, Label: 'TextBlock', parentId: 28 }
];




describe('Diagram Control', () => {
    describe('Tree Layout', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll(() => {
            ele = createElement('div', { id: 'diagram' });
            document.body.appendChild(ele);
            let items = new DataManager(data, new Query().take(7));
            diagram = new Diagram({
                width: '1200px', height: '580px',
                snapSettings: { constraints: 0 },
                layout: {
                    type: 'OrganizationalChart', root: '15'
                },
                dataSourceSettings: {
                    id: 'id', parentId: 'parentId', dataManager: items
                },
                getNodeDefaults: (node: NodeModel, diagram: Diagram) => {
                    let obj: NodeModel = {};
                    obj.width = 150;
                    obj.height = 50;
                    obj.style = { fill: node.data['color'] };
                    obj.annotations = [{ content: node.data['Role'], style: { color: 'white' } }];
                    return obj;
                }, getConnectorDefaults: (obj: ConnectorModel, diagram: Diagram) => {
                    let connector: ConnectorModel = {};
                    connector.targetDecorator = { shape: 'None' };
                    connector.type = 'Orthogonal';
                    return connector;
                },
            });
            diagram.appendTo('#diagram');
        });
        afterAll(() => {
            diagram.destroy();
            ele.remove();
        });
        it('Checking root node of the layout', (done: Function) => {
            diagram.layout.type = 'OrganizationalChart';
            diagram.layout.getLayoutInfo = (node: NodeModel, options: TreeInfo) => {
                if (!options.hasSubTree) {
                    options.type = 'Left';
                    options.orientation = 'Vertical';
                    options.offset = -20;
                }
            };

            diagram.dataBind();
            let bounds: Rect = diagram.spatialSearch.getPageBounds();
            expect(bounds.x == -75 && bounds.y == -45 && bounds.width == 868 && bounds.height == 500).toBe(true);
            expect(diagram.nodes[0].offsetX == 0 && diagram.nodes[0].offsetY == 0).toBe(true);
            done();
        });
    });
});