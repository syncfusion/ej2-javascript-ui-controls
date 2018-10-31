/**
 * Simple ruler
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../src/diagram/diagram';
import { Ruler, TickAlignment } from '../../src/ruler/index';
import { MouseEvents } from '../diagram/interaction/mouseevents.spec';
import { IArrangeTickOptions } from '../../src/ruler/objects/interface/interfaces';


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
            expect(rulerObj !== undefined && rulerObj.offsetLeft === 8 && rulerObj.offsetTop === 8).toBe(true);
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
            expect(rulerObj !== undefined && rulerObj.offsetLeft === 8 && rulerObj.offsetTop === 8).toBe(true);
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
            expect(rulerObj !== undefined && rulerObj.offsetLeft === 8 && rulerObj.offsetTop === 8).toBe(true);
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
    });
});
