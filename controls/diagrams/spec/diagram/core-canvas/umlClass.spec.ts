/**
 * Stack Panel test cases
 */

import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { ImageElement } from '../../../src/diagram/core/elements/image-element';
import { StackPanel } from '../../../src/diagram/core/containers/stack-panel';
import { Thickness } from '../../../src/diagram/core/appearance';
import { DiagramModel } from '../../../src/diagram/index';
import { ClassifierShape, UmlClassifierShapeModel, NodeModel, UmlScope, ConnectorModel, AssociationFlow, Multiplicity } from "../../../src/index";
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
                            { scope: 'Package', isSeparator: true, style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' },
                            { name: 'getHistory', scope: 'Private', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' },
                            { name: 'getHistory', scope: 'Protected', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' },
                            { name: 'getHistory', scope: 'Public', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }
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
                            style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History'
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
                                style: {}
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
                                style: {}
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
                            { scope: 'Package', isSeparator: true, style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' },
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
                            { scope: 'Package', isSeparator: true, style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' },
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
                            { scope: 'Package', isSeparator: true, style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' },
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