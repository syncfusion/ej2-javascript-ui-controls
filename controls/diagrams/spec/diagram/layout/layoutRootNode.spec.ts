/**
 * Diagram spec document - Updated with memory leak fixes
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import {
    ConnectorModel, Node,
    DataBinding, HierarchicalTree, NodeModel, Rect, TreeInfo,
    ComplexHierarchicalTree,
    PointModel,
    ChildArrangement,
    PathElement,
    LineDistribution,
    ConnectionPointOrigin,
    DiagramConstraints,
    TextModel,
} from '../../../src/diagram/index';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';

Diagram.Inject(DataBinding, HierarchicalTree, ComplexHierarchicalTree, LineDistribution);

import { DataManager, Query } from '@syncfusion/ej2-data';
import { MouseEvents } from '../interaction/mouseevents.spec';

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
                    id: 'id', parentId: 'parentId', dataSource: items
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
            // Proper cleanup to prevent memory leaks
            if (diagram) {
                diagram.destroy();
            }
            if (ele && ele.parentNode) {
                ele.parentNode.removeChild(ele);
            }
            // Clear references
            diagram = null;
            ele = null;
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

        // it('memory leak', () => {
        //     profile.sample();
        //     let average: any = inMB(profile.averageChange)
        //     //Check average change in memory samples to not be over 10MB
        //     expect(average).toBeLessThan(10);
        //     let memory: any = inMB(getMemoryProfile())
        //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // })
    });
});

xdescribe('Optimize the routing segment distance while using enableRouting in layout.', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    beforeAll(() => {
        let localdata = [
            {
                Name: '3489086',
                label: 'Grand Rapids Mezzanine Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 1,
                isKayne: true,
                childRatios: null,
                einNumber: '83-1641993',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '12490485',
                label: 'Saperean Capital WB-III Note Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 2,
                isKayne: true,
                childRatios: null,
                einNumber: '85-1356780',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '11027940',
                label: 'Saperean Largo Mezz, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 3,
                isKayne: true,
                childRatios: null,
                einNumber: '84-3271353',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '11899141',
                label: 'Saperean Capital III WB Note Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 4,
                isKayne: true,
                childRatios: null,
                einNumber: '84-4158889',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '15122967',
                label: 'Saperean Capital CN-III Note Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 5,
                isKayne: true,
                childRatios: null,
                einNumber: '86-3333578',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '3488839',
                label: 'Saperean Capital III Note Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 6,
                isKayne: true,
                childRatios: null,
                einNumber: '82-3202932',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '17057841',
                label: 'Multifamily Credit Income Fund-Kayne Anderson I, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 7,
                isKayne: true,
                childRatios: null,
                einNumber: '81-4441748',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['17143102', '17358209', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 6,
                isFiltering: false,
                ParentComp: ['17143102', '17358209'],
            },
            {
                Name: '17143101',
                label: 'KCRED ASC-REIT, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 8,
                isKayne: true,
                childRatios: null,
                einNumber: '88-4046526',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Manager',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['17143099', '17143100', '19447263'],
                isRootParent: false,
                hasChildGroup: false,
                level: 3,
                isFiltering: false,
                ParentComp: ['17143099'],
            },
            {
                Name: '13017566',
                label: 'Saperean Capital CN-II Note Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 9,
                isKayne: true,
                childRatios: null,
                einNumber: '85-4227950',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '17143103',
                label: 'KCRED M-REIT, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 10,
                isKayne: true,
                childRatios: null,
                einNumber: '88-4046330',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Manager',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['17143099', '17143100', '19447263'],
                isRootParent: false,
                hasChildGroup: false,
                level: 3,
                isFiltering: false,
                ParentComp: ['17143099'],
            },
            {
                Name: '12834712',
                label: 'Saperean Capital CN-I Note Lender, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 11,
                isKayne: true,
                childRatios: null,
                einNumber: '85-3052852',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '12420129',
                label: 'Saperean Capital II Originator, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 12,
                isKayne: true,
                childRatios: null,
                einNumber: '85-1204334',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19248976', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['19248976'],
            },
            {
                Name: '19248986',
                label: 'KCRED CMBS, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 13,
                isKayne: true,
                childRatios: null,
                einNumber: null,
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Manager',
                isCheckForParent: false,
                relatedChildren: [],
                relatedParents: ['19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 4,
                isFiltering: false,
                ParentComp: ['19246892'],
            },
            {
                Name: '19246892',
                label: 'KCRED Holdings, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 14,
                isKayne: true,
                childRatios: {
                    '17143102': 1,
                    '19248976': 1,
                    '19248986': 1,
                },
                einNumber: null as any,
                isHidden: false,
                taxLegendShape: 'Triangle',
                memberManager: 'Manager',
                isCheckForParent: false,
                relatedChildren: [
                    '17143102',
                    '19248976',
                    '19248986',
                    '17057841',
                    '17358209',
                    '3489086',
                    '11027940',
                    '11899141',
                    '12420129',
                    '12490485',
                    '12834712',
                    '3488839',
                    '13017566',
                    '15122967',
                ],
                relatedParents: ['17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 3,
                isFiltering: false,
                ParentComp: ['17143100', '19246891'],
            },
            {
                Name: '17358209',
                label: 'KCRED Securities KJ Manager, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 15,
                isKayne: true,
                childRatios: {
                    '17057841': 0,
                },
                einNumber: '92-1054427',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Manager',
                isCheckForParent: false,
                relatedChildren: ['17057841'],
                relatedParents: ['17143102', '19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 5,
                isFiltering: false,
                ParentComp: ['17143102'],
            },
            {
                Name: '19248976',
                label: 'KCRED Acquired Originations, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 16,
                isKayne: true,
                childRatios: {
                    '3488839': 0,
                    '3489086': 0,
                    '11027940': 0,
                    '11899141': 0,
                    '12420129': 0,
                    '12490485': 0,
                    '12834712': 0,
                    '13017566': 0,
                    '15122967': 0,
                },
                einNumber: null as any,
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: [
                    '3488839',
                    '3489086',
                    '11027940',
                    '11899141',
                    '12420129',
                    '12490485',
                    '12834712',
                    '13017566',
                    '15122967',
                ],
                relatedParents: ['19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 4,
                isFiltering: false,
                ParentComp: ['19246892'],
            },
            {
                Name: '17143102',
                label: 'KCRED Securities, LLC a Delaware Limited Liability Corporation',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 17,
                isKayne: true,
                childRatios: {
                    '17057841': 1,
                    '17358209': 1,
                },
                einNumber: '88-4067090',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Member',
                isCheckForParent: false,
                relatedChildren: ['17057841', '17358209'],
                relatedParents: ['19246892', '17143100', '19246891'],
                isRootParent: false,
                hasChildGroup: false,
                level: 4,
                isFiltering: false,
                ParentComp: ['19246892'],
            },
            {
                Name: '17143099',
                label: 'Kayne Commercial Real Estate Debt, L.P. a Delaware Limited Partnership',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 18,
                isKayne: true,
                childRatios: {
                    '17143101': 1,
                    '17143103': 1,
                },
                einNumber: '88-3997688',
                isHidden: false,
                taxLegendShape: 'Square',
                memberManager: 'Manager',
                isCheckForParent: false,
                relatedChildren: ['17143101', '17143103'],
                relatedParents: ['17143100', '19447263'],
                isRootParent: false,
                hasChildGroup: false,
                level: 2,
                isFiltering: false,
                ParentComp: ['17143100', '19447263'],
            },
            {
                Name: '17143100',
                label: 'Kayne Commercial Real Estate Debt Advisors, LLC a Delaware Limited Partnership',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 19,
                isKayne: true,
                childRatios: {
                    '17143099': 0,
                    '19246891': 0,
                    '19246892': 0,
                },
                einNumber: '88-3997688',
                isHidden: false,
                taxLegendShape: null as any,
                memberManager: 'GP',
                isCheckForParent: true,
                relatedChildren: [
                    '17143099',
                    '19246891',
                    '19246892',
                    '17143101',
                    '17143103',
                    '17143102',
                    '19248976',
                    '19248986',
                    '17057841',
                    '17358209',
                    '3489086',
                    '11027940',
                    '11899141',
                    '12420129',
                    '12490485',
                    '12834712',
                    '3488839',
                    '13017566',
                    '15122967',
                ],
                relatedParents: [] as any[],
                isRootParent: true,
                hasChildGroup: false,
                level: 1,
                isFiltering: false,
                ParentComp: ['17143100_root'],
                hasSubCompany: true,
            },
            {
                Name: '19447263',
                label: 'Investors KCRED a Delaware Limited Partnership',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 19,
                isKayne: true,
                childRatios: {
                    '17143099': 1,
                },
                einNumber: '88-3997688',
                isHidden: false,
                taxLegendShape: null as any,
                memberManager: 'LP',
                isCheckForParent: true,
                relatedChildren: ['17143099', '17143101', '17143103'],
                relatedParents: [] as any[],
                isRootParent: true,
                hasChildGroup: false,
                level: 1,
                isFiltering: false,
                ParentComp: ['17143100_root'],
                isSubCompany: true,
            },
            {
                Name: '19246891',
                label: 'KCRED Non-REIT Holdings, L.P.',
                fillColor: '#EDF4FD',
                border: '#489911',
                order: 20,
                isKayne: true,
                childRatios: {
                    '19246892': 0,
                },
                einNumber: null as any,
                isHidden: false,
                taxLegendShape: 'Triangle',
                memberManager: '',
                isCheckForParent: false,
                relatedChildren: [
                    '19246892',
                    '17143102',
                    '19248976',
                    '19248986',
                    '17057841',
                    '17358209',
                    '3489086',
                    '11027940',
                    '11899141',
                    '12420129',
                    '12490485',
                    '12834712',
                    '3488839',
                    '13017566',
                    '15122967',
                ],
                relatedParents: ['17143100'],
                isRootParent: false,
                hasChildGroup: false,
                level: 2,
                isFiltering: false,
                ParentComp: ['17143100'],
            },
            {
                Name: 'main_root',
                label: '',
                fillColor: '#fff',
                border: '#fff',
                isHidden: true,
                level: 0,
            },
            {
                Name: '17143100_root',
                label: '',
                fillColor: '#fff',
                border: '#fff',
                isHidden: true,
                level: 0,
                ParentComp: ['main_root'],
            },
            {
                Name: '19447263_root',
                label: '',
                fillColor: '#fff',
                border: '#fff',
                isHidden: true,
                level: 0,
                ParentComp: ['main_root'],
            },
        ];

        let layout: Object = {
            type: 'ComplexHierarchicalTree',
            arrangement: ChildArrangement.Linear,
            horizontalSpacing: 50,
            verticalSpacing: 50,
            horizontalAlignment: 'Auto',
            verticalAlignment: 'Auto',
            orientation: 'TopToBottom',
            enableRouting: true,
        };

        ele = createElement('div', { id: 'diagramEnableRouting' });
        document.body.appendChild(ele);

        //Defines the default node and connector properties
        function nodeDefaults(obj: NodeModel): NodeModel {
            obj.width = 100;
            obj.height = 100;
            return obj;
        }

        function connDefaults(
            connector: ConnectorModel,
            diagram: Diagram
        ): ConnectorModel {
            connector.type = 'Orthogonal';
            connector.cornerRadius = 0;
            return connector;
        }

        diagram = new Diagram({
            width: "100%", height: 1000,
            layout: layout,
            getNodeDefaults: nodeDefaults,
            getConnectorDefaults: connDefaults,
            dataSourceSettings: {
                id: 'Name', parentId: 'ParentComp', dataSource: new DataManager(localdata)
            },
            rulerSettings: { showRulers: true },
            created: function () {
                diagram.fitToPage();
            }
        });
        diagram.appendTo('#diagramEnableRouting');
    });

    afterAll(() => {
        // Comprehensive cleanup
        if (diagram) {
            diagram.destroy();
        }
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
        // Clear all references
        diagram = null;
        ele = null;
    });

    function checkOverlap(diagram: Diagram) {
        let isInsideBounds;
        outerLoop:
        for (let i = 0; i < diagram.nodes.length; i++) {
            let bounds = diagram.nodes[i].wrapper.bounds;
            for (let j = 0; j < diagram.connectors.length; j++) {
                let connector = diagram.connectors[j];
                let connectorPoints;
                let segments = connector.segments;

                if (connector.type === 'Straight') {
                    let lineStart = diagram.connectors[0].sourcePoint;
                    let lineEnd = diagram.connectors[0].targetPoint;
                    connectorPoints = pointsAlongLine(lineStart, lineEnd);
                    isInsideBounds = pointInsideBounds(connectorPoints, bounds);
                } else {
                    for (let i = 0; i < connector.segments.length; i++) {
                        let points = (connector.segments[i] as any).points;
                        for (let j = 0; j < points.length; j++) {
                            let lineStart = points[j];
                            let lineEnd = points[j + 1];
                            if (lineEnd) {
                                let connectorPoints = pointsAlongLine(lineStart, lineEnd);
                                isInsideBounds = pointInsideBounds(connectorPoints, bounds);
                                if (isInsideBounds) {
                                    break outerLoop;
                                }
                            }
                        }
                    }
                }
            }
        }
        return isInsideBounds;
    }

    function pointsAlongLine(start: PointModel, end: PointModel, granularity = 1) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const stepX = (dx / length) * granularity;
        const stepY = (dy / length) * granularity;

        const points = [];
        for (let i = 0; i <= length; i += granularity) {
            points.push({ x: start.x + stepX * i, y: start.y + stepY * i });
        }

        return points;
    }

    function pointInsideBounds(points: PointModel[], bounds: Rect) {
        let padding = 10;
        for (const point of points) {
            if (
                bounds.right > point.x &&
                bounds.left < point.x &&
                bounds.top < point.y &&
                bounds.bottom > point.y
            ) {
                return true;
            }
        }
        return false;
    }

    it('Check-overlapping in layout', function (done) {
        let isOverlap = checkOverlap(diagram);
        expect(isOverlap).toBe(false);
        done();
    });

    it('Checking overlap without enableRouting', function (done) {
        diagram.layout.enableRouting = false;
        diagram.dataBind();
        let isOverlap = checkOverlap(diagram);
        expect(isOverlap).toBe(false);
        done();
    });

    it('Changing layout orientation', function (done) {
        diagram.layout.enableRouting = true;
        diagram.dataBind();
        diagram.layout.orientation = 'LeftToRight';
        diagram.dataBind();
        let isOverlap = checkOverlap(diagram);
        expect(isOverlap).toBe(false);
        done();
    });

    it('Checking overlap after expand and collapse', function (done) {
        diagram.nodes[0].isExpanded = false;
        diagram.dataBind();
        diagram.nodes[0].isExpanded = true;
        diagram.dataBind();
        let isOverlap = checkOverlap(diagram);
        expect(isOverlap).toBe(false);
        done();
    });

    it('Checking child to parent relationship by loading customer json', function (done) {
        let data = '{"width":"100%","height":"100%","nodes":[{"shape":{"type":"Bpmn","shape":"Event","event":{"event":"Start","trigger":"None"},"activity":{"subProcess":{}},"annotations":[]},"ports":[{"inEdges":[],"outEdges":["node0-node1"],"id":"ZpSGr_LineDistribution","offset":{"x":1,"y":0.5},"height":12,"width":12,"shape":"Square","margin":{"right":0,"bottom":0,"left":0,"top":0},"style":{"fill":"white","strokeColor":"black","opacity":1,"strokeDashArray":"","strokeWidth":1},"horizontalAlignment":"Center","verticalAlignment":"Center","visibility":8,"constraints":24}],"id":"node0","width":30,"height":30,"annotations":[{"id":"node0-label","content":"Start","horizontalAlignment":"Center","verticalAlignment":"Top","style":{"strokeWidth":0,"strokeColor":"transparent","fill":"transparent","fontFamily":"Noto Sans, Helvetica, Arial, sans-serif","fontSize":11,"textOverflow":"Wrap","textWrapping":"WrapWithOverflow","whiteSpace":"CollapseSpace","bold":false,"color":"black","italic":false,"opacity":1,"strokeDashArray":"","textAlign":"Center","textDecoration":"None"},"offset":{"x":0.5,"y":1},"margin":{"left":0,"top":2,"right":0,"bottom":0},"constraints":0,"annotationType":"String","hyperlink":{"link":"","content":"","textDecoration":"None","hyperlinkOpenState":"NewTab"},"visibility":true,"rotateAngle":0}],"offsetX":683.5,"offsetY":760,"style":{"fill":"#FFFFFF","strokeColor":"#62A716","strokeWidth":2,"strokeDashArray":"","opacity":1,"gradient":{"type":"None"}},"constraints":38795174,"addInfo":{"node":{"__type":"StartNode:http://www.kofax.com/agility/services/sdk","Process":{"__type":"ProcessSummary:http://www.kofax.com/agility/services/sdk","Identity":{"__type":"ProcessIdentity:http://www.kofax.com/agility/services/sdk","Id":"E642228B8AE947BD94820274135E2A65","Version":3,"Name":"bug"},"Name":null,"Version":0,"Id":null,"ProcessType":0,"ExpectedDuration":{"__type":"Duration:http://www.kofax.com/agility/services/sdk","Days":0,"Hours":0,"Minutes":0,"Seconds":0,"UseNegative":false,"Negative":false,"ShowSeconds":true,"DynamicVariable":null,"Milestone":null,"DurationType":0},"ExpectedCost":0,"Synchronous":false,"Category":{"__type":"CategoryIdentity:http://www.kofax.com/agility/services/sdk","Id":"201F370CA5164F76ADDD8EEEFF666AF7","Name":"Default Category"},"AssociatedCase":{"__type":"CaseIdentity:http://www.kofax.com/agility/services/sdk","CaseReference":"","CaseId":""},"LockedBy":{"__type":"ResourceIdentity:http://www.kofax.com/agility/services/sdk","Id":"32703B45D6B94973A8CE5F54EC14AC93","Name":"","ResourceType":0},"Description":null,"LatestVersion":true,"OwnerId":null,"SupportsSkinning":false,"Author":{"__type":"ResourceIdentity:http://www.kofax.com/agility/services/sdk","Id":"32703B45D6B94973A8CE5F54EC14AC93","Name":"ben.power","ResourceType":0},"ServerId":"DEE2D7A50241144F96D3E5D0A18D89A2","LastModified":{"__type":"ResourceIdentity:http://www.kofax.com/agility/services/sdk","Id":"32703B45D6B94973A8CE5F54EC14AC93","Name":"ben.power","ResourceType":0},"LastModifiedDate":{},"WorkQueueDefinition":{"__type":"WorkQueueDefinitionIdentity:http://www.kofax.com/agility/services/sdk","Id":"","Name":""},"CaptureEnabled":true,"HasDocumentContainer":false},"Identity":{"__type":"NodeIdentity:http://www.kofax.com/agility/services/sdk","Id":0,"Name":"Start","NodeType":5},"NodeType":5,"Origins":[],"Dependants":[],"Destinations":[{"Identity":{"__type":"NodeIdentity:http://www.kofax.com/agility/services/sdk","Id":1,"Name":"Image processing","NodeType":108},"EmbeddedProcess":{}}],"MilestoneAvailable":{"__type":"MilestoneSummary:http://www.kofax.com/agility/services/sdk","Identity":{"__type":"MilestoneIdentity:http://www.kofax.com/agility/services/sdk","Name":""},"Scope":0,"DisplayName":""},"MilestoneCompleted":{"__type":"MilestoneSummary:http://www.kofax.com/agility/services/sdk","Identity":{"__type":"MilestoneIdentity:http://www.kofax.com/agility/services/sdk","Name":""},"Scope":0,"DisplayName":""},"PendingMilestone":null,"DesignTimeSettingsXml":null,"States":[],"AvailableFireEvent":{"__type":"EventIdentity:http://www.kofax.com/agility/services/sdk","Name":null,"Scope":0,"DisplayName":null},"CompletedFireEvent":{"__type":"EventIdentity:http://www.kofax.com/agility/services/sdk","Name":null,"Scope":0,"DisplayName":null},"Status":0,"HelpText":null,"IsAfterStartNode":false,"PathId":0,"EmbeddedProcessCount":0,"EmbeddedName":"","BranchingRules":null,"IsLibraryItem":false,"LibraryItemName":"","ActivationProbability":100,"TitlePosition":0,"NodeDescription":"","TextPosition":0,"ShouldTrackVariableChanges":false,"Color":"#62A716","Height":30,"Width":30,"XPosition":45,"YPosition":360,"Allocate":false,"MobileFriendly":false,"RuntimeSettings":0,"StartNodeEventType":0,"EndNodeEventType":0,"Annotations":[],"Attachments":[],"SwimLane":{"__type":"SwimLaneIdentity:http://www.kofax.com/agility/services/sdk","Name":null,"Index":0,"PoolId":null,"Height":0},"CollaborationNodes":[],"GroupArtifacts":[],"ShouldEvaluateScoreWhenAvailable":false,"ShouldEvaluateScoreWhenCompleted":false,"PartialCompletion":false,"DesignTimeType":0,"NodeColorGroup":0,"InheritNodeGroupColorFromSystem":false,"ThreadPool":{"__type":"ThreadPoolIdentity:http://www.kofax.com/agility/services/sdk","Id":0,"Name":"Default Thread Pool"}}},"zIndex":0,"container":null,"visible":true,"horizontalAlignment":"Left","verticalAlignment":"Top","backgroundColor":"transparent","borderColor":"none","borderWidth":0,"rotateAngle":0,"pivot":{"x":0.5,"y":0.5},"margin":{},"flip":"None","wrapper":{"actualSize":{"width":30,"height":30},"offsetX":683.5,"offsetY":760},"isExpanded":true,"expandIcon":{"shape":"None"},"flipMode":"All","fixedUserHandles":[],"collapseIcon":{"shape":"None"},"inEdges":[],"outEdges":["node0-node1"],"parentId":"","processId":"","umlIndex":-1,"isPhase":false,"isLane":false}],"constraints":2048}';
        diagram.loadDiagram(data);
        diagram.doLayout();
        let isOverlap = checkOverlap(diagram);
        expect(isOverlap).toBe(false);
        done();
    });
});

describe('Code coverage line-distribution', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();

    beforeAll(() => {
        ele = createElement('div', { id: 'diagramLine' });
        document.body.appendChild(ele);

        let data: object[] = [
            { "Name": "node11", "fillColor": "#ff6329" },
            { "Name": "node12", "ReportingPerson": ["node114"], "fillColor": "#669be5" },
            { "Name": "node13", "ReportingPerson": ["node12"], "fillColor": "#30ab5c" },
            { "Name": "node14", "ReportingPerson": ["node12"], "fillColor": "#30ab5c" },
            { "Name": "node15", "ReportingPerson": ["node12"], "fillColor": "#30ab5c" },
            { "Name": "node16", "ReportingPerson": [], "fillColor": "#14ad85" },
            { "Name": "node17", "ReportingPerson": ["node13", "node14", "node15"], "fillColor": "#ff9400" },
            { "Name": "node18", "ReportingPerson": [], "fillColor": "#14ad85" },
            { "Name": "node19", "ReportingPerson": ["node16", "node17", "node18"], "fillColor": "#99bb55" },
            { "Name": "node110", "ReportingPerson": ["node16", "node17", "node18"], "fillColor": "#99bb55" },
            { "Name": "node111", "ReportingPerson": ["node16", "node17", "node18", "node116"], "fillColor": "#99bb55" },
            { "Name": "node21", "fillColor": "#ff6329" },
            { "Name": "node22", "ReportingPerson": ["node114"], "fillColor": "#669be5" },
            { "Name": "node23", "ReportingPerson": ["node22"], "fillColor": "#30ab5c" },
            { "Name": "node24", "ReportingPerson": ["node22"], "fillColor": "#30ab5c" },
            { "Name": "node25", "ReportingPerson": ["node22"], "fillColor": "#30ab5c" },
            { "Name": "node26", "ReportingPerson": [], "fillColor": "#14ad85" },
            { "Name": "node27", "ReportingPerson": ["node23", "node24", "node25"], "fillColor": "#ff9400" },
            { "Name": "node28", "ReportingPerson": [], "fillColor": "#14ad85" },
            { "Name": "node29", "ReportingPerson": ["node26", "node27", "node28", "node116"], "fillColor": "#99bb55" },
            { "Name": "node210", "ReportingPerson": ["node26", "node27", "node28"], "fillColor": "#99bb55" },
            { "Name": "node211", "ReportingPerson": ["node26", "node27", "node28"], "fillColor": "#99bb55" },
            { "Name": "node31", "fillColor": "#ff6329" },
            { "Name": "node114", "ReportingPerson": ["node11", "node21", "node31"], "fillColor": "#941100" },
            { "Name": "node116", "ReportingPerson": ["node12", "node22"], "fillColor": "#30ab5c" },
        ];

        let items: DataManager = new DataManager(data as JSON[], new Query().take(25));
        diagram = new Diagram({
            width: 900, height: 1000,
            layout: {
                type: 'ComplexHierarchicalTree',
                horizontalSpacing: 30,
                verticalSpacing: 30,
                connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
                enableRouting: true,
                orientation: 'BottomToTop'
            },
            dataSourceSettings: {
                id: 'Name', parentId: 'ReportingPerson', dataSource: items
            },
            getNodeDefaults: (obj: NodeModel, diagram: Diagram) => {
                obj.height = 40;
                obj.width = 40;
                obj.backgroundColor = 'lightgrey';
                obj.style = { fill: 'transparent', strokeWidth: 2 };
                return obj;
            },
            getConnectorDefaults: (connector: ConnectorModel, diagram: Diagram) => {
                connector.targetDecorator.shape = 'None';
                connector.type = 'Orthogonal';
                return connector;
            },
        });
        diagram.appendTo('#diagramLine');
    });

    afterAll(() => {
        // Comprehensive cleanup
        if (diagram) {
            diagram.destroy();
        }
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Changing layout at runtime from bottom to top orientation', (done: Function) => {
        diagram.layout.orientation = 'RightToLeft';
        diagram.dataBind();
        expect(diagram.layout.orientation === 'RightToLeft').toBe(true);
        done();
    });

    it('Changing enableRouting at runtime', (done: Function) => {
        diagram.layout.enableRouting = false;
        diagram.dataBind();
        expect(diagram.layout.orientation === 'RightToLeft' && diagram.layout.enableRouting === false).toBe(true);
        done();
    });

    it('Changing connection point origin at runtime', (done: Function) => {
        diagram.layout.connectionPointOrigin = ConnectionPointOrigin.SamePoint;
        diagram.dataBind();
        expect(diagram.layout.orientation === 'RightToLeft').toBe(true);
        done();
    });

    it('Checking tooltip render at runtime', (done: Function) => {
        let node = diagram.nodes[0];
        node.tooltip.content = 'node1';
        node.tooltip.openOn = 'Custom';
        diagram.showTooltip(node);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        expect(node.tooltip.content === 'node1').toBe(true);
        mouseEvents.mouseDownEvent(diagramCanvas, 100, 100);
        done();
    });

    it('Checking startTextEdit without zoom constraints', (done: Function) => {
        diagram.constraints = DiagramConstraints.Default | DiagramConstraints.ZoomTextEdit;
        diagram.dataBind();
        diagram.startTextEdit(diagram.nodes[0]);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.clickEvent(diagramCanvas, 100, 100);
        expect(diagram.nodes[0].annotations[0].content === '').toBe(true);
        done();
    });
});

describe('Code coverage hierarchical tree', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();

    interface EmployeeInfo {
        Name: string;
    }

    beforeAll(() => {
        ele = createElement('div', { id: 'diagramHierarchy' });
        document.body.appendChild(ele);

        let data = [
            {
                "Name": "Diagram",
                "fillColor": "#916DAF"
            },
            {
                "Name": "Layout",
                "Category": "Diagram"
            },
            {
                "Name": "Tree Layout",
                "Category": "Layout"
            },
            {
                "Name": "Organizational Chart",
                "Category": "Layout"
            },
            {
                "Name": "Hierarchical Tree",
                "Category": "Tree Layout"
            },
            {
                "Name": "Radial Tree",
                "Category": "Tree Layout"
            },
            {
                "Name": "Mind Map",
                "Category": "Hierarchical Tree"
            },
            {
                "Name": "Family Tree",
                "Category": "Hierarchical Tree"
            },
            {
                "Name": "Management",
                "Category": "Organizational Chart"
            },
            {
                "Name": "Human Resources",
                "Category": "Management"
            },
            {
                "Name": "University",
                "Category": "Management"
            },
            {
                "Name": "Business",
                "Category": "Management"
            }
        ];

        diagram = new Diagram({
            width: 1000, height: 1000, dataSourceSettings: {
                //sets the fields to bind
                id: 'Name', parentId: 'Category',
                dataSource: new DataManager(data),
            },
            getNodeDefaults: (obj: NodeModel) => {
                if ((obj.data as EmployeeInfo).Name === 'Diagram' || (obj.data as EmployeeInfo).Name === 'diagram') {
                    obj.isExpanded = false;
                }
            },
            layout: { type: 'HierarchicalTree', orientation: 'TopToBottom' },
        });
        diagram.appendTo('#diagramHierarchy');
    });

    afterAll(() => {
        // Comprehensive cleanup
        if (diagram) {
            diagram.destroy();
        }
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
        diagram = null;
        ele = null;
        mouseEvents = null;
    });

    it('Checking root node expanded', (done: Function) => {
        let isExpanded = diagram.nodes[0].isExpanded;
        expect(isExpanded === false).toBe(true);
        done();
    });
});

describe('Bug 908662- Connector segments are not proper when we change orientation', () => {
    let diagram: Diagram;
    let ele: HTMLElement;

    interface EmployeeInfo {
        Name: string;
    }

    beforeAll(() => {
        ele = createElement('div', { id: 'diagramHierarchy908662' });
        document.body.appendChild(ele);

        let data = [
            {
                "Name": "Diagram",
                "fillColor": "#916DAF"
            },
            {
                "Name": "Layout",
                "Category": "Diagram"
            },
            {
                "Name": "Tree Layout",
                "Category": "Layout"
            },
            {
                "Name": "Organizational Chart",
                "Category": "Layout"
            },
            {
                "Name": "Hierarchical Tree",
                "Category": "Tree Layout"
            },
            {
                "Name": "Radial Tree",
                "Category": "Tree Layout"
            },
            {
                "Name": "Mind Map",
                "Category": "Hierarchical Tree"
            },
            {
                "Name": "Family Tree",
                "Category": "Hierarchical Tree"
            },
            {
                "Name": "Management",
                "Category": "Organizational Chart"
            },
            {
                "Name": "Human Resources",
                "Category": "Management"
            },
            {
                "Name": "University",
                "Category": "Management"
            },
            {
                "Name": "Business",
                "Category": "Management"
            }
        ];

        //sets node default value
        function nodeDefaults(obj: NodeModel): NodeModel {
            obj.style = { fill: '#659be5', strokeColor: 'none', color: 'white', strokeWidth: 2 };
            obj.borderColor = '#3a6eb5';
            obj.backgroundColor = '#659be5';
            (obj.shape as TextModel).margin = { left: 5, right: 5, bottom: 5, top: 5 };
            obj.expandIcon = { height: 10, width: 10, shape: 'None', fill: 'lightgray', offset: { x: .5, y: 1 } };
            obj.expandIcon.verticalAlignment = 'Auto';
            obj.expandIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.offset = { x: .5, y: 1 };
            obj.collapseIcon.verticalAlignment = 'Auto';
            obj.collapseIcon.margin = { left: 0, right: 0, top: 0, bottom: 0 };
            obj.collapseIcon.height = 10;
            obj.collapseIcon.width = 10;
            obj.collapseIcon.padding.top = 5;
            obj.collapseIcon.shape = 'None';
            obj.collapseIcon.fill = 'lightgray';
            return obj;
        }

        //sets connector default value
        function connectorDefaults(connector: ConnectorModel): ConnectorModel {
            connector.targetDecorator.shape = 'None';
            connector.type = 'Orthogonal';
            connector.style.strokeColor = '#6d6d6d';
            connector.cornerRadius = 5;
            return connector;
        }

        diagram = new Diagram({
            width: '100%', height: '499px',
            //configures data source settings
            dataSourceSettings: {
                //sets the fields to bind
                id: 'Name', parentId: 'Category',
                dataSource: new DataManager(data),
                //binds the data with the nodes
                doBinding: (nodeModel: NodeModel, data: object) => {
                    nodeModel.shape = { type: 'Text', content: (data as EmployeeInfo).Name };
                }
            },
            //Configures automatic layout
            layout: {
                type: 'HierarchicalTree', verticalSpacing: 30, horizontalSpacing: 40,
                enableAnimation: true, connectionPointOrigin: ConnectionPointOrigin.DifferentPoint
            },
            //Defines the default node and connector properties
            getNodeDefaults: nodeDefaults,
            getConnectorDefaults: connectorDefaults
        });
        diagram.appendTo('#diagramHierarchy908662');
    });

    afterAll(() => {
        // Comprehensive cleanup
        if (diagram) {
            diagram.destroy();
        }
        if (ele && ele.parentNode) {
            ele.parentNode.removeChild(ele);
        }
        diagram = null;
        ele = null;
    });

    it('Changing orientation at runtime', (done: Function) => {
        diagram.layout.orientation = 'BottomToTop';
        diagram.dataBind();
        diagram.layout.orientation = 'RightToLeft';
        diagram.dataBind();
        diagram.layout.orientation = 'LeftToRight';
        diagram.dataBind();
        console.log(diagram.connectors[10].segments.length);
        expect(diagram.connectors[10].segments.length <= 3).toBe(true);
        done();
    });
});