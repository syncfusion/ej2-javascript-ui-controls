/**
 * Stack Panel test cases
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { StackPanel } from '../../../src/diagram/core/containers/stack-panel';
import { Thickness } from '../../../src/diagram/core/appearance';
import { DiagramModel, IElement } from '../../../src/diagram/index';
import { ClassifierShape, UmlClassifierShapeModel, NodeModel, UmlScope, ConnectorModel, AssociationFlow, Multiplicity, SymbolPalette, PaletteModel } from "../../../src/index";
import { MouseEvents } from '../interaction/mouseevents.spec';
import { profile, inMB, getMemoryProfile } from '../../../spec/common.spec';


describe('Diagram Control', () => {
    describe('Simple Stack Panel without children', () => {
        let diagram: Diagram;
        let ele: HTMLElement;
        beforeAll((): void => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            ele = createElement('div', { id: 'diagram35' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'nodeww1',
                offsetX: 100,
                offsetY: 100, style: {
                    fill: '#26A0DA',
                    strokeColor: 'green',
                }, borderColor: 'white'
                ,
                shape: {
                    type: 'UmlClassifier',
                    classShape: {
                        attributes: [
                            { type: 'Date', scope: 'Package', style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 } },
                            { name: 'sickness', type: 'History', scope: 'Private', isSeparator: true },
                            { name: 'prescription', type: 'String[*]', scope: 'Protected' },
                            { name: 'allergies', type: 'String[*]', scope: 'Public' }
                        ], methods: [
                            { scope: 'Package', isSeparator: true, style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' },
                            { name: 'getHistory', scope: 'Private', style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' },
                            { name: 'getHistory', scope: 'Protected', style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' },
                            { name: 'getHistory', scope: 'Public', style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' }
                        ],
                        name: 'Patient'
                    },
                    classifier: 'Class'
                } as UmlClassifierShapeModel,
            };

            let node21: NodeModel = {
                id: 'node1e',
                offsetX: 100,
                offsetY: 100, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white'
                ,
                shape: {
                    type: 'UmlClassifier',
                    classShape: {
                        attributes: [], methods: [{
                            name: 'getHistory',
                            style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History'
                        }],
                        name: 'Patient'
                    },
                    classifier: 'Class'
                } as UmlClassifierShapeModel,
            };
            let node2: NodeModel = {
                id: 'nodeee2',
                offsetX: 100,
                offsetY: 200, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white',
                shape: {
                    type: 'UmlClassifier',
                    enumerationShape: {
                        name: 'AccountType',
                        //sets the members of enumeration
                        members: [
                            {
                                isSeparator: true, style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 },
                            },
                            {
                                name: 'Savings Account'
                            },
                            {
                                name: 'Credit Account'
                            }]
                    },
                    classifier: 'Enumeration'
                } as UmlClassifierShapeModel,

            };
            let node4: NodeModel = {
                id: 'node2',
                offsetX: 100,
                offsetY: 200, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white',
                shape: {
                    type: 'UmlClassifier',
                    enumerationShape: {
                        name: 'AccountType',
                        //sets the members of enumeration
                        members: []
                    },
                    classifier: 'Enumeration'
                } as UmlClassifierShapeModel,

            };
            let node3: NodeModel = {
                id: 'node23',
                offsetX: 100,
                offsetY: 300, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white',
                shape: {
                    type: 'UmlClassifier',
                    interfaceShape: {
                        name: "Bank Account",
                        attributes: [{
                            name: "owner",
                            type: "String[*]", style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 }
                        },
                        {
                            name: "balance",
                            type: "Dollars"
                        }],
                        methods: [{
                            name: "deposit", style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 },
                            parameters: [{
                                name: "amount",
                                type: "Dollars",
                                style: { strokeColor: 'green',}
                            }],
                        }]
                    }
                }
            }
            let node5: NodeModel = {
                id: 'node33',
                offsetX: 100,
                offsetY: 300, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white',
                shape: {
                    type: 'UmlClassifier',
                    interfaceShape: {
                        name: "Bank Account",
                        attributes: [{
                            name: "owner",
                            type: "String[*]", style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 }
                        },
                        {
                            type: "Dollars"
                        }],
                        methods: [{
                            name: "deposit", style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 },
                            parameters: [{
                                name: "amount",
                                type: "Dollars",
                                style: { strokeColor: 'green',}
                            }],
                        }]
                    },
                    classifier: 'Interface'
                } as UmlClassifierShapeModel,
            };
            let connectors: ConnectorModel[] = [{
                id: 'connector1',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Composition' }
            }, {
                id: 'connecto2',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Aggregation', associationType: 'BiDirectional' }
            }, {
                id: 'connector3',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Association', associationType: 'Directional' }
            }, {
                id: 'connector4',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Association' }
            }, {
                id: 'connector5',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Inheritance' }
            }, {
                id: 'connector6',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Interface' }
            }, {
                id: 'connecto211q',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Dependency' }
            }, {
                id: 'connector7',
                sourcePoint: { x: 100, y: 700 },
                targetPoint: { x: 200, y: 800 },
                shape: { type: 'UmlClassifier', relationship: 'Realization' }
            }, {
                id: "connectww1",
                sourcePoint: {
                    x: 100,
                    y: 200
                },
                targetPoint:
                {
                    x: 300
                    , y: 200
                },
                annotations: [{
                    margin: {
                        top: 10,
                        left: 10,
                        right: 10,
                        bottom: 20
                    }
                }
                ],
                shape: {
                    type: "UmlClassifier",
                    relationship: 'Dependency',
                    //  Sets the type of multiplicity
                    multiplicity: {
                        //Sets the type of multiplicity
                        type: 'OneToMany',
                        //Sets the source label
                        source: {
                            //Sets the optionality/cardinality for the connector
                            optional: true,
                            //Specifies interval for number of instances of described element
                            lowerBounds: 89,
                            upperBounds: 67
                        },
                        //Sets the target label
                        target: { optional: true, lowerBounds: 78, upperBounds: 90 }
                    }
                }
            }, {
                id: "connectww11",
                sourcePoint: {
                    x: 100,
                    y: 200
                },
                targetPoint:
                {
                    x: 300
                    , y: 200
                },
                annotations: [{
                    margin: {
                        top: 10,
                        left: 10,
                        right: 10,
                        bottom: 20
                    }
                }
                ],

                shape: {
                    type: "UmlClassifier",
                    relationship: 'Dependency',
                    //  Sets the type of multiplicity
                    multiplicity: {
                        //Sets the type of multiplicity
                        type: 'ManyToMany',
                        //Sets the source label
                        source: {
                            //Sets the optionality/cardinality for the connector
                            optional: true,
                            //Specifies interval for number of instances of described element
                            lowerBounds: 89,
                            upperBounds: 67
                        },
                        //Sets the target label
                        target: { optional: true, lowerBounds: 78, upperBounds: 90 }
                    }
                }
            }, {
                id: "connectww1q",
                sourcePoint: {
                    x: 100,
                    y: 200
                },
                targetPoint:
                {
                    x: 300
                    , y: 200
                },
                annotations: [{
                    margin: {
                        top: 10,
                        left: 10,
                        right: 10,
                        bottom: 20
                    }
                }
                ],

                shape: {
                    type: "UmlClassifier",
                    relationship: 'Dependency',
                    //  Sets the type of multiplicity
                    multiplicity: {
                        //Sets the type of multiplicity
                        type: 'OneToOne',
                        //Sets the source label
                        source: {
                            //Sets the optionality/cardinality for the connector
                            optional: true,
                            //Specifies interval for number of instances of described element
                            lowerBounds: 89,
                            upperBounds: 67
                        },
                        //Sets the target label
                        target: { optional: true, lowerBounds: 78, upperBounds: 90 }
                    }
                }
            }, {
                id: "connectww1ss",
                sourcePoint: {
                    x: 100,
                    y: 200
                },
                targetPoint:
                {
                    x: 300
                    , y: 200
                },
                annotations: [{
                    margin: {
                        top: 10,
                        left: 10,
                        right: 10,
                        bottom: 20
                    }
                }
                ],

                shape: {
                    type: "UmlClassifier",
                    relationship: 'Dependency',
                    //  Sets the type of multiplicity
                    multiplicity: {
                        //Sets the type of multiplicity
                        type: 'ManyToOne',
                        //Sets the source label
                        source: {
                            //Sets the optionality/cardinality for the connector
                            optional: true,
                            //Specifies interval for number of instances of described element
                            lowerBounds: 89,
                            upperBounds: 67
                        },
                        //Sets the target label
                        target: { optional: true, lowerBounds: 78, upperBounds: 90 }
                    }
                }
            }, {
                id: "connectww1",
                sourcePoint: {
                    x: 100,
                    y: 200
                },
                targetPoint:
                {
                    x: 300
                    , y: 200
                },
                annotations: [{
                    margin: {
                        top: 10,
                        left: 10,
                        right: 10,
                        bottom: 20
                    }
                }
                ],

                shape: {
                    type: "UmlClassifier",
                    relationship: 'Dependency',
                    //  Sets the type of multiplicity
                    multiplicity: {
                        //Sets the type of multiplicity
                        type: 'OneToMany',
                        //Sets the source label
                    }
                }
            }]
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node1, node2, node3, node21, node4, node5], connectors: connectors } as DiagramModel);
            diagram.appendTo('#diagram35');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking stack panel without children', (done: Function) => {

            expect(diagram.nodes.length > 1).toBe(true);
            done();
        });
    });

    describe('Simple Stack Panel without children', () => {
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

            ele = createElement('div', { id: 'diagram35' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'nodeww1',
                offsetX: 300, maxWidth: 250,
                offsetY: 300, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white'
                ,
                shape: {
                    type: 'UmlClassifier',
                    classShape: {
                        attributes: [
                            {
                                type: 'Date', scope: 'Package',
                                style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 }
                            },
                            { name: 'sickness', type: 'History', scope: 'Private', isSeparator: true },
                            { name: 'prescription', type: 'String[*]', scope: 'Protected' },
                            { name: 'allergies', type: 'String[*]', scope: 'Public' }
                        ], methods: [
                            { scope: 'Package', isSeparator: true, style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' },
                        ],
                        name: 'Patient'
                    },
                    classifier: 'Class'
                } as UmlClassifierShapeModel,
            };

            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node1] } as DiagramModel);
            diagram.appendTo('#diagram35');
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking stack panel addition of inner node', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 310, 310);
            diagram.remove();
            diagram.undo();
            diagram.redo();
            expect(diagram.nodes.length > 1).toBe(true);
            done();
        });
    });
    describe('Simple Stack Panel interaction', () => {
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

            ele = createElement('div', { id: 'diagram35' });
            document.body.appendChild(ele);
            let node1: NodeModel = {
                id: 'nodeww1',
                offsetX: 300,
                offsetY: 300, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white'
                ,
                shape: {
                    type: 'UmlClassifier',
                    classShape: {
                        attributes: [
                            {
                                type: 'Date', scope: 'Package',
                                style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 }
                            },
                            { name: 'sickness', type: 'History', scope: 'Private', isSeparator: true },
                            { name: 'prescription', type: 'String[*]', scope: 'Protected' },
                            { name: 'allergies', type: 'String[*]', scope: 'Public' }
                        ], methods: [
                            { scope: 'Package', isSeparator: true, style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' },
                        ],
                        name: 'Patient'
                    },
                    classifier: 'Class'
                } as UmlClassifierShapeModel,
            };
            let node2: NodeModel = {
                id: 'nodeww1ddd',
                offsetX: 500,
                offsetY: 500, style: {
                    fill: '#26A0DA',
                }, borderColor: 'white'
                ,
                shape: {
                    type: 'UmlClassifier',
                    classShape: {
                        attributes: [
                            {
                                type: 'Date', scope: 'Package',
                                style: { fill: "black", fontSize: 11, strokeColor: 'green', strokeWidth: 4 }
                            },
                            { name: 'sickness', type: 'History', scope: 'Private', isSeparator: true },
                            { name: 'prescription', type: 'String[*]', scope: 'Protected' },
                            { name: 'allergies', type: 'String[*]', scope: 'Public' }
                        ], methods: [
                            { scope: 'Package', isSeparator: true, style: { strokeColor: 'green',}, parameters: [{ name: 'Date', style: { strokeColor: 'green',} }], type: 'History' },
                        ],
                        name: 'Patient'
                    },
                    classifier: 'Class'
                } as UmlClassifierShapeModel,
            };
            let connector: ConnectorModel = {
                id: 'conn1',
                sourceID: 'nodeww1ddd',
                targetID: 'nodeww1'
            }
            diagram = new Diagram({ width: '500px', height: '500px', nodes: [node1, node2], connectors: [connector] } as DiagramModel);
            diagram.appendTo('#diagram35');
            let node:NodeModel = {
                id: "umlRumNode",
                //Position of the node
                offsetX: 200,
                offsetY: 200,
                shape: {
                    type: "UmlClassifier",
                    //Define class object
                    classShape: {
                        name: "Patient",
                        //Define class attributes
                        attributes: [{ name: "accepted", type: "Date" }],
                    },
                    classifier: "Class"
                }
            } as NodeModel;
            diagram.add(node);
        });
        afterAll((): void => {
            diagram.destroy();
            ele.remove();
        });

        it('Checking stack panel addition of inner node', (done: Function) => {
            let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
            mouseEvents.clickEvent(diagramCanvas, 310, 220);
            var bound = diagram.nodes[0].wrapper.bounds.middleRight;
            mouseEvents.mouseMoveEvent(diagramCanvas, bound.x + 10, bound.y);
            mouseEvents.clickEvent(diagramCanvas, bound.x + 10, bound.y);
            (document.getElementById('diagram35_editBox') as any).value = 'ffffdddddddddddddddddfffffffffffffffffffffffffffffffffffffff'
            mouseEvents.clickEvent(diagramCanvas, 390, 700);
            expect(diagram.nodes[0].wrapper.actualSize.width > 200).toBe(true);
            diagram.undo();
            expect(diagram.nodes[0].wrapper.actualSize.width < 200).toBe(true);
            expect(diagram.nodes.length > 1).toBe(true);
            done();
        });
        it('add uml class at runtime', (done: Function) => {
            expect(diagram.nameTable['umlRumNode'].offsetX===200).toBe(true);
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
});
describe('887625: UML class nodes cloned in diagram canvas while dragging nodes outside diagram page', () => {
    let diagram: Diagram;
    let palette: SymbolPalette;
    let ele: HTMLElement;
    beforeAll((): void => {
        ele = createElement('div', { styles: 'width:100%;height:500px;' });
        ele.appendChild(createElement('div', { id: 'symbolpaletteUml', styles: 'width:25%;float:left;' }));
        ele.appendChild(createElement('div', { id: 'diagramUML', styles: 'width:74%;height:500px;float:left;' }));
        document.body.appendChild(ele);

        let palettes: PaletteModel[] = [
            {
                id: 'UmlActivity', expanded: true, title: 'UML Classifier Nodes', symbols: [
                    {
                        id: 'class',
                        style: {
                            fill: '#26A0DA',
                        },
                        borderColor: 'white',
                        shape: {
                            type: 'UmlClassifier',
                            classShape: {
                                attributes: [
                                    { name: 'accepted', type: 'Date', style: { color: "red", fontFamily: "Arial", textDecoration: 'Underline', italic: true }, isSeparator: true },
                                    { name: 'sickness', type: 'History' },
                                    { name: 'prescription', type: 'String[*]' },
                                    { name: 'allergies', type: 'String[*]' }
                                ],
                                methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
                                name: 'Patient'
                            },
                            classifier: 'Class'
                        },
                    },
                    {
                        id: 'InterfaceNode',
                        style: {
                            fill: '#26A0DA',
                        }, borderColor: 'white',
                        shape: {
                            type: 'UmlClassifier',
                            interfaceShape: {
                                name: "Bank Account",
                                attributes: [{
                                    name: "owner",
                                    type: "String[*]", style: {}
                                },
                                {
                                    name: "balance",
                                    type: "Dollars"
                                }],
                                methods: [{
                                    name: "deposit", style: {},
                                    parameters: [{
                                        name: "amount",
                                        type: "Dollars",
                                        style: {}
                                    }],
                                }]
                            },
                            classifier: 'Interface'
                        },
                    },
                    {
                        id: 'Enumeration',
                        style: {
                            fill: '#26A0DA',
                        }, borderColor: 'white',
                        shape: {
                            type: 'UmlClassifier',
                            enumerationShape: {
                                name: 'AccountType',
                                members: [
                                    {
                                        name: 'Checking Account', style: {}
                                    },
                                    {
                                        name: 'Savings Account'
                                    },
                                    {
                                        name: 'Credit Account'
                                    }
                                ]
                            },
                            classifier: 'Enumeration'
                        },
                    },
                ]
            },
            {
                id: 'umlConnectorrs', expanded: true, title: 'UML Classifier Connectors', symbols: [
                    {
                        id: 'Composition',
                        sourcePoint: { x: 100, y: 200 },
                        targetPoint: { x: 200, y: 300 },
                        type: 'Straight',
                        shape: { type: 'UmlClassifier', relationship: 'Composition' }
                    },
                    {
                        id: 'BiDirectional',
                        type: 'Straight',
                        sourcePoint: { x: 300, y: 200 },
                        targetPoint: { x: 400, y: 300 },
                        shape: { type: 'UmlClassifier', relationship: 'Aggregation', associationType: 'BiDirectional' }
                    },
                    {
                        id: 'Directional',
                        type: 'Straight',
                        sourcePoint: { x: 500, y: 200 },
                        targetPoint: { x: 600, y: 300 },
                        shape: { type: 'UmlClassifier', relationship: 'Association', associationType: 'Directional' }
                    },
                    {
                        id: 'Association',
                        type: 'Straight',
                        sourcePoint: { x: 700, y: 200 },
                        targetPoint: { x: 800, y: 300 },
                        shape: { type: 'UmlClassifier', relationship: 'Association' }
                    },
                    {
                        id: 'Inheritance',
                        type: 'Straight',
                        sourcePoint: { x: 900, y: 200 },
                        targetPoint: { x: 1000, y: 300 },
                        shape: { type: 'UmlClassifier', relationship: 'Inheritance' }
                    },
                    {
                        id: 'Interfaces',
                        type: 'Straight',
                        sourcePoint: { x: 100, y: 400 },
                        targetPoint: { x: 200, y: 500 },
                        shape: { type: 'UmlClassifier', relationship: 'Interface' }
                    },
                    {
                        id: 'Dependency',
                        type: 'Straight',
                        sourcePoint: { x: 300, y: 400 },
                        targetPoint: { x: 400, y: 500 },
                        shape: { type: 'UmlClassifier', relationship: 'Dependency' }
                    },
                    {
                        id: 'Realization',
                        type: 'Straight',
                        sourcePoint: { x: 500, y: 400 },
                        targetPoint: { x: 600, y: 500 },
                        shape: { type: 'UmlClassifier', relationship: 'Realization' }
                    },
                    {
                        id: "OneToMany",
                        type: 'Straight',
                        sourcePoint: {
                            x: 700,
                            y: 400
                        },
                        targetPoint: {
                            x: 800,
                            y: 500
                        },
                        annotations: [{
                            margin: {
                                top: 10,
                                left: 10,
                                right: 10,
                                bottom: 20
                            }
                        }
                        ],
                        shape: {
                            type: "UmlClassifier",
                            relationship: 'Dependency',
                            multiplicity: {
                                type: 'OneToMany',
                                source: {
                                    optional: true,
                                    lowerBounds: '89',
                                    upperBounds: '67'
                                },
                                target: { optional: true, lowerBounds: '78', upperBounds: '90' }
                            }
                        }
                    },
                    {
                        id: "ManyToMany",
                        sourcePoint: {
                            x: 900,
                            y: 400
                        },
                        targetPoint: {
                            x: 1000,
                            y: 500
                        },
                        annotations: [{
                            margin: {
                                top: 10,
                                left: 10,
                                right: 10,
                                bottom: 20
                            }
                        }
                        ],
                        shape: {
                            type: "UmlClassifier",
                            relationship: 'Dependency',
                            multiplicity: {
                                type: 'ManyToMany',
                                source: {
                                    optional: true,
                                    lowerBounds: '89',
                                    upperBounds: '67'
                                },
                                target: { optional: true, lowerBounds: '78', upperBounds: '90' }
                            }
                        }
                    },
                    {
                        id: "OneToOne",
                        sourcePoint: { x: 100, y: 600 },
                        targetPoint: { x: 200, y: 700 },
                        annotations: [{
                            margin: {
                                top: 10,
                                left: 10,
                                right: 10,
                                bottom: 20
                            }
                        }
                        ],
                        shape: {
                            type: "UmlClassifier",
                            relationship: 'Dependency',
                            multiplicity: {
                                type: 'OneToOne',
                                source: {
                                    optional: true,
                                    lowerBounds: '89',
                                    upperBounds: '67'
                                },
                                target: { optional: true, lowerBounds: '78', upperBounds: '90' }
                            }
                        }
                    },
                    {
                        id: "ManyToOne",
                        sourcePoint: { x: 300, y: 600 },
                        targetPoint: { x: 400, y: 700 },
                        annotations: [{
                            margin: {
                                top: 10,
                                left: 10,
                                right: 10,
                                bottom: 20
                            }
                        }
                        ],
                        shape: {
                            type: "UmlClassifier",
                            relationship: 'Dependency',
                            multiplicity: {
                                type: 'ManyToOne',
                                source: {
                                    optional: true,
                                    lowerBounds: '89',
                                    upperBounds: '67'
                                },
                                target: { optional: true, lowerBounds: '78', upperBounds: '90' }
                            }
                        }
                    },
                    {
                        id: "OneToMany",
                        sourcePoint: { x: 500, y: 600 },
                        targetPoint: { x: 600, y: 700 },
                        annotations: [{
                            margin: {
                                top: 10,
                                left: 10,
                                right: 10,
                                bottom: 20
                            }
                        }
                        ],
                        shape: {
                            type: "UmlClassifier",
                            relationship: 'Dependency',
                            multiplicity: {
                                type: 'OneToMany',
                            }
                        }
                    }
                ]
            }
        ];

        diagram = new Diagram({
            width: '70%', height: 1000,
        });
        diagram.appendTo('#diagramUML');
        function setPaletteNodeDefaults(node: any) {
            node.width = 100;
            node.height = 100;
        }
        palette = new SymbolPalette({
            width: '25%', height: '100%',
            palettes: palettes, enableSearch: true, enableAnimation: false,
            expandMode: "Multiple",
            getNodeDefaults: setPaletteNodeDefaults,
            symbolMargin: { left: 12, right: 12, top: 12, bottom: 12 },
            symbolHeight: 90, symbolWidth: 90,

        });
        palette.appendTo('#symbolpaletteUml');
    });
    afterAll((): void => {
        diagram.destroy();
        palette.destroy();
        ele.remove();
    });
    it('Checking UML shapes', (done: Function) => {
        palette.expandMode = 'Multiple';
        palette.dataBind();
        expect(diagram.nodes.length).toBe(0);
        done();
    });
    it('Checking UML CLass shapes dragging', (done: Function) => {
        palette.element['ej2_instances'][1]['helper'] = (e: { target: HTMLElement, sender: PointerEvent | TouchEvent }) => {
            let clonedElement: HTMLElement;
            let symbols: IElement = palette.symbolTable['class'];
            palette['selectedSymbols'] = symbols;
            if (symbols !== undefined) {
                clonedElement = palette['getSymbolPreview'](symbols, e.sender, palette.element);
                clonedElement.setAttribute('paletteId', palette.element.id);
            }
            return clonedElement;
        };
        let events: MouseEvents = new MouseEvents();
        let symbol = document.getElementById('class_container');
        let diagramCanvas = document.getElementById(diagram.element.id + 'content');
        let bounds: any = symbol.getBoundingClientRect();
        events.mouseDownEvent(palette.element, 100, 200, false, false);
        events.mouseUpEvent(palette.element, 100, 200, false, false);
        events.mouseDownEvent(palette.element, 100, 200, false, false);
        events.mouseMoveEvent(palette.element, 100 + 1, 200 + 1, false, false);
        events.mouseMoveEvent(palette.element, 100 + 1, 200 + 1, false, false);
        events.mouseMoveEvent(palette.element, 100 + 5, 200 + 5, false, false);
        events.mouseMoveEvent(diagramCanvas, 200, 200, false, false);
        events.mouseUpEvent(diagramCanvas, 200, 200, false, false);
        expect(diagram.nodes.length).toBe(10);
        console.log("UML CLass 1" + diagram.nodes.length)
        diagram.selectAll();
        events.mouseDownEvent(diagramCanvas, 200, 200, false, false);
        events.mouseMoveEvent(diagramCanvas, 200, 200, false, false);
        events.mouseMoveEvent(diagramCanvas, 100, 200, false, false);
        events.mouseMoveEvent(diagramCanvas, 10, 200, false, false);
        events.mouseLeaveEvent(diagramCanvas);
        expect(diagram.nodes.length).toBe(10);
        console.log("UML CLass 2" + diagram.nodes.length)

        done();
    });
});