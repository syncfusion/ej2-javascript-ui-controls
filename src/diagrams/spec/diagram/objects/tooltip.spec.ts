import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { NodeModel } from '../../../src/diagram/objects/node-model';
import { Node } from '../../../src/diagram/objects/node';
import { Container } from '../../../src/diagram/core/containers/container';
import { DiagramElement } from '../../../src/diagram/core/elements/diagram-element';
import { DiagramConstraints } from '../../../src/diagram/enum/enum';
import { MouseEvents } from '../interaction/mouseevents.spec';
import { NodeConstraints, ConnectorModel, ConnectorConstraints } from '../../../src/diagram/index';
import { Position } from '@syncfusion/ej2-popups';

/**
 * Tooltip test cases
 */

describe('Tool Tip object', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram_tooltip_1' });
        document.body.appendChild(ele);

        let node1: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
            tooltip: {
                content: 'a',
                position: 'TopCenter',
                relativeMode: 'Object'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
            tooltip: {
                content: 'b',
                position: 'TopRight',
                relativeMode: 'Object'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100,
            tooltip: {
                content: 'c',
                position: 'LeftCenter',
                relativeMode: 'Object'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node5: NodeModel = {
            id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
            tooltip: {
                content: 'd',
                position: 'RightCenter',
                relativeMode: 'Object'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node6: NodeModel = {
            id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
            tooltip: {
                content: 'e',
                position: 'BottomLeft',
                relativeMode: 'Object'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node7: NodeModel = {
            id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
            tooltip: {
                content: 'f',
                position: 'BottomCenter'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node8: NodeModel = {
            id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
            tooltip: {
                content: 'g',
                position: 'BottomRight'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node9: NodeModel = {
            id: 'node9', width: 100, height: 100, offsetX: 100, offsetY: 500,
            tooltip: {
                content: 'h',
                position: 'LeftTop'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node10: NodeModel = {
            id: 'node10', width: 100, height: 100, offsetX: 300, offsetY: 500,
            tooltip: {
                content: 'i',
                position: 'LeftBottom'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node11: NodeModel = {
            id: 'node11', width: 100, height: 100, offsetX: 500, offsetY: 500,
            tooltip: {
                content: 'j',
                position: 'RightTop'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node12: NodeModel = {
            id: 'node12', width: 100, height: 100, offsetX: 700, offsetY: 500,
            tooltip: {
                content: 'k',
                position: 'RightBottom'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node13: NodeModel = {
            id: 'node13', width: 100, height: 100, offsetX: 100, offsetY: 700,
            constraints: NodeConstraints.Default & ~NodeConstraints.InheritTooltip,
        };
        let node14: NodeModel = {
            id: 'node14', width: 100, height: 100, offsetX: 300, offsetY: 700,
            tooltip: {
                content: 'l',
                position: 'RightTop'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node15: NodeModel = {
            id: 'node15', width: 100, height: 100, offsetX: 400, offsetY: 700,
            tooltip: {
                content: 'p',
                position: 'RightBottom'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let connectors: ConnectorModel[] = [{
            id: 'connector1',
            type: 'Straight',
            sourcePoint: { x: 220, y: 100 },
            targetPoint: { x: 220, y: 200 },
            tooltip: {
                content: 'm', position: 'BottomRight', relativeMode: 'Object',
                animation: { open: { effect: 'None', delay: 0 }, close: { effect: 'None', delay: 0 } },
            },
            constraints: ConnectorConstraints.Default | ConnectorConstraints.Tooltip,
        },
        {
            id: 'connector2',
            type: 'Straight',
            sourcePoint: { x: 420, y: 100 },
            targetPoint: { x: 420, y: 200 },
            constraints: ConnectorConstraints.Default & ~ConnectorConstraints.InheritTooltip,
        },
        {
            id: 'connector3',
            type: 'Straight',
            sourcePoint: { x: 620, y: 100 },
            targetPoint: { x: 620, y: 200 },
            tooltip: {
                content: 'n', position: 'BottomRight', relativeMode: 'Object',
                animation: { open: { effect: 'None', delay: 0 }, close: { effect: 'None', delay: 0 } },
            }
        }];
        diagram = new Diagram({
            width: '1200px', height: '1000px',
            nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12, node13, node14, node15],
            connectors: connectors,
            tooltip: {
                content: 'o', position: 'TopLeft', height: 'auto', width: 'auto',
                showTipPointer: true, relativeMode: 'Object',
                animation: {
                    open: {
                        effect: 'None',
                    },
                    close: {
                        effect: 'None'
                    }
                }
            },
            constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip
        });
        diagram.appendTo('#diagram_tooltip_1');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });


    it('checking tooltip with relative mode Object positions - Top Left', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node1');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.top > bounds.bottom).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip with relative mode Object positions - Top Center', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node2');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.top > bounds.bottom).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Top Right', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node3');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.top > bounds.bottom).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Left Center', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node4');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.left > bounds.right).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Right Center', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node5');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.right < (bounds.left)).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Bottom Left', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node6');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.bottom < bounds.top).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Bottom Center', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node7');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.bottom < bounds.top).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Bottom Right', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node8');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.bottom < bounds.top).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Left Top', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node9');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.left > bounds.right).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions -  Left Bottom', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node10');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.left > bounds.right).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Right Top', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node11');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.right < bounds.left).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Object positions - Right Bottom', (done: Function) => {
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        let node: HTMLElement = document.getElementById('node12');
        let bounds1: ClientRect = node.getBoundingClientRect();
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds1.right > bounds.left || bounds1.bottom > bounds.top).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip without Constraints for connector', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 420, 150, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip without Constraints for Node', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 700, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip when mouse moved inside the node', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 725, 525, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                setTimeout(() => {
                    mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                    setTimeout(() => {
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip for connectors', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 220, 150, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip Inherit Tooltip Constraints for connector ', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 620, 150, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 3);
        }, 1);
    });
    it('checking tooltip when mouse moved between two nodes', (done: Function) => {
        let tooltipElement: HTMLElement;
        let bounds: ClientRect;
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 700, false, false);
        setTimeout(() => {
            tooltipElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            bounds = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 400, 700, false, false);
            setTimeout(() => {
                tooltipElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
                bounds = tooltipElement.getBoundingClientRect();
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                setTimeout(() => {
                    mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                    setTimeout(() => {
                        done();
                    }, 1);
                }, 3);
            }, 1);
        }, 1);
    });
});

describe('Tool Tip mouse', () => {
    let diagram: Diagram;
    let ele: HTMLElement;
    let mouseEvents: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: 'diagram_tooltip_2' });
        document.body.appendChild(ele);

        let node1: NodeModel = {
            id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
        };
        let node2: NodeModel = {
            id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
            tooltip: {
                content: 'node2',
                position: 'TopCenter',
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node3: NodeModel = {
            id: 'node3', width: 100, height: 100, offsetX: 500, offsetY: 100,
            tooltip: {
                content: 'node3',
                position: 'TopRight',
                relativeMode: 'Mouse'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node4: NodeModel = {
            id: 'node4', width: 100, height: 100, offsetX: 700, offsetY: 100,
            tooltip: {
                content: 'node4',
                position: 'LeftCenter',
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node5: NodeModel = {
            id: 'node5', width: 100, height: 100, offsetX: 100, offsetY: 300,
            tooltip: {
                content: 'node5',
                position: 'RightCenter',
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node6: NodeModel = {
            id: 'node6', width: 100, height: 100, offsetX: 300, offsetY: 300,
            tooltip: {
                content: 'node6',
                position: 'BottomLeft',
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node7: NodeModel = {
            id: 'node7', width: 100, height: 100, offsetX: 500, offsetY: 300,
            tooltip: {
                content: 'node7',
                position: 'BottomCenter'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node8: NodeModel = {
            id: 'node8', width: 100, height: 100, offsetX: 700, offsetY: 300,
            tooltip: {
                content: 'node8',
                position: 'BottomRight'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node9: NodeModel = {
            id: 'node9', width: 100, height: 100, offsetX: 100, offsetY: 500,
            tooltip: {
                content: 'node9',
                position: 'LeftTop'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node10: NodeModel = {
            id: 'node10', width: 100, height: 100, offsetX: 300, offsetY: 500,
            tooltip: {
                content: 'node10',
                position: 'LeftBottom'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node11: NodeModel = {
            id: 'node11', width: 100, height: 100, offsetX: 500, offsetY: 500,
            tooltip: {
                content: 'node11',
                position: 'RightTop'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        let node12: NodeModel = {
            id: 'node12', width: 100, height: 100, offsetX: 700, offsetY: 500,
            tooltip: {
                content: 'node12',
                position: 'RightBottom'
            },
            constraints: NodeConstraints.Default | NodeConstraints.Tooltip,
        };
        diagram = new Diagram({
            width: '1000px', height: '1000px',
            nodes: [node1, node2, node3, node4, node5, node6, node7, node8, node9, node10, node11, node12],
            tooltip: {
                content: 'diagram', position: 'TopLeft', height: 'auto', width: 'auto',
                showTipPointer: true, relativeMode: 'Mouse',
                animation: {
                    open: {
                        effect: 'None',
                    },
                    close: {
                        effect: 'None'
                    }
                }
            },
            constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip
        });
        diagram.appendTo('#diagram_tooltip_2');
    });

    afterAll((): void => {
        diagram.destroy();
        ele.remove();
    });

    it('checking tooltip with relative mode Mouse positions - Top Left', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 100, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip with relative mode Mouse positions - Top Center', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 68 && bounds.left === 277.5 || bounds.left === 278).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Top Right', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 68 && bounds.left === 488).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Left Center', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 100, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 88 && bounds.left === 647 || bounds.left === 648).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Right Center', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 288 && bounds.left === 108).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Bottom Left', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 308 && bounds.left === 267 || bounds.left === 268).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Bottom Center', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 308 && bounds.left === 477.5 || bounds.left === 478).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Bottom Right', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 300, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 308 && bounds.left === 688).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Left Top', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 100, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 488 && bounds.left === 47 || bounds.left === 48).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions -  Left Bottom', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 300, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            // expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
            //     bounds.top === 488 && bounds.left === 241).toBe(true);
            //  expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                // expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Right Top', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 500, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 488 && bounds.left === 508).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });
    it('checking tooltip with relative mode Mouse positions - Right Bottom', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            let tooltipElement: HTMLElement = document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open')[0] as HTMLElement;
            let bounds: ClientRect = tooltipElement.getBoundingClientRect();
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0 &&
                bounds.top === 488 && bounds.left === 708).toBe(true);
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                setTimeout(() => {
                    done();
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip changing the relative mode to object on runtime', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                diagram.tooltip.relativeMode = 'Object';
                diagram.dataBind();
                mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                    setTimeout(() => {
                        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip changing the content of the tooltip on runtime', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                (diagram.nodes[11] as Node).tooltip.content = 'node';
                diagram.dataBind();
                mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                    setTimeout(() => {
                        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip changing the position on runtime', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                (diagram.nodes[11] as Node).tooltip.position = 'LeftTop';
                diagram.dataBind();
                mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                    setTimeout(() => {
                        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip changing the height on runtime', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                (diagram.nodes[11] as Node).tooltip.height = 20;
                diagram.dataBind();
                mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                    setTimeout(() => {
                        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip changing the width on runtime', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                (diagram.nodes[11] as Node).tooltip.width = '50';
                diagram.dataBind();
                mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                    setTimeout(() => {
                        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });

    it('checking tooltip appearance the tooltip pointer on runtime', (done: Function) => {
        let diagramCanvas: HTMLElement = document.getElementById(diagram.element.id + 'content');
        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
        expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
        mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
        setTimeout(() => {
            expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
            mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length === 0).toBe(true);
                (diagram.nodes[11] as Node).tooltip.showTipPointer = false;
                diagram.dataBind();
                mouseEvents.mouseMoveEvent(diagramCanvas, 700, 500, false, false);
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-tooltip-wrap e-popup e-control e-popup-open').length !== 0).toBe(true);
                    setTimeout(() => {
                        mouseEvents.mouseMoveEvent(diagramCanvas, 10, 10, false, false);
                        done();
                    }, 1);
                }, 1);
            }, 1);
        }, 1);
    });
});